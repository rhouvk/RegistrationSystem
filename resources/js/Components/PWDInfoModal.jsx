import React from 'react';

export default function PWDInfoModal({ isOpen, registration, onClose }) {
  if (!isOpen || !registration) return null;

  const groups = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'PWD Number', value: registration.pwdNumber },
        { label: 'Name', value: registration.user?.name },
        { label: 'Date Applied', value: registration.dateApplied && new Date(registration.dateApplied).toLocaleDateString() },
        { label: 'Date of Birth', value: registration.dob && new Date(registration.dob).toLocaleDateString() },
        { label: 'Sex', value: registration.sex },
        { label: 'Civil Status', value: registration.civilStatus },
      ],
    },
    {
      title: 'Disability Details',
      fields: [
        { label: 'Disability Type', value: registration.disability_type?.name || registration.disabilityTypes?.join(', ') },
        { label: 'Disability Cause', value: registration.disability_cause?.name || registration.disabilityCauses?.join(', ') },
      ],
    },
    {
      title: 'Contact & Address',
      fields: [
        { label: 'House', value: registration.house },
        { label: 'Barangay', value: registration.barangay?.name },
        { label: 'Municipality', value: registration.municipality?.name },
        { label: 'Province', value: registration.province?.name },
        { label: 'Region', value: registration.region?.name },
        { label: 'Landline', value: registration.landline },
      ],
    },
    {
      title: 'Education & Employment',
      fields: [
        { label: 'Education', value: registration.education },
        { label: 'Employment Status', value: registration.employmentStatus },
        { label: 'Employment Category', value: registration.employmentCategory },
        { label: 'Employment Type', value: registration.employmentType },
        { label: 'Occupation', value: registration.occupation },
        { label: 'Other Occupation', value: registration.occupationOther },
      ],
    },
    {
      title: 'Organization Details',
      fields: [
        { label: 'Organization Affiliated', value: registration.organizationAffiliated },
        { label: 'Organization Contact', value: registration.organizationContact },
        { label: 'Organization Address', value: registration.organizationAddress },
        { label: 'Organization Tel', value: registration.organizationTel },
      ],
    },
    {
      title: 'Government IDs',
      fields: [
        { label: 'SSS No.', value: registration.sssNo },
        { label: 'GSIS No.', value: registration.gsisNo },
        { label: 'Pag-IBIG No.', value: registration.pagIbigNo },
        { label: 'PSN No.', value: registration.psnNo },
        { label: 'PhilHealth No.', value: registration.philhealthNo },
      ],
    },
    {
      title: 'Family Information',
      fields: [
        { label: 'Father Name', value: registration.fatherName },
        { label: 'Mother Name', value: registration.motherName },
        { label: 'Guardian Name', value: registration.guardianName },
      ],
    },
    {
      title: 'Administrative Info',
      fields: [
        { label: 'Accomplished By', value: registration.accomplishedBy },
        { label: 'Certifying Physician', value: registration.certifyingPhysician },
        { label: 'Encoder', value: registration.encoder },
        { label: 'Processing Officer', value: registration.processingOfficer },
        { label: 'Approving Officer', value: registration.approvingOfficer },
        { label: 'Reporting Unit', value: registration.reportingUnit },
        { label: 'Control No.', value: registration.controlNo },
        { label: 'Created At', value: registration.created_at && new Date(registration.created_at).toLocaleString() },
        { label: 'Updated At', value: registration.updated_at && new Date(registration.updated_at).toLocaleString() },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent" onClick={onClose}>
      <div
       className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">More Information</h3>
        </div>
  
        {/* Scrollable content */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
          {groups.map(group => (
            <div key={group.title}>
              <h4 className="text-md font-semibold text-gray-700 mb-2">{group.title}</h4>
              <table className="w-full table-auto">
                <tbody>
                  {group.fields.map(({ label, value }) =>
                    value ? (
                      <tr key={label} className="border-b">
                        <td className="py-1 font-medium text-gray-700 w-1/3">{label}:</td>
                        <td className="py-1 text-gray-600">{value}</td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
  
        {/* Fixed footer with Close button */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
}
