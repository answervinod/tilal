import { defineType, defineField } from 'sanity';

export const featuredListingsBlock = defineType({
  name: 'featuredListingsBlock',
  title: 'Featured Listings',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'mode',
      title: 'Selection Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Pick listings manually', value: 'manual' },
          { title: 'Auto: featured projects', value: 'featured' },
          { title: 'Auto: by category', value: 'category' },
        ],
        layout: 'radio',
      },
      initialValue: 'featured',
    }),
    defineField({
      name: 'listings',
      title: 'Listings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      hidden: ({ parent }) => parent?.mode !== 'manual',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.mode !== 'category',
    }),
    defineField({
      name: 'limit',
      title: 'Max items to show',
      type: 'number',
      initialValue: 6,
      validation: (r) => r.min(1).max(24),
    }),
    defineField({
      name: 'cta',
      title: 'Bottom Link',
      type: 'link',
      description: 'Optional link at the bottom (e.g. \u201cSee all projects\u201d).',
    }),
  ],
  preview: {
    select: { heading: 'heading', mode: 'mode' },
    prepare: ({ heading, mode }) => ({
      title: heading || 'Featured Listings',
      subtitle: `Listings (${mode || 'featured'})`,
    }),
  },
});
