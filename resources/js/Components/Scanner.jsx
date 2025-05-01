import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { scannerFetch } from "@/utils/scannerFetch";

export default function Scanner({ onUserFound }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(new BrowserMultiFormatReader());

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    return () => stopScan(); // Cleanup on unmount
  }, []);

  const startScan = async () => {
    if (scanning) return;
    setScanning(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;

      scannerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, err) => {
          if (result) {
            stopScan(); // ✅ Stop camera to prevent re-scan
            const hashid = result.text.trim();

            try {
              const data = await scannerFetch(`/api/scan-user?hashid=${encodeURIComponent(hashid)}`);
              if (data.user) {
                setUser(data.user);
                onUserFound?.(data.user); // optional callback
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
    }
  };

  const stopScan = () => {
    scannerRef.current = new BrowserMultiFormatReader();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const closeModal = () => {
    setUser(null);
    setError(null);
    stopScan(); // Ensure no re-trigger
  };

  return (
    <>
      {/* Camera container (responsive) */}
      <div className="w-full max-w-md aspect-video border border-gray-800 rounded-lg overflow-hidden mx-auto">
        <video ref={videoRef} className="w-full h-full object-cover"></video>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <div className="flex justify-center mt-4">
        <button
          onClick={startScan}
          disabled={scanning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {scanning ? "Scanning..." : "Start Scan"}
        </button>
      </div>

      {/* Modal Display for Result */}
      {user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-center mb-4 text-green-800">PWD Card Valid</h2>

            <div className="flex flex-col items-center text-center">
              <img
                src={user.photo ? `/storage/${user.photo}` : "/images/person.png"}
                alt="PWD"
                className="w-28 h-28 rounded-full object-cover border border-gray-300 mb-3"
              />
              <p><strong>PWD ID:</strong> {user.pwdNumber}</p>
              <p><strong>Name:</strong> {user.user?.name}</p>
              <p><strong>Disability:</strong> {user.disabilitytype?.name || "—"}</p>

            </div>

            <div className="mt-6 flex justify-center gap-2">
            <button
                onClick={() => window.location.reload()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
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
