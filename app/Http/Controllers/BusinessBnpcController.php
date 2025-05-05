<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\AdminControl;
use App\Models\BnpcItem;
use App\Models\BnpcPurchase;
use App\Models\PWDRegistration;

class BusinessBnpcController extends Controller
{
    public function create(Request $request)
    {
        try {
            $purchaseLimit = AdminControl::first()->purchaseLimit ?? 0;
            $pwdNumber = $request->input('pwd_number', '');
            $pwdUser = null;

            if ($pwdNumber !== '') {
                $pwdUser = PWDRegistration::where('pwdNumber', $pwdNumber)->first();

                if (! $pwdUser) {
                    Log::warning('PWD lookup failed', ['pwd_number' => $pwdNumber]);

                    return Redirect::route('business.bnpc-transactions.create')
                    ->withErrors(['pwd_number' => 'No PWD found with that number.'])
                    ->withInput();
                }

                Log::info('PWD lookup success', ['user_id' => $pwdUser->user_id]);
            }

            $weekTotal = $pwdUser
                ? BnpcPurchase::where('bought_by', $pwdUser->user_id)
                    ->whereBetween('date_of_purchase', [now()->startOfWeek(), now()->endOfWeek()])
                    ->sum('total_amount')
                : 0;

            return Inertia::render('Business/RecordTransaction', [
                'bnpcItems'        => BnpcItem::all(),
                'purchaseLimit'    => $purchaseLimit,
                'usedSoFar'        => $weekTotal,
                'remainingBalance' => max(0, $purchaseLimit - $weekTotal),
                'pwdUser'          => $pwdUser,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error loading transaction form', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            abort(500, 'An unexpected error occurred while preparing the form.');
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'date_of_purchase'     => 'required|date',
                'pwd_number'           => 'required|exists:pwd_users,pwdNumber',
                'items'                => 'required|array|min:1',
                'items.*.bnpc_item_id' => 'required|exists:bnpc_items,id',
                'items.*.quantity'     => 'required|integer|min:1',
                'items.*.line_total'   => 'required|numeric|min:0',
                'signature'            => 'nullable|image|max:2048',
            ]);

            $pwd = PWDRegistration::where('pwdNumber', $validated['pwd_number'])->firstOrFail();

            $purchaseLimit = AdminControl::first()->purchaseLimit ?? 0;
            $weekTotalBefore = BnpcPurchase::where('bought_by', $pwd->user_id)
                ->whereBetween('date_of_purchase', [now()->startOfWeek(), now()->endOfWeek()])
                ->sum('total_amount');
            $remaining = max(0, $purchaseLimit - $weekTotalBefore);

            $sigPath = null;
            if ($request->hasFile('signature')) {
                $file = $request->file('signature');
                $filename = 'sig_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $sigPath = $file->storeAs('signatures', $filename, 'public');

                Log::info('Signature uploaded', [
                    'filename' => $filename,
                    'stored_at' => $sigPath,
                    'url' => asset("storage/{$sigPath}")
                ]);
            }

            foreach ($validated['items'] as $row) {
                $lineAmt = $row['line_total'];
                $remaining = max(0, $remaining - $lineAmt);

                BnpcPurchase::create([
                    'date_of_purchase'   => $validated['date_of_purchase'],
                    'bought_by'          => $pwd->user_id,
                    'store_id'           => auth()->id(),
                    'bnpc_item_id'       => $row['bnpc_item_id'],
                    'quantity'           => $row['quantity'],
                    'total_amount'       => $lineAmt,
                    'remaining_balance'  => $remaining,
                    'signature_path'     => $sigPath,
                ]);

                Log::info('BNPC Purchase recorded', [
                    'pwd_id'   => $pwd->user_id,
                    'item_id'  => $row['bnpc_item_id'],
                    'amount'   => $lineAmt,
                    'balance'  => $remaining
                ]);
            }

            return Redirect::route('business.bnpc-transactions.create')
                ->with('success', 'Transaction recorded successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to store transaction', [
                'request' => $request->all(),
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return Redirect::back()
                ->withErrors(['form' => 'An unexpected error occurred while saving the transaction.'])
                ->withInput();
        }
    }
}
