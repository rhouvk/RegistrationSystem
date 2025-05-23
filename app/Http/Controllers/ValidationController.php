<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class ValidationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');
        $roleFilter = $request->input('role');

        $query = User::with('establishment')
            ->whereIn('role', [2, 3]) // Business and Pharmacy roles
            ->where('is_validated', 3); // Pending validation

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

        $pendingValidations = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->appends(['search' => $search, 'role' => $roleFilter]);

        return Inertia::render('Admin/PendingValidations', [
            'pendingValidations' => $pendingValidations,
            'filters' => $request->only(['search', 'perPage', 'role']),
        ]);
    }

    public function approve($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['is_validated' => 4]); // Set to approved status

            return redirect()->back()->with('message', 'User validation status updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error updating validation status: ' . $e->getMessage()]);
        }
    }
} 