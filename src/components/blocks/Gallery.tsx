'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface GalleryData {
  _type: 'galleryBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  images?: SanityImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: 2 | 3 | 4;
}

const colsClass: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

export function Gallery({ data }: { data: GalleryData }) {
  const images = data.images || [];
  if (!images.length) return null;

  const cols = (data.columns as 2 | 3 | 4) || 3;
  const layout = data.layout || 'grid';

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 25,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.gallery-item');
        gsap.from(items, {
          y: 50,
          opacity: 0,
          scale: 0.96,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container py-20 md:py-32">
      {(data.heading || data.subheading) && (
        <div ref={headerRef} className="max-w-2xl mb-12 md:mb-20">
          {data.heading && (
            <h2 className="font-display text-d-4 text-fg">{data.heading}</h2>
          )}
          {data.subheading && (
            <p className="mt-4 text-fg-muted leading-relaxed">{data.subheading}</p>
          )}
        </div>
      )}

      {layout === 'carousel' ? (
        <div ref={gridRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
          {images.map((img, i) => {
            const src = imageUrl(img, 1400);
            if (!src) return null;
            const ratio = img.asset?.metadata?.dimensions?.aspectRatio || 16 / 9;
            return (
              <div
                key={img.asset?._id || i}
                className="gallery-item relative shrink-0 snap-start w-[85%] md:w-[60%] lg:w-[48%]"
                style={{ aspectRatio: ratio }}
              >
                <Image
                  src={src}
                  alt={img.alt || ''}
                  fill
                  sizes="(min-width: 1024px) 50vw, 85vw"
                  className="object-cover cinematic"
                  placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.asset?.metadata?.lqip}
                />
              </div>
            );
          })}
        </div>
      ) : layout === 'masonry' ? (
        <div ref={gridRef} className={`columns-1 sm:columns-2 ${cols >= 3 ? 'lg:columns-3' : ''} gap-4`}>
          {images.map((img, i) => {
            const src = imageUrl(img, 1200);
            if (!src) return null;
            return (
              <div key={img.asset?._id || i} className="gallery-item mb-4 break-inside-avoid">
                <img src={src} alt={img.alt || ''} loading="lazy" className="w-full h-auto" />
                {img.caption && (
                  <p className="text-xs text-fg-subtle mt-2">{img.caption}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div ref={gridRef} className={`grid grid-cols-1 ${colsClass[cols]} gap-3 md:gap-4`}>
          {images.map((img, i) => {
            const src = imageUrl(img, 1200);
            if (!src) return null;
            const ratio = img.asset?.metadata?.dimensions?.aspectRatio || 4 / 3;
            return (
              <figure key={img.asset?._id || i} className="gallery-item">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
                  <Image
                    src={src}
                    alt={img.alt || ''}
                    fill
                    sizes={`(min-width: 768px) ${100 / cols}vw, 100vw`}
                    className="object-cover transition-transform duration-700 hover:scale-[1.03] cinematic"
                    placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.asset?.metadata?.lqip}
                  />
                </div>
                {img.caption && (
                  <figcaption className="text-xs text-fg-subtle mt-2">{img.caption}</figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
}
