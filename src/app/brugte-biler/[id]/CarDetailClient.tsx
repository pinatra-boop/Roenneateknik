"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Car, Expand } from "lucide-react";

export default function CarDetailClient({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-video rounded-2xl bg-surface-light border border-border flex items-center justify-center">
        <Car size={64} className="text-border" />
      </div>
    );
  }

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-light border border-border group">
        <img
          src={images[active]}
          alt=""
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <Expand size={16} />
        </button>

        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={images[active]}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <button
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
