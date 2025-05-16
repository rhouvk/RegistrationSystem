import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';

export default function DownloadDashboardPDF({
  yearData = {},
  selectedYear = 'overall',
  adminDistrictData = {},
  maleCount = 0,
  femaleCount = 0,
  education = {},
  employmentStatus = {},
  ageGroups = {},
}) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const data = yearData[selectedYear] || {};
    const dateGenerated = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.text(`PWD NA 'TO - Dashboard Summary Report`, 14, 16);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${dateGenerated}`, 14, 22);

    autoTable(doc, {
      head: [['Category', 'Value']],
      body: [
        ['Selected Year', selectedYear],
        ['Total Males', maleCount],
        ['Total Females', femaleCount],
        ['Total Registered', maleCount + femaleCount],
        ['New', data.status?.new || 0],
        ['Renewed', data.status?.renewed || 0],
        ['Expired', data.status?.expired || 0],
      ],
      startY: 28,
    });

    const insertTable = (title, headers, rows) => {
      if (rows.length) {
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: doc.lastAutoTable.finalY + 10,
          headStyles: { fillColor: [13, 148, 136] },
        });
      }
    };

    insertTable(
      'Disability Types',
      ['Disability Type', 'Count'],
      (data.disabilities || []).map((d) => [d.name, d.count])
    );

    insertTable(
      'Admin Districts',
      ['Admin District', 'PWD Count'],
      Object.entries(adminDistrictData)
    );

    insertTable(
      'Education Levels',
      ['Education Level', 'Count'],
      Object.entries(education)
    );

    insertTable(
      'Employment Status',
      ['Employment Status', 'Count'],
      Object.entries(employmentStatus)
    );

    insertTable(
      'Age Groups',
      ['Age Range', 'Count'],
      Object.entries(ageGroups)
    );

    doc.save(`dashboard_report_${selectedYear}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
    >
      <FaFilePdf /> Download Dashboard PDF
    </button>
  );
}
