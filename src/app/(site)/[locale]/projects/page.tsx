import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { ProjectsPageClient } from '@/components/ProjectsPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/projects`;
  return {
    title: 'Our Developments | Tilal',
    description: 'A curated collection of residential communities designed for diverse lifestyles and investment goals.',
    alternates: { canonical: `/${locale}/projects`, languages },
  };
}

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsPageClient locale={locale as Locale} />;
}
