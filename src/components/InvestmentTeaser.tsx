'use client';

import { useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage, ResolvedLink } from '../../sanity/lib/types';

const stats = [
  { value: 'AED 4.2M+', label: 'Starting Price', labelAr: 'السعر الابتدائي' },
  { value: '25%', label: 'Projected Annual ROI', labelAr: 'عائد استثمار سنوي متوقع' },
  { value: '98%', label: 'Client Satisfaction', labelAr: 'رضا العملاء' },
  { value: '5', label: 'Signature Developments', labelAr: 'تطويرات مميزة' },
];

export interface InvestmentTeaserData {
  _type: 'investmentBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  body?: PortableTextBlock[];
  listItems?: string[];
  stats?: Array<{ value?: string; label?: string }>;
  image?: SanityImage;
  ctas?: ResolvedLink[];
}

interface Props {
  locale?: Locale;
  data?: InvestmentTeaserData;
}

const defaults: Record<string, { eyebrow: string; heading: string; body: string; items: string[] }> = {
  en: {
    eyebrow: 'Investment',
    heading: 'Smart Investment Opportunities',
    body: "Tilal developments are designed not just for living — but for wealth creation. With Dubai's expanding infrastructure and increasing demand for premium housing, Tilal offers strong capital appreciation and rental yield potential.",
    items: ['High-demand location with limited luxury inventory', 'Strong resale value potential', 'Strategic urban expansion backing growth'],
  },
  ar: {
    eyebrow: 'استثمار',
    heading: 'فرص استثمارية ذكية',
    body: 'تم تصميم تطويرات تيلال ليس فقط للمعيشة — بل لخلق الثروة. مع التوسع المتزايد في البنية التحتية في دبي والطلب المتزايد على المساكن الفاخرة، تقدم تيلال إمكانيات قوية لتقدير رأس المال وعوائد الإيجار.',
    items: ['موقع عالي الطلب بمخزون محدود من الفخامة', 'إمكانية قوية لإعادة البيع', 'توسع حضري استراتيجي يدعم النمو'],
  },
};

export function InvestmentTeaser({ locale, data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 0 0 0%)',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item');
        gsap.from(items, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-fg py-24 md:py-40 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 md:mb-32">
          <div ref={textRef}>
            <span className="label text-gold mb-6 block">{data?.eyebrow ?? defaults[locale || 'en'].eyebrow}</span>
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
              <div className="text-bg/60 text-lg md:text-xl leading-relaxed max-w-lg mb-8">
                <PortableText value={data.body} />
              </div>
            ) : (
              <p className="text-bg/60 text-lg md:text-xl leading-relaxed max-w-lg mb-8">
                {defaults[locale || 'en'].body}
              </p>
            )}
            <ul className="space-y-3 text-bg/50">
              {(data?.listItems ?? defaults[locale || 'en'].items).map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div ref={imageRef} className="relative aspect-[4/3]">
            <Image
              src={data?.image ? (imageUrl(data.image) || '/images/page19_img5.jpeg') : '/images/page19_img5.jpeg'}
              alt="Tilal luxury property investment"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {(data?.stats ?? stats).map((stat, i) => (
            <div key={i} className="stat-item border-t border-bg/10 pt-6">
              <p
                className="font-display text-gold mb-2"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {(stat as any).value}
              </p>
              <p className="text-label text-bg/50">{(stat as any).label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
