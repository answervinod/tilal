import type { Locale } from '@/i18n/config';
import type { PageSection } from '../../sanity/lib/types';
import { Hero, type HeroData } from './blocks/Hero';
import { SplitHero, type SplitHeroData } from './blocks/SplitHero';
import { Showcase, type ShowcaseData } from './blocks/Showcase';
import { RichText, type RichTextData } from './blocks/RichText';
import { Gallery, type GalleryData } from './blocks/Gallery';
import { BeforeAfter, type BeforeAfterData } from './blocks/BeforeAfter';
import { CTA, type CTAData } from './blocks/CTA';
import {
  FeaturedListings,
  type FeaturedListingsData,
} from './blocks/FeaturedListings';
import { ListingsGrid, type ListingsGridData } from './blocks/ListingsGrid';
import { Stats, type StatsData } from './blocks/Stats';
import { Testimonials, type TestimonialsData } from './blocks/Testimonials';
import { Team, type TeamData } from './blocks/Team';
import { FAQ, type FAQData } from './blocks/FAQ';
import { LogoCloud, type LogoCloudData } from './blocks/LogoCloud';
import { Video, type VideoData } from './blocks/Video';
import { MapBlock, type MapBlockData } from './blocks/MapBlock';
import { Contact, type ContactData } from './blocks/Contact';
import { BrandIntro, type BrandIntroData } from './BrandIntro';
import { HighlightsGrid, type HighlightsGridData } from './HighlightsGrid';
import { ProjectsShowcase, type ProjectsShowcaseData } from './ProjectsShowcase';
import { LifestyleSection, type LifestyleSectionData } from './LifestyleSection';
import { AmenitiesPreview, type AmenitiesPreviewData } from './AmenitiesPreview';
import { InvestmentTeaser, type InvestmentTeaserData } from './InvestmentTeaser';
import { FullCTA, type FullCTAData } from './FullCTA';

interface Props {
  sections: PageSection[];
  locale: Locale;
  wrapInMain?: boolean;
}

/**
 * Switches on `section._type` and renders the matching block component.
 * Unknown types render a small dev placeholder so editors can see something.
 */
export function SectionRenderer({ sections, locale, wrapInMain = true }: Props) {
  if (!sections?.length) return null;

  const content = (
    <>
      {sections.map((section) => {
        const key = section._key;
        switch (section._type) {
          case 'heroBlock':
            return <Hero key={key} data={section as unknown as HeroData} locale={locale} />;
          case 'splitHeroBlock':
            return (
              <SplitHero
                key={key}
                data={section as unknown as SplitHeroData}
                locale={locale}
              />
            );
          case 'showcaseBlock':
            return (
              <Showcase
                key={key}
                data={section as unknown as ShowcaseData}
                locale={locale}
              />
            );
          case 'richTextBlock':
            return <RichText key={key} data={section as unknown as RichTextData} />;
          case 'galleryBlock':
            return <Gallery key={key} data={section as unknown as GalleryData} />;
          case 'beforeAfterBlock':
            return (
              <BeforeAfter key={key} data={section as unknown as BeforeAfterData} />
            );
          case 'ctaBlock':
            return <CTA key={key} data={section as unknown as CTAData} locale={locale} />;
          case 'featuredListingsBlock':
            return (
              <FeaturedListings
                key={key}
                data={section as unknown as FeaturedListingsData}
                locale={locale}
              />
            );
          case 'listingsGridBlock':
            return (
              <ListingsGrid
                key={key}
                data={section as unknown as ListingsGridData}
                locale={locale}
              />
            );
          case 'statsBlock':
            return <Stats key={key} data={section as unknown as StatsData} />;
          case 'testimonialsBlock':
            return (
              <Testimonials key={key} data={section as unknown as TestimonialsData} />
            );
          case 'teamBlock':
            return <Team key={key} data={section as unknown as TeamData} />;
          case 'faqBlock':
            return <FAQ key={key} data={section as unknown as FAQData} />;
          case 'logoCloudBlock':
            return (
              <LogoCloud key={key} data={section as unknown as LogoCloudData} />
            );
          case 'videoBlock':
            return <Video key={key} data={section as unknown as VideoData} />;
          case 'mapBlock':
            return <MapBlock key={key} data={section as unknown as MapBlockData} />;
          case 'contactBlock':
            return (
              <Contact
                key={key}
                data={section as unknown as ContactData}
                locale={locale}
              />
            );
          case 'brandIntroBlock':
            return (
              <BrandIntro
                key={key}
                data={section as unknown as BrandIntroData}
                locale={locale}
              />
            );
          case 'highlightsBlock':
            return (
              <HighlightsGrid
                key={key}
                data={section as unknown as HighlightsGridData}
                locale={locale}
              />
            );
          case 'projectsShowcaseBlock':
            return (
              <ProjectsShowcase
                key={key}
                data={section as unknown as ProjectsShowcaseData}
                locale={locale}
              />
            );
          case 'lifestyleBlock':
            return (
              <LifestyleSection
                key={key}
                data={section as unknown as LifestyleSectionData}
                locale={locale}
              />
            );
          case 'amenitiesBlock':
            return (
              <AmenitiesPreview
                key={key}
                data={section as unknown as AmenitiesPreviewData}
                locale={locale}
              />
            );
          case 'investmentBlock':
            return (
              <InvestmentTeaser
                key={key}
                data={section as unknown as InvestmentTeaserData}
                locale={locale}
              />
            );
          case 'fullCtaBlock':
            return (
              <FullCTA
                key={key}
                data={section as unknown as FullCTAData}
                locale={locale}
              />
            );
          default:
            return (
              <section
                key={key}
                className="container py-10 border-y border-dashed border-neutral-200 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent">
                  {section._type}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Coming in a later phase.
                </p>
              </section>
            );
        }
      })}
    </>
  );

  return wrapInMain ? <main>{content}</main> : content;
}
