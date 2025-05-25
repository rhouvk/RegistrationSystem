import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { FaCheck, FaFilePdf } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';
import PdfViewerModal from '@/Components/PdfViewerModal';

export default function PendingValidations({ pendingValidations, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [entriesPerPage, setEntriesPerPage] = useState(filters.perPage || 10);
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(
            route('admin.validations.index'),
            { search: val, perPage: entriesPerPage, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const val = parseInt(e.target.value);
        setEntriesPerPage(val);
        router.get(
            route('admin.validations.index'),
            { search, perPage: val, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleRoleFilterChange = (e) => {
        const val = e.target.value;
        setRoleFilter(val);
        router.get(
            route('admin.validations.index'),
            { search, perPage: entriesPerPage, role: val },
            { preserveState: true, replace: true }
        );
    };

    const handleApprove = (id) => {
        if (confirm('Are you sure you want to approve this user?')) {
            router.post(route('admin.validations.approve', id));
        }
    };

    const handleViewDocument = (documentPath) => {
        if (documentPath) {
            setSelectedDocument(documentPath);
        }
    };

    return (
        <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">Pending Validations</h2>}>
            <Head title="Pending Validations" />
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
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-center">Document</th>
                                    <th className="px-6 py-3 text-xs uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingValidations.data.length > 0 ? pendingValidations.data.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {user.role === 2 ? 'Business' : 'Pharmacy'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{user.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {user.establishment?.representative_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {user.establishment?.location}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.establishment?.document_path ? (
                                                <button
                                                    onClick={() => handleViewDocument(user.establishment.document_path)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="View Document"
                                                >
                                                    <FaFilePdf size={18} />
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">No document</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleApprove(user.id)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Approve"
                                            >
                                                <FaCheck size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            No pending validations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pendingValidations.last_page > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button
                                onClick={() => router.get(pendingValidations.first_page_url)}
                                disabled={!pendingValidations.prev_page_url}
                                className={`px-3 py-1 rounded ${!pendingValidations.prev_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                First
                            </button>
                            <button
                                onClick={() => router.get(pendingValidations.prev_page_url)}
                                disabled={!pendingValidations.prev_page_url}
                                className={`px-3 py-1 rounded ${!pendingValidations.prev_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Prev
                            </button>

                            <span className="px-3 py-1 bg-gray-100 rounded">
                                Page {pendingValidations.current_page} of {pendingValidations.last_page}
                            </span>

                            <button
                                onClick={() => router.get(pendingValidations.next_page_url)}
                                disabled={!pendingValidations.next_page_url}
                                className={`px-3 py-1 rounded ${!pendingValidations.next_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Next
                            </button>
                            <button
                                onClick={() => router.get(pendingValidations.last_page_url)}
                                disabled={!pendingValidations.next_page_url}
                                className={`px-3 py-1 rounded ${!pendingValidations.next_page_url
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-sky-700 text-white hover:bg-sky-800'}`}
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Viewer Modal */}
            <PdfViewerModal
                isOpen={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                documentPath={selectedDocument}
            />
        </AdminLayout>
    );
} 