<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use App\Models\DisabilityList;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
                    $q2->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                       ->orWhere('phone', 'like', "%{$search}%");
                });
            });
        }

        $users = $query->orderBy('id', 'desc')->paginate($perPage)->appends(['search' => $search]);

        return Inertia::render('Admin/PWDusers', [
            'users' => $users,
            'filters' => $request->only('search', 'perPage'),
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
        try {
            \Log::info('PWD User Update Request Data:', $request->all());
            \Log::info('Files in request:', $request->allFiles());

            // Get the PWD user first to access the user relationship
            $pwdUser = PWDRegistration::with('user')->findOrFail($id);
            $user = $pwdUser->user;

            // Create validation rules array
            $rules = [
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
                'father_first_name' => 'nullable|string',
                'father_middle_name' => 'nullable|string',
                'father_last_name' => 'nullable|string',
                'mother_first_name' => 'nullable|string',
                'mother_middle_name' => 'nullable|string',
                'mother_last_name' => 'nullable|string',
                'guardian_first_name' => 'nullable|string',
                'guardian_middle_name' => 'nullable|string',
                'guardian_last_name' => 'nullable|string',
                'accomplishedBy' => 'required|string',
                'accomplished_by_first_name' => 'required|string',
                'accomplished_by_middle_name' => 'nullable|string',
                'accomplished_by_last_name' => 'required|string',
                'certifying_physician_first_name' => 'required|string',
                'certifying_physician_middle_name' => 'nullable|string',
                'certifying_physician_last_name' => 'required|string',
                'physician_license_no' => 'required|string',
                'processing_officer_first_name' => 'required|string',
                'processing_officer_middle_name' => 'nullable|string',
                'processing_officer_last_name' => 'required|string',
                'approving_officer_first_name' => 'required|string',
                'approving_officer_middle_name' => 'nullable|string',
                'approving_officer_last_name' => 'required|string',
                'encoder_first_name' => 'required|string',
                'encoder_middle_name' => 'nullable|string',
                'encoder_last_name' => 'required|string',
                'reportingUnit' => 'required|string',
                'controlNo' => 'required|string',
            ];

            // Only add email validation if it's being changed
            if ($request->email !== $user->email) {
                $rules['email'] = 'required|email|max:255|unique:users,email,' . $user->id;
            }

            // Only add phone validation if it's being changed
            if ($request->mobile !== $user->phone) {
                $rules['mobile'] = 'required|string|max:20|unique:users,phone,' . $user->id;
            }

            // Only add photo and signature validation if new files are being uploaded
            if ($request->hasFile('photo')) {
                $rules['photo'] = 'required|image|max:2048';
            }
            if ($request->hasFile('signature')) {
                $rules['signature'] = 'required|image|max:2048';
            }

            $request->validate($rules);

            // Combine name fields for the user's name
            $fullName = $request->first_name;
            if ($request->middle_name) {
                $fullName .= ' ' . $request->middle_name;
            }
            $fullName .= ' ' . $request->last_name;
            if ($request->suffix) {
                $fullName .= ' ' . $request->suffix;
            }

            // Update user data first if email, phone, or name changed
            if ($request->email !== $user->email || $request->mobile !== $user->phone || $fullName !== $user->name) {
                $user->update([
                    'name' => $fullName,
                    'email' => $request->email,
                    'phone' => $request->mobile,
                ]);
            }

            // Get all form data except files and user-related fields
            $pwdData = $request->except(['email', 'mobile', 'photo', 'signature', '_method']);

            // Handle photo update
            if ($request->hasFile('photo')) {
                \Log::info('Processing new photo upload');
                // Delete old photo if exists
                if ($pwdUser->photo && Storage::disk('public')->exists($pwdUser->photo)) {
                    \Log::info('Deleting old photo:', ['path' => $pwdUser->photo]);
                    Storage::disk('public')->delete($pwdUser->photo);
                }

                // Store new photo
                $photoFile = $request->file('photo');
                $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                $photoPath = 'photos/' . $photoName;
                $photoFile->storeAs('photos', $photoName, 'public');
                $pwdData['photo'] = $photoPath;
                \Log::info('New photo saved:', ['path' => $photoPath]);
            }

            // Handle signature update
            if ($request->hasFile('signature')) {
                \Log::info('Processing new signature upload');
                // Delete old signature if exists
                if ($pwdUser->signature && Storage::disk('public')->exists($pwdUser->signature)) {
                    \Log::info('Deleting old signature:', ['path' => $pwdUser->signature]);
                    Storage::disk('public')->delete($pwdUser->signature);
                }

                // Store new signature
                $signatureFile = $request->file('signature');
                $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                $pwdData['signature'] = $sigPath;
                \Log::info('New signature saved:', ['path' => $sigPath]);
            }

            // Update PWD user data
            $pwdUser->update($pwdData);
            \Log::info('PWD user updated successfully');

            return redirect()->route('pwd.pwd-users.index')
                ->with('message', 'PWD user updated successfully');
        } catch (\Exception $e) {
            \Log::error('Error updating PWD user:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating PWD user: ' . $e->getMessage()]);
        }
    }
}
