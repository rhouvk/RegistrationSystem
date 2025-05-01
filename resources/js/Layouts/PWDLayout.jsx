import ApplicationLogo from '@/Components/ApplicationLogo';
import ApplicationLogoW from '@/Components/ApplicationLogoW';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NavLinkW from '@/Components/NavLinkW';
import { Link, usePage } from '@inertiajs/react';
import { FaHome, FaStore, FaPills } from 'react-icons/fa';

import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Top Navigation (Desktop) */}
            <nav className="border-b border-gray-100 bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 hidden sm:block">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <ApplicationLogoW className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                            <div className="hidden sm:ml-10 sm:flex space-x-8">
                                <NavLinkW href={route('pwd.dashboard')} active={route().current('pwd.dashboard')}>
                                    <div className="flex items-center gap-1">
                                        <FaHome />
                                        Dashboard
                                    </div>
                                </NavLinkW>
                                <NavLinkW href={route('pwd.bnpc-purchases.index')} active={route().current('pwd.bnpc-purchases.index')}>
                                    <div className="flex items-center gap-1">
                                        <FaStore />
                                        BNPC Purchases
                                    </div>
                                </NavLinkW>
                                <NavLinkW href={route('pwd.medicine-purchases.index')} active={route().current('pwd.medicine-purchases.index')}>
                                    <div className="flex items-center gap-1">
                                        <FaPills />
                                        Medicine Purchases
                                    </div>
                                </NavLinkW>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-teal-500 hover:text-teal-800"
                                        >
                                            {user.name}
                                            <svg
                                                className="ml-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Responsive Top Bar (Mobile Only) */}
            <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyan-600 via-sky-700 to-teal-800 text-white shadow-md py-2 flex items-center justify-center text-lg font-semibold">
                <ApplicationLogoW className="h-6 w-auto mr-2" />
                <span>PWD NA' TO</span>
            </div>

            {/* Keep original header */}
            {header && (
                <header className="bg-white text-cyan-950 shadow mt-12 sm:mt-0">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 border-t border-gray-200 shadow-md sm:hidden rounded-t-xl">
                <div className="flex justify-around items-center py-2">
                    <Link href={route('pwd.dashboard')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10" />
                        </svg>
                        <span className="text-xs">Home</span>
                    </Link>

                    <Link href={route('pwd.bnpc-purchases.index')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                        <span className="text-xs">BNPC</span>
                    </Link>

                    <Link href={route('pwd.medicine-purchases.index')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-xs">Medicine</span>
                    </Link>

                    <Link href={route('profile.edit')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">Profile</span>
                    </Link>

                    <Link href={route('logout')} method="post" as="button" className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-1V5m0 0V4m0 1v1" />
                        </svg>
                        <span className="text-xs">Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
