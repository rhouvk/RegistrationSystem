import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';

export default function Cancel() {
  const { auth } = usePage().props;

  useEffect(() => {
    const timer = setTimeout(() => {
      const role = auth?.user?.role;
      let path = '/';

      if (role === 0) path = route('pwd.dashboard');
      else if (role === 1) path = route('admin.dashboard');
      else if (role === 2) path = route('business.dashboard');
      else if (role === 3) path = route('pharmacy.dashboard');

      window.location.href = path;
    }, 3000);

    return () => clearTimeout(timer);
  }, [auth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <Head title="Payment Cancelled" />
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-700">Your subscription transaction was cancelled or failed.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to your dashboard…</p>
      </div>
    </div>
  );
}