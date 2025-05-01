<?php

namespace App\Http\Controllers;

use App\Models\AdminControl;
use App\Models\BnpcItem;
use App\Models\BnpcPurchase;
use App\Models\PWDRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BusinessBnpcController extends Controller
{
    public function create(Request $request)
    {
        // 1) Weekly cap
        $purchaseLimit = AdminControl::first()->purchaseLimit ?? 0;

        // 2) Grab the PWD number from the query string or old input
        $pwdNumber = $request->input('pwd_number', '');
        $pwdUser   = null;

        if ($pwdNumber !== '') {
            $pwdUser = PWDRegistration::where('pwdNumber', $pwdNumber)->first();

            if (! $pwdUser) {
                return Redirect::route('business.bnpc-transactions.create')
                    ->withErrors(['pwd_number' => 'No PWD found with that number.'])
                    ->withInput();
            }
        }

        // 3) Sum this week’s spending for that PWD (by user_id!)
        $weekTotal = $pwdUser
            ? BnpcPurchase::where('bought_by', $pwdUser->user_id)
                ->whereBetween('date_of_purchase', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ])
                ->sum('total_amount')
            : 0;

        $remainingBalance = max(0, $purchaseLimit - $weekTotal);
        $usedSoFar        = $weekTotal;

        return Inertia::render('Business/RecordTransaction', [
            'bnpcItems'        => BnpcItem::all(),
            'purchaseLimit'    => $purchaseLimit,
            'usedSoFar'        => $usedSoFar,
            'remainingBalance' => $remainingBalance,
            'pwdUser'          => $pwdUser,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_of_purchase'     => 'required|date',
            'pwd_number'           => 'required|exists:pwd_users,pwdNumber',
            'items'                => 'required|array|min:1',
            'items.*.bnpc_item_id' => 'required|exists:bnpc_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.line_total'   => 'required|numeric|min:0',
            'signature'            => 'nullable|image|max:2048',
        ]);
    
        // Lookup the PWD record
        $pwd = PWDRegistration::where('pwdNumber', $validated['pwd_number'])->firstOrFail();
    
        // Compute this week's opening balance
        $purchaseLimit = AdminControl::first()->purchaseLimit ?? 0;
        $weekTotalBefore = BnpcPurchase::where('bought_by', $pwd->user_id)
            ->whereBetween('date_of_purchase', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ])
            ->sum('total_amount');
        $remaining = max(0, $purchaseLimit - $weekTotalBefore);
    
        // Handle signature upload
        $sigPath = null;
        if ($request->hasFile('signature')) {
            $sigPath = $request->file('signature')
                           ->store('bnpc_signatures', 'public');
        }
    
        // Insert each line, subtracting from the balance as we go
        foreach ($validated['items'] as $row) {
            $lineAmt   = $row['line_total'];
            $remaining = max(0, $remaining - $lineAmt);
    
            BnpcPurchase::create([
                'date_of_purchase'   => $validated['date_of_purchase'],
                'bought_by'          => $pwd->user_id,     // ← use user_id here
                'store_id'           => auth()->id(),
                'bnpc_item_id'       => $row['bnpc_item_id'],
                'quantity'           => $row['quantity'],
                'total_amount'       => $lineAmt,
                'remaining_balance'  => $remaining,
                'signature_path'     => $sigPath,
            ]);
        }
    
        return Redirect::route('business.bnpc-transactions.create')
                       ->with('success', 'Transaction recorded.');
    }
}
