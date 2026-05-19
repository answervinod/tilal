import { defineType, defineField } from 'sanity';

/**
 * Header / footer navigation. One document per language (managed by document-internationalization).
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'language', title: 'Language', type: 'string', readOnly: true, hidden: true, initialValue: 'en' }),
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Just for the Studio (e.g. "Main Navigation").',
      initialValue: 'Main Navigation',
    }),
    defineField({
      name: 'header',
      title: 'Header Links',
      type: 'array',
      of: [{ type: 'link' }],
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            { name: 'title', title: 'Column Title', type: 'string' },
            { name: 'links', title: 'Links', type: 'array', of: [{ type: 'link' }] },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'text',
      rows: 2,
      description: 'Small text shown at the bottom (copyright, etc.).',
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
});
