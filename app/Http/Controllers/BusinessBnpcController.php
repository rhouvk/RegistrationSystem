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
            $admin = AdminControl::first();
            $purchaseLimit = $admin->purchaseLimit ?? 0;
            $cardExpirationYears = $admin->cardExpiration ?? 1;
            $bnpcDiscount = $admin->BNPCdiscount ?? 5;

            $pwdNumber = $request->input('pwd_number', '');
            $pwdUser = null;
            $userName = null;
            $isCardExpired = false;
            $validUntil = null;

            if ($pwdNumber !== '') {
                $pwdUser = PWDRegistration::with('user')->where('pwdNumber', $pwdNumber)->first();

                if (! $pwdUser) {
                    Log::warning('PWD lookup failed', ['pwd_number' => $pwdNumber]);
                    return Redirect::route('business.bnpc-transactions.create')
                        ->withErrors(['pwd_number' => 'No PWD found with that number.'])
                        ->withInput();
                }

                $issuedDate = $pwdUser->dateApplied;
                $expiryDate = $issuedDate->copy()->addYears($cardExpirationYears);
                $isCardExpired = now()->greaterThan($expiryDate);
                $validUntil = $expiryDate->toDateString();
                $userName = $pwdUser->user->name ?? null;

                Log::info('PWD lookup success', [
                    'user_id' => $pwdUser->user_id,
                    'expired' => $isCardExpired,
                    'valid_until' => $validUntil,
                ]);
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
                'userName'         => $userName,
                'isCardExpired'    => $isCardExpired,
                'validUntil'       => $validUntil,
                'BNPCdiscount'     => $bnpcDiscount,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error loading transaction form', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            abort(500, 'An error occurred while preparing the form.');
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

            $pwd = PWDRegistration::where('pwdNumber', $validated['pwd_number'])->first();
            if (! $pwd) {
                return Redirect::back()->withErrors(['pwd_number' => 'PWD not found.'])->withInput();
            }

            $admin = AdminControl::first();
            $purchaseLimit = $admin->purchaseLimit ?? 0;
            $discountRate = $admin->BNPCdiscount ?? 0;

            $weekTotalBefore = BnpcPurchase::where('bought_by', $pwd->user_id)
                ->whereBetween('date_of_purchase', [now()->startOfWeek(), now()->endOfWeek()])
                ->sum('total_amount');

            $remaining = max(0, $purchaseLimit - $weekTotalBefore);

            $sigPath = null;
            if ($request->hasFile('signature')) {
                $file = $request->file('signature');
                $filename = 'sig_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $sigPath = $file->storeAs('signatures', $filename, 'public');
            }

            foreach ($validated['items'] as $row) {
                $lineAmt = (float) $row['line_total'];
                $discounted = round($lineAmt * (1 - $discountRate / 100), 2);

                $remaining = max(0, $remaining - $lineAmt);

                BnpcPurchase::create([
                    'date_of_purchase'   => $validated['date_of_purchase'],
                    'bought_by'          => $pwd->user_id,
                    'store_id'           => auth()->id(),
                    'bnpc_item_id'       => $row['bnpc_item_id'],
                    'quantity'           => $row['quantity'],
                    'total_amount'       => $lineAmt,
                    'discounted_price'   => $discounted,
                    'remaining_balance'  => $remaining,
                    'signature_path'     => $sigPath,
                ]);
            }

            return Redirect::route('business.sales-log')
                ->with('success', 'Transaction recorded successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to store transaction', [
                'request' => $request->except('signature'), // omit large file content
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return Redirect::back()
                ->withErrors(['form' => 'An unexpected error occurred while saving the transaction.'])
                ->withInput();
        }
    }
}
