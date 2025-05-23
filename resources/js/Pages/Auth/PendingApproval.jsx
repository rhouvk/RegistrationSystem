import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

export default function PendingApproval({ message }) {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Account Pending Approval" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h2 className="mt-4 text-2xl font-bold text-gray-900">Account Pending Approval</h2>
                            </div>

                            <div className="mt-6 text-center text-gray-600">
                                <p className="text-lg mb-4">
                                    Your account is currently under review by our administrators.
                                </p>
                                <p className="mb-4">
                                    Please wait for our email notification once your account has been approved.
                                </p>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 