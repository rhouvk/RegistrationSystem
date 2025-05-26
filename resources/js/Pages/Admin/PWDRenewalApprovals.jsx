import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { FaEye } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PWDRenewalApprovals({ renewals, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [entriesPerPage, setEntriesPerPage] = useState(filters?.perPage || 10);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    router.get(route('admin.pwd.renewals.index'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
  };

  const handlePerPageChange = (e) => {
    const val = parseInt(e.target.value);
    setEntriesPerPage(val);
    router.get(route('admin.pwd.renewals.index'), { search, perPage: val }, { preserveState: true, replace: true });
  };

  const changePage = (page) => {
    router.get(route('admin.pwd.renewals.index'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">PWD Renewal Requests</h2>}>
      <Head title="PWD Renewal Requests" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Search & per-page */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-1/2 mb-4 sm:mb-0 px-4 py-2 border rounded"
            />
            <select
              value={entriesPerPage}
              onChange={handlePerPageChange}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white overflow-auto shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">PWD Number</th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Name</th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Date Applied</th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Status</th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renewals.data.length > 0 ? renewals.data.map(renewal => (
                  <tr key={renewal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{renewal.pwdNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {`${renewal.first_name} ${renewal.middle_name || ''} ${renewal.last_name}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(renewal.dateApplied)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => router.get(route('admin.pwd.renewals.show', renewal.id))}
                      className="text-teal-700 flex items-center space-x-1"
                    >
                      <span>View Form</span>
                      <FaEye size={18} />
                    </button>
                  </div>
                </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-500">No renewal requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renewals.last_page > 1 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <button 
                onClick={() => changePage(1)} 
                disabled={renewals.current_page === 1}
                className={`px-3 py-1 rounded ${renewals.current_page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                First
              </button>
              <button 
                onClick={() => changePage(renewals.current_page - 1)} 
                disabled={renewals.current_page === 1}
                className={`px-3 py-1 rounded ${renewals.current_page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Prev
              </button>
              
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 bg-gray-100 rounded">
                  Page {renewals.current_page} of {renewals.last_page}
                </span>
              </div>

              <button 
                onClick={() => changePage(renewals.current_page + 1)} 
                disabled={renewals.current_page === renewals.last_page}
                className={`px-3 py-1 rounded ${renewals.current_page === renewals.last_page 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Next
              </button>
              <button 
                onClick={() => changePage(renewals.last_page)} 
                disabled={renewals.current_page === renewals.last_page}
                className={`px-3 py-1 rounded ${renewals.current_page === renewals.last_page 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 