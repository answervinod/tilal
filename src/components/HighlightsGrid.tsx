'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const highlights = [
  {
    image: '/images/page5_img3.jpeg',
    label: 'Prime Location',
    labelAr: 'موقع متميز',
    title: 'Strategic Positioning',
    titleAr: 'تموضع استراتيجي',
    description:
      'Positioned within Dubai Academic City with seamless access to Downtown, DXB Airport, and key economic hubs.',
    descAr: 'تقع ضمن مدينة دبي الأكاديمية مع وصول سلس إلى وسط المدينة ومطار دبي الدولي والمراكز الاقتصادية الرئيسية.',
  },
  {
    image: '/images/page7_img2.jpeg',
    label: 'Nature-Driven Design',
    labelAr: 'تصميم محفوف بالطبيعة',
    title: 'Master-Planned Landscapes',
    titleAr: 'مناظر طبيعية مخططة بإتقان',
    description:
      'Green landscapes, water bodies, and open-air experiences designed to harmonize with nature.',
    descAr: 'مناظر طبيعية خضراء ومسطحات مائية وتجارب في الهواء الطلق مصممة لتناغم مع الطبيعة.',
  },
  {
    image: '/images/page9_img5.jpeg',
    label: 'Luxury Living',
    labelAr: 'حياة فاخرة',
    title: 'Modern Elite Residences',
    titleAr: 'مساكن نخبة عصرية',
    description:
      'Villas, mansions, and bespoke residences designed for those who demand the extraordinary.',
    descAr: 'فلل وقصور ومساكن مخصصة مصممة لأولئك الذين يطالبون بما هو استثنائي.',
  },
  {
    image: '/images/page10_img1.jpeg',
    label: 'Investment Value',
    labelAr: 'قيمة استثمارية',
    title: 'Strong Appreciation',
    titleAr: 'تقدير قوي',
    description:
      'Backed by strategic urban expansion and high-demand location fundamentals.',
    descAr: 'مدعومة بالتوسع الحضري الاستراتيجي وأسس موقع عالي الطلب.',
  },
];

export interface HighlightsGridData {
  _type: 'highlightsBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  items?: Array<{
    label?: string;
    title?: string;
    description?: string;
    image?: SanityImage;
  }>;
}

interface Props {
  locale?: Locale;
  data?: HighlightsGridData;
}

const defaults: Record<string, { eyebrow: string; heading: string }> = {
  en: { eyebrow: 'Why Tilal', heading: 'Designed for elevated lifestyles' },
  ar: { eyebrow: 'لماذا تيلال', heading: 'مصممة لأنماط الحياة الراقية' },
};

export function HighlightsGrid({ locale, data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.highlight-card');
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg py-24 md:py-40">
      <div className="container">
        <div ref={headerRef} className="max-w-2xl mb-16 md:mb-24">
          <span className="label text-gold mb-4 block">{data?.eyebrow ?? defaults[locale || 'en'].eyebrow}</span>
          <h2
            className="font-display text-fg"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            {data?.heading ?? defaults[locale || 'en'].heading}
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {(data?.items ?? highlights).map((item, i) => {
            const imgSrc = (item as any).image?.asset ? imageUrl((item as any).image) : (item as any).image;
            return (
              <div key={i} className="highlight-card group">
                <div className="relative aspect-[16/10] overflow-hidden mb-6">
                  <Image
                    src={imgSrc || '/images/page5_img3.jpeg'}
                    alt={(item as any).title || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="label text-gold mb-2 block">{(item as any).label}</span>
                <h3 className="font-display text-2xl md:text-3xl text-fg mb-3 tracking-tight">
                  {(item as any).title}
                </h3>
                <p className="text-fg-muted leading-relaxed max-w-md">{(item as any).description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
