<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\BnpcPurchase;
use App\Models\Prescription;
use App\Models\Subscription;
use Carbon\Carbon;

class PWDAnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // ✅ Check if user has an active subscription
        $hasActiveSubscription = Subscription::where('user_id', $userId)
            ->where('ends_at', '>', Carbon::now())
            ->exists();

        // 1. Monthly BNPC Purchases
        $bnpMonthlyData = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m') as month, SUM(total_amount) as total_amount")
            ->where('bought_by', $userId)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 2. Top 5 Prescribed Medicines
        $topMedicines = Prescription::where('buyer_id', $userId)
            ->selectRaw('medicine_purchase as medicine, COUNT(*) as count')
            ->groupBy('medicine')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return Inertia::render('PWD/Analytics', [
            'bnpMonthlyData'        => $bnpMonthlyData,
            'topMedicines'          => $topMedicines,
            'hasActiveSubscription' => $hasActiveSubscription,
        ]);
    }
}
