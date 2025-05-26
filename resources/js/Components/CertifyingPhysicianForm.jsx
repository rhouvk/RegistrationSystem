// File: resources/js/Pages/Admin/RegisterParts/CertifyingPhysicianForm.jsx

import React from 'react';

export default function CertifyingPhysicianForm({ values, handleChange }) {
  // Formatter for License No. - only digits, max 8
  const formatLicenseNo = (val) =>
    val.replace(/\D/g, '').slice(0, 8);

  const handleFormattedChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'physician_license_no' ? formatLicenseNo(value) : value;

    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Certifying Physician</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['first_name', 'middle_name', 'last_name'].map((part) => {
          const label = part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <div key={`certifying_physician_${part}`}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={`certifying_physician_${part}`}
                value={values[`certifying_physician_${part}`]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          );
        })}
        <div>
          <label className="block text-sm font-medium text-gray-700">License No.</label>
          <input
            type="text"
            name="physician_license_no"
            value={values.physician_license_no}
            onChange={handleFormattedChange}
            placeholder="12345678"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}