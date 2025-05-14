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
  discount = 0, // ← Add this line
}) {
  if (!show) return null;

 const discountedAmount = parseFloat(totalAmount) * (1 - parseFloat(discount) / 100);
  const discountedAmountFixed = discountedAmount.toFixed(2);

    const stopSpeech = () => {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }
    };

    const formatAmount = (amt) => parseFloat(amt).toFixed(2);

    const speak = (message, lang) => {
        stopSpeech();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    };

    const speakEnglish = () => {
        const message = `Please confirm this transaction. The total amount is ${formatAmount(
            totalAmount
        )} pesos. The discount is ${discount} percent. The remaining balance will be ${formatAmount(remainingBalance)} pesos.`;
        speak(message, 'en-US');
    };

    const speakFilipino = () => {
        const message = `Paki kumpirma ang transaksiyon. Ang kabuuang halaga ay ${formatAmount(
            totalAmount
        )} pesos. Ang diskwento ay ${discount} porsyento. Ang natitirang balanse ay ${formatAmount(remainingBalance)} pesos.`;
        speak(message, 'fil-PH');
    };

    // Automatically stop speech on modal close
    useEffect(() => {
        if (!show) stopSpeech();
    }, [show]);

 return (
    <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-6 relative border">
        <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-500 rounded-md px-4 py-3 text-white text-lg font-bold shadow flex items-center gap-3">
          <FaMoneyBillWave className="text-xl" /> Confirm Transaction
        </div>

        <div className="text-sm text-gray-800 space-y-1">
          <p><strong>Total Amount:</strong> ₱{parseFloat(totalAmount).toFixed(2)}</p>
          <p><strong>Discount:</strong> {discount}%</p>
          <p><strong>Discounted Price:</strong> ₱{discountedAmountFixed}</p>
          <p><strong>Remaining Balance After Purchase:</strong> ₱{parseFloat(remainingBalance).toFixed(2)}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button onClick={speakEnglish} className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
            <FaVolumeUp /> English
          </button>
          <button onClick={speakFilipino} className="flex-1 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
            <FaVolumeDown /> Filipino
          </button>
          <button onClick={stopSpeech} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
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


