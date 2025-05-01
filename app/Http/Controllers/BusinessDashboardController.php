<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BnpcPurchase;
use Illuminate\Support\Facades\DB;

class BusinessDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1) last 6 months totals
        $monthlyData = BnpcPurchase::selectRaw("strftime('%Y-%m', date_of_purchase) as month")
            ->selectRaw("SUM(total_amount) as total")
            ->where('store_id', $user->id)
            ->where('date_of_purchase', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 2) top items by quantity
        $itemCounts = BnpcPurchase::with('item')
            ->where('store_id', $user->id)
            ->select('bnpc_item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('bnpc_item_id')
            ->orderByDesc('total_quantity')
            ->get();

        return Inertia::render('Business/Dashboard', [
            'monthlyData' => $monthlyData,
            'itemCounts'  => $itemCounts,
        ]);
    }
}