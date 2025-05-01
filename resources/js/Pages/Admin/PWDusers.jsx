// File: resources/js/Pages/Admin/PWDUser.jsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { FaEye, FaEdit, FaIdBadge, FaSpinner, FaDownload, FaTimes } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';
import PWDUserDetailsModal from '@/Components/PWDUserDetailsModal';
import PWDUserEditModal from '@/Components/PWDUserEditModal';

export default function PWDUser({ users }) {
  // Modal and edit state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Card preview modal state
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardUrl, setCardUrl] = useState('');
  const [cardLoading, setCardLoading] = useState(true);
  const [cardUser, setCardUser] = useState(null);

  // Search & pagination state
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Handlers
  const openModal = (user) => { setSelectedUser(user); setIsEditing(false); };
  const openEditModal = (user) => { setSelectedUser(user); setEditData({ ...user }); setIsEditing(true); };
  const closeModal = () => { setSelectedUser(null); setIsEditing(false); setEditData({}); };

  const handleEditChange = (e) => { const { name, value } = e.target; setEditData(prev => ({ ...prev, [name]: value })); };
  const handleUpdate = (e) => { e.preventDefault(); Inertia.put(`/Admin/PWDusers/${selectedUser.id}`, editData, { onSuccess: closeModal }); };

  // Card preview handlers
  const openCardModal = (user) => {
    setCardUrl(buildBarcodeUrl(user));
    setCardLoading(true);
    setCardUser(user);
    setShowCardModal(true);
  };
  const closeCardModal = () => { setShowCardModal(false); setCardUrl(''); setCardLoading(true); setCardUser(null); };


  // Filtering and pagination
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const name = u.user?.name ? u.user.name.toLowerCase() : `${u.firstName} ${u.lastName}`.toLowerCase();
    return u.pwdNumber.toLowerCase().includes(q) || name.includes(q);
  });
  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const currentData = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Build card URL
  const buildBarcodeUrl = (u) => {
    const city = u.city || 'Davao';
    const fullName = u.user?.name || `${u.firstName} ${u.lastName}`;
    const type = Array.isArray(u.disabilityTypes) ? u.disabilityTypes.join(', ') : u.disabilityTypes;
    const id = u.pwdNumber;
    const t = Date.now();
    return `/Admin/PWDusers/${u.id}/generate?city=${encodeURIComponent(city)}&name=${encodeURIComponent(fullName)}&type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&t=${t}`;
  };

  return (
    <AdminLayout header={<h2 className="font-semibold text-xl text-gray-800">PWD Users</h2>}>
      <Head title="PWD Users" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Search & per-page */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-1/2 mb-4 sm:mb-0 px-4 py-2 border rounded"
            />
            <select
              value={entriesPerPage}
              onChange={e => { setEntriesPerPage(+e.target.value); setCurrentPage(1); }}
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
                {currentData.length > 0 ? currentData.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-normal sm:whitespace-nowrap">{u.pwdNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{u.user?.name || `${u.firstName} ${u.lastName}`}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">{new Date(u.dateApplied).toLocaleDateString()}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">{u.sex}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => openModal(u)} className="text-sky-500"><FaEye size={18} /></button>
                      <button onClick={() => openEditModal(u)} className="text-teal-500"><FaEdit size={18} /></button>
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
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="px-3 py-1 rounded bg-teal-800 text-white disabled:bg-gray-300">Previous</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={()=>setCurrentPage(i+1)} className={`px-3 py-1 rounded ${currentPage===i+1?'bg-teal-800 text-white':'bg-gray-200'}`}>{i+1}</button>
              ))}
              <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="px-3 py-1 rounded bg-teal-800 text-white disabled:bg-gray-300">Next</button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedUser && !isEditing && <PWDUserDetailsModal selectedUser={selectedUser} closeModal={closeModal} />}
      {selectedUser && isEditing && <PWDUserEditModal selectedUser={selectedUser} editData={editData} handleEditChange={handleEditChange} handleUpdate={handleUpdate} closeModal={closeModal} />}

      {/* Card Preview Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeCardModal}>
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
