'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface BeforeAfterData {
  _type: 'beforeAfterBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  before?: SanityImage & { label?: string };
  after?: SanityImage & { label?: string };
  initialPosition?: number;
}

export function BeforeAfter({ data }: { data: BeforeAfterData }) {
  const [pos, setPos] = useState(
    typeof data.initialPosition === 'number'
      ? Math.min(100, Math.max(0, data.initialPosition))
      : 50
  );
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeSrc = imageUrl(data.before, 1800);
  const afterSrc = imageUrl(data.after, 1800);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, x)));
  }, []);

  if (!beforeSrc || !afterSrc) return null;

  return (
    <section className="container py-16 md:py-24">
      {(data.heading || data.subheading) && (
        <div className="max-w-2xl mb-10">
          {data.heading && (
            <h2 className="font-display text-3xl md:text-5xl text-brand leading-tight">
              {data.heading}
            </h2>
          )}
          {data.subheading && (
            <p className="mt-3 text-neutral-600 leading-relaxed">{data.subheading}</p>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 select-none touch-none cursor-ew-resize"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-label={data.heading || 'Before and after comparison'}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
        }}
      >
        {/* After image (full) */}
        <Image
          src={afterSrc}
          alt={data.after?.alt || 'After'}
          fill
          sizes="100vw"
          className="object-cover pointer-events-none"
          priority={false}
        />
        {data.after?.label && (
          <span className="absolute top-4 end-4 inline-flex items-center bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-brand">
            {data.after.label}
          </span>
        )}

        {/* Before image clipped to slider position */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${pos}%` }}
        >
          <div className="relative h-full" style={{ width: containerRef.current?.clientWidth || '100%' }}>
            <Image
              src={beforeSrc}
              alt={data.before?.alt || 'Before'}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        {data.before?.label && (
          <span
            className="absolute top-4 start-4 inline-flex items-center bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-brand transition-opacity"
            style={{ opacity: pos > 8 ? 1 : 0 }}
          >
            {data.before.label}
          </span>
        )}

        {/* Slider handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white pointer-events-none"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 h-12 w-12 rounded-full bg-white shadow-lg grid place-items-center">
            <span className="text-brand text-lg leading-none" aria-hidden>
              {'\u2194'}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-500 text-center">
        Drag the handle to compare
      </p>
    </section>
  );
}
