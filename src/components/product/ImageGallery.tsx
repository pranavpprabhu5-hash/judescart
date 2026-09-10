'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Strip */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[580px] pb-2 lg:pb-0 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              'relative w-20 h-24 lg:w-20 lg:h-26 rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 transition-all',
              selectedIndex === idx
                ? 'border-stone-900 shadow-md ring-1 ring-stone-900'
                : 'border-transparent opacity-70 hover:opacity-100'
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Frame with Zoom */}
      <div
        className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 group cursor-crosshair border border-stone-200"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${productName} full view`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={cn(
            'object-cover transition-transform duration-200',
            isZoomed ? 'scale-150' : 'scale-100'
          )}
          style={
            isZoomed
              ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` }
              : undefined
          }
        />

        {/* Zoom Hint Pill */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-stone-700 text-[11px] font-medium border border-stone-200 pointer-events-none flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Hover to Zoom</span>
        </div>

        {/* Navigation Arrows for Mobile */}
        {images.length > 1 && (
          <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-stone-900 pointer-events-auto hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-stone-900 pointer-events-auto hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
