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
import {
  FaCalendarAlt,
  FaShoppingBag,
  FaMoneyBillWave,
  FaChartBar,
  FaPrescriptionBottle,
  FaStore,
} from 'react-icons/fa';

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
    summaryPanels = {},
    bnpMonthlyData = [],
    topMedicines = [],
    spendingByItem = [],
    spendingByCategory = [],
    spendingByStore = [],
    pharmacySpending = [],
    quantityOverTime = [],
    averagePurchase = [],
    balanceTrend = [],
    purchaseFrequency = []

  } = usePage().props;

  const [range, setRange] = useState('month');

  const handleFilter = (selected) => {
    setRange(selected);
    router.get(route('pwd.analytics.index'), { range: selected }, { preserveState: true });
  };

  const ranges = {
    week: 'Past Week',
    month: 'Past Month',
    three: 'Past 3 Months',
    six: 'Past 6 Months',
    year: 'Past Year'
  };

  const truncate = (label, max = 12) => label.length > max ? label.slice(0, max) + '…' : label;

  const summaryCards = [
    {
      label: 'Total BNPC Purchases',
      value: summaryPanels.totalPurchases ?? 0,
      icon: <FaShoppingBag className="text-white text-2xl" />,
      bg: 'bg-green-600',
    },
    {
      label: 'Total Amount Spent',
      value: `₱${Number(summaryPanels.totalSpent ?? 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-white text-2xl" />,
      bg: 'bg-emerald-600',
    },
        {
      label: 'Total Amount Saved',
      value: `₱${Number(summaryPanels.totalSaved ?? 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-white text-2xl" />,
      bg: 'bg-teal-600',
    },
    {
      label: 'Prescriptions Filled',
      value: summaryPanels.totalPrescriptions ?? 0,
      icon: <FaPrescriptionBottle className="text-white text-2xl" />,
      bg: 'bg-cyan-600',
    },
    {
      label: 'Active Stores Visited',
      value: summaryPanels.activeStores ?? 0,
      icon: <FaStore className="text-white text-2xl" />,
      bg: 'bg-sky-600',
    },
  ];

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
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">Showing: {ranges[range]}</p>
      <div className="overflow-x-auto">
        <div className="w-full h-[300px]">
          <ChartComp
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
              },
              elements: {
                line: { tension: 0.4 },
                point: { radius: 3, borderWidth: 1 },
              },
              plugins: { legend: { position: 'bottom' } },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className={`relative p-4 rounded-xl shadow ${card.bg} text-white overflow-hidden`}>
              {!hasActiveSubscription && (
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <p className="text-sm font-semibold">Subscribe to view</p>
                    <a href="/subscribe" className="mt-1 inline-block bg-white text-teal-800 px-3 py-1 rounded font-semibold text-sm">
                      Subscribe Now
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white bg-opacity-20">{card.icon}</div>
                <div>
                  <div className="text-xl font-bold">{card.value}</div>
                  <div className="text-sm">{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 shadow p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-teal-600 text-xl" />
            <span className="text-sm sm:text-base font-medium text-gray-700">View Data For:</span>
          </div>
          <select
            value={range}
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full sm:w-auto mt-1 sm:mt-0 bg-white text-cyan-950 font-semibold px-4 py-2 rounded-lg shadow focus:outline-none"
          >
            {Object.entries(ranges).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {renderChart("BNPC Purchase Count Over Time", Bar, {
            labels: purchaseFrequency.map(d => d.date),
            datasets: [{ label: 'Total Purchases', data: purchaseFrequency.map(d => d.count), backgroundColor: '#16a34a' }],
          })}

          {renderChart("Most Filled Medicines", Bar, {
            labels: topMedicines.map((m) => truncate(m.medicine)),
            datasets: [{ label: 'Times Filled', data: topMedicines.map((m) => m.count), backgroundColor: '#0284c7' }],
          })}

          {renderChart("Spending Per Item", Bar, {
            labels: spendingByItem.map(i => truncate(i.item)),
            datasets: [{ label: '₱ Total Spent', data: spendingByItem.map(i => i.total), backgroundColor: '#059669' }],
          })}

          {renderChart("Spending by Category", Pie, {
            labels: spendingByCategory.map(c => truncate(c.category)),
            datasets: [{ data: spendingByCategory.map(c => c.total), backgroundColor: ['#059669', '#0284c7', '#059669'] }],
          })}

          {renderChart("BNPC Stores Where You Bought", Bar, {
            labels: spendingByStore.map(s => truncate(s.store)),
            datasets: [{ label: '₱ Total Spent', data: spendingByStore.map(s => s.total), backgroundColor: '#059669' }],
          })}

          {renderChart("Pharmacies/Drugstores Where You Filled Prescriptions", Bar, {
          labels: pharmacySpending.map(s => truncate(s.store)),
          datasets: [{
            label: 'Total Prescriptions Filled',
            data: pharmacySpending.map(s => s.total),
            backgroundColor: '#0891b2',
          }],
          })}

          {renderChart("Quantity of Items Purchased Over Time", Line, {
            labels: quantityOverTime.map(d => d.date),
            datasets: [{ label: 'Quantity', data: quantityOverTime.map(d => d.total_quantity), borderColor: '#0d9488', backgroundColor: '#16a34a' }],
          })}

          {renderChart("Average Purchase Amount Over Time", Line, {
            labels: averagePurchase.map(a => a.date),
            datasets: [{ label: '₱ Average', data: averagePurchase.map(a => a.average), borderColor: '#0284c7', backgroundColor: '#0d9488' }],
          })}

          {renderChart("Remaining Discount Balance Over Time", Line, {
            labels: balanceTrend.map(d => d.date_of_purchase),
            datasets: [{ label: '₱ Remaining', data: balanceTrend.map(d => d.remaining_balance), borderColor: '#0d9488', backgroundColor: '#16a34a' }],
          })}

          {renderChart("Spending Trend on BNPC Items", Line, {
            labels: bnpMonthlyData.map((d) => d.date),
            datasets: [{ label: '₱ Total Spent', data: bnpMonthlyData.map((d) => d.total_amount), borderColor: '#0284c7', backgroundColor: '#0d9488' }],
          })}

        </div>
      </div>
    </PWDLayout>
  );
}
