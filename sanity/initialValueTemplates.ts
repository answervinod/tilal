/**
 * Initial-value templates that appear in the Studio "Create new" menu.
 * Editors pick a template (e.g. "Residential Project page") and get a
 * fully-laid-out draft instead of a blank document.
 *
 * Each template returns a partial document; Sanity fills in _id and timestamps.
 * Block `_key` values must be unique within an array.
 */

import type { Template } from 'sanity';

const k = () => Math.random().toString(36).slice(2, 10);

/** ---- Page presets ---- */

const residentialProjectPage = {
  title: 'New Residential Project Page',
  sections: [
    {
      _type: 'splitHeroBlock',
      _key: k(),
      eyebrow: 'Residence',
      heading: 'Replace with project name',
      body: 'A short description of the residence \u2014 architectural vision, neighborhood, what makes it distinctive.',
      mediaSide: 'right',
      variant: 'cream',
    },
    {
      _type: 'statsBlock',
      _key: k(),
      heading: 'At a glance',
      items: [
        { value: '4', label: 'Bedrooms' },
        { value: '350', label: 'Square meters' },
        { value: '2024', label: 'Year built' },
        { value: 'A+', label: 'Energy rating' },
      ],
    },
    {
      _type: 'galleryBlock',
      _key: k(),
      heading: 'Interiors',
      subheading: 'A curated selection of spaces within the residence.',
      layout: 'grid',
      columns: 3,
      images: [],
    },
    {
      _type: 'showcaseBlock',
      _key: k(),
      captionPosition: 'bottom-left',
      height: 'tall',
      caption: {
        eyebrow: 'Architecture',
        title: 'A signature volume',
        subtitle: 'Double-height living, framed by floor-to-ceiling glass.',
      },
    },
    {
      _type: 'mapBlock',
      _key: k(),
      heading: 'Location',
    },
    {
      _type: 'contactBlock',
      _key: k(),
      heading: 'Request a private viewing',
      subheading:
        'Submit your details below and one of our advisors will be in touch within 24 hours.',
      showForm: true,
    },
  ],
};

const commercialListingPage = {
  title: 'New Commercial Listing Page',
  sections: [
    {
      _type: 'heroBlock',
      _key: k(),
      eyebrow: 'Commercial',
      heading: 'Replace with listing name',
      subheading: 'Prime address. Curated tenants. Flexible terms.',
      align: 'left',
      media: { type: 'image', overlay: 0.45 },
    },
    {
      _type: 'splitHeroBlock',
      _key: k(),
      eyebrow: 'Overview',
      heading: 'About this property',
      body: 'Replace with a description of the building, location merits, and target use cases.',
      mediaSide: 'left',
      variant: 'light',
    },
    {
      _type: 'statsBlock',
      _key: k(),
      heading: 'Specifications',
      items: [
        { value: '12,500', label: 'GLA (sqm)' },
        { value: '24', label: 'Floors' },
        { value: '450', label: 'Parking bays' },
        { value: 'LEED Gold', label: 'Certification' },
      ],
    },
    {
      _type: 'galleryBlock',
      _key: k(),
      heading: 'The building',
      layout: 'grid',
      columns: 3,
      images: [],
    },
    {
      _type: 'ctaBlock',
      _key: k(),
      heading: 'Discuss leasing terms',
      subheading: 'Our team can prepare a tailored proposal within 48 hours.',
      variant: 'brand',
    },
  ],
};

const landingPage = {
  title: 'New Landing / Campaign Page',
  sections: [
    {
      _type: 'heroBlock',
      _key: k(),
      eyebrow: 'Campaign',
      heading: 'Replace with the campaign headline',
      subheading: 'A short subheading explaining the offer or season.',
      align: 'center',
      media: { type: 'image', overlay: 0.5 },
    },
    {
      _type: 'featuredListingsBlock',
      _key: k(),
      heading: 'Featured this season',
      mode: 'featured',
      limit: 6,
    },
    {
      _type: 'testimonialsBlock',
      _key: k(),
      heading: 'What our clients say',
      items: [],
    },
    {
      _type: 'ctaBlock',
      _key: k(),
      heading: 'Find your next address',
      variant: 'dark',
    },
  ],
};

const pressPage = {
  title: 'New Press / Media Page',
  sections: [
    {
      _type: 'richTextBlock',
      _key: k(),
      eyebrow: 'Press',
      heading: 'Replace with article title',
      maxWidth: 'narrow',
    },
    {
      _type: 'showcaseBlock',
      _key: k(),
      captionPosition: 'below',
      height: 'standard',
    },
    {
      _type: 'richTextBlock',
      _key: k(),
      maxWidth: 'narrow',
    },
  ],
};

/** Sanity Template list. The `id` must be unique. */
export const initialValueTemplates: Template[] = [
  {
    id: 'page-residential-project',
    title: 'Page \u2014 Residential Project',
    description:
      'Pre-built layout for a single residence: split hero, specs, gallery, showcase image, map, inquiry form.',
    schemaType: 'page',
    value: () => ({ language: 'en', ...residentialProjectPage }),
  },
  {
    id: 'page-commercial-listing',
    title: 'Page \u2014 Commercial Listing',
    description:
      'Pre-built layout for a commercial building: hero, overview, specs, gallery, leasing CTA.',
    schemaType: 'page',
    value: () => ({ language: 'en', ...commercialListingPage }),
  },
  {
    id: 'page-landing',
    title: 'Page \u2014 Landing / Campaign',
    description:
      'Hero + featured listings + testimonials + CTA. Good for seasonal campaigns.',
    schemaType: 'page',
    value: () => ({ language: 'en', ...landingPage }),
  },
  {
    id: 'page-press',
    title: 'Page \u2014 Press / Media article',
    description: 'Editorial layout: lede, full-bleed showcase image, body copy.',
    schemaType: 'page',
    value: () => ({ language: 'en', ...pressPage }),
  },
];
