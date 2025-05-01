// resources/js/Pages/PWD/BNPCPurchases.jsx

import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

export default function BNPCPurchases() {
  const { bnpcEntries = [] } = usePage().props;
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState('');

  // memoize filtered results
  const filtered = useMemo(() => {
    if (!search.trim()) return bnpcEntries;
    const term = search.toLowerCase();
    return bnpcEntries.filter((e) =>
      e.item_name.toLowerCase().includes(term) ||
      e.store.toLowerCase().includes(term) ||
      new Date(e.date_of_purchase).toLocaleDateString().includes(term)
    );
  }, [bnpcEntries, search]);

  return (
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">BNPC Purchases</h2>}>
      <Head title="BNPC Purchases" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

          {/* Search */}
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search by item, store or date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date of Purchase
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Remaining Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                    Store / Establishment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                    Signature
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No BNPC purchase records available.
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
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {new Date(entry.date_of_purchase).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                            ₱{entry.total_amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                            ₱{entry.remaining_balance.toFixed(2)}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.item_name}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 text-center text-sm text-gray-700">
                            {entry.quantity}
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.store}
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-700">
                            {entry.signature || '—'}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="sm:hidden">
                            <td
                              colSpan={3}
                              className="px-6 pb-4 pt-1 text-sm text-gray-700 bg-gray-50 rounded-b-lg"
                            >
                              <div className="space-y-1">
                                <div><strong>Item Name:</strong> {entry.item_name}</div>
                                <div><strong>Quantity:</strong> {entry.quantity}</div>
                                <div><strong>Store:</strong> {entry.store}</div>
                                <div><strong>Signature:</strong> {entry.signature || '—'}</div>
                              </div>
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
