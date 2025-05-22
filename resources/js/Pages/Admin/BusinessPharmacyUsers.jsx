import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { FaEdit } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';

export default function BusinessPharmacyUsers({ businesses, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage, setEntriesPerPage] = useState(filters.perPage || 10);
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(
            route('admin.business-pharmacy.index'),
            { search: val, perPage: entriesPerPage, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value);
        setEntriesPerPage(val);
        router.get(
            route('admin.business-pharmacy.index'),
            { search, perPage: val, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleRoleFilterChange = (e) => {
        const val = e.target.value;
        setRoleFilter(val);
        router.get(
            route('admin.business-pharmacy.index'),
            { search, perPage: entriesPerPage, role: val },
            { preserveState: true, replace: true }
        );
    };

    const navigateToEdit = (business) => {
        router.get(route('admin.business-pharmacy.edit', business.id));
    };

    return (
        <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">Business & Pharmacy Users</h2>}>
            <Head title="Business & Pharmacy Users" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full sm:w-1/3 px-4 py-2 border rounded"
                        />
                        <select
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                            className="w-full sm:w-auto px-4 py-2 border rounded"
                        >
                            <option value="">All Types</option>
                            <option value="2">Business</option>
                            <option value="3">Pharmacy</option>
                        </select>
                        <select
                            value={entriesPerPage}
                            onChange={handlePerPageChange}
                            className="w-full sm:w-auto px-4 py-2 border rounded"
                        >
                            <option value={10}>10 entries</option>
                            <option value={25}>25 entries</option>
                            <option value={50}>50 entries</option>
                            <option value={100}>100 entries</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white overflow-auto shadow sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Name</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Type</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Email</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Phone</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Representative</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-left">Location</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {businesses.data.length > 0 ? businesses.data.map(business => (
                                    <tr key={business.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{business.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {business.role === 2 ? 'Business' : 'Pharmacy'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{business.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{business.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {business.establishment?.representative_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {business.establishment?.location}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => navigateToEdit(business)}
                                                className="text-sky-700 hover:text-sky-900"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No businesses or pharmacies found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {businesses.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button
                                onClick={() => router.get(businesses.first_page_url)}
                                disabled={!businesses.prev_page_url}
                                className={`px-3 py-1 rounded ${!businesses.prev_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                First
                            </button>
                            <button
                                onClick={() => router.get(businesses.prev_page_url)}
                                disabled={!businesses.prev_page_url}
                                className={`px-3 py-1 rounded ${!businesses.prev_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Prev
                            </button>

                            <span className="px-3 py-1 bg-gray-100 rounded">
                                Page {businesses.current_page} of {businesses.last_page}
                            </span>

                            <button
                                onClick={() => router.get(businesses.next_page_url)}
                                disabled={!businesses.next_page_url}
                                className={`px-3 py-1 rounded ${!businesses.next_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Next
                            </button>
                            <button
                                onClick={() => router.get(businesses.last_page_url)}
                                disabled={!businesses.next_page_url}
                                className={`px-3 py-1 rounded ${!businesses.next_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 