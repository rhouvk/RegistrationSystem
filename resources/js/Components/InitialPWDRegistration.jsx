import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import RequiredDocumentsModal from './RequiredDocumentsModal';

export default function InitialPWDRegistration() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        dob: '',
        sex: '',
        civilStatus: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const capitalizeFirstLetter = (value) => {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const handleNameChange = (field, value) => {
        setData(field, capitalizeFirstLetter(value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pwd.initial-registration.store'));
    };

    return (
        <div className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-6 py-4">
                        <h2 className="text-2xl font-bold text-center text-white">
                            Initial PWD Registration
                        </h2>
                        <p className="mt-2 text-sm text-white/90 text-center">
                            Please provide your basic information to start the registration process
                        </p>
                    </div>

                    <div className="p-4 sm:p-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                {/* Contact Information Section */}
                                <div className="lg:col-span-2 mt-2">
                                    <h3 className="text-base font-medium text-gray-900 mb-3">Account Information</h3>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            placeholder="juandelacruz@email.com"
                                            onChange={e => setData('email', e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="09XXXXXXXXX"
                                        maxLength="11"  // This limits the input to 11 digits
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}  // Removes non-digit characters and limits to 11 digits
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    />
                                    {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                </div>

                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                        Confirm Password *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm your password"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.password_confirmation && <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>}
                                    </div>
                                </div>

                                {/* Personal Information Section */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-base font-medium text-gray-900 mb-3">Personal Information</h3>
                                </div>

                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        First Name *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            required
                                            value={data.first_name}
                                            onChange={e => handleNameChange('first_name', e.target.value)}
                                            placeholder="Juan"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                                        Middle Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="middle_name"
                                            name="middle_name"
                                            type="text"
                                            value={data.middle_name}
                                            onChange={e => handleNameChange('middle_name', e.target.value)}
                                            placeholder="Santos"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.middle_name && <div className="text-red-500 text-sm mt-1">{errors.middle_name}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Last Name *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            required
                                            value={data.last_name}
                                            onChange={e => handleNameChange('last_name', e.target.value)}
                                            placeholder="Dela Cruz"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="suffix" className="block text-sm font-medium text-gray-700">
                                        Suffix
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="suffix"
                                            name="suffix"
                                            type="text"
                                            value={data.suffix}
                                            onChange={e => setData('suffix', e.target.value)}
                                            placeholder="e.g. Jr, II, III, IV"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.suffix && <div className="text-red-500 text-sm mt-1">{errors.suffix}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                        Date of Birth *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            required
                                            value={data.dob}
                                            onChange={e => setData('dob', e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        />
                                        {errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                        Sex *
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="sex"
                                            name="sex"
                                            required
                                            value={data.sex}
                                            onChange={e => setData('sex', e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        >
                                            <option value="">Select sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.sex && <div className="text-red-500 text-sm mt-1">{errors.sex}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-700">
                                        Civil Status *
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="civilStatus"
                                            name="civilStatus"
                                            required
                                            value={data.civilStatus}
                                            onChange={e => setData('civilStatus', e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        >
                                            <option value="">Select civil status</option>
                                            {['Single', 'Married', 'Widowed', 'Separated', 'Cohabitation'].map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.civilStatus && <div className="text-red-500 text-sm mt-1">{errors.civilStatus}</div>}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 mt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                    >
                                        {processing ? 'Processing...' : 'Continue to Additional Information'}
                                    </button>
                                </div>

                                <div className="lg:col-span-2 text-center mt-4">
                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-sm text-teal-600 hover:text-teal-800 transition-colors duration-200 underline"
                                        >
                                            What to Bring After Initial Registration?
                                        </button>
                                        <Link
                                            href={route('welcome')}
                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                        >
                                            Back to Welcome
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <RequiredDocumentsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
} 