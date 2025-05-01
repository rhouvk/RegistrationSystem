// File: resources/js/Pages/Admin/RegisterParts/CertifyingPhysicianForm.jsx

import React from 'react';

export default function CertifyingPhysicianForm({ values, handleChange }) {
  // Formatter for License No. - only digits, max 8
  const formatLicenseNo = (val) =>
    val.replace(/\D/g, '').slice(0, 8);

  const handleFormattedChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'physicianLicenseNo' ? formatLicenseNo(value) : value;

    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">18. Certifying Physician</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['FirstName', 'MiddleName', 'LastName'].map((part) => (
          <div key={`certifyingPhysician${part}`}>
            <label className="block text-sm font-medium text-gray-700">{part.replace('Name', ' Name')}</label>
            <input
              type="text"
              name={`certifyingPhysician${part}`}
              value={values[`certifyingPhysician${part}`]}
              onChange={handleFormattedChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">License No.</label>
          <input
            type="text"
            name="physicianLicenseNo"
            value={values.physicianLicenseNo}
            onChange={handleFormattedChange}
            placeholder="00000000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
