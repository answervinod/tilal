'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import type { SanityImage } from '../../sanity/lib/types';

const amenities = [
  { image: '/images/page16_img2.jpeg', title: 'The Clubhouse', titleAr: 'النادي', subtitle: 'Premium social hub', subAr: 'مركز اجتماعي راقٍ' },
  { image: '/images/page17_img2.jpeg', title: 'The Sunken Pearl', titleAr: 'اللؤلؤة الغارقة', subtitle: 'Artificial beachfront', subAr: 'واجهة شاطئية اصطناعية' },
  { image: '/images/page18_img1.jpeg', title: 'Aira Realm', titleAr: 'عالم آيرا', subtitle: 'Central park & gardens', subAr: 'حديقة مركزية ومنتزهات' },
  { image: '/images/page19_img1.jpeg', title: 'Momentum Loop', titleAr: 'حلقة الزخم', subtitle: 'Cycling & jogging track', subAr: 'مسار للدراجات والجري' },
  { image: '/images/page19_img3.jpeg', title: 'The Farmhouse', titleAr: 'بيت المزرعة', subtitle: 'Community gathering', subAr: 'تجمع مجتمعي' },
  { image: '/images/page19_img4.jpeg', title: 'Swimmable Lakes', titleAr: 'بحيرات قابلة للسباحة', subtitle: 'Crystal-clear lagoons', subAr: 'بحيرات صافية كالبلور' },
];

export interface AmenitiesPreviewData {
  _type: 'amenitiesBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  items?: Array<{ title?: string; subtitle?: string; image?: SanityImage }>;
}

interface Props {
  locale?: Locale;
  data?: AmenitiesPreviewData;
}

const defaults: Record<string, { eyebrow: string; heading: string }> = {
  en: { eyebrow: 'World-Class Amenities', heading: 'Designed to elevate every aspect of daily life' },
  ar: { eyebrow: 'مرافق عالمية المستوى', heading: 'مصممة لرفع كل جانب من جوانب الحياة اليومية' },
};

export function AmenitiesPreview({ locale, data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.amenity-item');
        gsap.from(items, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
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

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(data?.items ?? amenities).map((item, i) => {
            const imgSrc = (item as any).image?.asset ? imageUrl((item as any).image) : (typeof (item as any).image === 'string' ? (item as any).image : undefined);
            return (
              <div key={i} className="amenity-item group relative aspect-[4/3] overflow-hidden">
                <Image
                  src={imgSrc || '/images/page16_img2.jpeg'}
                  alt={(item as any).title || ''}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-fg/30 group-hover:bg-fg/50 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-label text-bg/60 mb-1">{(item as any).subtitle}</p>
                  <h3 className="font-display text-xl md:text-2xl text-bg tracking-tight">{(item as any).title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
