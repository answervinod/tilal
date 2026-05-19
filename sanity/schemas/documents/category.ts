import { defineType, defineField } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'language', title: 'Language', type: 'string', readOnly: true, hidden: true, initialValue: 'en' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 64,
        isUnique: async (slug: string, context: any) => {
          const { document, getClient } = context;
          const language = document?.language || 'en';
          const id = document?._id?.replace('drafts.', '') || '';
          if (!slug) return true;
          const client = getClient({ apiVersion: '2024-10-01' });
          const count = await client.fetch(
            `count(*[_type == "category" && slug.current == $slug && language == $language && !(_id in [$id, "drafts." + $id])])`,
            { slug, language, id }
          );
          return count === 0;
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
