'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface TeamData {
  _type: 'teamBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  members?: Array<{
    name: string;
    role?: string;
    bio?: string;
    photo?: SanityImage;
    social?: { linkedin?: string; email?: string };
  }>;
}

export function Team({ data }: { data: TeamData }) {
  const members = data.members || [];
  if (!members.length) return null;

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container py-20 md:py-32">
      {(data.heading || data.subheading) && (
        <div ref={headerRef} className="max-w-2xl mb-14">
          {data.heading && (
            <h2 className="font-display text-d-4 text-fg">{data.heading}</h2>
          )}
          {data.subheading && (
            <p className="mt-3 text-fg-muted leading-relaxed">{data.subheading}</p>
          )}
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
        {members.map((m, i) => {
          const photo = imageUrl(m.photo, 600);
          return (
            <div key={i}>
              <div className="relative aspect-[3/4] bg-bg-soft overflow-hidden">
                {photo ? (
                  <Image
                    src={photo}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.04] cinematic"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-fg/15 font-display text-4xl">
                    {m.name?.[0]}
                  </div>
                )}
              </div>
              <h3 className="font-display text-xl text-fg mt-4">{m.name}</h3>
              {m.role && (
                <p className="text-label text-fg-subtle mt-1">{m.role}</p>
              )}
              {m.bio && (
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">{m.bio}</p>
              )}
              {(m.social?.linkedin || m.social?.email) && (
                <div className="mt-3 flex items-center gap-4 text-xs">
                  {m.social.linkedin && (
                    <a href={m.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-fg-subtle hover:text-fg transition-colors">
                      LinkedIn
                    </a>
                  )}
                  {m.social.email && (
                    <a href={`mailto:${m.social.email}`}
                      className="text-fg-subtle hover:text-fg transition-colors">
                      Email
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
