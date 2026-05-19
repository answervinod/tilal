/* eslint-disable no-console */
/**
 * Tilal — content seed script.
 *
 *  Seeds Sanity with a complete, design-agency-grade starter dataset:
 *    - Site settings (singleton)
 *    - Navigation (header + footer columns) for EN + AR
 *    - 4 categories per locale
 *    - 6 fully-detailed projects per locale (cover, gallery, specs, amenities, description)
 *    - Home / About / Contact pages with composed page-builder blocks
 *
 *  Idempotent: re-running updates the same documents in place
 *  (uses deterministic _ids + createOrReplace).
 *
 *  Usage:
 *    npm run seed
 *
 *  Requirements:
 *    .env.local must contain NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 *    NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client';
import { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';

// ---------- Setup ----------------------------------------------------------

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN');

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const k = () => randomBytes(6).toString('hex');

// ---------- Image library --------------------------------------------------
// 12 curated architectural / real-estate Unsplash photos. Reused across
// projects and home blocks so we only upload each once.

const IMAGES = {
  marinaTower: {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2200&q=85&auto=format&fit=crop',
    alt: 'Glass-clad residential tower against twilight sky.',
  },
  marinaInterior: {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=85&auto=format&fit=crop',
    alt: 'Open-plan living room with floor-to-ceiling windows.',
  },
  marinaPool: {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2200&q=85&auto=format&fit=crop',
    alt: 'Rooftop infinity pool overlooking the city.',
  },
  villaExterior: {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2200&q=85&auto=format&fit=crop',
    alt: 'Modern villa with stone facade at dusk.',
  },
  villaLiving: {
    url: 'https://images.unsplash.com/photo-1613553497126-a44624272024?w=2200&q=85&auto=format&fit=crop',
    alt: 'Warm minimalist living space with natural light.',
  },
  villaBedroom: {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2200&q=85&auto=format&fit=crop',
    alt: 'Master bedroom with linen tones and large window.',
  },
  modernHome: {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2200&q=85&auto=format&fit=crop',
    alt: 'Contemporary residential home with landscaped garden.',
  },
  luxuryHome: {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2200&q=85&auto=format&fit=crop',
    alt: 'Premium home with reflecting pool and warm lighting.',
  },
  cityscape: {
    url: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=2200&q=85&auto=format&fit=crop',
    alt: 'Modern skyline composition at golden hour.',
  },
  officeBuilding: {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2200&q=85&auto=format&fit=crop',
    alt: 'Polished corporate office tower facade.',
  },
  officeInterior: {
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2200&q=85&auto=format&fit=crop',
    alt: 'Refined corporate workspace with natural materials.',
  },
  desert: {
    url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2200&q=85&auto=format&fit=crop',
    alt: 'Sand dunes — Arabian landscape texture.',
  },
};

// ---------- Image upload helper -------------------------------------------

const uploadedAssets = {};

async function uploadImage(key) {
  if (uploadedAssets[key]) return uploadedAssets[key];
  const meta = IMAGES[key];
  if (!meta) throw new Error(`Unknown image key: ${key}`);

  console.log(`  ⬆  uploading ${key}...`);
  const res = await fetch(meta.url);
  if (!res.ok) {
    console.warn(`     ⚠  failed to fetch ${key} (HTTP ${res.status}); skipping`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buf, {
    filename: `${key}.jpg`,
    contentType: 'image/jpeg',
  });
  uploadedAssets[key] = asset._id;
  console.log(`     ✓  ${key} -> ${asset._id}`);
  return asset._id;
}

function imgRef(key, alt) {
  const id = uploadedAssets[key];
  if (!id) return null;
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: id },
    alt: alt || IMAGES[key]?.alt,
  };
}

// ---------- Translation strings -------------------------------------------

const T = {
  en: {
    siteTitle: 'Tilal',
    siteDescription:
      'Premium real-estate developments — timeless spaces, modern living.',
    nav: {
      home: 'Home',
      developments: 'Developments',
      about: 'About',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      explore: 'Explore',
      portfolio: 'Portfolio',
      connect: 'Connect',
    },
    cats: {
      residential: { title: 'Residential', slug: 'residential', desc: 'Curated homes — villas, towers and townhouses.' },
      commercial: { title: 'Commercial', slug: 'commercial', desc: 'Office, retail and hospitality assets.' },
      mixed: { title: 'Mixed-Use', slug: 'mixed-use', desc: 'Master-planned destinations that blend living, work and leisure.' },
      offPlan: { title: 'Off-Plan', slug: 'off-plan', desc: 'Pre-launch opportunities — secure early.' },
    },
    home: {
      heroEyebrow: 'TILAL DEVELOPMENTS',
      heroHeading: 'Where vision meets craftsmanship.',
      heroSub: 'A portfolio of residential, commercial and mixed-use developments — designed for the way you live, built to endure for generations.',
      ctaExplore: 'Explore Developments',
      ctaContact: 'Schedule a Visit',
      statsHeading: 'A studio rooted in measured ambition.',
      stats: [
        { value: '12+', label: 'Years of practice' },
        { value: '28', label: 'Completed projects' },
        { value: '4', label: 'Cities' },
        { value: '1,200+', label: 'Homes delivered' },
      ],
      splitEyebrow: 'OUR APPROACH',
      splitHeading: 'A different standard of living.',
      splitBody: 'We believe the best architecture is invisible — felt, not announced. From the texture of a stone wall to the way morning light enters a living room, every Tilal residence is composed with patient detail.',
      splitCta: 'Read our philosophy',
      featuredHeading: 'Latest developments',
      featuredSub: 'A selection of recently launched and signature properties from across our portfolio.',
      featuredCta: 'See all developments',
      showcaseEyebrow: 'SIGNATURE PROJECT',
      showcaseTitle: 'Marina Heights',
      showcaseSubtitle: 'Riyadh, Saudi Arabia',
      showcaseMeta: '2024 · 168 RESIDENCES',
      showcaseCta: 'View project',
      testimonialHeading: 'Trust, delivered.',
      testimonials: [
        { quote: 'The level of finish and the discipline of their detailing is unusual in the region. Tilal builds for the long arc.', author: 'Reem Al-Hassan', role: 'Architect, Studio Hiraeth', rating: 5 },
        { quote: 'We bought a Tilal villa five years ago. It still feels new — that says everything about how it was made.', author: 'Khalid M.', role: 'Owner, Cedar Court', rating: 5 },
        { quote: 'They were the only developer who insisted on showing us how the building would weather over twenty years. We signed.', author: 'Samar Othman', role: 'Investor', rating: 5 },
      ],
      ctaHeading: 'Find your home in Tilal.',
      ctaSub: 'Speak with our advisory team about availability, private viewings, and off-plan opportunities.',
      ctaPrimary: 'Browse developments',
      ctaSecondary: 'Contact us',
    },
    about: {
      hero: {
        eyebrow: 'ABOUT TILAL',
        heading: 'Crafting spaces with intention.',
        body: 'Tilal was founded on a simple conviction: that the places we build should outlast the trends that inspired them. We design, develop and steward properties that quietly do more — for the people who live in them, and for the cities that hold them.',
        cta: 'Talk to us',
      },
      richHeading: 'A practice, not a portfolio.',
      richBody: 'Our work spans private residences, hospitality, and large-scale master plans, but the studio is small by design. Every project passes through the same hands — from the first conceptual sketch to the day we hand over the keys.\n\nWe partner with leading architects, landscape designers and craftspeople. We test materials before we specify them. We walk every site before we draw on it. The result is a body of work that looks effortless because it was anything but.',
      stats: [
        { value: '2012', label: 'Founded in Riyadh' },
        { value: '40', label: 'Studio team' },
        { value: '11', label: 'Design awards' },
        { value: '95%', label: 'Repeat-client rate' },
      ],
      cta: { heading: 'Begin a conversation.', sub: 'Whether you are buying, leasing or briefing a custom project, we would be glad to hear from you.', label: 'Contact the studio' },
    },
    contact: {
      hero: {
        eyebrow: 'GET IN TOUCH',
        heading: 'We would love to hear from you.',
      },
      contactHeading: 'Speak with our advisory team',
      contactSub: 'Open Sunday through Thursday, 9am–6pm. Private appointments available on request.',
      faqHeading: 'Frequently asked',
      faqs: [
        { question: 'How do I arrange a private viewing?', answer: 'Submit the form on this page or call us directly. A member of our advisory team will follow up within one business day to schedule a viewing — typically the same week.' },
        { question: 'Do you offer off-plan reservations?', answer: 'Yes. Several of our developments are released in phases, with early-buyer pricing for the first cohort. Contact us for the latest availability and reservation terms.' },
        { question: 'Are international buyers welcome?', answer: 'Absolutely. We work with a number of international clients and can guide you through ownership, residency considerations, and remote completion.' },
        { question: 'What is included in the handover?', answer: 'All Tilal homes are handed over fully finished — flooring, joinery, kitchens and major appliances. Furniture packages are available as an add-on for select units.' },
      ],
    },
    statusAvailable: 'Available',
    statusComingSoon: 'Coming Soon',
    statusReserved: 'Reserved',
    statusSold: 'Sold',
    footerNote: `© ${new Date().getFullYear()} Tilal Developments. Crafted with care in Riyadh.`,
  },
  ar: {
    siteTitle: 'تلال',
    siteDescription: 'مشاريع عقارية مميزة — مساحات خالدة وحياة عصرية.',
    nav: {
      home: 'الرئيسية',
      developments: 'المشاريع',
      about: 'من نحن',
      contact: 'تواصل',
      legal: 'قانوني',
      privacy: 'الخصوصية',
      terms: 'الشروط',
      explore: 'استكشف',
      portfolio: 'الأعمال',
      connect: 'تواصل معنا',
    },
    cats: {
      residential: { title: 'سكني', slug: 'residential', desc: 'منازل مختارة — فلل وأبراج وتاون هاوس.' },
      commercial: { title: 'تجاري', slug: 'commercial', desc: 'مكاتب وتجزئة وضيافة.' },
      mixed: { title: 'متعدد الاستخدامات', slug: 'mixed-use', desc: 'وجهات متكاملة تجمع السكن والعمل والترفيه.' },
      offPlan: { title: 'قيد التطوير', slug: 'off-plan', desc: 'فرص ما قبل الإطلاق — احجز مبكراً.' },
    },
    home: {
      heroEyebrow: 'تلال للتطوير العقاري',
      heroHeading: 'حيث تلتقي الرؤية بالإتقان.',
      heroSub: 'محفظة من المشاريع السكنية والتجارية ومتعددة الاستخدامات — مصممة لأسلوب حياتك، ومبنية لتدوم للأجيال.',
      ctaExplore: 'استكشف المشاريع',
      ctaContact: 'احجز زيارة',
      statsHeading: 'استوديو يقوم على طموح متزن.',
      stats: [
        { value: '+12', label: 'سنوات من الخبرة' },
        { value: '28', label: 'مشروع مكتمل' },
        { value: '4', label: 'مدن' },
        { value: '+1,200', label: 'منزل تم تسليمه' },
      ],
      splitEyebrow: 'منهجنا',
      splitHeading: 'معيار مختلف للسكن.',
      splitBody: 'نؤمن أن أفضل العمارة هي تلك التي لا ترى — تُحَسّ ولا تُعلَن. من ملمس الجدار الحجري إلى طريقة دخول ضوء الصباح إلى غرفة المعيشة، كل مسكن من تلال يُصاغ بتفاصيل دقيقة وصبر.',
      splitCta: 'اقرأ فلسفتنا',
      featuredHeading: 'أحدث المشاريع',
      featuredSub: 'مجموعة مختارة من العقارات المميزة وحديثة الإطلاق من محفظتنا.',
      featuredCta: 'عرض جميع المشاريع',
      showcaseEyebrow: 'مشروع مميز',
      showcaseTitle: 'مارينا هايتس',
      showcaseSubtitle: 'الرياض، المملكة العربية السعودية',
      showcaseMeta: '٢٠٢٤ · ١٦٨ وحدة',
      showcaseCta: 'عرض المشروع',
      testimonialHeading: 'الثقة، تُسلَّم.',
      testimonials: [
        { quote: 'مستوى التشطيب وانضباط التفاصيل لديهم غير مألوف في المنطقة. تلال يبني للمدى الطويل.', author: 'ريم الحسن', role: 'معمارية، استوديو هرايث', rating: 5 },
        { quote: 'اشترينا فيلا من تلال قبل خمس سنوات. لا تزال تبدو جديدة — هذا يقول كل شيء.', author: 'خالد م.', role: 'مالك، سيدر كورت', rating: 5 },
        { quote: 'كانوا المطور الوحيد الذي أصرّ على أن يرينا كيف سيتقدم المبنى في العمر بعد عشرين سنة. وقّعنا.', author: 'سمر عثمان', role: 'مستثمرة', rating: 5 },
      ],
      ctaHeading: 'اعثر على منزلك في تلال.',
      ctaSub: 'تحدث مع فريق المستشارين لدينا حول التوفر والمعاينات الخاصة وفرص ما قبل الإطلاق.',
      ctaPrimary: 'تصفح المشاريع',
      ctaSecondary: 'تواصل معنا',
    },
    about: {
      hero: {
        eyebrow: 'عن تلال',
        heading: 'نصنع المساحات بنية واضحة.',
        body: 'تأسست تلال على قناعة بسيطة: أن الأماكن التي نبنيها يجب أن تتجاوز الموجات التي ألهمتها. نحن نصمم ونطور ونرعى عقارات تفعل ما هو أكثر بهدوء — لمن يعيش فيها، وللمدن التي تحتضنها.',
        cta: 'تحدث معنا',
      },
      richHeading: 'ممارسة، لا مجرد محفظة.',
      richBody: 'يمتد عملنا من المساكن الخاصة إلى الضيافة والمخططات الكبرى، لكن الاستوديو صغير عن قصد. كل مشروع يمر عبر الأيدي ذاتها — من المسودة الأولى إلى يوم تسليم المفاتيح.\n\nنحن نتعاون مع نخبة من المعماريين ومصممي المشاهد والحرفيين. نختبر المواد قبل توصيتها. نمشي في كل موقع قبل أن نرسم عليه. والنتيجة عمل يبدو بسيطاً لأنه كان كل شيء عدا ذلك.',
      stats: [
        { value: '٢٠١٢', label: 'تأسسنا في الرياض' },
        { value: '٤٠', label: 'فريق الاستوديو' },
        { value: '١١', label: 'جوائز تصميم' },
        { value: '٩٥٪', label: 'نسبة العملاء المتكررين' },
      ],
      cta: { heading: 'لنبدأ حديثاً.', sub: 'سواء كنت تشتري أو تستأجر أو تبدأ مشروعاً مخصصاً، يسعدنا أن نسمع منك.', label: 'تواصل مع الاستوديو' },
    },
    contact: {
      hero: { eyebrow: 'تواصل معنا', heading: 'يسعدنا التحدث إليك.' },
      contactHeading: 'تحدث مع فريق المستشارين',
      contactSub: 'مفتوح من الأحد إلى الخميس، ٩ صباحاً – ٦ مساءً. مواعيد خاصة عند الطلب.',
      faqHeading: 'الأسئلة الشائعة',
      faqs: [
        { question: 'كيف أحدد موعداً لمعاينة خاصة؟', answer: 'أرسل النموذج الموجود في هذه الصفحة أو اتصل بنا مباشرة. سيتواصل أحد مستشارينا خلال يوم عمل واحد لتحديد موعد المعاينة — عادةً في نفس الأسبوع.' },
        { question: 'هل تقدمون حجوزات قبل الإطلاق؟', answer: 'نعم. تُطرح بعض مشاريعنا على مراحل بأسعار تفضيلية للدفعة الأولى. تواصل معنا لمعرفة أحدث التوفر وشروط الحجز.' },
        { question: 'هل المشترون الدوليون مرحب بهم؟', answer: 'بكل تأكيد. نعمل مع عدد من العملاء الدوليين ويمكننا إرشادك حول الملكية والإقامة والإكمال عن بُعد.' },
        { question: 'ماذا يشمل التسليم؟', answer: 'تُسلَّم جميع منازل تلال بتشطيب كامل — الأرضيات والنجارة والمطابخ والأجهزة الرئيسية. باقات الأثاث متاحة كإضافة لوحدات مختارة.' },
      ],
    },
    statusAvailable: 'متاح',
    statusComingSoon: 'قريباً',
    statusReserved: 'محجوز',
    statusSold: 'مباع',
    footerNote: `© ${new Date().getFullYear()} تلال للتطوير العقاري. صُنع بعناية في الرياض.`,
  },
};

// ---------- Project library ----------------------------------------------

const PROJECTS = [
  {
    slug: 'marina-heights',
    cover: 'marinaTower',
    gallery: ['marinaInterior', 'marinaPool', 'cityscape', 'marinaTower'],
    category: 'residential',
    status: 'available',
    featured: true,
    price: { mode: 'show', amount: 2_400_000, currency: 'SAR' },
    specs: { bedrooms: 3, bathrooms: 4, area: 245, parking: 2 },
    coords: { lat: 24.7136, lng: 46.6753 },
    en: {
      title: 'Marina Heights',
      tagline: 'A 168-residence tower above the Riyadh skyline.',
      location: 'Northern Ring Road, Riyadh',
      amenities: ['Concierge', '24-hour security', 'Rooftop infinity pool', 'Private gym', 'Sky lounge', 'Valet parking', 'Co-working library', 'Spa & sauna'],
      body: 'Marina Heights raises the standard for vertical living in Riyadh. The tower\'s tapered glass volumes are punctuated by deep-set bronze fins that filter the desert sun, while the residences within prioritise long sightlines, generous ceiling heights and bespoke joinery. Three sky lounges, a 25m infinity pool and full concierge service complete a building designed to feel less like a tower and more like a private club.',
    },
    ar: {
      title: 'مارينا هايتس',
      tagline: 'برج بـ ١٦٨ وحدة فوق أفق الرياض.',
      location: 'طريق الملك فهد الشمالي، الرياض',
      amenities: ['كونسيرج', 'أمن على مدار الساعة', 'مسبح لانهائي على السطح', 'صالة رياضية خاصة', 'صالة سماء', 'خدمة صف السيارات', 'مكتبة عمل مشترك', 'سبا وساونا'],
      body: 'يرفع مارينا هايتس معايير السكن العمودي في الرياض. تتخلل أحجام البرج الزجاجية المتدرجة زعانف برونزية عميقة تُلطّف شمس الصحراء، فيما تُعطي الوحدات الداخلية الأولوية لخطوط الرؤية الممتدة، والارتفاعات السخية، والنجارة المخصصة. ثلاث صالات سماء، ومسبح لانهائي بطول ٢٥ متراً، وخدمة كونسيرج كاملة، تُكمل مبنى صُمم ليبدو أقرب إلى نادٍ خاص منه إلى برج.',
    },
  },
  {
    slug: 'olaya-corporate-tower',
    cover: 'officeBuilding',
    gallery: ['officeInterior', 'cityscape', 'officeBuilding'],
    category: 'commercial',
    status: 'available',
    featured: true,
    price: { mode: 'inquire' },
    specs: { area: 38000, parking: 420 },
    coords: { lat: 24.6919, lng: 46.6857 },
    en: {
      title: 'Olaya Corporate Tower',
      tagline: 'Grade-A workspace at the centre of Riyadh\'s business district.',
      location: 'Olaya District, Riyadh',
      amenities: ['LEED Gold target', 'Smart building systems', 'Conference centre', 'Ground-floor retail', 'Private parking', 'Wellness floor', 'F&B podium', 'Helipad-ready'],
      body: 'Olaya Corporate Tower delivers 38,000 sqm of column-free Grade-A office space across 32 floors, designed in collaboration with one of London\'s leading practices. The double-skin facade dramatically reduces solar load while preserving panoramic views, and the tower\'s podium hosts a curated F&B and retail offering for occupants and the wider Olaya community.',
    },
    ar: {
      title: 'برج العليا للأعمال',
      tagline: 'مساحات مكتبية فئة A في قلب المنطقة التجارية بالرياض.',
      location: 'حي العليا، الرياض',
      amenities: ['هدف LEED ذهبي', 'أنظمة مبنى ذكي', 'مركز مؤتمرات', 'تجزئة في الطابق الأرضي', 'مواقف خاصة', 'طابق صحة وعافية', 'منصة مطاعم ومقاهي', 'مهبط طائرات جاهز'],
      body: 'يوفر برج العليا للأعمال ٣٨٬٠٠٠ متر مربع من المساحات المكتبية فئة A بدون أعمدة عبر ٣٢ طابقاً، صُمّم بالتعاون مع إحدى أرقى الممارسات في لندن. تُقلّل الواجهة المزدوجة الحمل الشمسي بشكل كبير مع الحفاظ على الإطلالات البانورامية، وتستضيف منصة البرج عرضاً منتقىً من المطاعم وتجارة التجزئة لشاغليه ولمجتمع العليا الأوسع.',
    },
  },
  {
    slug: 'lumiere-villas',
    cover: 'villaExterior',
    gallery: ['villaLiving', 'villaBedroom', 'modernHome', 'villaExterior'],
    category: 'residential',
    status: 'coming_soon',
    featured: true,
    price: { mode: 'show', amount: 7_800_000, currency: 'SAR' },
    specs: { bedrooms: 5, bathrooms: 6, area: 620, parking: 4 },
    coords: { lat: 21.5433, lng: 39.1728 },
    en: {
      title: 'Lumière Villas',
      tagline: 'Twelve courtyard villas on the Jeddah coastline.',
      location: 'Obhur, Jeddah',
      amenities: ['Private beach', 'Private pool', 'Smart home', 'Staff quarters', 'Outdoor majlis', 'Landscaped courtyards', 'Driver lobby', '5-year guarantee'],
      body: 'Lumière is a collection of twelve courtyard villas commissioned for Jeddah\'s most discerning families. Each home is anchored by a private central courtyard, with bedroom suites arranged on the upper floor and a flexible diwan, kitchen and majlis on the ground level. Materials — travertine, brushed brass, oak — are chosen to age gracefully in the coastal climate.',
    },
    ar: {
      title: 'فلل لوميير',
      tagline: 'اثنتا عشرة فيلا بفناء داخلي على ساحل جدة.',
      location: 'أبحر، جدة',
      amenities: ['شاطئ خاص', 'مسبح خاص', 'منزل ذكي', 'مساكن للعاملين', 'مجلس خارجي', 'أفنية مُنسّقة', 'مدخل سائق', 'ضمان ٥ سنوات'],
      body: 'لوميير مجموعة من اثنتي عشرة فيلا بفناء داخلي صُممت لأكثر العائلات تميزاً في جدة. كل منزل يرتكز على فناء مركزي خاص، مع أجنحة نوم في الطابق العلوي، وديوان ومطبخ ومجلس مرنة في الطابق الأرضي. المواد — التِرافرتين والنحاس المُصقول والبلوط — مختارة لتتقادم بأناقة في المناخ الساحلي.',
    },
  },
  {
    slug: 'diriyah-plaza',
    cover: 'desert',
    gallery: ['cityscape', 'modernHome', 'officeInterior'],
    category: 'mixed-use',
    status: 'available',
    featured: false,
    price: { mode: 'inquire' },
    specs: { area: 65000, parking: 850 },
    coords: { lat: 24.7341, lng: 46.5755 },
    en: {
      title: 'Diriyah Plaza',
      tagline: 'A heritage-rooted destination of homes, offices and craft retail.',
      location: 'Diriyah, Riyadh',
      amenities: ['Heritage walk', 'Boutique retail', 'Curated F&B', 'Gallery space', 'Public square', 'Underground parking', 'Family entertainment', 'Cultural programming'],
      body: 'Diriyah Plaza stitches together 65,000 sqm of residences, lifestyle offices and craft-focused retail at the edge of historic Diriyah. Earth-toned mass-rammed walls reference the surrounding heritage, while shaded laneways, a public square and a year-round cultural programme make the development a destination for residents and visitors alike.',
    },
    ar: {
      title: 'بلازا الدرعية',
      tagline: 'وجهة متجذرة في التراث، تجمع المنازل والمكاتب وتجارة الحرف.',
      location: 'الدرعية، الرياض',
      amenities: ['ممشى تراثي', 'تجزئة بوتيك', 'مطاعم منتقاة', 'صالة عرض فنية', 'ساحة عامة', 'مواقف تحت الأرض', 'ترفيه عائلي', 'برامج ثقافية'],
      body: 'تُنظم بلازا الدرعية ٦٥٬٠٠٠ متر مربع من المساكن والمكاتب الحياتية وتجارة التجزئة الحرفية على حافة الدرعية التاريخية. تستحضر الجدران الترابية المُكدسة المحيط التراثي، فيما تجعل الأزقة المُظلَّلة والساحة العامة والبرامج الثقافية على مدار العام المشروعَ وجهةً للمقيمين والزوار.',
    },
  },
  {
    slug: 'cedar-court-residences',
    cover: 'modernHome',
    gallery: ['villaLiving', 'villaBedroom', 'luxuryHome'],
    category: 'residential',
    status: 'sold',
    featured: false,
    price: { mode: 'show', amount: 3_200_000, currency: 'SAR' },
    specs: { bedrooms: 4, bathrooms: 5, area: 360, parking: 3 },
    coords: { lat: 26.2172, lng: 50.1971 },
    en: {
      title: 'Cedar Court Residences',
      tagline: 'A close of 32 family townhouses, fully delivered in 2021.',
      location: 'Khobar',
      amenities: ['Shared park', 'Childrens\' play areas', 'Private gardens', 'Service wing', 'Visitor parking', 'Mosque on site', '24-hour gate'],
      body: 'Cedar Court is one of our most quietly successful projects — 32 townhouses arranged around a generous shared park. The houses, each with its own garden, were sold to end-users only and remain in their first ownership half a decade after handover. The community feels lived-in by design.',
    },
    ar: {
      title: 'سيدر كورت',
      tagline: 'مجمع من ٣٢ تاون هاوس عائلي، تم تسليمه بالكامل في ٢٠٢١.',
      location: 'الخبر',
      amenities: ['حديقة مشتركة', 'مناطق ألعاب أطفال', 'حدائق خاصة', 'جناح خدمات', 'مواقف زوار', 'مسجد داخل المشروع', 'بوابة على مدار الساعة'],
      body: 'سيدر كورت أحد أهدأ مشاريعنا نجاحاً — ٣٢ تاون هاوس مرتبة حول حديقة مشتركة سخية. بِيعت المنازل، التي يضم كل منها حديقته الخاصة، للمستخدمين النهائيين فقط، ولا تزال في ملكيتها الأولى بعد نصف عقد من التسليم. مجتمع يبدو معاشاً عن قصد.',
    },
  },
  {
    slug: 'acacia-office-park',
    cover: 'officeInterior',
    gallery: ['officeBuilding', 'cityscape', 'officeInterior'],
    category: 'commercial',
    status: 'available',
    featured: false,
    price: { mode: 'inquire' },
    specs: { area: 22000, parking: 280 },
    coords: { lat: 24.7745, lng: 46.7384 },
    en: {
      title: 'Acacia Office Park',
      tagline: 'Low-rise corporate campus designed around a central garden.',
      location: 'King Abdullah Financial District, Riyadh',
      amenities: ['Central garden', 'Co-working hub', 'Three F&B operators', 'EV charging', 'Bike storage', 'Wellness studio', 'Conference rooms', 'Smart access'],
      body: 'Acacia is the antidote to the glass-tower office. Six low-rise pavilions sit within a mature, shaded garden, connected by covered walkways and a central courtyard. Each tenant occupies its own pavilion, with the option to expand floor-by-floor — a more humane way to grow a business.',
    },
    ar: {
      title: 'أكاسيا أوفيس بارك',
      tagline: 'حرم مكتبي منخفض الارتفاع مصمم حول حديقة مركزية.',
      location: 'مركز الملك عبدالله المالي، الرياض',
      amenities: ['حديقة مركزية', 'مركز عمل مشترك', 'ثلاث مشغلي مطاعم', 'شواحن سيارات كهربائية', 'مواقف دراجات', 'استوديو صحة', 'قاعات اجتماعات', 'وصول ذكي'],
      body: 'أكاسيا هو الترياق لمكتب البرج الزجاجي. ستة أجنحة منخفضة الارتفاع في حديقة ناضجة مظللة، تربطها ممرات مغطاة وفناء مركزي. كل مستأجر يحتل جناحه الخاص، مع خيار التوسع طابقاً تلو الآخر — طريقة أكثر إنسانية لتنمية الأعمال.',
    },
  },
];

// ---------- Document builders --------------------------------------------

function makeImageEntry(key, alt) {
  const id = uploadedAssets[key];
  if (!id) return null;
  return {
    _key: k(),
    _type: 'image',
    asset: { _type: 'reference', _ref: id },
    alt: alt || IMAGES[key]?.alt,
  };
}

function makeLink({ label, href, internalRef, type = 'internal', newTab = false }) {
  return {
    _key: k(),
    _type: 'link',
    label,
    type,
    newTab,
    ...(type === 'internal' && internalRef
      ? { internal: { _type: 'reference', _ref: internalRef } }
      : {}),
    ...(type === 'external' && href ? { href } : {}),
  };
}

function portable(text) {
  return text.split(/\n\n+/).map((para) => ({
    _key: k(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: k(), _type: 'span', marks: [], text: para }],
  }));
}

function siteSettingsDoc() {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: T.en.siteTitle,
    description: T.en.siteDescription,
    contactEmail: 'hello@tilal.example',
    contactPhone: '+966 11 000 0000',
    address: 'Tilal Studio\nKing Fahd Road, Olaya\nRiyadh 12222\nKingdom of Saudi Arabia',
    social: {
      instagram: 'https://instagram.com/',
      linkedin: 'https://linkedin.com/',
      x: 'https://x.com/',
      youtube: 'https://youtube.com/',
    },
  };
}

function categoryDoc(locale, key) {
  const d = T[locale].cats[key];
  return {
    _id: `category-${d.slug}-${locale}`,
    _type: 'category',
    language: locale,
    title: d.title,
    slug: { _type: 'slug', current: d.slug },
    description: d.desc,
  };
}

function projectDoc(locale, p) {
  const tr = p[locale];
  return {
    _id: `project-${p.slug}-${locale}`,
    _type: 'project',
    language: locale,
    title: tr.title,
    slug: { _type: 'slug', current: p.slug },
    tagline: tr.tagline,
    location: tr.location,
    status: p.status,
    featured: p.featured,
    category: { _type: 'reference', _ref: `category-${p.category}-${locale}` },
    price: p.price,
    specs: p.specs,
    coordinates: { _type: 'geopoint', lat: p.coords.lat, lng: p.coords.lng },
    amenities: tr.amenities,
    description: portable(tr.body),
    cover: imgRef(p.cover),
    gallery: p.gallery
      .map((key, i) => {
        const id = uploadedAssets[key];
        if (!id) return null;
        return {
          _key: k(),
          _type: 'image',
          asset: { _type: 'reference', _ref: id },
          alt: `${tr.title} — view ${i + 1}`,
        };
      })
      .filter(Boolean),
    publishedAt: new Date(2024, 5, 1 + PROJECTS.indexOf(p)).toISOString(),
  };
}

function navigationDoc(locale) {
  const t = T[locale].nav;
  return {
    _id: `navigation-${locale}`,
    _type: 'navigation',
    language: locale,
    title: 'Main Navigation',
    header: [
      makeLink({ label: t.developments, href: `/${locale}/projects`, type: 'external' }),
      makeLink({ label: t.about, internalRef: `page-about-${locale}` }),
      makeLink({ label: t.contact, internalRef: `page-contact-${locale}` }),
    ],
    footerColumns: [
      {
        _key: k(),
        _type: 'footerColumn',
        title: t.explore,
        links: [
          makeLink({ label: t.home, internalRef: `page-home-${locale}` }),
          makeLink({ label: t.developments, href: `/${locale}/projects`, type: 'external' }),
          makeLink({ label: t.about, internalRef: `page-about-${locale}` }),
          makeLink({ label: t.contact, internalRef: `page-contact-${locale}` }),
        ],
      },
      {
        _key: k(),
        _type: 'footerColumn',
        title: t.portfolio,
        links: [
          makeLink({ label: T[locale].cats.residential.title, href: `/${locale}/projects?category=residential`, type: 'external' }),
          makeLink({ label: T[locale].cats.commercial.title, href: `/${locale}/projects?category=commercial`, type: 'external' }),
          makeLink({ label: T[locale].cats.mixed.title, href: `/${locale}/projects?category=mixed-use`, type: 'external' }),
          makeLink({ label: T[locale].cats.offPlan.title, href: `/${locale}/projects?category=off-plan`, type: 'external' }),
        ],
      },
      {
        _key: k(),
        _type: 'footerColumn',
        title: t.connect,
        links: [
          makeLink({ label: 'Instagram', href: 'https://instagram.com/', type: 'external', newTab: true }),
          makeLink({ label: 'LinkedIn', href: 'https://linkedin.com/', type: 'external', newTab: true }),
          makeLink({ label: 'YouTube', href: 'https://youtube.com/', type: 'external', newTab: true }),
        ],
      },
    ],
    footerNote: T[locale].footerNote,
  };
}

function homePageDoc(locale) {
  const t = T[locale].home;
  return {
    _id: `page-home-${locale}`,
    _type: 'page',
    language: locale,
    title: locale === 'en' ? 'Home' : 'الرئيسية',
    slug: { _type: 'slug', current: 'home' },
    sections: [
      {
        _key: k(),
        _type: 'heroBlock',
        eyebrow: t.heroEyebrow,
        heading: t.heroHeading,
        subheading: t.heroSub,
        align: 'left',
        media: {
          _type: 'object',
          type: 'image',
          image: imgRef('marinaTower'),
          overlay: 0.45,
        },
        ctas: [
          makeLink({ label: t.ctaExplore, href: `/${locale}/projects`, type: 'external' }),
          makeLink({ label: t.ctaContact, internalRef: `page-contact-${locale}` }),
        ],
      },
      {
        _key: k(),
        _type: 'statsBlock',
        heading: t.statsHeading,
        items: t.stats.map((s) => ({ _key: k(), _type: 'stat', value: s.value, label: s.label })),
      },
      {
        _key: k(),
        _type: 'splitHeroBlock',
        eyebrow: t.splitEyebrow,
        heading: t.splitHeading,
        body: t.splitBody,
        mediaSide: 'right',
        variant: 'cream',
        media: { _type: 'object', type: 'image', image: imgRef('villaLiving') },
        ctas: [makeLink({ label: t.splitCta, internalRef: `page-about-${locale}` })],
      },
      {
        _key: k(),
        _type: 'featuredListingsBlock',
        heading: t.featuredHeading,
        subheading: t.featuredSub,
        mode: 'featured',
        limit: 6,
        cta: makeLink({ label: t.featuredCta, href: `/${locale}/projects`, type: 'external' }),
      },
      {
        _key: k(),
        _type: 'showcaseBlock',
        media: { _type: 'object', type: 'image', image: imgRef('marinaTower') },
        caption: {
          eyebrow: t.showcaseEyebrow,
          title: t.showcaseTitle,
          subtitle: t.showcaseSubtitle,
          meta: t.showcaseMeta,
          cta: makeLink({ label: t.showcaseCta, href: `/${locale}/projects/marina-heights`, type: 'external' }),
        },
        captionPosition: 'bottom-left',
        height: 'tall',
      },
      {
        _key: k(),
        _type: 'testimonialsBlock',
        heading: t.testimonialHeading,
        items: t.testimonials.map((q) => ({
          _key: k(),
          _type: 'testimonial',
          quote: q.quote,
          author: q.author,
          role: q.role,
          rating: q.rating,
        })),
      },
      {
        _key: k(),
        _type: 'ctaBlock',
        heading: t.ctaHeading,
        subheading: t.ctaSub,
        variant: 'brand',
        background: imgRef('cityscape'),
        buttons: [
          makeLink({ label: t.ctaPrimary, href: `/${locale}/projects`, type: 'external' }),
          makeLink({ label: t.ctaSecondary, internalRef: `page-contact-${locale}` }),
        ],
      },
    ],
  };
}

function aboutPageDoc(locale) {
  const t = T[locale].about;
  return {
    _id: `page-about-${locale}`,
    _type: 'page',
    language: locale,
    title: locale === 'en' ? 'About' : 'من نحن',
    slug: { _type: 'slug', current: 'about' },
    sections: [
      {
        _key: k(),
        _type: 'splitHeroBlock',
        eyebrow: t.hero.eyebrow,
        heading: t.hero.heading,
        body: t.hero.body,
        mediaSide: 'right',
        variant: 'light',
        media: { _type: 'object', type: 'image', image: imgRef('luxuryHome') },
        ctas: [makeLink({ label: t.hero.cta, internalRef: `page-contact-${locale}` })],
      },
      {
        _key: k(),
        _type: 'richTextBlock',
        heading: t.richHeading,
        body: portable(t.richBody),
      },
      {
        _key: k(),
        _type: 'statsBlock',
        items: t.stats.map((s) => ({ _key: k(), _type: 'stat', value: s.value, label: s.label })),
      },
      {
        _key: k(),
        _type: 'showcaseBlock',
        media: { _type: 'object', type: 'image', image: imgRef('desert') },
        caption: {
          eyebrow: locale === 'en' ? 'OUR LANDSCAPE' : 'بيئتنا',
          title: locale === 'en' ? 'Rooted in the Kingdom.' : 'متجذرون في المملكة.',
          subtitle: locale === 'en' ? 'Riyadh · Jeddah · Khobar · Diriyah' : 'الرياض · جدة · الخبر · الدرعية',
        },
        captionPosition: 'bottom-right',
        height: 'standard',
      },
      {
        _key: k(),
        _type: 'ctaBlock',
        heading: t.cta.heading,
        subheading: t.cta.sub,
        variant: 'brand',
        buttons: [makeLink({ label: t.cta.label, internalRef: `page-contact-${locale}` })],
      },
    ],
  };
}

function contactPageDoc(locale) {
  const t = T[locale].contact;
  return {
    _id: `page-contact-${locale}`,
    _type: 'page',
    language: locale,
    title: locale === 'en' ? 'Contact' : 'تواصل',
    slug: { _type: 'slug', current: 'contact' },
    sections: [
      {
        _key: k(),
        _type: 'heroBlock',
        eyebrow: t.hero.eyebrow,
        heading: t.hero.heading,
        align: 'left',
        media: {
          _type: 'object',
          type: 'image',
          image: imgRef('officeInterior'),
          overlay: 0.55,
        },
      },
      {
        _key: k(),
        _type: 'contactBlock',
        heading: t.contactHeading,
        subheading: t.contactSub,
        email: 'hello@tilal.example',
        phone: '+966 11 000 0000',
        address: locale === 'en'
          ? 'Tilal Studio\nKing Fahd Road, Olaya\nRiyadh 12222\nKingdom of Saudi Arabia'
          : 'استوديو تلال\nطريق الملك فهد، العليا\nالرياض ١٢٢٢٢\nالمملكة العربية السعودية',
        mapEmbedUrl:
          'https://www.openstreetmap.org/export/embed.html?bbox=46.6%2C24.65%2C46.75%2C24.75&layer=mapnik&marker=24.7136%2C46.6753',
        showForm: true,
      },
      {
        _key: k(),
        _type: 'faqBlock',
        heading: t.faqHeading,
        items: t.faqs.map((q) => ({ _key: k(), _type: 'qa', question: q.question, answer: q.answer })),
      },
    ],
  };
}

// ---------- Main ----------------------------------------------------------

async function main() {
  console.log(`\n→  Tilal seed starting (project=${projectId} dataset=${dataset})\n`);

  // 1. Upload images (sequential — friendlier to Sanity + Unsplash)
  console.log('Uploading images...');
  for (const key of Object.keys(IMAGES)) {
    try {
      await uploadImage(key);
    } catch (e) {
      console.warn(`     ⚠  image upload failed for ${key}:`, e.message);
    }
  }

  console.log('\nUpserting documents...');

  const docs = [];

  // Site settings (singleton)
  docs.push(siteSettingsDoc());

  // Per-locale content
  for (const locale of ['en', 'ar']) {
    // Categories
    for (const catKey of Object.keys(T[locale].cats)) {
      docs.push(categoryDoc(locale, catKey));
    }
    // Projects
    for (const p of PROJECTS) {
      docs.push(projectDoc(locale, p));
    }
    // Pages
    docs.push(homePageDoc(locale));
    docs.push(aboutPageDoc(locale));
    docs.push(contactPageDoc(locale));
    // Navigation (after pages so refs resolve)
    docs.push(navigationDoc(locale));
  }

  // Use a transaction so all writes commit together
  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(doc);
  }
  const res = await tx.commit();
  console.log(`     ✓  ${res.results.length} documents written.\n`);

  console.log('Done. Next steps:');
  console.log('  1.  npm run dev');
  console.log(`  2.  Visit http://localhost:3000/en  and  /ar`);
  console.log(`  3.  Open /studio to edit anything you see.\n`);
}

main().catch((err) => {
  console.error('\n✗  Seed failed:', err);
  process.exit(1);
});
