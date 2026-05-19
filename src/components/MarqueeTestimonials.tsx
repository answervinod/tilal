'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  photo?: SanityImage;
}

interface MarqueeTestimonialsProps {
  items: Testimonial[];
  heading?: string;
}

export function MarqueeTestimonials({ items, heading }: MarqueeTestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  // Double the items for seamless loop
  const doubled = [...items, ...items];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      // Speed up marquee on scroll
      if (track1Ref.current && track2Ref.current) {
        const tl1 = gsap.to(track1Ref.current, {
          xPercent: -50,
          duration: 40,
          ease: 'none',
          repeat: -1,
        });

        const tl2 = gsap.to(track2Ref.current, {
          xPercent: 50,
          duration: 50,
          ease: 'none',
          repeat: -1,
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const timeScale = Math.min(3, 1 + velocity / 2000);
            tl1.timeScale(timeScale);
            tl2.timeScale(timeScale);
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [items]);

  return (
    <section ref={sectionRef} className="bg-bg-soft overflow-hidden py-24 md:py-32">
      <div ref={headerRef} className="container mb-16">
        <div className="flex items-baseline justify-between">
          <span className="index-mark">Testimonials</span>
          {heading && (
            <h2
              className="font-display text-fg"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
            >
              {heading}
            </h2>
          )}
          <span className="index-mark hidden md:inline">{String(items.length).padStart(2, '0')} voices</span>
        </div>
      </div>

      {/* Track 1 — left to right */}
      <div className="mb-6 overflow-hidden">
        <div ref={track1Ref} className="flex gap-6 w-max">
          {doubled.map((item, i) => (
            <TestimonialCard key={`t1-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Track 2 — right to left (offset) */}
      <div className="overflow-hidden opacity-60">
        <div ref={track2Ref} className="flex gap-6 w-max -translate-x-1/2">
          {[...doubled].reverse().map((item, i) => (
            <TestimonialCard key={`t2-${i}`} item={item} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, variant }: { item: Testimonial; variant?: 'compact' }) {
  const photo = item.photo ? imageUrl(item.photo, 200) : null;
  const isCompact = variant === 'compact';

  return (
    <div
      className={`flex-shrink-0 bg-bg border border-fg/5 p-8 ${isCompact ? 'w-[400px]' : 'w-[480px]'}`}
    >
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-label text-gold">&ldquo;</span>
      </div>
      <p
        className={`font-display text-fg italic leading-snug mb-8 ${isCompact ? 'text-lg' : 'text-xl'}`}
        style={{ letterSpacing: '-0.01em' }}
      >
        {item.quote}
      </p>
      <div className="flex items-center gap-4">
        {photo && (
          <Image
            src={photo}
            alt={item.author}
            width={40}
            height={40}
            className="rounded-full object-cover h-10 w-10 grayscale opacity-70"
          />
        )}
        <div>
          <span className="text-label text-fg">{item.author}</span>
          {item.role && (
            <p className="text-fg-muted text-[12px] mt-0.5">
              <span className="italic">{item.role}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
