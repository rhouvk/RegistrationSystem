import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';

export default function EditTransaction({ transaction, bnpcItems, purchaseLimit = 0, usedSoFar = 0 }) {
  const { data, setData, put, processing, errors } = useForm({
    bnpc_item_id: transaction.bnpc_item_id || '',
    quantity: transaction.quantity || 1,
    total_amount: transaction.total_amount || 0,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const baseRemaining = parseFloat(purchaseLimit) - parseFloat(usedSoFar);
  const currentTotal = parseFloat(data.total_amount) || 0;
  const currentQty = parseInt(data.quantity) || 0;
  const remainingAfterEdit = baseRemaining - currentTotal;

  const exceedsLimit = remainingAfterEdit < 0;
  const invalidQty = currentQty < 1;
  const invalidTotal = currentTotal <= 0;
  const isFormInvalid = exceedsLimit || invalidQty || invalidTotal;

  useEffect(() => {
    const item = bnpcItems.find(i => i.id === data.bnpc_item_id);
    setSelectedItem(item || null);
  }, [data.bnpc_item_id, bnpcItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    setShowConfirm(false);
    put(route('business.bnpc-transactions.update', transaction.id));
  };

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Edit Transaction</h2>}>
      <Head title="Edit Transaction" />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Item Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Item</label>
              <select
                value={data.bnpc_item_id}
                onChange={e => setData('bnpc_item_id', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select an item</option>
                {bnpcItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              {errors.bnpc_item_id && <p className="text-sm text-red-500">{errors.bnpc_item_id}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={data.quantity}
                onChange={e => setData('quantity', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {invalidQty && <p className="text-sm text-red-500">Quantity must be at least 1.</p>}
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.total_amount}
                onChange={e => setData('total_amount', parseFloat(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {invalidTotal && <p className="text-sm text-red-500">Total amount must be greater than zero.</p>}
              {errors.total_amount && <p className="text-sm text-red-500">{errors.total_amount}</p>}
              <p className={`text-sm mt-1 ${exceedsLimit ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                Remaining Weekly Balance (after update): ₱{!isNaN(remainingAfterEdit) ? remainingAfterEdit.toFixed(2) : '0.00'}
              </p>
              {exceedsLimit && (
                <p className="text-sm text-red-600 font-medium">⚠️ This entry exceeds the allowed weekly limit.</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || isFormInvalid}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {processing ? 'Saving…' : 'Update Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex items-center justify-center">
          <div className="bg-white max-w-md w-full rounded-lg p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Update</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to update this transaction with total amount of ₱{currentTotal.toFixed(2)}?
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
}
