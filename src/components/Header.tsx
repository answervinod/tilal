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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoSrc = imageUrl(settings?.logo, 240);
  const siteTitle = settings?.title || 'Tilal';
  const links = nav?.header || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? 'bg-bg/90 backdrop-blur-xl border-b border-fg/5'
            : 'bg-bg/60 backdrop-blur-md'
        }`}
      >
        <div className="container flex items-center justify-between h-24">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={siteTitle}
                width={40}
                height={40}
                className="object-contain brightness-0"
              />
            ) : (
              <span className="font-display text-2xl tracking-tight text-fg">
                {siteTitle}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}/about`} className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase">
              {locale === 'ar' ? 'معلومات عنا' : 'About'}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
            <Link href={`/${locale}/residences`} className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase">
              {locale === 'ar' ? 'الوحدات السكنية' : 'Residences'}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
            <Link href={`/${locale}/community`} className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase">
              {locale === 'ar' ? 'المجتمع' : 'Community'}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
            <Link href={`/${locale}/investment`} className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase">
              {locale === 'ar' ? 'الاستثمار' : 'Investment'}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
            <Link href={`/${locale}/projects`} className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase">
              {locale === 'ar' ? 'التطورات' : 'Developments'}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </Link>
            {links.filter(l => !['about', 'residences', 'community', 'investment', 'developments', 'contact'].includes(l.label.toLowerCase())).map((link, i) => (
              <Link
                key={`nav-${link.label}-${i}`}
                href={resolveLink(link, locale)}
                className="relative text-sm font-medium tracking-wide text-fg/80 hover:text-fg transition-colors duration-300 group uppercase"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-6">
            <LocaleSwitcher current={locale} light={false} />
            <Link
              href={`/${locale}/contact`}
              className="hidden md:inline-flex text-sm font-medium tracking-wide uppercase px-6 py-3 bg-gold text-bg hover:bg-gold-dark transition-all duration-300"
            >
              Contact
            </Link>
            
            {/* Hamburger Button */}
            <button 
              className="md:hidden text-fg p-2 focus:outline-none hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-[90] bg-fg/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase">
            {locale === 'ar' ? 'معلومات عنا' : 'About'}
          </Link>
          <Link href={`/${locale}/residences`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase">
            {locale === 'ar' ? 'الوحدات السكنية' : 'Residences'}
          </Link>
          <Link href={`/${locale}/community`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase">
            {locale === 'ar' ? 'المجتمع' : 'Community'}
          </Link>
          <Link href={`/${locale}/investment`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase">
            {locale === 'ar' ? 'الاستثمار' : 'Investment'}
          </Link>
          <Link href={`/${locale}/projects`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase">
            {locale === 'ar' ? 'التطورات' : 'Developments'}
          </Link>
          {links.filter(l => !['about', 'residences', 'community', 'investment', 'developments', 'contact'].includes(l.label.toLowerCase())).map((link, i) => (
            <Link
              key={`mobile-nav-${link.label}-${i}`}
              href={resolveLink(link, locale)}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display tracking-wide text-bg hover:text-gold transition-colors duration-300 uppercase"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/contact`}
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 text-sm font-medium tracking-wide uppercase px-8 py-4 bg-gold text-fg hover:bg-white transition-all duration-300"
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}
