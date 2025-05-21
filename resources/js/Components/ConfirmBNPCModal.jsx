import React, { useEffect, useCallback, Suspense, useState } from 'react';
import {
    FaVolumeUp,
    FaVolumeDown,
    FaStop,
    FaMoneyBillWave,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';

function ConfirmBNPCModal({
  show,
  onCancel,
  onConfirm,
  processing = false,
  totalAmount,
  remainingBalance,
  discount = 0,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voices, setVoices] = useState([]);

  const formatAmount = useCallback((amt) => parseFloat(amt).toFixed(2), []);

  const formatPesosAndCentavos = useCallback((amount) => {
    const [pesos, centavos] = formatAmount(amount).split('.');
    return {
      pesos: parseInt(pesos).toString(),
      centavos: centavos || '00'
    };
  }, [formatAmount]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakMessage = useCallback((message, lang = 'en-US') => {
    if (!window.speechSynthesis) return;

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang;
    
    // Find the best matching voice
    const targetLang = lang.split('-')[0]; // Get 'fil' or 'en'
    const matchingVoices = voices.filter(v => v.lang.startsWith(targetLang));
    
    if (matchingVoices.length > 0) {
      // Prefer female voices for Filipino
      const femaleVoice = matchingVoices.find(v => v.name.toLowerCase().includes('female'));
      utterance.voice = femaleVoice || matchingVoices[0];
    }
    
    // Adjust speech rate and pitch for better Filipino pronunciation
    if (lang === 'fil-PH') {
      utterance.rate = 1; // Slightly slower
      utterance.pitch = 1.1; // Slightly higher pitch
    }
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [voices, stopSpeech]);

  const speakEnglish = useCallback(() => {
    const total = formatPesosAndCentavos(totalAmount);
    const balance = formatPesosAndCentavos(remainingBalance);
    
    const message = `Please confirm this transaction. The total amount is ${total.pesos} pesos and ${total.centavos} centavos. ` +
      `The discount is ${discount} percent. ` +
      `The remaining balance will be ${balance.pesos} pesos and ${balance.centavos} centavos.`;
    speakMessage(message, 'en-US');
  }, [totalAmount, discount, remainingBalance, formatPesosAndCentavos, speakMessage]);

  const speakFilipino = useCallback(() => {
    const total = formatPesosAndCentavos(totalAmount);
    const balance = formatPesosAndCentavos(remainingBalance);
    
    const message = `Paki kumpirma ang transaksiyon. Ang kabuuang halaga ay ${total.pesos} piso at ${total.centavos} sentimo. ` +
      `Ang diskwento ay ${discount} porsyento. ` +
      `Ang natitirang balanse ay ${balance.pesos} piso at ${balance.centavos} sentimo.`;
    speakMessage(message, 'fil-PH');
  }, [totalAmount, discount, remainingBalance, formatPesosAndCentavos, speakMessage]);

  const handleCancel = useCallback(() => {
    stopSpeech();
    onCancel();
  }, [stopSpeech, onCancel]);

  const handleConfirm = useCallback(() => {
    stopSpeech();
    onConfirm();
  }, [stopSpeech, onConfirm]);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      // Initial load
      loadVoices();
      
      // Handle voice changes
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  useEffect(() => {
    if (!show && isSpeaking) {
      stopSpeech();
    }
    return () => {
      if (isSpeaking) {
        stopSpeech();
      }
    };
  }, [show, isSpeaking, stopSpeech]);

  if (!show) return null;

  const discountedAmount = parseFloat(totalAmount) * (1 - parseFloat(discount) / 100);
  const discountedAmountFixed = discountedAmount.toFixed(2);

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

        {speechSupported ? (
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button 
              type="button"
              onClick={speakEnglish} 
              disabled={isSpeaking}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
            >
              <FaVolumeUp /> English
            </button>
            <button 
              type="button"
              onClick={speakFilipino}
              disabled={isSpeaking}
              className="flex-1 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
            >
              <FaVolumeDown /> Filipino
            </button>
            <button 
              type="button"
              onClick={stopSpeech}
              disabled={!isSpeaking}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <FaStop /> Stop
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-2">
            Text-to-speech is not supported in your browser
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
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

// Create a wrapper component that uses Suspense
function ConfirmBNPCModalWrapper(props) {
  return (
    <Suspense fallback={null}>
      <ConfirmBNPCModal {...props} />
    </Suspense>
  );
}

// Set display names for both components
ConfirmBNPCModal.displayName = 'ConfirmBNPCModal';
ConfirmBNPCModalWrapper.displayName = 'ConfirmBNPCModalWrapper';

export default ConfirmBNPCModalWrapper;


