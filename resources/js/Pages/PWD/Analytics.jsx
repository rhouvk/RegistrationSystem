import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import PWDLayout from '@/Layouts/PWDLayout';
import { Head, usePage } from '@inertiajs/react';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function Analytics() {
  const { bnpMonthlyData = [], topMedicines = [], hasActiveSubscription } = usePage().props;

  const bnpLineData = {
    labels: bnpMonthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Monthly BNPC Purchase (₱)',
        data: bnpMonthlyData.map((d) => d.total_amount),
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const medicineBarData = {
    labels: topMedicines.map((m) => m.medicine),
    datasets: [
      {
        label: 'Times Prescribed',
        data: topMedicines.map((m) => m.count),
        backgroundColor: 'rgba(5, 150, 105, 0.7)',
      },
    ],
  };

  return (
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Analytics</h2>}>
      <Head title="PWD Analytics" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Monthly BNPC Chart */}
        <div className="relative bg-white p-6 shadow rounded">
          {!hasActiveSubscription && (
            <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-10 flex items-center justify-center rounded">
              <div className="text-center">
                <p className="text-gray-800 font-semibold">Subscribe to view this chart</p>
                <a
                  href="/subscribe"
                  className="mt-2 inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                  Subscribe Now
                </a>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly BNPC Purchase Trends</h3>
          <Line data={bnpLineData} />
        </div>

        {/* Top Medicines Bar Chart */}
        <div className="relative bg-white p-6 shadow rounded">
          {!hasActiveSubscription && (
            <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-10 flex items-center justify-center rounded">
              <div className="text-center">
                <p className="text-gray-800 font-semibold">Subscription required to see chart details</p>
                <a
                  href="/subscribe"
                  className="mt-2 inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                  Subscribe Now
                </a>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Medicines Prescribed</h3>
          <Bar data={medicineBarData} />
        </div>
      </div>
    </PWDLayout>
  );
}
