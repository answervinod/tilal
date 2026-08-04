'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { inquirySchema, type InquiryInput } from '@/lib/inquirySchema';
import type { Locale } from '@/i18n/config';
import { CountrySelect } from '@/components/CountrySelect';
import { PhoneInput } from '@/components/PhoneInput';

interface Props {
  locale: Locale;
  defaultSubject?: string;
}

export function InquiryForm({ locale, defaultSubject }: Props) {
  const t = useTranslations('Inquiry');
  const params = useSearchParams();
  const projectFromUrl = params?.get('project') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setValue,
    control,
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      workEmail: '',
      phone: '',
      nationality: '',
      subject: defaultSubject || '',
      message: '',
      projectSlug: projectFromUrl,
      website: '',
      locale,
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  // If the URL ?project= changes after mount, sync it.
  useEffect(() => {
    if (projectFromUrl) setValue('projectSlug', projectFromUrl);
  }, [projectFromUrl, setValue]);

  const onSubmit = async (values: InquiryInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setServerError(json.error || 'Request failed');
        return;
      }
      reset({
        firstName: '',
        lastName: '',
        workEmail: '',
        phone: '',
        nationality: '',
        subject: defaultSubject || '',
        message: '',
        projectSlug: projectFromUrl,
        website: '',
        locale,
      });
    } catch (err) {
      setServerError((err as Error).message || 'Network error');
    }
  };

  if (isSubmitSuccessful && !serverError) {
    return (
      <div className="p-8 border border-brand-accent/40 bg-brand-accent/5 text-center">
        <p className="font-display text-2xl text-brand">{t('successTitle')}</p>
        <p className="text-sm text-neutral-600 mt-2">{t('successBody')}</p>
      </div>
    );
  }

  const inputCls =
    'w-full bg-white border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors';
  const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-2';
  const errCls = 'mt-1 text-xs text-red-600';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot (visually hidden) */}
      <div aria-hidden className="absolute -left-[9999px] opacity-0 pointer-events-none">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <input type="hidden" {...register('locale')} value={locale} readOnly />
      <input type="hidden" {...register('projectSlug')} />

      {projectFromUrl && (
        <p className="text-xs text-neutral-500">
          <span className="uppercase tracking-widest">{t('regarding')}: </span>
          <span className="text-brand">{projectFromUrl}</span>
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} htmlFor="inq-firstName">
            First Name
          </label>
          <input
            id="inq-firstName"
            className={inputCls}
            autoComplete="given-name"
            {...register('firstName')}
          />
          {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="inq-lastName">
            Last Name
          </label>
          <input
            id="inq-lastName"
            className={inputCls}
            autoComplete="family-name"
            {...register('lastName')}
          />
          {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} htmlFor="inq-workEmail">
            Work Email
          </label>
          <input
            id="inq-workEmail"
            type="email"
            className={inputCls}
            autoComplete="email"
            {...register('workEmail')}
          />
          {errors.workEmail && <p className={errCls}>{errors.workEmail.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="inq-phone">
            Phone Number
          </label>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                id="inq-phone"
                value={value}
                onChange={onChange}
                error={errors.phone?.message}
              />
            )}
          />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>
            Nationality
          </label>
          <Controller
            control={control}
            name="nationality"
            render={({ field: { onChange, value } }) => (
              <CountrySelect
                value={value}
                onChange={onChange}
                error={errors.nationality?.message}
              />
            )}
          />
          {errors.nationality && <p className={errCls}>{errors.nationality.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} htmlFor="inq-subject">
            {t('subject')}
          </label>
          <input id="inq-subject" className={inputCls} {...register('subject')} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="inq-message">
          {t('message')}
        </label>
        <textarea
          id="inq-message"
          rows={5}
          className={`${inputCls} resize-y`}
          {...register('message')}
        />
        {errors.message && <p className={errCls}>{errors.message.message}</p>}
      </div>

      {serverError && (
        <div className="p-4 border border-red-200 bg-red-50 text-sm text-red-700">
          <p className="font-medium">{t('errorTitle')}</p>
          <p className="mt-1">{t('errorBody')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-7 py-3.5 bg-brand text-white text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand transition-colors disabled:opacity-60"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
