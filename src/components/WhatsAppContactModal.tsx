'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@/components/PhoneInput';

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(5, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
});

type ContactInput = z.infer<typeof contactSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  whatsappUrl: string;
}

export function WhatsAppContactModal({ isOpen, onClose, whatsappUrl }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
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

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, projectSlug: 'WhatsApp Contact' }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setServerError(json.error || 'Request failed');
        return;
      }
      
      // Trigger WhatsApp open
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (err) {
      setServerError((err as Error).message || 'Network error');
    }
  };

  const inputCls =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all';
  const labelCls = 'block text-xs font-medium text-gray-300 mb-1.5';
  const errCls = 'mt-1 text-[11px] text-red-400';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal - Dark Glassmorphism */}
      <div className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Subtle glowing orb in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#25D366]/20 rounded-full blur-[100px] pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8 text-center relative z-10">
          <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#25D366]/20 shadow-[0_0_15px_rgba(37,211,102,0.1)]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Connect on WhatsApp</h2>
          <p className="text-sm text-gray-400">Please provide your details below and we will open a direct chat with our team.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="wa-firstName">First Name</label>
              <input
                id="wa-firstName"
                className={inputCls}
                placeholder="John"
                autoComplete="given-name"
                {...register('firstName')}
              />
              {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="wa-lastName">Last Name</label>
              <input
                id="wa-lastName"
                className={inputCls}
                placeholder="Doe"
                autoComplete="family-name"
                {...register('lastName')}
              />
              {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="wa-phone">Phone Number</label>
            <div className="dark-theme-phone-wrapper">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    id="wa-phone"
                    value={value}
                    onChange={onChange}
                    error={errors.phone?.message}
                    variant="dark"
                  />
                )}
              />
            </div>
            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
          </div>

          <div>
            <label className={labelCls} htmlFor="wa-email">Email Address</label>
            <input
              id="wa-email"
              type="email"
              className={inputCls}
              placeholder="john@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>

          {serverError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-left">
              <p>{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20bd5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all disabled:opacity-60 disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              'Opening WhatsApp...'
            ) : (
              <>
                Continue to Chat
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
