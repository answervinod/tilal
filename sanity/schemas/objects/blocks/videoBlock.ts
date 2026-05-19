import { defineType, defineField } from 'sanity';

export const videoBlock = defineType({
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube / Vimeo URL', value: 'url' },
          { title: 'Uploaded MP4', value: 'file' },
        ],
        layout: 'radio',
      },
      initialValue: 'url',
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      hidden: ({ parent }) => parent?.source !== 'url',
    }),
    defineField({
      name: 'file',
      title: 'Video File (MP4)',
      type: 'file',
      options: { accept: 'video/mp4' },
      hidden: ({ parent }) => parent?.source !== 'file',
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'autoplay', title: 'Autoplay (muted)', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { heading: 'heading', media: 'poster' },
    prepare: ({ heading, media }) => ({ title: heading || 'Video', subtitle: 'Video block', media }),
  },
});
