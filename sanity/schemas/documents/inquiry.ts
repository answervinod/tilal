import { defineType, defineField } from 'sanity';

/**
 * Inquiry / contact form submission. Created from the public site via /api/inquiry.
 * Editors can update the status field as they follow up.
 */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  // Inquiries are created via API. Hide the "create new" button in Studio.
  // (Enforced via desk structure / role permissions; this field-set is just for clarity.)
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4, readOnly: true }),
    defineField({
      name: 'subject',
      title: 'Inquiry About',
      type: 'string',
      readOnly: true,
      description: 'Listing/page the inquiry was sent from.',
    }),
    defineField({
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: [{ type: 'project' }],
      readOnly: true,
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [
    { title: 'Newest', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { name: 'name', subject: 'subject', status: 'status', date: 'submittedAt' },
    prepare: ({ name, subject, status, date }) => ({
      title: `${name || 'Anonymous'} \u2014 ${subject || 'General'}`,
      subtitle: `${(status || 'new').toUpperCase()} \u00b7 ${date ? new Date(date).toLocaleDateString() : ''}`,
    }),
  },
});
