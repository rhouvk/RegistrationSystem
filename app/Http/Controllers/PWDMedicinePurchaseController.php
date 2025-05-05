<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Prescription;

class PWDMedicinePurchaseController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $prescriptions = Prescription::with(['fillings.drugstore'])
            ->where('buyer_id', $userId)
            ->orderByDesc('id') // Latest prescription first
            ->get()
            ->map(function ($prescription) {
                $sorted = $prescription->fillings->sortByDesc('created_at');
                $latest = $sorted->first();
                $totalFiled = $prescription->fillings->sum('filling_amount');
                $balance = max($prescription->quantity_prescribed - $totalFiled, 0);

                return [
                    'prescription_id'      => $prescription->id,
                    'medicine_purchase'    => $prescription->medicine_purchase,
                    'quantity_prescribed'  => $prescription->quantity_prescribed,
                    'date'                 => $prescription->date->toDateString(), // ✅ ensures date is serialized
                    'physician_name'       => $prescription->physician_name,
                    'physician_address'    => $prescription->physician_address,
                    'physician_ptr_no'     => $prescription->physician_ptr_no,
                    'latest_status'        => $latest?->filling_status,
                    'latest_status_label'  => $latest?->filling_status_label,
                    'balance'              => $balance,
                    'history'              => $sorted->map(fn ($f) => [
                        'filling_status'       => $f->filling_status,
                        'filling_status_label' => $f->filling_status_label,
                        'filling_amount'       => $f->filling_amount,
                        'created_at'           => $f->created_at->toDateTimeString(), // ✅ serialize timestamp
                        'pharmacist_name'      => $f->pharmacist_name,
                        'drugstore_name'       => $f->drugstore?->name ?? '—',
                    ])->values()->all(),
                ];
            });

        return Inertia::render('PWD/MedicinePurchase', [
            'mpEntries' => $prescriptions,
        ]);
    }
}
