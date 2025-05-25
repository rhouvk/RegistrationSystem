import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
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
import CertifyingPhysicianForm from '@/Components/CertifyingPhysicianForm';
import OfficersForm from '@/Components/OfficersForm';
import ReportingInfoForm from '@/Components/ReportingInfoForm';

export default function PWDPreregistrationApprovalDetail({ preregistration, disabilityTypes, disabilityCauses, regions, provinces: initialProvinces, municipalities: initialMunicipalities, barangays: initialBarangays }) {
  const [provinces, setProvinces] = useState(initialProvinces);
  const [municipalities, setMunicipalities] = useState(initialMunicipalities);
  const [barangays, setBarangays] = useState(initialBarangays);

  const { data, setData, post, processing, errors } = useForm({
    pwdNumber: preregistration.pwdNumber || '',
    dateApplied: preregistration.dateApplied ? new Date(preregistration.dateApplied).toISOString().split('T')[0] : '',
    first_name: preregistration.first_name || '',
    middle_name: preregistration.middle_name || '',
    last_name: preregistration.last_name || '',
    suffix: preregistration.suffix || '',
    dob: preregistration.dob ? new Date(preregistration.dob).toISOString().split('T')[0] : '',
    sex: preregistration.sex || '',
    civilStatus: preregistration.civilStatus || '',
    disability_type_id: preregistration.disability_type_id || '',
    disability_cause_id: preregistration.disability_cause_id || '',
    region_id: preregistration.region_id || '',
    province_id: preregistration.province_id || '',
    municipality_id: preregistration.municipality_id || '',
    barangay_id: preregistration.barangay_id || '',
    house: preregistration.house || '',
    landline: preregistration.landline || '',
    phone: preregistration.phone || '',
    email: preregistration.email || '',
    education: preregistration.education || '',
    employmentStatus: preregistration.employmentStatus || '',
    employmentCategory: preregistration.employmentCategory || '',
    employmentType: preregistration.employmentType || '',
    occupation: preregistration.occupation || '',
    occupationOther: preregistration.occupationOther || '',
    organizationAffiliated: preregistration.organizationAffiliated || '',
    organizationContact: preregistration.organizationContact || '',
    organizationAddress: preregistration.organizationAddress || '',
    organizationTel: preregistration.organizationTel || '',
    sssNo: preregistration.sssNo || '',
    gsisNo: preregistration.gsisNo || '',
    pagIbigNo: preregistration.pagIbigNo || '',
    psnNo: preregistration.psnNo || '',
    philhealthNo: preregistration.philhealthNo || '',
    father_first_name: preregistration.father_first_name || '',
    father_middle_name: preregistration.father_middle_name || '',
    father_last_name: preregistration.father_last_name || '',
    mother_first_name: preregistration.mother_first_name || '',
    mother_middle_name: preregistration.mother_middle_name || '',
    mother_last_name: preregistration.mother_last_name || '',
    guardian_first_name: preregistration.guardian_first_name || '',
    guardian_middle_name: preregistration.guardian_middle_name || '',
    guardian_last_name: preregistration.guardian_last_name || '',
    accomplishedBy: preregistration.accomplishedBy || 'applicant',
    accomplished_by_first_name: preregistration.accomplished_by_first_name || '',
    accomplished_by_middle_name: preregistration.accomplished_by_middle_name || '',
    accomplished_by_last_name: preregistration.accomplished_by_last_name || '',
    photo: preregistration.photo || null,
    signature: preregistration.signature || null,
    photoPreview: preregistration.photo ? `/storage/${preregistration.photo}` : null,
    signaturePreview: preregistration.signature ? `/storage/${preregistration.signature}` : null,
    certifying_physician_first_name: preregistration.certifying_physician_first_name || '',
    certifying_physician_middle_name: preregistration.certifying_physician_middle_name || '',
    certifying_physician_last_name: preregistration.certifying_physician_last_name || '',
    physician_license_no: preregistration.physician_license_no || '',
    processing_officer_first_name: preregistration.processing_officer_first_name || '',
    processing_officer_middle_name: preregistration.processing_officer_middle_name || '',
    processing_officer_last_name: preregistration.processing_officer_last_name || '',
    approving_officer_first_name: preregistration.approving_officer_first_name || '',
    approving_officer_middle_name: preregistration.approving_officer_middle_name || '',
    approving_officer_last_name: preregistration.approving_officer_last_name || '',
    encoder_first_name: preregistration.encoder_first_name || '',
    encoder_middle_name: preregistration.encoder_middle_name || '',
    encoder_last_name: preregistration.encoder_last_name || '',
    reportingUnit: preregistration.reportingUnit || '',
    controlNo: preregistration.controlNo || '',
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
      setData(name, file);
      setData(`${name}Preview`, URL.createObjectURL(file));
    }
  };

  const approve = () => {
    if (confirm('Are you sure you want to approve this pre-registration request?')) {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (["photoPreview", "signaturePreview"].includes(key)) return;
        
        const value = data[key];
        
        if (value instanceof File) {
          formData.append(key, value);
        } 
        else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Send form data directly to approve route
      router.post(route('admin.pwd.preregistrations.approve', preregistration.id), formData, {
        forceFormData: true
      });
    }
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">PWD Pre-registration Request Details</h2>}>
      <Head title="PWD Pre-registration Request Details" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form encType="multipart/form-data" className="space-y-8">
                <PersonalInfoForm values={data} handleChange={handleChange} />
                <DisabilityInfoForm values={data} handleChange={handleChange} disabilityTypes={disabilityTypes} disabilityCauses={disabilityCauses} />
                <ResidenceAddressForm 
                  values={data} 
                  handleChange={handleChange} 
                  handleRegionChange={handleRegionChange}
                  handleProvinceChange={handleProvinceChange}
                  handleMunicipalityChange={handleMunicipalityChange}
                  regions={regions} 
                  provinces={provinces} 
                  municipalities={municipalities} 
                  barangays={barangays} 
                />
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
                  <button
                    type="button"
                    onClick={() => router.visit(route('admin.pwd.preregistrations.index'))}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={approve}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Approve
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