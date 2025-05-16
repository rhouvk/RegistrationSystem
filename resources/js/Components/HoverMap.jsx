import React, { useEffect, useRef, useState } from 'react';

const districts = [
  { name: 'Agdao', src: '/images/agdao.png' },
  { name: 'Baguio', src: '/images/baguio.png' },
  { name: 'Buhangin', src: '/images/buhangin.png' },
  { name: 'Bunawan', src: '/images/bunawan.png' },
  { name: 'Calinan', src: '/images/calinan.png' },
  { name: 'Marilog', src: '/images/marilog.png' },
  { name: 'Paquibato', src: '/images/paquibato.png' },
  { name: 'Poblacion', src: '/images/poblacion.png' },
  { name: 'Talomo', src: '/images/talomo.png' },
  { name: 'Toril', src: '/images/toril.png' },
  { name: 'Tugbok', src: '/images/tugbok.png' },
];

export default function CanvasHoverMap({ adminDistrictData = {} }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [labelPos, setLabelPos] = useState({ x: 0, y: 0 });
  const [images, setImages] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 500 });

  // Resize canvas based on container
  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const height = Math.floor((width / 3) * 4); // 3:4 aspect ratio
        setCanvasSize({ width, height });

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }

        const ctx = canvas?.getContext('2d');
        if (ctx && images.length > 0) {
          drawAll(ctx, images, hoveredDistrict);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [images]);

  // Load images once
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    const loadedImages = [];
    let loadCount = 0;

    districts.forEach((district, index) => {
      const img = new Image();
      img.src = district.src;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        loadedImages[index] = { ...district, image: img };
        loadCount++;
        if (loadCount === districts.length) {
          setImages(loadedImages);
          setImgLoaded(true);
          if (ctx) drawAll(ctx, loadedImages);
        }
      };
    });
  }, []);

  const drawAll = (ctx, images, highlight = null) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    images.forEach(({ image }) => {
      ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    });

    if (highlight) {
      const hovered = images.find(d => d.name === highlight);
      if (hovered) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = ctx.canvas.width;
        tempCanvas.height = ctx.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.drawImage(hovered.image, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = '#1f5562';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        ctx.drawImage(tempCanvas, 0, 0);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!imgLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setLabelPos({ x, y });

    for (const district of images) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(district.image, 0, 0, canvas.width, canvas.height);

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) {
        setHoveredDistrict(district.name);
        drawAll(ctx, images, district.name);
        return;
      }
    }

    setHoveredDistrict(null);
    drawAll(ctx, images);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md aspect-[3/4] mx-auto bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredDistrict(null);
          if (imgLoaded) {
            const ctx = canvasRef.current.getContext('2d');
            drawAll(ctx, images);
          }
        }}
      />

      {hoveredDistrict && (
        <div
          className="absolute bg-black text-white text-xs px-3 py-2 rounded shadow pointer-events-none z-50"
          style={{ top: labelPos.y + 10, left: labelPos.x + 10 }}
        >
          <div className="font-bold">{hoveredDistrict.toUpperCase()}</div>
          <div>
            Registered: <span className="font-semibold">{adminDistrictData[hoveredDistrict] ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}
