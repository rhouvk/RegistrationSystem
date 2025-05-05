<?php

// Controller: PWDDashboardController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use App\Models\AdminControl;
use App\Models\BnpcPurchase;
use App\Models\Subscription;
use Inertia\Inertia;
use Carbon\Carbon;

class PWDDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $registration = PWDRegistration::with([
            'user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay',
        ])->where('user_id', $user->id)->firstOrFail();

        $adminControl = AdminControl::find(1);
        $purchaseLimit = (float) ($adminControl->purchaseLimit ?? 0);
        $cardExpiration = (int) ($adminControl->cardExpiration ?? 3);

        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        $weekTotal = (float) BnpcPurchase::where('bought_by', $registration->user_id)
            ->whereBetween('date_of_purchase', [$startOfWeek, $endOfWeek])
            ->sum('total_amount');

        $mostRecent = BnpcPurchase::where('bought_by', $registration->user_id)
            ->orderByDesc('id')
            ->first();

        $recentPurchase = (float) ($mostRecent->total_amount ?? 0);
        $recentDate = $mostRecent->date_of_purchase ?? null;

        $remainingBalance = max(0, $purchaseLimit - $weekTotal);

        $registration->photoUrl = $registration->photo
            ? asset('storage/' . $registration->photo)
            : asset('images/person.png');

        $subscription = $user->subscriptions()
            ->where('ends_at', '>=', now())
            ->latest('ends_at')
            ->first();

        return Inertia::render('PWD/Dashboard', [
            'auth' => ['user' => $user],
            'registration' => $registration,
            'cardExpiration' => $cardExpiration,
            'purchaseLimit' => $purchaseLimit,
            'usedSoFar' => $weekTotal,
            'remainingBalance' => $remainingBalance,
            'recentPurchase' => $recentPurchase,
            'recentDate' => $recentDate,
            'subscription' => $subscription,
        ]);
    }
}
