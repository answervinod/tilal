'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/i18n/config';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

export interface BrandIntroData {
  _type: 'brandIntroBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
}

interface BrandIntroProps {
  locale?: Locale;
  data?: BrandIntroData;
}

const defaults: Record<string, { eyebrow: string; heading: string; body: string }> = {
  en: {
    eyebrow: 'The Brand',
    heading: 'Tilal represents a new benchmark in modern real estate',
    body: "Where design, nature, and investment converge. Strategically located in Dubai's fastest-growing corridor, Tilal developments redefine residential living through architectural precision, integrated amenities, and long-term value creation.",
  },
  ar: {
    eyebrow: 'العلامة التجارية',
    heading: 'تيلال تمثل معياراً جديداً في العقارات العصرية',
    body: 'حيث يلتقي التصميم والطبيعة والاستثمار. تقع تيلال بشكل استراتيجي في أسرع ممرات نمو في دبي، وتعيد تعريف الحياة السكنية من خلال الدقة المعمارية والمرافق المتكاملة وخلق القيمة طويلة المدى.',
  },
};

export function BrandIntro({ locale, data }: BrandIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.6,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-fg py-24 md:py-40 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={textRef}>
            <span className="label text-gold mb-6 block">
              {data?.eyebrow ?? defaults[locale || 'en'].eyebrow}
            </span>
            <h2
              className="font-display text-bg mb-8"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {data?.heading ?? defaults[locale || 'en'].heading}
            </h2>
            {data?.body ? (
              <div className="text-bg/60 text-lg md:text-xl leading-relaxed max-w-lg">
                <PortableText value={data.body} />
              </div>
            ) : (
              <p className="text-bg/60 text-lg md:text-xl leading-relaxed max-w-lg">
                {defaults[locale || 'en'].body}
              </p>
            )}
          </div>

          <div ref={imageRef} className="relative aspect-[4/5] lg:aspect-[3/4]">
            <Image
              src={data?.image ? (imageUrl(data.image) ?? '/images/page3_img1.jpeg') : '/images/page3_img1.jpeg'}
              alt="Tilal community aerial view"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
