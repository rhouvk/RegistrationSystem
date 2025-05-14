<?php

namespace App\Http\Controllers;

use App\Models\PWDRegistration;
use App\Models\AdminControl;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            $records = PWDRegistration::with(['user', 'disabilityType', 'barangay'])->get();
            $admin = AdminControl::first();
            $cardExpirationYears = $admin->cardExpiration ?? 5;

            $currentYear = Carbon::now()->year;
            $typeList = collect([
                ['name' => 'Deaf or Hard of Hearing', 'color' => '#0B3B46'],
                ['name' => 'Intellectual Disability', 'color' => '#1F5562'],
                ['name' => 'Learning Disability', 'color' => '#2F7E91'],
                ['name' => 'Mental Disability', 'color' => '#3EA9BD'],
                ['name' => 'Physical Disability', 'color' => '#5DC8D9'],
                ['name' => 'Psychosocial Disability', 'color' => '#84D7E3'],
                ['name' => 'Speech and Language Impairment', 'color' => '#AADFE8'],
                ['name' => 'Visual Disability', 'color' => '#C5ECF4'],
                ['name' => 'Cancer', 'color' => '#E0F6FA'],
                ['name' => 'Rare Disease', 'color' => '#F4FCFD'],
            ]);

            $yearData = [];
            $totalMale = 0;
            $totalFemale = 0;
            $adminDistrictData = [];
            $educationData = [];
            $employmentData = [];

            foreach ($records as $pwd) {
                $dateApplied = optional($pwd->dateApplied);
                $appliedYear = $dateApplied?->year;
                if (!$appliedYear) continue;

                $year = (string) $appliedYear;

                foreach ([$year, 'overall'] as $key) {
                    if (!isset($yearData[$key])) {
                        $yearData[$key] = [
                            'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                            'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                            'disabilities' => $typeList->map(fn($t) => array_merge($t, ['count' => 0]))->toArray(),
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

                // Disability Types
                $typeName = $pwd->disabilityType->name ?? null;
                if ($typeName) {
                    foreach ([$year, 'overall'] as $key) {
                        foreach ($yearData[$key]['disabilities'] as &$entry) {
                            if (strtolower($entry['name']) === strtolower($typeName)) {
                                $entry['count']++;
                                break;
                            }
                        }
                    }
                }

                // Admin District Chart Data
                $district = optional($pwd->barangay)->admin_district ?? 'Unassigned';
                if (!isset($adminDistrictData[$district])) {
                    $adminDistrictData[$district] = 0;
                }
                $adminDistrictData[$district]++;

                // Education
                $edu = $pwd->education ?? 'Unspecified';
                if (!isset($educationData[$edu])) $educationData[$edu] = 0;
                $educationData[$edu]++;

                // Employment Status
                $emp = $pwd->employmentStatus ?? 'Unspecified';
                if (!isset($employmentData[$emp])) $employmentData[$emp] = 0;
                $employmentData[$emp]++;
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
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load dashboard data.']);
        }
    }
}
