import { defineType, defineField } from 'sanity';

export const teamBlock = defineType({
  name: 'teamBlock',
  title: 'Team',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'member',
          fields: [
            { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
            { name: 'bio', title: 'Short Bio', type: 'text', rows: 3 },
            {
              name: 'social',
              title: 'Social',
              type: 'object',
              fields: [
                { name: 'linkedin', title: 'LinkedIn', type: 'url' },
                { name: 'email', title: 'Email', type: 'string' },
              ],
            },
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', count: 'members.length' },
    prepare: ({ heading, count }) => ({
      title: heading || 'Team',
      subtitle: `${count || 0} member${count === 1 ? '' : 's'}`,
    }),
  },
});
