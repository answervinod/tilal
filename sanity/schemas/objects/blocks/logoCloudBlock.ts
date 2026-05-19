import { defineType, defineField } from 'sanity';

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: false },
          fields: [
            { name: 'name', title: 'Company Name', type: 'string' },
            { name: 'url', title: 'Link', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'grayscale',
      title: 'Grayscale on default',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'logos.length' },
    prepare: ({ heading, count }) => ({
      title: heading || 'Logo Cloud',
      subtitle: `${count || 0} logo${count === 1 ? '' : 's'}`,
    }),
  },
});
