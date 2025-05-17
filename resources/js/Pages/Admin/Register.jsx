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
    lastName: '',
    firstName: '',
    middleName: '',
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
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianLastName: '',
    accomplishedBy: '',
    accomplishedFirstName: '',
    accomplishedMiddleName: '',
    accomplishedLastName: '',
    physicianLicenseNo: '',
    certifyingPhysicianFirstName: '',
    certifyingPhysicianMiddleName: '',
    certifyingPhysicianLastName: '',
    encoder: '',
    processingOfficer: '',
    approvingOfficer: '',
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
  
    const isUnique = await checkDuplicates();
    if (!isUnique) {
      alert('Duplicate entry found. Please fix the highlighted fields.');
      return;
    }
  
    const formattedValues = {
      ...values,
      certifyingPhysician: `${values.certifyingPhysicianFirstName} ${values.certifyingPhysicianMiddleName} ${values.certifyingPhysicianLastName}`.trim(),
      accomplishedBy: values.accomplishedBy,
      accomplishedFirstName: values.accomplishedFirstName,
      accomplishedMiddleName: values.accomplishedMiddleName,
      accomplishedLastName: values.accomplishedLastName,      
      fatherName: `${values.fatherFirstName} ${values.fatherMiddleName} ${values.fatherLastName}`.trim(),
      motherName: `${values.motherFirstName} ${values.motherMiddleName} ${values.motherLastName}`.trim(),
      guardianName: `${values.guardianFirstName} ${values.guardianMiddleName} ${values.guardianLastName}`.trim(),
    };
  
    const formData = new FormData();
    for (const key in formattedValues) {
      if (!['photo', 'signature', 'photoPreview', 'signaturePreview'].includes(key)) {
        const value = formattedValues[key];
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
  
    Inertia.post(route('pwd.register'), formData, {
      forceFormData: true,
      onError: (errors) => {
        const firstErrorField = Object.keys(errors)[0];
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
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
