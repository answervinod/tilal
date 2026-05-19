/**
 * Nuclear reset: delete navigation + all pages, then recreate everything cleanly.
 * Fixes the document-internationalization slug conflict by starting fresh.
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
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN');
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

async function deleteDocs(type) {
  const ids = await client.fetch(`array::compact(*[_type == "${type}"]._id)`);
  if (!ids.length) return;
  console.log(`Deleting ${ids.length} ${type} docs...`);
  const trx = client.transaction();
  for (const id of ids) trx.delete(id);
  try {
    await trx.commit();
    console.log(`Deleted ${type}.`);
  } catch (err) {
    console.error(`Failed deleting ${type}:`, err.message);
  }
}

function makeHomePage({ id, title, slug, locale }) {
  const isAr = locale === 'ar';
  return {
    _type: 'page',
    _id: id,
    language: locale,
    title,
    slug: { _type: 'slug', current: slug },
    sections: [
      {
        _type: 'heroBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'تيلال العقارية' : 'Tilal Real Estate',
        heading: isAr
          ? 'حيث يلتقي التصميم والاستثمار والتميز'
          : 'Where Architecture Meets Investment Excellence',
        subheading: isAr
          ? 'اكتشف الحياة الفاخرة المنسقة من خلال مجتمعات تيلال الرائدة — مصممة لأنماط حياة راقية وعوائد استثمارية عالية.'
          : "Discover curated luxury living through Tilal's visionary communities — designed for elevated lifestyles and high-value returns.",
        media: { type: 'image', overlay: 0.4 },
        ctas: [
          { label: isAr ? 'استكشف المشاريع' : 'Explore Projects', type: 'internal', internal: { _type: 'reference', _ref: isAr ? 'page-projects-ar' : 'page-projects-en' }, newTab: false },
          { label: isAr ? 'احجز جولة' : 'Book a Tour', type: 'internal', internal: { _type: 'reference', _ref: isAr ? 'page-contact-ar' : 'page-contact-en' }, newTab: false },
        ],
      },
      {
        _type: 'brandIntroBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'العلامة التجارية' : 'The Brand',
        heading: isAr
          ? 'تيلال تمثل معياراً جديداً في العقارات العصرية'
          : 'Tilal represents a new benchmark in modern real estate',
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
                text: isAr
                  ? 'حيث يلتقي التصميم والطبيعة والاستثمار. تقع تيلال بشكل استراتيجي في أسرع ممرات نمو في دبي، وتعيد تعريف الحياة السكنية من خلال الدقة المعمارية والمرافق المتكاملة وخلق القيمة طويلة المدى.'
                  : "Where design, nature, and investment converge. Strategically located in Dubai's fastest-growing corridor, Tilal developments redefine residential living through architectural precision, integrated amenities, and long-term value creation.",
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
        eyebrow: isAr ? 'لماذا تيلال' : 'Why Tilal',
        heading: isAr ? 'مصممة لأنماط الحياة الراقية' : 'Designed for elevated lifestyles',
        items: [
          {
            _type: 'highlight',
            _key: makeKey(),
            label: isAr ? 'موقع متميز' : 'Prime Location',
            title: isAr ? 'تموضع استراتيجي' : 'Strategic Positioning',
            description: isAr
              ? 'تقع ضمن مدينة دبي الأكاديمية مع وصول سلس إلى وسط المدينة ومطار دبي الدولي والمراكز الاقتصادية الرئيسية.'
              : 'Positioned within Dubai Academic City with seamless access to Downtown, DXB Airport, and key economic hubs.',
          },
          {
            _type: 'highlight',
            _key: makeKey(),
            label: isAr ? 'تصميم محفوف بالطبيعة' : 'Nature-Driven Design',
            title: isAr ? 'مناظر طبيعية مخططة بإتقان' : 'Master-Planned Landscapes',
            description: isAr
              ? 'مناظر طبيعية خضراء ومسطحات مائية وتجارب في الهواء الطلق مصممة لتناغم مع الطبيعة.'
              : 'Green landscapes, water bodies, and open-air experiences designed to harmonize with nature.',
          },
          {
            _type: 'highlight',
            _key: makeKey(),
            label: isAr ? 'حياة فاخرة' : 'Luxury Living',
            title: isAr ? 'مساكن نخبة عصرية' : 'Modern Elite Residences',
            description: isAr
              ? 'فلل وقصور ومساكن مخصصة مصممة لأولئك الذين يطالبون بما هو استثنائي.'
              : 'Villas, mansions, and bespoke residences designed for those who demand the extraordinary.',
          },
          {
            _type: 'highlight',
            _key: makeKey(),
            label: isAr ? 'قيمة استثمارية' : 'Investment Value',
            title: isAr ? 'تقدير قوي' : 'Strong Appreciation',
            description: isAr
              ? 'مدعومة بالتوسع الحضري الاستراتيجي وأسس موقع عالي الطلب.'
              : 'Backed by strategic urban expansion and high-demand location fundamentals.',
          },
        ],
      },
      {
        _type: 'projectsShowcaseBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'تطويرات مميزة' : 'Signature Developments',
        heading: isAr ? 'مجتمعات مصممة بعناية' : 'Thoughtfully designed communities',
        description: isAr
          ? 'استكشف مجموعة من المجمعات السكنية، كل منها يقدم تجربة حياة فريدة.'
          : 'Explore a portfolio of residential clusters, each offering a unique lifestyle experience.',
        projects: [],
      },
      {
        _type: 'lifestyleBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'أسلوب الحياة' : 'Lifestyle',
        heading: isAr ? 'حياة تتجاوز المعيشة' : 'A Life Beyond Living',
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
                text: isAr
                  ? 'تم تصميم مجتمعات تيلال كبيئات غامرة — حيث تندمج الصحة والترفيه والتفاعل الاجتماعي بسلاسة. من البحيرات القابلة للسباحة إلى مسارات الدراجات والنوادي الخاصة، كل تفصيل يعزز الحياة اليومية.'
                  : 'Tilal communities are designed as immersive environments — where wellness, leisure, and social interaction come together seamlessly. From swimmable lagoons to cycling tracks and private clubhouses, every detail enhances everyday living.',
                marks: [],
              },
            ],
          },
        ],
        listItems: isAr
          ? ['بحيرات قابلة للسباحة وشواطئ خاصة', 'مسارات دراجات ومسارات للجري', 'نوادي خاصة ومراكز اجتماعية', 'حدائق منسقة ومنتزهات', 'مساحات صحية ويوغا']
          : ['Swimmable lagoons & private beaches', 'Cycling tracks & jogging paths', 'Private clubhouses & social hubs', 'Landscaped gardens & parks', 'Wellness & yoga spaces'],
        imagePosition: 'left',
      },
      {
        _type: 'amenitiesBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'مرافق عالمية المستوى' : 'World-Class Amenities',
        heading: isAr ? 'مصممة لرفع كل جانب من جوانب الحياة اليومية' : 'Designed to elevate every aspect of daily life',
        items: [
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'النادي' : 'The Clubhouse', subtitle: isAr ? 'مركز اجتماعي راقٍ' : 'Premium social hub' },
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'اللؤلؤة الغارقة' : 'The Sunken Pearl', subtitle: isAr ? 'واجهة شاطئية اصطناعية' : 'Artificial beachfront' },
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'عالم آيرا' : 'Aira Realm', subtitle: isAr ? 'حديقة مركزية ومنتزهات' : 'Central park & gardens' },
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'حلقة الزخم' : 'Momentum Loop', subtitle: isAr ? 'مسار للدراجات والجري' : 'Cycling & jogging track' },
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'بيت المزرعة' : 'The Farmhouse', subtitle: isAr ? 'تجمع مجتمعي' : 'Community gathering' },
          { _type: 'amenity', _key: makeKey(), title: isAr ? 'بحيرات قابلة للسباحة' : 'Swimmable Lakes', subtitle: isAr ? 'بحيرات صافية كالبلور' : 'Crystal-clear lagoons' },
        ],
      },
      {
        _type: 'investmentBlock',
        _key: makeKey(),
        eyebrow: isAr ? 'استثمار' : 'Investment',
        heading: isAr ? 'فرص استثمارية ذكية' : 'Smart Investment Opportunities',
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
                text: isAr
                  ? 'تم تصميم تطويرات تيلال ليس فقط للمعيشة — بل لخلق الثروة. مع التوسع المتزايد في البنية التحتية في دبي والطلب المتزايد على المساكن الفاخرة، تقدم تيلال إمكانيات قوية لتقدير رأس المال وعوائد الإيجار.'
                  : "Tilal developments are designed not just for living — but for wealth creation. With Dubai's expanding infrastructure and increasing demand for premium housing, Tilal offers strong capital appreciation and rental yield potential.",
                marks: [],
              },
            ],
          },
        ],
        listItems: isAr
          ? ['موقع عالي الطلب بمخزون محدود من الفخامة', 'إمكانية قوية لإعادة البيع', 'توسع حضري استراتيجي يدعم النمو']
          : ['High-demand location with limited luxury inventory', 'Strong resale value potential', 'Strategic urban expansion backing growth'],
        stats: [
          { _type: 'stat', _key: makeKey(), value: 'AED 4.2M+', label: isAr ? 'السعر الابتدائي' : 'Starting Price' },
          { _type: 'stat', _key: makeKey(), value: '25%', label: isAr ? 'عائد استثمار سنوي متوقع' : 'Projected Annual ROI' },
          { _type: 'stat', _key: makeKey(), value: '98%', label: isAr ? 'رضا العملاء' : 'Client Satisfaction' },
          { _type: 'stat', _key: makeKey(), value: '5', label: isAr ? 'تطويرات مميزة' : 'Signature Developments' },
        ],
        ctas: [
          { label: isAr ? 'تحدث إلى مستشار' : 'Speak to an Advisor', type: 'internal', internal: { _type: 'reference', _ref: isAr ? 'page-contact-ar' : 'page-contact-en' }, newTab: false },
        ],
      },
      {
        _type: 'fullCtaBlock',
        _key: makeKey(),
        label: isAr ? 'ابدأ رحلتك' : 'Begin Your Journey',
        heading: isAr ? 'جرب تيلال. احجز جولتك الخاصة اليوم.' : 'Experience Tilal. Book your private tour today.',
        body: isAr
          ? 'اكتشف تجربة عقارية مصممة لأولئك الذين لا يقبلون بأقل من الاستثنائي. فريقنا مستعد لمساعدتك في العثور على مسكن أحلامك.'
          : 'Discover a property experience designed for those who accept nothing less than extraordinary. Our team is ready to assist you in finding your dream residence.',
        buttons: [
          { label: isAr ? 'احجز جولة خاصة' : 'Book a Private Viewing', type: 'internal', internal: { _type: 'reference', _ref: isAr ? 'page-contact-ar' : 'page-contact-en' }, newTab: false },
          { label: isAr ? 'استكشف المشاريع' : 'Explore Projects', type: 'internal', internal: { _type: 'reference', _ref: isAr ? 'page-projects-ar' : 'page-projects-en' }, newTab: false },
        ],
      },
    ],
  };
}

function makeSimplePage({ id, title, slug, locale }) {
  return {
    _type: 'page',
    _id: id,
    language: locale,
    title,
    slug: { _type: 'slug', current: slug },
    sections: [],
  };
}

function makeNavigation({ id, locale, headerItems }) {
  return {
    _type: 'navigation',
    _id: id,
    language: locale,
    title: locale === 'ar' ? 'التنقل' : 'Navigation',
    header: headerItems,
  };
}

(async () => {
  /* 1. Delete old docs that cause reference conflicts */
  await deleteDocs('navigation');
  await deleteDocs('translation.metadata');
  await deleteDocs('page');

  /* 2. Create inner pages first (so home page CTAs can reference them) */
  const simplePages = [
    { id: 'page-about-en', title: 'About', slug: 'about', locale: 'en' },
    { id: 'page-contact-en', title: 'Contact', slug: 'contact', locale: 'en' },
    { id: 'page-amenities-en', title: 'Amenities', slug: 'amenities', locale: 'en' },
    { id: 'page-investment-en', title: 'Investment', slug: 'investment', locale: 'en' },
    { id: 'page-materials-en', title: 'Materials & Design', slug: 'materials', locale: 'en' },
    { id: 'page-projects-en', title: 'Projects', slug: 'projects', locale: 'en' },
    { id: 'page-about-ar', title: 'من نحن', slug: 'about', locale: 'ar' },
    { id: 'page-contact-ar', title: 'اتصل بنا', slug: 'contact', locale: 'ar' },
    { id: 'page-amenities-ar', title: 'المرافق', slug: 'amenities', locale: 'ar' },
    { id: 'page-investment-ar', title: 'الاستثمار', slug: 'investment', locale: 'ar' },
    { id: 'page-materials-ar', title: 'المواد والتصميم', slug: 'materials', locale: 'ar' },
    { id: 'page-projects-ar', title: 'المشاريع', slug: 'projects', locale: 'ar' },
  ];

  for (const p of simplePages) {
    await client.create(makeSimplePage(p));
    console.log(`Created: ${p.id}`);
  }

  /* 3. Create home pages */
  await client.create(makeHomePage({ id: 'page-home-en', title: 'Home', slug: 'home', locale: 'en' }));
  console.log('Created: page-home-en');
  await client.create(makeHomePage({ id: 'page-home-ar', title: 'الرئيسية', slug: 'home', locale: 'ar' }));
  console.log('Created: page-home-ar');

  /* 4. Recreate navigation docs */
  const navEn = makeNavigation({
    id: 'navigation-en',
    locale: 'en',
    headerItems: [
      { label: 'Developments', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-en' } },
      { label: 'About', type: 'internal', internal: { _type: 'reference', _ref: 'page-about-en' } },
      { label: 'Contact', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-en' } },
    ],
  });
  const navAr = makeNavigation({
    id: 'navigation-ar',
    locale: 'ar',
    headerItems: [
      { label: 'المشاريع', type: 'internal', internal: { _type: 'reference', _ref: 'page-projects-ar' } },
      { label: 'من نحن', type: 'internal', internal: { _type: 'reference', _ref: 'page-about-ar' } },
      { label: 'اتصل بنا', type: 'internal', internal: { _type: 'reference', _ref: 'page-contact-ar' } },
    ],
  });
  await client.create(navEn);
  console.log('Created: navigation-en');
  await client.create(navAr);
  console.log('Created: navigation-ar');

  console.log('\nDone. Refresh Sanity Studio — no more slug conflicts.');
})();
