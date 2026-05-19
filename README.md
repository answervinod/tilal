# Tilal

A bilingual (EN/AR, RTL-aware) headless real-estate / portfolio site built with **Next.js 14** + **Sanity v3**. The entire site is a modular page-builder editable from `/studio`. Editors get **live preview** of unpublished changes via the Presentation tool, and publishing triggers **on-demand revalidation** so the public site updates in seconds.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, RSC, ISR) |
| CMS | Sanity v3 (embedded Studio at `/studio`) |
| i18n | `next-intl` (locale prefix `/en` `/ar`, RTL-aware `<html dir>`) |
| Styling | Tailwind CSS, custom design tokens (`--brand`, `--brand-accent`) |
| Fonts | Inter (body), Cormorant Garamond (display), Tajawal (Arabic) |
| Forms | `react-hook-form` + `zod` |
| Email | Resend |
| Hosting | Vercel (recommended) |

---

## Quick start (dev)

```bash
npm install
cp .env.example .env.local      # fill in the Sanity project id, tokens, etc.
npm run dev
```

Visit:

- **Public site:** http://localhost:3000 (redirects to `/en`)
- **Studio:** http://localhost:3000/studio

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
npm start           # serve production build
```

---

## Environment variables

All variables are documented in [`.env.example`](./.env.example). Summary:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | e.g. `2024-10-01` |
| `NEXT_PUBLIC_SITE_URL` | yes | Used for sitemap, metadata, OG URLs |
| `SANITY_API_READ_TOKEN` | for live preview | Viewer-role token \u2014 lets the server fetch drafts |
| `SANITY_API_WRITE_TOKEN` | for inquiry form | Editor-role token \u2014 lets `/api/inquiry` create documents |
| `SANITY_REVALIDATE_SECRET` | for instant publish | Shared secret with the Sanity webhook |
| `RESEND_API_KEY` | for inquiry emails | Resend API key |
| `INQUIRY_TO_EMAIL` | for inquiry emails | Where new inquiries are sent |
| `INQUIRY_FROM_EMAIL` | optional | From-address (must be on a verified domain in prod) |

> The site degrades gracefully when optional vars are missing: missing write token \u2192 inquiries still 200 but aren\u2019t saved; missing email keys \u2192 no notification sent; missing read token \u2192 preview falls back to published content.

---

## Project structure

```
src/
  app/
    (site)/[locale]/                # Public site, sets <html lang dir>
      page.tsx                      # Home (CMS \u2018home\u2019 page or fallback)
      [slug]/page.tsx               # Catch-all CMS pages
      projects/page.tsx             # Projects index w/ filters + pagination
      projects/[slug]/page.tsx      # Project detail
    (studio)/studio/[[...tool]]/    # Embedded Sanity Studio
    api/
      inquiry/route.ts              # POST contact form -> Sanity + Resend
      revalidate/route.ts           # Sanity webhook -> revalidateTag
      draft-mode/enable|disable     # Live preview entry/exit
    sitemap.ts robots.ts            # Dynamic SEO files
  components/
    blocks/                         # 14 page-builder blocks
    Header.tsx Footer.tsx LocaleSwitcher.tsx
    SectionRenderer.tsx             # Maps schema._type -> block component
    ProjectCard.tsx ProjectFilters.tsx
    InquiryForm.tsx
    DraftModeIndicator.tsx
  i18n/config.ts                    # locales, dir, fonts
  lib/                              # resolveLink, format, inquirySchema, redirects
  middleware.ts                     # CMS redirects + i18n routing
sanity/
  schemas/                          # documents/* + blocks/* + fields/*
  lib/                              # client, fetch (draft-aware), queries, image
  deskStructure.ts                  # Custom Studio sidebar
  env.ts
