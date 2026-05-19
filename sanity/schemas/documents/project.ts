import { defineType, defineField } from 'sanity';

/**
 * Project / Property listing.
 * Terminology TBD with client \u2014 currently called "Project" but easy to relabel.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'en',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug: string, context: any) => {
          const { document, getClient } = context;
          const language = document?.language || 'en';
          const id = document?._id?.replace('drafts.', '') || '';
          if (!slug) return true;
          const client = getClient({ apiVersion: '2024-10-01' });
          const count = await client.fetch(
            `count(*[_type == "project" && slug.current == $slug && language == $language && !(_id in [$id, "drafts." + $id])])`,
            { slug, language, id }
          );
          return count === 0;
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'overview' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'overview',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Sold', value: 'sold' },
          { title: 'Coming Soon', value: 'coming_soon' },
        ],
      },
      initialValue: 'available',
      group: 'overview',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this listing on the homepage / featured blocks.',
      initialValue: false,
      group: 'overview',
    }),

    // Details
    defineField({
      name: 'location',
      title: 'Location (display)',
      type: 'string',
      description: 'Human-readable location, e.g. "Riyadh, Saudi Arabia".',
      group: 'details',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      group: 'details',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      group: 'details',
      fields: [
        {
          name: 'mode',
          title: 'Display',
          type: 'string',
          options: {
            list: [
              { title: 'Show price', value: 'show' },
              { title: 'Inquire for price', value: 'inquire' },
            ],
            layout: 'radio',
          },
          initialValue: 'show',
        },
        { name: 'amount', title: 'Amount', type: 'number' },
        { name: 'currency', title: 'Currency', type: 'string', initialValue: 'SAR' },
      ],
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'bedrooms', title: 'Bedrooms', type: 'number' },
        { name: 'bathrooms', title: 'Bathrooms', type: 'number' },
        { name: 'area', title: 'Area (sqm)', type: 'number' },
        { name: 'parking', title: 'Parking spaces', type: 'number' },
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'details',
    }),
    defineField({
      name: 'brochure',
      title: 'Brochure (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'details',
    }),

    // Media
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'floorplans',
      title: 'Floorplans',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [{ name: 'label', title: 'Label', type: 'string' }],
        },
      ],
      group: 'media',
    }),

    // Metadata
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'meta',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'meta' }),
  ],
  orderings: [
    {
      title: 'Featured first, then newest',
      name: 'featuredDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    { title: 'Newest', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'cover', status: 'status' },
    prepare: ({ title, subtitle, media, status }) => ({
      title: title || 'Untitled project',
      subtitle: [status, subtitle].filter(Boolean).join(' \u00b7 '),
      media,
    }),
  },
});
