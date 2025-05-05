// File: resources/js/Pages/Business/SalesLog.jsx

import React, { useState, useMemo } from 'react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import { Head, usePage } from '@inertiajs/react';

export default function SalesLog() {
  const { salesLog = [] } = usePage().props;
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const toggle = (idx) => setExpanded((e) => ({ ...e, [idx]: !e[idx] }));

  const filtered = useMemo(() => {
    if (!search.trim()) return salesLog;
    const term = search.toLowerCase();
    return salesLog.filter((s) => {
      const date = s.date_of_sale ? new Date(s.date_of_sale).toLocaleDateString() : '';
      const purchaser = String(s.purchased_by || '').toLowerCase();
      const item = String(s.item_name || '').toLowerCase();
      return (
        date.includes(term) ||
        purchaser.includes(term) ||
        item.includes(term)
      );
    });
  }, [search, salesLog]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  const totalPages = Math.ceil(filtered.length / perPage);

  if (!Array.isArray(salesLog)) return null;

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Sales Log</h2>}>
      <Head title="Sales Log" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

          {/* Search and PerPage Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <select
              className="w-28 border border-gray-300 rounded px-2 py-1 text-sm"
              value={perPage}
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
              <option value={100}>Show 100</option>
            </select>
          </div>

          {/* Card Layout on Mobile, Table on Desktop */}
          <div className="space-y-3 sm:space-y-0 sm:bg-white sm:shadow sm:overflow-hidden sm:rounded-lg">
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-white">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Purchased By</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Signature</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginated.map((sale, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {sale.date_of_sale ? new Date(sale.date_of_sale).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{sale.purchased_by}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-800 font-medium">
                        {typeof sale.total_amount === 'number' ? `₱${sale.total_amount.toFixed(2)}` : '₱0.00'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 truncate max-w-xs" title={sale.item_name}>
                        {sale.item_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-700">{sale.quantity}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {sale.signature ? (
                          <img src={sale.signature} alt="Signature" className="h-10 max-w-[150px] border rounded" />
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Version */}
            <div className="sm:hidden space-y-2">
              {paginated.map((sale, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-gray-700"><strong>Date:</strong> {sale.date_of_sale ? new Date(sale.date_of_sale).toLocaleDateString() : '—'}</p>
                  <p className="text-sm text-gray-700"><strong>Purchased By:</strong> {sale.purchased_by}</p>
                  <p className="text-sm text-gray-700"><strong>Total:</strong> ₱{typeof sale.total_amount === 'number' ? sale.total_amount.toFixed(2) : '0.00'}</p>
                  <p className="text-sm text-gray-700"><strong>Item:</strong> {sale.item_name}</p>
                  <p className="text-sm text-gray-700"><strong>Quantity:</strong> {sale.quantity}</p>
                  <p className="text-sm text-gray-700"><strong>Signature:</strong>{' '}
                    {sale.signature ? <img src={sale.signature} alt="Signature" className="h-10 mt-1 rounded border" /> : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${page === currentPage ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </BusinessLayout>
  );
}
