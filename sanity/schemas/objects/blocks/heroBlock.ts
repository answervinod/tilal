import { defineType, defineField } from 'sanity';

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 3 }),
    defineField({
      name: 'media',
      title: 'Background Media',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Video', value: 'video' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'videoUrl', title: 'Video URL (mp4 or YouTube)', type: 'url' },
        { name: 'overlay', title: 'Dark overlay strength (0\u20131)', type: 'number', initialValue: 0.4 },
      ],
    }),
    defineField({
      name: 'ctas',
      title: 'Call to Action Buttons',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'align',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'media.image' },
    prepare: ({ title, media }) => ({ title: title || 'Hero', subtitle: 'Hero block', media }),
  },
});
