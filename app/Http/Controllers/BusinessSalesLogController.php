<?php

namespace App\Http\Controllers;

use App\Models\BnpcPurchase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BusinessSalesLogController extends Controller
{
    public function index()
    {
        $business = Auth::user();

        $sales = BnpcPurchase::with(['item', 'buyer'])
            ->where('store_id', $business->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($p) {
                $total = (float) $p->total_amount;
                $discounted = (float) $p->discounted_price;
                $discount = $total - $discounted;

                return [
                    'id'                     => $p->id, // ✅ Include ID for routing
                    'date_of_sale'           => $p->date_of_purchase,
                    'purchased_by'           => $p->buyer?->pwdNumber ?? '—',
                    'item_name'              => $p->item?->name ?? '—',
                    'quantity'               => $p->quantity,
                    'total_amount'           => round($total, 2),
                    'discounted_amount'      => round($discount, 2),
                    'amount_after_discount'  => round($discounted, 2),
                    'signature'              => $p->signature_path
                        ? asset("storage/{$p->signature_path}")
                        : null,
                ];
            });

        return Inertia::render('Business/SalesLog', [
            'salesLog' => $sales,
        ]);
    }
}
