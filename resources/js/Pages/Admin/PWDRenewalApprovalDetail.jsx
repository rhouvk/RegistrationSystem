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

export default function PWDRenewalApprovalDetail({ renewal, disabilityTypes, disabilityCauses, regions, provinces: initialProvinces, municipalities: initialMunicipalities, barangays: initialBarangays }) {
  const [provinces, setProvinces] = useState(initialProvinces);
  const [municipalities, setMunicipalities] = useState(initialMunicipalities);
  const [barangays, setBarangays] = useState(initialBarangays);

  const { data, setData, post, processing, errors } = useForm({
    pwdNumber: renewal.pwdNumber || '',
    dateApplied: renewal.dateApplied ? new Date(renewal.dateApplied).toISOString().split('T')[0] : '',
    first_name: renewal.first_name || '',
    middle_name: renewal.middle_name || '',
    last_name: renewal.last_name || '',
    suffix: renewal.suffix || '',
    dob: renewal.dob ? new Date(renewal.dob).toISOString().split('T')[0] : '',
    sex: renewal.sex || '',
    civilStatus: renewal.civilStatus || '',
    disability_type_id: renewal.disability_type_id || '',
    disability_cause_id: renewal.disability_cause_id || '',
    region_id: renewal.region_id || '',
    province_id: renewal.province_id || '',
    municipality_id: renewal.municipality_id || '',
    barangay_id: renewal.barangay_id || '',
    house: renewal.house || '',
    landline: renewal.landline || '',
    phone: renewal.phone || '',
    email: renewal.email || '',
    education: renewal.education || '',
    employmentStatus: renewal.employmentStatus || '',
    employmentCategory: renewal.employmentCategory || '',
    employmentType: renewal.employmentType || '',
    occupation: renewal.occupation || '',
    occupationOther: renewal.occupationOther || '',
    organizationAffiliated: renewal.organizationAffiliated || '',
    organizationContact: renewal.organizationContact || '',
    organizationAddress: renewal.organizationAddress || '',
    organizationTel: renewal.organizationTel || '',
    sssNo: renewal.sssNo || '',
    gsisNo: renewal.gsisNo || '',
    pagIbigNo: renewal.pagIbigNo || '',
    psnNo: renewal.psnNo || '',
    philhealthNo: renewal.philhealthNo || '',
    father_first_name: renewal.father_first_name || '',
    father_middle_name: renewal.father_middle_name || '',
    father_last_name: renewal.father_last_name || '',
    mother_first_name: renewal.mother_first_name || '',
    mother_middle_name: renewal.mother_middle_name || '',
    mother_last_name: renewal.mother_last_name || '',
    guardian_first_name: renewal.guardian_first_name || '',
    guardian_middle_name: renewal.guardian_middle_name || '',
    guardian_last_name: renewal.guardian_last_name || '',
    accomplishedBy: renewal.accomplishedBy || 'applicant',
    accomplished_by_first_name: renewal.accomplished_by_first_name || '',
    accomplished_by_middle_name: renewal.accomplished_by_middle_name || '',
    accomplished_by_last_name: renewal.accomplished_by_last_name || '',
    photo: renewal.photo || null,
    signature: renewal.signature || null,
    photoPreview: renewal.photo ? `/storage/${renewal.photo}` : null,
    signaturePreview: renewal.signature ? `/storage/${renewal.signature}` : null,
    certifying_physician_first_name: renewal.certifying_physician_first_name || '',
    certifying_physician_middle_name: renewal.certifying_physician_middle_name || '',
    certifying_physician_last_name: renewal.certifying_physician_last_name || '',
    physician_license_no: renewal.physician_license_no || '',
    processing_officer_first_name: renewal.processing_officer_first_name || '',
    processing_officer_middle_name: renewal.processing_officer_middle_name || '',
    processing_officer_last_name: renewal.processing_officer_last_name || '',
    approving_officer_first_name: renewal.approving_officer_first_name || '',
    approving_officer_middle_name: renewal.approving_officer_middle_name || '',
    approving_officer_last_name: renewal.approving_officer_last_name || '',
    encoder_first_name: renewal.encoder_first_name || '',
    encoder_middle_name: renewal.encoder_middle_name || '',
    encoder_last_name: renewal.encoder_last_name || '',
    reportingUnit: renewal.reportingUnit || '',
    controlNo: renewal.controlNo || '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
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

    post(route('admin.pwd.renewals.update', renewal.id), formData, {
      forceFormData: true,
      onSuccess: () => {
        router.visit(route('admin.pwd.renewals.index'));
      }
    });
  };

  const approve = () => {
    if (confirm('Are you sure you want to approve this renewal request?')) {
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
      router.post(route('admin.pwd.renewals.approve', renewal.id), formData, {
        forceFormData: true
      });
    }
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">PWD Renewal Request Details</h2>}>
      <Head title="PWD Renewal Request Details" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
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
                    onClick={() => router.visit(route('admin.pwd.renewals.index'))}
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