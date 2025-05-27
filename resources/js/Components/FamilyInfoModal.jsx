import React from 'react';

export default function FamilyInfoModal({ show, onClose, pwdUser }) {
  if (!show) {
    return null;
  }

  const fatherName = [pwdUser.father_first_name, pwdUser.father_middle_name, pwdUser.father_last_name].filter(Boolean).join(' ');
  const motherName = [pwdUser.mother_first_name, pwdUser.mother_middle_name, pwdUser.mother_last_name].filter(Boolean).join(' ');
  const guardianName = [pwdUser.guardian_first_name, pwdUser.guardian_middle_name, pwdUser.guardian_last_name].filter(Boolean).join(' ');

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">Additional PWD Information</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">PWD ID:</p>
            <p className="font-medium text-gray-800">{pwdUser.pwdNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Name:</p>
            <p className="font-medium text-gray-800">{pwdUser.user?.name || pwdUser.user_name || 'Unnamed PWD'}</p>
          </div>
          {fatherName && (
            <div>
              <p className="text-gray-500">Father's Name:</p>
              <p className="font-medium text-gray-800">{fatherName}</p>
            </div>
          )}
          {motherName && (
            <div>
              <p className="text-gray-500">Mother's Name:</p>
              <p className="font-medium text-gray-800">{motherName}</p>
            </div>
          )}
          {guardianName && (
            <div>
              <p className="text-gray-500">Guardian's Name:</p>
              <p className="font-medium text-gray-800">{guardianName}</p>
            </div>
          )}
          {!fatherName && !motherName && !guardianName && (
             <p className="text-gray-600 italic">No family information available.</p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 