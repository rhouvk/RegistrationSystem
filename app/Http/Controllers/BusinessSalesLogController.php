<?php

// app/Http/Controllers/BusinessSalesLogController.php

namespace App\Http\Controllers;

use App\Models\BnpcPurchase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BusinessSalesLogController extends Controller
{
    public function index()
    {
        $business = Auth::user();

        $sales = BnpcPurchase::with(['item','buyer'])
            ->where('store_id', $business->id)
            ->orderByDesc('id')
            ->get()
            ->map(fn($p) => [
                'date_of_sale'   => $p->date_of_purchase,
                'purchased_by'   => $p->buyer?->pwdNumber ?? '—',
                'total_amount'   => (float) $p->total_amount, // ✅ Ensure it's a number
                'item_name'      => $p->item?->name ?? '—',
                'quantity'       => $p->quantity,
                'signature'      => $p->signature_path
                                     ? asset("storage/{$p->signature_path}")
                                     : null,
            ]);
            

        return Inertia::render('Business/SalesLog', [
            'salesLog' => $sales,
        ]);
    }
}
