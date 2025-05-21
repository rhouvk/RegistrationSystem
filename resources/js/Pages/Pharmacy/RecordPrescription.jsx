// resources/js/Pages/Pharmacy/RecordPrescription.jsx
import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import Scanner from '@/Components/Scanner';
import PrescriptionLookup from '@/Components/PrescriptionLookup'; // ✅ THIS LINE
import PrescriptionForm from '@/Components/PrescriptionForm';     // ✅ If using the form component too
import { FaSearch, FaIdCard, FaTrash, FaPlus } from 'react-icons/fa';


export default function RecordPrescription() {
  const {
    pwdUser = null,
    flash = {},
    errors = {},
    expiryDate = null,
    isExpired = false
  } = usePage().props;

  const [lookupNumber, setLookupNumber] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    date: new Date().toISOString().split('T')[0],
    buyer_id: pwdUser?.user_id || '',
    physician_name: '',
    physician_address: '',
    physician_ptr_no: '',
    pharmacist_name: '',
    entries: [
      { medicine_purchase: '', quantity_prescribed: '', quantity_filled: '' },
    ],
  });

  useEffect(() => {
    if (pwdUser?.user_id) setData('buyer_id', pwdUser.user_id);
  }, [pwdUser]);

  const addMedicine = () => {
    setData('entries', [
      ...data.entries,
      { medicine_purchase: '', quantity_prescribed: '', quantity_filled: '' },
    ]);
  };

  const removeMedicine = (index) => {
    const updated = [...data.entries];
    updated.splice(index, 1);
    setData('entries', updated);
  };

  const handleChange = (i, field, value) => {
    const updated = [...data.entries];
    updated[i][field] = value;
    setData('entries', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('pharmacy.prescriptions.store'), {
      onSuccess: () => {
        router.visit(route('pharmacy.prescriptions.log'));
      },
    });
  };

  const handleLookup = (e) => {
    e.preventDefault();
    router.visit(route('pharmacy.prescriptions.create'), {
      data: { pwd_number: lookupNumber },
      preserveState: true,
      preserveScroll: false,
    });
  };

  if (!pwdUser) {
    return (
      <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Record a Prescription</h2>}>
        <Head title="Lookup PWD" />
        <PrescriptionLookup
          lookupNumber={lookupNumber}
          setLookupNumber={setLookupNumber}
          handleLookup={handleLookup}
          showScanner={showScanner}
          setShowScanner={setShowScanner}
          flash={flash}
          router={router}
        />
      </PharmacyLayout>
    );
  }
  
  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Record Prescription</h2>}>
      <Head title="Prescription Entry" />
      <PrescriptionForm
        data={data}
        setData={setData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        addMedicine={addMedicine}
        removeMedicine={removeMedicine}
        flash={flash}
        errors={errors}
        processing={processing}
        pwdUser={pwdUser}
        expiryDate={expiryDate}
        isExpired={isExpired}
      />
    </PharmacyLayout>
  );}
