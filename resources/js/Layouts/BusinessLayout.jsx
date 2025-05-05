import ApplicationLogo from '@/Components/ApplicationLogo';
import ApplicationLogoW from '@/Components/ApplicationLogoW';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NavLinkW from '@/Components/NavLinkW';
import { Link, usePage } from '@inertiajs/react';
import { FaHome, FaFileInvoice, FaClipboard } from 'react-icons/fa';
import { HiOutlineHome, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Top Navigation (Desktop Only) */}
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

            {/* Desktop Header Only */}
            {header && (
                <header className="hidden sm:block bg-white text-cyan-950 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}


            <main className="mt-12 sm:mt-0">{children}</main>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 border-t border-gray-200 shadow-md sm:hidden rounded-t-xl">
                <div className="flex justify-around items-center py-2">
                    <Link href={route('business.dashboard')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <HiOutlineHome className="h-6 w-6 mb-0.5" />
                        <span className="text-xs">Home</span>
                    </Link>

                    <Link href={route('business.bnpc-transactions.create')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <HiOutlineDocumentText className="h-6 w-6 mb-0.5" />
                        <span className="text-xs">Record</span>
                    </Link>

                    <Link href={route('business.sales-log')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <HiOutlineClipboardList className="h-6 w-6 mb-0.5" />
                        <span className="text-xs">Sales Log</span>
                    </Link>

                    <Link href={route('profile.edit')} className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <HiOutlineUserCircle className="h-6 w-6 mb-0.5" />
                        <span className="text-xs">Profile</span>
                    </Link>

                    <Link href={route('logout')} method="post" as="button" className="flex flex-col items-center text-cyan-800 hover:text-cyan-950">
                        <HiOutlineLogout className="h-6 w-6 mb-0.5" />
                        <span className="text-xs">Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
