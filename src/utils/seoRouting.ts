import { GradeId } from '../types/curriculum';
import { TabType } from '../components/Header';
import { GRADES_DATA } from '../data/curriculumData';

export interface RouteState {
  tab: TabType;
  grade: GradeId;
  readingTrack?: 'all' | 'struggling' | 'short_text' | 'advanced';
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
}

/**
 * Maps current URL (path, search query, or hash) to application state
 */
export function parseRouteFromLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { tab: 'units', grade: 'grade1' };
  }

  const pathname = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '').toLowerCase();

  // 1. Check query parameters first (?tab=...&grade=...)
  const queryTab = searchParams.get('tab') as TabType | null;
  const queryGrade = searchParams.get('grade') as GradeId | null;
  const queryTrack = searchParams.get('track') as 'all' | 'struggling' | 'short_text' | 'advanced' | null;

  let tab: TabType = 'units';
  let grade: GradeId = 'grade1';
  let readingTrack: 'all' | 'struggling' | 'short_text' | 'advanced' = 'all';

  if (queryTab && isValidTab(queryTab)) {
    tab = queryTab;
  }
  if (queryGrade && GRADES_DATA[queryGrade]) {
    grade = queryGrade;
  }
  if (queryTrack) {
    readingTrack = queryTrack;
  }

  // 2. Parse path-based routes (e.g. /summaries, /units/intermediate1, /reading-path/struggling)
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length > 0) {
    const first = segments[0];
    const second = segments[1];

    if (first === 'summaries' || first === 'summary') {
      tab = 'summaries';
      if (second && GRADES_DATA[second as GradeId]) {
        grade = second as GradeId;
      }
    } else if (first === 'reading-path' || first === 'reading_path' || first === 'reading') {
      tab = 'reading_path';
      if (second && ['all', 'struggling', 'short_text', 'advanced'].includes(second)) {
        readingTrack = second as any;
      }
    } else if (first === 'books') {
      tab = 'books';
      if (second && GRADES_DATA[second as GradeId]) grade = second as GradeId;
    } else if (first === 'foundation') {
      tab = 'foundation';
      grade = 'foundation';
    } else if (first === 'kg') {
      tab = 'kg';
      grade = second === 'kg2' ? 'kg2' : 'kg1';
    } else if (first === 'dictionary') {
      tab = 'dictionary';
      if (second && GRADES_DATA[second as GradeId]) grade = second as GradeId;
    } else if (first === 'quiz') {
      tab = 'quiz';
      if (second && GRADES_DATA[second as GradeId]) grade = second as GradeId;
    } else if (first === 'ai') {
      tab = 'ai';
    } else if (first === 'whiteboard') {
      tab = 'whiteboard';
    } else if (first === 'support-plans' || first === 'support_plans') {
      tab = 'support_plans';
      grade = 'grade1';
    } else if (first === 'worksheets') {
      tab = 'worksheets';
      if (second && GRADES_DATA[second as GradeId]) grade = second as GradeId;
    } else if (first === 'achievements') {
      tab = 'achievements';
    } else if (first === 'units' || first === 'grade') {
      tab = 'units';
      if (second && GRADES_DATA[second as GradeId]) {
        grade = second as GradeId;
      }
    } else if (GRADES_DATA[first as GradeId]) {
      tab = 'units';
      grade = first as GradeId;
    }
  } else if (hash) {
    if (isValidTab(hash as TabType)) {
      tab = hash as TabType;
    }
  }

  return { tab, grade, readingTrack };
}

function isValidTab(tab: string): tab is TabType {
  const validTabs: TabType[] = [
    'units',
    'summaries',
    'books',
    'foundation',
    'kg',
    'quiz',
    'ai',
    'worksheets',
    'achievements',
    'dictionary',
    'support_plans',
    'whiteboard',
    'reading_path'
  ];
  return validTabs.includes(tab as TabType);
}

/**
 * Constructs the canonical dedicated URL path for a given tab and grade
 */
