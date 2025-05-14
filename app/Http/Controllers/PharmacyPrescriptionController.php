<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\PWDRegistration;
use App\Models\Prescription;
use App\Models\PrescriptionFilling;
use Carbon\Carbon;
use App\Models\AdminControl;

class PharmacyPrescriptionController extends Controller
{
    public function index()
    {
        $fillings = PrescriptionFilling::with(['prescription.buyer'])
            ->where('drugstore_id', auth()->id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Pharmacy/PrescriptionLog', [
            'prescriptions' => $fillings,
        ]);
    }

    public function create(Request $request)
    {
        $pwdNumber = $request->input('pwd_number', '');
        $pwdUser = null;
        $expiryDate = null;
        $isExpired = false;
        $years = null; // ✅ Set default so it's always defined
    
        if ($pwdNumber) {
            $pwdUser = PWDRegistration::with('user')->where('pwdNumber', $pwdNumber)->first();
    
            if (!$pwdUser) {
                return Redirect::route('pharmacy.prescriptions.create')
                    ->withErrors(['pwd_number' => 'No PWD found with that number.'])
                    ->withInput();
            }
    
            $control = AdminControl::first(); // assuming there's only one row
            $years = $control?->cardExpiration ?? 4;
    
            $updatedAt = $pwdUser->updated_at;
            $expiryDate = \Carbon\Carbon::parse($updatedAt)->addYears($years)->format('Y-m-d');
            $isExpired = \Carbon\Carbon::now()->greaterThan($expiryDate);
        }
    
        \Log::info('Prescription Lookup Debug', [
            'pwd_number' => $pwdNumber,
            'user_found' => $pwdUser ? true : false,
            'user_id' => $pwdUser?->user_id,
            'updated_at' => $pwdUser?->updated_at,
            'card_expiration_years' => $years,
            'calculated_expiry' => $expiryDate,
            'is_expired' => $isExpired,
        ]);
    
        return Inertia::render('Pharmacy/RecordPrescription', [
            'pwdUser' => $pwdUser,
            'expiryDate' => $expiryDate,
            'isExpired' => $isExpired,
        ]);
    }
    
    public function store(Request $request)
    {
        Log::info('Prescription Store Request', $request->all());

        $validated = $request->validate([
            'date'               => 'required|date',
            'physician_name'     => 'required|string',
            'physician_address'  => 'required|string',
            'physician_ptr_no'   => 'required|string',
            'pharmacist_name'    => 'required|string',
            'buyer_id'           => 'required|exists:users,id',
            'entries'            => 'required|array|min:1',
            'entries.*.medicine_purchase'   => 'required|string',
            'entries.*.quantity_prescribed' => 'required|integer|min:1',
            'entries.*.quantity_filled'      => 'required|integer|min:0',
        ]);

        foreach ($validated['entries'] as $entry) {
            try {
                $quantityPrescribed = (int) $entry['quantity_prescribed'];
                $filledNow = (int) $entry['quantity_filled'];
                $amount = max($filledNow, 0);
                $status = ($filledNow >= $quantityPrescribed) ? 3 : 1; // 3 = Fully Filled, 1 = First Filling


                $prescription = Prescription::create([
                    'buyer_id'            => $validated['buyer_id'],
                    'medicine_purchase'   => $entry['medicine_purchase'],
                    'quantity_prescribed' => $quantityPrescribed,
                    'date'                => $validated['date'],
                    'physician_name'      => $validated['physician_name'],
                    'physician_address'   => $validated['physician_address'],
                    'physician_ptr_no'    => $validated['physician_ptr_no'],
                    'created_by'          => auth()->id(),
                ]);

                $filling = PrescriptionFilling::create([
                    'prescription_id' => $prescription->id,
                    'drugstore_id'    => auth()->id(),
                    'pharmacist_name' => $validated['pharmacist_name'],
                    'filling_status'   => $status,
                    'filling_amount'  => $amount,
                ]);

                Log::info('Prescription and filling saved', [
                    'prescription' => $prescription->id,
                    'filling' => $filling->id,
                ]);

            } catch (\Exception $e) {
                Log::error('Failed to save prescription or filling', [
                    'entry' => $entry,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return Redirect::route('pharmacy.prescriptions.create')
            ->with('success', 'Prescription(s) recorded successfully.');
    }
}
