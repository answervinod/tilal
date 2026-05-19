'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { imageUrl } from '../../sanity/lib/image';
import { formatPrice, statusLabel } from '@/lib/format';
import type { Locale } from '@/i18n/config';
import type { ProjectListItem } from '../../sanity/lib/types';

export function ProjectCard({
  project,
  locale,
  priority = false,
  index,
}: {
  project: ProjectListItem;
  locale: Locale;
  priority?: boolean;
  index?: number;
}) {
  const cover = imageUrl(project.cover, 1400);
  const href = `/${locale}/projects/${project.slug}`;
  const price = formatPrice(project.price, locale);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const imageWrap = imageRef.current;
    if (!card || !imageWrap) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imageWrap, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const imageWrap = imageRef.current;
    if (!imageWrap) return;
    gsap.to(imageWrap, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      className="group block relative"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageRef}
        className="relative aspect-[4/5] overflow-hidden bg-fg/5"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] cinematic"
            priority={priority}
            placeholder={project.cover?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={project.cover?.asset?.metadata?.lqip}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-fg/25 text-xs">
            No image
          </div>
        )}

        <div className="grain" aria-hidden />

        {typeof index === 'number' && (
          <span className="absolute top-4 start-4 text-label text-bg/90">
            {String(index + 1).padStart(2, '0')} / Project
          </span>
        )}

        {project.status && project.status !== 'available' && (
          <span className="absolute top-4 end-4 text-label text-bg/90">
            {statusLabel(project.status, locale)}
          </span>
        )}
      </div>

      <div className="pt-5 flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h3
            className="font-display text-fg leading-[1.05] group-hover:text-gold transition-colors duration-500"
            style={{
              fontSize: 'clamp(1.5rem, 2vw, 1.875rem)',
              letterSpacing: '-0.015em',
            }}
          >
            {project.title}
          </h3>
          {project.location && (
            <p className="mt-1.5 text-[13px] text-fg-muted">
              <span className="italic">{project.location}</span>
            </p>
          )}
        </div>
        <div className="shrink-0 text-end">
          {project.category?.title && (
            <p className="text-label text-fg-subtle">{project.category.title}</p>
          )}
          {price && (
            <p className="mt-1.5 text-[11px] text-gold">{price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
