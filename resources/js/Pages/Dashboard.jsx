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
import PWDLayout from '@/Layouts/PWDLayout';
import { Head } from '@inertiajs/react';

// Icons
import {
  FaFemale,
  FaMale,
  FaUsers,
  FaPlusCircle,
  FaSyncAlt,
  FaExclamationCircle,
  FaClipboardCheck,
} from 'react-icons/fa';

// Register chart components
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

export default function AdminDashboard({
  yearData = {},      // { 2024: { registered: {...}, status: {...}, disabilities: [...] }, ... }
  maleCount = 0,
  femaleCount = 0,
}) {
  // default to the first year in incoming yearData or current year
  const allYears = Object.keys(yearData).map((y) => parseInt(y, 10));
  const [selectedYear, setSelectedYear] = useState(
    allYears.length ? allYears[0] : new Date().getFullYear()
  );

  // safely grab the data for the selected year, with fallbacks
  const {
    registered,
    status,
    disabilities,
  } = yearData[selectedYear] || {
    registered: { female: 0, male: 0, total: 0 },
    status:     { new: 0, renewed: 0, expired: 0, total: 0 },
    disabilities: [],
  };

  // Fade‑in controls
  const [fadeInTotals, setFadeInTotals] = useState(false);
  const [fadeInStatus, setFadeInStatus] = useState(false);
  const [fadeInDisabilities, setFadeInDisabilities] = useState(false);

  useEffect(() => {
    // staggered fade
    setFadeInTotals(false);
    setFadeInStatus(false);
    setFadeInDisabilities(false);

    const t1 = setTimeout(() => setFadeInTotals(true), 100);
    const t2 = setTimeout(() => setFadeInStatus(true), 300);
    const t3 = setTimeout(() => setFadeInDisabilities(true), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  // Line chart for monthly totals
  const lineData = {
    labels: ["Sept", "Oct", "Nov", "Dec", "Jan", "Feb"],
    datasets: [
      {
        label: 'Total Registered PWDs',
        data: [3200, 3300, 3400, 3500, 3600, 4000],
        borderColor: '#0B3B46',
        backgroundColor: '#2F7E91',
        fill: false,
      },
    ],
  };
  const lineOptions = { responsive: true, maintainAspectRatio: false };

  // Bar chart for disabilities
  const barLabels = disabilities.map((d) => d.name);
  const barCounts = disabilities.map((d) => d.count);
  const barColors = disabilities.map((d) => d.color);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: `PWDs in ${selectedYear}`,
        data: barCounts,
        backgroundColor: barColors,
      },
    ],
  };
  const barOptions = { responsive: true, maintainAspectRatio: false };

  return (
    <PWDLayout header={<h2 className="text-2xl font-bold">Admin Dashboard</h2>}>
      <Head title="Admin Dashboard" />

      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          {/* Top row: Line + gender stats + status */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Line chart */}
            <div className="bg-white rounded p-4 w-full md:w-1/3 flex flex-col" style={{ minHeight: '14rem' }}>
              <div className="flex-1">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Female / Male counts */}
            <div className="flex flex-col gap-6 w-full md:w-1/3">
              <div className="bg-white rounded p-4 flex flex-col items-center">
                <FaFemale className="text-6xl mb-2" style={{ color: '#0B3B46' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#0B3B46' }}>Females</h3>
                <p className="text-3xl font-bold" style={{ color: '#1F5562' }}>{femaleCount}</p>
              </div>
              <div className="bg-white rounded p-4 flex flex-col items-center">
                <FaMale className="text-6xl mb-2" style={{ color: '#0B3B46' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#0B3B46' }}>Males</h3>
                <p className="text-3xl font-bold" style={{ color: '#1F5562' }}>{maleCount}</p>
              </div>
            </div>

            {/* Yearly status */}
            <div className="bg-white rounded p-4 w-full md:w-1/3 flex flex-col" style={{ minHeight: '9rem' }}>
              <h3 className="text-center text-xl font-semibold mb-2" style={{ color: '#0B3B46' }}>{selectedYear} Status</h3>
              <div className="flex-1 flex justify-center items-center space-x-8">
                <div className="flex flex-col items-center">
                  <FaClipboardCheck className="text-5xl" style={{ color: '#1F5562' }} />
                  <p className="mt-1">New</p>
                  <p className="font-bold">{status.new}</p>
                </div>
                <div className="flex flex-col items-center">
                  <FaSyncAlt className="text-5xl" style={{ color: '#2F7E91' }} />
                  <p className="mt-1">Renewed</p>
                  <p className="font-bold">{status.renewed}</p>
                </div>
                <div className="flex flex-col items-center">
                  <FaExclamationCircle className="text-5xl" style={{ color: '#3EA9BD' }} />
                  <p className="mt-1">Expired</p>
                  <p className="font-bold">{status.expired}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Year selector */}
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="yearSelect" className="font-bold" style={{ color: '#0B3B46' }}>Sort by Year:</label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-white border rounded px-4 py-2 focus:outline-none"
              style={{ borderColor: '#0B3B46', color: '#0B3B46' }}
            >
              {allYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Registered Totals */}
          <div className={`bg-white rounded p-4 transition-opacity duration-500 ${fadeInTotals ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#0B3B46' }}>Registered Totals ({selectedYear})</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <FaFemale className="text-4xl" style={{ color: '#0B3B46' }} />
                <p>Females: {registered.female}</p>
              </div>
              <div className="flex flex-col items-center">
                <FaMale className="text-4xl" style={{ color: '#0B3B46' }} />
                <p>Males: {registered.male}</p>
              </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-4xl" style={{ color: '#0B3B46' }} />
                <p>Total: {registered.total}</p>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className={`bg-white rounded p-4 mt-6 transition-opacity duration-500 ${fadeInStatus ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#0B3B46' }}>Status Breakdown ({selectedYear})</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <FaPlusCircle className="text-4xl" style={{ color: '#1F5562' }} />
                <p>New</p><p className="font-bold">{status.new}</p>
              </div>
              <div className="flex flex-col items-center">
                <FaSyncAlt className="text-4xl" style={{ color: '#2F7E91' }} />
                <p>Renewed</p><p className="font-bold">{status.renewed}</p>
              </div>
              <div className="flex flex-col items-center">
                <FaExclamationCircle className="text-4xl" style={{ color: '#3EA9BD' }} />
                <p>Expired</p><p className="font-bold">{status.expired}</p>
              </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-4xl" style={{ color: '#0B3B46' }} />
                <p>Total</p><p className="font-bold">{status.total}</p>
              </div>
            </div>
          </div>

          {/* Disabilities bar chart */}
          <div className={`bg-white rounded p-4 mt-6 transition-opacity duration-500 ${fadeInDisabilities ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#0B3B46' }}>Types of Disabilities ({selectedYear})</h3>
            <div className="h-72">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </PWDLayout>
  );
}
