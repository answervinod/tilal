import { defineType, defineField } from 'sanity';

/**
 * Reusable link object for buttons / nav items.
 * Either an internal reference (resolved to a URL on the frontend) or an external URL.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internal',
      title: 'Internal Reference',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'project' }, { type: 'post' }],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'external',
      validation: (r) =>
        r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }).custom((v, ctx) => {
          const parent = ctx.parent as { type?: string } | undefined;
          if (parent?.type === 'external' && !v) return 'URL is required';
          return true;
        }),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
