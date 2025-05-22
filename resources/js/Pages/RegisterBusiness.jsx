import { useForm, Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function RegisterBusiness() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '2', // Default to Business
    representative_name: '',
    location: '',
    relevant_document: null,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register.business.store'), {
      onSuccess: () => {
        reset('password', 'password_confirmation');
        window.location.href = route('login');
      },
    });
  };

  return (
    <div className="min-h-screen relative">
      <Head title="Register Business / Pharmacy" />

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-center text-white">
                Register Your Business or Pharmacy
              </h2>
            </div>

            {/* Form Section */}
            <div className="p-6">
              <form onSubmit={submit} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <InputLabel htmlFor="role" value="Register as" />
                  <select
                    id="role"
                    name="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="2">Business</option>
                    <option value="3">Pharmacy</option>
                  </select>
                  <InputError message={errors.role} className="mt-2" />
                </div>

                {/* Main Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="name" value={data.role === '2' ? "Business Name" : "Pharmacy Name"} />
                    <TextInput
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="mt-1 block w-full"
                      required
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
                      required
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
                      required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="representative_name" value="Representative Name" />
                    <TextInput
                      id="representative_name"
                      name="representative_name"
                      value={data.representative_name}
                      onChange={(e) => setData('representative_name', e.target.value)}
                      className="mt-1 block w-full"
                      required
                    />
                    <InputError message={errors.representative_name} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="location" value={data.role === '2' ? "Business Location" : "Pharmacy Location"} />
                    <TextInput
                      id="location"
                      name="location"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      className="mt-1 block w-full"
                      required
                    />
                    <InputError message={errors.location} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                      id="password"
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="mt-1 block w-full"
                      required
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
                      required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <InputLabel 
                    htmlFor="relevant_document" 
                    value={data.role === '2' ? "Business Documents (PDF only)" : "Pharmacy License (PDF only)"} 
                  />
                  <input
                    type="file"
                    id="relevant_document"
                    accept="application/pdf"
                    onChange={(e) => setData('relevant_document', e.target.files[0])}
                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  <InputError message={errors.relevant_document} className="mt-2" />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center mt-6">
                  <PrimaryButton 
                    className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-md transition-all duration-200" 
                    disabled={processing}
                  >
                    {data.role === '2' ? 'Register Business' : 'Register Pharmacy'}
                  </PrimaryButton>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-4">
                  <Link
                    href={route('welcome')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Back to Home
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 