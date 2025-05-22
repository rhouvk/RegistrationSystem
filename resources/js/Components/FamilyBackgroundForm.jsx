// resources/js/Pages/Admin/RegisterParts/FamilyBackgroundForm.jsx

import React from 'react';

export default function FamilyBackgroundForm({ values, handleChange }) {
  const renderNameFields = (prefix) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['first_name', 'middle_name', 'last_name'].map((part) => (
        <div key={`${prefix}_${part}`}>
          <label className="block text-sm font-medium text-gray-700">{part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
          <input
            type="text"
            name={`${prefix}_${part}`}
            value={values[`${prefix}_${part}`]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Family Background</h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Father's Name</h4>
          {renderNameFields('father')}
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Mother's Name</h4>
          {renderNameFields('mother')}
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Guardian's Name</h4>
          {renderNameFields('guardian')}
        </div>
      </div>
    </div>
  );
}
