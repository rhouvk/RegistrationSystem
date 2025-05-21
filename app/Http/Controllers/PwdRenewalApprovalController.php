<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PwdRenewalAndPreregistration;
use App\Models\PWDRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PwdRenewalApprovalController extends Controller
{
    public function index()
    {
        $renewals = PwdRenewalAndPreregistration::with(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay'])
            ->where('registration_type', 2) // 2 for renewal
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/PwdRenewalApprovals', [
            'renewals' => $renewals
        ]);
    }

    public function show(PwdRenewalAndPreregistration $renewal)
    {
        $renewal->load(['user', 'disabilityType', 'disabilityCause', 'region', 'province', 'municipality', 'barangay']);
        
        return Inertia::render('Admin/PwdRenewalApprovalDetail', [
            'renewal' => $renewal
        ]);
    }

    public function approve(Request $request, PwdRenewalAndPreregistration $renewal)
    {
        try {
            DB::beginTransaction();

            // Update renewal status to approved (3)
            $renewal->update([
                'registration_type' => 3, // 3 for approved
                'processing_officer_first_name' => $request->user()->first_name,
                'processing_officer_middle_name' => $request->user()->middle_name,
                'processing_officer_last_name' => $request->user()->last_name,
            ]);

            // Get the existing PWD registration
            $pwdRegistration = PWDRegistration::where('user_id', $renewal->user_id)->first();

            if (!$pwdRegistration) {
                throw new \Exception('Original PWD registration not found');
            }

            // Update PWD registration with renewal data
            $pwdRegistration->update([
                'pwdNumber' => $renewal->pwdNumber,
                'dateApplied' => $renewal->dateApplied,
                'dob' => $renewal->dob,
                'sex' => $renewal->sex,
                'civilStatus' => $renewal->civilStatus,
                'first_name' => $renewal->first_name,
                'middle_name' => $renewal->middle_name,
                'last_name' => $renewal->last_name,
                'suffix' => $renewal->suffix,
                'father_first_name' => $renewal->father_first_name,
                'father_middle_name' => $renewal->father_middle_name,
                'father_last_name' => $renewal->father_last_name,
                'mother_first_name' => $renewal->mother_first_name,
                'mother_middle_name' => $renewal->mother_middle_name,
                'mother_last_name' => $renewal->mother_last_name,
                'guardian_first_name' => $renewal->guardian_first_name,
                'guardian_middle_name' => $renewal->guardian_middle_name,
                'guardian_last_name' => $renewal->guardian_last_name,
                'disability_type_id' => $renewal->disability_type_id,
                'disability_cause_id' => $renewal->disability_cause_id,
                'region_id' => $renewal->region_id,
                'province_id' => $renewal->province_id,
                'municipality_id' => $renewal->municipality_id,
                'barangay_id' => $renewal->barangay_id,
                'house' => $renewal->house,
                'landline' => $renewal->landline,
                'education' => $renewal->education,
                'employmentStatus' => $renewal->employmentStatus,
                'employmentCategory' => $renewal->employmentCategory,
                'employmentType' => $renewal->employmentType,
                'occupation' => $renewal->occupation,
                'occupationOther' => $renewal->occupationOther,
                'organizationAffiliated' => $renewal->organizationAffiliated,
                'organizationContact' => $renewal->organizationContact,
                'organizationAddress' => $renewal->organizationAddress,
                'organizationTel' => $renewal->organizationTel,
                'sssNo' => $renewal->sssNo,
                'gsisNo' => $renewal->gsisNo,
                'pagIbigNo' => $renewal->pagIbigNo,
                'psnNo' => $renewal->psnNo,
                'philhealthNo' => $renewal->philhealthNo,
                'photo' => $renewal->photo,
                'signature' => $renewal->signature,
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

    public function reject(Request $request, PwdRenewalAndPreregistration $renewal)
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
} 