import React, { useState } from 'react';
import { FaFileCsv, FaFilter, FaTimes } from 'react-icons/fa';

export default function DownloadPrescriptionLogCSV({ data = [], drugstoreName = 'Unknown Drugstore' }) {
  const [showModal, setShowModal] = useState(false);
  const [preset, setPreset] = useState('custom');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const getPresetDates = () => {
    const map = {
      today: [todayStr, todayStr],
      last7: [new Date(now - 7 * 86400000).toISOString().slice(0, 10), todayStr],
      last30: [new Date(now - 30 * 86400000).toISOString().slice(0, 10), todayStr],
    };
    return map[preset] || [dateFrom, dateTo];
  };

  const [filteredFrom, filteredTo] = getPresetDates();

  const filteredData = data.filter((p) => {
    const date = new Date(p.date);
    return (
      (!filteredFrom || date >= new Date(filteredFrom)) &&
      (!filteredTo || date <= new Date(filteredTo))
    );
  });

  const generateCSV = () => {
    const headers = [
      'Date',
      'PWD No.',
      'Medicine',
      'Prescribed',
      'Filled',
      'Balance',
      'Status',
      'Physician',
      'PTR No.',
      'Pharmacist'
    ];

    const metaHeader = [
      `Drugstore: ${drugstoreName}`,
      `Generated: ${new Date().toLocaleString()}`
    ];

    const rows = filteredData.map((p) => [
      new Date(p.date).toLocaleDateString(),
      p.pwd_number,
      p.medicine_purchase,
      p.quantity_prescribed,
      p.quantity_filled,
      p.balance,
      p.filling_status_label,
      p.physician_name,
      p.physician_ptr_no,
      p.pharmacist_name || ''
    ]);

    const csvContent =
      metaHeader.join(',') + '\n\n' +
      headers.join(',') + '\n' +
      rows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'prescription_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-800 rounded hover:bg-teal-200"
      >
        <FaFileCsv /> Download CSV
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow space-y-4 relative">
          <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
          <FaFilter /> Filter and Download
            </div>

            {/* Preset Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Select Range:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPreset('today')}
                  className={`px-3 py-1 rounded text-sm ${preset === 'today' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setPreset('last7')}
                  className={`px-3 py-1 rounded text-sm ${preset === 'last7' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setPreset('last30')}
                  className={`px-3 py-1 rounded text-sm ${preset === 'last30' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setPreset('custom')}
                  className={`px-3 py-1 rounded text-sm ${preset === 'custom' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Custom Dates */}
            {preset === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Date:</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Date:</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={generateCSV}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                <FaFileCsv /> Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
