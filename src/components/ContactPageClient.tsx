'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { gsap } from 'gsap';
import { CountrySelect } from '@/components/CountrySelect';
import { PhoneInput } from '@/components/PhoneInput';

export function ContactPageClient({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    phone: '',
    nationality: '',
    occupation: '',
    unitType: '4BR TH (mid): from 4,200,000 AED',
    purpose: 'Self use',
    timeline: 'Immediately',
    buyerType: 'Cash buyer',
    message: ''
  });
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

  // Calendly Widget Initialization
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.initBadgeWidget({
          url: 'https://calendly.com/maitysabuj939/30min',
          text: locale === 'ar' ? 'احجز اجتماعاً' : 'Book A Meeting',
          color: '#c9a96e', // Tilal Gold
          textColor: '#ffffff',
          branding: false,
        });

        // Force font family via CSS since Calendly injects its own styles
        const style = document.createElement('style');
        style.innerHTML = `
          .calendly-badge-widget, 
          .calendly-badge-widget * {
            font-family: 'aktivGrotesk', 'Aktiv Grotesk', sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
    };
    document.body.appendChild(script);

    return () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.destroyBadgeWidget();
      }
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.nationality) {
        alert(locale === 'ar' ? 'يرجى اختيار الجنسية' : 'Please select your nationality');
        return;
      }
      if (!form.phone || form.phone.trim().length < 5) {
        alert(locale === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number');
        return;
      }

      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('API Error:', data);
        alert(locale === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setForm({
        firstName: '',
        lastName: '',
        workEmail: '',
        phone: '',
        nationality: '',
        occupation: '',
        unitType: '4BR TH (mid): from 4,200,000 AED',
        purpose: 'Self use',
        timeline: 'Immediately',
        buyerType: 'Cash buyer',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Submission failed', err);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'اسم العائلة' : 'Last Name'}</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'البريد الإلكتروني للعمل' : 'Work Email'}</label>
                <input
                  type="email"
                  required
                  value={form.workEmail}
                  onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الهاتف' : 'Phone'}</label>
                <PhoneInput
                  value={form.phone}
                  onChange={(val) => setForm({ ...form, phone: val })}
                  variant="transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الجنسية' : 'Nationality'}</label>
                <CountrySelect
                  value={form.nationality}
                  onChange={(val) => setForm({ ...form, nationality: val })}
                  variant="transparent"
                />
              </div>
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'المهنة' : 'Occupation'}</label>
                <input
                  type="text"
                  required
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'نوع الوحدة' : 'Unit Type'}</label>
                <select
                  value={form.unitType}
                  onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="4BR TH (mid): from 4,200,000 AED">4BR TH (mid): from 4,200,000 AED</option>
                  <option value="5BR TH (end/corn): from 5,100,000 AED">5BR TH (end/corn): from 5,100,000 AED</option>
                  <option value="5BR TH (grand): from 6,250,000 AED">5BR TH (grand): from 6,250,000 AED</option>
                  <option value="6BR Villa (twin): from 6,900,000 AED">6BR Villa (twin): from 6,900,000 AED</option>
                  <option value="6BR Villa: from 16,000,000 AED">6BR Villa: from 16,000,000 AED</option>
                  <option value="7BR Villa: from 49,000,000 AED">7BR Villa: from 49,000,000 AED</option>
                  <option value="Mansion: for 150,000,000 AED">Mansion: for 150,000,000 AED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'الغرض' : 'Purpose'}</label>
                <select
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="Self use">Self use</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'متى ترغب في الشراء' : 'When wants to buy'}</label>
                <select
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="Immediately">Immediately</option>
                  <option value="Less than 6 months">Less than 6 months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-fg-subtle mb-2 block">{locale === 'ar' ? 'نوع المشتري' : 'Buyer Type'}</label>
                <select
                  value={form.buyerType}
                  onChange={(e) => setForm({ ...form, buyerType: e.target.value })}
                  className="w-full bg-transparent border-b border-fg/15 py-3 text-fg focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="Cash buyer">Cash buyer</option>
                  <option value="Mortgage buyer">Mortgage buyer</option>
                </select>
              </div>
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
              {submitted ? (locale === 'ar' ? 'شكراً لاتصالك بتلال بن غاطي ريزيدنسز.' : 'Thank you for contacting Tilal Binghatti Residences.') : (locale === 'ar' ? 'إرسال' : 'Submit')}
            </button>
          </form>

          <div ref={infoRef} className="space-y-10">
            <div>
              <span className="label text-gold mb-4 block">{locale === 'ar' ? 'اتصل بنا' : 'Call Us'}</span>
              <p className="font-display text-3xl md:text-4xl text-fg tracking-tight">+971 52 675 9498</p>
              <p className="text-fg-muted mt-2">{locale === 'ar' ? 'متاحين لمساعدتك' : 'Available to assist you'}</p>
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
