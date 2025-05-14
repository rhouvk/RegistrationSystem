<?php

namespace App\Http\Controllers;

use App\Models\PrescriptionFilling;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PharmacyDashboardController extends Controller
{
    public function index()
    {
        $pharmacyId = Auth::id();

        $fillings = PrescriptionFilling::with('prescription')
            ->where('drugstore_id', $pharmacyId)
            ->latest()
            ->get();

        $totalPrescriptions = $fillings->count();

        $recent = $fillings->first();
        $recentMedicine = $recent?->prescription?->medicine_purchase ?? '—';
        $recentDate     = $recent?->created_at ?? null;
        $pharmacistName = $recent?->pharmacist_name ?? '—';

        $topMedicines = $fillings
            ->groupBy(fn($f) => $f->prescription->medicine_purchase)
            ->map(fn($group) => $group->sum('filling_amount'))
            ->sortDesc()
            ->take(5)
            ->map(fn($totalFilled, $name) => ['name' => $name, 'count' => $totalFilled])
            ->values();

        return Inertia::render('Pharmacy/Dashboard', [
            'totalPrescriptions' => $totalPrescriptions,
            'recentMedicine'     => $recentMedicine,
            'recentDate'         => $recentDate,
            'topMedicines'       => $topMedicines,
            'pharmacistName'     => $pharmacistName,
        ]);
    }
}
