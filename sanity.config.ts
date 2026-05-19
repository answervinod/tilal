import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { documentInternationalization } from '@sanity/document-internationalization';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/deskStructure';
import { initialValueTemplates } from './sanity/initialValueTemplates';

const PREVIEW_ORIGIN =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

// Locales available for translatable documents.
// Must match `src/i18n/config.ts` locales.
const SUPPORTED_LOCALES = [
  { id: 'en', title: 'English' },
  { id: 'ar', title: 'Arabic' },
];

// Document types that should have one document per language.
// (Singletons like siteSettings, and admin-only types like inquiry/redirect, are NOT translated.)
const TRANSLATED_TYPES = ['page', 'project', 'post', 'category', 'navigation'];

export default defineConfig({
  name: 'tilal',
  title: 'Tilal',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes, templates: () => initialValueTemplates },
  plugins: [
    structureTool({ structure }),
    documentInternationalization({
      supportedLanguages: SUPPORTED_LOCALES,
      schemaTypes: TRANSLATED_TYPES,
    }),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_ORIGIN,
        // Studio hits this to start a preview session. Our route validates
        // a one-time secret, enables Draft Mode, and redirects to the page.
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        // Tells the iframe where each document type lives on the frontend.
        locations: {
          page: defineLocations({
            select: { title: 'title', slug: 'slug.current', language: 'language' },
            resolve: (doc) => {
              const slug = doc?.slug || '';
              const lang = (doc?.language as string) || 'en';
              const path = slug === 'home' || !slug ? `/${lang}` : `/${lang}/${slug}`;
              return {
                locations: [{ title: doc?.title || 'Untitled', href: path }],
              };
            },
          }),
          project: defineLocations({
            select: { title: 'title', slug: 'slug.current', language: 'language' },
            resolve: (doc) => {
              const slug = doc?.slug;
              const lang = (doc?.language as string) || 'en';
              if (!slug) return { locations: [] };
              return {
                locations: [
                  { title: doc?.title || 'Untitled', href: `/${lang}/projects/${slug}` },
                  { title: 'Projects index', href: `/${lang}/projects` },
                ],
              };
            },
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
