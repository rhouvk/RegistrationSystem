import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { FaEye, FaEdit, FaIdBadge, FaSpinner, FaDownload, FaTimes } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';
import PWDUserDetailsModal from '@/Components/PWDUserDetailsModal';

export default function PWDUser({ users, filters }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardUrl, setCardUrl] = useState('');
  const [cardLoading, setCardLoading] = useState(true);
  const [cardUser, setCardUser] = useState(null);

  const [search, setSearch] = useState(filters.search || '');
  const [entriesPerPage, setEntriesPerPage] = useState(filters.perPage || 10);

  const openModal = (user) => { setSelectedUser(user); };
  const closeModal = () => { setSelectedUser(null); };

  const openCardModal = (user) => {
    setCardUrl(buildBarcodeUrl(user));
    setCardLoading(true);
    setCardUser(user);
    setShowCardModal(true);
  };
  const closeCardModal = () => {
    setShowCardModal(false);
    setCardUrl('');
    setCardLoading(true);
    setCardUser(null);
  };

  const buildBarcodeUrl = (u) => {
    const city = u.city || 'Davao';
    const fullName = u.user?.name || `${u.firstName} ${u.lastName}`;
    const type = Array.isArray(u.disabilityTypes) ? u.disabilityTypes.join(', ') : u.disabilityTypes;
    const id = u.pwdNumber;
    const t = Date.now();
    return `/admin/PWDusers/${u.id}/generate?city=${encodeURIComponent(city)}&name=${encodeURIComponent(fullName)}&type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&t=${t}`;
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    router.get(route('pwd.pwd-users.index'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
  };

  const handlePerPageChange = (e) => {
    const val = parseInt(e.target.value);
    setEntriesPerPage(val);
    router.get(route('pwd.pwd-users.index'), { search, perPage: val }, { preserveState: true, replace: true });
  };

  const changePage = (page) => {
    router.get(route('pwd.pwd-users.index'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
  };

  const navigateToEdit = (user) => {
    router.get(route('pwd.pwd-users.edit', user.id));
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">PWD Users</h2>}>
      <Head title="PWD Users" />
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
                  <th className="hidden sm:table-cell px-6 py-3 text-xs uppercase tracking-wider text-left">Date Applied</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-xs uppercase tracking-wider text-left">Sex</th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.data.length > 0 ? users.data.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{u.pwdNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{u.user?.name || `${u.firstName} ${u.lastName}`}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">{new Date(u.dateApplied).toLocaleDateString()}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">{u.sex}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => openModal(u)} className="text-teal-700"><FaEye size={18} /></button>
                      <button onClick={() => navigateToEdit(u)} className="text-sky-700"><FaEdit size={18} /></button>
                      <button onClick={() => openCardModal(u)} className="text-slate-500"><FaIdBadge size={18} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.last_page > 1 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <button 
                onClick={() => changePage(1)} 
                disabled={users.current_page === 1}
                className={`px-3 py-1 rounded ${users.current_page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                First
              </button>
              <button 
                onClick={() => changePage(users.current_page - 1)} 
                disabled={users.current_page === 1}
                className={`px-3 py-1 rounded ${users.current_page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Prev
              </button>
              
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 bg-gray-100 rounded">
                  Page {users.current_page} of {users.last_page}
                </span>
              </div>

              <button 
                onClick={() => changePage(users.current_page + 1)} 
                disabled={users.current_page === users.last_page}
                className={`px-3 py-1 rounded ${users.current_page === users.last_page 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Next
              </button>
              <button 
                onClick={() => changePage(users.last_page)} 
                disabled={users.current_page === users.last_page}
                className={`px-3 py-1 rounded ${users.current_page === users.last_page 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-sky-700 text-white hover:bg-sky-800'}`}
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedUser && <PWDUserDetailsModal selectedUser={selectedUser} closeModal={closeModal} />}

      {/* Card Preview */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent" onClick={closeCardModal}>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated PWD Card</h3>
              <button onClick={closeCardModal} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
            </div>
            <div className="flex justify-center items-center h-96 relative">
              {cardLoading && <FaSpinner className="animate-spin text-3xl text-blue-500" />}
              <img
                src={cardUrl}
                alt="PWD Card"
                className={`${cardLoading ? 'hidden' : 'block'} max-h-96 object-contain`}
                onLoad={() => setCardLoading(false)}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <a href={cardUrl} download={`PWD_Card_${cardUser?.pwdNumber || 'card'}.png`} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <FaDownload className="mr-2" /> Download Card
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
