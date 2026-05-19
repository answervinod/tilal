'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface TestimonialsData {
  _type: 'testimonialsBlock';
  _key: string;
  heading?: string;
  items?: Array<{
    quote: string;
    author: string;
    role?: string;
    photo?: SanityImage;
    rating?: number;
  }>;
}

export function Testimonials({ data }: { data: TestimonialsData }) {
  const items = data.items || [];
  if (!items.length) return null;

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Quotes stagger
      if (quotesRef.current) {
        const figures = quotesRef.current.querySelectorAll('.quote-item');
        gsap.from(figures, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quotesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg-soft text-fg relative overflow-hidden">
      <div className="grain" aria-hidden />
      <div className="container py-28 md:py-36 relative">
        <div ref={headerRef} className="grid grid-cols-12 gap-x-6 gap-y-8 mb-16 md:mb-24">
          <div className="col-span-12 flex items-baseline justify-between text-fg-subtle">
            <span className="index-mark">04 — In Their Words</span>
            <span className="hidden md:inline index-mark">{String(items.length).padStart(2, '0')} accounts</span>
          </div>
          {data.heading && (
            <h2
              className="col-span-12 md:col-span-9 font-display text-fg"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: '1.02',
                letterSpacing: '-0.025em',
              }}
            >
              {data.heading}
            </h2>
          )}
        </div>

        <div ref={quotesRef} className="grid grid-cols-12 gap-x-6">
          {items.map((q, i) => {
            const photo = imageUrl(q.photo, 200);
            const indent = i % 3;
            const colCls = [
              'col-span-12 md:col-start-2 md:col-span-9',
              'col-span-12 md:col-start-4 md:col-span-8',
              'col-span-12 md:col-start-1 md:col-span-9',
            ][indent];
            return (
              <figure key={i} className={`quote-item ${colCls} ${i > 0 ? 'border-t border-fg/8 pt-12 mt-12 md:pt-20 md:mt-20' : ''}`}>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-label text-gold">{String(i + 1).padStart(2, '0')}</span>
                  {q.rating && (
                    <span className="text-label text-fg-subtle">{'\u2605'.repeat(q.rating)}</span>
                  )}
                </div>

                <blockquote
                  className="font-display text-fg italic"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                    lineHeight: '1.18',
                    letterSpacing: '-0.012em',
                  }}
                >
                  &ldquo;{q.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4">
                  {photo && (
                    <Image
                      src={photo}
                      alt={q.author}
                      width={44}
                      height={44}
                      className="rounded-full object-cover h-11 w-11 grayscale opacity-80"
                    />
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="text-label text-fg">{q.author}</span>
                    {q.role && (
                      <span className="text-fg-muted text-[12px]">
                        <span className="italic">— {q.role}</span>
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
