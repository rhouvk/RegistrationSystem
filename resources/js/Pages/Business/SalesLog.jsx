import React, { useState, useMemo } from 'react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import DownloadSalesLogPDF from '@/Components/DownloadSalesLogPDF';
import DownloadSalesLogCSV from '@/Components/DownloadSalesLogCSV';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';

export default function SalesLog() {
    const { salesLog = [], auth } = usePage().props;
    const [search, setSearch] = useState('');
    const perPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const filteredSalesLog = useMemo(() => {
        if (!search.trim()) return salesLog;
        const term = search.toLowerCase();
        return salesLog.filter(sale => {
            const date = sale.date_of_sale ? new Date(sale.date_of_sale).toLocaleDateString() : '';
            const purchaser = String(sale.purchased_by || '').toLowerCase();
            const item = String(sale.item_name || '').toLowerCase();
            return (
                date.includes(term) ||
                purchaser.includes(term) ||
                item.includes(term)
            );
        });
    }, [search, salesLog]);

    const paginatedSalesLog = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredSalesLog.slice(start, start + perPage);
    }, [filteredSalesLog, currentPage]);

    const totalPages = Math.ceil(filteredSalesLog.length / perPage);

    return (
        <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Sales Log</h2>}>
            <Head title="Sales Log" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex gap-2">
                            <DownloadSalesLogPDF data={filteredSalesLog} storeName={auth?.user?.name || 'My Store'} />
                            <DownloadSalesLogCSV data={filteredSalesLog} />
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
                                {paginatedSalesLog.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : paginatedSalesLog.map((sale, idx) => (
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
                        {paginatedSalesLog.length === 0 ? (
                            <p className="text-center text-sm text-gray-500">No records found.</p>
                        ) : paginatedSalesLog.map((sale, idx) => (
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
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
