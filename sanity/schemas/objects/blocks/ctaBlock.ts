import { defineType, defineField } from 'sanity';

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'background',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Brand', value: 'brand' },
        ],
      },
      initialValue: 'brand',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'background' },
    prepare: ({ title, media }) => ({ title: title || 'CTA', subtitle: 'Call to action', media }),
  },
});
