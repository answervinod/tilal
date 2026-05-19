'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const whyChoose = [
  { en: 'Strategic Dubai location', ar: 'موقع استراتيجي في دبي' },
  { en: 'High ROI potential', ar: 'إمكانية عائد استثمار مرتفع' },
  { en: 'Premium architectural design', ar: 'تصميم معماري فاخر' },
  { en: 'Fully integrated communities', ar: 'مجتمعات متكاملة بالكامل' },
  { en: 'Future-ready infrastructure', ar: 'بنية تحتية جاهزة للمستقبل' },
];

export function AboutPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
        });
      }

      [visionRef, missionRef, whyRef].forEach((ref) => {
        if (ref.current) {
          gsap.from(ref.current.children, {
            y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none none' },
          });
        }
      });

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 0 0 0%)', duration: 1.4, ease: 'power3.inOut',
            scrollTrigger: { trigger: imageRef.current, start: 'top 75%', toggleActions: 'play none none none' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-bg">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[55vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/page25_img1.jpeg" alt="Tilal About" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'العلامة التجارية' : 'The Brand'}</span>
            <h1 className="font-display text-bg" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'إعادة تعريف الحياة العصرية' : 'Redefining Modern Living'}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-fg-muted text-lg md:text-xl leading-relaxed mb-8">
              {locale === 'ar'
                ? 'تيلال هي أكثر من مجرد علامة عقارية — إنها فلسفة للمعيشة المتكاملة. كل تطوير متجذر في الاستدامة والتواصل والتصميم الخالد.'
                : 'Tilal is more than a real estate brand — it is a philosophy of integrated living. Every development is rooted in sustainability, connectivity, and timeless design.'}
            </p>
            <p className="text-fg-muted text-lg md:text-xl leading-relaxed">
              {locale === 'ar'
                ? 'يجمع نهجنا بين الابتكار المعماري والذكاء في أسلوب الحياة، مما يضمن أن كل مشروع يقدم قيمة عاطفية ومالية.'
                : 'Our approach combines architectural innovation with lifestyle intelligence, ensuring each project delivers both emotional and financial value.'}
            </p>
          </div>
          <div ref={imageRef} className="relative aspect-[4/3]">
            <Image src="/images/page26_img1.jpeg" alt="Tilal architecture" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-fg py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            <div ref={visionRef}>
              <span className="label text-gold mb-6 block">{locale === 'ar' ? 'الرؤية' : 'Vision'}</span>
              <h2 className="font-display text-bg mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                {locale === 'ar' ? 'مجتمعات سكنية أيقونية' : 'Iconic residential communities'}
              </h2>
              <p className="text-bg/60 text-lg leading-relaxed">
                {locale === 'ar'
                  ? 'خلق مجتمعات سكنية أيقونية توازن بين الفخامة والطبيعة ونمو الاستثمار طويل المدى.'
                  : 'To create iconic residential communities that balance luxury, nature, and long-term investment growth.'}
              </p>
            </div>
            <div ref={missionRef}>
              <span className="label text-gold mb-6 block">{locale === 'ar' ? 'المهمة' : 'Mission'}</span>
              <h2 className="font-display text-bg mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                {locale === 'ar' ? 'رفع معايير المعيشة' : 'Elevate living standards'}
              </h2>
              <p className="text-bg/60 text-lg leading-relaxed">
                {locale === 'ar'
                  ? 'تقديم تطويرات عالية الجودة ترفع معايير المعيشة مع تعظيم عوائد المستثمرين.'
                  : 'To deliver high-quality developments that elevate living standards while maximizing investor returns.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={whyRef}>
            <span className="label text-gold mb-6 block">{locale === 'ar' ? 'لماذا تيلال' : 'Why Tilal'}</span>
            <h2 className="font-display text-fg mb-10" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'لماذا تختار تيلال' : 'Why Choose Tilal'}
            </h2>
            <ul className="space-y-4">
              {whyChoose.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-fg/80 text-lg">
                  <span className="w-8 h-px bg-gold" />
                  {locale === 'ar' ? item.ar : item.en}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5]">
            <Image src="/images/page26_img2.jpeg" alt="Tilal lifestyle" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
