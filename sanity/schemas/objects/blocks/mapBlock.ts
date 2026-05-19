import { defineType, defineField } from 'sanity';

export const mapBlock = defineType({
  name: 'mapBlock',
  title: 'Map',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
    }),
    defineField({
      name: 'embedUrl',
      title: 'Map Embed URL (optional override)',
      type: 'url',
      description: 'Use this if you want to embed a Google Maps iframe instead.',
    }),
    defineField({
      name: 'zoom',
      title: 'Zoom',
      type: 'number',
      initialValue: 14,
      validation: (r) => r.min(1).max(20),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Map', subtitle: 'Map block' }),
  },
});