export function getUrlForRoute(tab: TabType, grade?: GradeId, readingTrack?: string): string {
  switch (tab) {
    case 'summaries':
      return grade && grade.startsWith('intermediate') ? `/summaries/${grade}` : '/summaries';
    case 'reading_path':
      return readingTrack && readingTrack !== 'all' ? `/reading-path/${readingTrack}` : '/reading-path';
    case 'support_plans':
      return '/support-plans';
    case 'foundation':
      return '/foundation';
    case 'kg':
      return grade === 'kg2' ? '/kg/kg2' : '/kg';
    case 'books':
      return grade ? `/books/${grade}` : '/books';
    case 'dictionary':
      return grade ? `/dictionary/${grade}` : '/dictionary';
    case 'quiz':
      return grade ? `/quiz/${grade}` : '/quiz';
    case 'ai':
      return '/ai';
    case 'whiteboard':
      return '/whiteboard';
    case 'worksheets':
      return grade ? `/worksheets/${grade}` : '/worksheets';
    case 'achievements':
      return '/achievements';
    case 'units':
    default:
      return grade && grade !== 'grade1' ? `/units/${grade}` : '/';
  }
}

/**
 * Computes descriptive, SEO-rich metadata tailored for search engines and social share cards
 */
export function getSeoMetadata(state: RouteState): SeoMetadata {
  const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') 
    ? window.location.origin 
    : 'https://www.arabicksa.com';
  const path = getUrlForRoute(state.tab, state.grade, state.readingTrack);
  const canonicalUrl = `${origin}${path}`;
  const gradeData = GRADES_DATA[state.grade] || GRADES_DATA.grade1;

  switch (state.tab) {
    case 'summaries':
      return {
        title: 'ملخصات ومذكرات لغتي الخالدة - الأول والثاني والثالث متوسط | المنهاج السعودي',
        description: 'مذكرات شاملة لقواعد النحو والإملاء والأساليب لصفوف المرحلة المتوسطة (م١، م٢، م٣) مع نماذج الاختبارات المركزية وجداول الفروق.',
        canonicalUrl,
        ogTitle: 'مذكرات وملخصات لغتي الخالدة للمرحلة المتوسطة',
        ogDescription: 'شرح مبسط، قواعد أقوى الحركات، الفاعل ونائب الفاعل، المبتدأ والخبر، والهمزات مع تدريبات تفاعلية.',
        keywords: 'ملخصات لغتي الخالدة, الأول متوسط, الثاني متوسط, الثالث متوسط, اختبارات مركزية, مذكرات لغتي'
      };

    case 'reading_path': {
      let trackText = 'جميع المستويات';
      if (state.readingTrack === 'struggling') trackText = 'مسار المتعثرين (قراءة الجمل)';
      else if (state.readingTrack === 'short_text') trackText = 'مسار النصوص القصيرة';
      else if (state.readingTrack === 'advanced') trackText = 'مسار النصوص الطويلة للمتميزين';

      return {
        title: `الانطلاق في القراءة - ${trackText} | منصة لغتي التعليمية`,
        description: 'مسار متدرج في الطلاقة وفهم المقروء من قراءة الجمل البسيطة للمتعثرين إلى النصوص الطويلة للمتميزين مع مؤقت القراءة والتسجيل الصوتي.',
        canonicalUrl,
        ogTitle: `مسار الانطلاق في القراءة - ${trackText}`,
        ogDescription: 'تدريب يومي متدرج في القراءة السليمة بالحركات مع أسئلة فهم المقروء الفورية لجميع طلاب التعليم العام.',
        keywords: 'الانطلاق في القراءة, طلاقة القراءة, علاج التعثر القرائي, نصوص لغتي, فهم المقروء'
      };
    }

    case 'support_plans':
      return {
        title: 'خطط الدعم وعلاج الفاقد التعليمي - الصف الأول الابتدائي | منصة لغتي',
        description: 'مذكرات علاج الفاقد التعليمي، كراسات الحروف، تدريبات المقطع الساكن، الكلمات البصرية ومجلد Google Drive الشامل لمقرر لغتي.',
        canonicalUrl,
        ogTitle: 'خطط الدعم وعلاج الفاقد التعليمي للصف الأول الابتدائي',
        ogDescription: 'حقائب علاجية متكاملة وتحميل مباشر لمذكرات الحروف وتدريبات القراءة من مجلد Google Drive المعتمد.',
        keywords: 'خطط دعم الصف الأول, علاج الفاقد التعليمي, كراسة الحروف, المقطع الساكن, لغتي أول ابتدائي'
      };

    case 'foundation':
      return {
        title: 'معمل التأسيس والحروف الهجائية الـ 28 | منصة لغتي التعليمية',
        description: 'تعلم مخارج وأصوات الحركات القصيرة والطويلة، اللام الشمسية والقمرية، والتنوين بنطق صوتي فصيح وتفاعلي للأطفال.',
        canonicalUrl,
        ogTitle: 'معمل التأسيس الصوتي والمرئي للحروف العربية',
        ogDescription: 'معمل تفاعلي شامل للحروف الهجائية وأصواتها القصيرة والمدود والظواهر الصوتية والإملائية.',
        keywords: 'تأسيس لغتي, الحروف الهجائية, الحركات القصيرة, المدود, اللام الشمسية والقمرية'
      };

    case 'kg':
      return {
        title: 'روضة لغتي للأطفال (KG1 - KG2) - تأسيس مرح وممتع | منصة لغتي',
        description: 'منهاج رياض الأطفال لغتي التفاعلي مع أصوات الحيوانات، تلوين الحروف، الألعاب التعليمية والمفردات المصورة.',
        canonicalUrl,
        ogTitle: 'روضة لغتي التعليمية لمرحلة رياض الأطفال',
        ogDescription: 'أنشطة وألعاب صوتية تفاعلية ممتعة لبناء الحصيلة اللغوية والتهيئة للقراءة والكتابة.',
        keywords: 'روضة لغتي, رياض الأطفال, kg1, kg2, تعليم الحروف للأطفال'
      };

    case 'books':
      return {
        title: `كُتُب لُغَتِي المدرسية الرسمية - ${gradeData.name} | منصة لغتي`,
        description: `تصفح وتحميل كُتُب مقرر لغتي الجميلة المعتمدة من وزارة التعليم السعودية لجميع الفصول الدراسية بجودة عالية.`,
        canonicalUrl,
        ogTitle: `كُتُب مقرر لغتي المدرسية - ${gradeData.name}`,
        ogDescription: `الكتاب المدرسي الإلكتروني التفاعلي لمقرر لغتي مع فهرس الوحدات والدروس لعام 1447-1448هـ.`,
        keywords: `كتب لغتي, كتاب لغتي ${gradeData.name}, تحميل كتب لغتي, مناهج السعودية`
      };

    case 'dictionary':
      return {
        title: `القاموس اللغوي الصوتي والمرئي - ${gradeData.name} | منصة لغتي`,
        description: `قاموس صوتي ومرئي بمخارج الحروف ونطق بطيء (0.5x) ومفردات وصور معتمدة لمنهاج لغتي.`,
        canonicalUrl,
        ogTitle: `القاموس الصوتي والمرئي التفاعلي - ${gradeData.name}`,
        ogDescription: `مفردات مصورة مع نطق بطيء وتدريبات على إتقان مخارج الحروف والظواهر الصوتية.`,
        keywords: `قاموس لغتي, نطق بطيء, مخارج الحروف, مفردات لغتي, قاموس عربي للأطفال`
      };

    case 'quiz':
      return {
        title: `بنك التمارين والاختبارات التفاعلية - ${gradeData.name} | منصة لغتي`,
        description: `اختبر معلوماتك في مهارات لغتي النحوية والإملائية والقراءة بنظام النجوم والتقييم الفوري لجميع الصفوف.`,
        canonicalUrl,
        ogTitle: `بنك الاختبارات التفاعلية لمقرر لغتي - ${gradeData.name}`,
        ogDescription: `أسئلة فهم مقروء، إعراب، ظواهر إملائية، وتدريبات ذكية مع التغذية الراجعة الفورية.`,
        keywords: `اختبارات لغتي, بنك أسئلة لغتي, تمارين تفاعلية, اختبار مركزي لغتي`
      };

    case 'ai':
      return {
        title: 'المُعرب النحوي ومساعد المعلم الذكي | منصة لغتي التعليمية',
        description: 'إعراب الجمل والآيات القرآنية تلقائياً مع تحليل الظواهر الإملائية والنحوية وفق المنهاج السعودي المعتمد.',
        canonicalUrl,
        ogTitle: 'المُعرب الذكي ومساعد المعلم لمنهاج لغتي',
        ogDescription: 'أداة ذكية متطورة لإعراب الكلمات وضبط الجمل بالشكل وشرح القواعد اللغوية خطوة بخطوة.',
        keywords: 'إعراب الجمل, المعرب الذكي, إعراب لغتي, مساعد معلم لغتي, قواعد النحو'
      };

    case 'whiteboard':
      return {
        title: 'السبورة التفاعلية لتعليم الخط والكتابة والرسم | منصة لغتي',
        description: 'لوحة تفاعلية حرة بأقلام ملونة وممحاة وأدوات تحسين الخط العربي وتوضيح الحروف على السطر.',
        canonicalUrl,
        ogTitle: 'السبورة التفاعلية لمنهاج لغتي',
        ogDescription: 'سبورة ذكية لممارسة كتابة الحروف والكلمات ورسم خطي النسخ والرقعة للمعلمين والطلاب.',
        keywords: 'سبورة تفاعلية, سبورة لغتي, كتابة الحروف, خط النسخ, خط الرقعة'
      };

    case 'worksheets':
      return {
        title: `أوراق عمل ونماذج تحسين الخط - ${gradeData.name} | منصة لغتي`,
        description: `أوراق عمل تفاعلية وجاهزة للطباعة فوراً لمقرر لغتي تشمل قياس المهارات والتدريبات الإملائية.`,
        canonicalUrl,
        ogTitle: `أوراق عمل مقرر لغتي - ${gradeData.name}`,
        ogDescription: `نماذج أوراق عمل منوعة ومطابقة للمهارات الأساسية مع إمكانية التعبئة والطباعة المباشرة.`,
        keywords: `أوراق عمل لغتي, تدريبات لغتي, تحسين الخط, أنشطة لغتي`
      };

    case 'achievements':
      return {
        title: 'لوحة الإنجازات وشهادات التفوق المعتمدة | منصة لغتي التعليمية',
        description: 'تابع رصيد النجوم والتمارين المنجزة واستخرج شهادة تفوق باسم الطالب بصيغة طباعة فورية.',
        canonicalUrl,
        ogTitle: 'لوحة إنجازات الطالب وشهادات التفوق',
        ogDescription: 'سجل تقدم الطالب في مهارات القراءة والاختبارات مع شهادات تقديرية مخصصة للأبطال.',
        keywords: 'شهادات تفوق لغتي, إنجازات الطالب, نجوم التميز'
      };

    case 'units':
    default:
      return {
        title: `منهاج ${gradeData.name} - مقرر لُغَتِي | المنهاج السعودي المعتمد`,
        description: `${gradeData.description.slice(0, 150)}...`,
        canonicalUrl,
        ogTitle: `منهاج ${gradeData.name} - مقرر لغتي الشامل`,
        ogDescription: `${gradeData.subtitle} — وحدات دراسية، نصوص قراءة واستماع، ظواهر إملائية ونحوية.`,
        keywords: `لغتي ${gradeData.name}, دروس لغتي, نصوص الاستماع, المنهاج السعودي 1447`
      };
  }
}

/**
 * Updates DOM head tags for dynamic SEO
 */
export function applySeoMetadataToDom(seo: SeoMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = seo.title;

  // 2. Meta description
  updateMetaTag('name', 'description', seo.description);
  updateMetaTag('name', 'keywords', seo.keywords);

  // 3. OpenGraph tags
  updateMetaTag('property', 'og:title', seo.ogTitle);
  updateMetaTag('property', 'og:description', seo.ogDescription);
  updateMetaTag('property', 'og:url', seo.canonicalUrl);

  // 4. Twitter tags
  updateMetaTag('name', 'twitter:title', seo.ogTitle);
  updateMetaTag('name', 'twitter:description', seo.ogDescription);

  // 5. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', seo.canonicalUrl);
}

function updateMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
