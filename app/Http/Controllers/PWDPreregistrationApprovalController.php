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

class PWDPreregistrationApprovalController extends Controller
{
    public function index()
    {
        $preregistrations = PWDRenewalAndPreregistration::with(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay'])
            ->where('registration_type', 1) // 1 for pre-registration
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PWDPreregistrationApprovals', [
            'preregistrations' => $preregistrations
        ]);
    }

    public function show(PWDRenewalAndPreregistration $preregistration)
    {
        $preregistration->load(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay']);
        
        return Inertia::render('Admin/PWDPreregistrationApprovalDetail', [
            'preregistration' => $preregistration,
            'disabilityTypes' => DisabilityList::where('category', 'type')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'cause')->get(),
            'regions' => Region::all(),
            'provinces' => Province::where('region_id', $preregistration->region_id)->get(),
            'municipalities' => Municipality::where('province_id', $preregistration->province_id)->get(),
            'barangays' => Barangay::where('municipality_id', $preregistration->municipality_id)->get(),
        ]);
    }

    public function approve(Request $request, PWDRenewalAndPreregistration $preregistration)
    {
        try {
            DB::beginTransaction();

            // Create new PWD registration
            $pwdRegistration = PWDRegistration::create([
                'user_id' => $preregistration->user_id,
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
                'accomplished_by_first_name' => $request->accomplished_by_first_name,
                'accomplished_by_middle_name' => $request->accomplished_by_middle_name,
                'accomplished_by_last_name' => $request->accomplished_by_last_name,
            ]);

            // Update preregistration status to approved (4)
            $preregistration->update([
                'registration_type' => 4, // 4 for approved
                'processing_officer_first_name' => $request->user()->first_name,
                'processing_officer_middle_name' => $request->user()->middle_name,
                'processing_officer_last_name' => $request->user()->last_name,
            ]);

            // Update user's name, email, and set is_validated to 1
            $preregistration->user->update([
                'name' => $request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name . ' ' . $request->suffix,
                'email' => $request->email,
                'is_validated' => 1,
            ]);

            DB::commit();

            return redirect()->route('admin.pwd.preregistrations.index')
                ->with('success', 'Pre-registration request approved successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to approve pre-registration request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to approve pre-registration request. Please try again.']);
        }
    }

    public function reject(Request $request, PWDRenewalAndPreregistration $preregistration)
    {
        try {
            $preregistration->update([
                'registration_type' => 5, // 5 for rejected
                'processing_officer_first_name' => $request->user()->first_name,
                'processing_officer_middle_name' => $request->user()->middle_name,
                'processing_officer_last_name' => $request->user()->last_name,
            ]);

            return redirect()->route('admin.pwd.preregistrations.index')
                ->with('success', 'Pre-registration request rejected successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to reject pre-registration request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to reject pre-registration request. Please try again.']);
        }
    }
} 