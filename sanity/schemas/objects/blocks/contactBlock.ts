import { defineType, defineField } from 'sanity';

export const contactBlock = defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      description: 'Google Maps share \u2192 Embed iframe src.',
    }),
    defineField({
      name: 'showForm',
      title: 'Show inquiry form',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Contact', subtitle: 'Contact block' }),
  },
});
