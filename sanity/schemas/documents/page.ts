import { defineType, defineField } from 'sanity';

/**
 * Generic Page document. Editable in any language (i18n via document-internationalization plugin).
 * The `sections[]` array is the page-builder \u2014 client adds/reorders/removes blocks freely.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fieldsets: [
    { name: 'metadata', title: 'Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'en',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug: string, context: any) => {
          const { document, getClient } = context;
          const language = document?.language || 'en';
          const id = document?._id?.replace('drafts.', '') || '';
          if (!slug) return true;
          const client = getClient({ apiVersion: '2024-10-01' });
          const count = await client.fetch(
            `count(*[_type == "page" && slug.current == $slug && language == $language && !(_id in [$id, "drafts." + $id])])`,
            { slug, language, id }
          );
          return count === 0;
        },
      },
      validation: (r) => r.required(),
      description: 'The URL path. Use "home" for the home page.',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      description:
        'Build the page by adding blocks. Drag to reorder. Click any block to edit its content.',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'splitHeroBlock' },
        { type: 'showcaseBlock' },
        { type: 'richTextBlock' },
        { type: 'galleryBlock' },
        { type: 'beforeAfterBlock' },
        { type: 'ctaBlock' },
        { type: 'featuredListingsBlock' },
        { type: 'listingsGridBlock' },
        { type: 'statsBlock' },
        { type: 'testimonialsBlock' },
        { type: 'teamBlock' },
        { type: 'faqBlock' },
        { type: 'contactBlock' },
        { type: 'logoCloudBlock' },
        { type: 'videoBlock' },
        { type: 'mapBlock' },
        { type: 'brandIntroBlock' },
        { type: 'highlightsBlock' },
        { type: 'projectsShowcaseBlock' },
        { type: 'lifestyleBlock' },
        { type: 'amenitiesBlock' },
        { type: 'investmentBlock' },
        { type: 'fullCtaBlock' },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', fieldset: 'metadata' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({
      title: title || 'Untitled page',
      subtitle: slug ? `/${slug}` : 'No slug',
    }),
  },
});
