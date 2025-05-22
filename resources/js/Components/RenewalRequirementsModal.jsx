import React from 'react';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

export default function RenewalRequirementsModal({ isOpen, onClose }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-semibold text-cyan-950">
                            Required Documents for Renewal
                        </Dialog.Title>
                    </div>

                    <div className="space-y-6">
                        {/* Common Requirements */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Common Requirements</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Barangay Certificate</li>
                                <li>Birth Certificate or any Valid ID</li>
                            </ul>
                        </div>

                        {/* Apparent Disability */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">For Apparent Disability</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Certificate of Disability</li>
                            </ul>
                        </div>

                        {/* Non-Apparent Disability */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">For Non-Apparent Disability</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Medical Certificate</li>
                                <li>Certificate of Disability</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 