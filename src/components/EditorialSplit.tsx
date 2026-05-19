'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

interface EditorialSplitProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: { label: string; href: string };
  image?: SanityImage;
  imageSide?: 'left' | 'right';
  variant?: 'light' | 'cream';
}

export function EditorialSplit({
  eyebrow,
  heading,
  body,
  cta,
  image,
  imageSide = 'right',
  variant = 'light',
}: EditorialSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const imgSrc = image ? imageUrl(image, 1800) : null;
  const bgClass = variant === 'cream' ? 'bg-bg-soft' : 'bg-bg';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image clip-path reveal
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: imageSide === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.6,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Image parallax
      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          yPercent: -12,
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
        const els = textRef.current.querySelectorAll('.reveal');
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
    }, section);

    return () => ctx.revert();
  }, [imageSide]);

  const textContent = (
    <div ref={textRef} className="flex flex-col justify-center py-12 md:py-24 max-w-md">
      {eyebrow && (
        <div className="reveal flex items-center gap-3 mb-10">
          <span className="h-px w-10 bg-fg/10" aria-hidden />
          <span className="label">{eyebrow}</span>
        </div>
      )}
      <h2
        className="reveal font-display text-fg"
        style={{
          fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
        }}
      >
        {heading}
      </h2>
      {body && (
        <p className="reveal mt-8 text-body-lg text-fg-muted">{body}</p>
      )}
      {cta && (
        <div className="reveal mt-10">
          <Link href={cta.href} className="magnetic-btn">
            <span>{cta.label}</span>
          </Link>
        </div>
      )}
    </div>
  );

  const imageContent = (
    <figure className="relative">
      <div ref={imageWrapRef} className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden">
        <div ref={imageInnerRef} className="absolute inset-0 scale-110">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover cinematic"
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={image?.asset?.metadata?.lqip}
            />
          ) : (
            <div className="absolute inset-0 bg-fg/5" />
          )}
        </div>
        <div className="grain" aria-hidden />
      </div>
    </figure>
  );

  return (
    <section ref={sectionRef} className={`${bgClass} overflow-hidden`}>
      <div className="container py-20 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {imageSide === 'left' ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
