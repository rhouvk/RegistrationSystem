<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use Vinkla\Hashids\Facades\Hashids;

class PWDScannerController extends Controller
{
    public function findByHashId(Request $request)
    {
        // ✅ Prevent full-page visits (Inertia safe)
        if (!$request->ajax()) {
            return redirect()->route('/'); // or your scanner UI route
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

        return response()->json(['user' => $user]);
    }
}
