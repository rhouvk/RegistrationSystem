<?php

namespace App\Http\Controllers;
use App\Models\AdminControl;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use Vinkla\Hashids\Facades\Hashids;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PWDScannerController extends Controller
{
    public function findByHashId(Request $request)
    {
        if (!$request->ajax()) {
            return redirect()->route('/');
        }
    
        $hash = $request->input('hashid');
        Log::info('Received hashid:', ['hashid' => $hash]);
        
        $decoded = Hashids::decode($hash);
        Log::info('Decoded ID:', ['decoded' => $decoded]);
    
        if (count($decoded) === 0) {
            return response()->json(['error' => 'Invalid or corrupted barcode.'], 400);
        }
    
        $id = $decoded[0];
        
        // Log raw SQL query
        DB::enableQueryLog();
        
        $user = PWDRegistration::select([
            'id',
            'user_id',
            'pwdNumber',
            'photo',
            'updated_at',
            'disability_type_id'
        ])->with([
            'user' => function($query) {
                $query->select('id', 'name');
            },
            'disabilityType' => function($query) {
                $query->select('id', 'name')
                      ->where('category', 'Type');
            }
        ])->find($id);
        
        // Log the executed queries
        Log::info('Executed Queries:', ['queries' => DB::getQueryLog()]);
        DB::disableQueryLog();
    
        if (!$user) {
            Log::error('No user found for ID:', ['id' => $id]);
            return response()->json(['error' => 'No user found for this ID.'], 404);
        }

        // Log the complete user object
        Log::info('Found User Object:', [
            'user_complete' => $user->toArray(),
            'disability_type_raw' => $user->disability_type_id,
            'disability_relation' => $user->disabilityType?->toArray() ?? 'null',
            'user_relation' => $user->user?->toArray() ?? 'null'
        ]);
    
        $controls = AdminControl::first();
        $years = $controls?->cardExpiration ?? 3;
        $validUntil = Carbon::parse($user->updated_at)->addYears($years)->toDateString();
    
        $response = [
            'user' => $user->toArray(),
            'valid_until' => $validUntil,
        ];
        
        // Log the final response
        Log::info('Sending Response:', $response);
    
        return response()->json($response);
    }
    
}
