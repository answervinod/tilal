import { defineType, defineField } from 'sanity';

export const listingsGridBlock = defineType({
  name: 'listingsGridBlock',
  title: 'Listings Grid (with filters)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'showFilters',
      title: 'Show filter controls',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'defaultCategory',
      title: 'Pre-select Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'pageSize',
      title: 'Items per page',
      type: 'number',
      initialValue: 12,
      validation: (r) => r.min(3).max(48),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: heading || 'Listings Grid',
      subtitle: 'Full listings grid with filters',
    }),
  },
});
