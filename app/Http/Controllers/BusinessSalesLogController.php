<?php

namespace App\Http\Controllers;

use App\Models\BnpcPurchase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BusinessSalesLogController extends Controller
{
    public function index(Request $request)
    {
        $business = Auth::user();
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');

        $query = BnpcPurchase::with(['item', 'buyer'])
            ->where('store_id', $business->id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('buyer', function ($q2) use ($search) {
                    $q2->where('pwdNumber', 'like', "%{$search}%");
                })
                ->orWhereHas('item', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                });
            });
        }

        $sales = $query->orderByDesc('id')
            ->paginate($perPage)
            ->through(function ($p) {
                $total = (float) $p->total_amount;
                $discounted = (float) $p->discounted_price;
                $discount = $total - $discounted;

                return [
                    'id'                     => $p->id,
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
            'filters' => $request->only('search', 'perPage'),
        ]);
    }
}
