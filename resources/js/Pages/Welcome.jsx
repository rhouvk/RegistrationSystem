import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth }) {
    const [isMobile, setIsMobile] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    // Platform detection
    const isIOS = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const getDashboardRoute = (role) => {
        switch (role) {
            case 0: return 'pwd.dashboard';
            case 1: return 'admin.dashboard';
            case 2: return 'business.dashboard';
            case 3: return 'pharmacy.dashboard';
            default: return 'dashboard';
        }
    };

    const handleGetStarted = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
                console.log(choice.outcome === 'accepted'
                    ? '✅ User accepted the install prompt'
                    : '❌ User dismissed the install prompt');
                setDeferredPrompt(null);
            });
        } else if (isIOS() && !isInStandaloneMode()) {
            setShowIOSPrompt(true);
        } else {
            window.location.href = route('register');
        }
    };

    return (
        <>
            <Head title="Welcome to PWD NA 'TO" />
            <div className="relative min-h-screen text-white overflow-hidden">
                {/* Radial Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-8">
                    <div className="w-full max-w-7xl relative flex flex-col items-center mb-10">
                        {/* Header */}
                        <div className="w-full flex justify-between items-center relative px-4">
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 mb-2">
                                <img src="/images/logow1.png" alt="PWD NA'TO Logo" className="w-14 h-14" />
                            </div>
                            {!isMobile && (
                                <div className="flex space-x-4 ml-auto flex-nowrap">
                                    {auth.user ? (
                                        <Link
                                            href={route(getDashboardRoute(auth.user.role))}
                                            className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition flex-shrink-0"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-teal-100 transition 2xl:relative 2xl:left-24 flex-shrink-0"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Lettering Image */}
                        <img
                            src="/images/wplettering.png"
                            alt="PWD NA'TO Lettering"
                            className={`w-full lg:w-[100%] xl:w-[110%] max-w-none h-auto ${isMobile ? 'mt-10' : 'mt-8'}`}
                        />

                        {/* Hero Text Section */}
                        <main className="w-full max-w-6xl flex flex-col items-center mt-2 gap-6 lg:flex-row lg:justify-start lg:items-end lg:-translate-x-4 xl:-translate-x-16">
                            <div className="text-center md:text-left max-w-sm">
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-teal-700">
                                    Empowering PWDs Through Digital Innovation
                                </h2>
                                <p className="text-sm md:text-base text-white mb-2 leading-relaxed">
                                    Welcome to <strong>PWD NA'TO</strong> — a platform built to simplify ID validation,
                                    track benefits, and deliver accessible services to Persons with Disabilities.
                                </p>

                                {isMobile && !auth.user && (
                                    <Link
                                        href={route('login')}
                                        className="w-full bg-white text-teal-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-100 transition inline-block mb-4"
                                    >
                                        Log in
                                    </Link>
                                )}

                                {!auth.user && (
                                    <button
                                        onClick={handleGetStarted}
                                        className="text-teal-700 font-semibold text-lg hover:scale-105 hover:text-white transition-transform duration-200 inline-flex items-center gap-2"
                                    >
                                        Get Started <span className="text-2xl">→</span>
                                    </button>
                                )}

                                {isMobile && auth.user && (
                                    <Link
                                        href={route(getDashboardRoute(auth.user.role))}
                                        className="w-full bg-white text-teal-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-100 transition inline-block mb-4"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </main>

                        {/* Scanner Icon */}
                        <div className="flex justify-center mt-6 lg:absolute lg:bottom-0 lg:-right-6 xl:-right-12 lg:translate-y-6 z-30">
                            <Link
                                href={route('public.scan')}
                                className="group relative inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping transition" />
                                <img
                                    src="/images/wpscan.png"
                                    alt="Scan Icon"
                                    className="w-36 sm:w-48 md:w-64 lg:w-72 xl:w-80 transition duration-300 group-hover:scale-110 group-hover:hue-rotate-60 group-hover:saturate-150 relative z-10"
                                />
                            </Link>
                        </div>

                        {/* People Illustration */}
                        <div className="flex justify-center mt-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-40 lg:translate-x-6">
                            <img
                                src="/images/wppeople.png"
                                alt="PWD People Illustration"
                                className="w-full h-auto object-contain md:h-[45vh] md:max-h-[300px] lg:h-[50vh] lg:max-h-[350px] xl:h-[calc(100vh-180px)] xl:max-h-[450px] md:w-auto lg:w-auto xl:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* iOS Install Modal */}
                {showIOSPrompt && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white text-center p-6 rounded-xl max-w-sm w-full shadow-lg">
                            <h2 className="text-xl font-bold text-teal-700 mb-4">Install PWD NA 'TO</h2>
                            <p className="text-gray-800">
                                To install this app, tap the <strong>Share</strong> icon in Safari and select{' '}
                                <strong>Add to Home Screen</strong>.
                            </p>
                            <button
                                className="mt-6 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
                                onClick={() => setShowIOSPrompt(false)}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
