'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const materials = [
  { image: '/images/page30_img1.jpeg', name: 'Fluted Marble', nameAr: 'رخام مضلع', desc: 'Textured elegance for feature walls and surfaces.', descAr: 'أناقة نسيجية للجدران المميزة والأسطح.' },
  { image: '/images/page30_img2.jpeg', name: 'Light Oak Wood Veneer', nameAr: 'قشرة خشب البلوط الفاتح', desc: 'Warm natural tones for interior millwork and cabinetry.', descAr: 'نغمات طبيعية دافئة للأعمال الخشبية الداخلية والخزائن.' },
  { image: '/images/page30_img3.jpeg', name: 'White Limestone Ceramic Tiles', nameAr: 'بلاط سيراميك حجر جيري أبيض', desc: 'Cool, refined flooring for living and bath spaces.', descAr: 'أرضيات بارزة وناعمة لمساحات المعيشة والحمامات.' },
  { image: '/images/page30_img5.jpeg', name: 'Travertine Marble', nameAr: 'رخام ترافرتين', desc: 'Timeless stone with organic, earthy character.', descAr: 'حجر خالد بطابع عضوي وأرضي.' },
  { image: '/images/page30_img6.jpeg', name: 'Champagne Metal Finishes', nameAr: 'تشطيبات معدنية شامبانيا', desc: 'Brushed metal accents for fixtures and hardware.', descAr: 'لمسات معدنية مصقولة للتركيبات والأجهزة.' },
  { image: '/images/page30_img7.jpeg', name: 'Tinted Bronze Mirrors', nameAr: 'مرايا برونزية ملونة', desc: 'Antiqued reflective surfaces for bathrooms and wardrobes.', descAr: 'أسطح عاكسة عتيقة للحمامات وخزائن الملابس.' },
];

export function MaterialsPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
        });
      }
      if (gridRef.current) {
        gsap.from(gridRef.current.querySelectorAll('.material-card'), {
          y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
      if (closingRef.current) {
        gsap.from(closingRef.current, {
          y: 40, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: closingRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-bg">
      <section ref={heroRef} className="relative h-[55vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/page30_img8.jpeg" alt="Materials" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'المواد والتصميم' : 'Materials & Design'}</span>
            <h1 className="font-display text-bg" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'مصنوعة بإتقان' : 'Crafted with Excellence'}
            </h1>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-32">
        <p className="text-fg-muted text-lg md:text-xl leading-relaxed max-w-3xl mb-16 md:mb-24">
          {locale === 'ar'
            ? 'كل مسكن مبني باستخدام مواد متميزة تم اختيارها للمتانة والأناقة والجاذبية الخالدة. كل تفصيل منسق ليعكس الرقي والجودة.'
            : 'Each residence is built using premium materials selected for durability, elegance, and timeless appeal. Every detail is curated to reflect sophistication and quality.'}
        </p>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((item, i) => (
            <div key={i} className="material-card group">
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <h3 className="font-display text-xl text-fg tracking-tight mb-1">{locale === 'ar' ? item.nameAr : item.name}</h3>
              <p className="text-fg-muted text-sm">{locale === 'ar' ? item.descAr : item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={closingRef} className="bg-fg py-20 md:py-32">
        <div className="container text-center">
          <h2 className="font-display text-bg mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            {locale === 'ar' ? 'تصميم خالد، مبني ليبقى' : 'Timeless Design, Built to Last'}
          </h2>
          <p className="text-bg/60 text-lg max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'كل مادة تم اختيارها ليس فقط لجمالها، بل لقدرتها على تحمل اختبار الزمن.'
              : 'Every material is chosen not just for its beauty, but for its ability to withstand the test of time.'}
          </p>
        </div>
      </section>

      <section className="bg-fg py-20 md:py-32">
        <div className="container">
          <div ref={closingRef} className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-bg mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'كل تفصيل مهم' : 'Every Detail Matters'}
            </h2>
            <p className="text-bg/60 text-lg leading-relaxed">
              {locale === 'ar'
                ? 'من الأساس إلى اللمسات الأخيرة، تم بناء مساكن تيلال بالتزام لا يتزعزع بالجودة. موادنا مستخرجة من أفضل المحاجر والورش، مما يضمن أن كل منزل يتحفة من الحرفية.'
                : 'From the foundation to the finishing touches, Tilal residences are built with an unwavering commitment to quality. Our materials are sourced from the finest quarries and workshops, ensuring each home is a masterpiece of craftsmanship.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
