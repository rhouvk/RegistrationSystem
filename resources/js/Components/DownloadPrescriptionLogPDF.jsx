import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaFilter, FaTimes, FaCalendarAlt } from 'react-icons/fa';

export default function DownloadPrescriptionLogPDF({ data = [], drugstoreName = 'Unknown Drugstore' }) {
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const dateGenerated = new Date().toLocaleString();

    const img = new Image();
    img.src = '/images/logo.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 12, 12);

      doc.setFontSize(14);
      doc.setTextColor(33, 37, 41);
      doc.text("PWD NA 'TO – Prescription Log", 30, 17);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Drugstore: ${drugstoreName}`, 195, 17, { align: 'right' });
      doc.text(`Generated: ${dateGenerated}`, 195, 21, { align: 'right' });

      const tableData = filteredData.map((p) => [
        new Date(p.date).toLocaleDateString(),
        p.pwd_number,
        p.medicine_purchase,
        p.quantity_prescribed,
        p.quantity_filled,
        p.balance,
        p.filling_status_label,
        p.physician_name,
        p.physician_ptr_no,
        p.pharmacist_name,
      ]);

      autoTable(doc, {
        head: [['Date', 'PWD No.', 'Medicine', 'Prescribed', 'Filled', 'Balance', 'Status', 'Physician', 'PTR No.', 'Pharmacist']],
        body: tableData,
        startY: 26,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [13, 148, 136] },
      });

      doc.save('prescription_log.pdf');
      setShowModal(false);
    };
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        <FaFilePdf /> Download PDF
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow space-y-4 relative">
            <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
              <FaFilter /> Filter and Download
            </div>

            {/* Preset Options */}
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

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                <FaFilePdf /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
