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
      <div className="w-full h-[300px]"> {/* Changed min-w to w-full */}
        <ChartComp
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  autoSkip: true, // Enable auto-skipping of labels
                  maxTicksLimit: 10, // Optional: Set a maximum number of ticks
                  // stepSize: 2, // Optional: Show every other label
                },
              },
              y: {
                // Add any specific y-axis configurations if needed
              },
            },
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 3,
                borderWidth: 1,
              },
            },
            plugins: {
              legend: {
                position: 'bottom', // Adjust legend position if needed
              },
              title: {
                display: true,
                text: title, // Title is already above, consider removing here
              },
            },
          }}
        />
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
      <span className="text-sm sm:text-base font-medium text-gray-700">
        View Data For:
      </span>
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
    {renderChart("Monthly Spending on BNPC Items", Line, {
      labels: bnpMonthlyData.map((d) => d.month),
      datasets: [{
        label: '₱ Total Spent',
        data: bnpMonthlyData.map((d) => d.total_amount),
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
      }],
    })}

    {renderChart("Most Prescribed Medicines", Bar, {
      labels: topMedicines.map((m) => truncate(m.medicine)),
      datasets: [{
        label: 'Times Prescribed',
        data: topMedicines.map((m) => m.count),
        backgroundColor: 'rgba(5, 150, 105, 0.7)',
      }],
    })}

    {renderChart("Spending Per Item", Bar, {
      labels: spendingByItem.map(i => truncate(i.item)),
      datasets: [{
        label: '₱ Total Spent',
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

    {renderChart("Stores Where You Bought", Bar, {
      labels: spendingByStore.map(s => truncate(s.store)),
      datasets: [{
        label: '₱ Total Spent',
        data: spendingByStore.map(s => s.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }],
    })}

    {renderChart("Total Quantity Purchased", Line, {
      labels: quantityOverTime.map(d => d.date),
      datasets: [{
        label: 'Quantity',
        data: quantityOverTime.map(d => d.total_quantity),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.3)',
        tension: 0.4
      }],
    })}

    {renderChart("Average Purchase Amount (Monthly)", Line, {
      labels: averagePurchase.map(a => a.month),
      datasets: [{
        label: '₱ Average',
        data: averagePurchase.map(a => a.average),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.3)',
        tension: 0.3
      }],
    })}

    {renderChart("Remaining Discount Balance Over Time", Line, {
      labels: balanceTrend.map(d => d.date_of_purchase),
      datasets: [{
        label: '₱ Remaining',
        data: balanceTrend.map(d => d.remaining_balance),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        tension: 0.4
      }],
    })}

    {renderChart("Weekly Purchase Count", Bar, {
      labels: purchaseFrequency.map(d => `Week ${d.week}`),
      datasets: [{
        label: 'Total Purchases',
        data: purchaseFrequency.map(d => d.count),
        backgroundColor: 'rgba(255, 205, 86, 0.7)'
      }],
    })}
  </div>

  <div className="mt-8 bg-white rounded-xl shadow px-6 py-4 text-sm leading-relaxed text-gray-700">
    <h4 className="font-semibold text-base mb-2 text-teal-700">Summary:</h4>
    <ul className="list-disc pl-5 space-y-1">
      <li>View and track your spending behavior by item, category, and pharmacy.</li>
      <li>Understand your top prescribed medicines and how much you still have left to use from your ₱2,500 BNPC cap.</li>
      <li>Choose from multiple date ranges to focus on recent or longer-term trends.</li>
      <li>Charts automatically update based on your selected time range.</li>
      <li>To unlock full insights, please subscribe and support our platform.</li>
    </ul>
  </div>
</div>

    </PWDLayout>
  );
}