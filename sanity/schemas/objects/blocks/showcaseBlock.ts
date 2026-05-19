import { defineType, defineField } from 'sanity';

/**
 * Full-bleed editorial showcase. One large image or video, with an
 * optional floating text card (caption, location, year) and CTA.
 * Premium magazine-style placement.
 */
export const showcaseBlock = defineType({
  name: 'showcaseBlock',
  title: 'Showcase (Full-bleed Media)',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'object',
      validation: (r) => r.required(),
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
        { name: 'videoUrl', title: 'Video URL (mp4)', type: 'url' },
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption / project label',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow (small label)', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle / location', type: 'string' },
        { name: 'meta', title: 'Meta (year, sqm, etc.)', type: 'string' },
        { name: 'cta', title: 'CTA button', type: 'link' },
      ],
    }),
    defineField({
      name: 'captionPosition',
      title: 'Caption position',
      type: 'string',
      options: {
        list: [
          { title: 'Bottom-left card', value: 'bottom-left' },
          { title: 'Bottom-right card', value: 'bottom-right' },
          { title: 'Top-left card', value: 'top-left' },
          { title: 'Below media (no overlay)', value: 'below' },
          { title: 'Hidden', value: 'none' },
        ],
      },
      initialValue: 'bottom-left',
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (60vh)', value: 'standard' },
          { title: 'Tall (80vh)', value: 'tall' },
          { title: 'Fullscreen (100vh)', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'tall',
    }),
  ],
  preview: {
    select: { title: 'caption.title', media: 'media.image' },
    prepare: ({ title, media }) => ({
      title: title || 'Showcase',
      subtitle: 'Full-bleed showcase',
      media,
    }),
  },
});
