'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@/components/PhoneInput';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';

const downloadSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Please enter a valid phone number'),
});

type DownloadInput = z.infer<typeof downloadSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  projectSlug: string;
  locale: Locale;
}

export function PdfDownloadModal({ isOpen, onClose, pdfUrl, projectSlug, locale }: Props) {
  const t = useTranslations('Inquiry');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<DownloadInput>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setServerError(null);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values: DownloadInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, projectSlug }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setServerError(json.error || 'Request failed');
        return;
      }
      
      // Trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (err) {
      setServerError((err as Error).message || 'Network error');
    }
  };

  const inputCls =
    'w-full bg-white border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors';
  const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-2 text-left';
  const errCls = 'mt-1 text-xs text-red-600 text-left';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-fg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-bg p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-fg/50 hover:text-fg transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl text-fg mb-2">Download Brochure</h2>
          <p className="text-sm text-fg-muted">Please fill in your details to access the {projectSlug} property details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls} htmlFor="pdf-firstName">First Name</label>
              <input
                id="pdf-firstName"
                className={inputCls}
                autoComplete="given-name"
                {...register('firstName')}
              />
              {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="pdf-lastName">Last Name</label>
              <input
                id="pdf-lastName"
                className={inputCls}
                autoComplete="family-name"
                {...register('lastName')}
              />
              {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="pdf-phone">Phone Number</label>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  id="pdf-phone"
                  value={value}
                  onChange={onChange}
                  error={errors.phone?.message}
                />
              )}
            />
            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
          </div>

          <div>
            <label className={labelCls} htmlFor="pdf-email">Email Address</label>
            <input
              id="pdf-email"
              type="email"
              className={inputCls}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>

          {serverError && (
            <div className="p-4 border border-red-200 bg-red-50 text-sm text-red-700 text-left">
              <p className="font-medium">Error</p>
              <p className="mt-1">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-7 py-4 mt-2 bg-brand text-white text-sm uppercase tracking-widest hover:bg-brand-accent hover:text-brand transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : 'Download PDF'}
          </button>
        </form>
      </div>
    </div>
  );
}
