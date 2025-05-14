import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import BusinessLayout from '@/Layouts/BusinessLayout';
import {
  FaStore,
  FaShoppingBag,
  FaChartBar,
  FaCalendarAlt,
} from 'react-icons/fa';

const truncate = (str, max = 50) => (str.length > max ? str.slice(0, max) + '…' : str);

export default function BusinessDashboard() {
  const {
    auth,
    monthlyData = [],
    itemCounts = [],
    dailySales = [],
    latestSale = null,
    range,
  } = usePage().props;

  const business = auth.user;
  const totalSales = monthlyData.reduce((sum, m) => sum + parseFloat(m.total || 0), 0);
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

  return (
    <BusinessLayout header={<h2 className="text-xl font-semibold leading-tight">Business Dashboard</h2>}>
      <Head title="Business Dashboard" />
      <div className="py-12 space-y-10">
        <div className="mx-4 sm:mx-auto max-w-5xl">
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
            <MetricCard icon={<FaChartBar className="text-4xl text-cyan-600" />} title="Latest Month Sales" value={`₱${parseFloat(monthlyData.at(-1)?.total || 0).toFixed(2)}`} />
            <MetricCard icon={<FaCalendarAlt className="text-4xl text-blue-500" />} title="Recent Sale" value={`₱${recentSale.toFixed(2)}`} sub={`on ${recentSaleDate}`} />
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

          <div className="space-y-8">
            <TableCard title="Monthly Sales Summary" icon={<FaChartBar />}>
              <BasicTable
                headers={['Month', 'Sales (₱)']}
                rows={monthlyData.map(m => [m.month, `₱${parseFloat(m.total).toFixed(2)}`])}
              />
            </TableCard>

            <TableCard title="Top 5 Best-Selling Items" icon={<FaShoppingBag />}>
              <BasicTable
                headers={['Item Name', 'Units Sold']}
                rows={itemCounts.slice(0, 5).map(item => [
                  truncate(item?.item?.name || 'Unnamed', 25),
                  item.total_quantity,
                ])}
              />
            </TableCard>

            <TableCard title="Daily Sales (Latest Month)" icon={<FaCalendarAlt />}>
              <BasicTable
                headers={['Date', 'Sales (₱)']}
                rows={dailySales.map(d => [
                  new Date(d.day).toLocaleDateString(),
                  `₱${parseFloat(d.total).toFixed(2)}`,
                ])}
              />
            </TableCard>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
}

function MetricCard({ icon, title, value, sub }) {
  return (
    <div className="bg-white rounded-lg shadow-sm sm:rounded-lg p-6 flex items-center justify-between">
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

function TableCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow sm:rounded-lg p-6">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">{icon} {title}</h4>
      {children}
    </div>
  );
}

function BasicTable({ headers, rows }) {
  return (
    <table className="min-w-full text-sm text-left border-t border-gray-200">
      <thead>
        <tr className="text-gray-600 border-b">
          {headers.map((header, i) => (
            <th key={i} className="py-2 px-4">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cols, idx) => (
          <tr key={idx} className="border-b">
            {cols.map((cell, i) => (
              <td key={i} className="py-2 px-4">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
