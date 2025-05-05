<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\{PWDRegistration, Prescription, PrescriptionFilling};

class PharmacyUpdateController extends Controller
{
    public function lookup(Request $request)
    {
        $pwdNumber = $request->input('pwd_number', '');
        $pwdUser = null;
        $result = [];

        if ($pwdNumber) {
            $pwdUser = PWDRegistration::where('pwdNumber', $pwdNumber)->first();

            if (!$pwdUser) {
                return Redirect::route('pharmacy.prescriptions.update.create')
                    ->with('lookup_error', 'No PWD found with that number.');
            }

            $prescriptions = Prescription::where('buyer_id', $pwdUser->user_id)->get();

            foreach ($prescriptions as $prescription) {
                $fillings = PrescriptionFilling::where('prescription_id', $prescription->id)->get();

                $totalFilled = $fillings->sum('filling_amount');
                $latestFilling = $fillings->sortByDesc('created_at')->first();

                $remaining = max(0, $prescription->quantity_prescribed - $totalFilled);
                $status = $remaining === 0 ? 3 : ($latestFilling?->filling_status ?? 1);

                if ($remaining > 0) {
                    $prescription->total_filled = $totalFilled; // attach for frontend
                    $result[] = [
                        'id' => $latestFilling?->id,
                        'filling_status' => $status,
                        'filling_amount' => $remaining,
                        'prescription' => $prescription,
                    ];
                }
            }
        }

        return Inertia::render('Pharmacy/UpdatePrescription', [
            'pwdUser' => $pwdUser,
            'fillings' => $result,
        ]);
    }

    public function update(Request $request)
    {
        Log::info('Prescription Update Request', $request->all());

        $validated = $request->validate([
            'pharmacist_name' => 'required|string',
            'updates'         => 'required|array',
            'updates.*.id'    => 'required|exists:prescription_fillings,id',
            'updates.*.quantity_filled' => 'required|integer|min:1',
        ]);

        foreach ($validated['updates'] as $update) {
            $originalFilling = PrescriptionFilling::with('prescription')->find($update['id']);
            if (!$originalFilling || $originalFilling->filling_status === 3) continue;

            $prescription = $originalFilling->prescription;
            $prescribedQty = $prescription->quantity_prescribed;

            $totalPreviouslyFilled = PrescriptionFilling::where('prescription_id', $prescription->id)
                ->sum('filling_amount');

            $newTotal = $totalPreviouslyFilled + $update['quantity_filled'];

            $newStatus = $newTotal >= $prescribedQty ? 3 : ($originalFilling->filling_status === 1 ? 2 : 3);
            $actualFilled = min($update['quantity_filled'], max(0, $prescribedQty - $totalPreviouslyFilled));

            if ($actualFilled <= 0) continue;

            $newFilling = PrescriptionFilling::create([
                'prescription_id' => $prescription->id,
                'drugstore_id'    => auth()->id(),
                'pharmacist_name' => $validated['pharmacist_name'],
                'filling_status'  => $newStatus,
                'filling_amount'  => $actualFilled,
            ]);

            Log::info('New filling recorded', [
                'prescription_id' => $prescription->id,
                'filling_id' => $newFilling->id,
                'new_status' => $newStatus,
                'filled_now' => $actualFilled,
                'total_filled' => $newTotal,
            ]);
        }

        return Redirect::route('pharmacy.prescriptions.update.create')
            ->with('success', 'Prescription(s) updated successfully.');
    }
}
