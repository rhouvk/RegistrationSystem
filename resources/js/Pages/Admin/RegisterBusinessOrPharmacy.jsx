import { useForm, Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RegisterBusinessOrPharmacy() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '2', // default to Business
    representative_name: '',
    location: '',
    relevant_document: null,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register.bp'), {
      onSuccess: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AdminLayout>
      <Head title="Register Business / Pharmacy" />

      <div className="py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-center mb-6">
            Register as Business or Pharmacy
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <InputLabel htmlFor="role" value="User Type" />
              <select
                id="role"
                name="role"
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded"
              >
                <option value="2">Business</option>
                <option value="3">Pharmacy</option>
              </select>
              <InputError message={errors.role} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="name" value="Name" />
              <TextInput
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                name="phone"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.phone} className="mt-2" />
            </div>

            {data.role === '2' && (
              <>
                <div>
                  <InputLabel htmlFor="representative_name" value="Representative Name" />
                  <TextInput
                    id="representative_name"
                    name="representative_name"
                    value={data.representative_name}
                    onChange={(e) => setData('representative_name', e.target.value)}
                    className="mt-1 block w-full"
                  />
                  <InputError message={errors.representative_name} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="location" value="Location" />
                  <TextInput
                    id="location"
                    name="location"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    className="mt-1 block w-full"
                  />
                  <InputError message={errors.location} className="mt-2" />
                </div>
              </>
            )}

            <div>
              <InputLabel htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.password} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
              <TextInput
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="relevant_document" value="Relevant Documents (PDF only)" />
              <input
                type="file"
                id="relevant_document"
                accept="application/pdf"
                onChange={(e) => setData('relevant_document', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <InputError message={errors.relevant_document} className="mt-2" />
            </div>

            <PrimaryButton className="w-full mt-4" disabled={processing}>
              Register
            </PrimaryButton>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
