/**
 * Seed script: populate Sanity with the updated Tilal page structure.
 *
 * Prerequisites:
 *   SANITY_API_WRITE_TOKEN must be set in .env.local (Editor role token from sanity.io/manage).
 *
 * Usage:
 *   node scripts/seed-pages.mjs
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || !WRITE_TOKEN) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

function makeKey() {
  return Math.random().toString(36).substring(2, 9);
}

/* ------------------------------------------------------------------ */
/* 1. HOME PAGE (English)                                              */
/* ------------------------------------------------------------------ */
const homePageEn = {
  _type: 'page',
  _id: 'page-home-en',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  sections: [
    /* Hero */
    {
      _type: 'heroBlock',
      _key: makeKey(),
      eyebrow: 'Tilal Real Estate',
      heading: 'Where Architecture Meets Investment Excellence',
      subheading:
        "Discover curated luxury living through Tilal's visionary communities — designed for elevated lifestyles and high-value returns.",
      media: {
        type: 'image',
        overlay: 0.4,
      },
      ctas: [
        { label: 'Explore Projects', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-en' }, newTab: false },
        { label: 'Book a Tour', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-en' }, newTab: false },
      ],
    },
    /* Brand Intro */
    {
      _type: 'brandIntroBlock',
      _key: makeKey(),
      eyebrow: 'The Brand',
      heading: 'Tilal represents a new benchmark in modern real estate',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: "Where design, nature, and investment converge. Strategically located in Dubai's fastest-growing corridor, Tilal developments redefine residential living through architectural precision, integrated amenities, and long-term value creation.",
              marks: [],
            },
          ],
        },
      ],
      imagePosition: 'right',
    },
    /* Highlights */
    {
      _type: 'highlightsBlock',
      _key: makeKey(),
      eyebrow: 'Why Tilal',
      heading: 'Designed for elevated lifestyles',
      items: [
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'Prime Location',
          title: 'Strategic Positioning',
          description:
            'Positioned within Dubai Academic City with seamless access to Downtown, DXB Airport, and key economic hubs.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'Nature-Driven Design',
          title: 'Master-Planned Landscapes',
          description:
            'Green landscapes, water bodies, and open-air experiences designed to harmonize with nature.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'Luxury Living',
          title: 'Modern Elite Residences',
          description:
            'Villas, mansions, and bespoke residences designed for those who demand the extraordinary.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'Investment Value',
          title: 'Strong Appreciation',
          description:
            'Backed by strategic urban expansion and high-demand location fundamentals.',
        },
      ],
    },
    /* Projects Showcase */
    {
      _type: 'projectsShowcaseBlock',
      _key: makeKey(),
      eyebrow: 'Signature Developments',
      heading: 'Thoughtfully designed communities',
      description:
        'Explore a portfolio of residential clusters, each offering a unique lifestyle experience.',
      projects: [],
    },
    /* Lifestyle */
    {
      _type: 'lifestyleBlock',
      _key: makeKey(),
      eyebrow: 'Lifestyle',
      heading: 'A Life Beyond Living',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: 'Tilal communities are designed as immersive environments — where wellness, leisure, and social interaction come together seamlessly. From swimmable lagoons to cycling tracks and private clubhouses, every detail enhances everyday living.',
              marks: [],
            },
          ],
        },
      ],
      listItems: [
        'Swimmable lagoons & private beaches',
        'Cycling tracks & jogging paths',
        'Private clubhouses & social hubs',
        'Landscaped gardens & parks',
        'Wellness & yoga spaces',
      ],
      imagePosition: 'left',
    },
    /* Amenities */
    {
      _type: 'amenitiesBlock',
      _key: makeKey(),
      eyebrow: 'World-Class Amenities',
      heading: 'Designed to elevate every aspect of daily life',
      items: [
        { _type: 'amenity', _key: makeKey(), title: 'The Clubhouse', subtitle: 'Premium social hub' },
        { _type: 'amenity', _key: makeKey(), title: 'The Sunken Pearl', subtitle: 'Artificial beachfront' },
        { _type: 'amenity', _key: makeKey(), title: 'Aira Realm', subtitle: 'Central park & gardens' },
        { _type: 'amenity', _key: makeKey(), title: 'Momentum Loop', subtitle: 'Cycling & jogging track' },
        { _type: 'amenity', _key: makeKey(), title: 'The Farmhouse', subtitle: 'Community gathering' },
        { _type: 'amenity', _key: makeKey(), title: 'Swimmable Lakes', subtitle: 'Crystal-clear lagoons' },
      ],
    },
    /* Investment */
    {
      _type: 'investmentBlock',
      _key: makeKey(),
      eyebrow: 'Investment',
      heading: 'Smart Investment Opportunities',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: "Tilal developments are designed not just for living — but for wealth creation. With Dubai's expanding infrastructure and increasing demand for premium housing, Tilal offers strong capital appreciation and rental yield potential.",
              marks: [],
            },
          ],
        },
      ],
      listItems: [
        'High-demand location with limited luxury inventory',
        'Strong resale value potential',
        'Strategic urban expansion backing growth',
      ],
      stats: [
        { _type: 'stat', _key: makeKey(), value: 'AED 4.2M+', label: 'Starting Price' },
        { _type: 'stat', _key: makeKey(), value: '25%', label: 'Projected Annual ROI' },
        { _type: 'stat', _key: makeKey(), value: '98%', label: 'Client Satisfaction' },
        { _type: 'stat', _key: makeKey(), value: '5', label: 'Signature Developments' },
      ],
      ctas: [
        { label: 'Speak to an Advisor', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-en' }, newTab: false },
      ],
    },
    /* Full CTA */
    {
      _type: 'fullCtaBlock',
      _key: makeKey(),
      label: 'Begin Your Journey',
      heading: 'Experience Tilal. Book your private tour today.',
      body: 'Discover a property experience designed for those who accept nothing less than extraordinary. Our team is ready to assist you in finding your dream residence.',
      buttons: [
        { label: 'Book a Private Viewing', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-en' }, newTab: false },
        { label: 'Explore Projects', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-en' }, newTab: false },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 2. HOME PAGE (Arabic)                                               */
/* ------------------------------------------------------------------ */
const homePageAr = {
  _type: 'page',
  _id: 'page-home-ar',
  title: 'الرئيسية',
  slug: { _type: 'slug', current: 'home' },
  sections: [
    {
      _type: 'heroBlock',
      _key: makeKey(),
      eyebrow: 'تيلال العقارية',
      heading: 'حيث يلتقي التصميم والاستثمار والتميز',
      subheading:
        'اكتشف الحياة الفاخرة المنسقة من خلال مجتمعات تيلال الرائدة — مصممة لأنماط حياة راقية وعوائد استثمارية عالية.',
      media: { type: 'image', overlay: 0.4 },
      ctas: [
        { label: 'استكشف المشاريع', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-ar' }, newTab: false },
        { label: 'احجز جولة', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-ar' }, newTab: false },
      ],
    },
    {
      _type: 'brandIntroBlock',
      _key: makeKey(),
      eyebrow: 'العلامة التجارية',
      heading: 'تيلال تمثل معياراً جديداً في العقارات العصرية',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: 'حيث يلتقي التصميم والطبيعة والاستثمار. تقع تيلال بشكل استراتيجي في أسرع ممرات نمو في دبي، وتعيد تعريف الحياة السكنية من خلال الدقة المعمارية والمرافق المتكاملة وخلق القيمة طويلة المدى.',
              marks: [],
            },
          ],
        },
      ],
      imagePosition: 'right',
    },
    {
      _type: 'highlightsBlock',
      _key: makeKey(),
      eyebrow: 'لماذا تيلال',
      heading: 'مصممة لأنماط الحياة الراقية',
      items: [
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'موقع متميز',
          title: 'تموضع استراتيجي',
          description: 'تقع ضمن مدينة دبي الأكاديمية مع وصول سلس إلى وسط المدينة ومطار دبي الدولي والمراكز الاقتصادية الرئيسية.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'تصميم محفوف بالطبيعة',
          title: 'مناظر طبيعية مخططة بإتقان',
          description: 'مناظر طبيعية خضراء ومسطحات مائية وتجارب في الهواء الطلق مصممة لتناغم مع الطبيعة.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'حياة فاخرة',
          title: 'مساكن نخبة عصرية',
          description: 'فلل وقصور ومساكن مخصصة مصممة لأولئك الذين يطالبون بما هو استثنائي.',
        },
        {
          _type: 'highlight',
          _key: makeKey(),
          label: 'قيمة استثمارية',
          title: 'تقدير قوي',
          description: 'مدعومة بالتوسع الحضري الاستراتيجي وأسس موقع عالي الطلب.',
        },
      ],
    },
    {
      _type: 'projectsShowcaseBlock',
      _key: makeKey(),
      eyebrow: 'تطويرات مميزة',
      heading: 'مجتمعات مصممة بعناية',
      description: 'استكشف مجموعة من المجمعات السكنية، كل منها يقدم تجربة حياة فريدة.',
      projects: [],
    },
    {
      _type: 'lifestyleBlock',
      _key: makeKey(),
      eyebrow: 'أسلوب الحياة',
      heading: 'حياة تتجاوز المعيشة',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: 'تم تصميم مجتمعات تيلال كبيئات غامرة — حيث تندمج الصحة والترفيه والتفاعل الاجتماعي بسلاسة. من البحيرات القابلة للسباحة إلى مسارات الدراجات والنوادي الخاصة، كل تفصيل يعزز الحياة اليومية.',
              marks: [],
            },
          ],
        },
      ],
      listItems: [
        'بحيرات قابلة للسباحة وشواطئ خاصة',
        'مسارات دراجات ومسارات للجري',
        'نوادي خاصة ومراكز اجتماعية',
        'حدائق منسقة ومنتزهات',
        'مساحات صحية ويوغا',
      ],
      imagePosition: 'left',
    },
    {
      _type: 'amenitiesBlock',
      _key: makeKey(),
      eyebrow: 'مرافق عالمية المستوى',
      heading: 'مصممة لرفع كل جانب من جوانب الحياة اليومية',
      items: [
        { _type: 'amenity', _key: makeKey(), title: 'النادي', subtitle: 'مركز اجتماعي راقٍ' },
        { _type: 'amenity', _key: makeKey(), title: 'اللؤلؤة الغارقة', subtitle: 'واجهة شاطئية اصطناعية' },
        { _type: 'amenity', _key: makeKey(), title: 'عالم آيرا', subtitle: 'حديقة مركزية ومنتزهات' },
        { _type: 'amenity', _key: makeKey(), title: 'حلقة الزخم', subtitle: 'مسار للدراجات والجري' },
        { _type: 'amenity', _key: makeKey(), title: 'بيت المزرعة', subtitle: 'تجمع مجتمعي' },
        { _type: 'amenity', _key: makeKey(), title: 'بحيرات قابلة للسباحة', subtitle: 'بحيرات صافية كالبلور' },
      ],
    },
    {
      _type: 'investmentBlock',
      _key: makeKey(),
      eyebrow: 'استثمار',
      heading: 'فرص استثمارية ذكية',
      body: [
        {
          _type: 'block',
          _key: makeKey(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: makeKey(),
              text: 'تم تصميم تطويرات تيلال ليس فقط للمعيشة — بل لخلق الثروة. مع التوسع المتزايد في البنية التحتية في دبي والطلب المتزايد على المساكن الفاخرة، تقدم تيلال إمكانيات قوية لتقدير رأس المال وعوائد الإيجار.',
              marks: [],
            },
          ],
        },
      ],
      listItems: [
        'موقع عالي الطلب بمخزون محدود من الفخامة',
        'إمكانية قوية لإعادة البيع',
        'توسع حضري استراتيجي يدعم النمو',
      ],
      stats: [
        { _type: 'stat', _key: makeKey(), value: 'AED 4.2M+', label: 'السعر الابتدائي' },
        { _type: 'stat', _key: makeKey(), value: '25%', label: 'عائد استثمار سنوي متوقع' },
        { _type: 'stat', _key: makeKey(), value: '98%', label: 'رضا العملاء' },
        { _type: 'stat', _key: makeKey(), value: '5', label: 'تطويرات مميزة' },
      ],
      ctas: [
        { label: 'تحدث إلى مستشار', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-ar' }, newTab: false },
      ],
    },
    {
      _type: 'fullCtaBlock',
      _key: makeKey(),
      label: 'ابدأ رحلتك',
      heading: 'جرب تيلال. احجز جولتك الخاصة اليوم.',
      body: 'اكتشف تجربة عقارية مصممة لأولئك الذين لا يقبلون بأقل من الاستثنائي. فريقنا مستعد لمساعدتك في العثور على مسكن أحلامك.',
      buttons: [
        { label: 'احجز جولة خاصة', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-ar' }, newTab: false },
        { label: 'استكشف المشاريع', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-ar' }, newTab: false },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. HELPER: simple inner pages (About, Contact, Amenities, etc.)     */
/* ------------------------------------------------------------------ */
function makeSimplePage({ id, title, slug, locale }) {
  return {
    _type: 'page',
    _id: id,
    title,
    slug: { _type: 'slug', current: slug },
    sections: [],
  };
}

const innerPages = [
  makeSimplePage({ id: 'page-about-en', title: 'About', slug: 'about', locale: 'en' }),
  makeSimplePage({ id: 'page-contact-en', title: 'Contact', slug: 'contact', locale: 'en' }),
  makeSimplePage({ id: 'page-amenities-en', title: 'Amenities', slug: 'amenities', locale: 'en' }),
  makeSimplePage({ id: 'page-investment-en', title: 'Investment', slug: 'investment', locale: 'en' }),
  makeSimplePage({ id: 'page-materials-en', title: 'Materials & Design', slug: 'materials', locale: 'en' }),
  makeSimplePage({ id: 'page-projects-en', title: 'Projects', slug: 'projects', locale: 'en' }),
  makeSimplePage({ id: 'page-about-ar', title: 'من نحن', slug: 'about', locale: 'ar' }),
  makeSimplePage({ id: 'page-contact-ar', title: 'اتصل بنا', slug: 'contact', locale: 'ar' }),
  makeSimplePage({ id: 'page-amenities-ar', title: 'المرافق', slug: 'amenities', locale: 'ar' }),
  makeSimplePage({ id: 'page-investment-ar', title: 'الاستثمار', slug: 'investment', locale: 'ar' }),
  makeSimplePage({ id: 'page-materials-ar', title: 'المواد والتصميم', slug: 'materials', locale: 'ar' }),
  makeSimplePage({ id: 'page-projects-ar', title: 'المشاريع', slug: 'projects', locale: 'ar' }),
];

/* ------------------------------------------------------------------ */
/* 4. UPSERT                                                           */
/* ------------------------------------------------------------------ */
async function upsert(doc) {
  try {
    const existing = await client.getDocument(doc._id);
    if (existing) {
      await client
        .patch(doc._id)
        .set({
          title: doc.title,
          slug: doc.slug,
          sections: doc.sections,
        })
        .commit({ visibility: 'async' });
      console.log(`Updated: ${doc._id}`);
    } else {
      await client.create(doc);
      console.log(`Created: ${doc._id}`);
    }
  } catch (err) {
    console.error(`Failed ${doc._id}:`, err.message);
  }
}

(async () => {
  console.log(`Seeding Sanity (${PROJECT_ID}/${DATASET})...\n`);

  for (const doc of innerPages) {
    await upsert(doc);
  }

  await upsert(homePageEn);
  await upsert(homePageAr);

  console.log('\nDone. Open Sanity Studio to review and add images.');
})();
