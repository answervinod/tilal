'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { imageUrl } from '../../sanity/lib/image';
import { formatPrice } from '@/lib/format';
import type { Locale } from '@/i18n/config';
import type { ProjectListItem } from '../../sanity/lib/types';

interface HorizontalGalleryProps {
  projects: ProjectListItem[];
  locale: Locale;
  title?: string;
}

export function HorizontalGallery({ projects, locale, title }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Horizontal scroll
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card entrance animation
      const cards = track.querySelectorAll('.gallery-card');
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: track,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, section);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} className="relative bg-bg overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="container pt-24 md:pt-32 pb-12">
        <div className="flex items-baseline justify-between">
          <span className="index-mark">Portfolio</span>
          {title && (
            <h2
              className="font-display text-fg"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h2>
          )}
          <span className="index-mark hidden md:inline">{String(projects.length).padStart(2, '0')} properties</span>
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex items-center gap-6 md:gap-10 px-6 md:px-12 pb-24"
        style={{ perspective: '1000px' }}
      >
        {projects.map((project, i) => {
          const cover = imageUrl(project.cover, 1400);
          const price = formatPrice(project.price, locale);
          const href = `/${locale}/projects/${project.slug}`;

          return (
            <Link
              key={project._id}
              href={href}
              className="gallery-card group relative flex-shrink-0"
              style={{
                width: 'clamp(320px, 40vw, 520px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-fg/5">
                {cover ? (
                  <Image
                    src={cover}
                    alt={project.title}
                    fill
                    sizes="520px"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-fg/20 text-xs">
                    No image
                  </div>
                )}
                <div className="grain" aria-hidden />

                {/* Index number */}
                <span className="absolute top-5 left-5 text-label text-bg/90">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-fg/0 group-hover:bg-fg/20 transition-colors duration-700" />
              </div>

              <div className="pt-5 flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="font-display text-fg group-hover:text-gold transition-colors duration-500"
                    style={{
                      fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="mt-1 text-[13px] text-fg-muted">
                      <span className="italic">{project.location}</span>
                    </p>
                  )}
                </div>
                <div className="text-end shrink-0">
                  {project.category?.title && (
                    <p className="text-label text-fg-subtle">{project.category.title}</p>
                  )}
                  {price && (
                    <p className="mt-1 text-[11px] text-gold">{price}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* End card with CTA */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center gap-6"
          style={{ width: 'clamp(280px, 30vw, 400px)' }}
        >
          <p className="font-display text-fg text-center" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            View all<br />properties
          </p>
          <Link href={`/${locale}/projects`} className="magnetic-btn">
            <span>Explore</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
