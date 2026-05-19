import { groq } from 'next-sanity';

/**
 * Reusable GROQ projection fragments.
 */
const imageFields = `
  ...,
  asset->{ _id, url, metadata { lqip, dimensions } }
`;

const linkFields = `
  label,
  type,
  newTab,
  href,
  "internal": internal->{
    _type,
    "slug": slug.current,
    title
  }
`;

/* ------------------------------- Singletons ------------------------------- */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    title,
    description,
    "logo": logo{ ${imageFields} },
    "favicon": favicon{ ${imageFields} },
    contactEmail,
    contactPhone,
    address,
    social,
    "defaultOgImage": defaultOgImage{ ${imageFields} }
  }
`;

/* -------------------------------- Navigation ------------------------------ */
/**
 * The document-internationalization plugin adds a `language` field on translated docs.
 * We pick the navigation document for the requested locale.
 */
export const navigationQuery = groq`
  *[_type == "navigation" && language == $locale][0] {
    title,
    "header": header[]{ ${linkFields} },
    "footerColumns": footerColumns[]{
      title,
      "links": links[]{ ${linkFields} }
    },
    footerNote
  }
`;

/* ---------------------------------- Pages --------------------------------- */

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && language == $locale][0] {
    _id,
    title,
    "slug": slug.current,
    seo,
    sections[]{
      ...,
      _type == "ctaBlock" => { ..., "buttons": buttons[]{ ${linkFields} }, "background": background{ ${imageFields} } },
      _type == "heroBlock" => { ..., "ctas": ctas[]{ ${linkFields} }, "media": media{ ..., "image": image{ ${imageFields} } } },
      _type == "galleryBlock" => { ..., "images": images[]{ ${imageFields} } },
      _type == "logoCloudBlock" => { ..., "logos": logos[]{ ${imageFields} } },
      _type == "videoBlock" => { ..., "poster": poster{ ${imageFields} } },
      _type == "featuredListingsBlock" => {
        ...,
        "cta": cta{ ${linkFields} },
        "manualListings": listings[]->{ _id, title, "slug": slug.current, location, "cover": cover{ ${imageFields} }, status, featured }
      },
      _type == "teamBlock" => {
        ...,
        "members": members[]{ ..., "photo": photo{ ${imageFields} } }
      },
      _type == "testimonialsBlock" => {
        ...,
        "items": items[]{ ..., "photo": photo{ ${imageFields} } }
      }
    }
  }
`;

/**
 * All page slugs for a given locale (used for generateStaticParams).
 */
export const allPageSlugsQuery = groq`
  *[_type == "page" && language == $locale && defined(slug.current)].slug.current
`;

/* -------------------------------- Projects -------------------------------- */

export const allProjectsQuery = groq`
  *[_type == "project" && language == $locale] | order(featured desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    location,
    status,
    featured,
    publishedAt,
    "category": category->{ title, "slug": slug.current },
    "cover": cover{ ${imageFields} },
    price,
    specs
  }
`;

/**
 * Filtered + paginated projects.
 * $category, $status \u2014 optional (null/empty string = no filter).
 * $start / $end \u2014 GROQ slice indices for pagination.
 * Returns the page slice plus a total count for the same filter.
 */
export const filteredProjectsQuery = groq`
{
  "items": *[
    _type == "project" && language == $locale
    && (!defined($category) || $category == "" || category->slug.current == $category)
    && (!defined($status) || $status == "" || status == $status)
    && (!defined($q) || $q == "" || title match $q + "*" || location match $q + "*" || tagline match $q + "*")
  ] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    tagline,
    location,
    status,
    featured,
    publishedAt,
    "category": category->{ title, "slug": slug.current },
    "cover": cover{ ${imageFields} },
    price,
    specs
  },
  "total": count(*[
    _type == "project" && language == $locale
    && (!defined($category) || $category == "" || category->slug.current == $category)
    && (!defined($status) || $status == "" || status == $status)
    && (!defined($q) || $q == "" || title match $q + "*" || location match $q + "*" || tagline match $q + "*")
  ])
}
`;

/**
 * All categories (used in filter UI). Categories are translated, so filter by locale.
 */
export const allCategoriesQuery = groq`
  *[_type == "category" && language == $locale] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

/** All project slugs for static params. */
export const allProjectSlugsQuery = groq`
  *[_type == "project" && language == $locale && defined(slug.current)].slug.current
`;

/** Featured listings (used by featuredListingsBlock auto modes). */
export const featuredProjectsQuery = groq`
  *[_type == "project" && language == $locale && featured == true]
    | order(publishedAt desc)[0...$limit] {
      _id, title, "slug": slug.current, tagline, location, status, featured,
      "category": category->{ title, "slug": slug.current },
      "cover": cover{ ${imageFields} },
      price, specs
    }
`;

export const projectsByCategoryQuery = groq`
  *[_type == "project" && language == $locale && category->slug.current == $category]
    | order(featured desc, publishedAt desc)[0...$limit] {
      _id, title, "slug": slug.current, tagline, location, status, featured,
      "category": category->{ title, "slug": slug.current },
      "cover": cover{ ${imageFields} },
      price, specs
    }
`;

/** "More like this" \u2014 same category, exclude current. */
export const relatedProjectsQuery = groq`
  *[_type == "project" && language == $locale
    && _id != $excludeId
    && (!defined($categoryId) || category._ref == $categoryId)]
    | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, location, status,
      "category": category->{ title, "slug": slug.current },
      "cover": cover{ ${imageFields} },
      price
    }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && language == $locale][0] {
    ...,
    "slug": slug.current,
    "categoryRef": category._ref,
    "category": category->{ title, "slug": slug.current },
    "cover": cover{ ${imageFields} },
    "gallery": gallery[]{ ${imageFields} },
    "floorplans": floorplans[]{ ${imageFields} },
    seo
  }
`;

/* -------------------------------- Redirects ------------------------------- */

export const allRedirectsQuery = groq`
  *[_type == "redirect"]{ from, to, permanent }
`;
