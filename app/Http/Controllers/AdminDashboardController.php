<?php

namespace App\Http\Controllers;

use App\Models\PWDRegistration;
use App\Models\PWDRenewalAndPreregistration;
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

            $emptyYearData = [
                'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                'disabilities' => collect($typeMap)->map(fn($t) => $t + ['count' => 0])->values()->toArray(),
                'adminDistrictData' => [],
                'educationData' => [],
                'employmentData' => [],
                'ageGroups' => [
                    '0-16' => 0,
                    '17-30' => 0,
                    '31-45' => 0,
                    '46-59' => 0,
                    '60+' => 0,
                ],
            ];

            $yearData = [
                'overall' => $emptyYearData,
                $currentYear => $emptyYearData,
            ];
            
            $totalMale = 0;
            $totalFemale = 0;
            $overallStatus = ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0];

            // Count renewals from PWDRenewalAndPreregistration
            $renewalCount = PWDRenewalAndPreregistration::where('registration_type', 3)
                ->whereYear('dateApplied', $currentYear)
                ->count();

            foreach ($records as $pwd) {
                $dateApplied = optional($pwd->dateApplied);
                $appliedYear = $dateApplied?->year;
                if (!$appliedYear) continue;

                $year = (string) $appliedYear;
                if (!isset($yearData[$year])) {
                    $yearData[$year] = array_merge([], $emptyYearData);
                }

                // Gender
                $genderKey = strtolower($pwd->sex) === 'female' ? 'female' : 'male';
                $yearData[$year]['registered'][$genderKey]++;
                $yearData[$year]['registered']['total']++;
                $yearData['overall']['registered'][$genderKey]++;
                $yearData['overall']['registered']['total']++;

                if ($genderKey === 'female') $totalFemale++;
                if ($genderKey === 'male') $totalMale++;

                // Status (Overall only)
                $created = Carbon::parse($pwd->created_at);
                $updated = Carbon::parse($pwd->updated_at);
                $expiryDate = $dateApplied->copy()->addYears($cardExpirationYears);

                if ($dateApplied->year === $currentYear) {
                    $overallStatus['new']++;
                }

                if ($expiryDate->lt(Carbon::now())) {
                    $overallStatus['expired']++;
                }

                $overallStatus['total']++;

                // Disability
                $typeName = $pwd->disabilityType->name ?? null;
                if ($typeName) {
                    foreach ($yearData[$year]['disabilities'] as &$entry) {
                        if ($entry['name'] === $typeName) {
                            $entry['count']++;
                            break;
                        }
                    }
                    foreach ($yearData['overall']['disabilities'] as &$entry) {
                        if ($entry['name'] === $typeName) {
                            $entry['count']++;
                            break;
                        }
                    }
                }

                // Admin District
                $district = optional($pwd->barangay?->adminDistrict)->name ?? 'Unassigned';
                if (!isset($yearData[$year]['adminDistrictData'][$district])) {
                    $yearData[$year]['adminDistrictData'][$district] = 0;
                }
                $yearData[$year]['adminDistrictData'][$district]++;
                if (!isset($yearData['overall']['adminDistrictData'][$district])) {
                    $yearData['overall']['adminDistrictData'][$district] = 0;
                }
                $yearData['overall']['adminDistrictData'][$district]++;

                // Education
                $edu = $pwd->education ?? 'Unspecified';
                if (!isset($yearData[$year]['educationData'][$edu])) {
                    $yearData[$year]['educationData'][$edu] = 0;
                }
                $yearData[$year]['educationData'][$edu]++;
                if (!isset($yearData['overall']['educationData'][$edu])) {
                    $yearData['overall']['educationData'][$edu] = 0;
                }
                $yearData['overall']['educationData'][$edu]++;

                // Employment
                $emp = $pwd->employmentStatus ?? 'Unspecified';
                if (!isset($yearData[$year]['employmentData'][$emp])) {
                    $yearData[$year]['employmentData'][$emp] = 0;
                }
                $yearData[$year]['employmentData'][$emp]++;
                if (!isset($yearData['overall']['employmentData'][$emp])) {
                    $yearData['overall']['employmentData'][$emp] = 0;
                }
                $yearData['overall']['employmentData'][$emp]++;

                // Age Group
                if ($pwd->dob) {
                    $age = Carbon::parse($pwd->dob)->age;
                    $ageGroup = '';
                    if ($age <= 16) $ageGroup = '0-16';
                    elseif ($age <= 30) $ageGroup = '17-30';
                    elseif ($age <= 45) $ageGroup = '31-45';
                    elseif ($age <= 59) $ageGroup = '46-59';
                    else $ageGroup = '60+';

                    $yearData[$year]['ageGroups'][$ageGroup]++;
                    $yearData['overall']['ageGroups'][$ageGroup]++;
                }
            }

            // Set the renewal count from PWDRenewalAndPreregistration
            $overallStatus['renewed'] = $renewalCount;

            return Inertia::render('Admin/Dashboard', [
                'yearData' => $yearData,
                'maleCount' => $totalMale,
                'femaleCount' => $totalFemale,
                'overallStatus' => $overallStatus,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load dashboard data.']);
        }
    }
}
