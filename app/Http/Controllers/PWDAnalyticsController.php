<?php

// Controller: PWDAnalyticsController.php

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
        $range = request('range', 'month');

        $startDate = match ($range) {
            'week'  => Carbon::now()->subWeek(),
            'three' => Carbon::now()->subMonths(3),
            'six'   => Carbon::now()->subMonths(6),
            'year'  => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        $hasActiveSubscription = Subscription::where('user_id', $userId)
            ->where('ends_at', '>', Carbon::now())
            ->exists();

        $bnpMonthlyData = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m') as month, SUM(total_amount) as total_amount")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topMedicines = Prescription::where('buyer_id', $userId)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('medicine_purchase as medicine, COUNT(*) as count')
            ->groupBy('medicine')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $spendingByItem = BnpcPurchase::with('item')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->selectRaw('bnpc_item_id, SUM(total_amount) as total')
            ->groupBy('bnpc_item_id')
            ->get()
            ->map(fn($p) => [
                'item' => $p->item?->name ?? 'Unknown',
                'total' => $p->total,
            ]);

        $spendingByCategory = BnpcPurchase::with('item')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->get()
            ->groupBy(fn($p) => $p->item?->category ?? 'Uncategorized')
            ->map(fn($group) => $group->sum('total_amount'))
            ->map(fn($total, $category) => ['category' => $category, 'total' => $total])
            ->values();

        $spendingByStore = BnpcPurchase::with('store')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->selectRaw('store_id, SUM(total_amount) as total')
            ->groupBy('store_id')
            ->get()
            ->map(fn($p) => [
                'store' => $p->store?->name ?? 'Unknown Store',
                'total' => $p->total,
            ]);

        $quantityOverTime = BnpcPurchase::selectRaw("DATE(date_of_purchase) as date, SUM(quantity) as total_quantity")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $averagePurchase = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m') as month, AVG(total_amount) as average")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $balanceTrend = BnpcPurchase::select('date_of_purchase', 'remaining_balance')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->orderBy('date_of_purchase')
            ->get();

        $purchaseFrequency = BnpcPurchase::selectRaw("WEEK(date_of_purchase) as week, COUNT(*) as count")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('week')
            ->orderBy('week')
            ->get();

        return Inertia::render('PWD/Analytics', [
            'hasActiveSubscription' => $hasActiveSubscription,
            'bnpMonthlyData'        => $bnpMonthlyData,
            'topMedicines'          => $topMedicines,
            'spendingByItem'        => $spendingByItem,
            'spendingByCategory'    => $spendingByCategory,
            'spendingByStore'       => $spendingByStore,
            'quantityOverTime'      => $quantityOverTime,
            'averagePurchase'       => $averagePurchase,
            'balanceTrend'          => $balanceTrend,
            'purchaseFrequency'     => $purchaseFrequency,
        ]);
    }
}
