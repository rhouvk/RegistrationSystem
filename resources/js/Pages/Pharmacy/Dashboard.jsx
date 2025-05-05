import React from 'react';
import { Head } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import {
  FaStore,
  FaShoppingBag,
  FaCalendarAlt,
  FaUserNurse,
} from 'react-icons/fa';

export default function PharmacyDashboard() {
  // Dummy placeholders to avoid frontend errors
  const user = {
    name: 'Pharma One',
  };

  const totalSales = 14500.75;
  const totalTransactions = 27;
  const recentSale = 850.00;
  const recentDate = '2025-04-28';
  const pharmacistName = 'John Reyes, RPh';

  function relativeTime(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const then = new Date(dateStr);
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'a day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? 'a week ago' : `${diffWeeks} weeks ago`;
  }

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Pharmacy Dashboard</h2>}>
      <Head title="Pharmacy Dashboard" />
      <div className="py-5">
        <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">

          {/* Welcome Card */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 sm:rounded-2xl p-6 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaStore className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-white drop-shadow">
                  Welcome, {user.name}!
                </h3>
              </div>
              <p className="text-gray-100 text-sm">Overview of your store performance.</p>
            </div>
          </div>

          {/* Sales & Activity Summary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white shadow sm:rounded-lg p-6 flex items-center space-x-4">
              <FaShoppingBag className="text-4xl text-teal-600" />
              <div>
                <h4 className="text-lg font-semibold text-cyan-900">Total Sales</h4>
                <p className="text-2xl font-bold text-sky-800">₱{totalSales.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{totalTransactions} transactions</p>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6 flex items-center space-x-4">
              <FaCalendarAlt className="text-4xl text-teal-600" />
              <div>
                <h4 className="text-lg font-semibold text-cyan-900">Recent Sale</h4>
                <p className="text-2xl font-bold text-sky-800">₱{recentSale.toFixed(2)}</p>
                <p className="text-sm text-gray-500 italic">{relativeTime(recentDate)}</p>
              </div>
            </div>
          </div>

          {/* Pharmacist Info */}
          <div className="bg-white shadow sm:rounded-lg p-6 flex items-center space-x-4">
            <FaUserNurse className="text-4xl text-teal-600" />
            <div>
              <h4 className="text-lg font-semibold text-cyan-900">Pharmacist on Duty</h4>
              <p className="text-xl font-medium text-sky-900">{pharmacistName}</p>
            </div>
          </div>

        </div>
      </div>
    </PharmacyLayout>
  );
}
