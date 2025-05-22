import React from 'react';
import { Head } from '@inertiajs/react';
import InitialPWDRegistration from '@/Components/InitialPWDRegistration';

export default function InitialRegistration() {
    return (
        <div className="min-h-screen relative">
            <Head title="Initial PWD Registration" />

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

            <div className="relative z-10">
                <InitialPWDRegistration />
            </div>
        </div>
    );
} 