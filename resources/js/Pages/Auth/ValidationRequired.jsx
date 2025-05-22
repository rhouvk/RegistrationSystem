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
                                <h3 className="text-xl font-semibold">Required Documents:</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Barangay Certificate</li>
                                    <li>Birth Certificate or Any Valid ID</li>
                                    
                                    <li className="font-semibold mt-4">If Apparent:</li>
                                    <li>Certificate of Disability (Signed by Social Worker with License Number)</li>
                                    
                                    <li className="font-semibold mt-4">If Non-Apparent:</li>
                                    <li>Medical Certificate (Signed by Medical Doctor with License Number)</li>
                                    <li>Certificate of Disability (Signed by Medical Doctor with License Number)</li>
                                </ul>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800">
                                    Please submit these documents to your local PWD office for validation. Once validated, you will be able to access the system.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 