export default function ResidenceAddressForm({ values, handleChange, regions, provinces, municipalities, barangays }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Residence Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Region <span className="text-red-500">*</span></label>
          <select
            name="region_id"
            value={values.region_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Region</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Province <span className="text-red-500">*</span></label>
          <select
            name="province_id"
            value={values.province_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Province</option>
            {provinces.map(province => (
              <option key={province.id} value={province.id}>{province.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Municipality <span className="text-red-500">*</span></label>
          <select
            name="municipality_id"
            value={values.municipality_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Municipality</option>
            {municipalities.map(municipality => (
              <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Barangay <span className="text-red-500">*</span></label>
          <select
            name="barangay_id"
            value={values.barangay_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
          >
            <option value="">Select Barangay</option>
            {barangays.map(barangay => (
              <option key={barangay.id} value={barangay.id}>{barangay.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">House No. and Street <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="house"
          value={values.house}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
