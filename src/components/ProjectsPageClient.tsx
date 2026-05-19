'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/i18n/config';

const projects = [
  {
    slug: 'tilal-dunes',
    image: '/images/page12_img2.jpeg',
    name: 'Tilal Dunes',
    nameAr: 'تلال الكثبان',
    tagline: 'Contemporary villas designed for urban families, blending clean architecture with natural surroundings.',
    taglineAr: 'فلل عصرية مصممة للعائلات الحضرية، تمزج الهندسة النظيفة بالبيئة الطبيعية.',
    beds: '4 & 5 Bedroom',
    size: '2,368 sq. ft.',
    price: 'AED 4.2M+',
    features: ['Open-plan interiors', 'Private gardens', 'Community lagoon access'],
    featuresAr: ['مساحات داخلية مفتوحة', 'حدائق خاصة', 'وصول إلى البحيرة المجتمعية'],
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
    price: 'AED 5.1M+',
    features: ['Waterfront views', 'Landscaped courtyards', 'Community parks'],
    featuresAr: ['إطلالات على الواجهة المائية', 'ساحات منسقة', 'منتزهات مجتمعية'],
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
    price: 'AED 12M+',
    features: ['Private waterfront', 'Expansive layouts', 'Premium finishes'],
    featuresAr: ['واجهة مائية خاصة', 'تخطيطات واسعة', 'تشطيبات فاخرة'],
  },
  {
    slug: 'grand-mansions',
    image: '/images/page23_img1.jpeg',
    gallery: ['/images/page23_img5.jpeg'],
    name: 'Grand Mansions',
    nameAr: 'القصور الكبرى',
    tagline: 'Elevated luxury with enhanced architectural scale and bespoke detailing.',
    taglineAr: 'فخامة مرتفعة مع نطاق معماري معزز وتفاصيل مخصصة.',
    beds: '5 & 6 Bedroom',
    size: '4,200 sq. ft.',
    price: 'AED 8.5M+',
    features: ['Bespoke interiors', 'Private pools', 'Smart home systems'],
    featuresAr: ['مساحات داخلية مخصصة', 'مسابح خاصة', 'أنظمة منزل ذكية'],
  },
  {
    slug: 'sea-palace',
    image: '/images/page24_img1.jpeg',
    name: 'Sea Palace',
    nameAr: 'قصر البحر',
    tagline: 'Ultra-premium residences designed for elite living with palace-level design.',
    taglineAr: 'مساكن فائقة الفخامة مصممة للحياة الراقية بتصميم على مستوى القصور.',
    beds: '6 & 7 Bedroom',
    size: '7,500 sq. ft.',
    price: 'AED 18M+',
    features: ['Palace-level architecture', 'Private marina access', 'Dedicated staff quarters'],
    featuresAr: ['هندسة على مستوى القصور', 'وصول إلى مرسى خاص', 'أماكن إقامة مخصصة للموظفين'],
  },
];

export function ProjectsPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        });
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.project-card');
        cards.forEach((card) => {
          gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-bg">
      {/* Hero Banner */}
      <section ref={heroRef} className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/page20_img3.jpeg"
            alt="Tilal Developments"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'تطويرات مميزة' : 'Signature Developments'}</span>
            <h1
              className="font-display text-bg max-w-3xl"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {locale === 'ar' ? 'تطويراتنا' : 'Our Developments'}
            </h1>
            <p className="text-bg/60 text-lg md:text-xl max-w-xl mt-6 leading-relaxed">
              {locale === 'ar'
                ? 'مجموعة منسقة من المجتمعات السكنية المصممة لأنماط حياة متنوعة وأهداف استثمارية.'
                : 'A curated collection of residential communities designed for diverse lifestyles and investment goals.'}
            </p>
          </div>
        </div>
      </section>

      {/* Project Cards */}
      <section className="container py-20 md:py-32">
        <div ref={cardsRef} className="space-y-20 md:space-y-32">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              className={`project-card grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              <div className={`space-y-4 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {project.gallery && project.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {project.gallery.map((gimg, gi) => (
                      <div key={gi} className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={gimg}
                          alt={`${project.name} gallery ${gi + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-label text-fg-muted">{project.beds}</span>
                  <span className="w-1 h-1 bg-fg/20 rounded-full" />
                  <span className="text-label text-fg-muted">{project.size}</span>
                </div>
                <h2
                  className="font-display text-fg mb-4"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {locale === 'ar' ? project.nameAr : project.name}
                </h2>
                <p className="text-fg-muted text-lg leading-relaxed mb-6 max-w-md">
                  {locale === 'ar' ? project.taglineAr : project.tagline}
                </p>
                <ul className="space-y-2 mb-8">
                  {(locale === 'ar' ? project.featuresAr : project.features).map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-fg/70">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-6">
                  <span className="font-display text-2xl text-gold">{project.price}</span>
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="text-sm font-medium tracking-wide uppercase px-6 py-3 bg-fg text-bg hover:bg-gold hover:text-fg transition-all duration-300"
                  >
                    {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