sanity.config.ts                    # Studio config (Presentation + i18n plugins)
messages/{en,ar}.json               # UI strings
```

---

## Content workflow (for admins)

The Studio is at **`/studio`** on the deployed site. Sign in with the email the agency invited you with.

### Sidebar overview

- **\ud83c\udf10 Site Settings** \u2014 singleton: site name, description, logo, contact info, social URLs. Used by header, footer, OG metadata, and the Organization JSON-LD.
- **\ud83d\udded Navigation** \u2014 one document per language: header links, footer columns, footer note.
- **\ud83d\udcc4 Pages** \u2014 every URL on the site that isn\u2019t a Project: home, about, contact, etc. Each page is a list of **blocks**.
- **\ud83c\udfd7\ufe0f Projects** \u2014 listings shown at `/projects` and as detail pages. Set `featured: true` to surface them on the home page.
- **\ud83c\udff7\ufe0f Categories** \u2014 used to group projects (Residential, Commercial\u2026).
- **\u270d\ufe0f Posts / \ud83d\udc64 Authors** \u2014 blog content (optional).
- **\ud83d\udce9 Inquiries** \u2014 contact-form submissions land here. Update status as you process them.
- **\u2935\ufe0f Redirects** \u2014 old-URL \u2192 new-URL mappings. Picked up by middleware within 60s.

### Available page blocks

1. **Hero** \u2014 image/video background, eyebrow, heading, subheading, up to 2 CTAs
2. **Rich Text** \u2014 editorial copy (Portable Text with bold/italic/links)
3. **Gallery** \u2014 grid / carousel / masonry layouts
4. **CTA** \u2014 call-to-action banner (light / dark / brand variants)
5. **Featured Listings** \u2014 picks from manual selection, featured flag, or category
6. **Listings Grid** \u2014 full project grid with optional filters
7. **Stats** \u2014 big-number stats
8. **Testimonials** \u2014 quote cards with rating / author / photo
9. **Team** \u2014 member cards with bio + social
10. **FAQ** \u2014 collapsible question/answer pairs
11. **Logo Cloud** \u2014 partner/client logo grid
12. **Video** \u2014 YouTube/Vimeo URL or uploaded MP4
13. **Map** \u2014 geopoint \u2192 OpenStreetMap embed, or custom embed URL
14. **Contact** \u2014 contact details + map + inquiry form

Blocks can be reordered, duplicated, or removed in the Page editor. Editors can build entirely new pages without involving a developer.

### Bilingual content

For translatable types (Page, Project, Post, Category, Navigation), open a document and use the **Translate** menu (top-right) to create or jump between language variants. Each translation is a separate document linked by the `documentInternationalization` plugin.

### Live preview

In the Studio sidebar, switch to **\ud83d\udcfa Presentation**. The site renders inside an iframe alongside the document editor, showing your unpublished changes in real time. Click anywhere on the page to jump into the document that produced that section.

> **Requires** `SANITY_API_READ_TOKEN` to be set in the deployment env.

### Publishing

Click **Publish** in the document footer. If the production webhook is configured, the public site updates within ~1 second.

---

## Production setup checklist

1. **Hosting** \u2014 deploy to Vercel (Next.js 14 + App Router supported out of the box).
2. **Env vars** \u2014 set everything from the table above in the Vercel project. Both `NEXT_PUBLIC_SITE_URL` and the new `SANITY_STUDIO_PREVIEW_URL` (if different) point at the public site.
3. **Sanity CORS** \u2014 in https://sanity.io/manage \u2192 API \u2192 CORS origins, add your production URL **with credentials enabled** (required for live preview).
4. **Sanity webhook** \u2014 API \u2192 Webhooks \u2192 Create:
   - URL: `https://your-site.com/api/revalidate`
   - Trigger: Create, Update, Delete
   - Filter: `_type in ["page","project","post","siteSettings","navigation","redirect","category","author"]`
   - Projection: `{ _type, _id, "slug": slug.current, language }`
   - Secret: must equal `SANITY_REVALIDATE_SECRET`
5. **Resend** (optional) \u2014 verify the sending domain, then point `INQUIRY_FROM_EMAIL` at a verified address.
6. **Search Console** \u2014 submit `https://your-site.com/sitemap.xml`.

---

## API routes reference

| Route | Method | What it does |
|---|---|---|
| `/api/inquiry` | POST | Validates form, creates `inquiry` document in Sanity, emails admin via Resend |
| `/api/revalidate` | POST | Sanity webhook \u2014 HMAC-validated, calls `revalidateTag()` for the changed doc |
| `/api/draft-mode/enable` | GET | Validates Presentation\u2019s one-time secret, enables Next Draft Mode |
| `/api/draft-mode/disable` | GET | Disables Draft Mode and redirects back |
| `/sitemap.xml` | GET | Dynamic sitemap with hreflang per locale |
| `/robots.txt` | GET | Robots with sitemap reference |

---

## License

Proprietary \u2014 \u00a9 Tilal. All rights reserved.
