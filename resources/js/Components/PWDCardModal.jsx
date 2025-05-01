import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function PWDCardModal({ isOpen, cardUrl, loading, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
        <h2 className="text-lg text-cyan-950 font-semibold mb-4">
          Your PWD Card
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-4xl text-sky-600" />
          </div>
        ) : cardUrl ? (
          <img
            src={cardUrl}
            alt="PWD Card"
            className="w-full h-auto rounded-md mb-4"
          />
        ) : (
          <p className="text-center text-gray-500 mb-4">
            Unable to load card. Please try again.
          </p>
        )}

        <div className="mt-4 flex space-x-2">
          {cardUrl && (
            <a
              href={cardUrl}
              download="PWD-Card.png"
              className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white py-2 rounded"
            >
              Download
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
