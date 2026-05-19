import { defineType, defineField } from 'sanity';

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Stat Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            { name: 'value', title: 'Value', type: 'string', description: 'e.g. "25+", "100K", "98%"' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (r) => r.min(1).max(8),
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'items.length' },
    prepare: ({ heading, count }) => ({
      title: heading || 'Stats',
      subtitle: `${count || 0} stat${count === 1 ? '' : 's'}`,
    }),
  },
});
