// File: resources/js/Pages/Admin/Register.jsx

import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '@/Layouts/AdminLayout';

// Import the new form parts
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






export default function Register(props) {
  const { auth } = usePage().props;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [duplicateErrors, setDuplicateErrors] = useState({});

  // ✅ Check duplicates before submitting
  const checkDuplicates = async () => {
    try {
      const response = await axios.post(route('pwd.check-duplicates'), {
        pwdNumber: values.pwdNumber,
        email: values.email,
        phone: values.mobile,
      });
  
      const data = response.data;
  
      if (data.pwdNumber || data.email || data.phone) {
        setDuplicateErrors(data);
        return false;
      }
  
      setDuplicateErrors({});
      return true;
    } catch (err) {
      console.error('Error checking duplicates:', err);
      return false;
    }
  };


  // Safe default values even if backend not sending yet
  const regions = props.regions ?? [];
  const provinces = props.provinces ?? [];
  const municipalities = props.municipalities ?? [];
  const barangays = props.barangays ?? [];
  const disabilityTypes = props.disabilityTypes ?? [];
  const disabilityCauses = props.disabilityCauses ?? [];

  const [values, setValues] = useState({
    pwdNumber: '',
    dateApplied: new Date().toISOString().split('T')[0],
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    dob: '',
    sex: '',
    civilStatus: '',
    disability_type_id: '',
    disability_cause_id: '',
    house: '',
    barangay_id: '',
    municipality_id: '',
    province_id: '',
    region_id: '',
    landline: '',
    mobile: '',
    email: '',
    education: '',
    employmentStatus: '',
    employmentCategory: '',
    employmentType: '',
    occupation: '',
    occupationOther: '',
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
    accomplishedBy: 'applicant',
    accomplished_by_first_name: '',
    accomplished_by_middle_name: '',
    accomplished_by_last_name: '',
    certifying_physician_first_name: '',
    certifying_physician_middle_name: '',
    certifying_physician_last_name: '',
    physician_license_no: '',
    processing_officer_first_name: '',
    processing_officer_middle_name: '',
    processing_officer_last_name: '',
    approving_officer_first_name: '',
    approving_officer_middle_name: '',
    approving_officer_last_name: '',
    encoder_first_name: '',
    encoder_middle_name: '',
    encoder_last_name: '',
    reportingUnit: '',
    controlNo: '',
    photo: null,
    signature: null,
    photoPreview: null,
    signaturePreview: null,
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if ((name === 'disabilityTypes' || name === 'disabilityCauses') && type === 'checkbox') {
      setValues((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      pwdNumber: 'PWD Number',
      last_name: 'Last Name',
      first_name: 'First Name',
      dob: 'Date of Birth',
      sex: 'Sex',
      civilStatus: 'Civil Status',
      disability_type_id: 'Type of Disability',
      disability_cause_id: 'Cause of Disability',
      house: 'House No.',
      barangay_id: 'Barangay',
      municipality_id: 'Municipality',
      province_id: 'Province',
      region_id: 'Region',
      education: 'Educational Attainment',
      employmentStatus: 'Status of Employment',
      processing_officer_first_name: 'Processing Officer',
      approving_officer_first_name: 'Approving Officer',
      encoder_first_name: 'Encoder',
      reportingUnit: 'Reporting Unit',
      controlNo: 'Control No.'
    };

    // Check if at least one contact method is provided
    if (!values.email && !values.mobile) {
      alert('Please provide either an email address or mobile number.');
      return;
    }

    // Check all required fields
    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !values[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n${missingFields.join('\n')}`);
      return;
    }

    const isUnique = await checkDuplicates();
    if (!isUnique) {
      alert('Duplicate entry found. Please fix the highlighted fields.');
      return;
    }
  
    const formData = new FormData();
    for (const key in values) {
      if (!['photo', 'signature', 'photoPreview', 'signaturePreview'].includes(key)) {
        const value = values[key];
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    }
  
    if (values.photo) {
      formData.append('photo', values.photo);
    }
    if (values.signature) {
      formData.append('signature', values.signature);
    }

    // Debug logging
    console.log('Submitting form data:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    Inertia.post(route('pwd.register'), formData, {
      forceFormData: true,
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        const firstErrorField = Object.keys(errors)[0];
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      onSuccess: (response) => {
        console.log('Form submitted successfully:', response);
      }
    });
  };
  
  
  
  const handleChangeFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];
  
    if (file) {
      setValues(prev => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <AdminLayout
      header={<h2 className="text-xl font-semibold leading-tight">PWD Registration</h2>}
    >
      <Head title="PWD Registration" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white p-6 shadow-sm sm:rounded-lg">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">


              {/* Form Parts */}
              <PersonalInfoForm values={values} handleChange={handleChange} duplicateErrors={duplicateErrors} />
              <DisabilityInfoForm values={values} handleChange={handleChange} disabilityTypes={disabilityTypes} disabilityCauses={disabilityCauses} />
              <ResidenceAddressForm values={values} handleChange={handleChange} regions={regions} provinces={provinces} municipalities={municipalities} barangays={barangays} />
              <ContactDetailsForm values={values} handleChange={handleChange} duplicateErrors={duplicateErrors} />
              <EducationEmploymentForm values={values} handleChange={handleChange} />
              <OrganizationInfoForm values={values} handleChange={handleChange} />
              <IdReferenceForm values={values} handleChange={handleChange} />
              <FamilyBackgroundForm values={values} handleChange={handleChange} />
              <AccomplishedByForm values={values} handleChange={handleChange} />
              <CertifyingPhysicianForm values={values} handleChange={handleChange} />
              <OfficersForm values={values} handleChange={handleChange} />
              <ReportingInfoForm values={values} handleChange={handleChange} />
              <PhotoSignatureUpload values={values} handleChangeFile={handleChangeFile} />


              {/* Submit Button */}
              <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
              >
                Submit Registration
              </button>
            </div>


            </form>
          </div>
        </div>
      </div>

      {showConfirmation && (
      <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-4">Confirm Submission</h2>
          <p className="mb-4 text-gray-700">Are you sure you want to submit this registration?</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={handleSubmit}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}


    </AdminLayout>
  );
}
