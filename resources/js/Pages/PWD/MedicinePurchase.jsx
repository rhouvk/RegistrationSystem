import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

export default function MedicinePurchase() {
  const { mpEntries = [] } = usePage().props;
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return mpEntries;
    const term = search.toLowerCase();
    return mpEntries.filter((e) =>
      e.medicine_purchase.toLowerCase().includes(term) ||
      e.physician_name.toLowerCase().includes(term) ||
      new Date(e.date).toLocaleDateString().includes(term)
    );
  }, [mpEntries, search]);

  return (
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Medicine Purchases</h2>}>
      <Head title="Medicine Purchases" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">
          {/* Search */}
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search by medicine, doctor, or date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Prescribed</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Physician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">PTR No.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No medicine purchase records available.
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry, idx) => {
                    const isExpanded = expandedRow === idx;
                    return (
                      <React.Fragment key={idx}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setExpandedRow(isExpanded ? null : idx)}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {entry.medicine_purchase}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {entry.quantity_prescribed}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {entry.latest_status === 1
                            ? 'First Filling'
                            : entry.latest_status === 2
                            ? 'Second Filling'
                            : entry.latest_status === 3
                            ? 'Third Filling'
                            : 'Unknown'}
                        </td>

                          <td className="px-6 py-4 text-center text-sm text-gray-800">
                            {entry.balance}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.physician_name}
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.physician_address}
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.physician_ptr_no}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 bg-gray-50">
                              <strong>Transaction History:</strong>
                              <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc list-inside">
                                {entry.history?.map((h, i) => (
                                  <li key={i}>
                                    {new Date(h.created_at).toLocaleDateString()} – {h.filling_status_label} – {h.filling_amount} filled at {h.drugstore_name} by {h.pharmacist_name}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PWDLayout>
  );
}
