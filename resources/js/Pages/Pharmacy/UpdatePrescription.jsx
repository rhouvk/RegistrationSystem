import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import PharmacyLayout from '@/Layouts/PharmacyLayout';
import Scanner from '@/Components/Scanner';
import { FaSearch, FaIdCard, FaArrowRight } from 'react-icons/fa';
import PrescriptionUpdateLookup from '@/Components/PrescriptionUpdateLookup';
import PrescriptionUpdateForm from '@/Components/PrescriptionUpdateForm';


export default function UpdatePrescription() {
  const { flash = {}, pwdUser = null, fillings = [] } = usePage().props;
  const [lookupNumber, setLookupNumber] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [pharmacistName, setPharmacistName] = useState('');
  const [filledQty, setFilledQty] = useState(0);
  const [selectedFillingId, setSelectedFillingId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 👈 ADD THIS
  

  const handleLookup = (e) => {
    e.preventDefault();
    router.visit(route('pharmacy.prescriptions.update.create'), {
      data: { pwd_number: lookupNumber },
      preserveState: true,
      preserveScroll: false,
    });
  };

  const handleStartUpdate = (idx, filling) => {
    setOpenIndex(idx);
    setFilledQty(filling.remaining_amount || 0);
    setSelectedFillingId(filling.id);
  };

  const handleConfirmFill = () => {
    if (!selectedFillingId || filledQty <= 0 || !pharmacistName.trim()) return;

    router.post(route('pharmacy.prescriptions.update'), {
      pharmacist_name: pharmacistName,
      updates: [{ id: selectedFillingId, quantity_filled: filledQty }],
    }, {
      onSuccess: () => {
        setOpenIndex(null);
        setSelectedFillingId(null);
        setPharmacistName('');
        setFilledQty(0);
      }
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return 'First Fill';
      case 2: return 'Second Fill';
      case 3: return 'Third Fill';
      default: return 'Unknown';
    }
  };

  if (!pwdUser) {
    return (
      <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Update Prescription Fill</h2>}>
        <Head title="Lookup for Update" />
        <PrescriptionUpdateLookup
          lookupNumber={lookupNumber}
          setLookupNumber={setLookupNumber}
          showScanner={showScanner}
          setShowScanner={setShowScanner}
          flash={flash}
          handleLookup={handleLookup}
        />
      </PharmacyLayout>
    );
  }
  
  return (
    <PharmacyLayout header={<h2 className="text-xl font-semibold leading-tight">Update Prescription Fill</h2>}>
      <Head title="Update Fill" />
            <PrescriptionUpdateForm
        pwdUser={pwdUser}
        fillings={fillings}
        openIndex={openIndex}
        pharmacistName={pharmacistName}
        filledQty={filledQty}
        handleStartUpdate={handleStartUpdate}
        handleConfirmFill={handleConfirmFill} // Can be kept for legacy fallback
        setPharmacistName={setPharmacistName}
        setFilledQty={setFilledQty}
        setOpenIndex={setOpenIndex}
        getStatusLabel={getStatusLabel}
        showModal={showModal}
        setShowModal={setShowModal}
        onConfirm={handleConfirmFill}
      />

    </PharmacyLayout>
  );
  
}
