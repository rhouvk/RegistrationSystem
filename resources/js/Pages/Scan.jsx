import { Head } from '@inertiajs/react';
import Scanner from '@/Components/Scanner'; // Reuse your existing scanner component

export default function ScanPage() {
  return (
    <>
      <Head title="Scan PWD Card" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white shadow rounded-xl w-full max-w-2xl p-6">
          <Scanner />
        </div>
      </div>
    </>
  );
}
