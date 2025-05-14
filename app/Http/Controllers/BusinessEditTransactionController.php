<?php

namespace App\Http\Controllers;

use App\Models\{BnpcPurchase, BnpcItem, AdminControl};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Redirect};
use Inertia\Inertia;
use Carbon\Carbon;

class BusinessEditTransactionController extends Controller
{
    public function edit($id)
    {
        $purchase = BnpcPurchase::with(['item', 'buyer'])
            ->where('id', $id)
            ->where('store_id', auth()->id())
            ->firstOrFail();

        $admin = AdminControl::first();
        $purchaseLimit = $admin->purchaseLimit ?? 0;

        $userId = $purchase->bought_by;
        $transactionDate = Carbon::parse($purchase->date_of_purchase)->startOfDay();
        $weekStart = $transactionDate->copy()->startOfWeek();
        $weekEnd = $transactionDate->copy()->endOfWeek();
        
        $usedSoFar = BnpcPurchase::where('bought_by', $purchase->bought_by)
            ->whereBetween('date_of_purchase', [$weekStart, $weekEnd])
            ->where('id', '!=', $purchase->id)
            ->sum('total_amount');


        Log::info('Edit Transaction Data', [
            'transaction_id' => $purchase->id,
            'user_id' => $userId,
            'transaction_date' => $transactionDate,
            'week_start' => $weekStart,
            'week_end' => $weekEnd,
            'purchase_limit' => $purchaseLimit,
            'used_so_far' => round($usedSoFar, 2),
        ]);

        return Inertia::render('Business/EditTransaction', [
            'transaction'       => $purchase,
            'bnpcItems'         => BnpcItem::all(),
            'purchaseLimit'     => $purchaseLimit,
            'usedSoFar'         => round($usedSoFar, 2),
        ]);
    }

public function update(Request $request, $id)
{
    $purchase = BnpcPurchase::where('id', $id)
        ->where('store_id', auth()->id())
        ->firstOrFail();

    $validated = $request->validate([
        'bnpc_item_id' => 'required|exists:bnpc_items,id',
        'quantity'     => 'required|integer|min:1',
        'total_amount' => 'required|numeric|min:0',
    ]);

    $admin = AdminControl::first();
    $discountRate = $admin?->BNPCdiscount ?? 0;
    $purchaseLimit = $admin?->purchaseLimit ?? 0;

    $transactionDate = Carbon::parse($purchase->date_of_purchase)->startOfDay();
    $weekStart = $transactionDate->copy()->startOfWeek();
    $weekEnd = $transactionDate->copy()->endOfWeek();

    $newTotal = $validated['total_amount'];
    $discounted = round($newTotal * (1 - $discountRate / 100), 2);

    // Update the edited record first
    $purchase->update([
        'bnpc_item_id'     => $validated['bnpc_item_id'],
        'quantity'         => $validated['quantity'],
        'total_amount'     => $newTotal,
        'discounted_price' => $discounted,
    ]);

    // Fetch all purchases this week (sorted by creation), re-compute running remaining balance
    $weeklyPurchases = BnpcPurchase::where('bought_by', $purchase->bought_by)
        ->whereBetween('date_of_purchase', [$weekStart, $weekEnd])
        ->orderBy('created_at')
        ->get();

    $runningBalance = $purchaseLimit;
    foreach ($weeklyPurchases as $p) {
        $runningBalance = max(0, $runningBalance - $p->total_amount);
        $p->update(['remaining_balance' => round($runningBalance, 2)]);
    }

    Log::info('BNPC transaction updated and balances recalculated', [
        'edited_id' => $purchase->id,
        'week_start' => $weekStart->toDateString(),
        'week_end' => $weekEnd->toDateString(),
    ]);

    return Redirect::route('business.sales-log')->with('success', 'Transaction updated and weekly balances adjusted.');
}

}