// resources/js/Pages/PWD/BNPCPurchases.jsx

import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

export default function BNPCPurchases({ bnpcEntries, filters }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage] = useState(10);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(route('pwd.bnpc-purchases.index'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
    };

    const changePage = (page) => {
        router.get(route('pwd.bnpc-purchases.index'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
    };

    return (
        <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">BNPC Purchases</h2>}>
            <Head title="BNPC Purchases" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">
                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row justify-between mb-4 px-4 sm:px-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by item, store or date…"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
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
                                {bnpcEntries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            No BNPC purchase records available.
                                        </td>
                                    </tr>
                                ) : (
                                    bnpcEntries.data.map((entry) => (
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
                        {bnpcEntries.data.length === 0 ? (
                            <div className="px-4 py-2 text-center text-gray-500 bg-white shadow rounded-md">
                                No BNPC purchase records available.
                            </div>
                        ) : (
                            bnpcEntries.data.map((entry) => (
                                <div key={entry.id} className="bg-white shadow rounded-md mb-2">
                                    <button
                                        onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-md"
                                    >
                                        <span>{new Date(entry.date_of_purchase).toLocaleDateString()} - ₱{typeof entry.total_amount === 'number' ? entry.total_amount.toFixed(2) : '0.00'}</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform ${expandedRow === entry.id ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {expandedRow === entry.id && (
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
                    {bnpcEntries.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button 
                                onClick={() => changePage(1)} 
                                disabled={bnpcEntries.current_page === 1}
                                className={`px-3 py-1 rounded ${bnpcEntries.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                First
                            </button>
                            <button 
                                onClick={() => changePage(bnpcEntries.current_page - 1)} 
                                disabled={bnpcEntries.current_page === 1}
                                className={`px-3 py-1 rounded ${bnpcEntries.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Prev
                            </button>
                            
                            <div className="flex items-center gap-1">
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    Page {bnpcEntries.current_page} of {bnpcEntries.last_page}
                                </span>
                            </div>

                            <button 
                                onClick={() => changePage(bnpcEntries.current_page + 1)} 
                                disabled={bnpcEntries.current_page === bnpcEntries.last_page}
                                className={`px-3 py-1 rounded ${bnpcEntries.current_page === bnpcEntries.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Next
                            </button>
                            <button 
                                onClick={() => changePage(bnpcEntries.last_page)} 
                                disabled={bnpcEntries.current_page === bnpcEntries.last_page}
                                className={`px-3 py-1 rounded ${bnpcEntries.current_page === bnpcEntries.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PWDLayout>
    );
}