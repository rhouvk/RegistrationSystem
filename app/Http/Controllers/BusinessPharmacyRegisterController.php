<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BusinessPharmacyRegisterController extends Controller
{
    public function create()
    {
        return inertia('RegisterBusiness');
    }

    public function store(Request $request)
    {
        Log::info('Registration request received', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:2,3', // 2 for business, 3 for pharmacy
            'representative_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users',
            'relevant_document' => 'required|file|mimes:pdf|max:10240', // Max 10MB
        ]);

        try {
            DB::beginTransaction();

            // Create user first
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'is_validated' => 3,
                'phone' => $request->phone,
            ]);

            Log::info('User created successfully', ['user_id' => $user->id]);

            // Handle file upload only after user creation
            $path = null;
            if ($request->hasFile('relevant_document')) {
                $file = $request->file('relevant_document');
                
                // Create a simple filename with timestamp and user ID
                $fileName = date('YmdHis') . $user->id . '.pdf';
                
                // Store in private disk for sensitive documents
                $path = $file->storeAs('documents', $fileName, 'private');
            }

            // Create establishment record with document path
            $establishment = Establishment::create([
                'user_id' => $user->id,
                'representative_name' => $request->representative_name,
                'location' => $request->location,
                'document_path' => $path,
            ]);

            Log::info('Establishment created successfully', ['establishment_id' => $establishment->id]);

            DB::commit();
            Log::info('Transaction committed successfully');

            return redirect()->route('login')->with('success', 'Registration successful! Please login.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
