import React from 'react';
import Scanner from '@/Components/Scanner';
import { FaSearch, FaIdCard } from 'react-icons/fa';
import { usePage, router } from '@inertiajs/react';

export default function PrescriptionLookup({
  lookupNumber,
  setLookupNumber,
  handleLookup,
  showScanner,
  setShowScanner,
}) {
  const { errors = {} } = usePage().props;

  return (
    <div className="py-12">
<div className="relative max-w-md mx-4 sm:mx-auto bg-white p-6 rounded shadow space-y-4 overflow-hidden">
        <form onSubmit={handleLookup} className="space-y-4 ">

          
          <label htmlFor="pwd_lookup" className="block text-sm font-medium text-gray-700">
            Enter PWD Number to Record a Prescription
          </label>

          {/* Gradient border wrapper */}
          <div className="p-[2px] rounded-md bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500">
            <input
              id="pwd_lookup"
              type="text"
              value={lookupNumber}
              onChange={(e) => {
                let raw = e.target.value.replace(/\D/g, '').slice(0, 16); // allow only numbers up to 16 digits

                // Apply formatting: 2-4-3-7
                const parts = [];
                if (raw.length > 0) parts.push(raw.slice(0, 2));
                if (raw.length > 2) parts.push(raw.slice(2, 6));
                if (raw.length > 6) parts.push(raw.slice(6, 9));
                if (raw.length > 9) parts.push(raw.slice(9, 16));

                const formatted = parts.join('-');
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent">
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
              onClick={() => window.location.reload()}
            >
              Close
            </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
