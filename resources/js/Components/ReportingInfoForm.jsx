import React from 'react';

export default function ReportingInfoForm({ values, handleChange }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Reporting Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Reporting Unit (Office/Section) <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="reportingUnit"
            value={values.reportingUnit}
            onChange={handleChange}
            required
            placeholder="e.g. PDAO"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Control No. <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="controlNo"
            value={values.controlNo}
            onChange={e => handleChange({ target: { name: 'controlNo', value: e.target.value.replace(/\D/g, '').slice(0, 6) }})}  // Limit to 6 digits and remove non-numeric characters
            required
            maxLength="6"  // Limit to 6 characters
            placeholder="000000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

      </div>
    </div>
  );
}