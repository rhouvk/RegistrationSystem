<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrescriptionFilling;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PharmacyPrescriptionLogController extends Controller
{
    public function index()
    {
        $pharmacyId = Auth::id();

        // Get all prescription fillings done by this pharmacy
        $fillings = PrescriptionFilling::with(['prescription.buyer'])
            ->where('drugstore_id', $pharmacyId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($filling) {
                return [
                    'date'                 => $filling->created_at->toDateString(),
                    'medicine_purchase'    => $filling->prescription->medicine_purchase,
                    'quantity_prescribed'  => $filling->prescription->quantity_prescribed,
                    'physician_name'       => $filling->prescription->physician_name,
                    'physician_ptr_no'     => $filling->prescription->physician_ptr_no,
                    'buyer'                => [
                        'name' => $filling->prescription->buyer->name ?? '—',
                    ],
                    'filling_status_label' => $filling->filling_status_label,
                    'pharmacist_name'      => $filling->pharmacist_name,
                ];
            });

        return Inertia::render('Pharmacy/PrescriptionLog', [
            'prescriptions' => $fillings,
        ]);
    }
}
