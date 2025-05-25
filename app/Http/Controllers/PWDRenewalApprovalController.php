<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PWDRenewalAndPreregistration;
use App\Models\PWDRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\DisabilityList;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;

class PWDRenewalApprovalController extends Controller
{
    public function index()
    {
        $renewals = PWDRenewalAndPreregistration::with(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay'])
            ->where('registration_type', 2) // 2 for renewal
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PWDRenewalApprovals', [
            'renewals' => $renewals
        ]);
    }

    public function show(PWDRenewalAndPreregistration $renewal)
    {
        $renewal->load(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay']);
        
        return Inertia::render('Admin/PWDRenewalApprovalDetail', [
            'renewal' => $renewal,
            'disabilityTypes' => DisabilityList::where('category', 'type')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'cause')->get(),
            'regions' => Region::all(),
            'provinces' => Province::where('region_id', $renewal->region_id)->get(),
            'municipalities' => Municipality::where('province_id', $renewal->province_id)->get(),
            'barangays' => Barangay::where('municipality_id', $renewal->municipality_id)->get(),
        ]);
    }

    public function approve(Request $request, PWDRenewalAndPreregistration $renewal)
    {
        try {
            DB::beginTransaction();

            // Get the existing PWD registration
            $pwdRegistration = PWDRegistration::where('user_id', $renewal->user_id)->first();

            if (!$pwdRegistration) {
                throw new \Exception('Original PWD registration not found');
            }

            // Only delete old files if they are different from new files
            if ($pwdRegistration->photo && $pwdRegistration->photo !== $request->photo) {
                if (Storage::disk('public')->exists($pwdRegistration->photo)) {
                    Storage::disk('public')->delete($pwdRegistration->photo);
                    Log::info('Deleted old photo from pwd_users:', ['path' => $pwdRegistration->photo]);
                }
            }

            if ($pwdRegistration->signature && $pwdRegistration->signature !== $request->signature) {
                if (Storage::disk('public')->exists($pwdRegistration->signature)) {
                    Storage::disk('public')->delete($pwdRegistration->signature);
                    Log::info('Deleted old signature from pwd_users:', ['path' => $pwdRegistration->signature]);
                }
            }

            // Update PWD registration with form data
            $pwdRegistration->update([
                'pwdNumber' => $request->pwdNumber,
                'dateApplied' => $request->dateApplied,
                'dob' => $request->dob,
                'sex' => $request->sex,
                'civilStatus' => $request->civilStatus,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'last_name' => $request->last_name,
                'suffix' => $request->suffix,
                'father_first_name' => $request->father_first_name,
                'father_middle_name' => $request->father_middle_name,
                'father_last_name' => $request->father_last_name,
                'mother_first_name' => $request->mother_first_name,
                'mother_middle_name' => $request->mother_middle_name,
                'mother_last_name' => $request->mother_last_name,
                'guardian_first_name' => $request->guardian_first_name,
                'guardian_middle_name' => $request->guardian_middle_name,
                'guardian_last_name' => $request->guardian_last_name,
                'disability_type_id' => $request->disability_type_id,
                'disability_cause_id' => $request->disability_cause_id,
                'region_id' => $request->region_id,
                'province_id' => $request->province_id,
                'municipality_id' => $request->municipality_id,
                'barangay_id' => $request->barangay_id,
                'house' => $request->house,
                'landline' => $request->landline,
                'education' => $request->education,
                'employmentStatus' => $request->employmentStatus,
                'employmentCategory' => $request->employmentCategory,
                'employmentType' => $request->employmentType,
                'occupation' => $request->occupation,
                'occupationOther' => $request->occupationOther,
                'organizationAffiliated' => $request->organizationAffiliated,
                'organizationContact' => $request->organizationContact,
                'organizationAddress' => $request->organizationAddress,
                'organizationTel' => $request->organizationTel,
                'sssNo' => $request->sssNo,
                'gsisNo' => $request->gsisNo,
                'pagIbigNo' => $request->pagIbigNo,
                'psnNo' => $request->psnNo,
                'philhealthNo' => $request->philhealthNo,
                'photo' => $request->photo,
                'signature' => $request->signature,
                'certifying_physician_first_name' => $request->certifying_physician_first_name,
                'certifying_physician_middle_name' => $request->certifying_physician_middle_name,
                'certifying_physician_last_name' => $request->certifying_physician_last_name,
                'physician_license_no' => $request->physician_license_no,
                'processing_officer_first_name' => $request->processing_officer_first_name,
                'processing_officer_middle_name' => $request->processing_officer_middle_name,
                'processing_officer_last_name' => $request->processing_officer_last_name,
                'approving_officer_first_name' => $request->approving_officer_first_name,
                'approving_officer_middle_name' => $request->approving_officer_middle_name,
                'approving_officer_last_name' => $request->approving_officer_last_name,
                'encoder_first_name' => $request->encoder_first_name,
                'encoder_middle_name' => $request->encoder_middle_name,
                'encoder_last_name' => $request->encoder_last_name,
                'reportingUnit' => $request->reportingUnit,
                'controlNo' => $request->controlNo,
            ]);

            // Update user's name by combining the name fields
            $fullName = $request->first_name;
            if ($request->middle_name) {
                $fullName .= ' ' . $request->middle_name;
            }
            $fullName .= ' ' . $request->last_name;
            if ($request->suffix) {
                $fullName .= ' ' . $request->suffix;
            }

            // Update the user's name
            $renewal->user->update([
                'name' => $fullName
            ]);

            // Update renewal status to approved (3)
            $renewal->update([
                'registration_type' => 3, // 3 for approsved
                'processing_officer_first_name' => $request->user()->first_name,
                'processing_officer_middle_name' => $request->user()->middle_name,
                'processing_officer_last_name' => $request->user()->last_name,
            ]);

            DB::commit();

            return redirect()->route('admin.pwd.renewals.index')
                ->with('success', 'Renewal request approved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to approve renewal request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to approve renewal request. Please try again.']);
        }
    }

    public function reject(Request $request, PWDRenewalAndPreregistration $renewal)
    {
        try {
            $renewal->update([
                'registration_type' => 4, // 4 for rejected
                'processing_officer_first_name' => $request->user()->first_name,
                'processing_officer_middle_name' => $request->user()->middle_name,
                'processing_officer_last_name' => $request->user()->last_name,
            ]);

            return redirect()->route('admin.pwd.renewals.index')
                ->with('success', 'Renewal request rejected successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to reject renewal request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to reject renewal request. Please try again.']);
        }
    }

    public function update(Request $request, PWDRenewalAndPreregistration $renewal)
    {
        try {
            $validated = $request->validate([
                'pwdNumber' => 'required|string|max:255',
                'dateApplied' => 'required|date',
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'suffix' => 'nullable|string|max:255',
                'dob' => 'required|date',
                'sex' => 'required|string|in:male,female,Male,Female',
                'civilStatus' => 'required|string|in:single,married,widowed,separated,Single,Married,Widowed,Separated',
                'disability_type_id' => 'required|exists:disability_lists,id',
                'disability_cause_id' => 'required|exists:disability_lists,id',
                'region_id' => 'required|exists:regions,id',
                'province_id' => 'required|exists:provinces,id',
                'municipality_id' => 'required|exists:municipalities,id',
                'barangay_id' => 'required|exists:barangays,id',
                'house' => 'required|string|max:255',
                'landline' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'education' => 'required|string|max:255',
                'employmentStatus' => 'required|string|max:255',
                'employmentCategory' => 'nullable|string|max:255',
                'employmentType' => 'nullable|string|max:255',
                'occupation' => 'nullable|string|max:255',
                'occupationOther' => 'nullable|string|max:255',
                'organizationAffiliated' => 'nullable|string|max:255',
                'organizationContact' => 'nullable|string|max:255',
                'organizationAddress' => 'nullable|string|max:255',
                'organizationTel' => 'nullable|string|max:255',
                'sssNo' => 'nullable|string|max:255',
                'gsisNo' => 'nullable|string|max:255',
                'pagIbigNo' => 'nullable|string|max:255',
                'psnNo' => 'nullable|string|max:255',
                'philhealthNo' => 'nullable|string|max:255',
                'father_first_name' => 'nullable|string|max:255',
                'father_middle_name' => 'nullable|string|max:255',
                'father_last_name' => 'nullable|string|max:255',
                'mother_first_name' => 'nullable|string|max:255',
                'mother_middle_name' => 'nullable|string|max:255',
                'mother_last_name' => 'nullable|string|max:255',
                'guardian_first_name' => 'nullable|string|max:255',
                'guardian_middle_name' => 'nullable|string|max:255',
                'guardian_last_name' => 'nullable|string|max:255',
                'accomplishedBy' => 'required|string|max:255',
                'accomplished_by_first_name' => 'required|string|max:255',
                'accomplished_by_middle_name' => 'nullable|string|max:255',
                'accomplished_by_last_name' => 'required|string|max:255',
                'photo' => 'nullable|image|max:2048',
                'signature' => 'nullable|image|max:2048',
                'certifying_physician_first_name' => 'required|string|max:255',
                'certifying_physician_middle_name' => 'nullable|string|max:255',
                'certifying_physician_last_name' => 'required|string|max:255',
                'physician_license_no' => 'required|string|max:255',
                'processing_officer_first_name' => 'required|string|max:255',
                'processing_officer_middle_name' => 'nullable|string|max:255',
                'processing_officer_last_name' => 'required|string|max:255',
                'approving_officer_first_name' => 'required|string|max:255',
                'approving_officer_middle_name' => 'nullable|string|max:255',
                'approving_officer_last_name' => 'required|string|max:255',
                'encoder_first_name' => 'required|string|max:255',
                'encoder_middle_name' => 'nullable|string|max:255',
                'encoder_last_name' => 'required|string|max:255',
                'reportingUnit' => 'required|string|max:255',
                'controlNo' => 'required|string|max:255',
            ]);

            // Handle photo upload
            if ($request->hasFile('photo')) {
                // Delete old photo if it exists
                if ($renewal->photo && Storage::disk('public')->exists($renewal->photo)) {
                    Storage::disk('public')->delete($renewal->photo);
                }

                $photoFile = $request->file('photo');
                $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                $photoPath = 'photos/' . $photoName;
                $photoFile->storeAs('photos', $photoName, 'public');
                $validated['photo'] = $photoPath;
            }

            // Handle signature upload
            if ($request->hasFile('signature')) {
                // Delete old signature if it exists
                if ($renewal->signature && Storage::disk('public')->exists($renewal->signature)) {
                    Storage::disk('public')->delete($renewal->signature);
                }

                $signatureFile = $request->file('signature');
                $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                $validated['signature'] = $sigPath;
            }

            $renewal->update($validated);

            return redirect()->route('admin.pwd.renewals.show', $renewal->id)
                ->with('success', 'Renewal request updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update renewal request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to update renewal request. Please try again.'])
                        ->withInput();
        }
    }
} 