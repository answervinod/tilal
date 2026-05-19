import { defineType, defineField } from 'sanity';

export const highlightsBlock = defineType({
  name: 'highlightsBlock',
  title: 'Highlights Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'items',
      title: 'Highlight Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'title', media: 'image' },
            prepare: ({ title, media }) => ({ title: title || 'Highlight', media }),
          },
        },
      ],
      validation: (r) => r.min(1).max(8),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'items.length' },
    prepare: ({ title, count }) => ({
      title: title || 'Highlights Grid',
      subtitle: `${count || 0} item${count === 1 ? '' : 's'}`,
    }),
  },
});
