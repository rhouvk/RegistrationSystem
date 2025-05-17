import React, { useState } from 'react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import DownloadSalesLogPDF from '@/Components/DownloadSalesLogPDF';
import DownloadSalesLogCSV from '@/Components/DownloadSalesLogCSV';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';

export default function SalesLog({ salesLog, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage, setEntriesPerPage] = useState(filters.perPage || 10);
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(route('business.sales-log'), { search: val, perPage: entriesPerPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value);
        setEntriesPerPage(val);
        router.get(route('business.sales-log'), { search, perPage: val }, { preserveState: true, replace: true });
    };

    const changePage = (page) => {
        router.get(route('business.sales-log'), { search, perPage: entriesPerPage, page }, { preserveState: true, replace: true });
    };

    return (
        <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Sales Log</h2>}>
            <Head title="Sales Log" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by PWD number or item..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <select
                                value={entriesPerPage}
                                onChange={handlePerPageChange}
                                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value={10}>10 entries</option>
                                <option value={100}>100 entries</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <DownloadSalesLogPDF data={salesLog.data} storeName={auth?.user?.name || 'My Store'} />
                            <DownloadSalesLogCSV data={salesLog.data} />
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block bg-white shadow overflow-hidden rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-white">
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Purchased By</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Discount</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Discounted Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Signature</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {salesLog.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : salesLog.data.map((sale, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {sale.date_of_sale ? new Date(sale.date_of_sale).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">{sale.purchased_by}</td>
                                        <td className="px-4 py-4 text-sm text-right text-gray-800 font-medium">
                                            ₱{typeof sale.total_amount === 'number' ? sale.total_amount.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-right text-gray-700 font-semibold">
                                            ₱{typeof sale.discounted_amount === 'number' ? sale.discounted_amount.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-right text-teal-700 font-semibold">
                                            ₱{typeof sale.amount_after_discount === 'number' ? sale.amount_after_discount.toFixed(2) : '0.00'}
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
                                        <td className="px-4 py-4 text-center">
                                            <Link href={route('business.bnpc-transactions.edit', sale.id)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                                                <FaEdit />
                                                <span>Edit</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-4">
                        {salesLog.data.length === 0 ? (
                            <p className="text-center text-sm text-gray-500">No records found.</p>
                        ) : salesLog.data.map((sale, idx) => (
                            <div key={idx} className="border rounded-lg bg-white shadow-sm">
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{sale.purchased_by}</p>
                                        <p className="text-xs text-gray-500">
                                            {sale.date_of_sale ? new Date(sale.date_of_sale).toLocaleDateString() : '—'} - {sale.item_name}
                                        </p>
                                    </div>
                                    <button onClick={() => toggleExpand(idx)} className="focus:outline-none">
                                        {expandedItems[idx] ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                </div>
                                {expandedItems[idx] && (
                                    <div className="px-4 pb-4 space-y-1">
                                        <p className="text-sm text-gray-700"><strong>Total:</strong> ₱{typeof sale.total_amount === 'number' ? sale.total_amount.toFixed(2) : '0.00'}</p>
                                        <p className="text-sm text-gray-700"><strong>Discount:</strong> ₱{typeof sale.discounted_amount === 'number' ? sale.discounted_amount.toFixed(2) : '0.00'}</p>
                                        <p className="text-sm text-gray-700"><strong>Discounted Price:</strong> ₱{typeof sale.amount_after_discount === 'number' ? sale.amount_after_discount.toFixed(2) : '0.00'}</p>
                                        <p className="text-sm text-gray-700"><strong>Quantity:</strong> {sale.quantity}</p>
                                        <p className="text-sm text-gray-700"><strong>Signature:</strong>{' '}
                                            {sale.signature ? <img src={sale.signature} alt="Signature" className="h-10 mt-1 rounded border" /> : '—'}
                                        </p>
                                        <div className="flex justify-end">
                                            <Link href={route('business.bnpc-transactions.edit', sale.id)} className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                                                <FaEdit />
                                                <span>Edit</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {salesLog.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button 
                                onClick={() => changePage(1)} 
                                disabled={salesLog.current_page === 1}
                                className={`px-3 py-1 rounded ${salesLog.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                First
                            </button>
                            <button 
                                onClick={() => changePage(salesLog.current_page - 1)} 
                                disabled={salesLog.current_page === 1}
                                className={`px-3 py-1 rounded ${salesLog.current_page === 1 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Prev
                            </button>
                            
                            <div className="flex items-center gap-1">
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    Page {salesLog.current_page} of {salesLog.last_page}
                                </span>
                            </div>

                            <button 
                                onClick={() => changePage(salesLog.current_page + 1)} 
                                disabled={salesLog.current_page === salesLog.last_page}
                                className={`px-3 py-1 rounded ${salesLog.current_page === salesLog.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Next
                            </button>
                            <button 
                                onClick={() => changePage(salesLog.last_page)} 
                                disabled={salesLog.current_page === salesLog.last_page}
                                className={`px-3 py-1 rounded ${salesLog.current_page === salesLog.last_page 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </BusinessLayout>
    );
}
