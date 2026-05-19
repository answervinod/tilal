'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/i18n/config';
import { imageUrl } from '../../sanity/lib/image';
import type { ProjectListItem } from '../../sanity/lib/types';

const projects = [
  {
    slug: 'tilal-dunes',
    image: '/images/page12_img2.jpeg',
    name: 'Tilal Dunes',
    nameAr: 'تلال الكثبان',
    tagline: 'Contemporary villas for urban families, blending clean architecture with natural surroundings.',
    taglineAr: 'فلل عصرية للعائلات الحضرية، تمزج الهندسة النظيفة بالبيئة الطبيعية.',
    beds: '4 & 5 Bedroom',
    size: '2,368 sq. ft.',
  },
  {
    slug: 'tilal-oasis',
    image: '/images/page13_img2.jpeg',
    name: 'Tilal Oasis',
    nameAr: 'واحة تلال',
    tagline: 'A tranquil residential escape centered around water features and community living.',
    taglineAr: 'ملاذ سكني هادئ يركز على المسطحات المائية والحياة المجتمعية.',
    beds: '4 & 5 Bedroom',
    size: '2,850 sq. ft.',
  },
  {
    slug: 'tilal-islands',
    image: '/images/page14_img2.jpeg',
    name: 'Tilal Islands',
    nameAr: 'جزر تلال',
    tagline: 'Ultra-premium waterfront living with exclusive mansions and private landscapes.',
    taglineAr: 'معيشة فائقة الفخامة على الواجهة المائية مع قصور حصرية ومناظر طبيعية خاصة.',
    beds: '6 Bedroom',
    size: '5,683 sq. ft.',
  },
];

export interface ProjectsShowcaseData {
  _type: 'projectsShowcaseBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  projects?: ProjectListItem[];
}

interface Props {
  locale?: Locale;
  data?: ProjectsShowcaseData;
}

const defaults: Record<string, { eyebrow: string; heading: string; desc: string }> = {
  en: {
    eyebrow: 'Signature Developments',
    heading: 'Thoughtfully designed communities',
    desc: 'Explore a portfolio of residential clusters, each offering a unique lifestyle experience.',
  },
  ar: {
    eyebrow: 'تطويرات مميزة',
    heading: 'مجتمعات مصممة بعناية',
    desc: 'استكشف مجموعة من المجمعات السكنية، كل منها يقدم تجربة حياة فريدة.',
  },
};

export function ProjectsShowcase({ locale, data }: Props) {
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
        const cards = cardsRef.current.querySelectorAll('.project-card');
        gsap.from(cards, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
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
    <section ref={sectionRef} className="bg-fg py-24 md:py-40">
      <div className="container">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24">
          <div className="max-w-xl">
            <span className="label text-gold mb-4 block">{data?.eyebrow ?? defaults[locale || 'en'].eyebrow}</span>
            <h2
              className="font-display text-bg"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {data?.heading ?? defaults[locale || 'en'].heading}
            </h2>
          </div>
          <p className="text-bg/50 text-lg max-w-sm mt-6 md:mt-0">
            {data?.description ?? defaults[locale || 'en'].desc}
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {(data?.projects ?? projects).map((project, i) => {
            const p = project as any;
            const cover = p.cover || p.image;
            const imgSrc = (cover?.asset ? imageUrl(cover) : (typeof cover === 'string' ? cover : undefined)) || '/images/page12_img2.jpeg';
            const slug = p.slug?.current || p.slug;
            return (
              <Link
                key={i}
                href={`/${locale || 'en'}/projects/${slug}`}
                className="project-card group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={imgSrc}
                    alt={p.title || p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fg/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-label text-bg/70">{p.beds || '4 & 5 Bedroom'}</span>
                      <span className="w-1 h-1 bg-bg/40 rounded-full" />
                      <span className="text-label text-bg/70">{p.size || '2,368 sq. ft.'}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-bg tracking-tight">
                      {p.title || p.name}
                    </h3>
                  </div>
                </div>
                <p className="text-bg/50 leading-relaxed">{p.tagline || p.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
