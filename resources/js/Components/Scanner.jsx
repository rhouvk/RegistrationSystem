// File: resources/js/Components/Scanner.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { scannerFetch } from "@/utils/scannerFetch";

export default function Scanner({ onUserFound }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(new BrowserMultiFormatReader());
  const scanningRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [validUntil, setValidUntil] = useState(null);

  const isExpired = validUntil && new Date(validUntil) < new Date();

  const stopScan = useCallback(() => {
    if (scanningRef.current) {
      setScanning(false);
      scanningRef.current = false;

      try {
        scannerRef.current.reset();
      } catch (e) {
        console.warn("Scanner reset error:", e);
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, []);

  const startScan = useCallback(async () => {
    if (scanningRef.current) return;

    setScanning(true);
    scanningRef.current = true;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .catch((err) => console.warn("Video play failed:", err));
        };
      }

      scannerRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, err) => {
          if (!scanningRef.current) return;

          if (result) {
            stopScan();
            const hashid = result.text.trim();

            try {
              const data = await scannerFetch(
                `/api/scan-user?hashid=${encodeURIComponent(hashid)}`
              );
              if (data.user) {
                setUser(data.user);
                setValidUntil(data.valid_until);
                onUserFound?.(data.user);
              } else {
                setError("No user found for this ID.");
              }
            } catch (e) {
              setError(e.message || "Scan failed.");
            }
          }

          if (err) console.warn("Scan error:", err);
        },
        { formats: [BarcodeFormat.DATA_MATRIX, BarcodeFormat.PDF_417] }
      );
    } catch (err) {
      setError("Camera access error: " + err.message);
      setScanning(false);
      scanningRef.current = false;
    }
  }, [onUserFound, scannerFetch, stopScan]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopScan();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up the event listener when the component unmounts normally
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopScan();
    };
  }, [stopScan]);

  const reloadPage = () => {
    stopScan();
    setUser(null);
    setValidUntil(null);
    setError(null);
    window.location.reload();
  };

  return (
    <>
      {/* Instruction Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-teal-800">Scan PWD Card</h2>
        <p className="text-sm text-gray-500">
          Align the barcode within the guides. The scan will start automatically.
        </p>
      </div>

      {/* Camera container */}
      <div className="relative w-full max-w-md aspect-video border-4 border-dashed border-teal-400 rounded-xl overflow-hidden mx-auto bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        ></video>

        {/* Overlay Guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white"></div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-white opacity-25"></div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-white opacity-25"></div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <p className="text-red-500 text-center mt-2">⚠️ {error}</p>
      )}

      {/* Scan Button */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          onClick={startScan}
          disabled={scanning}
          className="max-w-md w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 shadow"
        >
          {scanning ? "🔍 Scanning..." : "Start Scan"}
        </button>
      </div>

      {/* Result Modal */}
      {user && (
        <div className="fixed inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h2
              className={`text-xl font-bold text-center ${
                isExpired ? "text-red-600" : "text-teal-700"
              }`}
            >
              {isExpired ? "PWD Card Expired" : "PWD Card Valid"}
            </h2>

            <div className="flex flex-col items-center text-center">
              <img
                src={user.photo ? `/storage/${user.photo}` : "/images/person.png"}
                alt="PWD"
                className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 mb-3"
              />
              <p className="text-sm text-gray-700">
                <strong>ID:</strong> {user.pwdNumber}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {user.user?.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Disability:</strong>{" "}
                {user.disabilitytype?.name || "—"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Valid Until:</strong>{" "}
                <span className={isExpired ? "text-red-600 font-semibold" : ""}>
                  {validUntil}
                </span>
              </p>
              {isExpired && (
                <p className="text-red-600 text-sm font-bold text-center mt-2">
                  ⚠️ This PWD card has expired.
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={reloadPage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}