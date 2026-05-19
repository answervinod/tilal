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

export interface HeroData {
  _type: 'heroBlock';
  _key: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: 'left' | 'center';
  ctas?: ResolvedLink[];
  media?: {
    type?: 'image' | 'video';
    image?: SanityImage;
    videoUrl?: string;
    overlay?: number;
  };
}

export function Hero({ data, locale }: { data: HeroData; locale: Locale }) {
  const imgUrl = imageUrl(data.media?.image, 1800);
  const isVideo = data.media?.type === 'video' && data.media.videoUrl;
  const words = data.heading.trim().split(/\s+/);
  const lastWord = words.pop() || '';
  const leadingHeading = words.join(' ');

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Label fades in
      if (labelRef.current) {
        tl.from(labelRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0);
      }

      // Heading words reveal with stagger
      if (headingRef.current) {
        const wordSpans = headingRef.current.querySelectorAll('.word');
        tl.from(wordSpans, {
          y: '100%',
          opacity: 0,
          duration: 1,
          stagger: 0.06,
          ease: 'power3.out',
        }, 0.2);
      }

      // Subheading
      if (subRef.current) {
        tl.from(subRef.current, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.6);
      }

      // CTAs
      if (ctaRef.current) {
        tl.from(ctaRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.8);
      }

      // Image reveal with clip-path
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          { clipPath: 'inset(100% 0 0 0)', scale: 1.1 },
          {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: imageContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Image parallax on scroll
      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Hairline expands
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

  return (
    <section ref={sectionRef} className="relative bg-bg text-fg overflow-hidden">
      <div className="container grid grid-cols-12 gap-x-6 gap-y-10 pt-14 md:pt-24 pb-20 md:pb-32">
        <div className="col-span-12 flex items-baseline justify-between">
          <span className="index-mark">01 — Introduction</span>
          <span className="hidden md:inline index-mark">{new Date().getFullYear()}</span>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col justify-end">
          {data.eyebrow && (
            <p ref={labelRef} className="label mb-10">{data.eyebrow}</p>
          )}
          <h1
            ref={headingRef}
            className="font-display text-fg"
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 7rem)',
              lineHeight: '0.95',
              letterSpacing: '-0.03em',
            }}
          >
            <span className="overflow-hidden inline-block">
              <span className="word inline-block">{leadingHeading}</span>
            </span>{' '}
            <span className="overflow-hidden inline-block">
              <span className="word inline-block italic text-gold">{lastWord}</span>
            </span>
          </h1>

          {data.subheading && (
            <p ref={subRef} className="mt-10 max-w-xl text-body-lg text-fg-muted">
              {data.subheading}
            </p>
          )}

          {data.ctas && data.ctas.length > 0 && (
            <div ref={ctaRef} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              {data.ctas.map((cta, i) =>
                i === 0 ? (
                  <Link
                    key={`${cta.label}-${i}`}
                    href={resolveLink(cta, locale)}
                    target={cta.newTab ? '_blank' : undefined}
                    rel={cta.newTab ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-3 bg-fg text-bg px-8 py-4 text-label hover:bg-gold transition-colors duration-700"
                  >
                    {cta.label}
                    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                ) : (
                  <Link
                    key={`${cta.label}-${i}`}
                    href={resolveLink(cta, locale)}
                    target={cta.newTab ? '_blank' : undefined}
                    rel={cta.newTab ? 'noopener noreferrer' : undefined}
                    className="link-underline text-label text-fg-muted hover:text-fg"
                  >
                    {cta.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-span-5 md:pt-16">
          <figure className="relative">
            <div ref={imageContainerRef} className="relative aspect-[4/5] overflow-hidden bg-fg/5">
              <div ref={imageInnerRef} className="absolute inset-0 scale-110">
                {isVideo ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover cinematic"
                    src={data.media!.videoUrl!}
                    autoPlay muted loop playsInline aria-hidden
                  />
                ) : imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={data.media?.image?.alt || ''}
                    fill priority
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="object-cover cinematic"
                    placeholder={data.media?.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={data.media?.image?.asset?.metadata?.lqip}
                  />
                ) : null}
              </div>
              <div className="grain" aria-hidden />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between text-label text-fg-subtle">
              <span>Pl. 01</span>
              <span>{data.media?.image?.alt ? data.media.image.alt.split(' ').slice(0, 6).join(' ') : 'From the Tilal archive'}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="container">
        <div ref={ruleRef} className="rule origin-left" />
      </div>
    </section>
  );
}

