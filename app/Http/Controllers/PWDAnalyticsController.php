<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\BnpcPurchase;
use App\Models\Prescription;
use App\Models\PrescriptionFilling;
use App\Models\Subscription;
use Carbon\Carbon;

class PWDAnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $range = request('range', 'month');

        $startDate = match ($range) {
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'three' => Carbon::now()->subMonths(3)->startOfMonth(),
            'six' => Carbon::now()->subMonths(6)->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        $hasActiveSubscription = Subscription::where('user_id', $userId)
            ->where('ends_at', '>', Carbon::now())
            ->exists();

        $totalPurchases = BnpcPurchase::where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->count();

        $totalSpent = BnpcPurchase::where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->sum('discounted_price');

        $totalOriginalAmount = BnpcPurchase::where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->sum('total_amount');

        $totalSaved = $totalOriginalAmount - $totalSpent;

        $totalPrescriptions = Prescription::where('buyer_id', $userId)
            ->where('created_at', '>=', $startDate)
            ->count();

        $storeIdsFromBNPC = BnpcPurchase::where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->distinct('store_id')
            ->pluck('store_id');

        $storeIdsFromFilling = PrescriptionFilling::whereHas('prescription', function ($q) use ($userId, $startDate) {
            $q->where('buyer_id', $userId)->where('created_at', '>=', $startDate);
        })->distinct('drugstore_id')->pluck('drugstore_id');

        $activeStores = $storeIdsFromBNPC->merge($storeIdsFromFilling)->unique()->count();

        $bnpMonthlyData = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m-%d') as date, SUM(total_amount) as total_amount")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topMedicines = PrescriptionFilling::with('prescription')
            ->whereHas('prescription', function ($q) use ($userId, $startDate) {
                $q->where('buyer_id', $userId)->where('created_at', '>=', $startDate);
            })
            ->get()
            ->groupBy(fn ($f) => $f->prescription?->medicine_purchase ?? 'Unknown')
            ->map(fn ($group) => $group->sum('filling_amount'))
            ->sortDesc()
            ->take(5)
            ->map(fn ($total, $name) => ['medicine' => $name, 'count' => $total])
            ->values();

        $spendingByItem = BnpcPurchase::with('item')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->selectRaw('bnpc_item_id, SUM(total_amount) as total')
            ->groupBy('bnpc_item_id')
            ->get()
            ->map(fn ($p) => [
                'item' => $p->item?->name ?? 'Unknown',
                'total' => $p->total,
            ]);

        $spendingByCategory = BnpcPurchase::with('item')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->get()
            ->groupBy(fn ($p) => $p->item?->type ?? 'Uncategorized')
            ->map(fn ($group) => $group->sum('total_amount'))
            ->map(fn ($total, $category) => ['category' => $category, 'total' => $total])
            ->values();

        $spendingByStore = BnpcPurchase::with('store')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->selectRaw('store_id, SUM(total_amount) as total')
            ->groupBy('store_id')
            ->get()
            ->map(fn ($p) => [
                'store' => $p->store?->name ?? 'Unknown Store',
                'total' => $p->total,
            ]);

        $pharmacySpending = PrescriptionFilling::with('drugstore')
            ->whereHas('prescription', function ($query) use ($userId, $startDate) {
                $query->where('buyer_id', $userId)
                      ->where('created_at', '>=', $startDate);
            })
            ->selectRaw('drugstore_id, COUNT(*) as total')
            ->groupBy('drugstore_id')
            ->get()
            ->map(fn ($p) => [
                'store' => $p->drugstore?->name ?? 'Unknown Pharmacy',
                'total' => $p->total,
            ]);

        $quantityOverTime = BnpcPurchase::selectRaw("DATE(date_of_purchase) as date, SUM(quantity) as total_quantity")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $averagePurchase = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m-%d') as date, AVG(total_amount) as average")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $balanceTrend = BnpcPurchase::select('date_of_purchase', 'remaining_balance')
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->orderBy('date_of_purchase')
            ->get();

        $purchaseFrequency = BnpcPurchase::selectRaw("DATE(date_of_purchase) as date, COUNT(*) as count")
            ->where('bought_by', $userId)
            ->where('date_of_purchase', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('PWD/Analytics', [
            'hasActiveSubscription' => $hasActiveSubscription,
            'bnpMonthlyData' => $bnpMonthlyData,
            'topMedicines' => $topMedicines,
            'spendingByItem' => $spendingByItem,
            'spendingByCategory' => $spendingByCategory,
            'spendingByStore' => $spendingByStore,
            'pharmacySpending' => $pharmacySpending,
            'quantityOverTime' => $quantityOverTime,
            'averagePurchase' => $averagePurchase,
            'balanceTrend' => $balanceTrend,
            'purchaseFrequency' => $purchaseFrequency,
            'summaryPanels' => [
                'totalPurchases' => $totalPurchases,
                'totalSpent' => $totalSpent,
                'totalSaved' => $totalSaved,
                'totalPrescriptions' => $totalPrescriptions,
                'activeStores' => $activeStores,
            ],
        ]);
    }
}
