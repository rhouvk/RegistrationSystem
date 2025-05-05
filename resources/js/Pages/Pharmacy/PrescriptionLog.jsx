import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';

export default function PrescriptionLog() {
  const { prescriptions = [] } = usePage().props;

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold">Prescription Log</h2>}>
      <Head title="Prescription Log" />

      <div className="py-6">
        <div className="max-w-6xl mx-auto bg-white shadow sm:rounded-lg p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PWD ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Filling</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Physician</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PTR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {prescriptions.map((p, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-gray-700">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-gray-900 font-mono">{p.buyer?.name || '-'}</td>
                  <td className="px-4 py-2">{p.medicine_purchase}</td>
                  <td className="px-4 py-2">{p.quantity_prescribed}</td>
                  <td className="px-4 py-2">{p.filling_status_label}</td>
                  <td className="px-4 py-2">{p.physician_name}</td>
                  <td className="px-4 py-2">{p.physician_ptr_no}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {prescriptions.length === 0 && (
            <p className="text-center text-gray-500 py-4">No prescriptions recorded yet.</p>
          )}
        </div>
      </div>
    </PharmacyLayout>
  );
}
