'use client';
import { useState, useRef, useEffect } from 'react';
import type { ImageFraming } from '@/lib/galleryStorage';

interface ImageFramingEditorProps {
  imageUrl: string;
  containerAspectRatio: string;  // e.g., "4/3" or "3/4"
  initialFraming?: ImageFraming;
  onFramingChange: (framing: ImageFraming) => void;
}

export default function ImageFramingEditor({
  imageUrl,
  containerAspectRatio,
  initialFraming,
  onFramingChange,
}: ImageFramingEditorProps) {
  const [framing, setFraming] = useState<ImageFraming>(
    initialFraming || { zoom: 1, offsetX: 0, offsetY: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse aspect ratio
  const [ratioW, ratioH] = containerAspectRatio.split('/').map(Number);
  const containerRatio = ratioW / ratioH;

  // Update parent when framing changes
  useEffect(() => {
    onFramingChange(framing);
  }, [framing, onFramingChange]);

  // Handle zoom slider
  const handleZoomChange = (newZoom: number) => {
    setFraming((prev) => ({ ...prev, zoom: newZoom }));
  };

  // Handle offset sliders
  const handleOffsetXChange = (newOffsetX: number) => {
    setFraming((prev) => ({ ...prev, offsetX: newOffsetX }));
  };

  const handleOffsetYChange = (newOffsetY: number) => {
    setFraming((prev) => ({ ...prev, offsetY: newOffsetY }));
  };

  // Mouse drag repositioning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Normalize to container size
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const deltaXPercent = (deltaX / containerWidth) * 100;
    const deltaYPercent = (deltaY / containerHeight) * 100;

    setFraming((prev) => ({
      ...prev,
      offsetX: Math.max(-100, Math.min(100, prev.offsetX + deltaXPercent)),
      offsetY: Math.max(-100, Math.min(100, prev.offsetY + deltaYPercent)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset to default framing
  const handleReset = () => {
    setFraming({ zoom: 1, offsetX: 0, offsetY: 0 });
  };

  return (
    <div className="space-y-5">
      {/* Preview container */}
      <div className="space-y-2">
        <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase block">
          Live Preview (Drag to Reposition)
        </label>
        <div
          ref={containerRef}
          className={`relative overflow-hidden bg-jgt-surface border border-jgt-border cursor-move select-none`}
          style={{ aspectRatio: containerAspectRatio }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Framing preview"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              // Center and scale the image
              transform: `translate(-50%, -50%) scale(${framing.zoom}) translate(${framing.offsetX}%, ${framing.offsetY}%)`,
              left: '50%',
              top: '50%',
              transformOrigin: 'center center',
            }}
            draggable={false}
          />
          {/* Drag hint overlay */}
          {framing.zoom > 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
              <p className="text-xs text-white/50 bg-black/40 px-3 py-1.5 rounded">
                Drag to reposition
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Zoom slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase">
            Zoom Level
          </label>
          <span className="font-sans text-xs text-jgt-text">{framing.zoom.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={framing.zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-jgt-border rounded-full appearance-none cursor-pointer accent-jgt-gold"
        />
        <p className="font-sans text-[10px] text-jgt-muted">
          1x = fit entire image • 2x–3x = zoom in to crop
        </p>
      </div>

      {/* Horizontal position slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase">
            Horizontal Position
          </label>
          <span className="font-sans text-xs text-jgt-text">{framing.offsetX > 0 ? '+' : ''}{framing.offsetX.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={framing.offsetX}
          onChange={(e) => handleOffsetXChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-jgt-border rounded-full appearance-none cursor-pointer accent-jgt-gold"
        />
        <p className="font-sans text-[10px] text-jgt-muted">
          − = move left • + = move right
        </p>
      </div>

      {/* Vertical position slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase">
            Vertical Position
          </label>
          <span className="font-sans text-xs text-jgt-text">{framing.offsetY > 0 ? '+' : ''}{framing.offsetY.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={framing.offsetY}
          onChange={(e) => handleOffsetYChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-jgt-border rounded-full appearance-none cursor-pointer accent-jgt-gold"
        />
        <p className="font-sans text-[10px] text-jgt-muted">
          − = move up • + = move down
        </p>
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="w-full btn-outline text-xs py-2.5 transition-colors"
      >
        Reset Framing to Default
      </button>
    </div>
  );
}
