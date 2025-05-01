import React from 'react';

export default function ContactDetailsForm({ values, handleChange, duplicateErrors = {} }) {
  const formatMobile = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 11)
      .replace(/^(\d{4})(\d{3})(\d{4})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'));

  const formatLandline = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 9)
      .replace(/^(\d{2})(\d{7})?/, (_, a, b) => [a, b].filter(Boolean).join('-'));

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
      <h3 className="text-lg font-medium text-gray-900 mb-4">10. Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Landline */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Landline No.</label>
          <input
            type="text"
            name="landline"
            value={values.landline}
            onChange={handleFormattedChange}
            placeholder="21-3456789"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
          <input
            type="text"
            name="mobile"
            value={values.mobile}
            onChange={handleFormattedChange}
            placeholder="0912-345-6789"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {duplicateErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{duplicateErrors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
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
