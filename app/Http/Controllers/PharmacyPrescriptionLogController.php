<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrescriptionFilling;
use App\Models\PWDRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PharmacyPrescriptionLogController extends Controller
{
    public function index(Request $request)
    {
        $pharmacyId = Auth::id();
        $perPage = $request->input('perPage', 12);
        $search = $request->input('search');

        // Build the query
        $query = PrescriptionFilling::with(['prescription.buyer.pwdRegistration'])
            ->where('drugstore_id', $pharmacyId);

        // Add search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('prescription.buyer.pwdRegistration', function ($q2) use ($search) {
                    $q2->where('pwdNumber', 'like', "%{$search}%");
                })
                ->orWhereHas('prescription', function ($q2) use ($search) {
                    $q2->where('medicine_purchase', 'like', "%{$search}%");
                });
            });
        }

        // Get paginated results
        $fillings = $query->latest()
            ->paginate($perPage)
            ->through(function ($filling) {
                $prescription = $filling->prescription;
                $totalFilled = $prescription->fillings->sum('filling_amount');
                $balance = max($prescription->quantity_prescribed - $totalFilled, 0);
                $pwd = $prescription->buyer->pwdRegistration ?? null;

                return [
                    'id' => $prescription->id,
                    'date' => $filling->created_at->toDateString(),
                    'pwd_number' => $pwd?->pwdNumber ?? '—',
                    'medicine_purchase' => $prescription->medicine_purchase,
                    'quantity_prescribed' => $prescription->quantity_prescribed,
                    'quantity_filled' => $filling->filling_amount,
                    'balance' => $balance,
                    'filling_status_label' => $filling->filling_status,
                    'physician_name' => $prescription->physician_name,
                    'physician_ptr_no' => $prescription->physician_ptr_no,
                    'pharmacist_name' => $filling->pharmacist_name,
                    'physician_address' => $prescription->physician_address ?? '—',
                ];
            });

        return Inertia::render('Pharmacy/PrescriptionLog', [
            'prescriptions' => $fillings,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }
}
