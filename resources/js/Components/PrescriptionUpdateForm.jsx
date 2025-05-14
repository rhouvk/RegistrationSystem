import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import ConfirmPrescriptionUpdateModal from '@/Components/ConfirmPrescriptionUpdateModal';

export default function PrescriptionUpdateForm({
  pwdUser,
  fillings,
  openIndex,
  pharmacistName,
  filledQty,
  handleStartUpdate,
  handleConfirmFill,
  setPharmacistName,
  setFilledQty,
  setOpenIndex,
  getStatusLabel,
  showModal,
  setShowModal,
  onConfirm
}) {
  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-6">
      <div className="bg-white p-6 rounded shadow space-y-6">
        {/* PWD Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="p-[2px] rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500">
            <img
              src={pwdUser.photo ? `/storage/${pwdUser.photo}` : '/images/default-avatar.png'}
              alt="PWD"
              className="w-16 h-16 object-cover rounded-full border-2 border-white"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">PWD ID: <span className="font-medium">{pwdUser.pwdNumber}</span></p>
            <p className="text-lg font-semibold text-gray-800">{pwdUser.user?.name || 'Unnamed PWD'}</p>
          </div>
        </div>

        {fillings.filter(f => f.filling_status !== 3).length === 0 ? (
          <p className="text-gray-500">No unfinished prescriptions found.</p>
        ) : (
          fillings.filter(f => f.filling_status !== 3).map((filling, idx) => {
            const prescribed = filling.prescription.quantity_prescribed || 0;
            const totalFilled = filling.prescription.total_filled || 0;
            const remaining = Math.max(prescribed - totalFilled, 0);
            const isOverfilled = filledQty > remaining;
            const isEmptyName = pharmacistName.trim() === '';
            const isInvalidQty = filledQty <= 0;
            const isDisabled = isOverfilled || isEmptyName || isInvalidQty;

            return (
              <div key={filling.id} className="space-y-2 border-t pt-4">
                <h3 className="text-lg font-bold text-gray-800">{filling.prescription.medicine_purchase}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><span className="font-medium">Prescribed:</span> {prescribed}</p>
                  <p><span className="font-medium">Physician:</span> {filling.prescription.physician_name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><span className="font-medium">Remaining:</span> {remaining}</p>
                  <p><span className="font-medium">PTR No.:</span> {filling.prescription.physician_ptr_no}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><span className="font-medium">Status:</span> {getStatusLabel(filling.filling_status)}</p>
                  <p><span className="font-medium">Address:</span> {filling.prescription.physician_address}</p>
                </div>

                {openIndex === idx ? (
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      placeholder="Pharmacist Name"
                      className={`w-full border rounded px-3 py-2 ${isEmptyName ? 'border-red-500' : ''}`}
                      value={pharmacistName}
                      onChange={(e) => setPharmacistName(e.target.value)}
                    />
                    {isEmptyName && <p className="text-sm text-red-600">Pharmacist name is required.</p>}

                    <input
                      type="number"
                      placeholder="Quantity to Fill"
                      min={1}
                      max={remaining}
                      value={filledQty}
                      onChange={(e) => setFilledQty(parseInt(e.target.value || 0))}
                      className={`w-full border rounded px-3 py-2 ${isOverfilled || isInvalidQty ? 'border-red-500' : ''}`}
                    />
                    {isInvalidQty && <p className="text-sm text-red-600">Filling quantity must be greater than 0.</p>}
                    {isOverfilled && <p className="text-sm text-red-600">Filled quantity cannot exceed the remaining amount.</p>}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setOpenIndex(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        disabled={isDisabled}
                        className={`px-6 py-2 rounded text-sm font-medium text-white ${isDisabled ? 'bg-teal-600 opacity-50 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
                      >
                        Confirm Fill
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3">
                    <button
                      onClick={() => handleStartUpdate(idx, filling)}
                      className="bg-teal-600 text-white px-4 py-1 rounded flex items-center gap-2 hover:bg-teal-700"
                    >
                      <FaArrowRight /> Fill Remaining
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && openIndex !== null && (
  <ConfirmPrescriptionUpdateModal
    onCancel={() => setShowModal(false)}
    onConfirm={() => {
      onConfirm();
      setShowModal(false);
    }}
    filledQty={filledQty}
    pharmacistName={pharmacistName}
    medicineName={fillings[openIndex].prescription.medicine_purchase}
  />
      )}

    </div>
  );
}
