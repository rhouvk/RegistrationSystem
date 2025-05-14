// File: resources/js/Pages/Pharmacy/Dashboard.jsx

import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import { FaClipboardList, FaUserNurse } from 'react-icons/fa';
import { RiCapsuleLine } from 'react-icons/ri';
import { HiOutlineSpeakerphone } from 'react-icons/hi';

export default function PharmacyDashboard() {
  const {
    auth,
    totalPrescriptions = 0,
    recentMedicine = '—',
    recentDate = null,
    pharmacistName = '—',
    topMedicines = [],
  } = usePage().props;

  const userName = auth?.user?.name || 'Pharmacist';

  function relativeTime(dateStr) {
    if (!dateStr) return '—';
    const now = new Date();
    const then = new Date(dateStr);
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? 'Last week' : `${diffWeeks} weeks ago`;
  }

  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Pharmacy Dashboard</h2>}>
      <Head title="Pharmacy Dashboard" />
      <div className="py-6">
        <div className="max-w-5xl mx-auto px-4 space-y-6">

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 rounded p-6 text-white shadow relative">
            <div className="flex items-center gap-4">
              <HiOutlineSpeakerphone className="text-4xl" />
              <div>
                <h3 className="text-2xl font-bold drop-shadow">Welcome Back, {userName}!</h3>
                <p className="text-sm text-white/90">Here is today’s pharmacy summary.</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
              <FaClipboardList className="text-4xl text-teal-700" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Prescriptions Logged</h4>
                <p className="text-2xl font-bold text-cyan-800">{totalPrescriptions}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
              <RiCapsuleLine className="text-4xl text-teal-700" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Recent Entry</h4>
                <p className="text-base text-gray-700">Medicine: <span className="font-medium">{recentMedicine}</span></p>
                <p className="text-sm text-gray-500">Filled: {relativeTime(recentDate)}</p>
              </div>
            </div>
          </div>

          {/* Pharmacist Info */}
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <FaUserNurse className="text-4xl text-teal-700" />
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Pharmacist</h4>
              <p className="text-base text-cyan-900">{pharmacistName}</p>
            </div>
          </div>

          {/* Top Filled Medicines */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <RiCapsuleLine  className="text-teal-700" />
              Top Filled Medicines
            </h4>
            {topMedicines?.length > 0 ? (
              <ul className="space-y-1 pl-2">
                {topMedicines.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b py-1 text-sm text-gray-800">
                    <span>{item.name}</span>
                    <span className="font-medium text-cyan-900">{item.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No data yet.</p>
            )}
          </div>


        </div>
      </div>
    </PharmacyLayout>
  );
}
