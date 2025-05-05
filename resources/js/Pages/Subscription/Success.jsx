// File: resources/js/Pages/Subscription/Success.jsx

import { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';

export default function Success() {
  const { auth } = usePage().props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!auth?.user) return;
      const role = auth.user.role;
      const routes = {
        0: 'pwd.dashboard',
        1: 'admin.dashboard',
        2: 'business.dashboard',
        3: 'pharmacy.dashboard',
      };
      const destination = routes[role] || 'dashboard';
      window.location.href = route(destination);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [auth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <Head title="Payment Success" />
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">✅ Payment Successful!</h1>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
