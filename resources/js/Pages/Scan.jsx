import { Head, Link } from '@inertiajs/react';
import Scanner from '@/Components/Scanner';

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
          <div className="bg-white shadow rounded-xl w-full max-w-xl p-6">
            <Scanner />

            {/* Back Button */}
            <div className="mt-3 text-center">
              <Link
                href={route('welcome')}
                className="block w-full sm:w-auto max-w-md mx-auto px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-center transition-colors duration-200"
              >
                Back to Welcome
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
