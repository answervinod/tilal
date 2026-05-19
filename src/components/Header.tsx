'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LocaleSwitcher } from './LocaleSwitcher';
import { resolveLink } from '@/lib/resolveLink';
import { imageUrl } from '../../sanity/lib/image';
import type { Locale } from '@/i18n/config';
import type { Navigation, SiteSettings } from '../../sanity/lib/types';

interface HeaderProps {
  locale: Locale;
  settings: SiteSettings | null;
  nav: Navigation | null;
}

export function Header({ locale, settings, nav }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoSrc = imageUrl(settings?.logo, 240);
  const siteTitle = settings?.title || 'Tilal';
  const links = nav?.header || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-fg/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-fg/40 backdrop-blur-md'
      }`}
    >
      <div className="container flex items-center justify-between h-24">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={siteTitle}
              width={40}
              height={40}
              className="object-contain brightness-0 invert"
            />
          ) : (
            <span className="font-display text-2xl tracking-tight text-bg">
              {siteTitle}
            </span>
          )}
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link, i) => (
            <Link
              key={`nav-${link.label}-${i}`}
              href={resolveLink(link, locale)}
              className="relative text-sm font-medium tracking-wide text-bg/80 hover:text-bg transition-colors duration-300 group uppercase"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-6">
          <LocaleSwitcher current={locale} light={true} />
          <Link
            href={`/${locale}/contact`}
            className="hidden md:inline-flex text-sm font-medium tracking-wide uppercase px-6 py-3 bg-gold text-fg hover:bg-white transition-all duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
