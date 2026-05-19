import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';

export interface RichTextData {
  _type: 'richTextBlock';
  _key: string;
  eyebrow?: string;
  heading?: string;
  body?: PortableTextBlock[];
  maxWidth?: 'narrow' | 'wide';
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-3xl md:text-4xl text-brand mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl text-brand mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-s-2 border-brand-accent ps-6 my-6 italic text-neutral-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-relaxed text-neutral-700">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-brand">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href || '#';
      const newTab: boolean = Boolean(value?.newTab);
      return (
        <a
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-brand underline underline-offset-4 hover:text-brand-accent transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ data }: { data: RichTextData }) {
  const max = data.maxWidth === 'wide' ? 'max-w-5xl' : 'max-w-2xl';

  return (
    <section className="container py-16 md:py-24">
      <div className={`${max} mx-auto`}>
        {data.eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-brand-accent mb-3">
            {data.eyebrow}
          </p>
        )}
        {data.heading && (
          <h2 className="font-display text-3xl md:text-5xl text-brand mb-6 leading-tight">
            {data.heading}
          </h2>
        )}
        {data.body && <PortableText value={data.body} components={components} />}
      </div>
    </section>
  );
}
