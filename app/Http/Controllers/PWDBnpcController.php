<?php

// Controller: PWDBnpcController.php

namespace App\Http\Controllers;

use App\Models\BnpcPurchase;
use App\Models\PWDRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PWDBnpcController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->input('perPage', 12);
        $search = $request->input('search');

        $reg = PWDRegistration::where('user_id', $user->id)->firstOrFail();

        $query = BnpcPurchase::with(['item', 'store'])
            ->where('bought_by', $reg->user_id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('item', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('store', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                ->orWhereDate('date_of_purchase', 'like', "%{$search}%");
            });
        }

        $records = $query->orderByDesc('id')
            ->paginate($perPage)
            ->through(fn($p) => [
                'id' => $p->id,
                'date_of_purchase' => Carbon::parse($p->date_of_purchase)->toDateString(),
                'total_amount' => (float) $p->total_amount,
                'remaining_balance' => (float) $p->remaining_balance,
                'item_name' => $p->item?->name,
                'quantity' => $p->quantity,
                'store' => $p->store?->name,
                'signature' => $p->signature_path
                    ? asset("storage/{$p->signature_path}")
                    : null,
            ]);

        return Inertia::render('PWD/BNPCPurchases', [
            'bnpcEntries' => $records,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }
}
