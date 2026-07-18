'use client';

import { useState } from 'react';
import { PdfDownloadModal } from './PdfDownloadModal';
import type { Locale } from '@/i18n/config';

interface Props {
  pdfUrl: string;
  projectSlug: string;
  locale: Locale;
  buttonText: string;
  className?: string;
}

export function PdfDownloadButton({ pdfUrl, projectSlug, locale, buttonText, className }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {buttonText}
      </button>

      <PdfDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
        projectSlug={projectSlug}
        locale={locale}
      />
    </>
  );
}
