import { Suspense } from 'react';
import { InquiryForm } from '@/components/InquiryForm';
import type { Locale } from '@/i18n/config';

export interface ContactData {
  _type: 'contactBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
  showForm?: boolean;
}

export function Contact({ data, locale }: { data: ContactData; locale: Locale }) {
  return (
    <section className="container py-16 md:py-24 grid gap-10 md:grid-cols-12">
      <div className="md:col-span-5">
        {data.heading && (
          <h2 className="font-display text-3xl md:text-5xl text-brand leading-tight">
            {data.heading}
          </h2>
        )}
        {data.subheading && (
          <p className="mt-4 text-neutral-600 leading-relaxed max-w-md">
            {data.subheading}
          </p>
        )}

        <dl className="mt-8 space-y-4 text-sm">
          {data.email && (
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-neutral-500">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${data.email}`}
                  className="text-brand hover:text-brand-accent transition-colors"
                >
                  {data.email}
                </a>
              </dd>
            </div>
          )}
          {data.phone && (
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-neutral-500">
                Phone
              </dt>
              <dd className="mt-1 text-neutral-700">{data.phone}</dd>
            </div>
          )}
          {data.address && (
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-neutral-500">
                Address
              </dt>
              <dd className="mt-1 text-neutral-700 whitespace-pre-line">{data.address}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="md:col-span-7 space-y-6">
        {data.mapEmbedUrl && (
          <div className="relative aspect-[4/3] bg-neutral-100">
            <iframe
              src={data.mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              title="Location map"
            />
          </div>
        )}
        {data.showForm !== false && (
          <Suspense fallback={<div className="h-48 animate-pulse bg-neutral-100 rounded" />}>
            <InquiryForm locale={locale} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
