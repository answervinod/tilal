'use client';

import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stats = [
  { value: 'AED 4.2M+', label: 'Starting Price', labelAr: 'السعر الابتدائي' },
  { value: '25%', label: 'Projected Annual ROI', labelAr: 'عائد استثمار سنوي متوقع' },
  { value: '18%', label: 'Capital Appreciation', labelAr: 'تقدير رأس المال' },
  { value: '5', label: 'Signature Developments', labelAr: 'تطويرات مميزة' },
];

const points = [
  { en: 'High-demand location with limited luxury inventory', ar: 'موقع عالي الطلب بمخزون محدود من الفخامة' },
  { en: 'Strong resale value potential backed by infrastructure', ar: 'إمكانية قوية لإعادة البيع مدعومة بالبنية التحتية' },
  { en: 'Strategic urban expansion driving growth', ar: 'توسع حضري استراتيجي يدفع النمو' },
  { en: 'Premium rental yields in Academic City corridor', ar: 'عوائد إيجارية متميزة في ممر مدينة دبي الأكاديمية' },
  { en: 'Tax-free property investment environment', ar: 'بيئة استثمار عقاري خالية من الضرائب' },
  { en: 'Golden visa eligibility for investors', ar: 'أهلية تأشيرة الذهبية للمستثمرين' },
];

export function InvestmentPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
        });
      }
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
          y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
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
      <section ref={heroRef} className="relative h-[55vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/page29_img1.jpeg" alt="Investment" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'استثمار ذكي' : 'Smart Investment'}</span>
            <h1 className="font-display text-bg" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'فرص استثمارية ذكية' : 'Smart Investment Opportunities'}
            </h1>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 md:mb-32">
          <div ref={contentRef}>
            <p className="text-fg-muted text-lg md:text-xl leading-relaxed mb-8">
              {locale === 'ar'
                ? 'تم تصميم تطويرات تيلال ليس فقط للمعيشة — بل لخلق الثروة. مع التوسع المتزايد في البنية التحتية في دبي والطلب المتزايد على المساكن الفاخرة، تقدم تيلال إمكانيات قوية لتقدير رأس المال وعوائد الإيجار.'
                : "Tilal developments are designed not just for living — but for wealth creation. With Dubai's expanding infrastructure and increasing demand for premium housing, Tilal offers strong capital appreciation and rental yield potential."}
            </p>
            <ul className="space-y-3 mb-10">
              {points.map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-fg/80">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  {locale === 'ar' ? point.ar : point.en}
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/contact`} className="inline-flex text-sm font-medium tracking-wide uppercase px-8 py-4 bg-fg text-bg hover:bg-gold hover:text-fg transition-all duration-300">
              {locale === 'ar' ? 'تحدث إلى مستشار استثماري' : 'Speak to an Investment Advisor'}
            </Link>
          </div>
          <div ref={imageRef} className="relative aspect-[4/3]">
            <Image src="/images/page29_img2.jpeg" alt="Investment growth" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>

        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item border-t border-fg/10 pt-6">
              <p className="font-display text-gold mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {stat.value}
              </p>
              <p className="text-label text-fg-muted">{locale === 'ar' ? stat.labelAr : stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
