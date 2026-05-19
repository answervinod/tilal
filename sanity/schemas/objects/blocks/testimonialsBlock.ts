import { defineType, defineField } from 'sanity';

export const testimonialsBlock = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimonial',
          fields: [
            { name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() },
            { name: 'author', title: 'Author', type: 'string', validation: (r) => r.required() },
            { name: 'role', title: 'Role / Company', type: 'string' },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
            { name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (r) => r.min(1).max(5) },
          ],
          preview: {
            select: { title: 'author', subtitle: 'role', media: 'photo' },
          },
        },
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'items.length' },
    prepare: ({ heading, count }) => ({
      title: heading || 'Testimonials',
      subtitle: `${count || 0} testimonial${count === 1 ? '' : 's'}`,
    }),
  },
});
