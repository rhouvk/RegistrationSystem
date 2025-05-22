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
            'user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay', 'renewals'
        ])->where('user_id', $user->id)->firstOrFail();

        $adminControl = AdminControl::find(1);
        $purchaseLimit = (float) ($adminControl->purchaseLimit ?? 0);
        $cardExpiration = (int) ($adminControl->cardExpiration ?? 3);

        // Get all renewals ordered by date
        $renewals = $registration->renewals()
            ->orderBy('dateApplied', 'desc')
            ->get();

        // Get the most recent approved renewal
        $lastApprovedRenewal = $renewals->first(function($renewal) {
            return $renewal->registration_type === 3; // 3 for approved
        });

        // Check for pending renewal
        $hasPendingRenewal = $renewals->contains(function($renewal) {
            return $renewal->registration_type === 2; // 2 for renewal
        });

        // Calculate expiration based on the most recent approved renewal or original registration
        $baseDate = $lastApprovedRenewal ? $lastApprovedRenewal->dateApplied : $registration->dateApplied;
        $expiryDate = Carbon::parse($baseDate)->addYears($cardExpiration);
        $isExpired = now()->greaterThan($expiryDate);

        // If card is expired and no pending renewal exists, allow new renewal
        $canRenew = $isExpired && !$hasPendingRenewal;

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
            'expiryDate' => $expiryDate->format('Y-m-d'),
            'isExpired' => $isExpired,
            'hasPendingRenewal' => $hasPendingRenewal,
            'canRenew' => $canRenew,
            'renewals' => $renewals,
            'lastApprovedRenewal' => $lastApprovedRenewal,
        ]);
    }
}
