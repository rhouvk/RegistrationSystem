<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;
use App\Models\Subscription;

class PayMongoController extends Controller
{
    public function subscribe(Request $request)
    {
        $user = $request->user();
        $duration = $request->input('duration', 'monthly');

        $amounts = [
            'monthly' => 2500,
            'semiannual' => 12000,
            'annual' => 22500,
        ];

        $amount = $amounts[$duration] ?? 19900;

        try {
            Session::put('subscription_duration', $duration); // Store duration in session

            $response = Http::withBasicAuth(config('services.paymongo.secret'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'description' => ucfirst($duration) . ' Subscription',
                            'send_email_receipt' => true,
                            'show_description' => true,
                            'show_line_items' => true,
                            'cancel_url' => url('/subscribe/cancel'),
                            'success_url' => url('/subscribe/success'),
                            'payment_method_types' => ['gcash', 'grab_pay', 'paymaya'],
                            'line_items' => [[
                                'currency' => 'PHP',
                                'amount' => $amount,
                                'description' => ucfirst($duration) . ' Subscription',
                                'name' => 'PWD Na To Analytics Access',
                                'quantity' => 1,
                            ]],
                            'billing' => [
                                'name' => $user->name,
                                'email' => $user->email,
                            ],
                        ]
                    ]
                ]);

            if ($response->failed()) {
                Log::error('❌ PayMongo subscription failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'message' => 'Failed to create PayMongo checkout session.',
                    'details' => $response->json(),
                ], 500);
            }

            $checkoutUrl = $response->json('data.attributes.checkout_url');

            return response()->json(['checkout_url' => $checkoutUrl]);

        } catch (\Exception $e) {
            Log::error('❌ Exception during PayMongo checkout creation', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unexpected server error.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $user = Auth::user();
        $duration = Session::pull('subscription_duration', 'monthly');

        $months = match ($duration) {
            'semiannual' => 6,
            'annual' => 12,
            default => 1,
        };

        $now = Carbon::now();
        $latest = $user->subscriptions()->latest('ends_at')->first();
        $startsAt = $latest && $latest->ends_at > $now ? $latest->ends_at : $now;

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'payment_id' => uniqid('pm_', true), // Ideally: PayMongo payment ID from webhook
            'amount' => match ($duration) {
                'semiannual' => 120,
                'annual' => 225,
                default => 25,
            },
            'duration' => $duration,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addMonths($months),
        ]);

        Log::info('✅ Subscription recorded', ['subscription' => $subscription]);

        return redirect()->route(
            $user->role === 3 ? 'pharmacy.dashboard' :
            ($user->role === 2 ? 'business.dashboard' :
            ($user->role === 1 ? 'admin.dashboard' : 'pwd.dashboard'))
        )->with('success', '✅ Subscription successful until ' . $subscription->ends_at->toFormattedDateString());
    }
}
