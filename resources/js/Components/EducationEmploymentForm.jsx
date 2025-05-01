// resources/js/Pages/Admin/RegisterParts/EducationEmploymentForm.jsx

import React from 'react';

export default function EducationEmploymentForm({ values, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">11. Educational Attainment</h3>
      <div className="flex flex-wrap gap-4">
        {[
          'none', 'kindergarten', 'elementary', 'junior high school',
          'senior high school', 'college', 'vocational', 'post graduate',
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
            <span className="ml-2 capitalize">{level}</span>
          </label>
        ))}
      </div>

      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">12. Status of Employment</h3>
      <div className="flex flex-wrap gap-4">
        {['employed', 'unemployed', 'self-employed'].map((status) => (
          <label key={status} className="inline-flex items-center">
            <input
              type="radio"
              name="employmentStatus"
              value={status}
              checked={values.employmentStatus === status}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 capitalize">{status}</span>
          </label>
        ))}
      </div>

      {values.employmentStatus === 'employed' && (
        <>
          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">12a. Category of Employment</h3>
          <div className="flex flex-wrap gap-4">
            {['private', 'public'].map((category) => (
              <label key={category} className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentCategory"
                  value={category}
                  checked={values.employmentCategory === category}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 capitalize">{category}</span>
              </label>
            ))}
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">12b. Types of Employment</h3>
          <div className="flex flex-wrap gap-4">
            {['permanent/regular', 'seasonal', 'casual', 'emergency'].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  name="employmentType"
                  value={type}
                  checked={values.employmentType === type}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {['employed', 'self-employed'].includes(values.employmentStatus) && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">13. Occupation</h3>
          <div className="flex flex-wrap gap-4">
            {[
              'managers', 'professionals', 'technicians and associate professionals',
              'clerical support workers', 'service and sales workers', 'skilled agricultural, forestry and fishery workers',
              'craft and related trade workers', 'plant and machine operators and assemblers',
              'elementary occupations', 'armed forces occupations', 'others',
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
                <span className="ml-2 capitalize">{occ}</span>
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
