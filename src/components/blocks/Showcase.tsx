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

export interface ShowcaseData {
  _type: 'showcaseBlock';
  _key: string;
  media?: {
    type?: 'image' | 'video';
    image?: SanityImage;
    videoUrl?: string;
  };
  caption?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    meta?: string;
    cta?: ResolvedLink;
  };
  captionPosition?:
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right'
    | 'below'
    | 'none';
  height?: 'standard' | 'tall' | 'full';
}

const heights = {
  standard: 'aspect-[16/10] min-h-[480px]',
  tall: 'aspect-[16/11] min-h-[560px] md:min-h-[680px]',
  full: 'h-screen min-h-[640px]',
} as const;

export function Showcase({ data, locale }: { data: ShowcaseData; locale: Locale }) {
  const imgSrc = imageUrl(data.media?.image, 2400);
  const captionPos = data.captionPosition || 'bottom-left';
  const heightCls = heights[data.height || 'tall'];
  const c = data.caption;
  const hasCaption = c && (c.eyebrow || c.title || c.subtitle || c.meta || c.cta);

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header fade in
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Image reveal with scale + clip-path
      if (imageWrapRef.current && imageInnerRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: 'inset(10% 10% 10% 10%)', scale: 1.05 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.6,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Parallax on scroll
        gsap.to(imageInnerRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Caption stagger
      if (captionRef.current) {
        const items = captionRef.current.querySelectorAll('.cap-item');
        gsap.from(items, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: captionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg overflow-hidden">
      <div className="container py-20 md:py-32 grid grid-cols-12 gap-x-6 gap-y-8">
        <div ref={headerRef} className="col-span-12 flex items-baseline justify-between">
          <span className="index-mark">{c?.eyebrow ? `— ${c.eyebrow}` : '— Plate'}</span>
          {c?.meta && <span className="hidden md:inline index-mark">{c.meta}</span>}
        </div>

        <figure className="col-span-12 md:col-span-9">
          <div ref={imageWrapRef} className={`relative w-full overflow-hidden bg-fg/5 ${heightCls}`}>
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
                  alt={data.media?.image?.alt || c?.title || ''}
                  fill
                  sizes="(min-width: 768px) 75vw, 100vw"
                  className="object-cover cinematic"
                  placeholder={data.media?.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={data.media?.image?.asset?.metadata?.lqip}
                />
              ) : null}
            </div>
            <div className="grain" aria-hidden />
          </div>
        </figure>

        {hasCaption && (
          <aside ref={captionRef} className="col-span-12 md:col-span-3 flex flex-col justify-end md:justify-center">
            {c?.title && (
              <h3
                className="cap-item font-display text-fg leading-[1.05]"
                style={{
                  fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                  letterSpacing: '-0.018em',
                }}
              >
                {c.title}
              </h3>
            )}
            {c?.subtitle && (
              <p className="cap-item mt-3 text-[13px] text-fg-muted">
                <span className="italic">{c.subtitle}</span>
              </p>
            )}
            {c?.meta && (
              <p className="cap-item mt-6 text-label text-fg-subtle">{c.meta}</p>
            )}
            {c?.cta && (
              <Link
                href={resolveLink(c.cta, locale)}
                target={c.cta.newTab ? '_blank' : undefined}
                rel={c.cta.newTab ? 'noopener noreferrer' : undefined}
                className="cap-item mt-8 link-underline text-label text-fg self-start"
              >
                {c.cta.label}<span aria-hidden>&rarr;</span>
              </Link>
            )}
            <div className="cap-item mt-12 flex items-baseline gap-3 text-fg-subtle">
              <span className="text-label">{captionPos === 'bottom-right' ? 'Pl. ix' : 'Pl. iv'}</span>
              <span className="h-px w-8 bg-fg/10" aria-hidden />
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

