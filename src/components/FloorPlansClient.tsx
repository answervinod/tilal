'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import assetsMap from '@/assets_map.json';

const getImg = (path: string) => {
  const url = (assetsMap as any)[path];
  if (!url) return encodeURI(path);
  if (path.toLowerCase().endsWith('.pdf')) {
    const filename = path.split('/').pop() || 'download.pdf';
    return `${url}?dl=${encodeURIComponent(filename)}`;
  }
  return `${url}?w=1600&fm=webp&q=80`;
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Plan {
  id: string;
  name: string;
  pages: string[];
  pdfUrl: string;
}

export function FloorPlansClient({ locale, plans }: { locale: string, plans: Plan[] }) {
  const [activePlan, setActivePlan] = useState<Plan | null>(plans[0] || null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-bg" ref={containerRef}>
      <div className="container mb-12 reveal-up">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">
          {locale === 'ar' ? 'المخططات الطابقية' : 'Floor Plans'}
        </h1>
        <p className="text-fg-muted max-w-2xl text-lg">
          {locale === 'ar' 
            ? 'اكتشف تفاصيل المساحات الداخلية الاستثنائية التي تلبي أعلى معايير الفخامة.'
            : 'Explore the meticulously designed interior layouts that define the pinnacle of luxury living.'}
        </p>
      </div>

      <div className="container">
        {plans.length === 0 ? (
          <div className="hidden lg:block relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl reveal-up">
            <Image src={getImg("/Tilal Binghatti/Payment Plan & Pricing/Tilal Unit Sizes.webp")} alt="Unit Sizes Overview" fill className="object-cover" decoding="async" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-32 space-y-2 reveal-up">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-6 ml-4">Select Unit Type</h3>
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(plan)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                    activePlan?.id === plan.id 
                      ? 'bg-fg text-bg shadow-xl' 
                      : 'hover:bg-fg/5 text-fg'
                  }`}
                >
                  <span className="font-medium text-sm">{plan.name}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${activePlan?.id === plan.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Plan Display Area */}
            {activePlan && (
              <div className="flex-1 w-full reveal-up" key={activePlan.id}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-fg/10">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl">{activePlan.name}</h2>
                    <p className="text-fg-muted mt-2 text-sm">{activePlan.pages.length} Pages Available</p>
                  </div>
                  <a 
                    href={getImg(activePlan.pdfUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {locale === 'ar' ? 'تحميل كملف PDF' : 'Download PDF'}
                  </a>
                </div>

                <div className="space-y-12">
                  {activePlan.pages.map((page, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-fg/5 overflow-hidden animate-in fade-in duration-700 delay-100">
                      <div className="bg-fg/5 px-6 py-3 border-b border-fg/5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">Page {idx + 1}</span>
                      </div>
                      <div className="relative w-full aspect-[1/1.4] md:aspect-[1.4/1]">
                        <Image 
                          src={getImg(page)} 
                          alt={`${activePlan.name} - Page ${idx + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 75vw"
                          quality={90}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
