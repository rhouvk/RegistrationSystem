// resources/js/Pages/Business/Dashboard.jsx

import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
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
import { Line, Bar } from 'react-chartjs-2';
import { FaStore } from 'react-icons/fa';

// register components
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

export default function BusinessDashboard() {
  const { auth, monthlyData = [], itemCounts = [] } = usePage().props;
  const business = auth.user;

  // prepare line chart
  const lineLabels = monthlyData.map((m) => m.month);
  const lineValues = monthlyData.map((m) => m.total);
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Sales by Month',
        data: lineValues,
        borderColor: '#2563eb',
        backgroundColor: '#bfdbfe',
        fill: true,
      },
    ],
  };
  const lineOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

  // prepare bar chart
  const barLabels = itemCounts.map((i) => i.item.name);
  const barValues = itemCounts.map((i) => i.total_quantity);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Units Sold',
        data: barValues,
        backgroundColor: '#10b981',
      },
    ],
  };
  const barOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Business Dashboard</h2>}>
      <Head title="Business Dashboard" />

      <div className="py-12 space-y-8">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          {/* Business Info */}
          <div className="bg-white shadow sm:rounded-lg p-6 flex items-center space-x-6">
            <FaStore className="text-6xl text-indigo-600" />
            <div>
              <h3 className="text-2xl font-semibold">{business.name}</h3>
              <p className="text-gray-600">{business.email}</p>
              <p className="text-gray-600">{business.phone}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Monthly Sales (Last 6 Months)</h4>
            <div style={{ height: '250px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Top Items Sold</h4>
            <div style={{ height: '250px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}
