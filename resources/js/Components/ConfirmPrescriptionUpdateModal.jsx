import React, { useEffect } from 'react';
import { FaCheck, FaTimes, FaVolumeUp, FaVolumeDown, FaStop, FaCapsules } from 'react-icons/fa';

export default function ConfirmPrescriptionUpdateModal({
  onConfirm,
  onCancel,
  pharmacistName,
  filledQty,
  medicineName,
  show = true,
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
    const message = `Please confirm the prescription. Medicine: ${medicineName}. Filled quantity: ${filledQty}. Pharmacist: ${pharmacistName}.`;
    speak(message, 'en-US');
  };

  const speakFilipino = () => {
    const message = `Paki kumpirma ang reseta. Gamot: ${medicineName}. Dami na kinuha: ${filledQty}. Parmasista: ${pharmacistName}.`;
    speak(message, 'fil-PH');
  };

  useEffect(() => {
    if (!show) stopSpeech();
  }, [show]);

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-6 relative border">
      <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
          <FaCapsules /> Confirm Fill
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Medicine:</strong> {medicineName}</p>
          <p><strong>Filled Quantity:</strong> {filledQty}</p>
          <p><strong>Pharmacist:</strong> {pharmacistName}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button
            onClick={speakEnglish}
            className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            <FaVolumeUp /> English
          </button>
          <button
            onClick={speakFilipino}
            className="flex-1 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            <FaVolumeDown /> Filipino
          </button>
          <button
            onClick={stopSpeech}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            <FaStop /> Stop
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            onClick={() => {
              stopSpeech();
              onCancel();
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={() => {
              stopSpeech();
              onConfirm();
            }}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2"
          >
            <FaCheck /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
