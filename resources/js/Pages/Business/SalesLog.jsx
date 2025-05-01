// resources/js/Pages/Business/SalesLog.jsx

import React, { useState, useMemo } from 'react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import { Head, usePage } from '@inertiajs/react';

export default function SalesLog() {
  const { salesLog = [] } = usePage().props;
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');

  const toggle = (idx) =>
    setExpanded((e) => ({ ...e, [idx]: !e[idx] }));

  // filter by date, purchaser or item (case-insensitive)
  const filtered = useMemo(() => {
    if (!search.trim()) return salesLog;
    const term = search.toLowerCase();
    return salesLog.filter((s) => {
      const date      = new Date(s.date_of_sale).toLocaleDateString();
      const purchaser = String(s.purchased_by || '').toLowerCase();
      const item      = String(s.item_name    || '').toLowerCase();
      return (
        date.includes(term) ||
        purchaser.includes(term) ||
        item.includes(term)
      );
    });
  }, [search, salesLog]);

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Sales Log</h2>}>
      <Head title="Sales Log" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

          {/* Search box */}
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search by date, purchaser or item…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date of Sale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Purchased By
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Signature
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No sales records available.
                    </td>
                  </tr>
                ) : (
                  filtered.map((sale, idx) => {
                    const isOpen = expanded[idx];
                    return (
                      <React.Fragment key={idx}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer sm:cursor-default"
                          onClick={() => toggle(idx)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(sale.date_of_sale).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {sale.purchased_by}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ₱{sale.total_amount.toFixed(2)}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {sale.item_name}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                            {sale.quantity}
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {sale.signature || '—'}
                          </td>
                        </tr>
                        {/* Mobile-only detail row */}
                        <tr className={`${isOpen ? '' : 'hidden'} sm:hidden`}>
                          <td colSpan={6} className="px-6 py-4 text-sm text-gray-700 space-y-1">
                            <div><strong>Item Name:</strong> {sale.item_name}</div>
                            <div><strong>Quantity:</strong> {sale.quantity}</div>
                            <div><strong>Signature:</strong> {sale.signature || '—'}</div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}
