'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

interface CinematicHeroProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  media?: {
    type?: 'image' | 'video';
    image?: SanityImage;
    videoUrl?: string;
  };
}

const FALLBACK_CURTAIN = '/images/hero.jpeg';

export function CinematicHero({ eyebrow, heading, subheading, media }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLHeadingElement>(null);

  const curtainUrl = media?.image ? imageUrl(media.image, 2400) : FALLBACK_CURTAIN;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Left door slides to left
      if (leftDoorRef.current) {
        tl.to(
          leftDoorRef.current,
          { xPercent: -100, ease: 'power2.inOut', duration: 1.2 },
          0
        );
      }

      // Right door slides to right
      if (rightDoorRef.current) {
        tl.to(
          rightDoorRef.current,
          { xPercent: 100, ease: 'power2.inOut', duration: 1.2 },
          0
        );
      }

      // Background parallax
      if (bgRef.current) {
        tl.fromTo(
          bgRef.current,
          { scale: 1.1, y: 0 },
          { scale: 1, y: '-10%', ease: 'none', duration: 2 },
          0
        );
      }

      // Entrance animations on load
      if (wordsRef.current) {
        const words = wordsRef.current.querySelectorAll('.hero-word');
        gsap.from(words, {
          y: '120%',
          opacity: 0,
          rotateX: -40,
          duration: 1.4,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.5,
        });
      }

      const eyebrowEl = section.querySelector('.hero-eyebrow');
      if (eyebrowEl) {
        gsap.from(eyebrowEl, { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      }

      const subEl = section.querySelector('.hero-sub');
      if (subEl) {
        gsap.from(subEl, { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 1 });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const words = heading.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-fg"
    >
      {/* Revealed background (behind doors) */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(60,50,35,0.4) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(201,169,110,0.12) 0%, transparent 50%),
              linear-gradient(160deg, #1a1815 0%, #0f0e0c 50%, #1a1815 100%)
            `,
          }}
        />
        <div className="grain" aria-hidden />
      </div>

      {/* Content — sits behind doors, revealed on scroll */}
      <div className="absolute inset-0 flex items-end" style={{ zIndex: 5 }}>
        <div className="container pb-20 md:pb-28">
          {eyebrow && (
            <p className="hero-eyebrow label text-gold mb-8">{eyebrow}</p>
          )}

          <h1
            ref={wordsRef}
            className="font-display text-bg"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.035em',
              perspective: '1000px',
            }}
          >
            {words.map((word, i) => (
              <span key={i}>
                <span className="overflow-hidden inline-block" style={{ perspective: '1000px' }}>
                  <span
                    className="hero-word inline-block"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {word}
                  </span>
                </span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>

          {subheading && (
            <p className="hero-sub mt-8 max-w-lg text-bg/80 text-lg md:text-xl leading-relaxed">
              {subheading}
            </p>
          )}

          <div className="mt-12 flex items-center gap-3">
            <span className="text-label text-bg/50">Scroll to enter</span>
            <div className="w-8 h-px bg-bg/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gold animate-scroll-line" />
            </div>
          </div>
        </div>
      </div>

      {/* LEFT DOOR — left half of single image */}
      <div
        ref={leftDoorRef}
        className="absolute top-0 left-0 w-1/2 h-full overflow-hidden will-change-transform"
        style={{ zIndex: 20 }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${curtainUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="grain" aria-hidden />
        <div className="absolute top-0 right-0 w-px h-full bg-gold/30" />
      </div>

      {/* RIGHT DOOR — right half of single image */}
      <div
        ref={rightDoorRef}
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden will-change-transform"
        style={{ zIndex: 20 }}
      >
        <div
          className="absolute top-0 right-0"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${curtainUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="grain" aria-hidden />
        <div className="absolute top-0 left-0 w-px h-full bg-gold/30" />
      </div>
    </section>
  );
}
