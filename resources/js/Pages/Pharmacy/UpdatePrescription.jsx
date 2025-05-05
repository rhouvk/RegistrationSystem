import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import Scanner from '@/Components/Scanner';
import { FaSearch, FaIdCard, FaArrowRight } from 'react-icons/fa';

export default function UpdatePrescription() {
  const { flash = {}, pwdUser = null, fillings = [] } = usePage().props;
  const [lookupNumber, setLookupNumber] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [pharmacistName, setPharmacistName] = useState('');
  const [filledQty, setFilledQty] = useState(0);
  const [selectedFillingId, setSelectedFillingId] = useState(null);

  const handleLookup = (e) => {
    e.preventDefault();
    router.visit(route('pharmacy.prescriptions.update.create'), {
      data: { pwd_number: lookupNumber },
      preserveState: true,
      preserveScroll: false,
    });
  };

  const handleStartUpdate = (idx, filling) => {
    setOpenIndex(idx);
    setFilledQty(filling.remaining_amount || 0);
    setSelectedFillingId(filling.id);
  };

  const handleConfirmFill = () => {
    if (!selectedFillingId || filledQty <= 0 || !pharmacistName.trim()) return;

    router.post(route('pharmacy.prescriptions.update'), {
      pharmacist_name: pharmacistName,
      updates: [{ id: selectedFillingId, quantity_filled: filledQty }],
    }, {
      onSuccess: () => {
        setOpenIndex(null);
        setSelectedFillingId(null);
        setPharmacistName('');
        setFilledQty(0);
      }
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return 'First Fill';
      case 2: return 'Second Fill';
      case 3: return 'Fully Filled';
      default: return 'Unknown';
    }
  };

  if (!pwdUser) {
    return (
      <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Update Prescription Fill</h2>}>
        <Head title="Lookup for Update" />
        <div className="py-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
            {flash.lookup_error && (
              <div className="text-red-600 text-sm bg-red-100 p-2 rounded">{flash.lookup_error}</div>
            )}
            <form onSubmit={handleLookup} className="space-y-4">
              <input
                type="text"
                value={lookupNumber}
                onChange={(e) => setLookupNumber(e.target.value)}
                placeholder="Enter PWD Number"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
                  <FaSearch /> Lookup
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center gap-2"
                  onClick={() => setShowScanner(true)}
                >
                  <FaIdCard /> Scan
                </button>
              </div>
            </form>
            {showScanner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                  <Scanner
                    onUserFound={(user) => {
                      setShowScanner(false);
                      if (user?.pwdNumber) {
                        router.visit(route('pharmacy.prescriptions.update.create'), {
                          data: { pwd_number: user.pwdNumber },
                          preserveState: true,
                          preserveScroll: false,
                        });
                      }
                    }}
                  />
                  <button
                    className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded"
                    onClick={() => setShowScanner(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PharmacyLayout>
    );
  }

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold">Update Prescription Fill</h2>}>
      <Head title="Update Fill" />
      <div className="py-12 max-w-3xl mx-auto px-4 space-y-6">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="text-lg font-medium text-gray-700 mb-4">
            Updating for: <span className="font-bold">{pwdUser.pwdNumber}</span>
          </div>
          {fillings.length === 0 ? (
            <div className="text-gray-500">No unfinished prescriptions found.</div>
          ) : (
            fillings.map((filling, idx) => {
              const prescribed = filling.prescription.quantity_prescribed || 0;
              const totalFilled = filling.prescription.total_filled || 0;
              const remaining = Math.max(prescribed - totalFilled, 0);

              return (
                <div key={filling.id} className="border rounded p-4 bg-gray-50 space-y-2">
                  <div className="font-medium text-lg">{filling.prescription.medicine_purchase}</div>
                  <div className="text-sm text-gray-600">Prescribed: {prescribed}</div>
                  <div className="text-sm text-gray-600">Remaining: {remaining}</div>
                  <div className="text-sm text-gray-600 mb-2">Status: {getStatusLabel(filling.filling_status)}</div>

                  {openIndex === idx ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Pharmacist Name"
                        value={pharmacistName}
                        onChange={(e) => setPharmacistName(e.target.value)}
                      />
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        min={1}
                        max={remaining}
                        value={filledQty}
                        onChange={(e) => setFilledQty(parseInt(e.target.value || 0))}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setOpenIndex(null)} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
                        <button onClick={handleConfirmFill} className="bg-teal-600 text-white px-4 py-1 rounded">Confirm Fill</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartUpdate(idx, filling)}
                      className="bg-teal-600 text-white px-4 py-1 rounded flex items-center gap-2 hover:bg-teal-700"
                    >
                      <FaArrowRight /> Fill Remaining
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </PharmacyLayout>
  );
}
