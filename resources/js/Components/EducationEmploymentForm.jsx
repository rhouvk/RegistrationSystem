// resources/js/Pages/Admin/RegisterParts/EducationEmploymentForm.jsx

import React from 'react';

export default function EducationEmploymentForm({ values, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Attainment</h3>
      <div className="flex flex-wrap gap-4">
        {[
          'None', 'Elementary', 'High School', 'Vocational',
          'College', 'Post Graduate'
        ].map((level) => (
          <label key={level} className="inline-flex items-center">
            <input
              type="radio"
              name="education"
              value={level}
              checked={values.education === level}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">{level}</span>
          </label>
        ))}
      </div>

      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Status of Employment</h3>
      <div className="flex flex-wrap gap-4">
        {['Employed', 'Unemployed', 'Self-employed'].map((status) => (
          <label key={status} className="inline-flex items-center">
            <input
              type="radio"
              name="employmentStatus"
              value={status}
              checked={values.employmentStatus === status}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">{status}</span>
          </label>
        ))}
      </div>

      {values.employmentStatus === 'Employed' && (
        <>
          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Category of Employment</h3>
          <div className="flex flex-wrap gap-4">
            {['Public', 'Private'].map((category) => (
              <label key={category} className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentCategory"
                  value={category}
                  checked={values.employmentCategory === category}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Types of Employment</h3>
          <div className="flex flex-wrap gap-4">
            {['Permanent', 'Temporary', 'Contractual'].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentType"
                  value={type}
                  checked={values.employmentType === type}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {['Employed', 'Self-employed'].includes(values.employmentStatus) && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Occupation</h3>
          <div className="flex flex-wrap gap-4">
            {[
              'Managers', 'Professionals', 'Technicians and Associate Professionals',
              'Clerical Support Workers', 'Service and Sales Workers', 'Skilled Agricultural, Forestry and Fishery Workers',
              'Craft and Related Trade Workers', 'Plant and Machine Operators and Assemblers',
              'Elementary Occupations', 'Armed Forces Occupations', 'Others'
            ].map((occ) => (
              <label key={occ} className="inline-flex items-center">
                <input
                  type="radio"
                  name="occupation"
                  value={occ}
                  checked={values.occupation === occ}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">{occ}</span>
              </label>
            ))}
          </div>

          {values.occupation === 'others' && (
            <input
              type="text"
              name="occupationOther"
              value={values.occupationOther}
              onChange={handleChange}
              placeholder="Specify Occupation"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          )}
        </div>
      )}
    </div>
  );
}
