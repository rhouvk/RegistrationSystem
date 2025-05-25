<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Establishment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BusinessPharmacyController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');
        $roleFilter = $request->input('role');

        $query = User::with('establishment')
            ->whereIn('role', [2, 3]) // 2 for Business, 3 for Pharmacy
            ->where(function($q) {
                $q->whereNull('is_validated')
                  ->orWhere('is_validated', '!=', 3);
            });

        if ($roleFilter) {
            $query->where('role', $roleFilter);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('establishment', function ($q2) use ($search) {
                        $q2->where('representative_name', 'like', "%{$search}%")
                            ->orWhere('location', 'like', "%{$search}%");
                    });
            });
        }

        $businesses = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->appends(['search' => $search, 'role' => $roleFilter]);

        return Inertia::render('Admin/BusinessPharmacyUsers', [
            'businesses' => $businesses,
            'filters' => $request->only(['search', 'perPage', 'role']),
        ]);
    }

    public function edit($id)
    {
        $user = User::with('establishment')->findOrFail($id);

        return Inertia::render('Admin/EditBusinessPharmacy', [
            'business' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::with('establishment')->findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'phone' => 'required|string|max:20|unique:users,phone,' . $id,
                'role' => 'required|in:2,3',
                'representative_name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
            ]);

            // Update user data
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
            ]);

            // Update or create establishment data
            $user->establishment()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'representative_name' => $request->representative_name,
                    'location' => $request->location,
                ]
            );

            return redirect()->route('admin.business-pharmacy.index')
                ->with('message', 'Business/Pharmacy updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating business/pharmacy: ' . $e->getMessage()]);
        }
    }

    public function viewDocument($filename)
    {
        try {
            // Log the attempt
            \Log::info('Attempting to download document: ' . $filename);

            // Check if user is authenticated
            if (!auth()->check()) {
                \Log::warning('Unauthenticated user attempted to access document: ' . $filename);
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            // Clean the filename
            $filename = trim($filename);
            
            // If filename already contains 'documents/', remove it to avoid double paths
            if (str_starts_with($filename, 'documents/')) {
                $filename = substr($filename, 10); // Remove 'documents/'
            }

            // Construct the full path
            $fullPath = 'documents/' . $filename;
            \Log::info('Full storage path: ' . $fullPath);
            \Log::info('Absolute path: ' . Storage::disk('private')->path($fullPath));

            // Check if file exists
            if (!Storage::disk('private')->exists($fullPath)) {
                \Log::error('File not found in private disk: ' . $fullPath);
                \Log::error('Available files in documents directory:');
                $files = Storage::disk('private')->files('documents');
                foreach ($files as $file) {
                    \Log::error('- ' . $file);
                }
                return response()->json(['error' => 'File not found'], 404);
            }

            // Get file size
            $size = Storage::disk('private')->size($fullPath);
            if ($size === 0) {
                \Log::error('File is empty: ' . $fullPath);
                return response()->json(['error' => 'File is empty'], 400);
            }
            \Log::info('File size: ' . $size . ' bytes');

            // Read the first few bytes to check if it's a PDF
            $header = Storage::disk('private')->get($fullPath, 0, 5);
            if (!$header || strlen($header) < 5) {
                \Log::error('Failed to read file header or header too short');
                return response()->json(['error' => 'Invalid file format'], 400);
            }

            // Check for PDF header
            if ($header !== '%PDF-') {
                \Log::error('Invalid PDF header. Got: ' . bin2hex($header));
                return response()->json(['error' => 'Invalid PDF file'], 400);
            }

            // Get the full file content
            $content = Storage::disk('private')->get($fullPath);
            if ($content === false || strlen($content) === 0) {
                \Log::error('Failed to read file content or content is empty');
                return response()->json(['error' => 'Failed to read file'], 500);
            }

            // Log content details
            \Log::info('Content length: ' . strlen($content) . ' bytes');
            \Log::info('First 20 bytes (hex): ' . bin2hex(substr($content, 0, 20)));
            \Log::info('Last 20 bytes (hex): ' . bin2hex(substr($content, -20)));

            // Verify the content is actually a PDF by checking for PDF trailer
            if (strpos($content, '%%EOF') === false) {
                \Log::error('File does not contain PDF trailer');
                return response()->json(['error' => 'Invalid PDF structure'], 400);
            }

            \Log::info('Successfully validated PDF file, size: ' . strlen($content) . ' bytes');

            // Force download response
            return response()->streamDownload(
                function() use ($content) {
                    echo $content;
                },
                basename($filename),
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Length' => strlen($content),
                    'Content-Disposition' => 'attachment; filename="' . basename($filename) . '"',
                    'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                    'Pragma' => 'no-cache',
                    'Expires' => '0',
                ]
            )->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);

        } catch (\Exception $e) {
            \Log::error('Error downloading document: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Error downloading document: ' . $e->getMessage()], 500);
        }
    }
} 