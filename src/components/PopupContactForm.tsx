'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CountrySelect } from '@/components/CountrySelect';
import { PhoneInput } from '@/components/PhoneInput';
import type { Locale } from '@/i18n/config';

const popupSchema = z.object({
  firstName: z.string().trim().min(2, 'Required').max(120),
  lastName: z.string().trim().min(2, 'Required').max(120),
  workEmail: z.string().trim().email('Invalid email').max(160),
  phone: z.string().trim().min(5, 'Required').max(40),
  nationality: z.string().trim().min(2, 'Required').max(120),
  message: z.string().trim().max(3000).optional().or(z.literal('')),
  locale: z.enum(['en', 'ar']),
});

type PopupInput = z.infer<typeof popupSchema>;

export function PopupContactForm({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already submitted
    const submitted = localStorage.getItem('hasSubmittedPopup') === 'true';
    if (submitted) {
      setHasSubmitted(true);
      return;
    }

    // Initial 10-second timer
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Trigger again after 20 seconds
    setTimeout(() => {
      if (localStorage.getItem('hasSubmittedPopup') !== 'true') {
        setIsOpen(true);
      }
    }, 20000);
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, control, reset } = useForm<PopupInput>({
    resolver: zodResolver(popupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      workEmail: '',
      phone: '',
      nationality: '',
      message: '',
      locale,
    }
  });

  const onSubmit = async (values: PopupInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/popup-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setServerError(json.error || 'Request failed');
        return;
      }
      
      // Success
      localStorage.setItem('hasSubmittedPopup', 'true');
      setHasSubmitted(true);
      setIsOpen(false);
      reset();
    } catch (err) {
      setServerError((err as Error).message || 'Network error');
    }
  };

  if (!isOpen || hasSubmitted) return null;

  const isAr = locale === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-fg-subtle hover:text-fg hover:bg-black/5 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="font-display text-2xl text-fg mb-2">
            {isAr ? 'احصل على معلومات أكثر' : 'Get More Information'}
          </h2>
          <p className="text-fg-subtle text-sm mb-6">
            {isAr ? 'يرجى تقديم تفاصيلك حتى نتمكن من مساعدتك بشكل أفضل.' : 'Please provide your details so we can assist you better.'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder={isAr ? 'الاسم الأول' : 'First Name'}
                  className="w-full bg-transparent border-b border-fg/15 py-2 text-sm text-fg focus:outline-none focus:border-gold transition-colors"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder={isAr ? 'اسم العائلة' : 'Last Name'}
                  className="w-full bg-transparent border-b border-fg/15 py-2 text-sm text-fg focus:outline-none focus:border-gold transition-colors"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder={isAr ? 'البريد الإلكتروني للعمل' : 'Work Email'}
                className="w-full bg-transparent border-b border-fg/15 py-2 text-sm text-fg focus:outline-none focus:border-gold transition-colors"
                {...register('workEmail')}
              />
              {errors.workEmail && <p className="mt-1 text-xs text-red-500">{errors.workEmail.message}</p>}
            </div>

            <div>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    value={value || ''}
                    onChange={onChange}
                    variant="transparent"
                  />
                )}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <Controller
                control={control}
                name="nationality"
                render={({ field: { onChange, value } }) => (
                  <CountrySelect
                    value={value || ''}
                    onChange={onChange}
                    variant="transparent"
                  />
                )}
              />
              {errors.nationality && <p className="mt-1 text-xs text-red-500">{errors.nationality.message}</p>}
            </div>

            <div>
              <textarea
                placeholder={isAr ? 'الرسالة (اختياري)' : 'Message (optional)'}
                rows={2}
                className="w-full bg-transparent border-b border-fg/15 py-2 text-sm text-fg focus:outline-none focus:border-gold transition-colors resize-none"
                {...register('message')}
              />
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100 rounded">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-sm font-medium tracking-wide uppercase px-6 py-4 bg-fg text-bg hover:bg-gold hover:text-fg transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال' : 'Submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
