import { defineType, defineField } from 'sanity';

export const amenitiesBlock = defineType({
  name: 'amenitiesBlock',
  title: 'Amenities Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'items',
      title: 'Amenity Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'amenity',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'title', media: 'image' },
            prepare: ({ title, media }) => ({ title: title || 'Amenity', media }),
          },
        },
      ],
      validation: (r) => r.min(1).max(12),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'items.length' },
    prepare: ({ title, count }) => ({
      title: title || 'Amenities Grid',
      subtitle: `${count || 0} item${count === 1 ? '' : 's'}`,
    }),
  },
});
