<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\PrescriptionFilling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PharmacyPrescriptionEditController extends Controller
{
public function edit($id)
{
    $prescription = Prescription::with('fillings')->findOrFail($id);
    $user = Auth::user();

    $canEditPrescription = $prescription->created_by === $user->id;
    $editableFillings = $prescription->fillings->where('drugstore_id', $user->id)->values();

    $totalFilledByOthers = $prescription->fillings
        ->where('drugstore_id', '!=', $user->id)
        ->sum('filling_amount');

    return Inertia::render('Pharmacy/EditPrescription', [
        'prescription' => $prescription,
        'editableFillings' => $editableFillings,
        'totalFilledByOthers' => $totalFilledByOthers,
        'canEditPrescription' => $canEditPrescription, // ✅ Add this
    ]);
}

public function update(Request $request, $id)
{
    Log::info('Prescription Update Request', $request->all());

    $prescription = Prescription::with('fillings')->findOrFail($id);

    $validated = $request->validate([
        'medicine_purchase' => 'required|string|max:255',
        'quantity_prescribed' => 'required|numeric|min:1',
        'physician_name' => 'nullable|string|max:255',
        'physician_address' => 'nullable|string|max:255',
        'physician_ptr_no' => 'nullable|string|max:255',
        'fillings' => 'required|array',
        'fillings.*.id' => 'required|exists:prescription_fillings,id',
        'fillings.*.filling_amount' => 'required|numeric|min:1',
    ]);

    // ✅ Allow updating the prescription only if created_by matches
    if ($prescription->created_by === auth()->id()) {
        $prescription->update([
            'medicine_purchase' => $validated['medicine_purchase'],
            'quantity_prescribed' => $validated['quantity_prescribed'],
            'physician_name' => $validated['physician_name'],
            'physician_address' => $validated['physician_address'],
            'physician_ptr_no' => $validated['physician_ptr_no'],
        ]);
        Log::info("Prescription metadata updated", ['prescription_id' => $prescription->id]);
    }

    foreach ($validated['fillings'] as $update) {
        $filling = PrescriptionFilling::with('prescription')->find($update['id']);

        if (!$filling || $filling->drugstore_id !== auth()->id()) {
            Log::warning("Unauthorized or invalid access to filling ID {$update['id']}");
            continue;
        }

        $allFillings = PrescriptionFilling::where('prescription_id', $prescription->id)->get();
        $totalFilledExcludingThis = $allFillings->where('id', '!=', $filling->id)->sum('filling_amount');

        $newAmount = min($update['filling_amount'], max(0, $prescription->quantity_prescribed - $totalFilledExcludingThis));

        $filling->update(['filling_amount' => $newAmount]);

        Log::info("Filling amount updated", [
            'filling_id' => $filling->id,
            'new_amount' => $newAmount,
        ]);

        $totalNowFilled = $totalFilledExcludingThis + $newAmount;

        $existingStatuses = $allFillings
            ->where('id', '!=', $filling->id)
            ->pluck('filling_status')
            ->unique()
            ->toArray();

        if ($totalNowFilled >= $prescription->quantity_prescribed) {
            if ($filling->filling_status !== 3) {
                $filling->update(['filling_status' => 3]);
                Log::info("Updated to final fill: ID {$filling->id}");
            }
        } else {
            if ($filling->filling_status === 3) {
                if (!in_array(1, $existingStatuses)) {
                    $filling->update(['filling_status' => 1]);
                    Log::info("Downgraded status to 1 (no other 1 exists)", ['filling_id' => $filling->id]);
                } elseif (!in_array(2, $existingStatuses)) {
                    $filling->update(['filling_status' => 2]);
                    Log::info("Downgraded status to 2 (no other 2 exists)", ['filling_id' => $filling->id]);
                } else {
                    Log::info("Kept status 3 (1 and 2 already exist)", ['filling_id' => $filling->id]);
                }
            }
        }
    }

    return redirect()->route('pharmacy.prescriptions.log')->with('success', 'Prescription(s) updated successfully.');
}


}
