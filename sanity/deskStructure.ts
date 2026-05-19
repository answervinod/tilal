import type { StructureResolver } from 'sanity/structure';

/**
 * Tilal Studio sidebar.
 * Mirrors the mental model: Pages, Listings, Blog, Settings.
 * Hides raw schema types from the "auto" list to keep things tidy.
 */
const HIDDEN_DOC_TYPES = [
  'siteSettings',
  'navigation',
  'page',
  'project',
  'category',
  'post',
  'author',
  'inquiry',
  'redirect',
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Tilal')
    .items([
      // ----- Pages (page-builder) -----
      S.listItem()
        .title('Pages')
        .icon(() => '\uD83D\uDCC4')
        .schemaType('page')
        .child(
          S.documentTypeList('page')
            .title('Pages')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.divider(),

      // ----- Listings -----
      S.listItem()
        .title('Projects')
        .icon(() => '\uD83C\uDFD7\uFE0F')
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([
              { field: 'featured', direction: 'desc' },
              { field: 'publishedAt', direction: 'desc' },
            ])
        ),
      S.listItem()
        .title('Categories')
        .icon(() => '\uD83C\uDFF7\uFE0F')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),

      S.divider(),

      // ----- Blog -----
      S.listItem()
        .title('Blog Posts')
        .icon(() => '\u270D\uFE0F')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),

      S.divider(),

      // ----- Inquiries -----
      S.listItem()
        .title('Inquiries')
        .icon(() => '\uD83D\uDCE9')
        .schemaType('inquiry')
        .child(
          S.list()
            .title('Inquiries')
            .items([
              S.listItem()
                .title('New')
                .child(
                  S.documentList()
                    .title('New Inquiries')
                    .filter('_type == "inquiry" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Contacted')
                .child(
                  S.documentList()
                    .title('Contacted')
                    .filter('_type == "inquiry" && status == "contacted"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Closed')
                .child(
                  S.documentList()
                    .title('Closed')
                    .filter('_type == "inquiry" && status == "closed"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('All')
                .child(S.documentTypeList('inquiry').title('All Inquiries')),
            ])
        ),

      S.divider(),

      // ----- Settings -----
      S.listItem()
        .title('Site Settings')
        .icon(() => '\u2699\uFE0F')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.listItem()
        .title('Navigation')
        .icon(() => '\uD83E\uDDED')
        .schemaType('navigation')
        .child(S.documentTypeList('navigation').title('Navigation')),
      S.listItem()
        .title('Redirects')
        .icon(() => '\u21AA\uFE0F')
        .schemaType('redirect')
        .child(S.documentTypeList('redirect').title('Redirects')),

      // Anything else (fallback for newly-added schemas)
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_DOC_TYPES.includes(item.getId() as string)
      ),
    ]);
