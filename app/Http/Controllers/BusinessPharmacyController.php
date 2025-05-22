<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Establishment;
use Inertia\Inertia;

class BusinessPharmacyController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');
        $roleFilter = $request->input('role');

        $query = User::with('establishment')
            ->whereIn('role', [2, 3]); // 2 for Business, 3 for Pharmacy

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
} 