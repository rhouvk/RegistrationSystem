import { Head, usePage } from '@inertiajs/react';
import AdminLayout   from '@/Layouts/AdminLayout';
import PWDLayout     from '@/Layouts/PWDLayout';
import BusinessLayout     from '@/Layouts/BusinessLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm           from './Partials/UpdatePasswordForm';
import DeleteUserForm               from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status }) {
  const { auth } = usePage().props;

  // map role‐IDs to layouts:
  const layoutMap = {
    2: BusinessLayout,
    1: AdminLayout,
    0: PWDLayout,
  };

  // pick the layout; if no match, fall back to GuestLayout (or AuthenticatedLayout)
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
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
