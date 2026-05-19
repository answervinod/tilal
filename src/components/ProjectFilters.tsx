'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

interface Category {
  _id: string;
  title: string;
  slug: string;
}

const STATUSES = ['available', 'reserved', 'sold', 'coming_soon'] as const;

export function ProjectFilters({
  categories,
  current,
}: {
  categories: Category[];
  current: { category?: string; status?: string; q?: string };
}) {
  const t = useTranslations('Projects');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(patch: Record<string, string | undefined>) {
    const sp = new URLSearchParams(params?.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    }
    sp.delete('page'); // reset pagination on filter change
    const q = sp.toString();
    startTransition(() => {
      router.push(q ? `${pathname}?${q}` : pathname);
    });
  }

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    update({ q: (formData.get('q') as string) || undefined });
  };

  return (
    <div
      className={`grid gap-4 md:grid-cols-12 items-end ${
        pending ? 'opacity-60' : ''
      }`}
    >
      {/* Categories */}
      <div className="md:col-span-5">
        <p className="text-label text-fg-subtle mb-2">{t('filterCategory')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ category: undefined })}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              !current.category
                ? 'border-fg bg-fg text-bg'
                : 'border-fg/15 text-fg-muted hover:border-fg hover:text-fg'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => update({ category: c.slug })}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                current.category === c.slug
                  ? 'border-brand bg-brand text-white'
                  : 'border-neutral-300 text-neutral-700 hover:border-brand hover:text-brand'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="md:col-span-3">
        <p className="text-label text-fg-subtle mb-2">{t('filterStatus')}</p>
        <select
          value={current.status || ''}
          onChange={(e) => update({ status: e.target.value || undefined })}
          className="w-full bg-bg border border-fg/15 px-3 py-2 text-sm focus:outline-none focus:border-gold text-fg"
        >
          <option value="">{t('all')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="md:col-span-4">
        <p className="text-label text-fg-subtle mb-2">{t('search')}</p>
        <form onSubmit={onSearchSubmit} className="flex">
          <input
            name="q"
            defaultValue={current.q || ''}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-bg border border-fg/15 px-3 py-2 text-sm focus:outline-none focus:border-gold text-fg placeholder:text-fg-subtle"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-fg text-bg text-label hover:bg-gold transition-colors duration-500"
          >
            {t('apply')}
          </button>
        </form>
      </div>
    </div>
  );
}
