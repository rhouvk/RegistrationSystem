import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogoW from '@/Components/ApplicationLogoW';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                {/* Radial Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

                {/* Login Container */}
                <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-6">
                        <ApplicationLogo className="w-14 h-14 mb-2" />
                        <h1 className="text-xl font-bold text-teal-800 tracking-wide">PWD NA 'TO</h1>
                        <p className="text-sm text-gray-500">Login to your account</p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 pt-2">
                            <PrimaryButton className="w-full" disabled={processing}>
                                Log in
                            </PrimaryButton>
                            <Link href="/" className="text-sm text-gray-600 underline hover:text-gray-900">
                                Back to Welcome
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
