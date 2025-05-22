export default function DisabilityInfoForm({ values, handleChange, disabilityTypes, disabilityCauses }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Type of Disability <span className="text-red-500">*</span></h3>
          <select
            name="disability_type_id"
            value={values.disability_type_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Disability Type</option>
            {disabilityTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cause of Disability <span className="text-red-500">*</span></h3>
          <select
            name="disability_cause_id"
            value={values.disability_cause_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Disability Cause</option>
            {disabilityCauses.map(cause => (
              <option key={cause.id} value={cause.id}>{cause.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
