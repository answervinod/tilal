'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const communityAmenities = [
  { image: '/images/page16_img2.jpeg', title: 'The Clubhouse', titleAr: 'النادي', desc: 'A premium social hub for residents.', descAr: 'مركز اجتماعي راقٍ للسكان.' },
  { image: '/images/page17_img2.jpeg', title: 'The Sunken Pearl', titleAr: 'اللؤلؤة الغارقة', desc: 'Lagoon-style beachfront experience.', descAr: 'تجربة واجهة شاطئية على طراز البحيرة.' },
  { image: '/images/page18_img1.jpeg', title: 'Aira Realm', titleAr: 'عالم آيرا', desc: 'Landscaped green spaces for relaxation.', descAr: 'مساحات خضراء منسقة للاسترخاء.' },
  { image: '/images/page19_img1.jpeg', title: 'Momentum Loop', titleAr: 'حلقة الزخم', desc: 'Active lifestyle infrastructure.', descAr: 'بنية تحتية لأسلوب حياة نشط.' },
  { image: '/images/page19_img3.jpeg', title: 'The Farmhouse', titleAr: 'بيت المزرعة', desc: 'Community gathering and organic experiences.', descAr: 'تجمع مجتمعي وتجارب عضوية.' },
  { image: '/images/page19_img4.jpeg', title: 'Swimmable Lakes', titleAr: 'بحيرات قابلة للسباحة', desc: 'Crystal-clear lagoon experiences.', descAr: 'تجارب بحيرات صافية كالبلور.' },
];

const residentialAmenities = [
  { en: 'Kids Play Area', ar: 'منطقة ألعاب الأطفال' },
  { en: 'Kids Pool', ar: 'مسبح الأطفال' },
  { en: 'Fully Equipped Gym', ar: 'صالة رياضية مجهزة بالكامل' },
  { en: 'Yoga & Wellness Spaces', ar: 'مساحات اليوغا والصحة' },
  { en: 'Private Golf Course', ar: 'ملعب جولف خاص' },
  { en: 'Swimmable Lakes', ar: 'بحيرات قابلة للسباحة' },
  { en: 'Horse Stables (Animara)', ar: 'إسطبلات الخيول (أنيمارا)' },
];

export function AmenitiesPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
        });
      }
      if (gridRef.current) {
        gsap.from(gridRef.current.querySelectorAll('.amenity-card'), {
          y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
      if (resRef.current) {
        gsap.from(resRef.current.children, {
          y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: resRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-bg">
      <section ref={heroRef} className="relative h-[55vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/page2_img3.jpeg" alt="Amenities" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'مرافق عالمية المستوى' : 'World-Class Amenities'}</span>
            <h1 className="font-display text-bg" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'مصممة لرفع كل جانب من جوانب الحياة اليومية' : 'Designed to elevate every aspect of daily life'}
            </h1>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-32">
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityAmenities.map((item, i) => (
            <div key={i} className="amenity-card group relative aspect-[4/3] overflow-hidden">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-fg/30 group-hover:bg-fg/50 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl md:text-2xl text-bg tracking-tight">{locale === 'ar' ? item.titleAr : item.title}</h3>
                <p className="text-bg/60 text-sm mt-1">{locale === 'ar' ? item.descAr : item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-fg py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="label text-gold mb-6 block">Residential Amenities</span>
              <h2 className="font-display text-bg mb-10" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                {locale === 'ar' ? 'كل منزل يأتي مع وصول متميز' : 'Every home comes with premium access'}
              </h2>
              <div ref={resRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {residentialAmenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-bg/70 py-3 border-b border-bg/10">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {locale === 'ar' ? item.ar : item.en}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <Image src="/images/page24_img5.jpeg" alt="Residential amenities" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
