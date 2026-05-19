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

  return (
    <footer className="bg-fg text-bg relative overflow-hidden">
      <div className="container pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="flex items-baseline justify-between mb-16">
          <span className="label text-bg/40">— Dubai, UAE</span>
          <span className="label text-bg/40 hidden md:inline">
            Call: 800 15
          </span>
        </div>

        <p
          className="font-display text-bg leading-none mb-20 md:mb-28"
          style={{
            fontSize: 'clamp(4rem, 14vw, 12rem)',
            letterSpacing: '-0.04em',
          }}
        >
          {title}<span className="text-gold">.</span>
        </p>

        <div className="rule mb-14 md:mb-20 bg-bg/10" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 md:col-span-4">
            <p className="label text-bg/40 mb-5">The Vision</p>
            <p className="text-bg/60 text-lg leading-relaxed max-w-sm mb-6">
              A vision of modern luxury living in Dubai. Designed for lifestyle. Built for investment.
            </p>
            <p className="text-bg/40 text-sm leading-relaxed max-w-xs">
              Strategically located in Dubai&apos;s fastest-growing corridor.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {nav?.footerColumns?.map((col, i) => (
              <div key={`${col.title || 'col'}-${i}`}>
                {col.title && (
                  <p className="label text-bg/40 mb-5">{col.title}</p>
                )}
                <ul className="space-y-3 text-[14px]">
                  {col.links?.map((link, j) => (
                    <li key={`${link.label}-${j}`}>
                      <Link
                        href={resolveLink(link, locale)}
                        target={link.newTab ? '_blank' : undefined}
                        rel={link.newTab ? 'noopener noreferrer' : undefined}
                        className="text-bg/50 hover:text-bg transition-colors link-underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="label text-bg/40 mb-5">Direct</p>
              <ul className="space-y-3 text-[14px]">
                {settings?.contactEmail && (
                  <li>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-bg/50 hover:text-bg transition-colors link-underline"
                    >
                      {settings.contactEmail}
                    </a>
                  </li>
                )}
                {settings?.contactPhone && (
                  <li className="text-bg/50 text-[13px]">
                    {settings.contactPhone}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-bg/10">
        <div className="container py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-label text-bg/40">
          <p>{nav?.footerNote || `\u00a9 ${new Date().getFullYear()} ${title}. All rights reserved.`}</p>
          {socialEntries.length > 0 && (
            <ul className="flex items-center gap-6">
              {socialEntries.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-bg transition-colors"
                  >
                    {key === 'x' ? 'X' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
