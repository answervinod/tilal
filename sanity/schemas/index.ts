import type { SchemaTypeDefinition } from 'sanity';

// Documents
import { siteSettings } from './documents/siteSettings';
import { page } from './documents/page';
import { project } from './documents/project';
import { category } from './documents/category';
import { post } from './documents/post';
import { author } from './documents/author';
import { navigation } from './documents/navigation';
import { inquiry } from './documents/inquiry';
import { redirect } from './documents/redirect';

// Shared objects
import { seo } from './objects/seo';
import { link } from './objects/link';

// Block objects (page-builder)
import { heroBlock } from './objects/blocks/heroBlock';
import { splitHeroBlock } from './objects/blocks/splitHeroBlock';
import { showcaseBlock } from './objects/blocks/showcaseBlock';
import { richTextBlock } from './objects/blocks/richTextBlock';
import { galleryBlock } from './objects/blocks/galleryBlock';
import { beforeAfterBlock } from './objects/blocks/beforeAfterBlock';
import { ctaBlock } from './objects/blocks/ctaBlock';
import { featuredListingsBlock } from './objects/blocks/featuredListingsBlock';
import { listingsGridBlock } from './objects/blocks/listingsGridBlock';
import { statsBlock } from './objects/blocks/statsBlock';
import { testimonialsBlock } from './objects/blocks/testimonialsBlock';
import { teamBlock } from './objects/blocks/teamBlock';
import { faqBlock } from './objects/blocks/faqBlock';
import { contactBlock } from './objects/blocks/contactBlock';
import { logoCloudBlock } from './objects/blocks/logoCloudBlock';
import { videoBlock } from './objects/blocks/videoBlock';
import { mapBlock } from './objects/blocks/mapBlock';
import { brandIntroBlock } from './objects/blocks/brandIntroBlock';
import { highlightsBlock } from './objects/blocks/highlightsBlock';
import { projectsShowcaseBlock } from './objects/blocks/projectsShowcaseBlock';
import { lifestyleBlock } from './objects/blocks/lifestyleBlock';
import { amenitiesBlock } from './objects/blocks/amenitiesBlock';
import { investmentBlock } from './objects/blocks/investmentBlock';
import { fullCtaBlock } from './objects/blocks/fullCtaBlock';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  navigation,
  page,
  project,
  category,
  post,
  author,
  inquiry,
  redirect,
  // Shared objects
  seo,
  link,
  // Blocks
  heroBlock,
  splitHeroBlock,
  showcaseBlock,
  richTextBlock,
  galleryBlock,
  beforeAfterBlock,
  ctaBlock,
  featuredListingsBlock,
  listingsGridBlock,
  statsBlock,
  testimonialsBlock,
  teamBlock,
  faqBlock,
  contactBlock,
  logoCloudBlock,
  videoBlock,
  mapBlock,
  brandIntroBlock,
  highlightsBlock,
  projectsShowcaseBlock,
  lifestyleBlock,
  amenitiesBlock,
  investmentBlock,
  fullCtaBlock,
];
