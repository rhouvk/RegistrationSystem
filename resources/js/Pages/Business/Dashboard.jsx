
import React, { useState } from 'react';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  FaStore,
  FaShoppingBag,
  FaChartBar,
  FaStar,
  FaCalendarAlt,
} from 'react-icons/fa';

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

const truncate = (str, max = 15) => (str.length > max ? str.slice(0, max) + '…' : str);

export default function BusinessDashboard() {
  const {
    auth,
    monthlyData = [],
    itemCounts = [],
    dailySales = [],
    itemSalesTrend = {},
    latestSale = null,
    range,
  } = usePage().props;

  const business = auth.user;
  const totalSales = monthlyData.reduce((sum, m) => sum + parseFloat(m.total || 0), 0);
  const topItem = itemCounts[0]?.item?.name || 'N/A';
  const recentSale = parseFloat(latestSale?.total_amount || 0);
  const recentSaleDate = latestSale?.date_of_purchase
    ? new Date(latestSale.date_of_purchase).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const [selectedRange, setSelectedRange] = useState(range || 'last_6_months');

  const handleRangeChange = () => {
    const params = new URLSearchParams();
    params.append('range', selectedRange);
    window.location.href = `?${params.toString()}`;
  };

  const monthlyLabels = monthlyData.map((m) => m.month);
  const monthlyValues = monthlyData.map((m) => m.total);
  const barLabels = itemCounts.map((i) => truncate(i.item.name));
  const barValues = itemCounts.map((i) => i.total_quantity);

  const monthlyChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Monthly Sales',
        data: monthlyValues,
        borderColor: '#06b6d4',
        backgroundColor: '#67e8f9',
        fill: true,
      },
    ],
  };

  const dailyChart = {
    labels: dailySales.map((d) => d.day),
    datasets: [
      {
        label: 'Daily Sales (Latest Month)',
        data: dailySales.map((d) => d.total),
        backgroundColor: '#38bdf8',
      },
    ],
  };

  const topItemsChart = {
    labels: barLabels,
    datasets: [
      {
        label: 'Units Sold',
        data: barValues,
        backgroundColor: '#2dd4bf',
      },
    ],
  };

  const pieChart = {
    labels: barLabels,
    datasets: [
      {
        label: 'Item Share',
        data: barValues,
        backgroundColor: [
          '#a7f3d0',
          '#6ee7b7',
          '#34d399',
          '#5eead4',
          '#22d3ee',
          '#06b6d4',
          '#0ea5e9',
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 20, padding: 15 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  const itemTrendLabels = monthlyLabels;
  const itemTrendDatasets = Object.entries(itemSalesTrend).map(([itemId, entries]) => {
    const sample = entries[0];
    return {
      label: truncate(sample?.item?.name || `Item ${itemId}`),
      data: itemTrendLabels.map(
        (month) => entries.find((e) => e.month === month)?.total_quantity || 0
      ),
      fill: false,
      borderWidth: 2,
    };
  });

  const itemTrendChart = {
    labels: itemTrendLabels,
    datasets: itemTrendDatasets,
  };

  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (val) {
            return truncate(this.getLabelForValue(val));
          },
          maxRotation: 30,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Business Dashboard</h2>}>
      <Head title="Business Dashboard" />
      <div className="py-12 space-y-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-700 p-6 mb-6 text-white shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center gap-4">
                <FaStore className="text-5xl sm:text-6xl" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Welcome, <span className="capitalize">{business.name}</span>!</h2>
                  <p className="text-sm sm:text-base opacity-90">Here’s your business dashboard summary</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard icon={<FaChartBar className="text-4xl text-green-600" />} title="Total Sales" value={`₱${totalSales.toFixed(2)}`} />
            <MetricCard icon={<FaChartBar className="text-4xl text-cyan-600" />} title="Monthly Sales" value={`₱${parseFloat(monthlyValues.at(-1) || 0).toFixed(2)}`} />
            <MetricCard icon={<FaCalendarAlt className="text-4xl text-blue-500" />} title="Most Recent Sale" value={`₱${recentSale.toFixed(2)}`} sub={`on ${recentSaleDate}`} />
          </div>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-full sm:w-1/3">
              <label className="text-gray-700 text-sm">Select Range</label>
              <select
                value={selectedRange}
                onChange={e => setSelectedRange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="last_6_months">Last 6 Months</option>
                <option value="last_year">Last Year</option>
                <option value="last_3_years">Last 3 Years</option>
                <option value="last_5_years">Last 5 Years</option>
                <option value="overall">Overall</option>
              </select>
            </div>
            <div className="sm:w-auto">
              <button
                onClick={handleRangeChange}
                className="w-full sm:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Monthly Sales" icon={<FaChartBar />}><Line data={monthlyChart} options={defaultOptions} /></ChartCard>
            <ChartCard title="Daily Sales" icon={<FaCalendarAlt />}><Bar data={dailyChart} options={defaultOptions} /></ChartCard>
            <ChartCard title="Top Items Sold" icon={<FaShoppingBag />} note={`Best Seller: ${topItem}`}><Bar data={topItemsChart} options={defaultOptions} /></ChartCard>
            <ChartCard title="Item Share" icon={<FaStar />} height="350px"><Pie data={pieChart} options={pieOptions} /></ChartCard>
            <ChartCard title="Sales Quantity Distribution" icon={<FaChartBar />}>
              <Bar
                data={{
                  labels: barLabels,
                  datasets: [{ label: 'Quantity Sold', data: barValues, backgroundColor: '#0ea5e9' }],
                }}
                options={{
                  ...defaultOptions,
                  indexAxis: 'y',
                  scales: {
                    ...defaultOptions.scales,
                    y: {
                      ticks: {
                        callback: function (val) {
                          return truncate(this.getLabelForValue(val));
                        },
                        autoSkip: false,
                      },
                    },
                  },
                }}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}

function ChartCard({ title, icon, children, note, height = '250px', span = false }) {
  return (
    <div className={`bg-white shadow sm:rounded-lg p-6 ${span ? 'col-span-1 lg:col-span-2' : ''}`}>
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">{icon} {title}</h4>
      <div style={{ height }}>{children}</div>
      {note && <p className="mt-4 text-sm text-gray-600">{note}</p>}
    </div>
  );
}

function MetricCard({ icon, title, value, sub }) {
  return (
    <div className="bg-white shadow-sm sm:rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {sub && <p className="text-sm text-gray-500">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
