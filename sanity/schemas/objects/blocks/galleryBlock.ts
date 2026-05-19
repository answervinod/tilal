import { defineType, defineField } from 'sanity';

export const galleryBlock = defineType({
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Drag multiple files at once to upload in bulk. Add alt text to each image (helps SEO and accessibility).',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description:
                'Describe what is in the image \u2014 used by search engines and screen readers.',
              validation: (r) =>
                r
                  .custom((value) =>
                    typeof value !== 'string' || value.trim().length < 4
                      ? 'Please add a short description (alt text) so the image is accessible.'
                      : true
                  )
                  .warning(),
            },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Masonry', value: 'masonry' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
      hidden: ({ parent }) => parent?.layout === 'carousel',
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'images.length', media: 'images.0' },
    prepare: ({ heading, count, media }) => ({
      title: heading || 'Gallery',
      subtitle: `${count || 0} image${count === 1 ? '' : 's'}`,
      media,
    }),
  },
});
