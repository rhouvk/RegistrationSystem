import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function EditPWDUser({ user, disabilityTypes, disabilityCauses, regions, provinces: initialProvinces, municipalities: initialMunicipalities, barangays: initialBarangays }) {
    const [provinces, setProvinces] = useState(initialProvinces);
    const [municipalities, setMunicipalities] = useState(initialMunicipalities);
    const [barangays, setBarangays] = useState(initialBarangays);

    const { data, setData, put, processing, errors } = useForm({
        pwdNumber: user.pwdNumber || '',
        name: user.user?.name || '',
        dateApplied: user.dateApplied || '',
        dob: user.dob || '',
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
        sssNo: user.sssNo || '',
        gsisNo: user.gsisNo || '',
        pagIbigNo: user.pagIbigNo || '',
        psnNo: user.psnNo || '',
        philhealthNo: user.philhealthNo || '',
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        guardianName: user.guardianName || '',
        accomplishedBy: user.accomplishedBy || '',
        certifyingPhysician: user.certifyingPhysician || '',
        physicianLicenseNo: user.physicianLicenseNo || '',
        encoder: user.encoder || '',
        processingOfficer: user.processingOfficer || '',
        approvingOfficer: user.approvingOfficer || '',
        reportingUnit: user.reportingUnit || '',
        controlNo: user.controlNo || '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('pwd.pwd-users.update', user.id));
    };

    return (
        <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">Edit PWD User</h2>}>
            <Head title="Edit PWD User" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">PWD Number</label>
                                            <input
                                                type="text"
                                                value={data.pwdNumber}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={data.dob}
                                                onChange={e => setData('dob', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sex</label>
                                            <select
                                                value={data.sex}
                                                onChange={e => setData('sex', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Sex</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            {errors.sex && <div className="text-red-500 text-sm mt-1">{errors.sex}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                                            <select
                                                value={data.civilStatus}
                                                onChange={e => setData('civilStatus', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Cohabitation">Cohabitation</option>
                                            </select>
                                            {errors.civilStatus && <div className="text-red-500 text-sm mt-1">{errors.civilStatus}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date Applied</label>
                                            <input
                                                type="date"
                                                value={data.dateApplied}
                                                onChange={e => setData('dateApplied', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.dateApplied && <div className="text-red-500 text-sm mt-1">{errors.dateApplied}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Disability Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Disability Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Disability Type</label>
                                            <select
                                                value={data.disability_type_id}
                                                onChange={e => setData('disability_type_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Disability Type</option>
                                                {disabilityTypes.map(type => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </select>
                                            {errors.disability_type_id && <div className="text-red-500 text-sm mt-1">{errors.disability_type_id}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Disability Cause</label>
                                            <select
                                                value={data.disability_cause_id}
                                                onChange={e => setData('disability_cause_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Disability Cause</option>
                                                {disabilityCauses.map(cause => (
                                                    <option key={cause.id} value={cause.id}>{cause.name}</option>
                                                ))}
                                            </select>
                                            {errors.disability_cause_id && <div className="text-red-500 text-sm mt-1">{errors.disability_cause_id}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Address and Contact Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address and Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Region</label>
                                            <select
                                                value={data.region_id}
                                                onChange={handleRegionChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Region</option>
                                                {regions.map(region => (
                                                    <option key={region.id} value={region.id}>{region.name}</option>
                                                ))}
                                            </select>
                                            {errors.region_id && <div className="text-red-500 text-sm mt-1">{errors.region_id}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Province</label>
                                            <select
                                                value={data.province_id}
                                                onChange={handleProvinceChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                disabled={!data.region_id}
                                            >
                                                <option value="">Select Province</option>
                                                {provinces.map(province => (
                                                    <option key={province.id} value={province.id}>{province.name}</option>
                                                ))}
                                            </select>
                                            {errors.province_id && <div className="text-red-500 text-sm mt-1">{errors.province_id}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Municipality/City</label>
                                            <select
                                                value={data.municipality_id}
                                                onChange={handleMunicipalityChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                disabled={!data.province_id}
                                            >
                                                <option value="">Select Municipality/City</option>
                                                {municipalities.map(municipality => (
                                                    <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
                                                ))}
                                            </select>
                                            {errors.municipality_id && <div className="text-red-500 text-sm mt-1">{errors.municipality_id}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Barangay</label>
                                            <select
                                                value={data.barangay_id}
                                                onChange={e => setData('barangay_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                disabled={!data.municipality_id}
                                            >
                                                <option value="">Select Barangay</option>
                                                {barangays.map(barangay => (
                                                    <option key={barangay.id} value={barangay.id}>{barangay.name}</option>
                                                ))}
                                            </select>
                                            {errors.barangay_id && <div className="text-red-500 text-sm mt-1">{errors.barangay_id}</div>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">House No./Street/Subdivision</label>
                                            <input
                                                type="text"
                                                value={data.house}
                                                onChange={e => setData('house', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.house && <div className="text-red-500 text-sm mt-1">{errors.house}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Landline Number</label>
                                            <input
                                                type="text"
                                                value={data.landline}
                                                onChange={e => setData('landline', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.landline && <div className="text-red-500 text-sm mt-1">{errors.landline}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Employment and Education */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Employment and Education</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Education</label>
                                            <select
                                                value={data.education}
                                                onChange={e => setData('education', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Education Level</option>
                                                <option value="None">None</option>
                                                <option value="Elementary">Elementary</option>
                                                <option value="High School">High School</option>
                                                <option value="Vocational">Vocational</option>
                                                <option value="College">College</option>
                                                <option value="Post Graduate">Post Graduate</option>
                                            </select>
                                            {errors.education && <div className="text-red-500 text-sm mt-1">{errors.education}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                                            <select
                                                value={data.employmentStatus}
                                                onChange={e => setData('employmentStatus', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Employment Status</option>
                                                <option value="Employed">Employed</option>
                                                <option value="Unemployed">Unemployed</option>
                                                <option value="Self-employed">Self-employed</option>
                                            </select>
                                            {errors.employmentStatus && <div className="text-red-500 text-sm mt-1">{errors.employmentStatus}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Employment Category</label>
                                            <select
                                                value={data.employmentCategory}
                                                onChange={e => setData('employmentCategory', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Government">Government</option>
                                                <option value="Private">Private</option>
                                            </select>
                                            {errors.employmentCategory && <div className="text-red-500 text-sm mt-1">{errors.employmentCategory}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                                            <select
                                                value={data.employmentType}
                                                onChange={e => setData('employmentType', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Permanent">Permanent</option>
                                                <option value="Temporary">Temporary</option>
                                                <option value="Contractual">Contractual</option>
                                            </select>
                                            {errors.employmentType && <div className="text-red-500 text-sm mt-1">{errors.employmentType}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Occupation</label>
                                            <input
                                                type="text"
                                                value={data.occupation}
                                                onChange={e => setData('occupation', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.occupation && <div className="text-red-500 text-sm mt-1">{errors.occupation}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Other Occupation</label>
                                            <input
                                                type="text"
                                                value={data.occupationOther}
                                                onChange={e => setData('occupationOther', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.occupationOther && <div className="text-red-500 text-sm mt-1">{errors.occupationOther}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Organization Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Organization Affiliated</label>
                                            <input
                                                type="text"
                                                value={data.organizationAffiliated}
                                                onChange={e => setData('organizationAffiliated', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.organizationAffiliated && <div className="text-red-500 text-sm mt-1">{errors.organizationAffiliated}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                                            <input
                                                type="text"
                                                value={data.organizationContact}
                                                onChange={e => setData('organizationContact', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.organizationContact && <div className="text-red-500 text-sm mt-1">{errors.organizationContact}</div>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Organization Address</label>
                                            <textarea
                                                value={data.organizationAddress}
                                                onChange={e => setData('organizationAddress', e.target.value)}
                                                rows={2}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.organizationAddress && <div className="text-red-500 text-sm mt-1">{errors.organizationAddress}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Telephone No.</label>
                                            <input
                                                type="text"
                                                value={data.organizationTel}
                                                onChange={e => setData('organizationTel', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.organizationTel && <div className="text-red-500 text-sm mt-1">{errors.organizationTel}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* ID Numbers */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">ID Numbers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">SSS Number</label>
                                            <input
                                                type="text"
                                                value={data.sssNo}
                                                onChange={e => setData('sssNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.sssNo && <div className="text-red-500 text-sm mt-1">{errors.sssNo}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">GSIS Number</label>
                                            <input
                                                type="text"
                                                value={data.gsisNo}
                                                onChange={e => setData('gsisNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.gsisNo && <div className="text-red-500 text-sm mt-1">{errors.gsisNo}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Pag-IBIG Number</label>
                                            <input
                                                type="text"
                                                value={data.pagIbigNo}
                                                onChange={e => setData('pagIbigNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.pagIbigNo && <div className="text-red-500 text-sm mt-1">{errors.pagIbigNo}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">PSN Number</label>
                                            <input
                                                type="text"
                                                value={data.psnNo}
                                                onChange={e => setData('psnNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.psnNo && <div className="text-red-500 text-sm mt-1">{errors.psnNo}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">PhilHealth Number</label>
                                            <input
                                                type="text"
                                                value={data.philhealthNo}
                                                onChange={e => setData('philhealthNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.philhealthNo && <div className="text-red-500 text-sm mt-1">{errors.philhealthNo}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Family Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Family Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                                            <input
                                                type="text"
                                                value={data.fatherName}
                                                onChange={e => setData('fatherName', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.fatherName && <div className="text-red-500 text-sm mt-1">{errors.fatherName}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                                            <input
                                                type="text"
                                                value={data.motherName}
                                                onChange={e => setData('motherName', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.motherName && <div className="text-red-500 text-sm mt-1">{errors.motherName}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Guardian's Name</label>
                                            <input
                                                type="text"
                                                value={data.guardianName}
                                                onChange={e => setData('guardianName', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.guardianName && <div className="text-red-500 text-sm mt-1">{errors.guardianName}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Official Details */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Official Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Accomplished By</label>
                                            <input
                                                type="text"
                                                value={data.accomplishedBy}
                                                onChange={e => setData('accomplishedBy', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Certifying Physician</label>
                                            <input
                                                type="text"
                                                value={data.certifyingPhysician}
                                                onChange={e => setData('certifyingPhysician', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.certifyingPhysician && <div className="text-red-500 text-sm mt-1">{errors.certifyingPhysician}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Physician License No.</label>
                                            <input
                                                type="text"
                                                value={data.physicianLicenseNo}
                                                onChange={e => setData('physicianLicenseNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.physicianLicenseNo && <div className="text-red-500 text-sm mt-1">{errors.physicianLicenseNo}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Processing Officer</label>
                                            <input
                                                type="text"
                                                value={data.processingOfficer}
                                                onChange={e => setData('processingOfficer', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.processingOfficer && <div className="text-red-500 text-sm mt-1">{errors.processingOfficer}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Approving Officer</label>
                                            <input
                                                type="text"
                                                value={data.approvingOfficer}
                                                onChange={e => setData('approvingOfficer', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.approvingOfficer && <div className="text-red-500 text-sm mt-1">{errors.approvingOfficer}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reporting Unit</label>
                                            <input
                                                type="text"
                                                value={data.reportingUnit}
                                                onChange={e => setData('reportingUnit', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                            />
                                            {errors.reportingUnit && <div className="text-red-500 text-sm mt-1">{errors.reportingUnit}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Control No.</label>
                                            <input
                                                type="text"
                                                value={data.controlNo}
                                                onChange={e => setData('controlNo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

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