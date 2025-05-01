import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AdminBNPCItemEditor({ items: initialItems }) {
  const { data, setData, post, put, delete: del, processing, errors } = useForm({
    id: null,
    name: '',
    type: 'Basic Necessities',
  });

  const [items, setItems] = useState(initialItems || []);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25); // Now dynamic!

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  function openCreate() {
    setData({ id: null, name: '', type: 'Basic Necessities' });
    setShowModal(true);
  }

  function openEdit(item) {
    setData(item);
    setShowModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const action = data.id
      ? put(route('admin.bnpc.update', data.id), { onSuccess: refresh })
      : post(route('admin.bnpc.store'), { onSuccess: refresh });
  }

  function handleDelete(id) {
    if (confirm('Delete this item?')) {
      del(route('admin.bnpc.destroy', id), { onSuccess: refresh });
    }
  }

  function refresh() {
    setShowModal(false);
    Inertia.get(route('admin.controls.index'), {}, { preserveState: true });
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to page 1 when per-page changes
  };

  return (
    <>
      {/* Top Controls */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={openCreate}
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          <FaPlus className="mr-2" /> Add Item
        </button>

        {/* Items Per Page Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border-gray-300 rounded-md shadow-sm focus:ring focus:border-cyan-300 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => openEdit(item)} className="p-2 bg-teal-400 text-white rounded hover:bg-teal-500">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {data.id ? 'Edit BNPC Item' : 'Add BNPC Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-cyan-300"
                />
                {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={data.type}
                  onChange={e => setData('type', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-cyan-300"
                >
                  <option>Basic Necessities</option>
                  <option>Prime Commodities</option>
                </select>
                {errors.type && <div className="text-red-500 mt-1">{errors.type}</div>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" disabled={processing} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  {processing ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
