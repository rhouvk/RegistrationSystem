// resources/js/Pages/Pharmacy/RecordPrescription.jsx
import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import Scanner from '@/Components/Scanner';
import { FaSearch, FaIdCard, FaTrash, FaPlus } from 'react-icons/fa';

export default function RecordPrescription() {
  const { pwdUser = null, flash = {}, errors = {} } = usePage().props;
  const [lookupNumber, setLookupNumber] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    date: new Date().toISOString().split('T')[0],
    buyer_id: pwdUser?.user_id || '',
    physician_name: '',
    physician_address: '',
    physician_ptr_no: '',
    pharmacist_name: '',
    entries: [
      { medicine_purchase: '', quantity_prescribed: '', quantity_filled: '' },
    ],
  });

  useEffect(() => {
    if (pwdUser?.user_id) setData('buyer_id', pwdUser.user_id);
  }, [pwdUser]);

  const addMedicine = () => {
    setData('entries', [
      ...data.entries,
      { medicine_purchase: '', quantity_prescribed: '', quantity_filled: '' },
    ]);
  };

  const removeMedicine = (index) => {
    const updated = [...data.entries];
    updated.splice(index, 1);
    setData('entries', updated);
  };

  const handleChange = (i, field, value) => {
    const updated = [...data.entries];
    updated[i][field] = value;
    setData('entries', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('pharmacy.prescriptions.store'), {
      onSuccess: () => {
        reset('entries', 'physician_name', 'physician_address', 'physician_ptr_no', 'pharmacist_name');
      },
    });
  };

  const handleLookup = (e) => {
    e.preventDefault();
    router.visit(route('pharmacy.prescriptions.create'), {
      data: { pwd_number: lookupNumber },
      preserveState: true,
      preserveScroll: false,
    });
  };

  if (!pwdUser) {
    return (
      <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Record a Prescription</h2>}>
        <Head title="Lookup PWD" />
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
                  <FaSearch className="text-base sm:text-lg" />
                  Lookup
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center gap-2"
                  onClick={() => setShowScanner(true)}
                >
                  <FaIdCard className="text-base sm:text-lg" />
                  Scan
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
                        router.visit(route('pharmacy.prescriptions.create'), {
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
    <PharmacyLayout header={<h2 className="text-xl font-semibold">Record Prescription</h2>}>
      <Head title="Prescription Entry" />
      <div className="py-12 max-w-3xl mx-auto px-4 space-y-6">
        <div className="bg-white p-6 rounded shadow space-y-4">
          {flash.success && (
            <div className="text-green-600 bg-green-100 px-3 py-2 rounded">
              {flash.success}
            </div>
          )}

          <div className="text-lg font-semibold text-gray-700">
            Recording for: <span className="font-bold">{pwdUser.pwdNumber}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button
                      type="button"
                      onClick={() => removeMedicine(idx)}
                      className="absolute top-2 right-2 text-red-600"
                    >
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
                        value={entry.quantity_prescribed}
                        onChange={(e) => handleChange(idx, 'quantity_prescribed', parseInt(e.target.value || 0))}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Filled Now</label>
                      <input
                        type="number"
                        value={entry.quantity_filled}
                        onChange={(e) => handleChange(idx, 'quantity_filled', parseInt(e.target.value || 0))}
                        className={`w-full border rounded px-3 py-2 ${isOver ? 'border-red-500' : ''}`}
                      />
                      {isOver && (
                        <p className="text-sm text-red-500">Cannot file more than prescribed.</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    Filling Status: <span className="font-semibold">{amount === 0 ? 'Fully Filled' : 'First Filling'}</span>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center gap-2 text-sm text-teal-700 hover:underline"
            >
              <FaPlus />
              Add Another Medicine
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
                  type="text"
                  value={data.physician_ptr_no}
                  onChange={(e) => setData('physician_ptr_no', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.physician_ptr_no && <p className="text-red-500 text-sm">{errors.physician_ptr_no}</p>}
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
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
                disabled={processing}
              >
                {processing ? 'Saving…' : 'Submit Prescription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PharmacyLayout>
  );
}
