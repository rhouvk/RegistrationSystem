import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PwdRenewalApprovalDetail({ renewal }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const approve = () => {
    if (confirm('Are you sure you want to approve this renewal request?')) {
      router.post(route('admin.pwd.renewals.approve', renewal.id));
    }
  };

  const reject = () => {
    if (confirm('Are you sure you want to reject this renewal request?')) {
      router.post(route('admin.pwd.renewals.reject', renewal.id));
    }
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">PWD Renewal Request Details</h2>}>
      <Head title="PWD Renewal Request Details" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">PWD Number</p>
                    <p className="font-medium">{renewal.pwdNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date Applied</p>
                    <p className="font-medium">{formatDate(renewal.dateApplied)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">
                      {`${renewal.first_name} ${renewal.middle_name || ''} ${renewal.last_name} ${renewal.suffix || ''}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(renewal.dob)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sex</p>
                    <p className="font-medium">{renewal.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Civil Status</p>
                    <p className="font-medium">{renewal.civilStatus}</p>
                  </div>
                </div>
              </div>

              {/* Disability Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Disability Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Disability Type</p>
                    <p className="font-medium">{renewal.disability_type?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Disability Cause</p>
                    <p className="font-medium">{renewal.disability_cause?.name}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Region</p>
                    <p className="font-medium">{renewal.region?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Province</p>
                    <p className="font-medium">{renewal.province?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Municipality</p>
                    <p className="font-medium">{renewal.municipality?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Barangay</p>
                    <p className="font-medium">{renewal.barangay?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">House/Street</p>
                    <p className="font-medium">{renewal.house}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="font-medium">{renewal.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employment Status</p>
                    <p className="font-medium">{renewal.employmentStatus}</p>
                  </div>
                  {renewal.employmentCategory && (
                    <div>
                      <p className="text-sm text-gray-600">Employment Category</p>
                      <p className="font-medium">{renewal.employmentCategory}</p>
                    </div>
                  )}
                  {renewal.employmentType && (
                    <div>
                      <p className="text-sm text-gray-600">Employment Type</p>
                      <p className="font-medium">{renewal.employmentType}</p>
                    </div>
                  )}
                  {renewal.occupation && (
                    <div>
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-medium">{renewal.occupation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Government IDs */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Government IDs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renewal.sssNo && (
                    <div>
                      <p className="text-sm text-gray-600">SSS Number</p>
                      <p className="font-medium">{renewal.sssNo}</p>
                    </div>
                  )}
                  {renewal.gsisNo && (
                    <div>
                      <p className="text-sm text-gray-600">GSIS Number</p>
                      <p className="font-medium">{renewal.gsisNo}</p>
                    </div>
                  )}
                  {renewal.pagIbigNo && (
                    <div>
                      <p className="text-sm text-gray-600">Pag-IBIG Number</p>
                      <p className="font-medium">{renewal.pagIbigNo}</p>
                    </div>
                  )}
                  {renewal.philhealthNo && (
                    <div>
                      <p className="text-sm text-gray-600">PhilHealth Number</p>
                      <p className="font-medium">{renewal.philhealthNo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Photo</p>
                    <img src={renewal.photo} alt="PWD Photo" className="w-32 h-32 object-cover rounded" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Signature</p>
                    <img src={renewal.signature} alt="PWD Signature" className="w-32 h-32 object-contain" />
                  </div>
                </div>
              </div>

              {/* Approval Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={reject}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
                <button
                  onClick={approve}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 