import { Head } from '@inertiajs/react';
import Scanner from '@/Components/Scanner'; // Reuse your existing scanner component

export default function ScanPage() {
  return (
    <>
      <Head title="Scan PWD Card" />
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

        {/* Foreground Content */}
        <div className="relative min-h-screen flex items-center justify-center px-4 py-10 z-10">
          <div className="bg-white shadow rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold text-center text-teal-700 mb-4">Scan PWD ID</h2>
            <Scanner />
          </div>
        </div>
      </div>
    </>
  );
}
