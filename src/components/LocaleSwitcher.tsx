'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/config';

const LABELS: Record<Locale, string> = {
  en: 'EN',
  ar: 'AR',
};

/**
 * Swap the leading /[locale] segment in the current pathname so the user
 * stays on the same page when switching language.
 */
export function LocaleSwitcher({ current, light = false }: { current: Locale; light?: boolean }) {
  const pathname = usePathname() || '/';
  const segments = pathname.split('/').filter(Boolean);
  const rest = segments.slice(1).join('/');

  return (
    <div className="flex items-center gap-1 text-label">
      {locales.map((loc, i) => {
        const isActive = loc === current;
        const href = `/${loc}${rest ? `/${rest}` : ''}`;
        return (
          <span key={loc} className="flex items-center">
            {i > 0 && (
              <span className={`mx-1 transition-colors duration-700 ${light ? 'text-bg/30' : 'text-fg/20'}`}>/</span>
            )}
            <Link
              href={href}
              className={`transition-colors duration-500 ${
                isActive
                  ? light ? 'text-bg font-medium' : 'text-fg font-medium'
                  : light ? 'text-bg/60 hover:text-bg' : 'text-fg-subtle hover:text-fg'
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              {LABELS[loc]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
