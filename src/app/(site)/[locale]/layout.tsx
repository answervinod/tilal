import '../../globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import localFont from 'next/font/local';
import { Tajawal } from 'next/font/google';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DraftModeIndicator } from '@/components/DraftModeIndicator';
import { SmoothScrollProvider } from '@/components/SmoothScroll';
import { CustomCursor } from '@/components/CustomCursor';
import { sanityFetch } from '../../../../sanity/lib/fetch';
import { siteSettingsQuery, navigationQuery } from '../../../../sanity/lib/queries';
import type { Navigation, SiteSettings } from '../../../../sanity/lib/types';

/* AktivGrotesk — full family loaded from local TTF files.
   The browser downloads only the weights/styles actually used on each page. */
const aktivGrotesk = localFont({
  src: [
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Hairline.ttf', weight: '100', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-HairlineItalic.ttf', weight: '100', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Thin.ttf', weight: '200', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-ThinItalic.ttf', weight: '200', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-LightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-XBold.ttf', weight: '800', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-XBoldItalic.ttf', weight: '800', style: 'italic' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-Black.ttf', weight: '900', style: 'normal' },
    { path: '../../../../public/Aktiv Grotesk/TTF/AktivGrotesk-BlackItalic.ttf', weight: '900', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

// Arabic body family (retained for Arabic locale fallbacks).
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Tilal', template: '%s \u2014 Tilal' },
  description: 'Tilal \u2014 timeless spaces, modern living.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SiteRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  // Fetch CMS chrome (settings + nav) in parallel.
  const [settings, nav] = await Promise.all([
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    }).catch(() => null),
    sanityFetch<Navigation | null>({
      query: navigationQuery,
      params: { locale },
      tags: ['navigation', `navigation:${locale}`],
    }).catch(() => null),
  ]);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${aktivGrotesk.variable} ${tajawal.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SmoothScrollProvider>
            <CustomCursor />
            <Header locale={locale as Locale} settings={settings} nav={nav} />
            <div className="flex-1">{children}</div>
            <Footer locale={locale as Locale} settings={settings} nav={nav} />
            <DraftModeIndicator />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
        {/* Organization JSON-LD (helps Google rich results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: settings?.title || 'Tilal',
              url: SITE_URL,
              ...(settings?.contactEmail
                ? { email: settings.contactEmail }
                : {}),
              ...(settings?.contactPhone
                ? { telephone: settings.contactPhone }
                : {}),
              ...(settings?.address ? { address: settings.address } : {}),
              ...(settings?.social
                ? {
                    sameAs: Object.values(settings.social).filter(
                      (v): v is string => typeof v === 'string' && v.length > 0
                    ),
                  }
                : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}
