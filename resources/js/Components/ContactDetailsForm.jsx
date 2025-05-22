import React from 'react';

export default function ContactDetailsForm({ values, handleChange, duplicateErrors = {} }) {
  // Keep only digits and limit length
  const formatMobile = (val) => val.replace(/\D/g, '').slice(0, 11);
  const formatLandline = (val) => val.replace(/\D/g, '').slice(0, 9);

  const handleFormattedChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'mobile') {
      formattedValue = formatMobile(value);
    } else if (name === 'landline') {
      formattedValue = formatLandline(value);
    }

    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Landline */}
        <div>
          <label htmlFor="landline" className="block text-sm font-medium text-gray-700">
            Landline No.
          </label>
          <input
            id="landline"
            type="text"
            name="landline"
            value={values.landline}
            onChange={handleFormattedChange}
            placeholder="213456789"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
            Mobile No.
          </label>
          <input
            id="mobile"
            type="text"
            name="mobile"
            value={values.mobile}
            onChange={handleFormattedChange}
            placeholder="09123456789"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {duplicateErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{duplicateErrors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {duplicateErrors.email && (
            <p className="mt-1 text-sm text-red-600">{duplicateErrors.email}</p>
          )}
        </div>

      </div>
    </div>
  );
}
