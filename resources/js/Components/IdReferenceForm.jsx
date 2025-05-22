// File: resources/js/Pages/Admin/RegisterParts/IdReferenceForm.jsx

import React from 'react';

export default function IdReferenceForm({ values, handleChange }) {
  // --- Formatters ---
  const formatSSS = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 10)
      .replace(/^(\d{2})(\d{7})(\d{1})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'));

  const formatGSIS = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 12)
      .replace(/^(\d{4})(\d{7})(\d{1})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'));

  const formatPagIbig = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 12)
      .replace(/^(\d{4})(\d{4})(\d{4})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'));

  const formatPhilHealth = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 13)
      .replace(/^(\d{2})(\d{9})(\d{1})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'));

  const formatPSN = (val) =>
    val.replace(/\D/g, '')
      .slice(0, 16)
      .replace(/^(\d{4})(\d{4})(\d{4})(\d{4})?/, (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join('-'));

  // --- Formatter Dispatcher ---
  const formatField = (name, value) => {
    switch (name) {
      case 'sssNo':
        return formatSSS(value);
      case 'gsisNo':
        return formatGSIS(value);
      case 'pagIbigNo':
        return formatPagIbig(value);
      case 'philhealthNo':
        return formatPhilHealth(value);
      case 'psnNo':
        return formatPSN(value);
      default:
        return value;
    }
  };

  const handleFormattedChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatField(name, value);

    handleChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">ID Reference Numbers</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {['sssNo', 'gsisNo', 'pagIbigNo', 'psnNo', 'philhealthNo'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field.toUpperCase().replace('NO', ' No.')}
            </label>
            <input
              type="text"
              name={field}
              value={values[field]}
              onChange={handleFormattedChange}
              placeholder={getPlaceholder(field)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Small helper for better UX placeholders
function getPlaceholder(field) {
  switch (field) {
    case 'sssNo':
      return '00-0000000-0';
    case 'gsisNo':
      return '0000-0000000-0';
    case 'pagIbigNo':
      return '0000-0000-0000';
    case 'philhealthNo':
      return '00-000000000-0';
    case 'psnNo':
      return '0000-0000-0000-0000';
    default:
      return '';
  }
}
