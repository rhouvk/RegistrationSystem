<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
    
        $user = Auth::user();

        // Check if account is validated
        if ($user->is_validated === 0) {
            return redirect()->route('validation.required')->with([
                'userType' => $user->disability_type
            ]);
        }

        // Check if account is pending approval
        if ($user->is_validated === 3) {
            return redirect()->route('approval.pending')->with([
                'message' => 'Your account is pending approval. Please wait for admin verification.'
            ]);
        }
    
        switch ($user->role) {
            case 3:
                // Pharmacy
                return redirect()->intended(route('pharmacy.dashboard'));
            case 2:
                // Business
                return redirect()->intended(route('business.dashboard'));
            case 1:
                // Admin
                return redirect()->intended(route('admin.dashboard'));
            case 0:
                // PWD
                return redirect()->intended(route('pwd.dashboard'));
            default:
                // Fallback for unknown roles
                return redirect()->intended(route('dashboard'));
        }
    }
    

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
