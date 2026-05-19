import { defineType, defineField } from 'sanity';

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({
      name: 'from',
      title: 'From Path',
      type: 'string',
      description: 'Old path, e.g. "/old-url". Must start with /.',
      validation: (r) =>
        r.required().custom((v: string | undefined) => {
          if (!v) return true;
          if (!v.startsWith('/')) return 'Path must start with /';
          return true;
        }),
    }),
    defineField({
      name: 'to',
      title: 'To URL or Path',
      type: 'string',
      description: 'New destination, e.g. "/new-url" or full https:// URL.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { from: 'from', to: 'to', permanent: 'permanent' },
    prepare: ({ from, to, permanent }) => ({
      title: `${from || '?'} \u2192 ${to || '?'}`,
      subtitle: permanent ? '301 (permanent)' : '302 (temporary)',
    }),
  },
});
