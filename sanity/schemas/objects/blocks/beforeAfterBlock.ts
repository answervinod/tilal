import { defineType, defineField } from 'sanity';

/**
 * Before/After interactive image slider. Common in real estate for showing
 * renovations, day/night views, planned vs. built, etc.
 */
export const beforeAfterBlock = defineType({
  name: 'beforeAfterBlock',
  title: 'Before / After Slider',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'before',
      title: 'Before image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
        { name: 'label', title: 'Overlay label (e.g. "Before")', type: 'string' },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'after',
      title: 'After image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
        { name: 'label', title: 'Overlay label (e.g. "After")', type: 'string' },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'initialPosition',
      title: 'Initial slider position (%)',
      type: 'number',
      initialValue: 50,
      validation: (r) => r.min(0).max(100),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'after' },
    prepare: ({ title, media }) => ({
      title: title || 'Before / After',
      subtitle: 'Before / After slider',
      media,
    }),
  },
});
