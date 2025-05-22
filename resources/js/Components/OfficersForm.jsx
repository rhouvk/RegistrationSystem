import React from 'react';

export default function OfficersForm({ values, handleChange }) {
  const renderOfficerFields = (prefix, title) => (
    <div>
      <h4 className="text-md font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['first_name', 'middle_name', 'last_name'].map((part) => (
          <div key={`${prefix}_${part}`}>
            <label className="block text-sm font-medium text-gray-700">
              {part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {part !== 'middle_name' && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="text"
              name={`${prefix}_${part}`}
              value={values[`${prefix}_${part}`]}
              onChange={handleChange}
              required={part !== 'middle_name'}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Officers Information</h3>
      <div className="space-y-6">
        {renderOfficerFields('processing_officer', 'Processing Officer')}
        {renderOfficerFields('approving_officer', 'Approving Officer')}
        {renderOfficerFields('encoder', 'Encoder')}
      </div>
    </div>
  );
}
