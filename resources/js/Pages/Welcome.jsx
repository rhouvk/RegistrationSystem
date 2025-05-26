import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth }) {
    const [isMobile, setIsMobile] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Platform detection
    const isIOS = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        return isIOSDevice || (isSafari && /iphone|ipad|ipod/.test(userAgent));
    };
    const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('Install prompt available');
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if on iOS and not in standalone mode
        if (isIOS() && !isInStandaloneMode()) {
            console.log('iOS device detected');
        }

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
        setShowRegisterModal(true);
    };

    const handleInstallPWA = () => {
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
                                <img src="/images/logow1.png" alt="PWD NA'TO Logo" className="w-12 h-12 lg:w-16 lg:h-16" />
                            </div>
                            {!isMobile && (
                                <div className="flex space-x-4 ml-auto flex-nowrap">
                                    {auth.user ? (
                                        <Link
                                            href={route(getDashboardRoute(auth.user.role))}
                                            className="bg-white text-teal-700 font-semibold px-3 py-1.5 lg:px-5 lg:py-1.5 rounded-lg shadow hover:bg-teal-100 transition flex-shrink-0 text-sm lg:text-lg"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="bg-white text-teal-700 font-semibold px-3 py-1.5 lg:px-5 lg:py-1.5 rounded-lg shadow hover:bg-teal-100 transition 2xl:relative 2xl:left-24 flex-shrink-0 text-sm lg:text-lg"
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
                            className={`w-full lg:w-[100%] xl:w-[115%] max-w-none h-auto ${isMobile ? 'mt-8' : 'mt-6'}`}
                        />

                        {/* Hero Text Section */}
                        <main className="w-full max-w-5xl lg:max-w-7xl flex flex-col items-center mt-2 gap-4 lg:gap-8 lg:flex-row lg:justify-start lg:items-end lg:-translate-x-4 xl:-translate-x-20 relative z-20">
                            <div className="text-center md:text-left max-w-sm lg:max-w-lg relative z-20">
                                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 text-teal-700">
                                    Empowering PWDs Through Digital Innovation
                                </h2>
                                <p className="text-sm md:text-base lg:text-xl text-white mb-2 lg:mb-4 leading-relaxed">
                                    Welcome to <strong>PWD NA'TO</strong> — a platform built to simplify ID validation,
                                    track benefits, and deliver accessible services to Persons with Disabilities.
                                </p>

                                {isMobile && auth.user && (
                                    <Link
                                        href={route(getDashboardRoute(auth.user.role))}
                                        className="w-full bg-white text-teal-700 font-semibold px-4 py-2 lg:px-6 lg:py-3 rounded-lg shadow hover:bg-teal-100 transition inline-block mb-4 text-sm lg:text-lg"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {isMobile && !auth.user && (
                                    <Link
                                        href={route('login')}
                                        className="w-full bg-white text-teal-700 font-semibold px-4 py-2 lg:px-6 lg:py-3 rounded-lg shadow hover:bg-teal-100 transition inline-block mb-4 text-sm lg:text-lg"
                                    >
                                        Log in
                                    </Link>
                                )}

                                {!auth.user && (
                                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-6 items-center relative z-20">
                                        <button
                                            onClick={handleGetStarted}
                                            className="text-teal-700 font-semibold text-base lg:text-xl hover:scale-105 hover:text-white transition-transform duration-200 inline-flex items-center gap-2 cursor-pointer relative z-20"
                                        >
                                            Get Started <span className="text-xl lg:text-3xl"></span>
                                        </button>
                                        <button
                                            onClick={handleInstallPWA}
                                            className="bg-teal-700 text-white font-semibold px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-lg shadow hover:bg-teal-800 transition cursor-pointer relative z-20 text-sm lg:text-lg"
                                        >
                                            Install App
                                        </button>
                                    </div>
                                )}
                            </div>
                        </main>

                        {/* Scanner Icon */}
                        <div className="flex justify-center mt-4 lg:mt-8 lg:absolute lg:bottom-0 lg:-right-8 xl:-right-16 lg:translate-y-8 z-30">
                            <Link
                                href={route('public.scan')}
                                className="group relative inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping transition" />
                                <img
                                    src="/images/wpscan.png"
                                    alt="Scan Icon"
                                    className="w-28 sm:w-36 md:w-48 lg:w-72 xl:w-80 transition duration-300 group-hover:scale-110 group-hover:hue-rotate-60 group-hover:saturate-150 relative z-10"
                                />
                            </Link>
                        </div>

                        {/* People Illustration */}
                        <div className="flex justify-center mt-4 lg:mt-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-40 lg:translate-x-8">
                            <img
                                src="/images/wppeople.png"
                                alt="PWD People Illustration"
                                className="w-full h-auto object-contain md:h-[35vh] md:max-h-[250px] lg:h-[50vh] lg:max-h-[400px] xl:h-[55vh] xl:max-h-[450px] md:w-auto lg:w-auto xl:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Registration Modal */}
                {showRegisterModal && (
                    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden shadow-2xl transform transition-all">
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-teal-700 mb-2">Choose Account Type</h2>
                                    <p className="text-gray-600">Select how you want to register with PWD NA'TO</p>
                                </div>
                                <div className="space-y-4">
                                    <Link
                                        href={route('pwd.initial-registration')}
                                        className="block w-full bg-teal-700 text-white text-center py-3 px-4 rounded-lg hover:bg-teal-800 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Register as PWD</span>
                                        </div>
                                    </Link>
                                    <Link
                                        href={route('register.business')}
                                        className="block w-full bg-teal-700 text-white text-center py-3 px-4 rounded-lg hover:bg-teal-800 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>Register as Business/Pharmacy</span>
                                        </div>
                                    </Link>
                                </div>
                                <button
                                    onClick={() => setShowRegisterModal(false)}
                                    className="w-full mt-6 text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
