<?php

namespace App\Http\Controllers;

use App\Models\PWDRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            // 1) Pull all PWD registrations with their user relationship
            $records = PWDRegistration::with('user')->get();

            // 2) Predefine disability types and colors
            $typeList = collect([
                ['name'=>'deaf',         'color'=>'#0B3B46'],
                ['name'=>'intellectual', 'color'=>'#1F5562'],
                ['name'=>'learning',     'color'=>'#2F7E91'],
                ['name'=>'mental',       'color'=>'#3EA9BD'],
                ['name'=>'physical',     'color'=>'#5DC8D9'],
                ['name'=>'psychosocial', 'color'=>'#84D7E3'],
                ['name'=>'speech',       'color'=>'#AADFE8'],
                ['name'=>'visual',       'color'=>'#C5ECF4'],
                ['name'=>'cancer',       'color'=>'#E0F6FA'],
                ['name'=>'rare',         'color'=>'#F4FCFD'],
            ]);

            // 3) Group records by applied year (or 'unknown' for missing dates)
            $grouped = $records->groupBy(function($pwd) {
                return optional($pwd->dateApplied)->format('Y') ?? 'unknown';
            });

            $yearData = [];

            foreach ($grouped as $year => $group) {
                // initialize structure
                $yearData[$year] = [
                    'registered'   => ['female'=>0, 'male'=>0, 'total'=>0],
                    'status'       => ['new'=>0, 'total'=>0],
                    'disabilities' => $typeList->map(fn($t) => array_merge($t, ['count'=>0]))->toArray(),
                ];

                foreach ($group as $pwd) {
                    // count by gender
                    $genderKey = strtolower($pwd->sex) === 'female' ? 'female' : 'male';
                    $yearData[$year]['registered'][$genderKey]++;
                    $yearData[$year]['registered']['total']++;

                    // mark as new
                    $yearData[$year]['status']['new']++;
                    $yearData[$year]['status']['total']++;

                    // tally each disability type, if present and in list
                    collect($pwd->disabilityTypes ?? [])->each(function($type) use (&$yearData, $year) {
                        $disabilities = &$yearData[$year]['disabilities'];
                        foreach ($disabilities as &$entry) {
                            if ($entry['name'] === $type) {
                                $entry['count']++;
                                break;
                            }
                        }
                    });
                }
            }

            // 4) Determine latest year for dashboard cards
            $years = array_filter(array_keys($yearData), fn($y) => $y !== 'unknown');
            rsort($years);
            $latest = $years[0] ?? null;

            // If no valid year, default counts to zero
            $maleCount = $femaleCount = 0;
            if ($latest && isset($yearData[$latest])) {
                $maleCount   = $yearData[$latest]['registered']['male'] ?? 0;
                $femaleCount = $yearData[$latest]['registered']['female'] ?? 0;
            }

            return Inertia::render('Admin/Dashboard', [
                'yearData'    => $yearData,
                'maleCount'   => $maleCount,
                'femaleCount' => $femaleCount,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load dashboard data.']);
        }
    }
}
