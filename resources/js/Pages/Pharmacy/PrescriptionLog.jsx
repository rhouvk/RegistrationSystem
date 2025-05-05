import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';

export default function PrescriptionLog() {
  const { prescriptions = [] } = usePage().props;

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold text-cyan-800">Prescription Log</h2>}>
      <Head title="Prescription Log" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">PWD Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Medicine</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Quantity</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Filing Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Physician</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">PTR No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Pharmacist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {prescriptions.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-800">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{p.buyer?.name || '—'}</td>
                    <td className="px-4 py-2 text-gray-700">{p.medicine_purchase}</td>
                    <td className="px-4 py-2 text-center text-gray-700">{p.quantity_prescribed}</td>
                    <td className="px-4 py-2 text-center text-gray-700">{p.filling_status_label}</td>
                    <td className="px-4 py-2 text-gray-700">{p.physician_name}</td>
                    <td className="px-4 py-2 text-gray-700">{p.physician_ptr_no}</td>
                    <td className="px-4 py-2 text-gray-700">{p.pharmacist_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {prescriptions.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                No prescriptions recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </PharmacyLayout>
  );
}
