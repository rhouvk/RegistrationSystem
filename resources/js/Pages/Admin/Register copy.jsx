import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Register() {
  const { auth } = usePage().props;

  // Initial state: note that the officer fields are now a single field each.
  const [values, setValues] = useState({
    // Application Information
    pwdNumber: '',
    dateApplied: new Date().toISOString().split('T')[0],
    // Personal Information
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: '',
    dob: '',
    sex: '',
    civilStatus: '',
    // Disability Information
    disabilityTypes: [],
    disabilityCauses: [],
    // Residence Address
    house: '',
    barangay: '',
    municipality: '',
    province: '',
    region: '11',
    // Contact Details
    landline: '',
    phone: '',
    email: '',
    // Educational & Employment
    education: '',
    employmentStatus: '',
    employmentCategory: '',
    employmentType: '',
    occupation: '',
    occupationOther: '',
    // Organization Information
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
    // Family Background
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianLastName: '',
    // Accomplished By
    accomplishedBy: '',
    accomplishedFirstName: '',
    accomplishedMiddleName: '',
    accomplishedLastName: '',
    // Certifying Physician
    physicianLicenseNo: '',
    certifyingPhysicianFirstName: '',
    certifyingPhysicianMiddleName: '',
    certifyingPhysicianLastName: '',
    // Officer Fields (only one input per field)
    encoder: '',
    processingOfficer: '',
    approvingOfficer: '',
    controlNo: '',
  });

  // Formatters for certain fields.
  const formatPWDNumber = (input) => {
    const digits = input.replace(/\D/g, '').slice(0, 15);
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 6),
      digits.slice(6, 9),
      digits.slice(9, 16),
    ].filter(Boolean);
    return parts.join('-');
  };

  const formatSSS = (val) => 
    val.replace(/\D/g, '').slice(0, 10)
    .replace(/^(\d{2})(\d{7})(\d{1})?/, (_, a, b, c) => `${a}-${b}-${c || ''}`.replace(/-$/, ''));

  const formatGSIS = (val) => 
    val.replace(/\D/g, '').slice(0, 12)
    .replace(/^(\d{4})(\d{7})(\d{1})?/, (_, a, b, c) => `${a}-${b}-${c || ''}`.replace(/-$/, ''));

  const formatPagIbig = (val) => 
    val.replace(/\D/g, '').slice(0, 12)
    .replace(/^(\d{4})(\d{4})(\d{4})?/, (_, a, b, c) => `${a}-${b}-${c || ''}`.replace(/-$/, ''));

  const formatPhilHealth = (val) => 
    val.replace(/\D/g, '').slice(0, 13)
    .replace(/^(\d{2})(\d{9})(\d{1})?/, (_, a, b, c) => `${a}-${b}-${c || ''}`.replace(/-$/, ''));

  const formatPSN = (val) => 
    val.replace(/\D/g, '').slice(0, 16)
    .replace(/^(\d{4})(\d{4})(\d{4})(\d{4})?/, (_, a, b, c, d) => `${a}-${b}-${c}-${d || ''}`.replace(/-$/, ''));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && (name === 'disabilityTypes' || name === 'disabilityCauses')) {
      setValues((prevValues) => {
        const updatedValues = checked
          ? [...prevValues[name], value]
          : prevValues[name].filter((item) => item !== value);
        return { ...prevValues, [name]: updatedValues };
      });
    } else {
      let formattedValue = value;

      switch (name) {
        case 'pwdNumber':
          formattedValue = formatPWDNumber(value);
          break;
        case 'sssNo':
          formattedValue = formatSSS(value);
          break;
        case 'gsisNo':
          formattedValue = formatGSIS(value);
          break;
        case 'pagIbigNo':
          formattedValue = formatPagIbig(value);
          break;
        case 'psnNo':
          formattedValue = formatPSN(value);
          break;
        case 'philhealthNo':
          formattedValue = formatPhilHealth(value);
          break;
        default:
          break;
      }

      setValues((prevValues) => ({
        ...prevValues,
        [name]: formattedValue,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedValues = {
      ...values,
      // Process the Certifying Physician name by merging individual parts.
      certifyingPhysician: `${values.certifyingPhysicianFirstName} ${values.certifyingPhysicianMiddleName} ${values.certifyingPhysicianLastName}`.trim(),
      // For the officer fields, now simply pass the input value.
      encoder: values.encoder,
      processingOfficer: values.processingOfficer,
      approvingOfficer: values.approvingOfficer,
      // Process "Accomplished By"
      accomplishedBy:
        values.accomplishedBy === 'applicant'
          ? 'Applicant'
          : `${values.accomplishedBy.charAt(0).toUpperCase() + values.accomplishedBy.slice(1)} - ${values.accomplishedFirstName} ${values.accomplishedMiddleName} ${values.accomplishedLastName}`.trim(),
      // Merge family background names
      fatherName: `${values.fatherFirstName} ${values.fatherMiddleName} ${values.fatherLastName}`.trim(),
      motherName: `${values.motherFirstName} ${values.motherMiddleName} ${values.motherLastName}`.trim(),
      guardianName: `${values.guardianFirstName} ${values.guardianMiddleName} ${values.guardianLastName}`.trim(),
    };

    Inertia.post(route('pwd.register'), formattedValues);
  };

  return (
    <AdminLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          PWD Registration
        </h2>
      }
    >
      <Head title="PWD Registration" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PWD Number & Date Applied */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    1. PWD Number <span className="text-sm font-normal text-gray-600">(Format: RR-PPMM-BBB-NNNNNNN)</span>
                  </h3>
                  <input
                    type="text"
                    name="pwdNumber"
                    placeholder="01-0001-001-0000001"
                    value={values.pwdNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">2. Date Applied</h3>
                  <input
                    type="date"
                    name="dateApplied"
                    value={values.dateApplied}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">3. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={values.middleName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Suffix</label>
                    <input
                      type="text"
                      name="suffix"
                      value={values.suffix}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">4. Date of Birth (mm/dd/yyyy)</h3>
                    <input
                      type="date"
                      name="dob"
                      value={values.dob}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">5. Sex</h3>
                    <div className="flex space-x-4 mt-1">
                      {['female', 'male'].map((gender, index) => (
                        <label key={gender} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="sex"
                            value={gender}
                            checked={values.sex === gender}
                            onChange={handleChange}
                            required={index === 0}
                            className="form-radio"
                          />
                          <span className="ml-2 capitalize">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">6. Civil Status</h3>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {['single', 'separated', 'cohabitation', 'married', 'widow'].map((status, index) => (
                      <label key={status} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="civilStatus"
                          value={status}
                          checked={values.civilStatus === status}
                          onChange={handleChange}
                          required={index === 0}
                          className="form-radio"
                        />
                        <span className="ml-2 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type of Disability */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">7. Type of Disability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Deaf or Hard of Hearing', value: 'Deaf or Hard of Hearing' },
                    { label: 'Intellectual Disability', value: 'Intellectual Disability' },
                    { label: 'Learning Disability', value: 'Learning Disability' },
                    { label: 'Mental Disability', value: 'Mental Disability' },
                    { label: 'Physical Disability (Orthopedic)', value: 'Physical Disability' },
                    { label: 'Psychosocial Disability', value: 'Psychosocial Disability' },
                    { label: 'Speech and Language Impairment', value: 'Speech and Language Impairment' },
                    { label: 'Visual Disability', value: 'Visual Disability' },
                    { label: 'Cancer (RA11215)', value: 'Cancer' },
                    { label: 'Rare Disease (RA10747)', value: 'Rare Disease' },
                  ].map((item) => (
                    <label key={item.value} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="disabilityTypes"
                        value={item.value}
                        checked={values.disabilityTypes.includes(item.value)}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Cause of Disability */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">8. Cause of Disability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Congenital / Inborn', value: 'Congenital / Inborn' },
                    { label: 'Acquired', value: 'Acquired' },
                    { label: 'Autism', value: 'Autism' },
                    { label: 'ADHD', value: 'ADHD' },
                    { label: 'Cerebral Palsy', value: 'Cerebral Palsy' },
                    { label: 'Down Syndrome', value: 'Down Syndrome' },
                    { label: 'Chronic Illness', value: 'Chronic Illness' },
                    { label: 'Injury', value: 'Injury' },
                  ].map((item) => (
                    <label key={item.value} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="disabilityCauses"
                        value={item.value}
                        checked={values.disabilityCauses.includes(item.value)}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Residence Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">9. Residence Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Region</label>
                    <select
                      name="region"
                      value={values.region}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="11">Region XI (Davao Region)</option>
                    </select>
                  </div>
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Province</label>
                    <select
                      name="province"
                      value={values.province}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Province</option>
                      <option value="Davao del Norte">Davao del Norte</option>
                      <option value="Davao del Sur">Davao del Sur</option>
                      <option value="Davao Oriental">Davao Oriental</option>
                      <option value="Davao de Oro">Davao de Oro</option>
                      <option value="Davao Occidental">Davao Occidental</option>
                    </select>
                  </div>
                  {/* Municipality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Municipality</label>
                    <select
                      name="municipality"
                      value={values.municipality}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Municipality</option>
                      <option value="Davao City">Davao City</option>
                      <option value="Tagum City">Tagum City</option>
                      <option value="Panabo City">Panabo City</option>
                    </select>
                  </div>
                  {/* Barangay */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Barangay</label>
                    <select
                      name="barangay"
                      value={values.barangay}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Barangay</option>
                      <option value="Barangay 1">Barangay 1</option>
                      <option value="Barangay 2">Barangay 2</option>
                      <option value="Barangay 3">Barangay 3</option>
                    </select>
                  </div>
                  {/* House No. and Street */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">House No. and Street</label>
                    <input
                      type="text"
                      name="house"
                      value={values.house}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">10. Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Landline No.</label>
                    <input
                      type="text"
                      name="landline"
                      value={values.landline}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
                    <input
                      type="text"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              {/* Educational Attainment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">11. Educational Attainment</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    'none',
                    'kindergarten',
                    'elementary',
                    'junior high school',
                    'senior high school',
                    'college',
                    'vocational',
                    'post graduate',
                  ].map((level, index) => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="education"
                        value={level}
                        checked={values.education === level}
                        onChange={handleChange}
                        required={index === 0}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Employment Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">12. Status of Employment</h3>
                <div className="flex flex-wrap gap-4">
                  {['employed', 'unemployed', 'self-employed'].map((status, index) => (
                    <label key={status} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="employmentStatus"
                        value={status}
                        checked={values.employmentStatus === status}
                        onChange={handleChange}
                        required={index === 0}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              {values.employmentStatus === 'employed' && (
                <>
                  {/* Category of Employment */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">12a. Category of Employment</h3>
                    <div className="flex flex-wrap gap-4">
                      {['private', 'public'].map((category) => (
                        <label key={category} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="employmentCategory"
                            value={category}
                            checked={values.employmentCategory === category}
                            onChange={handleChange}
                            className="form-radio"
                          />
                          <span className="ml-2 capitalize">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
  
                  {/* Types of Employment */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">12b. Types of Employment</h3>
                    <div className="flex flex-wrap gap-4">
                      {['permanent/regular', 'seasonal', 'casual', 'emergency'].map((type) => (
                        <label key={type} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="employmentType"
                            value={type}
                            checked={values.employmentType === type}
                            onChange={handleChange}
                            className="form-radio"
                          />
                          <span className="ml-2 capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
  
              {['employed', 'self-employed'].includes(values.employmentStatus) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">13. Occupation</h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      'managers',
                      'professionals',
                      'technicians and associate professionals',
                      'clerical support workers',
                      'service and sales workers',
                      'skilled agricultural, forestry and fishery workers',
                      'craft and related trade workers',
                      'plant and machine operators and assemblers',
                      'elementary occupations',
                      'armed forces occupations',
                      'others',
                    ].map((occ, index) => (
                      <label key={occ} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="occupation"
                          value={occ}
                          checked={values.occupation === occ}
                          onChange={handleChange}
                          required={index === 0}
                          className="form-radio"
                        />
                        <span className="ml-2 capitalize">{occ}</span>
                      </label>
                    ))}
                    {values.occupation === 'others' && (
                      <input
                        type="text"
                        name="occupationOther"
                        value={values.occupationOther}
                        onChange={handleChange}
                        placeholder="Specify occupation"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                </div>
              )}
  
              {/* Organization Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">14. Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Affiliated</label>
                    <input
                      type="text"
                      name="organizationAffiliated"
                      value={values.organizationAffiliated}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                    <input
                      type="text"
                      name="organizationContact"
                      value={values.organizationContact}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Office Address</label>
                    <input
                      type="text"
                      name="organizationAddress"
                      value={values.organizationAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tel. Nos.</label>
                    <input
                      type="text"
                      name="organizationTel"
                      value={values.organizationTel}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              {/* ID REFERENCE NO. */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">15. ID Reference No.</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SSS No.</label>
                    <input
                      type="text"
                      name="sssNo"
                      value={values.sssNo}
                      onChange={handleChange}
                      placeholder="00-0000000-0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GSIS No.</label>
                    <input
                      type="text"
                      name="gsisNo"
                      value={values.gsisNo}
                      onChange={handleChange}
                      placeholder="0000-0000000-0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PAG-IBIG No.</label>
                    <input
                      type="text"
                      name="pagIbigNo"
                      value={values.pagIbigNo}
                      onChange={handleChange}
                      placeholder="0000-0000-0000"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PSN No.</label>
                    <input
                      type="text"
                      name="psnNo"
                      value={values.psnNo}
                      onChange={handleChange}
                      placeholder="0000-0000-0000-0000"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PhilHealth No.</label>
                    <input
                      type="text"
                      name="philhealthNo"
                      value={values.philhealthNo}
                      onChange={handleChange}
                      placeholder="00-000000000-00"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              {/* Family Background */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">16. Family Background</h3>
                <div className="space-y-6">
                  {/* Father's Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="fatherFirstName" value={values.fatherFirstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" name="fatherMiddleName" value={values.fatherMiddleName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="fatherLastName" value={values.fatherLastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                  {/* Mother's Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="motherFirstName" value={values.motherFirstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" name="motherMiddleName" value={values.motherMiddleName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="motherLastName" value={values.motherLastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                  {/* Guardian's Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian's Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="guardianFirstName" value={values.guardianFirstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" name="guardianMiddleName" value={values.guardianMiddleName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="guardianLastName" value={values.guardianLastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Accomplished By */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">17. Accomplished By</h3>
                <div className="flex flex-wrap gap-4">
                  {['applicant', 'guardian', 'representative'].map((option, index) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="accomplishedBy"
                        value={option}
                        checked={values.accomplishedBy === option}
                        onChange={handleChange}
                        required={index === 0}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
  
                {values.accomplishedBy && values.accomplishedBy !== 'applicant' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="accomplishedFirstName"
                        value={values.accomplishedFirstName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                      <input
                        type="text"
                        name="accomplishedMiddleName"
                        value={values.accomplishedMiddleName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="accomplishedLastName"
                        value={values.accomplishedLastName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
  
              {/* Certifying Physician */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">18. Name of Certifying Physician</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="certifyingPhysicianFirstName"
                      value={values.certifyingPhysicianFirstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      name="certifyingPhysicianMiddleName"
                      value={values.certifyingPhysicianMiddleName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="certifyingPhysicianLastName"
                      value={values.certifyingPhysicianLastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License No.</label>
                    <input
                      type="text"
                      name="physicianLicenseNo"
                      value={values.physicianLicenseNo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              {/* Processing, Approving, Encoder, Reporting Unit, Control No. */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">19. Processing Officer</h3>
                    <input
                      type="text"
                      name="processingOfficer"
                      value={values.processingOfficer}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">20. Approving Officer</h3>
                    <input
                      type="text"
                      name="approvingOfficer"
                      value={values.approvingOfficer}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">21. Encoder</h3>
                    <input
                      type="text"
                      name="encoder"
                      value={values.encoder}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">22. Name of Reporting Unit (Office/Section)</h3>
                    </label>
                    <input
                      type="text"
                      name="reportingUnit"
                      value={values.reportingUnit}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">23. Control No.</h3>
                    </label>
                    <input
                      type="text"
                      name="controlNo"
                      value={values.controlNo}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
