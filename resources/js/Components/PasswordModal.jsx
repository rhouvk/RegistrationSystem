// File: resources/js/Components/PasswordModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function PasswordModal({
  show,
  password,
  onChange,
  onCancel,
  onConfirm,
  processing,
  errors,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onCancel}>
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Enter Admin Password</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={onConfirm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={onChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
            />
            {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {processing ? 'Processing...' : 'Confirm & Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
