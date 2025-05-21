// resources/js/Pages/Admin/RegisterParts/AccomplishedByForm.jsx

import React, { useEffect } from 'react';

export default function AccomplishedByForm({ values, handleChange }) {
  // Effect to handle automatic name population when accomplishedBy changes
  useEffect(() => {
    if (values.accomplishedBy === 'applicant') {
      // Create a synthetic event object for each name field
      const nameFields = ['first_name', 'middle_name', 'last_name'];
      nameFields.forEach(field => {
        const event = {
          target: {
            name: `accomplished_by_${field}`,
            value: values[field] || ''
          }
        };
        handleChange(event);
      });
    }
  }, [values.accomplishedBy, values.first_name, values.middle_name, values.last_name]);

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
          {['first_name', 'middle_name', 'last_name'].map((part) => (
            <div key={`accomplished_by_${part}`}>
              <label className="block text-sm font-medium text-gray-700">{part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
              <input
                type="text"
                name={`accomplished_by_${part}`}
                value={values[`accomplished_by_${part}`]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {values.accomplishedBy === 'applicant' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Using applicant's name: {values.first_name} {values.middle_name} {values.last_name}
          </p>
        </div>
      )}
    </div>
  );
}
