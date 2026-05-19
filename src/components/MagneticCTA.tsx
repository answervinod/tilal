'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface MagneticCTAProps {
  heading: string;
  subheading?: string;
  button?: { label: string; href: string };
}

export function MagneticCTA({ heading, subheading, button }: MagneticCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading word reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.cta-word');
        gsap.from(words, {
          y: '100%',
          opacity: 0,
          rotateX: -30,
          duration: 1.2,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (subRef.current) {
        gsap.from(subRef.current, {
          y: 30, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: subRef.current, start: 'top 90%', toggleActions: 'play none none none' },
        });
      }

      if (btnRef.current) {
        gsap.from(btnRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: btnRef.current, start: 'top 95%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const words = heading.split(' ');
  const lastWordIndex = words.length - 1;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-fg"
    >
      {/* Subtle gradient texture */}
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(201,169,110,0.1) 0%, transparent 40%)'
      }} />
      <div className="grain" aria-hidden />

      <div className="relative container py-24 text-center">
        <h2
          ref={headingRef}
          className="font-display text-bg"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            perspective: '1000px',
          }}
        >
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block" style={{ perspective: '1000px' }}>
              <span
                className={`cta-word inline-block ${i === lastWordIndex ? 'italic text-gold' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        {subheading && (
          <p ref={subRef} className="mt-8 max-w-xl mx-auto text-bg/70 text-lg leading-relaxed">
            {subheading}
          </p>
        )}

        {button && (
          <div className="mt-12">
            <Link
              ref={btnRef}
              href={button.href}
              className="magnetic-btn inline-flex"
              style={{ background: '#faf8f5', color: '#1a1a1a' }}
            >
              <span>{button.label}</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
