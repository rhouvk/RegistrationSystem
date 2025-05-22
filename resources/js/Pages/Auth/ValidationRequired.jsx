import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ValidationRequired() {
    return (
        <AuthenticatedLayout>
            <Head title="Account Validation Required" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-4">Account Validation Required</h2>
                            <p className="mb-4">Your account needs to be validated before you can access the system. Please prepare the following documents:</p>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Basic Requirements:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Barangay Certificate</li>
                                    <li>Birth Certificate or Any Valid ID</li>
                                </ul>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-2">For Apparent Disabilities</h3>
                                    <p className="text-gray-600 text-sm mb-2">(Disabilities that are visible or easily noticeable)</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Certificate of Disability<br/>
                                            <span className="text-sm text-gray-600">(Duly signed by a Registered Social Worker with License Number)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-2">For Non-Apparent Disabilities</h3>
                                    <p className="text-gray-600 text-sm mb-2">(Disabilities that are not immediately visible and require medical diagnosis)</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Medical Certificate<br/>
                                            <span className="text-sm text-gray-600">(Duly signed by a Medical Doctor with License Number)</span>
                                        </li>
                                        <li>Certificate of Disability<br/>
                                            <span className="text-sm text-gray-600">(Duly signed by a Medical Doctor with License Number)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800">
                                    Please submit these documents to your local PDAO office for validation. Once validated, you will be able to access the system.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 