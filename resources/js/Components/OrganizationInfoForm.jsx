// File: resources/js/Pages/Admin/RegisterParts/OrganizationInfoForm.jsx

import React from 'react';

export default function OrganizationInfoForm({ values, handleChange }) {
  // Formatter for Telephone/Landline (digits only, max 7 digits)
  const formatTel = (val) => 
    val.replace(/\D/g, '')
    .slice(0, 9)          // Max 7 digits (e.g., 221-5678)
  .replace(/^(\d{2})(\d{7})?/, (_, a, b) => [a, b].filter(Boolean).join('-'));

  const handleFormattedChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'organizationTel' ? formatTel(value) : value;

    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  // Manual nicer label mapping
  const labelMap = {
    organizationAffiliated: 'Organization Affiliated',
    organizationContact: 'Contact Person',
    organizationAddress: 'Office Address',
    organizationTel: 'Telephone/Landline',
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['organizationAffiliated', 'organizationContact', 'organizationAddress', 'organizationTel'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {labelMap[field] || field}
            </label>
            <input
              type="text"
              name={field}
              value={values[field]}
              onChange={handleFormattedChange}
              placeholder={field === 'organizationTel' ? '21-3456789' : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
