<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use App\Models\DisabilityList;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use Inertia\Inertia;

class PWDUserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10); // default to 10 per page
        $search = $request->input('search');

        $query = PWDRegistration::with([
            'user',
            'disabilityType',
            'disabilityCause',
            'region',
            'province',
            'municipality',
            'barangay',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('pwdNumber', 'like', "%{$search}%")
                ->orWhereHas('user', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                });
            });
        }

        $users = $query->orderBy('id', 'desc')->paginate($perPage)->appends(['search' => $search]);

            return Inertia::render('Admin/PWDusers', [
                'users' => $users,
                'filters' => $request->only('search', 'perPage'), // ✅ important!
            ]);
    }

    public function edit($id)
    {
        $user = PWDRegistration::with([
            'user',
            'disabilityType',
            'disabilityCause',
            'region',
            'province',
            'municipality',
            'barangay',
        ])->findOrFail($id);

        // Get all disability types and causes
        $disabilityTypes = DisabilityList::where('category', 'type')->get();
        $disabilityCauses = DisabilityList::where('category', 'cause')->get();

        // Get all regions
        $regions = Region::orderBy('name')->get();

        // Get provinces, municipalities, and barangays based on current selection
        $provinces = $user->region ? Province::where('region_id', $user->region_id)->orderBy('name')->get() : [];
        $municipalities = $user->province ? Municipality::where('province_id', $user->province_id)->orderBy('name')->get() : [];
        $barangays = $user->municipality ? Barangay::where('municipality_id', $user->municipality_id)->orderBy('name')->get() : [];

        return Inertia::render('Admin/EditPWDUser', [
            'user' => $user,
            'disabilityTypes' => $disabilityTypes,
            'disabilityCauses' => $disabilityCauses,
            'regions' => $regions,
            'provinces' => $provinces,
            'municipalities' => $municipalities,
            'barangays' => $barangays,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'dateApplied' => 'required|date',
            'dob' => 'required|date',
            'sex' => 'required|in:Male,Female',
            'civilStatus' => 'required|in:Single,Married,Widowed,Separated,Cohabitation',
            'disability_type_id' => 'required|exists:disability_lists,id',
            'disability_cause_id' => 'required|exists:disability_lists,id',
            'region_id' => 'required|exists:regions,id',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'house' => 'required|string',
            'education' => 'required|string',
            'employmentStatus' => 'required|string',
            'employmentCategory' => 'nullable|string',
            'employmentType' => 'nullable|string',
            'occupation' => 'nullable|string',
            'occupationOther' => 'nullable|string',
            'organizationAffiliated' => 'nullable|string',
            'organizationContact' => 'nullable|string',
            'organizationAddress' => 'nullable|string',
            'organizationTel' => 'nullable|string',
            'sssNo' => 'nullable|string',
            'gsisNo' => 'nullable|string',
            'pagIbigNo' => 'nullable|string',
            'psnNo' => 'nullable|string',
            'philhealthNo' => 'nullable|string',
            'fatherName' => 'nullable|string',
            'motherName' => 'nullable|string',
            'guardianName' => 'nullable|string',
            'accomplishedBy' => 'required|string',
            'certifyingPhysician' => 'required|string',
            'physicianLicenseNo' => 'required|string',
            'encoder' => 'required|string',
            'processingOfficer' => 'required|string',
            'approvingOfficer' => 'required|string',
            'reportingUnit' => 'required|string',
        ]);

        $pwdUser = PWDRegistration::findOrFail($id);
        $pwdUser->update($request->all());

        return redirect()->route('pwd.pwd-users.index')
            ->with('message', 'PWD user updated successfully');
    }
}
