'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
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

interface CommunityProps {
  locale: string;
  dunesPages: string[];
  oasisPages: string[];
  masterPlanPages: string[];
}

export function CommunityClient({ locale, dunesPages, oasisPages, masterPlanPages }: CommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBrochure, setActiveBrochure] = useState<'dunes' | 'oasis'>('dunes');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.reveal-up', start: 'top 85%' }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeBrochure]);

  const activePages = activeBrochure === 'dunes' ? dunesPages : oasisPages;
  const activePdfUrl = activeBrochure === 'dunes' 
    ? '/Tilal Binghatti/Tilal Community General/Tilal Binghatti - Dunes.pdf'
    : '/Tilal Binghatti/Tilal Community General/Tilal Binghatti - Oasis.pdf';

  return (
    <main className="bg-bg" ref={containerRef}>
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <Image 
          src={getImg("/Tilal Binghatti/Tilal Community General/Tilal Community Render.webp")} 
          alt="Tilal Community Render" 
          fill 
          priority
          sizes="100vw"
          className="object-cover" 
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="container relative z-10 pb-16 md:pb-24 reveal-up">
          <span className="label text-gold mb-4 block">{locale === 'ar' ? 'مجتمع متكامل' : 'Master Community'}</span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6">
            {locale === 'ar' ? 'الحياة في تيلال' : 'Life at Tilal'}
          </h1>
          <p className="text-fg-muted max-w-2xl text-lg md:text-xl leading-relaxed">
            {locale === 'ar' 
              ? 'مجتمع مسور حصري يمزج بين الفخامة المعمارية والطبيعة الهادئة، صمم لمن يقدرون أرقى أساليب الحياة.'
              : 'An exclusive gated community blending architectural grandeur with serene nature, designed for those who appreciate the finest lifestyles.'}
          </p>
        </div>
      </section>

      <section className="container py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={getImg("/Tilal Binghatti/Tilal Community General/4 & 5 Bed - Cluster.webp")} alt="4 & 5 Bed Cluster" fill className="object-cover" decoding="async" />
            </div>
            <h3 className="font-display text-2xl">4 & 5 Bedroom Clusters</h3>
          </div>
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={getImg("/Tilal Binghatti/Tilal Community General/5 BR TWIN CLUSTER.webp")} alt="5 Bed Twin Cluster" fill className="object-cover" decoding="async" />
            </div>
            <h3 className="font-display text-2xl">5 Bedroom Twin Clusters</h3>
          </div>
        </div>
      </section>

      {/* Master Plan */}
      {masterPlanPages.length > 0 && (
        <section className="py-24 bg-fg/5 reveal-up">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <span className="label text-gold mb-4 block">{locale === 'ar' ? 'المخطط الرئيسي' : 'Master Plan'}</span>
                <h2 className="font-display text-4xl md:text-5xl">{locale === 'ar' ? 'خريطة المجتمع' : 'Community Map'}</h2>
              </div>
              <a 
                href={getImg("/Tilal Binghatti/Tilal Master Plan.pdf")} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 px-8 py-4 bg-fg text-bg text-sm font-medium tracking-wide hover:bg-gold transition-colors"
              >
                {locale === 'ar' ? 'تحميل المخطط' : 'Download Master Plan'}
              </a>
            </div>
            <div className="space-y-8">
              {masterPlanPages.map((page, idx) => (
                <div key={idx} className="relative w-full aspect-[1.4/1] rounded-2xl shadow-xl overflow-hidden">
                  <Image src={getImg(page)} alt={`Master Plan Page ${idx + 1}`} fill className="object-cover" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Brochures Section */}
      <section className="py-24 md:py-32 container">
        <div className="text-center mb-16 reveal-up">
          <span className="label text-gold mb-4 block">{locale === 'ar' ? 'الكتيبات التفاعلية' : 'Interactive Brochures'}</span>
          <h2 className="font-display text-4xl md:text-6xl mb-12">
            {locale === 'ar' ? 'مجموعات تيلال' : 'The Collections'}
          </h2>

          <div className="inline-flex bg-fg/5 p-1 rounded-full mb-12">
            <button
              onClick={() => setActiveBrochure('dunes')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${activeBrochure === 'dunes' ? 'bg-fg text-bg shadow-md' : 'text-fg-muted hover:text-fg'}`}
            >
              The Dunes Collection
            </button>
            <button
              onClick={() => setActiveBrochure('oasis')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${activeBrochure === 'oasis' ? 'bg-fg text-bg shadow-md' : 'text-fg-muted hover:text-fg'}`}
            >
              The Oasis Collection
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto reveal-up">
          <div className="flex justify-end mb-8">
            <a 
              href={getImg(activePdfUrl)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg text-sm font-medium transition-colors hover:bg-gold-dark"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              {locale === 'ar' ? 'تحميل الكتيب كاملًا (PDF)' : 'Download Full Brochure (PDF)'}
            </a>
          </div>
          
          <div className="space-y-4">
            {activePages.map((page, idx) => (
              <div key={`${activeBrochure}-${idx}`} className="relative w-full aspect-[1.414/1] bg-white rounded-xl shadow-lg overflow-hidden border border-fg/5">
                <Image 
                  src={getImg(page)} 
                  alt={`${activeBrochure} collection page ${idx + 1}`} 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain" 
                  loading={idx < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
