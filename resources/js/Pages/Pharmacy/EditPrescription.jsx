import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';

export default function EditPrescription({
  prescription,
  editableFillings = [],
  canEditPrescription,
  totalFilledByOthers = 0,
}) {
  const prescribedQty = parseFloat(prescription.quantity_prescribed || 1);

  const { data, setData, put, errors, processing } = useForm({
    medicine_purchase: prescription.medicine_purchase || '',
    quantity_prescribed: prescribedQty,
    physician_name: prescription.physician_name || '',
    physician_address: prescription.physician_address || '',
    physician_ptr_no: prescription.physician_ptr_no || '',
    fillings: editableFillings.map(f => ({
      id: f.id,
      filling_amount: f.filling_amount ?? 0,
      pharmacist_name: f.pharmacist_name || '—',
    })),
  });

  const handleFillingChange = (index, value) => {
    const updated = [...data.fillings];
    const input = parseFloat(value);
    const maxAllowed = Math.max(0, prescribedQty - totalFilledByOthers);
    updated[index].filling_amount = isNaN(input)
      ? 0
      : Math.min(input, maxAllowed);
    setData('fillings', updated);
  };

  const handlePrescriptionChange = (field, value) => {
    if (canEditPrescription) setData(field, value);
  };

  const ownTotalFilled = data.fillings.reduce(
    (sum, f) => sum + (parseFloat(f.filling_amount) || 0),
    0
  );

  const totalFilled = totalFilledByOthers + ownTotalFilled;
  const overfill = totalFilled > prescribedQty;
  const anyInvalid = data.fillings.some(
    (f) => f.filling_amount < 0 || isNaN(f.filling_amount)
  );

  const disableSubmit = overfill || anyInvalid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disableSubmit) return;

    put(route('prescriptions.update', prescription.id), {
      preserveScroll: true,
      data: {
        medicine_purchase: data.medicine_purchase,
        quantity_prescribed: data.quantity_prescribed,
        physician_name: data.physician_name,
        physician_address: data.physician_address,
        physician_ptr_no: data.physician_ptr_no,
        fillings: data.fillings,
      },
    });
  };

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold">Edit Prescription</h2>}>
      <Head title="Edit Prescription" />

      <div className="max-w-4xl mx-auto mt-8 px-4 py-6 bg-white shadow rounded-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Medicine Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditPrescription}
                value={data.medicine_purchase}
                onChange={(e) => handlePrescriptionChange('medicine_purchase', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Quantity Prescribed</label>
              <input
                type="number"
                min="1"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditPrescription}
                value={data.quantity_prescribed}
                onChange={(e) => handlePrescriptionChange('quantity_prescribed', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Physician Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditPrescription}
                value={data.physician_name}
                onChange={(e) => handlePrescriptionChange('physician_name', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">PTR No.</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditPrescription}
                value={data.physician_ptr_no}
                onChange={(e) => handlePrescriptionChange('physician_ptr_no', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Physician Address</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                disabled={!canEditPrescription}
                value={data.physician_address}
                onChange={(e) => handlePrescriptionChange('physician_address', e.target.value)}
              />
            </div>
          </div>

          {data.fillings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Prescription Fillings</h3>
              {data.fillings.map((filling, idx) => (
                <div key={filling.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3 rounded bg-gray-50">
                  <div>
                    <label className="block font-medium text-sm mb-1">Filling Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={filling.filling_amount}
                      onChange={(e) => handleFillingChange(idx, e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max allowed: {prescribedQty - totalFilledByOthers} unit{(prescribedQty - totalFilledByOthers) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-end text-sm text-gray-600">
                    Filled by: <span className="ml-1 font-medium">{filling.pharmacist_name}</span>
                  </div>
                </div>
              ))}
              {errors.fillings && (
                <p className="text-red-500 text-sm">{errors.fillings}</p>
              )}
            </div>
          )}

          <div className="flex justify-between text-sm mt-4">
            <div><strong>Total Filled:</strong> {totalFilled}</div>
            <div>
              <strong>Remaining Balance:</strong>{' '}
              <span className={overfill ? 'text-red-600 font-semibold' : ''}>
                {Math.max(0, prescribedQty - totalFilled)}
              </span>
            </div>
          </div>

          {overfill && (
            <div className="text-red-600 text-sm font-medium mt-2">
              ⚠️ You have exceeded the prescribed quantity. Please adjust.
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <Link href={route('pharmacy.prescriptions.log')} className="text-cyan-700 hover:underline">
              Back to Log
            </Link>
            <button
              type="submit"
              disabled={disableSubmit || processing}
              className={`px-6 py-2 rounded transition text-white ${
                disableSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </PharmacyLayout>
  );
}
