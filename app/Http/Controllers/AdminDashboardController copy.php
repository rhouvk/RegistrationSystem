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
            $records = PWDRegistration::with(['user', 'disabilityType'])->get();
            $admin = AdminControl::first();
            $cardExpirationYears = $admin->cardExpiration ?? 5;

            $currentYear = Carbon::now()->year;
            $minYear = $currentYear - 4;

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

            foreach ($records as $pwd) {
                $dateApplied = optional($pwd->dateApplied);
                $appliedYear = $dateApplied?->year;

                if (!$appliedYear) continue;

                $year = (string) $appliedYear;

                // Initialize per-year bucket
                if (!isset($yearData[$year])) {
                    $yearData[$year] = [
                        'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                        'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                        'disabilities' => $typeList->map(fn($t) => array_merge($t, ['count' => 0]))->toArray(),
                    ];
                }

                // Initialize overall bucket
                if (!isset($yearData['overall'])) {
                    $yearData['overall'] = [
                        'registered' => ['female' => 0, 'male' => 0, 'total' => 0],
                        'status' => ['new' => 0, 'renewed' => 0, 'expired' => 0, 'total' => 0],
                        'disabilities' => $typeList->map(fn($t) => array_merge($t, ['count' => 0]))->toArray(),
                    ];
                }

                // Gender
                $genderKey = strtolower($pwd->sex) === 'female' ? 'female' : 'male';
                $yearData[$year]['registered'][$genderKey]++;
                $yearData[$year]['registered']['total']++;
                $yearData['overall']['registered'][$genderKey]++;
                $yearData['overall']['registered']['total']++;

                if ($genderKey === 'female') $totalFemale++;
                if ($genderKey === 'male') $totalMale++;

                // Status - Now calculated without year restrictions
                $created = Carbon::parse($pwd->created_at);
                $updated = Carbon::parse($pwd->updated_at);
                $expiryDate = $dateApplied->copy()->addYears($cardExpirationYears);

                // For yearly data
                if ($created->year === $appliedYear) {
                    $yearData[$year]['status']['new']++;
                } elseif ($updated->diffInDays($created) >= 3) {
                    $yearData[$year]['status']['renewed']++;
                }
                if ($expiryDate->lt(Carbon::now())) {
                    $yearData[$year]['status']['expired']++;
                }
                $yearData[$year]['status']['total']++;

                // For overall data - count all statuses
                if ($created->eq($dateApplied)) {
                    $yearData['overall']['status']['new']++;
                } elseif ($updated->diffInDays($created) >= 3) {
                    $yearData['overall']['status']['renewed']++;
                }
                if ($expiryDate->lt(Carbon::now())) {
                    $yearData['overall']['status']['expired']++;
                }
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
            }

            // Sort years descending
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