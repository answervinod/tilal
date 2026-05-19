import { defineType, defineField } from 'sanity';

export const projectsShowcaseBlock = defineType({
  name: 'projectsShowcaseBlock',
  title: 'Projects Showcase',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'projects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (r) => r.max(6),
    }),
  ],
  preview: {
    select: { title: 'heading', count: 'projects.length' },
    prepare: ({ title, count }) => ({
      title: title || 'Projects Showcase',
      subtitle: `${count || 0} project${count === 1 ? '' : 's'}`,
    }),
  },
});
