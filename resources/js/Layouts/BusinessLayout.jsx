import ApplicationLogo from '@/Components/ApplicationLogo';
import ApplicationLogoW from '@/Components/ApplicationLogoW';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NavLinkW from '@/Components/NavLinkW';
import { Link, usePage } from '@inertiajs/react';
import { FaHome, FaFileInvoice, FaClipboard, } from 'react-icons/fa';

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
                                <NavLinkW href={route('business.dashboard')} active={route().current('business.dashboard')}>
                                    <div className="flex items-center gap-1">
                                        <FaHome />
                                        Dashboard
                                    </div>
                                </NavLinkW>
                                <NavLinkW href={route('business.bnpc-transactions.create')} active={route().current('business.bnpc-transactions.create')}>
                                    <div className="flex items-center gap-1">
                                        <FaFileInvoice />
                                        Record
                                    </div>
                                </NavLinkW>
                                <NavLinkW href={route('business.sales-log')} active={route().current('business.sales-log')}>
                                    <div className="flex items-center gap-1">
                                        <FaClipboard />
                                        Sales Log
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
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-teal-500 hover:text-cyan-800"
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
{/* Bottom Navigation (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 border-t border-gray-200 shadow-md sm:hidden rounded-t-xl">
            <div className="flex justify-around items-center py-2">
                <Link href={route('business.dashboard')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                    <path d="M9 22V12h6v10" />
                </svg>
                <span className="text-xs">Home</span>
                </Link>

                <Link href={route('business.bnpc-transactions.create')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                <span className="text-xs">Record</span>
                </Link>

                <Link href={route('business.sales-log')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 00-1.125 1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                <span className="text-xs">Sales Log</span>
                </Link>

                <Link href={route('profile.edit')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs">Profile</span>
                </Link>

                <Link href={route('logout')} method="post" as="button" className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    <path d="M13 15v1m0-1V5m0 0V4m0 1v1" />
                </svg>
                <span className="text-xs">Logout</span>
                </Link>
            </div>
            </div>

        </div>
    );
}
