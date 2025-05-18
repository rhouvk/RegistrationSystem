import React from 'react';

export default function PersonalInfoForm({ values, handleChange, duplicateErrors = {} }) {
  const handlePWDNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '').slice(0, 16); // Only digits, max 16 digits
    let formatted = '';

    if (input.length > 0) formatted += input.slice(0, 2);
    if (input.length > 2) formatted += '-' + input.slice(2, 6);
    if (input.length > 6) formatted += '-' + input.slice(6, 9);
    if (input.length > 9) formatted += '-' + input.slice(9, 16);

    handleChange({
      target: {
        name: 'pwdNumber',
        value: formatted,
      },
    });
  };

  return (
    <div>
      {/* 1. PWD Number */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        1. PWD Number <span className="text-sm font-normal text-gray-600">(Format: RR-PPMM-BBB-NNNNNNN)</span>
      </h3>
      <input
        type="text"
        name="pwdNumber"
        placeholder="01-0001-001-0000001"
        value={values.pwdNumber}
        onChange={handlePWDNumberChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
      {duplicateErrors.pwdNumber && (
        <p className="mt-1 text-sm text-red-600">{duplicateErrors.pwdNumber}</p>
      )}

      {/* 2. Date Applied */}
      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">2. Date Applied</h3>
      <input
        type="date"
        name="dateApplied"
        value={values.dateApplied}
        onChange={handleChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-8"
      />

      {/* 3. Personal Information */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">3. Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['firstName', 'middleName', 'lastName', 'suffix'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              name={field}
              value={values[field]}
              onChange={handleChange}
              required={field !== 'middleName' && field !== 'suffix'}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      {/* 4. Date of Birth and 5. Sex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">4. Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={values.dob}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">5. Sex</label>
          <div className="flex space-x-4 mt-2">
            {['Female', 'Male'].map((gender) => (
              <label key={gender} className="inline-flex items-center">
                <input
                  type="radio"
                  name="sex"
                  value={gender}
                  checked={values.sex === gender}
                  onChange={handleChange}
                  required
                  className="form-radio"
                />
                <span className="ml-2">{gender}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Civil Status */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700">6. Civil Status</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {['Single', 'Married', 'Widowed', 'Separated', 'Cohabitation'].map((status) => (
            <label key={status} className="inline-flex items-center">
              <input
                type="radio"
                name="civilStatus"
                value={status}
                checked={values.civilStatus === status}
                onChange={handleChange}
                required
                className="form-radio"
              />
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
