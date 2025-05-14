import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminLayout from '@/Layouts/AdminLayout';
import DownloadDashboardPDF from '@/Components/DownloadDashboardPDF';

import { Head } from '@inertiajs/react';
import {
  FaFemale,
  FaMale,
  FaUsers,
  FaClipboardCheck,
  FaSyncAlt,
  FaExclamationCircle,
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard({ yearData = {}, maleCount = 0, femaleCount = 0, adminDistrictData = {}, educationData = {}, employmentData = {} }) {
  const currentYear = new Date().getFullYear();

  const allKeys = Object.keys(yearData);
  const allYears = allKeys.filter(y => y !== 'overall').map(Number).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(allKeys.includes('overall') ? 'overall' : `${allYears[0]}`);

  const last5Years = allYears.filter(y => y >= currentYear - 4).sort((a, b) => a - b);
  const lineData = {
    labels: last5Years.map(String),
    datasets: [{
      label: 'Total Registered PWDs (Last 5 Years)',
      data: last5Years.map(y => yearData[y]?.registered?.total || 0),
      borderColor: '#0B3B46',
      backgroundColor: '#2F7E91',
      fill: false,
    }],
  };

  const lineOptions = { responsive: true, maintainAspectRatio: false };

  const { registered = {}, status = {}, disabilities = [] } = yearData[selectedYear] || {};

  const disabilityChartData = {
    labels: disabilities.map(d => d.name),
    datasets: [{
      label: `PWDs in ${selectedYear}`,
      data: disabilities.map(d => d.count),
      backgroundColor: disabilities.map(d => d.color),
    }],
  };

  const districtChartData = {
    labels: Object.keys(adminDistrictData),
    datasets: [{
      label: 'PWD Count by Admin District',
      data: Object.values(adminDistrictData),
      backgroundColor: '#2F7E91',
    }],
  };

  const educationChartData = {
    labels: Object.keys(educationData),
    datasets: [{
      label: 'PWDs by Education Level',
      data: Object.values(educationData),
      backgroundColor: '#5DC8D9',
    }],
  };

  const employmentChartData = {
    labels: Object.keys(employmentData),
    datasets: [{
      label: 'PWDs by Employment Status',
      data: Object.values(employmentData),
      backgroundColor: '#84D7E3',
    }],
  };

  const horizontalOptions = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(t);
  }, [selectedYear]);

  return (
    <AdminLayout header={<h2 className="text-2xl font-bold">Admin Dashboard</h2>}>
      <Head title="Admin Dashboard" />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white rounded p-4 w-full md:w-1/3 min-h-[14rem]">
              <Line data={lineData} options={lineOptions} />
            </div>

            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaFemale className="text-4xl mb-1 text-[#0B3B46]" />
                <h3 className="text-base font-semibold">Females</h3>
                <p className="text-2xl font-bold text-[#1F5562]">{femaleCount}</p>
              </div>
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaMale className="text-4xl mb-1 text-[#0B3B46]" />
                <h3 className="text-base font-semibold">Males</h3>
                <p className="text-2xl font-bold text-[#1F5562]">{maleCount}</p>
              </div>
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaUsers className="text-4xl mb-1 text-[#0B3B46]" />
                <h3 className="text-base font-semibold">Total</h3>
                <p className="text-2xl font-bold text-[#1F5562]">{maleCount + femaleCount}</p>
              </div>
            </div>

            <div className="bg-white rounded p-4 w-full md:w-1/3">
              <h3 className="text-center text-xl font-semibold mb-2 text-[#0B3B46]">
                {selectedYear === 'overall' ? 'Overall Status' : `${selectedYear} Status`}
              </h3>
              <div className="flex justify-center items-center space-x-8">
                <div className="flex flex-col items-center">
                  <FaClipboardCheck className="text-5xl text-[#1F5562]" />
                  <p className="mt-1">New</p>
                  <p className="font-bold">{status.new}</p>
                </div>
                <div className="flex flex-col items-center">
                  <FaSyncAlt className="text-5xl text-[#2F7E91]" />
                  <p className="mt-1">Renewed</p>
                  <p className="font-bold">{status.renewed}</p>
                </div>
                <div className="flex flex-col items-center">
                  <FaExclamationCircle className="text-5xl text-[#3EA9BD]" />
                  <p className="mt-1">Expired</p>
                  <p className="font-bold">{status.expired}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <label htmlFor="yearSelect" className="font-bold text-[#0B3B46]">Sort by Year:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border rounded px-4 py-2 focus:outline-none text-[#0B3B46]"
              style={{ borderColor: '#0B3B46' }}
            >
              {allKeys.includes('overall') && <option value="overall">Overall</option>}
              {allYears.map(yr => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <DownloadDashboardPDF
              yearData={yearData}
              selectedYear={selectedYear}
              adminDistrictData={adminDistrictData}
              maleCount={maleCount}
              femaleCount={femaleCount}
              education={educationData}
              employmentStatus={employmentData}
            />
          </div>

          <div className={`bg-white rounded p-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-[#0B3B46]">
              Types of Disabilities ({selectedYear})
            </h3>
            <div className="h-72">
              <Bar data={disabilityChartData} options={horizontalOptions} />
            </div>
          </div>

          <div className={`bg-white rounded p-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-[#0B3B46]">
              PWD Distribution by Admin District
            </h3>
            <div className="h-72">
              <Bar data={districtChartData} options={horizontalOptions} />
            </div>
          </div>

          <div className={`bg-white rounded p-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-[#0B3B46]">
              PWDs by Education Level
            </h3>
            <div className="h-72">
              <Bar data={educationChartData} options={horizontalOptions} />
            </div>
          </div>

          <div className={`bg-white rounded p-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4 text-[#0B3B46]">
              PWDs by Employment Status
            </h3>
            <div className="h-72">
              <Bar data={employmentChartData} options={horizontalOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}