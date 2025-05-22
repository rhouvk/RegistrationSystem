import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import PWDLayout from '@/Layouts/PWDLayout';

export default function MedicinePurchase({ mpEntries, filters }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage] = useState(10);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(route('pwd.medicine-purchases.index'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
    };

    const changePage = (page) => {
        router.get(route('pwd.medicine-purchases.index'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
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
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-4">
                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row justify-between">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by medicine, doctor, or date…"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
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
                                {mpEntries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No medicine purchase records available.
                                        </td>
                                    </tr>
                                ) : (
                                    mpEntries.data.map((entry, idx) => {
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
                            {mpEntries.data.length === 0 ? (
                                <div className="px-6 py-4 text-center text-gray-500">No medicine purchase records available.</div>
                            ) : (
                                mpEntries.data.map((entry, idx) => {
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
                    {mpEntries.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button 
                                onClick={() => changePage(1)} 
                                disabled={mpEntries.current_page === 1}
                                className={`px-3 py-1 rounded ${mpEntries.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                First
                            </button>
                            <button 
                                onClick={() => changePage(mpEntries.current_page - 1)} 
                                disabled={mpEntries.current_page === 1}
                                className={`px-3 py-1 rounded ${mpEntries.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Prev
                            </button>
                            
                            <div className="flex items-center gap-1">
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    Page {mpEntries.current_page} of {mpEntries.last_page}
                                </span>
                            </div>

                            <button 
                                onClick={() => changePage(mpEntries.current_page + 1)} 
                                disabled={mpEntries.current_page === mpEntries.last_page}
                                className={`px-3 py-1 rounded ${mpEntries.current_page === mpEntries.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Next
                            </button>
                            <button 
                                onClick={() => changePage(mpEntries.last_page)} 
                                disabled={mpEntries.current_page === mpEntries.last_page}
                                className={`px-3 py-1 rounded ${mpEntries.current_page === mpEntries.last_page 
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