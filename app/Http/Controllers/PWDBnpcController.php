<?php

// Controller: PWDBnpcController.php

namespace App\Http\Controllers;

use App\Models\BnpcPurchase;
use App\Models\PWDRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PWDBnpcController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $reg = PWDRegistration::where('user_id', $user->id)->firstOrFail();

        $records = BnpcPurchase::with(['item', 'store'])
            ->where('bought_by', $reg->user_id)
            ->orderByDesc('id')
            ->get()
            ->map(fn($p) => [
                'date_of_purchase'  => Carbon::parse($p->date_of_purchase)->toDateString(),
                'total_amount'      => (float) $p->total_amount,
                'remaining_balance' => (float) $p->remaining_balance,
                'item_name'         => $p->item?->name,
                'quantity'          => $p->quantity,
                'store'             => $p->store?->name,
                'signature'         => $p->signature_path
                    ? asset("storage/{$p->signature_path}")
                    : null,
            ]);

        return Inertia::render('PWD/BNPCPurchases', [
            'bnpcEntries' => $records,
        ]);
    }
}
