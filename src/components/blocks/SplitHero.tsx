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

export interface SplitHeroData {
  _type: 'splitHeroBlock';
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  media?: {
    type?: 'image' | 'video';
    image?: SanityImage;
    videoUrl?: string;
  };
  mediaSide?: 'left' | 'right';
  variant?: 'light' | 'cream' | 'dark';
  ctas?: ResolvedLink[];
}

const variantStyles = {
  light: {
    section: 'bg-bg text-fg',
    headingColor: 'text-fg',
    bodyColor: 'text-fg-muted',
    metaColor: 'text-fg-subtle',
    rule: 'bg-fg/10',
    accent: 'text-gold',
  },
  cream: {
    section: 'bg-bg-soft text-fg',
    headingColor: 'text-fg',
    bodyColor: 'text-fg-muted',
    metaColor: 'text-fg-subtle',
    rule: 'bg-fg/10',
    accent: 'text-gold',
  },
  dark: {
    section: 'bg-fg text-bg',
    headingColor: 'text-bg',
    bodyColor: 'text-bg/70',
    metaColor: 'text-bg/50',
    rule: 'bg-bg/15',
    accent: 'text-gold-light',
  },
} as const;

export function SplitHero({ data, locale }: { data: SplitHeroData; locale: Locale }) {
  const variant = data.variant || 'light';
  const v = variantStyles[variant];
  const mediaRight = (data.mediaSide || 'right') === 'right';
  const imgSrc = imageUrl(data.media?.image, 1800);

  const words = data.heading.trim().split(/\s+/);
  const lastWord = words.pop() || '';
  const leading = words.join(' ');

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image clip-path reveal + parallax
      if (imageWrapRef.current && imageInnerRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.to(imageInnerRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Text stagger reveal
      if (textRef.current) {
        const els = textRef.current.querySelectorAll('.reveal-item');
        gsap.from(els, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Hairline
      if (ruleRef.current) {
        gsap.from(ruleRef.current, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: ruleRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const mediaEl = (
    <figure className={`col-span-12 ${mediaRight ? 'md:col-span-7 md:order-2' : 'md:col-span-7 md:order-1'} relative`}>
      <div ref={imageWrapRef} className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden">
        <div ref={imageInnerRef} className="absolute inset-0 scale-110">
          {data.media?.type === 'video' && data.media.videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover cinematic"
              src={data.media.videoUrl}
              autoPlay muted loop playsInline aria-hidden
            />
          ) : imgSrc ? (
            <Image
              src={imgSrc}
              alt={data.media?.image?.alt || data.heading}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover cinematic"
              placeholder={data.media?.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={data.media?.image?.asset?.metadata?.lqip}
            />
          ) : (
            <div className="absolute inset-0 bg-fg/5" />
          )}
        </div>
        <div className="grain" aria-hidden />
      </div>
      <figcaption className={`mt-3 flex items-baseline justify-between text-label ${v.metaColor}`}>
        <span>Pl. {((data._key || '').charCodeAt(0) % 7) + 2}</span>
        <span className="truncate ms-4">{data.media?.image?.alt || ''}</span>
      </figcaption>
    </figure>
  );

  const textEl = (
    <div className={`col-span-12 ${mediaRight ? 'md:col-span-5 md:order-1' : 'md:col-span-5 md:order-2'} flex flex-col justify-center md:py-16`}>
      <div ref={textRef} className="max-w-md">
        {data.eyebrow && (
          <div className="reveal-item flex items-center gap-3 mb-10">
            <span className={`h-px w-10 ${v.rule}`} aria-hidden />
            <span className="label">{data.eyebrow}</span>
          </div>
        )}
        <h2
          className={`reveal-item font-display ${v.headingColor}`}
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
            lineHeight: '1.05',
            letterSpacing: '-0.025em',
          }}
        >
          {leading}{' '}
          <span className={`italic ${v.accent}`}>{lastWord}.</span>
        </h2>
        {data.body && (
          <p className={`reveal-item mt-8 text-body-lg ${v.bodyColor}`}>{data.body}</p>
        )}
        {data.ctas && data.ctas.length > 0 && (
          <div className="reveal-item mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {data.ctas.map((cta, i) => (
              <Link
                key={`${cta.label}-${i}`}
                href={resolveLink(cta, locale)}
                target={cta.newTab ? '_blank' : undefined}
                rel={cta.newTab ? 'noopener noreferrer' : undefined}
                className={`link-underline text-label ${variant === 'dark' ? 'text-bg' : 'text-fg'}`}
              >
                {cta.label}<span aria-hidden>&rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={v.section}>
      <div className="container py-20 md:py-28 grid grid-cols-12 gap-x-6 gap-y-10">
        {mediaRight ? (
          <>
            {textEl}
            {mediaEl}
          </>
        ) : (
          <>
            {mediaEl}
            {textEl}
          </>
        )}
      </div>
      <div className="container">
        <div ref={ruleRef} className={`h-px ${v.rule} origin-left`} />
      </div>
    </section>
  );
}

