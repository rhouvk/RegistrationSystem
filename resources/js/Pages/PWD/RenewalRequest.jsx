import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

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
import PhotoSignatureUpload from '@/Components/PhotoSignatureUpload';

export default function RenewalRequest({ registration, renewal, basedOnRenewal, disabilityTypes, disabilityCauses, regions, provinces: initialProvinces, municipalities: initialMunicipalities, barangays: initialBarangays }) {
    const [provinces, setProvinces] = useState(initialProvinces);
    const [municipalities, setMunicipalities] = useState(initialMunicipalities);
    const [barangays, setBarangays] = useState(initialBarangays);

    // Format dates for input fields
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Determine which data to use for initial form values
    const initialData = renewal || basedOnRenewal || registration;

    const { data, setData, post, put, processing, errors } = useForm({
        pwdNumber: initialData.pwdNumber || '',
        dateApplied: formatDate(new Date()), // Current date for new application
        first_name: initialData.first_name || '',
        middle_name: initialData.middle_name || '',
        last_name: initialData.last_name || '',
        suffix: initialData.suffix || '',
        dob: formatDate(initialData.dob),
        sex: initialData.sex || '',
        civilStatus: initialData.civilStatus || '',
        disability_type_id: initialData.disability_type_id || '',
        disability_cause_id: initialData.disability_cause_id || '',
        region_id: initialData.region_id || '',
        province_id: initialData.province_id || '',
        municipality_id: initialData.municipality_id || '',
        barangay_id: initialData.barangay_id || '',
        house: initialData.house || '',
        landline: initialData.landline || '',
        mobile: initialData.mobile || '',
        email: initialData.email || '',
        education: initialData.education || '',
        employmentStatus: initialData.employmentStatus || '',
        employmentCategory: initialData.employmentCategory || '',
        employmentType: initialData.employmentType || '',
        occupation: initialData.occupation || '',
        occupationOther: initialData.occupationOther || '',
        organizationAffiliated: initialData.organizationAffiliated || '',
        organizationContact: initialData.organizationContact || '',
        organizationAddress: initialData.organizationAddress || '',
        organizationTel: initialData.organizationTel || '',
        idReferenceNo: initialData.idReferenceNo || '',
        sssNo: initialData.sssNo || '',
        gsisNo: initialData.gsisNo || '',
        pagIbigNo: initialData.pagIbigNo || '',
        psnNo: initialData.psnNo || '',
        philhealthNo: initialData.philhealthNo || '',
        father_first_name: initialData.father_first_name || '',
        father_middle_name: initialData.father_middle_name || '',
        father_last_name: initialData.father_last_name || '',
        mother_first_name: initialData.mother_first_name || '',
        mother_middle_name: initialData.mother_middle_name || '',
        mother_last_name: initialData.mother_last_name || '',
        guardian_first_name: initialData.guardian_first_name || '',
        guardian_middle_name: initialData.guardian_middle_name || '',
        guardian_last_name: initialData.guardian_last_name || '',
        accomplishedBy: initialData.accomplishedBy || 'applicant',
        accomplished_by_first_name: initialData.accomplished_by_first_name || '',
        accomplished_by_middle_name: initialData.accomplished_by_middle_name || '',
        accomplished_by_last_name: initialData.accomplished_by_last_name || '',
        photo: initialData.photo || null,
        signature: initialData.signature || null,
        photoPreview: initialData.photo ? `/storage/${initialData.photo}` : null,
        signaturePreview: initialData.signature ? `/storage/${initialData.signature}` : null,
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
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleChangeFile = (e) => {
        const { name, files } = e.target;
        const file = files[0];
    
        if (file) {
            console.log('File change detected:', {
                name,
                file,
                type: file.type,
                size: file.size
            });
            setData(name, file);
            setData(`${name}Preview`, URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Log the form data before submission
        console.log('Submitting form data:', {
            ...data,
            registration_id: registration?.id
        });

        // Create FormData object
        const formData = new FormData();
        
        // Add all form fields except files and previews
        Object.keys(data).forEach(key => {
            if (!['photo', 'signature', 'photoPreview', 'signaturePreview'].includes(key)) {
                const value = data[key];
                if (Array.isArray(value)) {
                    value.forEach(item => formData.append(`${key}[]`, item));
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Special handling for files
        if (data.photo) {
            formData.append('photo', data.photo);
        }
        if (data.signature) {
            formData.append('signature', data.signature);
        }

        // Add registration_id if it exists
        if (registration?.id) {
            formData.append('registration_id', registration.id);
        }

        // Log the form data being sent
        console.log('Form data entries:', Object.fromEntries(formData));

        // Log the actual files being sent
        console.log('Files in form data:', {
            photo: formData.get('photo'),
            signature: formData.get('signature')
        });

        if (renewal) {
            // If we're editing an existing renewal
            put(route('pwd.renewals.update', renewal.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                onError: handleError,
                onSuccess: handleSuccess
            });
        } else {
            // If we're creating a new renewal
            post(route('pwd.renewals.store'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onError: handleError,
                onSuccess: handleSuccess
            });
        }
    };

    const handleError = (errors) => {
        console.error('Form submission errors:', errors);
        // Show all validation errors
        Object.keys(errors).forEach(key => {
            const el = document.querySelector(`[name="${key}"]`);
            if (el) {
                el.classList.add('border-red-500');
                // Add error message below the field
                const errorDiv = document.createElement('div');
                errorDiv.className = 'text-red-500 text-sm mt-1';
                errorDiv.textContent = errors[key];
                el.parentNode.appendChild(errorDiv);
            }
        });
    };

    const handleSuccess = () => {
        // Remove any error styling
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });
        // Remove any error messages
        document.querySelectorAll('.text-red-500').forEach(el => {
            el.remove();
        });
    };

    return (
        <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Request PWD Card Renewal</h2>}>
            <Head title="Request PWD Card Renewal" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Renewal Request Form</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Please review and update your information for the renewal request. Fields marked with * are required.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <PersonalInfoForm values={data} handleChange={handleChange} />
                                <DisabilityInfoForm values={data} handleChange={handleChange} disabilityTypes={disabilityTypes} disabilityCauses={disabilityCauses} />
                                <ResidenceAddressForm values={data} handleChange={handleChange} regions={regions} provinces={provinces} municipalities={municipalities} barangays={barangays} />
                                <ContactDetailsForm values={data} handleChange={handleChange} />
                                <EducationEmploymentForm values={data} handleChange={handleChange} />
                                <OrganizationInfoForm values={data} handleChange={handleChange} />
                                <IdReferenceForm values={data} handleChange={handleChange} />
                                <FamilyBackgroundForm values={data} handleChange={handleChange} />
                                <AccomplishedByForm values={data} handleChange={handleChange} />
                                <PhotoSignatureUpload values={data} handleChangeFile={handleChangeFile} />

                                <div className="flex justify-end space-x-4">
                                    <a
                                        href={route('pwd.dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                    >
                                        {processing ? 'Submitting...' : renewal ? 'Update Renewal Request' : 'Submit Renewal Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PWDLayout>
    );
} 