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
            $records = PWDRegistration::with('user')->get();
            $admin = AdminControl::first();
            $cardExpirationYears = $admin->cardExpiration ?? 5;

            $currentYear = Carbon::now()->year;
            $minYearForChart = $currentYear - 4;

            $typeList = collect([
                ['name'=>'Deaf or Hard of Hearing', 'color'=>'#0B3B46'],
                ['name'=>'Intellectual Disability', 'color'=>'#1F5562'],
                ['name'=>'Learning Disability', 'color'=>'#2F7E91'],
                ['name'=>'Mental Disability', 'color'=>'#3EA9BD'],
                ['name'=>'Physical Disability', 'color'=>'#5DC8D9'],
                ['name'=>'Psychosocial Disability', 'color'=>'#84D7E3'],
                ['name'=>'Speech and Language Impairment', 'color'=>'#AADFE8'],
                ['name'=>'Visual Disability', 'color'=>'#C5ECF4'],
                ['name'=>'Cancer', 'color'=>'#E0F6FA'],
                ['name'=>'Rare Disease', 'color'=>'#F4FCFD'],
            ]);

            $yearData = [];
            $totalMale = 0;
            $totalFemale = 0;

            foreach ($records as $pwd) {
                $dateApplied = optional($pwd->dateApplied);
                $appliedYear = $dateApplied?->year;

                if (!$appliedYear) continue;

                $year = (string) $appliedYear;

                if (!isset($yearData[$year])) {
                    $yearData[$year] = [
                        'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                        'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                        'disabilities' => $typeList->map(fn($t) => array_merge($t, ['count' => 0]))->toArray(),
                    ];
                }

                // Gender counts
                $genderKey = strtolower($pwd->sex) === 'female' ? 'female' : 'male';
                $yearData[$year]['registered'][$genderKey]++;
                $yearData[$year]['registered']['total']++;

                if ($genderKey === 'female') $totalFemale++;
                if ($genderKey === 'male') $totalMale++;

                // Status - New
                if ($dateApplied->year === $currentYear) {
                    $yearData[$year]['status']['new']++;
                }

                // Status - Renewed
                $created = Carbon::parse($pwd->created_at);
                $updated = Carbon::parse($pwd->updated_at);

                if (
                    $created->year === $currentYear &&
                    $updated->diffInDays($created) >= 3
                ) {
                    $yearData[$year]['status']['renewed']++;
                }

                // Status - Expired
                $expiryDate = $dateApplied->copy()->addYears($cardExpirationYears);
                if ($expiryDate->lt(Carbon::now())) {
                    $yearData[$year]['status']['expired']++;
                }

                $yearData[$year]['status']['total']++;

                // Disabilities
                foreach ($pwd->disabilityTypes ?? [] as $type) {
                    foreach ($yearData[$year]['disabilities'] as &$entry) {
                        if (strtolower($entry['name']) === strtolower($type)) {
                            $entry['count']++;
                            break;
                        }
                    }
                }
            }

            // Sort all available years for full dropdown
            $validYears = array_keys($yearData);
            rsort($validYears);

            return Inertia::render('Admin/Dashboard', [
                'yearData' => $yearData,
                'maleCount' => $totalMale,
                'femaleCount' => $totalFemale,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load dashboard data.']);
        }
    }
}
