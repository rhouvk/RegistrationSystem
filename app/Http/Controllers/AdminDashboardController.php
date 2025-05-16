<?php

namespace App\Http\Controllers;

use App\Models\PWDRegistration;
use App\Models\AdminControl;
use App\Models\DisabilityList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            $records = PWDRegistration::with(['user', 'disabilityType', 'barangay.adminDistrict'])->get();
            $admin = AdminControl::first();
            $cardExpirationYears = $admin->cardExpiration ?? 5;

            $currentYear = Carbon::now()->year;
            $earliestYear = $currentYear - 4; // Only keep last 5 years

            $typeList = DisabilityList::where('category', 'Type')->get()->values();
            $colors = ['#0B3B46','#1F5562','#2F7E91','#3EA9BD','#5DC8D9','#84D7E3','#AADFE8','#C5ECF4','#E0F6FA','#F4FCFD'];

            $typeMap = [];
            foreach ($typeList as $index => $type) {
                $typeMap[$type->name] = [
                    'name' => $type->name,
                    'color' => $colors[$index % count($colors)],
                    'count' => 0
                ];
            }

            $yearData = [];
            $totalMale = 0;
            $totalFemale = 0;
            $adminDistrictData = [];
            $educationData = [];
            $employmentData = [];
            $ageGroups = [
                '0-16' => 0,
                '17-30' => 0,
                '31-45' => 0,
                '46-59' => 0,
                '60+' => 0,
            ];

            foreach ($records as $pwd) {
                $dateApplied = optional($pwd->dateApplied);
                $appliedYear = $dateApplied?->year;
                if (!$appliedYear) continue;

                $year = (string) $appliedYear;
                $isWithinLast5Years = $appliedYear >= $earliestYear;
                $groupYears = $isWithinLast5Years ? [$year, 'overall'] : ['overall'];

                foreach ($groupYears as $key) {
                    if (!isset($yearData[$key])) {
                        $yearData[$key] = [
                            'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                            'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                            'disabilities' => collect($typeMap)->map(fn($t) => $t + ['count' => 0])->values()->toArray(),
                        ];
                    }
                }

                $year = (string) $appliedYear;
                foreach ([$year, 'overall'] as $key) {
                    if (!isset($yearData[$key])) {
                        $yearData[$key] = [
                            'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                            'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                            'disabilities' => collect($typeMap)->map(fn($t) => $t + ['count' => 0])->values()->toArray(),
                        ];
                    }
                }

                // Gender
                $genderKey = strtolower($pwd->sex) === 'female' ? 'female' : 'male';
                $yearData[$year]['registered'][$genderKey]++;
                $yearData[$year]['registered']['total']++;
                $yearData['overall']['registered'][$genderKey]++;
                $yearData['overall']['registered']['total']++;

                if ($genderKey === 'female') $totalFemale++;
                if ($genderKey === 'male') $totalMale++;

                // Status
                $created = Carbon::parse($pwd->created_at);
                $updated = Carbon::parse($pwd->updated_at);
                $expiryDate = $dateApplied->copy()->addYears($cardExpirationYears);

                if ($dateApplied->year === $currentYear) {
                    $yearData[$year]['status']['new']++;
                    $yearData['overall']['status']['new']++;
                }

                if (
                    $updated->year === $currentYear &&
                    $updated->diffInDays($created) >= 3
                ) {
                    $yearData[$year]['status']['renewed']++;
                    $yearData['overall']['status']['renewed']++;
                }

                if ($expiryDate->lt(Carbon::now())) {
                    $yearData[$year]['status']['expired']++;
                    $yearData['overall']['status']['expired']++;
                }

                $yearData[$year]['status']['total']++;
                $yearData['overall']['status']['total']++;

                // Disability
                $typeName = $pwd->disabilityType->name ?? null;
                if ($typeName) {
                    foreach ([$year, 'overall'] as $key) {
                        foreach ($yearData[$key]['disabilities'] as &$entry) {
                            if ($entry['name'] === $typeName) {
                                $entry['count']++;
                                break;
                            }
                        }
                    }
                }

                // Admin District
                $district = optional($pwd->barangay?->adminDistrict)->name ?? 'Unassigned';
                if (!isset($adminDistrictData[$district])) $adminDistrictData[$district] = 0;
                $adminDistrictData[$district]++;

                // Education
                $edu = $pwd->education ?? 'Unspecified';
                if (!isset($educationData[$edu])) $educationData[$edu] = 0;
                $educationData[$edu]++;

                // Employment
                $emp = $pwd->employmentStatus ?? 'Unspecified';
                if (!isset($employmentData[$emp])) $employmentData[$emp] = 0;
                $employmentData[$emp]++;

                // Age Group
                if ($pwd->dob) {
                    $age = Carbon::parse($pwd->dob)->age;
                    if ($age <= 16) $ageGroups['0-16']++;
                    elseif ($age <= 30) $ageGroups['17-30']++;
                    elseif ($age <= 45) $ageGroups['31-45']++;
                    elseif ($age <= 59) $ageGroups['46-59']++;
                    else $ageGroups['60+']++;
                }
            }

            $validYears = array_keys($yearData);
            rsort($validYears);

            return Inertia::render('Admin/Dashboard', [
                'yearData' => $yearData,
                'maleCount' => $totalMale,
                'femaleCount' => $totalFemale,
                'adminDistrictData' => $adminDistrictData,
                'educationData' => $educationData,
                'employmentData' => $employmentData,
                'ageGroups' => $ageGroups,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load dashboard data.']);
        }
    }
}
