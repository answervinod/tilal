import { defineType, defineField } from 'sanity';

/**
 * Split Hero — 50/50 media + content. Premium real-estate go-to layout
 * (think Knight Frank / Sotheby's landing). Media on left OR right.
 */
export const splitHeroBlock = defineType({
  name: 'splitHeroBlock',
  title: 'Split Hero (Media + Content)',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body copy', type: 'text', rows: 4 }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Video (autoplay, muted)', value: 'video' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
        { name: 'videoUrl', title: 'Video URL (mp4 or YouTube)', type: 'url' },
      ],
    }),
    defineField({
      name: 'mediaSide',
      title: 'Media position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Light background', value: 'light' },
          { title: 'Cream / warm background', value: 'cream' },
          { title: 'Dark / brand background', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [{ type: 'link' }],
      validation: (r) => r.max(2),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'media.image' },
    prepare: ({ title, media }) => ({
      title: title || 'Split Hero',
      subtitle: 'Split Hero — media + content',
      media,
    }),
  },
});
