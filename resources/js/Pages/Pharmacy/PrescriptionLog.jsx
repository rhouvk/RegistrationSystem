import React, { useState } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import DownloadPrescriptionLogCSV from '@/Components/DownloadPrescriptionLogCSV';
import DownloadPrescriptionLogPDF from '@/Components/DownloadPrescriptionLogPDF';
import { FaEdit } from 'react-icons/fa';

export default function PrescriptionLog({ prescriptions, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage, setEntriesPerPage] = useState(filters.perPage || 12);
    const [expandedRow, setExpandedRow] = useState(null);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(route('pharmacy.prescriptions.log'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value);
        setEntriesPerPage(val);
        router.get(route('pharmacy.prescriptions.log'), { search, perPage: val }, { preserveState: true, replace: true });
    };

    const changePage = (page) => {
        router.get(route('pharmacy.prescriptions.log'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
    };

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const renderFilingStatus = (status) => {
        let label = '';
        let bg = '';

        switch (status) {
            case 1:
                label = 'First Fill';
                bg = 'bg-teal-500';
                break;
            case 2:
                label = 'Second Fill';
                bg = 'bg-cyan-600';
                break;
            case 3:
                label = 'Final Fill';
                bg = 'bg-sky-700';
                break;
            default:
                label = 'Unknown';
                bg = 'bg-gray-400';
        }

        return (
            <span className={`inline-block px-3 py-0.5 text-xs font-semibold text-white rounded-full ${bg}`}>
                {label}
            </span>
        );
    };

    return (
        <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Prescription Log</h2>}>
            <Head title="Prescription Log" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by PWD number or medicine..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <select
                                value={entriesPerPage}
                                onChange={handlePerPageChange}
                                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value={12}>12 entries</option>
                                <option value={24}>24 entries</option>
                                <option value={100}>100 entries</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <DownloadPrescriptionLogPDF data={prescriptions.data} drugstoreName={auth?.user?.name || 'Your Drugstore'} />
                            <DownloadPrescriptionLogCSV data={prescriptions.data} />
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200 text-sm rounded-t-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">PWD No.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Medicine</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Qty. Prescribed</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Filled</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Balance</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {prescriptions.data.length > 0 ? (
                                    prescriptions.data.map((p, idx) => (
                                        <React.Fragment key={idx}>
                                            <tr
                                                className={`hover:bg-gray-50 transition cursor-pointer ${expandedRow === idx ? 'bg-gray-100' : ''}`}
                                                onClick={() => toggleRow(idx)}
                                            >
                                                <td className="px-4 py-2">{p.date}</td>
                                                <td className="px-4 py-2">{p.pwd_number || '—'}</td>
                                                <td className="px-4 py-2">{p.medicine_purchase}</td>
                                                <td className="px-4 py-2 text-center">{p.quantity_prescribed}</td>
                                                <td className="px-4 py-2 text-center">{p.quantity_filled}</td>
                                                <td className="px-4 py-2 text-center">{p.balance}</td>
                                                <td className="px-4 py-2 text-center">{renderFilingStatus(p.filling_status_label)}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(route('prescriptions.edit', p.id));
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                                    >
                                                        <FaEdit />
                                                        <span>Edit</span>
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedRow === idx && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={8} className="px-4 py-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            <div><strong>Physician:</strong> {p.physician_name || '—'}</div>
                                                            <div><strong>PTR No.:</strong> {p.physician_ptr_no || '—'}</div>
                                                            <div><strong>Pharmacist:</strong> {p.pharmacist_name || '—'}</div>
                                                            <div><strong>Physician Address:</strong> {p.physician_address || '—'}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-4 text-center text-gray-500">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                        {prescriptions.data.length > 0 ? (
                            prescriptions.data.map((p, idx) => (
                                <div key={idx} className={`border border-gray-200 rounded-lg shadow p-4 bg-white ${expandedRow === idx ? 'bg-gray-100' : ''}`}>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => toggleRow(idx)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-lg font-semibold text-gray-900">{p.pwd_number || '—'}</div>
                                            <svg
                                                className={`w-5 h-5 transition-transform ${expandedRow === idx ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {p.date} - {p.medicine_purchase}
                                        </div>
                                        <div className="text-sm text-gray-700">Status: {renderFilingStatus(p.filling_status_label)}</div>
                                    </div>
                                    {expandedRow === idx && (
                                        <div className="mt-4 text-sm text-gray-700 space-y-2">
                                            <div><strong>Quantity Prescribed:</strong> {p.quantity_prescribed}</div>
                                            <div><strong>Filled:</strong> {p.quantity_filled}</div>
                                            <div><strong>Balance:</strong> {p.balance}</div>
                                            <div><strong>Physician:</strong> {p.physician_name || '—'}</div>
                                            <div><strong>PTR No.:</strong> {p.physician_ptr_no || '—'}</div>
                                            <div><strong>Pharmacist:</strong> {p.pharmacist_name || '—'}</div>
                                            <div><strong>Physician Address:</strong> {p.physician_address || '—'}</div>
                                                    <button
                                                         onClick={() => router.get(route('prescriptions.edit', p.id))}
                                                        className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                                    >
                                                        <FaEdit />
                                                        <span>Edit</span>
                                                    </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="border border-gray-200 rounded-lg shadow p-4 bg-white text-center text-gray-500">No records found.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    {prescriptions.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button 
                                onClick={() => changePage(1)} 
                                disabled={prescriptions.current_page === 1}
                                className={`px-3 py-1 rounded ${prescriptions.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                            >
                                First
                            </button>
                            <button 
                                onClick={() => changePage(prescriptions.current_page - 1)} 
                                disabled={prescriptions.current_page === 1}
                                className={`px-3 py-1 rounded ${prescriptions.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                            >
                                Prev
                            </button>
                            
                            <div className="flex items-center gap-1">
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    Page {prescriptions.current_page} of {prescriptions.last_page}
                                </span>
                            </div>

                            <button 
                                onClick={() => changePage(prescriptions.current_page + 1)} 
                                disabled={prescriptions.current_page === prescriptions.last_page}
                                className={`px-3 py-1 rounded ${prescriptions.current_page === prescriptions.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                            >
                                Next
                            </button>
                            <button 
                                onClick={() => changePage(prescriptions.last_page)} 
                                disabled={prescriptions.current_page === prescriptions.last_page}
                                className={`px-3 py-1 rounded ${prescriptions.current_page === prescriptions.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PharmacyLayout>
    );
}