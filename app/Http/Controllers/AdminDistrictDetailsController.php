<?php

namespace App\Http\Controllers;

use App\Models\AdminDistrict;
use App\Models\PWDRegistration;
use App\Models\Barangay;
use Illuminate\Http\Request;

class AdminDistrictDetailsController extends Controller
{
    public function getDistrictDetails(Request $request, $districtName)
    {
        $district = AdminDistrict::where('name', $districtName)->firstOrFail();
        
        $barangays = Barangay::where('admin_district_id', $district->id)
            ->withCount([
                'pwdRegistrations',
                'pwdRegistrations as male_count' => function ($query) {
                    $query->where('sex', 'Male');
                },
                'pwdRegistrations as female_count' => function ($query) {
                    $query->where('sex', 'Female');
                },
            ])
            ->with(['pwdRegistrations' => function ($query) {
                $query->with('disabilityType');
            }])
            ->get();

        $disabilityStats = [];
        foreach ($barangays as $barangay) {
            foreach ($barangay->pwdRegistrations as $registration) {
                $typeName = $registration->disabilityType->name ?? 'Unspecified';
                if (!isset($disabilityStats[$typeName])) {
                    $disabilityStats[$typeName] = 0;
                }
                $disabilityStats[$typeName]++;
            }
        }

        return response()->json([
            'district' => $district->name,
            'barangays' => $barangays->map(function ($barangay) {
                return [
                    'name' => $barangay->name,
                    'total_population' => $barangay->pwd_registrations_count,
                    'male_count' => $barangay->male_count,
                    'female_count' => $barangay->female_count,
                ];
            }),
            'disability_stats' => $disabilityStats,
        ]);
    }
} 