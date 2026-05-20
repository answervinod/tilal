import Link from 'next/link';
import { resolveLink } from '@/lib/resolveLink';
import type { Locale } from '@/i18n/config';
import type { Navigation, SiteSettings } from '../../sanity/lib/types';

interface FooterProps {
  locale: Locale;
  settings: SiteSettings | null;
  nav: Navigation | null;
}

export function Footer({ locale, settings, nav }: FooterProps) {
  const social = settings?.social || {};
  const socialEntries = Object.entries(social).filter(([, v]) => Boolean(v)) as Array<[string, string]>;
  const title = settings?.title || 'Tilal';

  const contactEmail = 'sales@tilalbinghattiresidences.com';
  const year = new Date().getFullYear();

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ];

  return (
    <footer className="bg-fg text-bg relative overflow-hidden">
      {/* CTA Strip */}
      <div className="border-b border-bg/10">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="label text-gold mb-3">Ready to invest?</p>
              <p className="font-display text-2xl md:text-3xl text-bg leading-tight">
                Let&apos;s discuss your future residence.
              </p>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 bg-gold text-fg px-8 py-4 text-sm font-medium tracking-wide hover:bg-gold-light transition-colors shrink-0"
            >
              Schedule a consultation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container pt-16 md:pt-24 pb-12">
        {/* Top: Brand + tagline */}
        <div className="mb-14 md:mb-20">
          <p
            className="font-display text-bg leading-none mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '-0.03em',
            }}
          >
            {title}<span className="text-gold">.</span>
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-bg/50 text-base md:text-lg max-w-md leading-relaxed">
              A vision of modern luxury living in Dubai. Designed for lifestyle. Built for investment.
            </p>
            <div className="flex items-center gap-8 text-label text-bg/40">
              <span>— Dubai, UAE</span>
              <span className="hidden md:inline">Call: 800 15</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="rule mb-14 md:mb-20 bg-bg/10" />

        {/* Links grid */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Explore — from Sanity nav columns */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <p className="label text-gold mb-6">Explore</p>
            <ul className="space-y-3">
              {nav?.footerColumns?.[0]?.links?.map((link, j) => (
                <li key={`explore-${j}`}>
                  <Link
                    href={resolveLink(link, locale)}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    className="text-bg/50 hover:text-bg transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              )) || (
                <>
                  <li><span className="text-bg/50 text-sm">Projects</span></li>
                  <li><span className="text-bg/50 text-sm">Amenities</span></li>
                  <li><span className="text-bg/50 text-sm">Investment</span></li>
                  <li><span className="text-bg/50 text-sm">Materials</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <p className="label text-gold mb-6">Company</p>
            <ul className="space-y-3">
              {nav?.footerColumns?.[1]?.links?.map((link, j) => (
                <li key={`company-${j}`}>
                  <Link
                    href={resolveLink(link, locale)}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    className="text-bg/50 hover:text-bg transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              )) || (
                <>
                  <li><span className="text-bg/50 text-sm">About</span></li>
                  <li><span className="text-bg/50 text-sm">Contact</span></li>
                  <li><span className="text-bg/50 text-sm">Careers</span></li>
                  <li><span className="text-bg/50 text-sm">Press</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <p className="label text-gold mb-6">Resources</p>
            <ul className="space-y-3">
              <li><span className="text-bg/50 text-sm">Brochure</span></li>
              <li><span className="text-bg/50 text-sm">Floor Plans</span></li>
              <li><span className="text-bg/50 text-sm">Payment Plans</span></li>
              <li><span className="text-bg/50 text-sm">FAQ</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <p className="label text-gold mb-6">Legal</p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <span className="text-bg/50 text-sm cursor-default">{link.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-12 sm:col-span-8 lg:col-span-4">
            <p className="label text-gold mb-6">Contact</p>
            <div className="space-y-5">
              <a
                href={`mailto:${contactEmail}`}
                className="block text-bg hover:text-gold transition-colors text-lg"
              >
                {contactEmail}
              </a>
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}
                  className="block text-bg/60 hover:text-gold transition-colors text-sm"
                >
                  {settings.contactPhone}
                </a>
              )}
              {settings?.address && (
                <p className="text-bg/40 text-sm leading-relaxed max-w-xs">
                  {settings.address}
                </p>
              )}

              {/* Social */}
              {socialEntries.length > 0 && (
                <div className="flex items-center gap-5 pt-3">
                  {socialEntries.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-label text-bg/40 hover:text-gold transition-colors"
                    >
                      {key === 'x' ? 'X' : key === 'linkedin' ? 'LinkedIn' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bg/10">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-bg/30">
              {nav?.footerNote || `\u00a9 ${year} ${title}. All rights reserved.`}
            </p>
            <p className="text-xs text-bg/30">
              Crafted with precision in Dubai
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
