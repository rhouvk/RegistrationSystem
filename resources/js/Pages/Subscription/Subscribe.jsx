import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import BusinessLayout from '@/Layouts/BusinessLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import PWDLayout from '@/Layouts/PWDLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import Modal from '@/Components/Modal';

export default function Subscribe() {
  const { auth } = usePage().props;
  const user = auth.user;

  const [duration, setDuration] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubscription = async () => {
    setLoading(true);
    setShowModal(false);
    setError(null);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      const response = await fetch('/paymongo/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          user_id: user.id,
          duration: duration,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const layoutMap = {
    3: PharmacyLayout,
    2: BusinessLayout,
    1: AdminLayout,
    0: PWDLayout,
  };

  const Layout = layoutMap[auth.user.role] || GuestLayout;

  return (
    <Layout>
      <Head title="Subscribe" />
      <div className="min-h-screen flex flex-col justify-start items-center pt-20 px-4 ">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          Choose Your Plan
        </h2>
        <p className="text-center text-gray-700 text-sm max-w-xl mb-10">
          Upgrade and unlock analytics with one of our tailored plans.
        </p>

        <form onSubmit={handleSubscribe} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Monthly Plan */}
          <div className={`flex flex-col justify-between p-6 h-80 border-2 rounded-2xl shadow-lg bg-gradient-to-br from-teal-700 to-sky-700 text-white ${duration === 'monthly' ? 'border-white' : 'border-transparent'}`}>
            <div className="flex flex-col items-center space-y-2">
              <FaClock className="text-4xl" />
              <h3 className="text-xl font-semibold">Monthly</h3>
              <p className="text-2xl font-bold">₱25</p>
              <p className="text-sm text-center text-white/90">Ideal for short-term access to analytics and features.</p>
            </div>
            <button type="submit" onClick={() => setDuration('monthly')} className="mt-4 px-4 py-2 bg-white hover:bg-gray-100 text-teal-800 font-semibold rounded">
              Subscribe
            </button>
          </div>

          {/* Semiannual Plan */}
          <div className={`flex flex-col justify-between p-6 h-80 border-2 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-700 to-lime-700 text-white ${duration === 'semiannual' ? 'border-white' : 'border-transparent'}`}>
            <div className="flex flex-col items-center space-y-2">
              <FaCalendarAlt className="text-4xl" />
              <h3 className="text-xl font-semibold">6 Months</h3>
              <p className="text-2xl font-bold">₱120</p>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full mt-1">Save 20%</span>
              <p className="text-sm text-center text-white/90">Best value for frequent users of the platform.</p>
            </div>
            <button type="submit" onClick={() => setDuration('semiannual')} className="mt-4 px-4 py-2 bg-white hover:bg-gray-100 text-emerald-800 font-semibold rounded">
              Subscribe
            </button>
          </div>

          {/* Annual Plan */}
          <div className={`flex flex-col justify-between p-6 h-80 border-2 rounded-2xl shadow-lg bg-gradient-to-br from-green-700 to-lime-600 text-white ${duration === 'annual' ? 'border-white' : 'border-transparent'}`}>
            <div className="flex flex-col items-center space-y-2">
              <FaCheckCircle className="text-4xl" />
              <h3 className="text-xl font-semibold">1 Year</h3>
              <p className="text-2xl font-bold">₱225</p>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full mt-1">Save 25%</span>
              <p className="text-sm text-center text-white/90">Perfect for long-term users who want peace of mind.</p>
            </div>
            <button type="submit" onClick={() => setDuration('annual')} className="mt-4 px-4 py-2 bg-white hover:bg-gray-100 text-green-800 font-semibold rounded">
              Subscribe
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 mt-6 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-teal-700">Before You Continue</h2>
            <p className="text-sm text-gray-700">
              Once payment is made, <strong>no refunds</strong> will be processed. For concerns, email <strong>pwdnato@gmail.com</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Cancel</button>
              <button onClick={confirmSubscription} className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded">Agree & Continue</button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
