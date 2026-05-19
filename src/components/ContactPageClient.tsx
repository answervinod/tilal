'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';

export function ContactPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
        });
      }
      if (formRef.current) {
        gsap.from(formRef.current, {
          y: 40, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
      if (infoRef.current) {
        gsap.from(infoRef.current.children, {
          y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="bg-bg">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/page27_img1.jpeg" alt="Contact Tilal" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-fg/60" />
        </div>
        <div className="container relative z-10 pb-16 md:pb-24">
          <div ref={headerRef}>
            <span className="label text-gold mb-4 block">{locale === 'ar' ? 'تواصل معنا' : 'Connect With Us'}</span>
            <h1 className="font-display text-bg" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'تواصل معنا' : 'Connect With Us'}
            </h1>
            <p className="text-bg/60 text-lg md:text-xl max-w-xl mt-6 leading-relaxed">
              {locale === 'ar' ? 'سواء كنت تبحث عن الاستثمار أو العثور على منزل أحلامك، فريقنا مستعد لمساعدتك.' : 'Whether you are looking to invest or find your dream home, our team is ready to assist.'}
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                placeholder={locale === 'ar' ? 'اسمك' : 'Your name'}
              />
            </div>
            <div>
              <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                placeholder="+971 ..."
              />
            </div>
            <div>
              <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الرسالة' : 'Message'}</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder={locale === 'ar' ? 'أخبرنا ما الذي تبحث عنه...' : 'Tell us what you are looking for...'}
              />
            </div>
            <button
              type="submit"
              className="text-sm font-medium tracking-wide uppercase px-8 py-4 bg-fg text-bg hover:bg-gold hover:text-fg transition-all duration-300"
            >
              {submitted ? (locale === 'ar' ? 'تم الإرسال!' : 'Message Sent!') : (locale === 'ar' ? 'احجز جولة خاصة' : 'Book a Private Viewing')}
            </button>
          </form>

          <div ref={infoRef} className="space-y-10">
            <div>
              <span className="label text-gold mb-4 block">{locale === 'ar' ? 'اتصل بنا' : 'Call Us'}</span>
              <p className="font-display text-3xl md:text-4xl text-fg tracking-tight">800 15</p>
              <p className="text-fg-muted mt-2">{locale === 'ar' ? 'مجاني داخل الإمارات' : 'Toll-free within UAE'}</p>
            </div>
            <div>
              <span className="label text-gold mb-4 block">{locale === 'ar' ? 'الموقع' : 'Location'}</span>
              <p className="text-fg text-lg">{locale === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates'}</p>
              <p className="text-fg-muted mt-2">{locale === 'ar' ? 'ممر مدينة دبي الأكاديمية' : 'Dubai Academic City corridor'}</p>
            </div>
            <div>
              <span className="label text-gold mb-4 block">{locale === 'ar' ? 'استشارات خاصة' : 'Private Consultations'}</span>
              <p className="text-fg-muted leading-relaxed">
                {locale === 'ar'
                  ? 'احجز جلسة فردية مع مستشاري الاستثمار والمتخصصين العقاريين لدينا. متاح للاجتمعات الشخصية والافتراضية.'
                  : 'Book a one-on-one session with our investment advisors and property specialists. Available for both in-person and virtual meetings.'}
              </p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src="/images/page27_img2.jpeg" alt="Tilal location" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
