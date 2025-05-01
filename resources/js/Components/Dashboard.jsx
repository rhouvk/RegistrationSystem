// resources/js/Pages/PWD/Dashboard.jsx

import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDCardModal from '@/Components/PWDCardModal';
import PWDLayout from '@/Layouts/PWDLayout';
import {
  FaPiggyBank,
  FaShoppingCart,
  FaIdCard,
  FaInfoCircle,
  FaSpinner,
} from 'react-icons/fa';

export default function PWDDashboard() {
  const {
    auth,
    registration,
    cardExpiration,
    purchaseLimit,
    usedSoFar,
    remainingBalance,
    recentPurchase,
    recentDate,
  } = usePage().props;

  const user = auth?.user || {};
  const photoUrl = registration?.photoUrl || '/images/person.png'; 

  // modal / loading state
  const [isInfoOpen, setInfoOpen]     = useState(false);
  const [isCardOpen, setCardOpen]     = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardUrl, setCardUrl]         = useState(null);

  // compute expiry date
  const appliedDate = new Date(registration.dateApplied);
  const expiryDate  = new Date(registration.dateApplied);
  expiryDate.setFullYear(
    expiryDate.getFullYear() + parseInt(cardExpiration, 10)
  );

  function getAge(dob) {
    const b = new Date(dob), t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    if (
      t.getMonth() < b.getMonth() ||
      (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
    ) age--;
    return age;
  }

  async function handleViewCard() {
    setCardLoading(true);
    setCardOpen(true);
    try {
      const res = await fetch(route('pwd.pwd-users.dashboard.generate'));
      if (!res.ok) throw new Error('Network response was not ok');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      setCardUrl(url);
    } catch (e) {
      console.error(e);
      // optionally: show a toast / alert here
    } finally {
      setCardLoading(false);
    }
  }

  function relativeTime(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const then = new Date(dateStr);
    const diffDays = Math.floor((now - then) / (1000*60*60*24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'a day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? 'a week ago' : `${diffWeeks} weeks ago`;
  }

  return (
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Dashboard</h2>}>
      <Head title="Dashboard" />

      <div className="py-5">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-5">

          {/* User Photo */}
          <div className="flex justify-center">
          <img src={photoUrl} alt="PWD Photo" className="w-32 h-32 rounded-full object-cover" />
          </div>

          {/* Welcome Card */}
          <div className="relative bg-gradient-to-bl from-cyan-600 via-sky-700 to-teal-600 sm:rounded-2xl p-6 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaIdCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-white drop-shadow">
                  Welcome, {user.name}!
                </h3>
              </div>
              <div className="border-t border-white/30 my-4" />
              <p className="text-gray-100 text-sm">
                Here are your account details.
              </p>
            </div>
          </div>

            {/* Purchase Limit & Recent Purchase */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Purchase Limit */}
              <div className="flex-1 bg-white shadow sm:rounded-lg p-6 flex items-center space-x-4">
                <FaPiggyBank className="text-4xl text-teal-600" />
                <div>
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-transparent bg-clip-text">
                    Purchase Limit Balance
                  </h4>
                  <p className="text-2xl font-bold text-cyan-950">
                    ₱{remainingBalance.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    used ₱{usedSoFar.toFixed(2)} of ₱{purchaseLimit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Recent Purchase */}
              <div className="flex-1 bg-white shadow sm:rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <FaShoppingCart className="text-4xl text-teal-600" />
                  <div>
                    <h4 className="text-lg font-semibold bg-gradient-to-r from-teal-600 via-sky-700 to-teal-800 text-transparent bg-clip-text">
                      Recent Purchase
                    </h4>
                    <p className="text-2xl font-bold text-cyan-950">
                      ₱{recentPurchase.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 italic">
                      {relativeTime(recentDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>


          {/* Registration Info */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg text-cyan-950 font-semibold mb-2">
              Registration Info
            </h4>
            <table className="w-full text-sm text-gray-700">
              <tbody>
                <tr className="border-t">
                  <td className="py-2 font-medium">PWD Number</td>
                  <td className="py-2">{registration.pwdNumber}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Date Applied</td>
                  <td className="py-2">
                    {appliedDate.toLocaleDateString()}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Expires On</td>
                  <td className="py-2">
                    {expiryDate.toLocaleDateString()}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Validity</td>
                  <td className="py-2">
                    {cardExpiration} {cardExpiration > 1 ? 'years' : 'year'}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Date of Birth</td>
                  <td className="py-2">
                    {new Date(registration.dob)
                      .toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                    ({getAge(registration.dob)} years old)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disability Summary */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg text-cyan-950 font-semibold mb-2">
              Disability Details
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Array.isArray(registration.disabilityTypes) &&
               registration.disabilityTypes.length > 0 ? (
                registration.disabilityTypes.map((d) => (
                  <li key={d} className="capitalize">
                    {d.replace(/_/g, ' ')}
                  </li>
                ))
              ) : (
                <li>No disability type provided.</li>
              )}
            </ul>
            {registration.disabilityCauses && (
              <>
                <h5 className="text-lg text-cyan-950 font-semibold mt-4 mb-2">
                  Cause(s) of Disability:
                </h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {Array.isArray(registration.disabilityCauses) ? (
                    registration.disabilityCauses.map((c) => (
                      <li key={c} className="capitalize">
                        {c.replace(/([A-Z])/g, ' $1')}
                      </li>
                    ))
                  ) : (
                    <li>{registration.disabilityCauses}</li>
                  )}
                </ul>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleViewCard}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded transition"
            >
              {cardLoading
                ? <FaSpinner className="animate-spin" />
                : <FaIdCard />}
              View / Download My PWD Card
            </button>
            <button
              onClick={() => setInfoOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition"
            >
              <FaInfoCircle className="text-lg" />
              More Info
            </button>
          </div>

          {/* Info Modal */}
          {isInfoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
                <h2 className="text-xl text-cyan-950 font-bold mb-4">More Information</h2>
                <table className="w-full text-sm text-gray-950">
                  <tbody>
                    <tr>
                      <td className="font-medium py-1">Education:</td>
                      <td>{registration.education}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Employment Status:</td>
                      <td>{registration.employmentStatus}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Employment Type:</td>
                      <td>{registration.employmentType}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Occupation:</td>
                      <td>{registration.occupation}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Organization:</td>
                      <td>{registration.organizationAffiliated}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Father's Name:</td>
                      <td>{registration.fatherName}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Mother's Name:</td>
                      <td>{registration.motherName}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Guardian's Name:</td>
                      <td>{registration.guardianName}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-6 text-right">
                <button
                  onClick={() => setInfoOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
              </div>
            </div>
          )}

          {/* Card Modal */}
        <PWDCardModal
        isOpen={isCardOpen}
        cardUrl={cardUrl}
        loading={cardLoading}
        onClose={() => {
          setCardOpen(false);
          if (cardUrl) URL.revokeObjectURL(cardUrl);
        }}/>



        </div>
      </div>
    </PWDLayout>
  );
}
