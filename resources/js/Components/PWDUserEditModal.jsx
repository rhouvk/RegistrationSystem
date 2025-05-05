// File: resources/js/Components/PWDUserEditModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function PWDUserEditModal({ selectedUser, editData, handleEditChange, handleUpdate, closeModal }) {
  if (!selectedUser) return null;

  const groups = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'PWD Number', name: 'pwdNumber', type: 'text', readOnly: true },
        { label: 'Date Applied', name: 'dateApplied', type: 'date' },
        { label: 'Date of Birth', name: 'dob', type: 'date' },
        { label: 'Sex', name: 'sex', type: 'select', options: ['male', 'female'] },
        { label: 'Civil Status', name: 'civilStatus', type: 'select', options: ['single', 'married', 'widowed', 'divorced'] },
      ],
    },
    {
      title: 'Disability Details',
      fields: [
        { label: 'Disability Types', name: 'disabilityTypes', type: 'textarea' },
        { label: 'Disability Causes', name: 'disabilityCauses', type: 'textarea' },
      ],
    },
    {
      title: 'Contact & Address',
      fields: [
        { label: 'House', name: 'house', type: 'text' },
        { label: 'Barangay', name: 'barangay', type: 'text' },
        { label: 'Municipality', name: 'municipality', type: 'text' },
        { label: 'Province', name: 'province', type: 'text' },
        { label: 'Region', name: 'region', type: 'text' },
        { label: 'Landline', name: 'landline', type: 'text' },
      ],
    },
    {
      title: 'Education & Employment',
      fields: [
        { label: 'Education', name: 'education', type: 'text' },
        { label: 'Employment Status', name: 'employmentStatus', type: 'text' },
        { label: 'Employment Category', name: 'employmentCategory', type: 'text' },
        { label: 'Employment Type', name: 'employmentType', type: 'text' },
        { label: 'Occupation', name: 'occupation', type: 'text' },
        { label: 'Other Occupation', name: 'occupationOther', type: 'text' },
      ],
    },
    {
      title: 'Organization Details',
      fields: [
        { label: 'Organization Affiliated', name: 'organizationAffiliated', type: 'text' },
        { label: 'Organization Contact', name: 'organizationContact', type: 'text' },
        { label: 'Organization Address', name: 'organizationAddress', type: 'text' },
        { label: 'Organization Tel', name: 'organizationTel', type: 'text' },
      ],
    },
    {
      title: 'Government IDs',
      fields: [
        { label: 'SSS No.', name: 'sssNo', type: 'text' },
        { label: 'GSIS No.', name: 'gsisNo', type: 'text' },
        { label: 'Pag-IBIG No.', name: 'pagIbigNo', type: 'text' },
        { label: 'PSN No.', name: 'psnNo', type: 'text' },
        { label: 'PhilHealth No.', name: 'philhealthNo', type: 'text' },
      ],
    },
    {
      title: 'Family Information',
      fields: [
        { label: 'Father Name', name: 'fatherName', type: 'text' },
        { label: 'Mother Name', name: 'motherName', type: 'text' },
        { label: 'Guardian Name', name: 'guardianName', type: 'text' },
      ],
    },
    {
      title: 'Administrative',
      fields: [
        { label: 'Accomplished By', name: 'accomplishedBy', type: 'text', readOnly: true },
        { label: 'Certifying Physician', name: 'certifyingPhysician', type: 'text' },
        { label: 'Encoder', name: 'encoder', type: 'text', readOnly: true },
        { label: 'Processing Officer', name: 'processingOfficer', type: 'text' },
        { label: 'Approving Officer', name: 'approvingOfficer', type: 'text' },
        { label: 'Reporting Unit', name: 'reportingUnit', type: 'text' },
        { label: 'Control No.', name: 'controlNo', type: 'text', readOnly: true },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent" onClick={closeModal}>
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Edit PWD User</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
        </div>
        <form onSubmit={handleUpdate} className="px-6 py-4 space-y-8">
          {groups.map(group => (
            <div key={group.title}>
              <h4 className="text-md font-semibold text-gray-700 mb-4">{group.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={editData[field.name] || ''}
                        onChange={handleEditChange}
                        className="w-full border rounded px-3 py-2"
                        disabled={field.readOnly}
                      >
                        <option value="">Select</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={editData[field.name] || ''}
                        onChange={handleEditChange}
                        rows={2}
                        className="w-full border rounded px-3 py-2"
                        disabled={field.readOnly}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={editData[field.name] || ''}
                        onChange={handleEditChange}
                        readOnly={field.readOnly}
                        className={`w-full border rounded px-3 py-2 ${field.readOnly ? 'bg-gray-100' : ''}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
