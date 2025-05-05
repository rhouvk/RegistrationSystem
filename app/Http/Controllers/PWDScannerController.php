<?php

namespace App\Http\Controllers;
use App\Models\AdminControl;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use Vinkla\Hashids\Facades\Hashids;

class PWDScannerController extends Controller
{
    public function findByHashId(Request $request)
    {
        if (!$request->ajax()) {
            return redirect()->route('/');
        }
    
        $hash = $request->input('hashid');
        $decoded = Hashids::decode($hash);
    
        if (count($decoded) === 0) {
            return response()->json(['error' => 'Invalid or corrupted barcode.'], 400);
        }
    
        $id = $decoded[0];
    
        $user = PWDRegistration::with([
            'user',
            'disabilitytype',
            'disabilitycause',
            'barangay',
            'municipality',
            'province',
            'region',
        ])->find($id);
    
        if (!$user) {
            return response()->json(['error' => 'No user found for this ID.'], 404);
        }
    
        // ✅ Only ONE return — with valid_until included
        $controls = AdminControl::first();
        $years = $controls?->cardExpiration ?? 3;
        $validUntil = Carbon::parse($user->updated_at)->addYears($years)->toDateString();
    
        return response()->json([
            'user' => $user,
            'valid_until' => $validUntil,
        ]);
    }
    
}
