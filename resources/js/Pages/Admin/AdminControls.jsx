import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { FaLock, FaChevronDown, FaChevronUp, FaCog, FaListAlt, FaAccessibleIcon } from 'react-icons/fa';
import AdminLayout from '@/Layouts/AdminLayout';
import PasswordModal from '@/Components/PasswordModal';
import AdminBNPCItemEditor from '@/Components/AdminBNPCItemEditor';
import AdminDisabilityListEditor from '@/Components/AdminDisabilityListEditor';

export default function AdminControls({ control, bnpcItems = [], disabilityItems = [], success }) {
  const { data, setData, put, processing, errors } = useForm({
    password: '',
    purchaseLimit: control?.purchaseLimit || '',
    cardExpiration: control?.cardExpiration || '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [bnpcOpen, setBnpcOpen] = useState(false);
  const [disabilityOpen, setDisabilityOpen] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(false);
    put(route('admin.controls.update'), {
      preserveState: true,
      onSuccess: () => setData('password', ''),
    });
  };

  return (
    <AdminLayout header={<h2 className="font-semibold text-xl">Admin Controls</h2>}>
      <Head title="Admin Controls" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

          {/* PWD Policy Settings Section */}
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            {success && <div className="mb-4 text-teal-600">{success}</div>}
            <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
              <FaCog /> PWD Policy Settings
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Warning: Please consult the administration before making changes.
            </p>
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Limit</label>
                <input
                  type="number"
                  value={data.purchaseLimit}
                  onChange={(e) => setData('purchaseLimit', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
                />
                {errors.purchaseLimit && <div className="text-red-500 mt-1">{errors.purchaseLimit}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Expiration (Years)</label>
                <input
                  type="number"
                  value={data.cardExpiration}
                  onChange={(e) => setData('cardExpiration', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
                />
                {errors.cardExpiration && <div className="text-red-500 mt-1">{errors.cardExpiration}</div>}
              </div>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                <FaLock className="mr-2" />
                {processing ? 'Processing...' : 'Update Settings'}
              </button>
            </form>
          </div>

          {/* BNPC Items Management Section */}
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setBnpcOpen(!bnpcOpen)}
            >
              <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <FaListAlt /> Manage BNPC Items
              </h2>
              {bnpcOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              You can add or edit BNPC (Basic Necessities and Prime Commodities) items below.
            </p>

            {bnpcOpen && (
              <div className="mt-6">
                <AdminBNPCItemEditor items={bnpcItems} />
              </div>
            )}
          </div>

          {/* Manage Disability Types and Causes */}
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setDisabilityOpen(!disabilityOpen)}
            >
              <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <FaAccessibleIcon /> Manage Disability List
              </h2>
              {disabilityOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              You can add, edit, or remove Disability Types and Causes below.
            </p>

            {disabilityOpen && (
              <div className="mt-6">
                <AdminDisabilityListEditor disabilities={disabilityItems} />
              </div>
            )}
          </div>

        </div>
      </div>

      <PasswordModal
        show={showPasswordModal}
        password={data.password}
        onChange={(e) => setData('password', e.target.value)}
        onCancel={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordSubmit}
        processing={processing}
        errors={errors}
      />
    </AdminLayout>
  );
}
