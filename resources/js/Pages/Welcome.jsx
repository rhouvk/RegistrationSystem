import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getDashboardRoute = (role) => {
        switch (role) {
            case 0:
                return 'pwd.dashboard';
            case 1:
                return 'admin.dashboard';
            case 2:
                return 'business.dashboard';
            case 3:
                return 'pharmacy.dashboard';
            default:
                return 'dashboard';
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
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 mb-2"> {/* Added mb-4 here */}
                                <img src="/images/logow1.png" alt="PWD NA'TO Logo" className="w-16 h-16" />
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

                        {/* Lettering */}
                        <img
                            src="/images/wplettering.png"
                            alt="PWD NA'TO Lettering"
                            className={`w-full lg:w-[110%] xl:w-[120%] max-w-none h-auto ${isMobile ? 'mt-12' : 'mt-10'}`} 
                        />

                        {/* Hero Section */}
                        <main className="w-full max-w-7xl flex flex-col items-center mt-4 gap-8 lg:flex-row lg:justify-start lg:items-end lg:-translate-x-5 xl:-translate-x-20">
                            <div className="text-center md:text-left max-w-md">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                                    Empowering PWDs Through Digital Innovation
                                </h2>
                                <p className="text-base md:text-lg text-white mb-2 leading-relaxed">
                                    Welcome to <strong>PWD NA'TO</strong> — a platform built to simplify
                                    ID validation, track benefits, and deliver accessible services to
                                    Persons with Disabilities.
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
                                    <Link
                                        href={route('register')}
                                        className="text-teal-700 font-semibold text-lg hover:scale-105 hover:text-white transition-transform duration-200 inline-flex items-center gap-2"
                                    >
                                        Get Started <span className="text-2xl">→</span>
                                    </Link>
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
                        <div className="flex justify-center mt-8 lg:absolute lg:bottom-0 lg:-right-8 xl:-right-16 lg:translate-y-8 z-30">
                            <Link
                                href={route('public.scan')}
                                className="group relative inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping transition" />
                                <img
                                    src="/images/wpscan.png"
                                    alt="Scan Icon"
                                    className="w-44 sm:w-56 md:w-72 lg:w-80 xl:w-96 transition duration-300 group-hover:scale-110 group-hover:hue-rotate-60 group-hover:saturate-150 relative z-10"
                                />
                            </Link>
                        </div>

                        {/* People Illustration */}
                        <div className="flex justify-center mt-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-48 lg:translate-x-8">
                            <img
                                src="/images/wppeople.png"
                                alt="PWD People Illustration"
                                className="w-full h-auto object-contain md:h-[50vh] md:max-h-[350px] lg:h-[60vh] lg:max-h-[400px] xl:h-[calc(100vh-150px)] xl:max-h-[500px] md:w-auto lg:w-auto xl:w-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}