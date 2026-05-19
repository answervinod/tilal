import { defineType, defineField } from 'sanity';

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'qa',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (r) => r.required() },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'items.length' },
    prepare: ({ heading, count }) => ({
      title: heading || 'FAQ',
      subtitle: `${count || 0} question${count === 1 ? '' : 's'}`,
    }),
  },
});
