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

export function InvestmentPageClient({ locale, standardPpPages = [] }: { locale: Locale, standardPpPages?: string[] }) {
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

        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-32">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item border-t border-fg/10 pt-6">
              <p className="font-display text-gold mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {stat.value}
              </p>
              <p className="text-label text-fg-muted">{locale === 'ar' ? stat.labelAr : stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pricing & Payment Plans Section */}
        <div className="border-t border-fg/10 pt-20">
          <div className="text-center mb-16">
            <span className="label text-gold block mb-4">{locale === 'ar' ? 'الأسعار وخطط الدفع' : 'Pricing & Payment Plans'}</span>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              {locale === 'ar' ? 'خيارات استثمارية مرنة' : 'Flexible Investment Options'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Pricing Overview */}
            <div className="space-y-8">
              <h3 className="font-display text-2xl md:text-3xl text-gold border-b border-fg/10 pb-4">
                {locale === 'ar' ? 'نظرة عامة على الأسعار' : 'Pricing Overview'}
              </h3>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image src={encodeURI("/Tilal Binghatti/Payment Plan & Pricing/Tilal Pricing Details.webp")} alt="Pricing Details" fill className="object-cover" decoding="async" />
              </div>
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image src={encodeURI("/Tilal Binghatti/Payment Plan & Pricing/Tilal Pricing Range.webp")} alt="Pricing Range" fill className="object-cover" decoding="async" />
              </div>
            </div>

            {/* Emirati Payment Plan */}
            <div className="space-y-8">
              <h3 className="font-display text-2xl md:text-3xl text-gold border-b border-fg/10 pb-4 flex justify-between items-center">
                <span>{locale === 'ar' ? 'خطة دفع للمواطنين' : 'Emirati Payment Plan'}</span>
              </h3>
              <div className="relative aspect-[1/1.4] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image src={encodeURI("/Tilal Binghatti/Payment Plan & Pricing/Emirati PP.webp")} alt="Emirati Payment Plan" fill className="object-cover" decoding="async" />
              </div>
            </div>
          </div>

          {/* Standard Payment Plan Brochure */}
          {standardPpPages.length > 0 && (
            <div className="mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="label text-gold block mb-4">{locale === 'ar' ? 'الكتيب الرسمي' : 'Official Brochure'}</span>
                  <h3 className="font-display text-3xl md:text-4xl">
                    {locale === 'ar' ? 'خطة الدفع القياسية' : 'Standard Payment Plan'}
                  </h3>
                </div>
                <a 
                  href="/Tilal Binghatti/Payment Plan & Pricing/Tilal Binghatti - PP.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 md:mt-0 inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {locale === 'ar' ? 'تحميل الكتيب (PDF)' : 'Download Brochure (PDF)'}
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {standardPpPages.map((page, idx) => (
                <div key={idx} className="relative aspect-[1/1.414] rounded-2xl overflow-hidden shadow-2xl bg-white border border-fg/5 group hover:shadow-gold/20 transition-shadow duration-500">
                  <Image 
                    src={encodeURI(page)} 
                    alt={`Payment Plan Page ${idx + 1}`} 
                    fill 
                    className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500" 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={idx < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
