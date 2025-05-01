// resources/js/Pages/Business/RecordTransaction.jsx

import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function RecordTransaction() {
  const {
    bnpcItems = [],
    purchaseLimit = 0,
    usedSoFar = 0,
    remainingBalance: initialBalance = 0,
    pwdUser = null,
  } = usePage().props;

  const [lookupNumber, setLookupNumber] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    date_of_purchase:   new Date().toISOString().substr(0,10),
    pwd_number:         pwdUser?.pwdNumber || '',
    items:              [{ bnpc_item_id:'', quantity:'', line_total:'' }],
    total_amount:       0,
    remaining_balance:  initialBalance.toFixed(2),
    signature:          null,
  });

  // compute line‑balances, grand total, and final remaining
  const [lineBalances, setLineBalances] = useState([]);
  useEffect(() => {
    let bal = parseFloat(initialBalance) || 0;
    let grand = 0;
    const bals = [];

    data.items.forEach(row => {
      const amt = parseFloat(row.line_total) || 0;
      grand += amt;
      bal = Math.max(bal - amt, 0);
      bals.push(bal);
    });

    setLineBalances(bals);
    setData('total_amount', grand.toFixed(2));
    setData('remaining_balance', bal.toFixed(2));
  }, [data.items]);

  // lookup PWD
  const handleLookup = e => {
    e.preventDefault();
    router.get(
      route('business.bnpc-transactions.create'),
      { pwd_number: lookupNumber },
      { preserveState: true }
    );
  };

  if (!pwdUser) {
    return (
      <BusinessLayout header={<h2 className="text-xl font-bold">Record a Transaction</h2>}>
        <Head title="Lookup PWD" />
        <div className="py-12">
          <div className="mx-auto max-w-md bg-white p-6 shadow sm:rounded-lg">
            <form onSubmit={handleLookup} className="space-y-4">
              <InputLabel htmlFor="pwd_lookup" value="Enter PWD Number" />
              <TextInput
                id="pwd_lookup"
                value={lookupNumber}
                onChange={e=>setLookupNumber(e.target.value)}
                placeholder="02‑1234‑5678‑9012"
                className="w-full"
              />
              <InputError message={errors.pwd_number} />
              <button
                type="submit"
                className="inline-flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lookup
              </button>
            </form>
          </div>
        </div>
      </BusinessLayout>
    );
  }

  // dynamic row handlers
  const addRow    = () => setData('items',[...data.items,{ bnpc_item_id:'',quantity:'',line_total:'' }]);
  const removeRow = i  => setData('items', data.items.filter((_,j)=>j!==i));
  const updateRow = (i,f,v) => {
    const items = [...data.items];
    items[i][f] = v;
    setData('items', items);
  };

  // trap the initial submit to open modal
  const handleSubmit = e => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // once confirmed, actually post
  const confirmSubmit = () => {
    setShowConfirm(false);
    post(route('business.bnpc-transactions.store'));
  };

  return (
    <BusinessLayout header={<h2 className="text-xl font-bold">Record a Transaction</h2>}>
      <Head title="Record a Transaction" />

      <div className="py-12 space-y-6">

        {/* Weekly summary */}
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="bg-white shadow p-6 sm:rounded-lg">
            <p><strong>Weekly Cap:</strong> ₱{purchaseLimit.toFixed(2)}</p>
            <p><strong>Used So Far:</strong> ₱{usedSoFar.toFixed(2)}</p>
            <p><strong>Remaining Before:</strong> ₱{initialBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Main form */}
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow sm:rounded-lg">

            {/* Date */}
            <div>
              <InputLabel htmlFor="date_of_purchase" value="Date of Purchase" />
              <TextInput
                id="date_of_purchase"
                type="date"
                value={data.date_of_purchase}
                onChange={e=>setData('date_of_purchase',e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.date_of_purchase} />
            </div>

            {/* PWD Number */}
            <div>
              <InputLabel htmlFor="pwd_number" value="Purchased By (PWD Number)" />
              <TextInput
                id="pwd_number"
                value={pwdUser.pwdNumber}
                disabled
                className="mt-1 block w-full bg-gray-100"
              />
            </div>

            {/* Line‑items */}
            <div>
              <InputLabel value="Items Purchased" />
              {data.items.map((row,i)=> {
                const available = bnpcItems.filter(item =>
                  ! data.items.some((r,j)=> j!== i && r.bnpc_item_id == item.id)
                );
                return (
                  <div key={i} className="mb-4 border p-4 rounded space-y-3">
                    <div>
                      <InputLabel htmlFor={`item_${i}`} value="Item Name" />
                      <select
                        id={`item_${i}`}
                        value={row.bnpc_item_id}
                        onChange={e=>updateRow(i,'bnpc_item_id',e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                      >
                        <option value="">— choose —</option>
                        {available.map(x=>(
                          <option key={x.id} value={x.id}>{x.name}</option>
                        ))}
                      </select>
                      <InputError message={errors[`items.${i}.bnpc_item_id`]} />
                    </div>

                    <div>
                      <InputLabel htmlFor={`qty_${i}`} value="Quantity" />
                      <TextInput
                        id={`qty_${i}`}
                        type="number"
                        value={row.quantity}
                        onChange={e=>updateRow(i,'quantity',e.target.value)}
                        className="mt-1 block w-full"
                      />
                      <InputError message={errors[`items.${i}.quantity`]} />
                    </div>

                    <div>
                      <InputLabel htmlFor={`total_${i}`} value="Line Total Amount (₱)" />
                      <TextInput
                        id={`total_${i}`}
                        type="number"
                        step="0.01"
                        value={row.line_total}
                        onChange={e=>updateRow(i,'line_total',e.target.value)}
                        className="mt-1 block w-full"
                      />
                      <InputError message={errors[`items.${i}.line_total`]} />
                    </div>

                    <p className="text-sm text-gray-600">
                      Remaining after this line: ₱{lineBalances[i]?.toFixed(2) ?? initialBalance.toFixed(2)}
                    </p>

                    {data.items.length > 1 && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={()=>removeRow(i)}
                          className="text-red-600 hover:underline"
                        >Remove</button>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addRow}
                className="text-blue-600 hover:underline"
              >+ Add another item</button>
            </div>

            {/* Grand total */}
            <div>
              <InputLabel htmlFor="total_amount" value="Grand Total (₱)" />
              <TextInput
                id="total_amount"
                type="number"
                value={data.total_amount}
                readOnly
                className="mt-1 block w-full bg-gray-100"
              />
            </div>

            {/* Final remaining balance */}
            <div>
              <InputLabel htmlFor="remaining_balance" value="Remaining Balance (₱)" />
              <TextInput
                id="remaining_balance"
                type="number"
                value={data.remaining_balance}
                readOnly
                className="mt-1 block w-full bg-gray-100"
              />
            </div>

            {/* Signature */}
            <div>
              <InputLabel htmlFor="signature" value="Signature (image)" />
              <input
                id="signature"
                type="file"
                accept="image/*"
                onChange={e=>setData('signature',e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-600"
              />
              <InputError message={errors.signature} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Saving…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Transaction</h3>
            <p className="mb-2">
              <strong>Grand Total:</strong> ₱{data.total_amount}
            </p>
            <p className="mb-6">
              <strong>Remaining Balance:</strong> ₱{data.remaining_balance}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
}
