// File: resources/js/Components/PWDUserDetailsModal.jsx
import React from 'react';

export default function PWDUserDetailsModal({ selectedUser, closeModal }) {
  if (!selectedUser) return null;

  // Grouped fields
  const groups = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'PWD Number', value: selectedUser.pwdNumber },
        { label: 'Name', value: selectedUser.user?.name || `${selectedUser.firstName} ${selectedUser.lastName} ${selectedUser.suffix || ''}` },
        { label: 'Date Applied', value: selectedUser.dateApplied && new Date(selectedUser.dateApplied).toLocaleDateString() },
        { label: 'Date of Birth', value: selectedUser.dob && new Date(selectedUser.dob).toLocaleDateString() },
        { label: 'Sex', value: selectedUser.sex },
        { label: 'Civil Status', value: selectedUser.civilStatus },
      ],
    },
    {
      title: 'Disability Details',
      fields: [
        { label: 'Disability Type', value: selectedUser.disability_type?.name },
        { label: 'Disability Cause', value: selectedUser.disability_cause?.name },
      ],
    },
    {
      title: 'Contact & Address',
      fields: [
        { label: 'House', value: selectedUser.house },
        { label: 'Barangay', value: selectedUser.barangay?.name },
        { label: 'Municipality', value: selectedUser.municipality?.name },
        { label: 'Province', value: selectedUser.province?.name },
        { label: 'Region', value: selectedUser.region?.name },
        { label: 'Landline', value: selectedUser.landline },
      ],
    },
    
    {
      title: 'Education & Employment',
      fields: [
        { label: 'Education', value: selectedUser.education },
        { label: 'Employment Status', value: selectedUser.employmentStatus },
        { label: 'Employment Category', value: selectedUser.employmentCategory },
        { label: 'Employment Type', value: selectedUser.employmentType },
        { label: 'Occupation', value: selectedUser.occupation },
        { label: 'Other Occupation', value: selectedUser.occupationOther },
      ],
    },
    {
      title: 'Organization Details',
      fields: [
        { label: 'Organization Affiliated', value: selectedUser.organizationAffiliated },
        { label: 'Organization Contact', value: selectedUser.organizationContact },
        { label: 'Organization Address', value: selectedUser.organizationAddress },
        { label: 'Organization Tel', value: selectedUser.organizationTel },
      ],
    },
    {
      title: 'Government IDs',
      fields: [
        { label: 'SSS No.', value: selectedUser.sssNo },
        { label: 'GSIS No.', value: selectedUser.gsisNo },
        { label: 'Pag-IBIG No.', value: selectedUser.pagIbigNo },
        { label: 'PSN No.', value: selectedUser.psnNo },
        { label: 'PhilHealth No.', value: selectedUser.philhealthNo },
      ],
    },
    {
      title: 'Family Information',
      fields: [
        { label: 'Father Name', value: selectedUser.fatherName },
        { label: 'Mother Name', value: selectedUser.motherName },
        { label: 'Guardian Name', value: selectedUser.guardianName },
      ],
    },
    {
      title: 'Administrative',
      fields: [
        { label: 'Accomplished By', value: selectedUser.accomplishedBy },
        { label: 'Certifying Physician', value: selectedUser.certifyingPhysician },
        { label: 'Encoder', value: selectedUser.encoder },
        { label: 'Processing Officer', value: selectedUser.processingOfficer },
        { label: 'Approving Officer', value: selectedUser.approvingOfficer },
        { label: 'Reporting Unit', value: selectedUser.reportingUnit },
        { label: 'Control No.', value: selectedUser.controlNo },
        { label: 'Created At', value: selectedUser.created_at && new Date(selectedUser.created_at).toLocaleString() },
        { label: 'Updated At', value: selectedUser.updated_at && new Date(selectedUser.updated_at).toLocaleString() },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent" onClick={closeModal}>
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">PWD User Details</h3>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)] space-y-6">
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
        <div className="px-6 py-4 border-t flex justify-end">
          <button onClick={closeModal} className="bg-blue-500 text-white rounded px-4 py-2">Close</button>
        </div>
      </div>
    </div>
  );
}
