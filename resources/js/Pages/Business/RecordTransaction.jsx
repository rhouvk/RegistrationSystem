// File: resources/js/Pages/Business/RecordTransaction.jsx

import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import LineItemSection from '@/Components/LineItemSection';
import SignatureUpload from '@/Components/SignatureUpload';
import ConfirmBNPCModal from '@/Components/ConfirmBNPCModal';
import Scanner from '@/Components/Scanner';
import { FaUserCircle, FaMoneyBillWave, FaExclamationTriangle, FaSearch, FaIdCard } from 'react-icons/fa';


export default function RecordTransaction() {
  const {
    bnpcItems = [],
    purchaseLimit = 0,
    usedSoFar = 0,
    remainingBalance: initialBalance = 0,
    pwdUser = null,
    flash = {},
    errors = {},
  } = usePage().props;

  const [lookupNumber, setLookupNumber] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [signatureError, setSignatureError] = useState('');

  const { data, setData, post, processing } = useForm({
    date_of_purchase: new Date().toISOString().substr(0, 10),
    pwd_number: '',
    items: [{ bnpc_item_id: '', quantity: '', line_total: '' }],
    total_amount: 0,
    remaining_balance: initialBalance.toFixed(2),
    signature: null,
  });

  const [lineBalances, setLineBalances] = useState([]);
  const total = parseFloat(data.total_amount);
  const balance = parseFloat(data.remaining_balance);

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

  useEffect(() => {
    if (pwdUser?.pwdNumber) {
      setData('pwd_number', pwdUser.pwdNumber);
    }
  }, [pwdUser]);

  const handleLookup = (e) => {
    e.preventDefault();
    router.visit(route('business.bnpc-transactions.create'), {
      data: { pwd_number: lookupNumber },
      preserveState: true,
      preserveScroll: false,
    });
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    post(route('business.bnpc-transactions.store'));
  };

  const reloadPage = () => window.location.reload();

  if (!pwdUser) {
    return (
      <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Record a Transaction</h2>}>
        <Head title="Lookup PWD" />
        <div className="py-12">
          <div className="mx-auto max-w-md bg-white p-6 shadow sm:rounded-lg space-y-4">
            {flash.lookup_error && (
              <div className="p-3 bg-red-100 border border-red-300 text-sm text-red-700 rounded">
                {flash.lookup_error}
              </div>
            )}

        <form onSubmit={handleLookup} className="space-y-4">
          <label htmlFor="pwd_lookup" className="block text-sm font-medium text-gray-700">
            Enter PWD Number
          </label>

          {/* Gradient border wrapper */}
          <div className="p-[2px] rounded-md bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500">
          <input
            id="pwd_lookup"
            type="text"
            value={lookupNumber}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, '').slice(0, 16); // allow only numbers up to 17 digits

              // Apply formatting: 2-4-4-7
              const parts = [];
              if (raw.length > 0) parts.push(raw.slice(0, 2));
              if (raw.length > 2) parts.push(raw.slice(2, 6));
              if (raw.length > 6) parts.push(raw.slice(6, 9));
              if (raw.length > 9) parts.push(raw.slice(9, 16));

              const formatted = parts.join('-'); // NOTE: that's a real U+2011 character

              setLookupNumber(formatted);
            }}
            placeholder="02-1234-567-8901234"
            className="w-full rounded-md px-3 py-2 border-none focus:outline-none"
          />
        </div>


          {errors.pwd_number && (
            <p className="text-sm text-red-500">{errors.pwd_number}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-1">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
            >
              <FaSearch /> Lookup
            </button>
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              <FaIdCard /> Scan Card
            </button>
          </div>
        </form>

            {showScanner && (
              <div className="fixed inset-0  bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative">
                  <Scanner
                    onUserFound={(user) => {
                      setShowScanner(false);
                      if (user?.pwdNumber) {
                        router.visit(route('business.bnpc-transactions.create'), {
                          data: { pwd_number: user.pwdNumber },
                          preserveState: true,
                          preserveScroll: false,
                        });
                      }
                    }}
                  />
                  <button
                    onClick={reloadPage}
                    className="mt-4 mx-auto block max-w-md w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Record a Transaction</h2>}>
      <Head title="Record a Transaction" />

      <div className="py-12 space-y-6">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
        <div className="bg-white  sm:rounded-2xl p-6 space-y-6 border border-gray-200">
  {/* PWD Header */}
  <div className="flex items-center gap-4">
  <div className="p-1 rounded-full bg-gradient-to-br from-teal-500 via-cyan-700 to-sky-500">
  <img
    src={pwdUser.photo ? `/storage/${pwdUser.photo}` : "/images/person.png"}
    alt="PWD Photo"
    className="w-16 h-16 rounded-full object-cover border-2 border-white"
  />
</div>
    <div>
      <p className="text-gray-700 text-sm font-semibold">PWD ID:</p>
      <p className="text-lg font-bold text-gray-900">{pwdUser.pwdNumber}</p>
    </div>
  </div>

  {/* Financial Overview */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-100">
    <div className="flex items-center gap-2">
      <FaMoneyBillWave className="text-teal-500 text-xl" />
      <p className="text-sm text-gray-700">
        <strong>Weekly Cap:</strong> ₱{Number(purchaseLimit).toFixed(2)}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <FaMoneyBillWave className="text-cyan-500 text-xl" />
      <p className="text-sm text-gray-700">
        <strong>Remaining Before:</strong> ₱{Number(initialBalance).toFixed(2)}
      </p>
    </div>
  </div>

  {/* Warnings */}
  {(balance <= 0 || total > balance) && (
    <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-100 text-yellow-800 text-sm rounded border border-yellow-300">
      <FaExclamationTriangle className="text-lg" />
      {balance <= 0
        ? 'This PWD has no remaining balance for the week.'
        : `Total purchase (₱${total.toFixed(2)}) exceeds remaining balance (₱${balance.toFixed(2)}).`}
    </div>
  )}

  {total === 0 && (
    <div className="flex items-center gap-2 mt-2 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-300">
      <FaExclamationTriangle className="text-lg" />
      Please add at least one valid item with a non-zero amount.
    </div>
  )}
</div>
        </div>

        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!data.signature) {
                setSignatureError('Signature is required before submission.');
                return;
              }
              setSignatureError('');
              setShowConfirm(true);
            }}
            className="space-y-6 bg-white p-6 shadow sm:rounded-lg"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="date_of_purchase">Date of Purchase</label>
              <input
                type="date"
                id="date_of_purchase"
                value={data.date_of_purchase}
                onChange={e => setData('date_of_purchase', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="pwd_number">Purchased By (PWD Number)</label>
              <input
                type="text"
                id="pwd_number"
                value={pwdUser.pwdNumber}
                disabled
                className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md"
              />
            </div>

            <LineItemSection
              data={data}
              setData={setData}
              bnpcItems={bnpcItems}
              errors={errors}
              lineBalances={lineBalances}
            />

            <SignatureUpload
              value={null}
              onChange={(file) => setData('signature', file)}
            />
            <p className="text-sm text-red-500">{errors.signature || signatureError}</p>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || total <= 0 || total > balance}
                className="px-6 py-3 text-sm font-semibold bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {processing ? 'Saving…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmBNPCModal
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmSubmit}
        processing={processing}
        totalAmount={data.total_amount}
        remainingBalance={data.remaining_balance}
      />

      {/* Responsive Back Button for Mobile */}
<div className="block sm:hidden mt-4 px-6">
  <button
    onClick={() => window.history.back()}
    className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium"
  >
    ← Back
  </button>
</div>
    </BusinessLayout>
  );

  
}
