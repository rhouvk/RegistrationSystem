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
        $now = now();
        $range = $request->input('range', 'last_6_months');

        // Determine date range based on preset
        switch ($range) {
            case 'last_month':
                $start = $now->copy()->subMonth()->startOfMonth();
                $end = $now->copy()->subMonth()->endOfMonth();
                break;
            case 'last_year':
                $start = $now->copy()->subYear()->startOfYear();
                $end = $now->copy()->endOfYear();
                break;
            case 'last_3_years':
                $start = $now->copy()->subYears(3)->startOfYear();
                $end = $now->copy()->endOfYear();
                break;
            case 'last_5_years':
                $start = $now->copy()->subYears(5)->startOfYear();
                $end = $now->copy()->endOfYear();
                break;
            case 'overall':
                $minDate = BnpcPurchase::where('store_id', $user->id)->min('date_of_purchase');
                $start = $minDate ? \Carbon\Carbon::parse($minDate)->startOfMonth() : $now->copy()->subYears(5);
                $end = $now->copy()->endOfMonth();
                break;
            case 'last_6_months':
            default:
                $start = $now->copy()->subMonths(5)->startOfMonth();
                $end = $now->copy()->endOfMonth();
                break;
        }

        // Generate fallback months
        $period = new \DatePeriod(
            new \DateTime($start->format('Y-m-01')),
            new \DateInterval('P1M'),
            (new \DateTime($end->format('Y-m-01')))->modify('+1 month')
        );

        $fallbackMonthlyData = collect();
        foreach ($period as $dt) {
            $fallbackMonthlyData->push([
                'month' => $dt->format('Y-m'),
                'total' => 0,
            ]);
        }

        // Monthly total sales
        $monthlyData = BnpcPurchase::selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m') as month")
            ->selectRaw("SUM(total_amount) as total")
            ->where('store_id', $user->id)
            ->whereBetween('date_of_purchase', [$start, $end])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $finalMonthlyData = $fallbackMonthlyData->map(function ($fallback) use ($monthlyData) {
            return [
                'month' => $fallback['month'],
                'total' => $monthlyData[$fallback['month']]->total ?? 0,
            ];
        });

        // Top items by quantity
        $itemCounts = BnpcPurchase::with('item')
            ->where('store_id', $user->id)
            ->select('bnpc_item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('bnpc_item_id')
            ->orderByDesc('total_quantity')
            ->get();

        // Daily sales for latest month
        $latestMonthStart = $end->copy()->startOfMonth();
        $latestMonthEnd = $end->copy()->endOfMonth();
        $dailySales = BnpcPurchase::selectRaw("DATE(date_of_purchase) as day, SUM(total_amount) as total")
            ->where('store_id', $user->id)
            ->whereBetween('date_of_purchase', [$latestMonthStart, $latestMonthEnd])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        // Sales trend for top 5 items
        $topItemIds = $itemCounts->take(5)->pluck('bnpc_item_id');
        $itemSalesTrend = BnpcPurchase::with('item')
            ->selectRaw("DATE_FORMAT(date_of_purchase, '%Y-%m') as month, bnpc_item_id, SUM(quantity) as total_quantity")
            ->where('store_id', $user->id)
            ->whereBetween('date_of_purchase', [$start, $end])
            ->whereIn('bnpc_item_id', $topItemIds)
            ->groupBy('month', 'bnpc_item_id')
            ->get()
            ->groupBy('bnpc_item_id');

        // Most recent sale (last recorded purchase)
        $latestSale = BnpcPurchase::where('store_id', $user->id)
        ->orderByDesc('id')
        ->first(['date_of_purchase', 'total_amount']);

        return Inertia::render('Business/Dashboard', [
            'monthlyData' => $finalMonthlyData,
            'itemCounts' => $itemCounts,
            'dailySales' => $dailySales,
            'itemSalesTrend' => $itemSalesTrend,
            'latestSale' => $latestSale,
            'range' => $range,
        ]);
    }
}
