import { Link } from '@inertiajs/react';

export default function NavLinkW({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-m font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-cyan-400 text-white focus:border-cyan-700'
                    : 'border-transparent text-white hover:border-cyan-300 hover:text-gray-50 focus:border-cyan-700 focus:text-cyan-500') +
                className
            }
        >
            {children}
        </Link>
    );
}
