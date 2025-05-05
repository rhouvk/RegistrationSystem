// Controller: PWDAnalyticsController.php

// ... (Same as previous backend code above)

// Frontend: resources/js/Pages/PWD/Analytics.jsx

import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';
import PWDLayout from '@/Layouts/PWDLayout';
import { Head, usePage, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { FaCalendarAlt } from 'react-icons/fa';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

export default function Analytics() {
  const {
    hasActiveSubscription,
    bnpMonthlyData = [],
    topMedicines = [],
    spendingByItem = [],
    spendingByCategory = [],
    spendingByStore = [],
    quantityOverTime = [],
    averagePurchase = [],
    balanceTrend = [],
    purchaseFrequency = []
  } = usePage().props;

  const [range, setRange] = useState('month');

  const handleFilter = (selected) => {
    setRange(selected);
    router.get(route('pwd.analytics'), { range: selected }, { preserveState: true });
  };

  const ranges = {
    week: 'Past Week',
    month: 'Past Month',
    three: 'Past 3 Months',
    six: 'Past 6 Months',
    year: 'Past Year'
  };

  const truncate = (label, max = 12) => label.length > max ? label.slice(0, max) + '…' : label;

  const renderChart = (title, ChartComp, chartData) => (
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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[500px] h-[300px]">
          <ChartComp data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );

  return (
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Analytics</h2>}>
      <Head title="PWD Analytics" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white border border-gray-200 shadow p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-teal-600 text-xl" />
            <span className="text-sm sm:text-base font-medium text-gray-700">Select Date Range:</span>
          </div>
          <select
            value={range}
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full sm:w-auto mt-1 sm:mt-0 bg-white text-cyan-950 font-semibold px-4 py-2 rounded-lg shadow hover:bg-cyan-700 focus:outline-none"
          >
            {Object.entries(ranges).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderChart("Monthly BNPC Purchase Trends", Line, {
            labels: bnpMonthlyData.map((d) => d.month),
            datasets: [{
              label: 'Purchase (₱)',
              data: bnpMonthlyData.map((d) => d.total_amount),
              borderColor: 'rgba(14, 165, 233, 1)',
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              tension: 0.4,
            }],
          })}

          {renderChart("Top 5 Medicines Prescribed", Bar, {
            labels: topMedicines.map((m) => truncate(m.medicine)),
            datasets: [{
              label: 'Times Prescribed',
              data: topMedicines.map((m) => m.count),
              backgroundColor: 'rgba(5, 150, 105, 0.7)',
            }],
          })}

          {renderChart("Spending by Item", Bar, {
            labels: spendingByItem.map(i => truncate(i.item)),
            datasets: [{
              label: 'Total (₱)',
              data: spendingByItem.map(i => i.total),
              backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }],
          })}

          {renderChart("Spending by Category", Pie, {
            labels: spendingByCategory.map(c => truncate(c.category)),
            datasets: [{
              data: spendingByCategory.map(c => c.total),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 206, 86, 0.6)'
              ]
            }],
          })}

          {renderChart("Spending by Store", Bar, {
            labels: spendingByStore.map(s => truncate(s.store)),
            datasets: [{
              label: 'Total (₱)',
              data: spendingByStore.map(s => s.total),
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }],
          })}

          {renderChart("Quantity Purchased Over Time", Line, {
            labels: quantityOverTime.map(d => d.date),
            datasets: [{
              label: 'Quantity',
              data: quantityOverTime.map(d => d.total_quantity),
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.3)',
              tension: 0.4
            }],
          })}

          {renderChart("Average Purchase Value (Monthly)", Line, {
            labels: averagePurchase.map(a => a.month),
            datasets: [{
              label: 'Avg Value (₱)',
              data: averagePurchase.map(a => a.average),
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.3)',
              tension: 0.3
            }],
          })}

          {renderChart("Remaining Balance Trend", Line, {
            labels: balanceTrend.map(d => d.date_of_purchase),
            datasets: [{
              label: 'Remaining (₱)',
              data: balanceTrend.map(d => d.remaining_balance),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.3)',
              tension: 0.4
            }],
          })}

          {renderChart("Weekly Purchase Frequency", Bar, {
            labels: purchaseFrequency.map(d => `Week ${d.week}`),
            datasets: [{
              label: 'Count',
              data: purchaseFrequency.map(d => d.count),
              backgroundColor: 'rgba(255, 205, 86, 0.7)'
            }],
          })}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow px-6 py-4 text-sm leading-relaxed text-gray-700">
          <h4 className="font-semibold text-base mb-2 text-teal-700">Summary:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>This dashboard visualizes PWD spending behavior across different items, stores, and dates.</li>
            <li>Charts show monthly totals, category breakdowns, top medicine purchases, and quantity trends.</li>
            <li>You can select a date range filter to focus on recent transactions (week, month, etc.).</li>
            <li>Data is updated automatically when a filter is applied.</li>
            <li>Only subscribed users can see full charts — consider subscribing to unlock all insights.</li>
          </ul>
        </div>
      </div>
    </PWDLayout>
  );
}