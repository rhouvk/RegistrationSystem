import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DisabilityInfoForm from '../Components/DisabilityInfoForm';
import ResidenceAddressForm from '../Components/ResidenceAddressForm';
import EducationEmploymentForm from '../Components/EducationEmploymentForm';
import OrganizationInfoForm from '../Components/OrganizationInfoForm';
import IdReferenceForm from '../Components/IdReferenceForm';
import FamilyBackgroundForm from '../Components/FamilyBackgroundForm';
import AccomplishedByForm from '../Components/AccomplishedByForm';
import PhotoSignatureUpload from '../Components/PhotoSignatureUpload';

export default function AdditionalInfo({ initialData, disabilityTypes = [], disabilityCauses = [], regions = [], provinces = [], municipalities = [], barangays = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        ...initialData,
        // Required fields
        disability_type_id: '',
        disability_cause_id: '',
        region_id: '',
        province_id: '',
        municipality_id: '',
        barangay_id: '',
        house: '',
        education: '',
        employmentStatus: '',
        father_first_name: '',
        father_last_name: '',
        mother_first_name: '',
        mother_last_name: '',
        accomplishedBy: '',
        accomplished_by_first_name: '',
        accomplished_by_last_name: '',
        photo: null,
       father_middle_name: '',
        mother_middle_name: '',
        guardian_first_name: '',
        guardian_middle_name: '',
        guardian_last_name: '',
        accomplished_by_middle_name: '',
        employmentCategory: '',
        employmentType: '',
        occupation: '',
        organizationAffiliated: '',
        organizationContact: '',
        organizationAddress: '',
        organizationTel: '',
        sssNo: '',
        gsisNo: '',
        pagIbigNo: '',
        psnNo: '',
        philhealthNo: '',
        photoPreview: null,
        signaturePreview: null,
    });

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
        for (const key in data) {
            if (!['photo', 'signature', 'photoPreview', 'signaturePreview'].includes(key)) {
                const value = data[key];
                if (Array.isArray(value)) {
                    value.forEach(item => formData.append(`${key}[]`, item));
                } else {
                    formData.append(key, value);
                }
            }
        }

        if (data.photo) {
            formData.append('photo', data.photo);
        }
        if (data.signature) {
            formData.append('signature', data.signature);
        }

        post(route('pwd.additional-info.store'), {
            forceFormData: true,
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                const firstErrorField = Object.keys(errors)[0];
                const el = document.querySelector(`[name="${firstErrorField}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    };

    return (
        <>
            <Head title="Additional Information" />

            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                        Additional Information
                                    </h2>
                                    <p className="text-gray-600">
                                        Please provide the following information to complete your registration.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                                    <DisabilityInfoForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        disabilityTypes={disabilityTypes}
                                        disabilityCauses={disabilityCauses}
                                    />

                                    <ResidenceAddressForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                        regions={regions}
                                        provinces={provinces}
                                        municipalities={municipalities}
                                        barangays={barangays}
                                    />

                                    <EducationEmploymentForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                    />

                                    <OrganizationInfoForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                    />

                                    <IdReferenceForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                    />

                                    <FamilyBackgroundForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                    />

                                    <AccomplishedByForm
                                        values={data}
                                        handleChange={(e) => setData(e.target.name, e.target.value)}
                                        errors={errors}
                                    />

                                    <PhotoSignatureUpload
                                        values={data}
                                        handleChangeFile={handleChangeFile}
                                        errors={errors}
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                        >
                                            Submit Registration
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 