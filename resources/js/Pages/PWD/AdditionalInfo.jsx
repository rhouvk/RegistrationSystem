import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DisabilityInfoForm from '@/Components/Forms/DisabilityInfoForm';
import ResidenceAddressForm from '@/Components/Forms/ResidenceAddressForm';
import ContactDetailsForm from '@/Components/Forms/ContactDetailsForm';
import EducationEmploymentForm from '@/Components/Forms/EducationEmploymentForm';
import OrganizationInfoForm from '@/Components/Forms/OrganizationInfoForm';
import IdReferenceForm from '@/Components/Forms/IdReferenceForm';
import FamilyBackgroundForm from '@/Components/Forms/FamilyBackgroundForm';
import AccomplishedByForm from '@/Components/Forms/AccomplishedByForm';
import PhotoSignatureUpload from '@/Components/Forms/PhotoSignatureUpload';

export default function AdditionalInfo({ initialData, disabilityTypes, disabilityCauses, regions, provinces, municipalities, barangays }) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 9;

    const { data, setData, post, processing, errors } = useForm({
        ...initialData,
        disability_type_id: '',
        disability_cause_id: '',
        region_id: '',
        province_id: '',
        municipality_id: '',
        barangay_id: '',
        house: '',
        education: '',
        employmentStatus: '',
        employmentCategory: '',
        employmentType: '',
        occupation: '',
        organizationAffiliated: '',
        organizationContact: '',
        organizationAddress: '',
        organizationTel: '',
        idReferenceNo: '',
        sssNo: '',
        gsisNo: '',
        pagIbigNo: '',
        psnNo: '',
        philhealthNo: '',
        father_first_name: '',
        father_middle_name: '',
        father_last_name: '',
        mother_first_name: '',
        mother_middle_name: '',
        mother_last_name: '',
        guardian_first_name: '',
        guardian_middle_name: '',
        guardian_last_name: '',
        accomplishedBy: '',
        accomplished_by_first_name: '',
        accomplished_by_middle_name: '',
        accomplished_by_last_name: '',
        photo: null,
        signature: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pwd.additional-info.store'));
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <DisabilityInfoForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        disabilityTypes={disabilityTypes}
                        disabilityCauses={disabilityCauses}
                    />
                );
            case 2:
                return (
                    <ResidenceAddressForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        regions={regions}
                        provinces={provinces}
                        municipalities={municipalities}
                        barangays={barangays}
                    />
                );
            case 3:
                return (
                    <ContactDetailsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <EducationEmploymentForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 5:
                return (
                    <OrganizationInfoForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 6:
                return (
                    <IdReferenceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 7:
                return (
                    <FamilyBackgroundForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 8:
                return (
                    <AccomplishedByForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 9:
                return (
                    <PhotoSignatureUpload
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Additional Information" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Additional Information
                                </h2>
                                <p className="text-gray-600">
                                    Step {currentStep} of {totalSteps}
                                </p>
                                <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {renderStep()}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                            currentStep === 1 ? 'invisible' : ''
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {currentStep < totalSteps ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                        >
                                            Submit Registration
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 