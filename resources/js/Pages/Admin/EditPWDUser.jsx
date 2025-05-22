import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '@/Layouts/AdminLayout';

// Import the form components
import PersonalInfoForm from '@/Components/PersonalInfoForm';
import DisabilityInfoForm from '@/Components/DisabilityInfoForm';
import ResidenceAddressForm from '@/Components/ResidenceAddressForm';
import ContactDetailsForm from '@/Components/ContactDetailsForm';
import EducationEmploymentForm from '@/Components/EducationEmploymentForm';
import OrganizationInfoForm from '@/Components/OrganizationInfoForm';
import IdReferenceForm from '@/Components/IdReferenceForm';
import FamilyBackgroundForm from '@/Components/FamilyBackgroundForm';
import AccomplishedByForm from '@/Components/AccomplishedByForm';
import CertifyingPhysicianForm from '@/Components/CertifyingPhysicianForm';
import OfficersForm from '@/Components/OfficersForm';
import PhotoSignatureUpload from '@/Components/PhotoSignatureUpload';
import ReportingInfoForm from '@/Components/ReportingInfoForm';

export default function EditPWDUser({ user, disabilityTypes, disabilityCauses, regions, provinces: initialProvinces, municipalities: initialMunicipalities, barangays: initialBarangays }) {
    const [provinces, setProvinces] = useState(initialProvinces);
    const [municipalities, setMunicipalities] = useState(initialMunicipalities);
    const [barangays, setBarangays] = useState(initialBarangays);

    // Format dates for input fields
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        pwdNumber: user.pwdNumber || '',
        dateApplied: formatDate(user.dateApplied),
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        suffix: user.suffix || '',
        dob: formatDate(user.dob),
        sex: user.sex || '',
        civilStatus: user.civilStatus || '',
        disability_type_id: user.disability_type_id || '',
        disability_cause_id: user.disability_cause_id || '',
        region_id: user.region_id || '',
        province_id: user.province_id || '',
        municipality_id: user.municipality_id || '',
        barangay_id: user.barangay_id || '',
        house: user.house || '',
        landline: user.landline || '',
        mobile: user.mobile || '',
        email: user.email || '',
        education: user.education || '',
        employmentStatus: user.employmentStatus || '',
        employmentCategory: user.employmentCategory || '',
        employmentType: user.employmentType || '',
        occupation: user.occupation || '',
        occupationOther: user.occupationOther || '',
        organizationAffiliated: user.organizationAffiliated || '',
        organizationContact: user.organizationContact || '',
        organizationAddress: user.organizationAddress || '',
        organizationTel: user.organizationTel || '',
        idReferenceNo: user.idReferenceNo || '',
        sssNo: user.sssNo || '',
        gsisNo: user.gsisNo || '',
        pagIbigNo: user.pagIbigNo || '',
        psnNo: user.psnNo || '',
        philhealthNo: user.philhealthNo || '',
        father_first_name: user.father_first_name || '',
        father_middle_name: user.father_middle_name || '',
        father_last_name: user.father_last_name || '',
        mother_first_name: user.mother_first_name || '',
        mother_middle_name: user.mother_middle_name || '',
        mother_last_name: user.mother_last_name || '',
        guardian_first_name: user.guardian_first_name || '',
        guardian_middle_name: user.guardian_middle_name || '',
        guardian_last_name: user.guardian_last_name || '',
        accomplishedBy: user.accomplishedBy || 'applicant',
        accomplished_by_first_name: user.accomplished_by_first_name || '',
        accomplished_by_middle_name: user.accomplished_by_middle_name || '',
        accomplished_by_last_name: user.accomplished_by_last_name || '',
        certifying_physician_first_name: user.certifying_physician_first_name || '',
        certifying_physician_middle_name: user.certifying_physician_middle_name || '',
        certifying_physician_last_name: user.certifying_physician_last_name || '',
        physician_license_no: user.physician_license_no || '',
        processing_officer_first_name: user.processing_officer_first_name || '',
        processing_officer_middle_name: user.processing_officer_middle_name || '',
        processing_officer_last_name: user.processing_officer_last_name || '',
        approving_officer_first_name: user.approving_officer_first_name || '',
        approving_officer_middle_name: user.approving_officer_middle_name || '',
        approving_officer_last_name: user.approving_officer_last_name || '',
        encoder_first_name: user.encoder_first_name || '',
        encoder_middle_name: user.encoder_middle_name || '',
        encoder_last_name: user.encoder_last_name || '',
        reportingUnit: user.reportingUnit || '',
        controlNo: user.controlNo || '',
        photo: user.photo || null,
        signature: user.signature || null,
        photoPreview: user.photo ? `/storage/${user.photo}` : null,
        signaturePreview: user.signature ? `/storage/${user.signature}` : null,
    });

    const handleRegionChange = async (e) => {
        const regionId = e.target.value;
        setData('region_id', regionId);
        setData('province_id', '');
        setData('municipality_id', '');
        setData('barangay_id', '');
        
        if (regionId) {
            const response = await fetch(`/api/provinces?region_id=${regionId}`);
            const data = await response.json();
            setProvinces(data);
            setMunicipalities([]);
            setBarangays([]);
        } else {
            setProvinces([]);
            setMunicipalities([]);
            setBarangays([]);
        }
    };

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setData('province_id', provinceId);
        setData('municipality_id', '');
        setData('barangay_id', '');

        if (provinceId) {
            const response = await fetch(`/api/municipalities?province_id=${provinceId}`);
            const data = await response.json();
            setMunicipalities(data);
            setBarangays([]);
        } else {
            setMunicipalities([]);
            setBarangays([]);
        }
    };

    const handleMunicipalityChange = async (e) => {
        const municipalityId = e.target.value;
        setData('municipality_id', municipalityId);
        setData('barangay_id', '');

        if (municipalityId) {
            const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
            const data = await response.json();
            setBarangays(data);
        } else {
            setBarangays([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, value);
    };

    const handleChangeFile = (e) => {
        const { name, files } = e.target;
        const file = files[0];
    
        if (file) {
            setData(name, file);
            setData(`${name}Preview`, URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Log the data before processing
        console.log('Form data before processing:', data);

        // Add all form fields to FormData
        Object.keys(data).forEach(key => {
            // Skip preview fields
            if (["photoPreview", "signaturePreview"].includes(key)) return;
            
            const value = data[key];
            
            // Handle file uploads
            if (value instanceof File) {
                formData.append(key, value);
            } 
            // Handle all other fields
            else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        // Log the FormData contents
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        Inertia.post(route('pwd.pwd-users.update', user.id), formData, {
            forceFormData: true,
            method: 'put',
            onError: (errors) => {
                console.error('Validation Errors:', errors);
                Object.keys(errors).forEach(key => {
                    const el = document.querySelector(`[name="${key}"]`);
                    if (el) {
                        el.classList.add('border-red-500');
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-red-500 text-sm mt-1';
                        errorDiv.textContent = errors[key];
                        el.parentNode.appendChild(errorDiv);
                    }
                });
            },
            onSuccess: () => {
                document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
                document.querySelectorAll('.text-red-500').forEach(el => el.remove());
            }
        });
    };

    return (
        <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">Edit PWD User</h2>}>
            <Head title="Edit PWD User" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
                                <PersonalInfoForm values={data} handleChange={handleChange} />
                                <DisabilityInfoForm values={data} handleChange={handleChange} disabilityTypes={disabilityTypes} disabilityCauses={disabilityCauses} />
                                <ResidenceAddressForm values={data} handleChange={handleChange} regions={regions} provinces={provinces} municipalities={municipalities} barangays={barangays} />
                                <ContactDetailsForm values={data} handleChange={handleChange} />
                                <EducationEmploymentForm values={data} handleChange={handleChange} />
                                <OrganizationInfoForm values={data} handleChange={handleChange} />
                                <IdReferenceForm values={data} handleChange={handleChange} />
                                <FamilyBackgroundForm values={data} handleChange={handleChange} />
                                <AccomplishedByForm values={data} handleChange={handleChange} />
                                <CertifyingPhysicianForm values={data} handleChange={handleChange} />
                                <OfficersForm values={data} handleChange={handleChange} />
                                <ReportingInfoForm values={data} handleChange={handleChange} />
                                <PhotoSignatureUpload values={data} handleChangeFile={handleChangeFile} />

                                <div className="flex justify-end space-x-4">
                                    <a
                                        href={route('pwd.pwd-users.index')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 