import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Post',
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
        maxLength: 96,
        isUnique: async (slug: string, context: any) => {
          const { document, getClient } = context;
          const language = document?.language || 'en';
          const id = document?._id?.replace('drafts.', '') || '';
          if (!slug) return true;
          const client = getClient({ apiVersion: '2024-10-01' });
          const count = await client.fetch(
            `count(*[_type == "post" && slug.current == $slug && language == $language && !(_id in [$id, "drafts." + $id])])`,
            { slug, language, id }
          );
          return count === 0;
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'cover', title: 'Cover', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    { title: 'Newest', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'cover', author: 'author.name' },
    prepare: ({ title, media, author }) => ({
      title: title || 'Untitled post',
      subtitle: author ? `by ${author}` : '',
      media,
    }),
  },
});
