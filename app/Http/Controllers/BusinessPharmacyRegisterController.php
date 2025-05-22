<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BusinessPharmacyRegisterController extends Controller
{
    public function create()
    {
        return inertia('RegisterBusiness');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:2,3', // 2 for business, 3 for pharmacy
            'representative_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            // Create establishment record
            $establishment = Establishment::create([
                'user_id' => $user->id,
                'representative_name' => $request->representative_name,
                'location' => $request->location,
            ]);

            DB::commit();

            return redirect()->route('login')->with('success', 'Registration successful! Please login.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
