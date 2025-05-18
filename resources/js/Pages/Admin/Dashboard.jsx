import React, { useState, useEffect } from 'react';
import HoverMap from '@/Components/HoverMap';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
  ArcElement,
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
import {
  teal,
  cyan,
  sky,
  slate,
} from 'tailwindcss/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const colorPalette = [teal[500], cyan[500], sky[500], teal[400], cyan[400], sky[400]];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.x || context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label || ''}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    x: { ticks: { color: slate[700] }, grid: { color: slate[200] } },
    y: { ticks: { color: slate[700] }, grid: { color: slate[200] } },
  },
};

export default function AdminDashboard({ 
  yearData = {}, 
  maleCount = 0, 
  femaleCount = 0, 
  adminDistrictData = {}, 
  educationData = {}, 
  employmentData = {}, 
  ageGroups = {} 
}) {
  const currentYear = new Date().getFullYear();
  const allKeys = Object.keys(yearData);
  const allYears = allKeys.filter(y => y !== 'overall').map(Number).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(allKeys.includes('overall') ? 'overall' : `${allYears[0] || currentYear}`);
  const last5Years = allYears.filter(y => y >= currentYear - 4).sort((a, b) => a - b);

  const { registered = {}, status = {}, disabilities = [] } = yearData[selectedYear] || {};

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(t);
  }, [selectedYear]);

  // Chart Data
  const chartData = {
    line: {
      labels: last5Years.map(String),
      datasets: [{
        label: 'Total Registered PWDs (Last 5 Years)',
        data: last5Years.map(y => yearData[y]?.registered?.total || 0),
        borderColor: teal[600],
        backgroundColor: teal[300],
        fill: false,
      }],
    },
    disability: {
      labels: disabilities.map(d => d.name),
      datasets: [{
        label: `PWDs in ${selectedYear}`,
        data: disabilities.map(d => d.count),
        backgroundColor: disabilities.map((_, index) => colorPalette[index % colorPalette.length]),
      }],
    },
    district: {
      labels: Object.keys(adminDistrictData),
      datasets: [{
        label: 'PWD Count by Admin District',
        data: Object.values(adminDistrictData),
        backgroundColor: colorPalette,
      }],
    },
    education: {
      labels: Object.keys(educationData),
      datasets: [{
        label: 'PWDs by Education Level',
        data: Object.values(educationData),
        backgroundColor: colorPalette,
      }],
    },
    employment: {
      labels: Object.keys(employmentData),
      datasets: [{
        label: 'PWDs by Employment Status',
        data: Object.values(employmentData),
        backgroundColor: colorPalette,
      }],
    },
    age: {
      labels: Object.keys(ageGroups),
      datasets: [{
        label: 'PWDs by Age Group',
        data: Object.values(ageGroups),
        backgroundColor: colorPalette,
      }],
    },
  };

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight">Admin Dashboard</h2>}>
      <Head title="Admin Dashboard" />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Line Chart */}
            <div className="bg-white rounded p-4 w-full md:w-1/3 min-h-[14rem]">
              <Line data={chartData.line} options={{ ...chartOptions, indexAxis: 'x' }} />
            </div>

            {/* Middle: Gender Stats */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaFemale className="text-4xl mb-1 text-cyan-950" />
                <h3 className="text-base font-semibold text-slate-700">Females</h3>
                <p className="text-2xl font-bold text-cyan-700">{femaleCount}</p>
              </div>
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaMale className="text-4xl mb-1 text-cyan-950" />
                <h3 className="text-base font-semibold text-slate-700">Males</h3>
                <p className="text-2xl font-bold text-cyan-700">{maleCount}</p>
              </div>
              <div className="bg-white rounded p-3 flex flex-col items-center">
                <FaUsers className="text-4xl mb-1 text-cyan-950" />
                <h3 className="text-base font-semibold text-slate-700">Total</h3>
                <p className="text-2xl font-bold text-cyan-700">{maleCount + femaleCount}</p>
              </div>

              <div className="bg-white rounded p-3 flex flex-col items-center">
                <h3 className="text-center text-xl font-semibold mb-2 text-cyan-950">
                  {selectedYear === 'overall' ? 'Overall Status' : `${selectedYear} Status`}
                </h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="flex flex-col items-center">
                    <FaClipboardCheck className="text-5xl text-cyan-600" />
                    <p className="mt-1 text-slate-700">New</p>
                    <p className="font-bold text-slate-800">{status.new || 0}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaSyncAlt className="text-5xl text-sky-600" />
                    <p className="mt-1 text-slate-700">Renewed</p>
                    <p className="font-bold text-slate-800">{status.renewed || 0}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaExclamationCircle className="text-5xl text-teal-500" />
                    <p className="mt-1 text-slate-700">Expired</p>
                    <p className="font-bold text-slate-800">{status.expired || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div className="bg-white rounded p-4 w-full md:w-1/3">
              <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">Davao District Map</h3>
              <HoverMap adminDistrictData={adminDistrictData} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <label htmlFor="yearSelect" className="font-bold text-slate-700">Sort by Year:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border rounded px-4 py-2 focus:outline-none text-slate-700"
              style={{ borderColor: teal[600] }}
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
              ageGroups={ageGroups}
            />
          </div>

          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded p-4">
              <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">Types of Disabilities ({selectedYear})</h3>
              <div className="h-72">
                <Bar data={chartData.disability} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded p-4">
              <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">PWD Distribution by Admin District</h3>
              <div className="h-72">
                <Bar data={chartData.district} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded p-4">
              <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">PWDs by Education Level</h3>
              <div className="h-72">
                <Bar data={chartData.education} options={chartOptions} />
              </div>
            </div>
          </div>
          
          <div className={`flex flex-col md:flex-row gap-6 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Employment Pie Chart */}
            <div className="bg-white rounded p-4 w-full md:w-1/2 flex justify-center items-center">
              <div className="w-full max-w-xs">
                <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">PWDs by Employment Status</h3>
                <div className="aspect-square">
                  <Pie data={chartData.employment} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Age Group Pie Chart */}
            <div className="bg-white rounded p-4 w-full md:w-1/2 flex justify-center items-center">
              <div className="w-full max-w-xs">
                <h3 className="text-xl font-bold text-center mb-4 text-cyan-950">PWDs by Age Group</h3>
                <div className="aspect-square">
                  <Pie data={chartData.age} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}