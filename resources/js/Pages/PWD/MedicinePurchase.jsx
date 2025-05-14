import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

const ITEMS_PER_PAGE = 12;

export default function MedicinePurchase() {
    const { mpEntries = [] } = usePage().props;
    const [expandedRow, setExpandedRow] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredEntries = useMemo(() => {
        if (!search.trim()) return mpEntries;
        const term = search.toLowerCase();
        return mpEntries.filter((e) =>
            e.medicine_purchase.toLowerCase().includes(term) ||
            e.physician_name.toLowerCase().includes(term) ||
            new Date(e.date).toLocaleDateString().includes(term)
        );
    }, [mpEntries, search]);

    const paginatedEntries = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredEntries.slice(startIndex, endIndex);
    }, [filteredEntries, currentPage]);

    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setExpandedRow(null);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 1: return 'First Filling';
            case 2: return 'Second Filling';
            case 3: return 'Final Filling';
            default: return 'Unknown';
        }
    };

    return (
        <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Medicine Purchases</h2>}>
            <Head title="Medicine Purchases" />
            <div className="py-12 px-4 sm:px-6 lg:px-8"> {/* Added left and right padding to the main div */}
                <div className="mx-auto max-w-7xl space-y-4">
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

                    {/* Table Wrapper */}
                    <div className="bg-white rounded shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                            <thead>
                                <tr className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Medicine</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Prescribed</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Physician</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">PTR No.</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No medicine purchase records available.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEntries.map((entry, idx) => {
                                        const isExpanded = expandedRow === idx;
                                        return (
                                            <React.Fragment key={idx}>
                                                <tr
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => setExpandedRow(isExpanded ? null : idx)}
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.medicine_purchase}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{entry.quantity_prescribed}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{getStatusLabel(entry.latest_status)}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-800">{entry.balance}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{entry.physician_name || '—'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{entry.physician_address || '—'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{entry.physician_ptr_no || '—'}</td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                                            <strong>Transaction History:</strong>
                                                            <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc list-inside">
                                                                {entry.history?.length > 0 ? (
                                                                    entry.history.map((h, i) => (
                                                                        <li key={i}>
                                                                            {new Date(h.created_at).toLocaleDateString()} – {getStatusLabel(h.filling_status)} – {h.filling_amount} filled at {h.drugstore_name || '—'} by {h.pharmacist_name || '—'}
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li>No transaction history available.</li>
                                                                )}
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

                        {/* Mobile Version */}
                        <div className="sm:hidden divide-y divide-gray-200">
                            {paginatedEntries.length === 0 ? (
                                <div className="px-6 py-4 text-center text-gray-500">No medicine purchase records available.</div>
                            ) : (
                                paginatedEntries.map((entry, idx) => {
                                    const isExpanded = expandedRow === idx;
                                    return (
                                        <div key={idx} className="p-4" onClick={() => setExpandedRow(isExpanded ? null : idx)}>
                                            <div className="flex justify-between items-center">
                                                <div className="text-base font-semibold text-gray-900">{entry.medicine_purchase}</div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedRow(isExpanded ? null : idx);
                                                    }}
                                                    className="focus:outline-none"
                                                >
                                                    <svg
                                                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-600">Prescribed: {entry.quantity_prescribed}</div>
                                            <div className="text-sm text-gray-600">Status: {getStatusLabel(entry.latest_status)}</div>
                                            <div className="text-sm text-gray-600">Balance: {entry.balance}</div>
                                            <div className="text-sm text-gray-600">Doctor: {entry.physician_name || '—'}</div>
                                            {isExpanded && (
                                                <div className="mt-2 bg-gray-50 p-2 rounded-md text-sm text-gray-700">
                                                    <strong>Transaction History:</strong>
                                                    <ul className="mt-1 space-y-1 list-disc list-inside">
                                                        {entry.history?.length > 0 ? (
                                                            entry.history.map((h, i) => (
                                                                <li key={i}>
                                                                    {new Date(h.created_at).toLocaleDateString()} – {getStatusLabel(h.filling_status)} – {h.filling_amount} filled at {h.drugstore_name || '—'} by {h.pharmacist_name || '—'}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>No history available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {filteredEntries.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-center mt-4">
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