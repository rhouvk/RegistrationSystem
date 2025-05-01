// resources/js/Pages/Admin/RegisterParts/AccomplishedByForm.jsx

import React from 'react';

export default function AccomplishedByForm({ values, handleChange }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">17. Accomplished By</h3>
      <div className="flex flex-wrap gap-4">
        {['applicant', 'guardian', 'representative'].map((option) => (
          <label key={option} className="inline-flex items-center">
            <input
              type="radio"
              name="accomplishedBy"
              value={option}
              checked={values.accomplishedBy === option}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 capitalize">{option}</span>
          </label>
        ))}
      </div>

      {values.accomplishedBy && values.accomplishedBy !== 'applicant' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {['FirstName', 'MiddleName', 'LastName'].map((part) => (
            <div key={`accomplished${part}`}>
              <label className="block text-sm font-medium text-gray-700">{part.replace('Name', ' Name')}</label>
              <input
                type="text"
                name={`accomplished${part}`}
                value={values[`accomplished${part}`]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
