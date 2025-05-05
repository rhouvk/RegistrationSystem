<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayMongoController extends Controller
{
    public function subscribe(Request $request)
    {
        $email = $request->input('email');
        $amount = 19900; // ₱199.00 in centavos

        try {
            $response = Http::withBasicAuth(config('services.paymongo.secret'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'description' => 'GCash Subscription',
                        'send_email_receipt' => true,
                        'show_description' => true,
                        'show_line_items' => true,
                        'cancel_url' => url('/subscribe/cancel'),
                        'success_url' => url('/subscribe/success'),
                        'payment_method_types' => ['gcash'],
                        'line_items' => [[
                            'currency' => 'PHP',
                            'amount' => 19900,
                            'description' => 'Monthly Subscription',
                            'name' => 'PWD Na To Analytics Package',
                            'quantity' => 1,
                        ]],
                        'billing' => [
                            'name' => $email,
                            'email' => $email,
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

            return response()->json([
                'checkout_url' => $checkoutUrl,
            ]);

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
}
