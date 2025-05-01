<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use Inertia\Inertia;

class PWDUserController extends Controller
{
    public function index()
    {
        $users = PWDRegistration::with([
            'user',
            'disabilityType',
            'disabilityCause',
            'region',
            'province',
            'municipality',
            'barangay',
        ])
        ->orderBy('id', 'desc')
        ->get();
    
        return Inertia::render('Admin/PWDusers', [
            'users' => $users,
        ]);
    }
    

    public function update(Request $request, $id)
    {
        // Validation rules matching your edit modal fields
        $rules = [
            'dateApplied'           => 'required|date',
            'dob'                   => 'required|date',
            'sex'                   => 'required|in:male,female',
            'civilStatus'           => 'required|string|max:255',
            'disabilityTypes'       => 'required|string',
            'disabilityCauses'      => 'required|string',
            'house'                 => 'nullable|string|max:255',
            'barangay'              => 'required|string|max:255',
            'municipality'          => 'required|string|max:255',
            'province'              => 'required|string|max:255',
            'region'                => 'required|string|max:255',
            'landline'              => 'nullable|string|max:50',
            'education'             => 'required|string|max:255',
            'employmentStatus'      => 'required|string|max:255',
            'employmentCategory'    => 'nullable|string|max:255',
            'employmentType'        => 'nullable|string|max:255',
            'occupation'            => 'nullable|string|max:255',
            'occupationOther'       => 'nullable|string|max:255',
            'organizationAffiliated'=> 'nullable|string|max:255',
            'organizationContact'   => 'nullable|string|max:255',
            'organizationAddress'   => 'nullable|string|max:255',
            'organizationTel'       => 'nullable|string|max:50',
            'sssNo'                 => 'nullable|string|max:50',
            'gsisNo'                => 'nullable|string|max:50',
            'pagIbigNo'             => 'nullable|string|max:50',
            'psnNo'                 => 'nullable|string|max:50',
            'philhealthNo'          => 'nullable|string|max:50',
            'fatherName'            => 'nullable|string|max:255',
            'motherName'            => 'nullable|string|max:255',
            'guardianName'          => 'nullable|string|max:255',
            'certifyingPhysician'   => 'nullable|string|max:255',
            'processingOfficer'     => 'required|string|max:255',
            'approvingOfficer'      => 'required|string|max:255',
            'reportingUnit'         => 'required|string|max:255',
            // read-only fields (pwdNumber, accomplishedBy, encoder, controlNo) do not need rules
        ];

        $data = $request->validate($rules);

        $registration = PWDRegistration::findOrFail($id);
        $registration->fill($data);
        $registration->save();

        return redirect()->back()->with('success', 'PWD user updated successfully.');
    }
}
