// resources/js/Pages/Admin/RegisterParts/OfficersForm.jsx

import React from 'react';

export default function OfficersForm({ values, handleChange }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">19-23. Officers and Reporting Unit</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['processingOfficer', 'approvingOfficer', 'encoder', 'reportingUnit', 'controlNo'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={field}
              value={values[field]}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
