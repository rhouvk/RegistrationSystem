import React, { useRef, useState, useEffect } from 'react';

export default function SignatureUpload({ value, onChange }) {
  const canvasRef = useRef(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(value || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const trimCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);

    let top = null, bottom = null, left = null, right = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = imgData.data[(y * width + x) * 4 + 3];
        if (alpha !== 0) {
          if (top === null) top = y;
          bottom = y;
          if (left === null || x < left) left = x;
          if (right === null || x > right) right = x;
        }
      }
    }

    if (top === null) {
      const emptyCanvas = document.createElement('canvas');
      emptyCanvas.width = 1;
      emptyCanvas.height = 1;
      return emptyCanvas;
    }

    const trimmedWidth = right - left + 1;
    const trimmedHeight = bottom - top + 1;
    const scale = 40 / trimmedHeight;
    const finalWidth = Math.round(trimmedWidth * scale);

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = finalWidth;
    trimmedCanvas.height = 40;

    const trimmedCtx = trimmedCanvas.getContext('2d');
    trimmedCtx.clearRect(0, 0, finalWidth, 40);
    trimmedCtx.drawImage(
      canvas,
      left, top, trimmedWidth, trimmedHeight,
      0, 0, finalWidth, 40
    );

    return trimmedCanvas;
  };

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    const trimmed = trimCanvas(canvas);

    trimmed.toBlob((blob) => {
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      onChange(file);
    }, 'image/png');

    setSignatureDataUrl(trimmed.toDataURL('image/png'));
    setShowModal(false);
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-3 bg-sky-600 text-white text-sm font-medium rounded hover:brightness-110"
      >
        {signatureDataUrl ? 'Edit Signature' : 'Draw Signature'}
      </button>
      {signatureDataUrl && (
        <img
          src={signatureDataUrl}
          alt="Signature Preview"
          className="mt-2 h-[40px] w-auto rounded border bg-white"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Draw Your Signature</h2>
            <div className="relative w-full">
              <canvas
                ref={canvasRef}
                width={400}
                height={250}
                className="border border-gray-300 rounded bg-white w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext('2d');
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.beginPath();
                }}
                className="px-5 py-2 text-sm bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSignature}
                className="px-5 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
