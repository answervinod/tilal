'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface StatsData {
  _type: 'statsBlock';
  _key: string;
  heading?: string;
  items?: Array<{ value: string; label: string }>;
}

export function Stats({ data }: { data: StatsData }) {
  const items = data.items || [];
  if (!items.length) return null;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDListElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Stat items stagger with counter animation
      if (itemsRef.current) {
        const statItems = itemsRef.current.querySelectorAll('.stat-item');
        gsap.from(statItems, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: itemsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Counter animation for numeric values
        statItems.forEach((item) => {
          const valueEl = item.querySelector('.counter-value');
          if (!valueEl) return;
          const text = valueEl.textContent || '';
          const hasPlus = text.includes('+');
          const hasPercent = text.includes('%');
          const hasCurrency = text.includes('$') || text.includes('€') || text.includes('£');
          const numericMatch = text.match(/[\d,.]+/);
          if (!numericMatch) return;

          const numericStr = numericMatch[0].replace(/,/g, '');
          const targetValue = parseFloat(numericStr);
          if (isNaN(targetValue)) return;

          const isDecimal = numericStr.includes('.');
          const prefix = hasCurrency ? text.charAt(0) : '';
          const suffix = hasPlus ? '+' : hasPercent ? '%' : '';

          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              let formatted: string;
              if (isDecimal) {
                formatted = obj.val.toFixed(1);
              } else {
                formatted = Math.round(obj.val).toLocaleString();
              }
              valueEl.textContent = `${prefix}${formatted}${suffix}`;
            },
          });
        });
      }

      // Hairline expands
      if (ruleRef.current) {
        gsap.from(ruleRef.current, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: ruleRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg">
      <div className="container py-24 md:py-36">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 flex items-baseline justify-between">
            <span className="index-mark">02 — In Numbers</span>
            <span className="hidden md:inline index-mark">An Index</span>
          </div>

          {data.heading && (
            <h2
              ref={headingRef}
              className="col-span-12 md:col-span-7 font-display text-fg"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.02em',
              }}
            >
              {data.heading}
            </h2>
          )}

          <dl ref={itemsRef} className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {items.map((it, i) => (
              <div
                key={i}
                className={`stat-item relative pe-6 py-6 ${
                  i > 0 ? 'lg:border-s border-fg/8 lg:ps-10' : ''
                } ${i % 2 === 1 ? 'sm:border-s sm:ps-10 lg:border-s' : ''}`}
              >
                <span className="text-label text-fg-subtle block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt
                  className="counter-value numeral text-fg leading-none"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
                >
                  {it.value}
                </dt>
                <dd className="mt-4 text-[13px] text-fg-muted max-w-[20ch] leading-snug">
                  <span className="italic text-fg/80">{it.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="container">
        <div ref={ruleRef} className="rule origin-left" />
      </div>
    </section>
  );
}
