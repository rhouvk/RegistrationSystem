<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function provinces(Request $request)
    {
        return Province::where('region_id', $request->region_id)
            ->orderBy('name')
            ->get();
    }

    public function municipalities(Request $request)
    {
        return Municipality::where('province_id', $request->province_id)
            ->orderBy('name')
            ->get();
    }

    public function barangays(Request $request)
    {
        return Barangay::where('municipality_id', $request->municipality_id)
            ->orderBy('name')
            ->get();
    }
} 