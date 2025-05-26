import React, { useState } from 'react';
import { FaTrash, FaPlus, FaInfoCircle } from 'react-icons/fa';
import ConfirmPrescriptionModal from '@/Components/ConfirmPrescriptionModal';
import FamilyInfoModal from '@/Components/FamilyInfoModal';

export default function PrescriptionForm({
  data,
  setData,
  handleSubmit,
  handleChange,
  addMedicine,
  removeMedicine,
  flash,
  errors,
  processing,
  pwdUser,
  expiryDate,
  isExpired,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFamilyInfo, setShowFamilyInfo] = useState(false);

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmedSubmit = () => {
    setShowConfirm(false);
    handleSubmit(new Event('submit'));
  };

  const isFormIncomplete =
    !data.physician_name ||
    !data.physician_address ||
    !data.physician_ptr_no ||
    !data.pharmacist_name ||
    data.entries.some(
      (entry) =>
        !entry.medicine_purchase ||
        entry.quantity_prescribed === '' ||
        entry.quantity_filled === '' ||
        parseInt(entry.quantity_prescribed) <= 0 ||
        parseInt(entry.quantity_filled) <= 0 ||
        parseInt(entry.quantity_filled) > parseInt(entry.quantity_prescribed)
    );

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-6">
      <div className="bg-white p-6 rounded shadow space-y-4">
        {flash.success && (
          <div className="text-green-600 bg-green-100 px-3 py-2 rounded">
            {flash.success}
          </div>
        )}

        <div className="flex items-center gap-4 pb-2 border-b">
          <div className="p-[2px] rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500">
            <img
              src={pwdUser.photo ? `/storage/${pwdUser.photo}` : '/images/default-avatar.png'}
              alt="PWD Photo"
              className="w-16 h-16 object-cover rounded-full border-2 border-white"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">PWD ID: <span className="font-medium">{pwdUser.pwdNumber}</span></p>
            <p className="text-lg font-semibold text-gray-800">{pwdUser.user?.name || 'Unnamed PWD'}</p>
            <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>Valid Until: {expiryDate}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowFamilyInfo(true)} 
            className="ml-auto text-teal-600 hover:text-teal-700 p-2"
            aria-label="Show family information"
          >
            <FaInfoCircle size={20} />
          </button>
        </div>

        {isExpired && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            This PWD card has expired. You cannot submit a new prescription.
          </div>
        )}

        <form onSubmit={handleConfirmSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => setData('date', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {data.entries.map((entry, idx) => {
            const filled = parseInt(entry.quantity_filled || 0);
            const prescribed = parseInt(entry.quantity_prescribed || 0);
            const isOver = filled > prescribed;
            const amount = Math.max(0, prescribed - filled);
            return (
              <div key={idx} className="border rounded p-4 space-y-3 relative bg-gray-50">
                {data.entries.length > 1 && (
                  <button type="button" onClick={() => removeMedicine(idx)} className="absolute top-2 right-2 text-red-600">
                    <FaTrash />
                  </button>
                )}
                <div>
                  <label className="block text-sm">Medicine Name</label>
                  <input
                    type="text"
                    value={entry.medicine_purchase}
                    onChange={(e) => handleChange(idx, 'medicine_purchase', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Prescribed</label>
                    <input
                      type="number"
                      min="1"
                      value={entry.quantity_prescribed}
                      onChange={(e) => handleChange(idx, 'quantity_prescribed', Math.max(1, parseInt(e.target.value || 1)))}
                      className="w-full border rounded px-3 py-2"
                    />
                    {parseInt(entry.quantity_prescribed) <= 0 && (
                      <p className="text-sm text-red-500">Quantity must be greater than 0</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm">Filled Now</label>
                    <input
                      type="number"
                      min="1"
                      value={entry.quantity_filled}
                      onChange={(e) => handleChange(idx, 'quantity_filled', Math.max(1, parseInt(e.target.value || 1)))}
                      className={`w-full border rounded px-3 py-2 ${isOver ? 'border-red-500' : ''}`}
                    />
                    {parseInt(entry.quantity_filled) <= 0 ? (
                      <p className="text-sm text-red-500">Quantity must be greater than 0</p>
                    ) : isOver && (
                      <p className="text-sm text-red-500">Cannot fill more than prescribed.</p>
                    )}
                  </div>
                </div>
                {entry.quantity_prescribed && entry.quantity_filled ? (
                  <div className="text-sm text-gray-700">
                    Filling Status:{' '}
                    <span className="font-semibold">
                      {amount === 0 ? 'Fully Filled' : 'First Filling'}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}

          <button type="button" onClick={addMedicine} className="flex items-center gap-2 text-sm text-teal-700 hover:underline">
            <FaPlus /> Add Another Medicine
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Physician Name</label>
              <input
                type="text"
                value={data.physician_name}
                onChange={(e) => setData('physician_name', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.physician_name && <p className="text-red-500 text-sm">{errors.physician_name}</p>}
            </div>
            <div>
            <label className="block text-sm">PTR Number</label>
            <input
              type="number"
              min="0"
              max="9999999"
              value={data.physician_ptr_no}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 7) {
                  setData('physician_ptr_no', value);
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
            {errors.physician_ptr_no && (
              <p className="text-red-500 text-sm">{errors.physician_ptr_no}</p>
            )}
          </div>

            <div className="sm:col-span-2">
              <label className="block text-sm">Physician Address</label>
              <input
                type="text"
                value={data.physician_address}
                onChange={(e) => setData('physician_address', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.physician_address && <p className="text-red-500 text-sm">{errors.physician_address}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm">Pharmacist Name</label>
              <input
                type="text"
                value={data.pharmacist_name}
                onChange={(e) => setData('pharmacist_name', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.pharmacist_name && <p className="text-red-500 text-sm">{errors.pharmacist_name}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded disabled:opacity-50"
              disabled={processing || isExpired || isFormIncomplete}
            >
              {processing ? 'Saving…' : 'Submit Prescription'}
            </button>
          </div>
        </form>

        <ConfirmPrescriptionModal
          show={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmedSubmit}
          entries={data.entries}
          processing={processing}
        />

        <FamilyInfoModal 
          show={showFamilyInfo}
          onClose={() => setShowFamilyInfo(false)}
          pwdUser={pwdUser}
        />
      </div>
    </div>
  );
}