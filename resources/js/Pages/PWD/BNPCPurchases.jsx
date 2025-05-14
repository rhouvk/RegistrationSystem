// resources/js/Pages/PWD/BNPCPurchases.jsx

import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

const ITEMS_PER_PAGE = 12;

export default function BNPCPurchases() {
    const { bnpcEntries = [] } = usePage().props;
    const [expandedRow, setExpandedRow] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredEntries = useMemo(() => {
        if (!search.trim()) return bnpcEntries;
        const term = search.toLowerCase();
        return bnpcEntries.filter((e) =>
            e.item_name.toLowerCase().includes(term) ||
            e.store.toLowerCase().includes(term) ||
            new Date(e.date_of_purchase).toLocaleDateString().includes(term)
        );
    }, [bnpcEntries, search]);

    const paginatedEntries = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredEntries.slice(startIndex, endIndex);
    }, [filteredEntries, currentPage]);

    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setExpandedRow(null); // Collapse any expanded rows on page change
    };

    return (
        <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">BNPC Purchases</h2>}>
            <Head title="BNPC Purchases" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

                    {/* Search */}
                    <div className="flex justify-end mb-4 px-4 sm:px-0">
                        <input
                            type="text"
                            placeholder="Search by item, store or date…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Table for Desktop */}
                    <div className="hidden sm:block bg-white shadow overflow-x-auto sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date of Purchase</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Remaining Balance</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Discounted Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Store / Establishment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Signature</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedEntries.length === 0 && filteredEntries.length > 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            No BNPC purchase records found matching your search.
                                        </td>
                                    </tr>
                                ) : paginatedEntries.length === 0 && filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            No BNPC purchase records available.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEntries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {new Date(entry.date_of_purchase).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                                                {typeof entry.total_amount === 'number' ? `₱${entry.total_amount.toFixed(2)}` : '₱0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">
                                                {typeof entry.remaining_balance === 'number' ? `₱${entry.remaining_balance.toFixed(2)}` : '₱0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-teal-600">
                                                {typeof entry.total_amount === 'number' ? `₱${(entry.total_amount * 0.95).toFixed(2)}` : '₱0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{entry.item_name}</td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-700">{entry.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{entry.store}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {entry.signature ? (
                                                    <img
                                                        src={entry.signature}
                                                        alt="Signature"
                                                        className="h-10 max-w-[150px] border rounded"
                                                    />
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="sm:hidden space-y-2 px-4">
                        {paginatedEntries.length === 0 && filteredEntries.length > 0 ? (
                            <div className="px-4 py-2 text-center text-gray-500 bg-white shadow rounded-md">
                                No BNPC purchase records found matching your search.
                            </div>
                        ) : paginatedEntries.length === 0 && filteredEntries.length === 0 ? (
                            <div className="px-4 py-2 text-center text-gray-500 bg-white shadow rounded-md">
                                No BNPC purchase records available.
                            </div>
                        ) : (
                            paginatedEntries.map((entry) => (
                                <div key={entry.id} className="bg-white shadow rounded-md mb-2">
                                    <button
                                        onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)} // Use entry.id for comparison
                                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-md"
                                    >
                                        <span>{new Date(entry.date_of_purchase).toLocaleDateString()} - ₱{typeof entry.total_amount === 'number' ? entry.total_amount.toFixed(2) : '0.00'}</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform ${expandedRow === entry.id ? 'rotate-180' : ''}`} // Use entry.id for comparison
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {expandedRow === entry.id && ( // Use entry.id for comparison
                                        <div className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200">
                                            <div className="mb-1"><strong>Item Name:</strong> {entry.item_name}</div>
                                            <div className="mb-1"><strong>Quantity:</strong> {entry.quantity}</div>
                                            <div className="mb-1"><strong>Store:</strong> {entry.store}</div>
                                            <div className="mb-1"><strong>Total Amount:</strong> ₱{typeof entry.total_amount === 'number' ? entry.total_amount.toFixed(2) : '0.00'}</div>
                                            <div className="mb-1"><strong>Remaining Balance:</strong> ₱{typeof entry.remaining_balance === 'number' ? entry.remaining_balance.toFixed(2) : '₱0.00'}</div>
                                            <div className="mb-1"><strong>Discounted Price:</strong> <span className="text-teal-600">₱{typeof entry.total_amount === 'number' ? (entry.total_amount * 0.95).toFixed(2) : '₱0.00'}</span></div>
                                            <div><strong>Signature:</strong> {entry.signature ? (
                                                <img
                                                    src={entry.signature}
                                                    alt="Signature"
                                                    className="h-10 max-w-[150px] border rounded mt-1"
                                                />
                                            ) : '—'}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredEntries.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-center mt-4 px-4 sm:px-0">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`mx-1 px-3 py-1 rounded-md text-sm focus:outline-none ${
                                        currentPage === page
                                            ? 'bg-teal-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PWDLayout>
    );
}