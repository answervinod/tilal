import { defineType, defineField } from 'sanity';

export const fullCtaBlock = defineType({
  name: 'fullCtaBlock',
  title: 'Full CTA',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
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
  ],
  preview: {
    select: { title: 'heading', media: 'background' },
    prepare: ({ title, media }) => ({
      title: title || 'Full CTA',
      subtitle: 'Full-width call to action',
      media,
    }),
  },
});
