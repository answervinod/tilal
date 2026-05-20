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

  return (
    <footer className="bg-fg text-bg relative overflow-hidden">
      {/* Main footer content */}
      <div className="container pt-20 md:pt-28 pb-16">
        {/* Top row — location + phone */}
        <div className="flex items-baseline justify-between mb-14 md:mb-20">
          <span className="label text-bg/40">— Dubai, UAE</span>
          <span className="label text-bg/40 hidden md:inline">
            Call: 800 15
          </span>
        </div>

        {/* Large brand mark */}
        <p
          className="font-display text-bg leading-none mb-16 md:mb-24"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            letterSpacing: '-0.04em',
          }}
        >
          {title}<span className="text-gold">.</span>
        </p>

        {/* Divider */}
        <div className="rule mb-14 md:mb-20 bg-bg/10" />

        {/* Content grid */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Brand column */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <p className="label text-bg/40 mb-6">The Vision</p>
            <p className="text-bg/60 text-lg leading-relaxed max-w-md mb-6">
              A vision of modern luxury living in Dubai. Designed for lifestyle. Built for investment.
            </p>
            <p className="text-bg/40 text-sm leading-relaxed max-w-sm">
              Strategically located in Dubai&apos;s fastest-growing corridor, redefining residential excellence.
            </p>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links columns */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
              {/* Navigation columns from Sanity */}
              {nav?.footerColumns?.map((col, i) => (
                <div key={`${col.title || 'col'}-${i}`}>
                  {col.title && (
                    <p className="label text-bg/40 mb-5">{col.title}</p>
                  )}
                  <ul className="space-y-3">
                    {col.links?.map((link, j) => (
                      <li key={`${link.label}-${j}`}>
                        <Link
                          href={resolveLink(link, locale)}
                          target={link.newTab ? '_blank' : undefined}
                          rel={link.newTab ? 'noopener noreferrer' : undefined}
                          className="text-bg/50 hover:text-bg transition-colors text-sm link-underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact column */}
              <div>
                <p className="label text-bg/40 mb-5">Contact</p>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-bg/60 hover:text-gold transition-colors block"
                    >
                      {contactEmail}
                    </a>
                  </li>
                  {settings?.contactPhone && (
                    <li>
                      <a
                        href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}
                        className="text-bg/60 hover:text-gold transition-colors block"
                      >
                        {settings.contactPhone}
                      </a>
                    </li>
                  )}
                  {settings?.address && (
                    <li className="text-bg/40 text-xs leading-relaxed pt-1">
                      {settings.address}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bg/10">
        <div className="container py-6 md:py-7">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            {/* Copyright */}
            <p className="text-label text-bg/40">
              {nav?.footerNote || `\u00a9 ${new Date().getFullYear()} ${title}. All rights reserved.`}
            </p>

            {/* Social + legal */}
            <div className="flex items-center gap-8">
              {socialEntries.length > 0 && (
                <ul className="flex items-center gap-5">
                  {socialEntries.map(([key, url]) => (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label text-bg/40 hover:text-gold transition-colors"
                      >
                        {key === 'x' ? 'X' : key === 'linkedin' ? 'LinkedIn' : key.charAt(0).toUpperCase() + key.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
