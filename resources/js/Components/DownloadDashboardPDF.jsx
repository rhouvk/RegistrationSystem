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
    const totalPWDs = maleCount + femaleCount;

    // Calculate percentages
    const malePercentage = ((maleCount / totalPWDs) * 100).toFixed(1);
    const femalePercentage = ((femaleCount / totalPWDs) * 100).toFixed(1);

    // Get status counts from the correct data structure
    const newCount = data?.status?.new || 0;
    const renewedCount = data?.status?.renewed || 0;
    const expiredCount = data?.status?.expired || 0;
    const statusTotal = data?.status?.total || totalPWDs;

    // Calculate status percentages based on total PWDs
    const newPercentage = ((newCount / statusTotal) * 100).toFixed(1);
    const renewedPercentage = ((renewedCount / statusTotal) * 100).toFixed(1);
    const expiredPercentage = ((expiredCount / statusTotal) * 100).toFixed(1);

    // Add logo - reduced size
    const logoWidth = 15;
    const logoHeight = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo image - using the correct public path
    doc.addImage('/images/logo.png', 'PNG', 14, 10, logoWidth, logoHeight);

    // Add title with adjusted position to accommodate logo
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.text("PWD NA 'TO - Dashboard Summary Report", logoWidth + 20, 18);

    // Add generation date with adjusted position
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${dateGenerated}`, logoWidth + 20, 25);

    // Main summary table - adjust starting Y position to accommodate logo
    autoTable(doc, {
      theme: 'grid',
      head: [[{ content: 'Category', styles: { fontStyle: 'bold' } }, 
              { content: 'Count', styles: { fontStyle: 'bold' } }, 
              { content: 'Percentage', styles: { fontStyle: 'bold' } }]],
      body: [
        ['Selected Year', selectedYear, ''],
        ['Total Registered', totalPWDs, '100%'],
        ['Total Males', maleCount, `${malePercentage}%`],
        ['Total Females', femaleCount, `${femalePercentage}%`],
      ],
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
    });

    const insertTable = (title, headers, data, calculatePercentage = true) => {
      if (data.length) {
        const total = calculatePercentage ? data.reduce((sum, row) => sum + (Array.isArray(row) ? row[1] : row), 0) : 0;
        const rows = data.map(row => {
          const count = Array.isArray(row) ? row[1] : row;
          const percentage = calculatePercentage ? ((count / total) * 100).toFixed(1) + '%' : '';
          return Array.isArray(row) ? [...row, percentage] : [row, count, percentage];
        });

        // Add table title
        doc.setFontSize(12);
        doc.setTextColor(33, 37, 41);
        doc.text(title, 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
          theme: 'grid',
          head: [[
            { content: headers[0], styles: { fontStyle: 'bold' } },
            { content: headers[1], styles: { fontStyle: 'bold' } },
            { content: 'Percentage', styles: { fontStyle: 'bold' } }
          ]],
          body: rows,
          startY: doc.lastAutoTable.finalY + 20,
          headStyles: { 
            fillColor: [13, 148, 136],
            fontSize: 10,
            cellPadding: 3,
          },
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
        });
      }
    };

    // Convert disability data
    const disabilityData = (data.disabilities || []).map((d) => [d.name, d.count]);
    insertTable(
      'Disability Types Distribution',
      ['Disability Type', 'Count'],
      disabilityData
    );

    insertTable(
      'Administrative District Distribution',
      ['Admin District', 'PWD Count'],
      Object.entries(adminDistrictData)
    );

    insertTable(
      'Education Level Distribution',
      ['Education Level', 'Count'],
      Object.entries(education)
    );

    insertTable(
      'Employment Status Distribution',
      ['Employment Status', 'Count'],
      Object.entries(employmentStatus)
    );

    insertTable(
      'Age Group Distribution',
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
