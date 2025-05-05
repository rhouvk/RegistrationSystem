import React, { useEffect } from 'react';
import {
  FaVolumeUp,
  FaVolumeDown,
  FaStop,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

export default function ConfirmBNPCModal({
  show,
  onCancel,
  onConfirm,
  processing = false,
  totalAmount,
  remainingBalance,
}) {
  if (!show) return null;

  const formatAmount = (amt) => parseFloat(amt).toFixed(2);

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
    const message = `Please confirm this transaction. The total amount is ${formatAmount(totalAmount)} pesos. The remaining balance will be ${formatAmount(remainingBalance)} pesos.`;
    speak(message, 'en-US');
  };

  const speakFilipino = () => {
    const message = `Paki kumpirma ang transaksiyon. Ang kabuuang halaga ay ${formatAmount(totalAmount)} pesos. Ang natitirang balanse ay ${formatAmount(remainingBalance)} pesos.`;
    speak(message, 'fil-PH');
  };

  // Automatically stop speech on modal close
  useEffect(() => {
    if (!show) stopSpeech();
  }, [show]);

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6 relative border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
          <FaMoneyBillWave className="text-xl" />
          Confirm Transaction
        </div>

        {/* Transaction Summary */}
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-gray-700">
            <strong>Grand Total:</strong> ₱{formatAmount(totalAmount)}
          </p> 
          <p className="flex items-center gap-2 text-gray-700">
            <strong>Remaining Balance:</strong> ₱{formatAmount(remainingBalance)}
          </p>
        </div>

        {/* TTS Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex flex-1 gap-2">
            <button
              onClick={speakEnglish}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              <FaVolumeUp /> English
            </button>
          </div>
          <div className="flex flex-1 gap-2">
            <button
              onClick={speakFilipino}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              <FaVolumeDown /> Filipino
            </button>
          </div>
          <button
              onClick={stopSpeech}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              <FaStop /> Stop
            </button>
        </div>

        {/* Action Buttons */}
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
