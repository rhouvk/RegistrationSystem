import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
  return (
    <>
      <Head title="Welcome to PWD NA'TO" />
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-400 text-white">
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
          {/* HEADER */}
          <div className="w-full max-w-7xl flex justify-between items-center mb-10">
          <h1 className="flex items-center text-3xl font-extrabold tracking-tight space-x-3">
  <img src="/images/logow.png" alt="PWD NA'TO Logo" className="w-10 h-10 rounded-full shadow" />
  <span>PWD NA'TO</span>
</h1>
            <div className="flex space-x-4">
              {/* ✅ Public scan button available to ALL users */}
              <Link
                href={route('public.scan')}
                className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition"
              >
                Scan PWD Card
              </Link>

              {auth.user ? (() => {
                const dashRoute =
                  auth.user.role === 2 ? 'business.dashboard' :
                  auth.user.role === 1 ? 'admin.dashboard' :
                  auth.user.role === 0 ? 'pwd.dashboard' :
                  'dashboard';

                return (
                  <Link
                    href={route(dashRoute)}
                    className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition"
                  >
                    Dashboard
                  </Link>
                );
              })() : (
                <>
                  <Link
                    href={route('login')}
                    className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href={route('register')}
                    className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* HERO / MAIN SECTION */}
          <main className="w-full max-w-3xl text-center mt-10">
            <div className="bg-white text-gray-900 p-10 rounded-2xl shadow-xl">
              <h2 className="text-4xl font-bold mb-4 text-teal-700">
                Empowering PWDs Through Digital Innovation
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to <strong>PWD NA'TO</strong> — a platform built to simplify ID validation,
                track benefits, and deliver accessible services to Persons with Disabilities.
              </p>
              {!auth.user && (
                <div className="flex justify-center gap-4 mt-6">
                  <Link
                    href={route('register')}
                    className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href={route('login')}
                    className="bg-gray-100 text-teal-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
