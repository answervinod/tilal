'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const residences = [
  {
    id: '4-5-villa',
    title: '4 BR & 5 BR Villas',
    subtitle: 'Dunes and Oasis Collection',
    front: '/Tilal Binghatti/Images/Tilal Binghatti_Dunes and Oasis_4 BR Villa and 5 BR Premium and Grand Villa_Front.webp',
    back: '/Tilal Binghatti/Images/Tilal Binghatti_Dunes and Oasis__4 BR Villa and 5 BR Premium and Grand Villa_Back.webp'
  },
  {
    id: '6-mansion',
    title: '6 BR Mansion',
    subtitle: 'Exclusive Residence',
    front: '/Tilal Binghatti/Images/Tilal Binghatti_6BR Mansion_Front.webp',
    back: '/Tilal Binghatti/Images/Tilal Binghatti_6BR Mansion_Back.webp'
  },
  {
    id: '6-grand-mansion',
    title: '6 BR Grand Mansion',
    subtitle: 'Signature Series',
    front: '/Tilal Binghatti/Images/Tilal Binghatti_6BR Grand Mansion_Front.webp',
    back: '/Tilal Binghatti/Images/Tilal Binghatti_6BR Grand Mansion_Back.webp'
  },
  {
    id: '7-sea-palace',
    title: '7 BR Sea Palace',
    subtitle: 'Waterfront Luxury',
    front: '/Tilal Binghatti/Images/Tilal Binghatti_7BR Sea Palace_Front.webp',
    back: '/Tilal Binghatti/Images/Tilal Binghatti_7BR Sea Palace_Back.webp'
  },
  {
    id: '8-royal-sea-palace',
    title: '8 BR Royal Sea Palace',
    subtitle: 'The Pinnacle of Tilal',
    front: '/Tilal Binghatti/Images/Tilal Binghatti_8BR The Royal Sea Palace_Front.webp',
    back: '/Tilal Binghatti/Images/Tilal Binghatti_8BR The Royal Sea Palace_Back.webp'
  }
];

export function ResidencesClient({ locale }: { locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(residences[0].id);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-up').forEach((elem: any) => {
        gsap.fromTo(elem, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const activeResidence = residences.find(r => r.id === activeTab) || residences[0];

  return (
    <main className="pt-32 pb-24 min-h-screen bg-bg" ref={containerRef}>
      <div className="container mb-16 reveal-up">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
          {locale === 'ar' ? 'الوحدات السكنية' : 'The Residences'}
        </h1>
        <p className="text-fg-muted max-w-2xl text-lg md:text-xl leading-relaxed">
          {locale === 'ar' 
            ? 'اكتشف مجموعة من التحف المعمارية، من الفيلات الأنيقة المكونة من 4 غرف نوم إلى قصر البحر الملكي الخلاب المكون من 8 غرف نوم.'
            : 'Discover a curated collection of architectural masterpieces, ranging from elegant 4-bedroom villas to the breathtaking 8-bedroom Royal Sea Palace.'}
        </p>
      </div>

      <div className="container">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-4 mb-12 pb-4 border-b border-fg/10 reveal-up">
          {residences.map((res) => (
            <button
              key={res.id}
              onClick={() => setActiveTab(res.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === res.id 
                  ? 'bg-gold text-bg shadow-lg shadow-gold/20' 
                  : 'bg-white/50 text-fg hover:bg-white border border-fg/5'
              }`}
            >
              {res.title}
            </button>
          ))}
        </div>

        {/* Active Residence Display */}
        <div className="space-y-12 animate-in fade-in duration-700" key={activeResidence.id}>
          <div className="text-center mb-12">
            <span className="label text-gold block mb-2">{activeResidence.subtitle}</span>
            <h2 className="font-display text-3xl md:text-5xl">{activeResidence.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Front View */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-fg/5 shadow-2xl shadow-fg/5">
              <Image 
                src={encodeURI(activeResidence.front)}
                alt={`${activeResidence.title} Front View`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-white font-medium tracking-wide uppercase text-sm">
                  {locale === 'ar' ? 'الواجهة الأمامية' : 'Front Elevation'}
                </span>
              </div>
            </div>

            {/* Back View */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-fg/5 shadow-2xl shadow-fg/5">
              <Image 
                src={encodeURI(activeResidence.back)}
                alt={`${activeResidence.title} Back View`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                decoding="async"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-white font-medium tracking-wide uppercase text-sm">
                  {locale === 'ar' ? 'الواجهة الخلفية' : 'Rear Elevation'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
