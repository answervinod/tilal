'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveLink } from '@/lib/resolveLink';
import { imageUrl } from '../../../sanity/lib/image';
import type { Locale } from '@/i18n/config';
import type { ResolvedLink, SanityImage } from '../../../sanity/lib/types';

export interface CTAData {
  _type: 'ctaBlock';
  _key: string;
  heading: string;
  subheading?: string;
  buttons?: ResolvedLink[];
  background?: SanityImage;
  variant?: 'light' | 'dark' | 'brand';
}

const variantStyles = {
  light: {
    section: 'bg-bg text-fg',
    heading: 'text-fg',
    sub: 'text-fg-muted',
    rule: 'bg-fg/10',
    btn: 'text-fg',
    overlay: 0,
  },
  dark: {
    section: 'bg-fg text-bg',
    heading: 'text-bg',
    sub: 'text-bg/70',
    rule: 'bg-bg/15',
    btn: 'text-bg',
    overlay: 0.55,
  },
  brand: {
    section: 'bg-fg text-bg',
    heading: 'text-bg',
    sub: 'text-bg/70',
    rule: 'bg-bg/15',
    btn: 'text-bg',
    overlay: 0.6,
  },
} as const;

export function CTA({ data, locale }: { data: CTAData; locale: Locale }) {
  const v = variantStyles[data.variant || 'brand'];
  const bg = imageUrl(data.background, 2000);
  const dark = (data.variant || 'brand') !== 'light';
  const headingParts = data.heading.split(/([.,?!])/);

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Background parallax
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Heading word reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.from(words, {
          y: '100%',
          opacity: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Subheading
      if (subRef.current) {
        gsap.from(subRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Buttons
      if (btnRef.current) {
        gsap.from(btnRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: btnRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`relative isolate overflow-hidden ${v.section}`}>
      {bg && (
        <>
          <div ref={bgRef} className="absolute inset-0 -z-10 scale-110">
            <Image src={bg} alt="" fill className="object-cover cinematic" sizes="100vw" priority={false} />
          </div>
          <div className="absolute inset-0 -z-10 bg-fg" style={{ opacity: v.overlay }} aria-hidden />
          <div className="grain -z-10" aria-hidden />
        </>
      )}

      <div className="container py-32 md:py-44">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 flex items-baseline justify-between">
            <span className={`text-label ${dark ? 'text-bg/50' : 'text-fg-subtle'}`}>— Colophon</span>
            <span className={`hidden md:inline text-label ${dark ? 'text-bg/50' : 'text-fg-subtle'}`}>An invitation</span>
          </div>

          <h2
            ref={headingRef}
            className={`col-span-12 md:col-span-10 font-display ${v.heading}`}
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', lineHeight: '1.0', letterSpacing: '-0.03em' }}
          >
            {headingParts.map((part, i) =>
              i === headingParts.length - 1 || (i > 0 && /^[\.\!\?]/.test(headingParts[i - 1] || '')) ? (
                <span key={i} className="overflow-hidden inline-block">
                  <span className="word inline-block italic text-gold">{part}</span>
                </span>
              ) : (
                <span key={i} className="overflow-hidden inline-block">
                  <span className="word inline-block">{part}</span>
                </span>
              )
            )}
          </h2>

          {data.subheading && (
            <p ref={subRef} className={`col-span-12 md:col-span-7 md:col-start-3 text-body-lg ${v.sub}`}>
              {data.subheading}
            </p>
          )}

          {data.buttons && data.buttons.length > 0 && (
            <div ref={btnRef} className="col-span-12 mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              {data.buttons.map((btn, i) =>
                i === 0 ? (
                  <Link
                    key={`${btn.label}-${i}`}
                    href={resolveLink(btn, locale)}
                    target={btn.newTab ? '_blank' : undefined}
                    rel={btn.newTab ? 'noopener noreferrer' : undefined}
                    className={`group inline-flex items-center gap-3 px-8 py-4 text-label transition-colors duration-700 ${
                      dark ? 'bg-bg text-fg hover:bg-gold' : 'bg-fg text-bg hover:bg-gold'
                    }`}
                  >
                    {btn.label}
                    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                ) : (
                  <Link
                    key={`${btn.label}-${i}`}
                    href={resolveLink(btn, locale)}
                    target={btn.newTab ? '_blank' : undefined}
                    rel={btn.newTab ? 'noopener noreferrer' : undefined}
                    className={`link-underline text-label ${v.btn}`}
                  >
                    {btn.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
