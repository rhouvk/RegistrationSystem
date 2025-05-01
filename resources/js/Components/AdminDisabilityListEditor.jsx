import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AdminDisabilityListEditor({ disabilities = [] }) {
  const { data, setData, reset, post, put, delete: destroy, processing, errors } = useForm({
    name: '',
    category: 'Type',
  });

  const [editId, setEditId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25); // Dynamic

  const openEditModal = (item) => {
    setEditId(item.id);
    setData({
      name: item.name,
      category: item.category,
    });
    setShowFormModal(true);
  };

  const openCreateModal = () => {
    reset();
    setEditId(null);
    setShowFormModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      put(route('admin.disability.update', editId), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setEditId(null);
          setShowFormModal(false);
        },
      });
    } else {
      post(route('admin.disability.store'), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setShowFormModal(false);
        },
      });
    }
  };

  const handleDelete = () => {
    destroy(route('admin.disability.destroy', deleteId), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteId(null);
        setShowDeleteModal(false);
      },
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = disabilities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(disabilities.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          <FaPlus className="mr-2" /> Add Disability
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

      {/* List Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-teal-400 text-white rounded hover:bg-teal-500"
                  >
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

        {/* Pagination Controls */}
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

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? 'Edit Disability' : 'Add Disability'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
                />
                {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={data.category}
                  onChange={(e) => setData('category', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
                >
                  <option value="Type">Type</option>
                  <option value="Cause">Cause</option>
                </select>
                {errors.category && <div className="text-red-500 mt-1">{errors.category}</div>}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold mb-6">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this item?</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
