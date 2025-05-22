import React, { useEffect } from 'react';
import { FaCheck, FaTimes, FaVolumeUp, FaStop, FaFilePrescription } from 'react-icons/fa';

export default function ConfirmPrescriptionModal({
  show,
  onCancel,
  onConfirm,
  entries = [],
  processing = false,
}) {
  if (!show) return null;

  const stopSpeech = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
  };

  const speak = (message, lang) => {
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  const speakEnglish = () => {
    const message = entries.map((entry, i) =>
      `Prescription ${i + 1}: ${entry.medicine_purchase}, prescribed ${entry.quantity_prescribed}, filled now ${entry.quantity_filled}.`
    ).join(' ');
    speak(`Please confirm the following prescriptions. ${message}`, 'en-US');
  };

  useEffect(() => {
    if (!show) stopSpeech();
  }, [show]);

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-6 relative border">
        <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
          <FaFilePrescription className="text-xl" /> Confirm Prescription
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {entries.map((entry, i) => (
            <div key={i} className="text-sm border-b pb-2">
              <p><strong>Medicine:</strong> {entry.medicine_purchase}</p>
              <p><strong>Prescribed:</strong> {entry.quantity_prescribed}</p>
              <p><strong>Filled Now:</strong> {entry.quantity_filled}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={speakEnglish}
            className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            <FaVolumeUp /> English
          </button>
          <button
            onClick={stopSpeech}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            <FaStop /> Stop
          </button>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            onClick={() => {
              stopSpeech();
              onCancel();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={() => {
              stopSpeech();
              onConfirm();
            }}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
          >
            <FaCheck /> {processing ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
