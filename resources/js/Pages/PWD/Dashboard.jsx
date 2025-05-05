import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import PWDCardModal from '@/Components/PWDCardModal';
import PWDInfoModal from '@/Components/PWDInfoModal';
import PWDLayout from '@/Layouts/PWDLayout';
import {
  FaPiggyBank,
  FaShoppingCart,
  FaIdCard,
  FaInfoCircle,
  FaSpinner,
  FaCrown,
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
    subscription,
  } = usePage().props;

  const user = auth?.user || {};
  const photoUrl = registration?.photoUrl || '/images/person.png';

  const [isInfoOpen, setInfoOpen] = useState(false);
  const [isCardOpen, setCardOpen] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardUrl, setCardUrl] = useState(null);

  const appliedDate = new Date(registration.updated_at);
  const expiryDate = new Date(registration.updated_at);
  expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(cardExpiration, 10));
  const isExpired = new Date() > expiryDate;

  const isPremium = !!subscription;
  const subscriptionExpiry = subscription?.ends_at;

  function getAge(dob) {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  async function handleViewCard() {
    setCardLoading(true);
    setCardOpen(true);
    try {
      const res = await fetch(route('pwd.pwd-users.dashboard.generate'));
      if (!res.ok) throw new Error('Network error');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setCardUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setCardLoading(false);
    }
  }

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
    <PWDLayout header={<h2 className="text-xl font-semibold leading-tight">Dashboard</h2>}>
      <Head title="Dashboard" />
      <div className="py-5">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-5">

          {/* User Photo */}
          <div className="flex justify-center">
            <div className="p-1 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500">
              <img
                src={photoUrl}
                alt="PWD Photo"
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            </div>
          </div>

          {/* Welcome */}
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

          {/* Purchase Summary */}
          <div className="flex flex-col sm:flex-row gap-4">
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


          {/* Account Type */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg text-cyan-950 font-semibold mb-2">Account Type</h4>
            <div className="flex items-center gap-3">
              <FaCrown className={`text-xl ${isPremium ? 'text-green-700' : 'text-gray-400'}`} />
              <span className={`text-base font-semibold ${isPremium ? 'text-green-700' : 'text-gray-600'}`}>
                {isPremium ? 'Premium Account' : 'Basic Account'}
              </span>
              {isPremium && (
                <span className="ml-2 text-sm text-gray-500">(Expires on {new Date(subscriptionExpiry).toLocaleDateString()})</span>
              )}
            </div>
          </div>



          {/* Registration Info */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg text-cyan-950 font-semibold mb-2">Registration Info</h4>

            {isExpired && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
                ⚠️ This PWD card has <strong>expired</strong>. Please visit your local PDAO to renew.
              </div>
            )}

            <table className="w-full text-sm text-gray-700">
              <tbody>
                {[{ label: 'PWD Number', value: registration.pwdNumber },
                  { label: 'Date Applied', value: appliedDate.toLocaleDateString() },
                  { label: 'Expires On', value: expiryDate.toLocaleDateString() },
                  { label: 'Validity', value: `${cardExpiration} ${cardExpiration > 1 ? 'years' : 'year'}` },
                  { label: 'Date of Birth', value: `${new Date(registration.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} (${getAge(registration.dob)} years old)` }].map(({ label, value }) => (
                  <tr className="border-t" key={label}>
                    <td className="py-2 font-medium">{label}</td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disability Summary */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg text-cyan-950 font-semibold mb-2">Disability Details</h4>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Type:</span>{' '}
              {registration.disability_type?.name || registration.disabilityTypes?.join(', ') || 'No disability type provided.'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Cause:</span>{' '}
              {registration.disability_cause?.name || registration.disabilityCauses?.join(', ') || 'No disability cause provided.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleViewCard}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded transition"
            >
              {cardLoading ? <FaSpinner className="animate-spin" /> : <FaIdCard />}
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

          {/* Modals */}
          <PWDInfoModal
            isOpen={isInfoOpen}
            registration={registration}
            onClose={() => setInfoOpen(false)}
          />
          <PWDCardModal
            isOpen={isCardOpen}
            cardUrl={cardUrl}
            loading={cardLoading}
            onClose={() => {
              setCardOpen(false);
              if (cardUrl) URL.revokeObjectURL(cardUrl);
            }}
          />
        </div>
      </div>
    </PWDLayout>
  );
}
