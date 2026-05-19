import Image from 'next/image';
import { imageUrl } from '../../../sanity/lib/image';
import type { SanityImage } from '../../../sanity/lib/types';

export interface LogoCloudData {
  _type: 'logoCloudBlock';
  _key: string;
  heading?: string;
  grayscale?: boolean;
  logos?: Array<SanityImage & { name?: string; url?: string }>;
}

export function LogoCloud({ data }: { data: LogoCloudData }) {
  const logos = data.logos || [];
  if (!logos.length) return null;
  const grayscale = data.grayscale !== false;

  return (
    <section className="container py-12 md:py-16">
      {data.heading && (
        <p className="text-center text-xs uppercase tracking-[0.3em] text-neutral-500 mb-8">
          {data.heading}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-10 items-center">
        {logos.map((logo, i) => {
          const src = imageUrl(logo, 300);
          if (!src) return null;
          const inner = (
            <div className="relative h-12 w-full">
              <Image
                src={src}
                alt={logo.name || 'Logo'}
                fill
                sizes="200px"
                className={`object-contain ${
                  grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition' : ''
                }`}
              />
            </div>
          );
          return logo.url ? (
            <a
              key={i}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.name}
            >
              {inner}
            </a>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
