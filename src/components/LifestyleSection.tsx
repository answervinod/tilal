'use client';

import { useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

export interface LifestyleSectionData {
  _type: 'lifestyleBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  body?: PortableTextBlock[];
  listItems?: string[];
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
}

interface Props {
  locale?: Locale;
  data?: LifestyleSectionData;
}

const defaults: Record<string, { eyebrow: string; heading: string; body: string; items: string[] }> = {
  en: {
    eyebrow: 'Lifestyle',
    heading: 'A Life Beyond Living',
    body: 'Tilal communities are designed as immersive environments — where wellness, leisure, and social interaction come together seamlessly. From swimmable lagoons to cycling tracks and private clubhouses, every detail enhances everyday living.',
    items: ['Swimmable lagoons & private beaches', 'Cycling tracks & jogging paths', 'Private clubhouses & social hubs', 'Landscaped gardens & parks', 'Wellness & yoga spaces'],
  },
  ar: {
    eyebrow: 'أسلوب الحياة',
    heading: 'حياة تتجاوز المعيشة',
    body: 'تم تصميم مجتمعات تيلال كبيئات غامرة — حيث تندمج الصحة والترفيه والتفاعل الاجتماعي بسلاسة. من البحيرات القابلة للسباحة إلى مسارات الدراجات والنوادي الخاصة، كل تفصيل يعزز الحياة اليومية.',
    items: ['بحيرات قابلة للسباحة وشواطئ خاصة', 'مسارات دراجات ومسارات للجري', 'نوادي خاصة ومراكز اجتماعية', 'حدائق منسقة ومنتزهات', 'مساحات صحية ويوغا'],
  },
};

export function LifestyleSection({ locale, data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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

      if (textRef.current) {
        gsap.from(textRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg py-24 md:py-40 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={imageRef} className="relative aspect-[4/5] lg:order-1 order-2">
            <Image
              src={data?.image ? (imageUrl(data.image) || '/images/page15_img2.jpeg') : '/images/page15_img2.jpeg'}
              alt="Tilal lifestyle community"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div ref={textRef} className="lg:order-2 order-1">
            <span className="label text-gold mb-6 block">{data?.eyebrow ?? defaults[locale || 'en'].eyebrow}</span>
            <h2
              className="font-display text-fg mb-8"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {data?.heading ?? defaults[locale || 'en'].heading}
            </h2>
            {data?.body ? (
              <div className="text-fg-muted text-lg md:text-xl leading-relaxed max-w-lg mb-8">
                <PortableText value={data.body} />
              </div>
            ) : (
              <p className="text-fg-muted text-lg md:text-xl leading-relaxed max-w-lg mb-8">
                {defaults[locale || 'en'].body}
              </p>
            )}
            <ul className="space-y-4">
              {(data?.listItems ?? defaults[locale || 'en'].items).map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-fg/70">
                  <span className="w-8 h-px bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
