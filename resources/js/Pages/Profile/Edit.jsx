import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PWDLayout from '@/Layouts/PWDLayout';
import BusinessLayout from '@/Layouts/BusinessLayout';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status }) {
  const { auth } = usePage().props;

  const layoutMap = {
    3: PharmacyLayout,
    2: BusinessLayout,
    1: AdminLayout,
    0: PWDLayout,
  };

  const Layout = layoutMap[auth.user.role] || GuestLayout;

  return (
    <Layout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>
          {/* ✅ Logout Section Left-Aligned */}
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-6">
  <div className="flex flex-col items-start space-y-2">
    <span className="text-sm text-gray-600">Click below to end your session:</span>
    <Link
      href={route('logout')}
      method="post"
      as="button"
      className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Log Out
    </Link>
  </div>
</div>

        </div>
      </div>
    </Layout>
  );
}
