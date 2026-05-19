'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface FAQData {
  _type: 'faqBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  items?: Array<{ question: string; answer: string }>;
}

export function FAQ({ data }: { data: FAQData }) {
  const items = data.items || [];
  if (!items.length) return null;

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 25, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
      if (listRef.current) {
        gsap.from(listRef.current.children, {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container py-20 md:py-32">
      <div className="grid gap-10 md:grid-cols-12">
        <header ref={headerRef} className="md:col-span-4">
          {data.heading && (
            <h2 className="font-display text-d-4 text-fg">{data.heading}</h2>
          )}
          {data.subheading && (
            <p className="mt-3 text-fg-muted leading-relaxed">{data.subheading}</p>
          )}
        </header>

        <div ref={listRef} className="md:col-span-8 divide-y divide-fg/8 border-y border-fg/8">
          {items.map((q, i) => (
            <details key={i} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <span className="font-display text-lg md:text-xl text-fg">
                  {q.question}
                </span>
                <span
                  className="shrink-0 text-gold text-2xl transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-fg-muted leading-relaxed">{q.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
