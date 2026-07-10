'use client';

import { useEffect } from 'react';
import type { Locale } from '@/i18n/config';

interface CalendlyPopupButtonProps {
  locale: Locale;
}

export function CalendlyPopupButton({ locale }: CalendlyPopupButtonProps) {
  useEffect(() => {
    const linkId = 'calendly-widget-css';
    const scriptId = 'calendly-widget-js';

    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/maitysabuj939/30min',
      });
    } else {
      window.open('https://calendly.com/maitysabuj939/30min', '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-3 bg-gold text-fg px-8 py-4 text-sm font-medium tracking-wide hover:bg-gold-light transition-colors shrink-0"
    >
      {locale === 'ar' ? 'احجز اجتماعاً' : 'Book A Meeting'}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
