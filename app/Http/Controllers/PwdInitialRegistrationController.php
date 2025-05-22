<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PWDInitialRegistrationController extends Controller
{
    public function show()
    {
        return Inertia::render('InitialRegistration');
    }

    public function store(Request $request)
    {
        Log::info('Initial registration form submitted', $request->all());

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'dob' => 'required|date',
            'sex' => 'required|string|in:Male,Female',
            'civilStatus' => 'required|string|in:Single,Married,Widowed,Separated,Cohabitation',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        Log::info('Validation passed', $validator->validated());

        // Store the validated data in session
        session(['pwd_initial_data' => $validator->validated()]);

        // Redirect to additional information form
        return redirect()->route('pwd.additional-info.show');
    }
} 