<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacyDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Placeholder/dummy data to prevent frontend errors
        return Inertia::render('Pharmacy/Dashboard', [
            'auth' => [
                'user' => $request->user(),
            ],
            'totalSales' => 14500.75,
            'totalTransactions' => 27,
            'recentSale' => 850.00,
            'recentDate' => now()->subDays(2)->toDateString(),
            'pharmacistName' => 'John Reyes, RPh',
        ]);
    }
}
