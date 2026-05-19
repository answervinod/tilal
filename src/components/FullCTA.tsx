'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/i18n/config';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage, ResolvedLink } from '../../sanity/lib/types';

export interface FullCTAData {
  _type: 'fullCtaBlock';
  _key: string;
  label?: string;
  heading?: string;
  body?: string;
  buttons?: ResolvedLink[];
  background?: SanityImage;
}

interface Props {
  locale?: Locale;
  data?: FullCTAData;
}

const defaults: Record<string, { label: string; heading: string; body: string; btn1: string; btn2: string }> = {
  en: {
    label: 'Begin Your Journey',
    heading: 'Experience Tilal. Book your private tour today.',
    body: 'Discover a property experience designed for those who accept nothing less than extraordinary. Our team is ready to assist you in finding your dream residence.',
    btn1: 'Book a Private Viewing',
    btn2: 'Explore Projects',
  },
  ar: {
    label: 'ابدأ رحلتك',
    heading: 'جرب تيلال. احجز جولتك الخاصة اليوم.',
    body: 'اكتشف تجربة عقارية مصممة لأولئك الذين لا يقبلون بأقل من الاستثنائي. فريقنا مستعد لمساعدتك في العثور على مسكن أحلامك.',
    btn1: 'احجز جولة خاصة',
    btn2: 'استكشف المشاريع',
  },
};

export function FullCTA({ locale, data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1a3a]">
        <Image
          src={data?.background ? (imageUrl(data.background) || '/images/tilal-blueprint.png') : '/images/tilal-blueprint.png'}
          alt="Tilal master plan blueprint"
          fill
          sizes="100vw"
          className="object-contain object-center"
        />
      </div>

      <div className="container relative z-10 py-24 md:py-40">
        <div ref={contentRef} className="max-w-3xl">
          <span className="label mb-6 block" style={{ color: '#FFD700' }}>{data?.label ?? defaults[locale || 'en'].label}</span>
          <h2
            className="font-display mb-8 text-white"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            {data?.heading ?? defaults[locale || 'en'].heading}
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: '#FFD700' }}>
            {data?.body ?? defaults[locale || 'en'].body}
          </p>
          <div className="flex flex-wrap gap-4">
            {data?.buttons && data.buttons.length > 0 ? (
              data.buttons.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.href || (btn.internal ? `/${locale || 'en'}/${btn.internal.slug}` : '#')}
                  target={btn.newTab ? '_blank' : undefined}
                  className={`inline-flex text-sm font-medium tracking-wide uppercase px-8 py-4 transition-all duration-300 ${i === 0 ? 'bg-white text-fg hover:bg-[#FFD700]' : 'border-2 border-white text-white hover:bg-white hover:text-fg'}`}
                >
                  {btn.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href={`/${locale || 'en'}/contact`}
                  className="inline-flex text-sm font-medium tracking-wide uppercase px-8 py-4 bg-white text-fg hover:bg-[#FFD700] transition-all duration-300"
                >
                  {defaults[locale || 'en'].btn1}
                </Link>
                <Link
                  href={`/${locale || 'en'}/projects`}
                  className="inline-flex text-sm font-medium tracking-wide uppercase px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-fg transition-all duration-300"
                >
                  {defaults[locale || 'en'].btn2}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
