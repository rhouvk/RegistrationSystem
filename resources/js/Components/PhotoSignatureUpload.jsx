import React, { useRef, useState, useEffect } from 'react';

export default function PhotoSignatureUpload({ values, handleChangeFile: handleParentChangeFile, errors = {} }) {
  const signatureCanvasRef = useRef(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(values.signaturePreview || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const resizeImage = (file, width, height, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions to maintain aspect ratio
        const imgRatio = img.width / img.height;
        const targetRatio = width / height;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        if (imgRatio > targetRatio) {
          // Image is wider than target
          sourceWidth = img.height * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target
          sourceHeight = img.width / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        // Draw the cropped image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, width, height
        );
        
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/png' });
          callback(resizedFile);
        }, 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

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
      // Nothing drawn
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
  
    // 🟰 Important: make transparent background
    trimmedCtx.clearRect(0, 0, finalWidth, 40);
  
    trimmedCtx.drawImage(
      canvas,
      left, top, trimmedWidth, trimmedHeight,
      0, 0, finalWidth, 40
    );
  
    return trimmedCanvas;
  };
  

  const handleLocalChangeFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === 'photo') {
      resizeImage(file, 250, 250, (resized) => {
        // Create a new event object with the resized file
        const newEvent = {
          target: {
            name,
            files: [resized],
            type: 'file'
          }
        };
        handleParentChangeFile(newEvent);
      });
    } else {
      // Create a new event object with the file
      const newEvent = {
        target: {
          name,
          files: [file],
          type: 'file'
        }
      };
      handleParentChangeFile(newEvent);
    }
  };

  const handleSaveSignature = () => {
    const canvas = signatureCanvasRef.current;
    const trimmed = trimCanvas(canvas);

    trimmed.toBlob((blob) => {
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      handleParentChangeFile({ target: { name: 'signature', files: [file] } });
    }, 'image/png');

    setSignatureDataUrl(trimmed.toDataURL('image/png'));
    setShowModal(false);
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
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
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

  // Get photo URL based on whether it's a File object or path string
  const getPhotoUrl = () => {
    if (!values.photo) return null;
    if (values.photo instanceof File) {
      return URL.createObjectURL(values.photo);
    }
    return `/storage/${values.photo}`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Photo and Draw Signature</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Photo Upload */}
        <div className="flex flex-col items-start space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Photo <span className="text-red-500">*</span>
          </label>
          <label className="cursor-pointer inline-flex items-center px-3 py-2 bg-sky-600 text-white text-xs font-medium rounded hover:bg-sky-700">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleLocalChangeFile}
              className="hidden"
            />
          </label>
          {errors.photo && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded text-xs w-full" role="alert">
              {errors.photo}
            </div>
          )}
          {values.photo && (
            <img
              src={getPhotoUrl()}
              alt="Photo Preview"
              className={`mt-2 w-[250px] h-[250px] rounded object-cover border ${errors.photo ? 'border-red-500' : 'border'}`}
            />
          )}
        </div>

        {/* Signature Upload */}
        <div className="flex flex-col items-start space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Signature <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-3 py-2 bg-sky-600 text-white text-xs font-medium rounded hover:bg-sky-700"
          >
            {signatureDataUrl ? 'Edit Signature' : 'Draw Signature'}
          </button>
          {errors.signature && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded text-xs w-full" role="alert">
              {errors.signature}
            </div>
          )}
          {signatureDataUrl && (
            <img
              src={signatureDataUrl}
              alt="Signature Preview"
              className={`mt-2 h-[40px] w-auto rounded border bg-white ${errors.signature ? 'border-red-500' : 'border'}`}
            />
          )}
        </div>

      </div>

      {/* Hidden input for signature to allow scroll-to-error */}
      <input type="hidden" name="signature" value={signatureDataUrl ? '1' : ''} />

      {/* Modal for Drawing Signature */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-t from-cyan-950/80 to-transparent z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6 text-center">Draw Your Signature</h2>
            <div className="relative">
              <canvas
                ref={signatureCanvasRef}
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
                  const canvas = signatureCanvasRef.current;
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
                className="px-5 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
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
