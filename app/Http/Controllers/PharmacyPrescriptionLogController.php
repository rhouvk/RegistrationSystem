<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrescriptionFilling;
use App\Models\PWDRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PharmacyPrescriptionLogController extends Controller
{
    public function index()
    {
        $pharmacyId = Auth::id();

        // Get all prescription fillings done by this pharmacy
        $fillings = PrescriptionFilling::with([
                'prescription.buyer.pwdRegistration', // nested relations
            ])
            ->where('drugstore_id', $pharmacyId)
            ->latest()
            ->get()
            ->map(function ($filling) {
                $prescription = $filling->prescription;
                $totalFilled = $prescription->fillings->sum('filling_amount');
                $balance = max($prescription->quantity_prescribed - $totalFilled, 0);

                $pwd = $prescription->buyer->pwdRegistration ?? null;

                return [
                    'id'                         => $prescription->id, // ✅ this is required!
                    'date'                      => $filling->created_at->toDateString(),
                    'pwd_number'                  => $pwd?->pwdNumber ?? '—',
                    'medicine_purchase'             => $prescription->medicine_purchase,
                    'quantity_prescribed'         => $prescription->quantity_prescribed,
                    'quantity_filled'             => $filling->filling_amount,
                    'balance'                     => $balance,
                    'filling_status_label' => $filling->filling_status,
                    'physician_name'             => $prescription->physician_name,
                    'physician_ptr_no'             => $prescription->physician_ptr_no,
                    'pharmacist_name'             => $filling->pharmacist_name,
                    'physician_address'           => $prescription->physician_address ?? '—', // Add this line
                ];
            });


        return Inertia::render('Pharmacy/PrescriptionLog', [
            'prescriptions' => $fillings,
        ]);
    }
}
