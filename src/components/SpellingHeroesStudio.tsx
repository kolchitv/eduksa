import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Trophy, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Flame, 
  Printer, 
  Check, 
  ShieldAlert, 
  Layers, 
  GraduationCap,
  Sparkle
} from 'lucide-react';
import { audioManager } from '../utils/audio';

export type SpellingLevel = 'beginner' | 'intermediate' | 'pro';

export interface SpellingWord {
  id: string;
  word: string;
  meaning: string;
  level: SpellingLevel;
  levelLabel: string;
  category: 'madd' | 'shamsiya_qamariya' | 'tanween' | 'taa_marbouta' | 'hamzat' | 'advanced_rules';
  categoryLabel: string;
  hint: string;
  ruleExplanation: string;
  options?: string[]; // For multiple choice quest
}

export const SPELLING_DATA: SpellingWord[] = [
  // ==========================================
  // ١. المستوى المبتدئ (براعم الإملاء 🌱)
  // حركات قصيرة، مدود ظاهرة، كلمات ثلاثية، تاء مربوطة سهلة، ولبنات الكلمات
  // ==========================================
  {
    id: 'beg_brick_1',
    word: 'بَلَدُ',
    meaning: 'ثلاثي بالحركات القصيرة (بَـ + ـلَـ + ـدُ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'لبنة الكلمة والحركات القصيرة',
    hint: 'ثلاث لبنات صوتية متتابعة: بَـ (فتحة) - لَـ (فتحة) - دُ (ضمة)',
    ruleExplanation: 'كلمة ثلاثية تبدأ بالباء وتتوسطها اللام وتنتهي بالدال المضمومة.',
    options: ['بَلَدُ', 'بَلَدْ', 'بَالَدُ']
  },
  {
    id: 'beg_brick_2',
    word: 'دَبَلَ',
    meaning: 'ثلاثي متتابع الفتح (دَ + بَـ + ـلَ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'لبنة الكلمة والحركات القصيرة',
    hint: 'ثلاثة حروف مفتوحة: دَ - بَـ - لَ',
    ruleExplanation: 'حركات قصيرة متتابعة بالفتح دون أي مد.',
    options: ['دَبَلَ', 'دَابَلَ', 'دَبَلَا']
  },
  {
    id: 'beg_brick_3',
    word: 'بَدَلُ',
    meaning: 'ثلاثي (بَـ + ـدَ + ـلُ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'لبنة الكلمة والحركات القصيرة',
    hint: 'فتحة ثم فتحة ثم ضمة: بَـ - دَ - لُ',
    ruleExplanation: 'كلمة ثلاثية تحوي الباء المفتوحة والدال المفتوحة واللام المضمومة.',
    options: ['بَدَلُ', 'بَدَلْ', 'بَادَلُ']
  },
  {
    id: 'beg_brick_4',
    word: 'دَامَ',
    meaning: 'مد بالألف مع الدال المفتوحة (دَا + مَ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالألف',
    hint: 'صوت طويل على الدال: دَا - مَ',
    ruleExplanation: 'حرف المد هو الألف والحرف الممدود هو الدال المفتوحة (دَا).',
    options: ['دَامَ', 'دَمَ', 'دَأمَ']
  },
  {
    id: 'beg_brick_5',
    word: 'دِيمُ',
    meaning: 'مد بالياء مع الدال المكسورة (دِيـ + مُ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالياء',
    hint: 'صوت طويل بالياء: دِيـ - مُ',
    ruleExplanation: 'حرف المد هو الياء وتسبقه الدال المكسورة (دِيـ).',
    options: ['دِيمُ', 'دِمُ', 'دِيئمُ']
  },
  {
    id: 'beg_brick_6',
    word: 'دُودُ',
    meaning: 'مد بالواو مع الدال المضمومة (دُو + دُ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالواو',
    hint: 'صوت طويل بالواو: دُو - دُ',
    ruleExplanation: 'حرف المد هو الواو وتسبقه الدال المضمومة (دُو).',
    options: ['دُودُ', 'دُدُ', 'دُوؤُ']
  },
  {
    id: 'beg_brick_7',
    word: 'بِلَادِي',
    meaning: 'مدان متتابعان (بِـ + ـلَا + دِي)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالألف والمد بالياء',
    hint: 'كسرة تحت الباء ثم مد ألف ثم مد ياء: بِـ - لَا - دِي',
    ruleExplanation: 'اجتمع فيها مد الألف (لَا) ومد الياء (دِي).',
    options: ['بِلَادِي', 'بِلَدِي', 'بَلَادِي']
  },
  {
    id: 'beg_brick_8',
    word: 'دَلْوُ',
    meaning: 'مقطع ساكن (دَ + لْـ + وُ)',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المقطع الساكن',
    hint: 'اللام ساكنة مع الدال في مقطع واحد: دَلْـ - وُ',
    ruleExplanation: 'مقطع ساكن ينطق معاً (دَلْـ) تليه الواو المضمومة (وُ).',
    options: ['دَلْوُ', 'دَلُو', 'دَلْؤُ']
  },
  {
    id: 'beg_1',
    word: 'كَتَبَ',
    meaning: 'كلمة ثلاثية بحركات الفتح القصيرة',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'الحركات القصيرة',
    hint: 'ثلاثة حروف متتابعة وكلها بالفتحة: كَـ - تَـ - بَ',
    ruleExplanation: 'حركات قصيرة سريعة بدون مد: فتحة فوق الكاف والتاء والباء.',
    options: ['كَتَبَ', 'كَاتَبَ', 'كَتَبَا']
  },
  {
    id: 'beg_2',
    word: 'بَابٌ',
    meaning: 'مد بالألف مع تنوين ضم',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالألف',
    hint: 'استمع لحركة الفتحة الطويلة على الباء: بَا - بُـنْ',
    ruleExplanation: 'حرف المد هو الألف، والحرف الممدود هو الباء المفتوحة (بَا).',
    options: ['بَابٌ', 'بَبٌ', 'بَأبٌ']
  },
  {
    id: 'beg_3',
    word: 'نُورٌ',
    meaning: 'مد بالواو مع تنوين ضم',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالواو',
    hint: 'استمع للضمة الطويلة قبل الواو: نُو - رٌ',
    ruleExplanation: 'حرف المد هو الواو وتسبقه النون المضمومة (نُو).',
    options: ['نُورٌ', 'نُرٌ', 'نُوؤٌ']
  },
  {
    id: 'beg_4',
    word: 'حَلِيبٌ',
    meaning: 'مد بالياء',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالياء',
    hint: 'استمع للكسرة الطويلة قبل الياء: حَـ - لِيـ - بُـنْ',
    ruleExplanation: 'حرف المد هو الياء وتسبقه اللام المكسورة (لِيـ).',
    options: ['حَلِيبٌ', 'حَلِبٌ', 'حَلِئبٌ']
  },
  {
    id: 'beg_5',
    word: 'وَرْدَةٌ',
    meaning: 'تاء مربوطة واضحة في آخر الكلمة',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'taa_marbouta',
    categoryLabel: 'التاء المربوطة',
    hint: 'عند الوقف تنطق هاء (وَرْدَهْ)، وعند التحريك تنطق تاء (وَرْدَةٌ)، إذن تاء مربوطة!',
    ruleExplanation: 'التاء المربوطة (ـة / ة) تنطق هاء عند الوقف وتاء عند الحركة، ولها نقطتان.',
    options: ['وَرْدَةٌ', 'وَرْدَتٌ', 'وَرْدَهٌ']
  },
  {
    id: 'beg_6',
    word: 'سَمَكَةٌ',
    meaning: 'كلمة بحركات قصيرة وتاء مربوطة',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'taa_marbouta',
    categoryLabel: 'التاء المربوطة',
    hint: 'قف عليها: (سَمَكَهْ)، حركها: (سَمَكَةٌ)، تنتهي بتاء مربوطة منفصلة.',
    ruleExplanation: 'تنتهي بتاء مربوطة متصلة بالحرف قبلها، وتنطق هاء في الوقف.',
    options: ['سَمَكَةٌ', 'سَمَكَتٌ', 'سَمَكَهٌ']
  },
  {
    id: 'beg_7',
    word: 'قَلَمٌ',
    meaning: 'كلمة ثلاثية مع تنوين ضم',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'tanween',
    categoryLabel: 'تنوين الضم',
    hint: 'استمع لنغمة التنوين في الآخر: قَـ - لَـ - مُـنْ، ولا نكتب حرف نون!',
    ruleExplanation: 'التنوين ضمتان فوق الميم (ـٌ) يلفظ نوناً ساكنة ولا يكتب نوناً.',
    options: ['قَلَمٌ', 'قَلَمُنْ', 'قَلَمْ']
  },
  {
    id: 'beg_8',
    word: 'زُهُورٌ',
    meaning: 'مد بالواو وتنوين ضم',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالواو',
    hint: 'ضمة طويلة على الهاء: زُ - هُو - رٌ',
    ruleExplanation: 'حرف المد هو الواو والحرف الممدود هو الهاء (هُو).',
    options: ['زُهُورٌ', 'زُهُرٌ', 'زُهُؤرٌ']
  },
  {
    id: 'beg_9',
    word: 'بَيْتٌ',
    meaning: 'تاء مفتوحة أصلية',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'taa_marbouta',
    categoryLabel: 'التاء المفتوحة',
    hint: 'قف عليها بالسكون: (بَيْتْ)، تبقى تاء واضحة لا تتغير!',
    ruleExplanation: 'التاء المفتوحة (ت) تنطق تاء في الوقف وفي الوصل دائماً.',
    options: ['بَيْتٌ', 'بَيْةٌ', 'بَيْتهٌ']
  },
  {
    id: 'beg_10',
    word: 'مِيَاهٌ',
    meaning: 'هاء أصلية في آخر الكلمة',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'taa_marbouta',
    categoryLabel: 'الهاء في آخر الكلمة',
    hint: 'تنطق هاء في الوقف والوصل (مِيَاهُ النَّهْرِ)، ولا توضع فوقها نقطتان!',
    ruleExplanation: 'الهاء الأصلية (ـه / ه) تنطق هاء دائماً وبدون نقاط.',
    options: ['مِيَاهٌ', 'مِيَاةٌ', 'مِيَاتٌ']
  },
  {
    id: 'beg_11',
    word: 'شَارِعٌ',
    meaning: 'مد بالألف مع كسرة',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'المد بالألف',
    hint: 'استمع لحرف المد بعد الشين: شَا - رِ - عٌ',
    ruleExplanation: 'حرف المد هو الألف والحرف الممدود هو الشين المفتوحة (شَا).',
    options: ['شَارِعٌ', 'شَرِعٌ', 'شَأرِعٌ']
  },
  {
    id: 'beg_12',
    word: 'دَرَجٌ',
    meaning: 'حركات قصيرة مع راء وجيم',
    level: 'beginner',
    levelLabel: 'المستوى المبتدئ',
    category: 'madd',
    categoryLabel: 'الحركات القصيرة',
    hint: 'ثلاثة حروف مفتوحة: دَ - رَ - جٌ',
    ruleExplanation: 'كلمة بسيطة بحركات قصيرة خالية من حروف المد.',
    options: ['دَرَجٌ', 'دَارَجٌ', 'دَرَاجٌ']
  },

  // ==========================================
  // ٢. المستوى المتوسط (أبطال التحدي ⚡)
  // الـ الشمسية والقمرية، التنوين بأنواعه، همزة الوصل والقطع البسيطة
  // ==========================================
  {
    id: 'mid_1',
    word: 'الشَّمْسُ',
    meaning: 'الـ شمسية (اللام مدغمة لا تنطق والحرف بعدها مشدد)',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'shamsiya_qamariya',
    categoryLabel: 'الـ الشمسية',
    hint: 'تُكتب اللام ولا تُلفظ، والشين بعدها مشددة: اَشَّـ - مْـ - سُ',
    ruleExplanation: 'الـ الشمسية تكتب ولا تنطق ويأتي بعدها حرف مشدد.',
    options: ['الشَّمْسُ', 'اشَّمْسُ', 'ألشَمْسُ']
  },
  {
    id: 'mid_2',
    word: 'الْقَمَرُ',
    meaning: 'الـ قمرية (اللام ساكنة ظاهرة في النطق)',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'shamsiya_qamariya',
    categoryLabel: 'الـ القمرية',
    hint: 'اللام ساكنة مستقرة تنطق بوضوح: اَلْـ - قَـ - مَـ - رُ',
    ruleExplanation: 'الـ القمرية تكتب وتنطق وعلامتها السكون فوق اللام.',
    options: ['الْقَمَرُ', 'لقَمَرُ', 'ألقَمَرُ']
  },
  {
    id: 'mid_3',
    word: 'الصَّدِيقُ',
    meaning: 'الـ شمسية مع صاد مشددة ومد بالياء',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'shamsiya_qamariya',
    categoryLabel: 'الـ الشمسية والتشديد',
    hint: 'الصاد حرف شمسي، تدغم اللام فيه ويصبح مشدداً: اَصَّـ - دِيـ - قُ',
    ruleExplanation: 'اللام الشمسية تدغم في حرف الصاد المشدد ويليه مد بالياء.',
    options: ['الصَّدِيقُ', 'اصَّدِيقُ', 'الصَدِيقُ']
  },
  {
    id: 'mid_4',
    word: 'قَلَمًا',
    meaning: 'تنوين فتح تلحقه ألف التنوين',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'tanween',
    categoryLabel: 'تنوين الفتح وألفه',
    hint: 'تنوين الفتح يحتاج ألفاً زائدة في آخره (ما عدا التاء المربوطة والهمزة)!',
    ruleExplanation: 'تنوين الفتح تلحقه ألف تنوين زائدة مع أغلب الحروف.',
    options: ['قَلَمًا', 'قَلَمَنْ', 'قَلَماًن']
  },
  {
    id: 'mid_5',
    word: 'سَمَاءً',
    meaning: 'تنوين فتح بعد الهمزة المسبوقة بألف مد',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'tanween',
    categoryLabel: 'تنوين الهمزة المتطرفة',
    hint: 'الهمزة المسبوقة بألف لا نضع بعدها ألف تنوين أخرى! (لا تجلس بين ألفين)',
    ruleExplanation: 'الهمزة المتطرفة على السطر إذا سبقها ألف مد لا تزاد بعدها ألف التنوين.',
    options: ['سَمَاءً', 'سَمَاءًا', 'سَمَاءَنْ']
  },
  {
    id: 'mid_6',
    word: 'كِتَابٍ',
    meaning: 'تنوين كسر تحت الباء',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'tanween',
    categoryLabel: 'تنوين الكسر',
    hint: 'كسرتان تحت الحرف الأخير ولا نكتب نوناً: كِـ - تَا - بٍ',
    ruleExplanation: 'تنوين الكسر يرسم كسرتين تحت الحرف الأخير في الاسم المنون.',
    options: ['كِتَابٍ', 'كِتَابِنْ', 'كِتَابِ']
  },
  {
    id: 'mid_7',
    word: 'طَالِبَاتٌ',
    meaning: 'جمع مؤنث سالم ينتهي بتاء مفتوحة',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'taa_marbouta',
    categoryLabel: 'تاء جمع المؤنث السالم',
    hint: 'جمع المؤنث السالم ينتهي بألف وتاء مفتوحة دائماً (ـات).',
    ruleExplanation: 'كل جمع مؤنث سالم ينتهي بتاء مفتوحة تسبقها ألف مد.',
    options: ['طَالِبَاتٌ', 'طَالِبَاةٌ', 'طَالِبَاتْ']
  },
  {
    id: 'mid_8',
    word: 'أَكْرَمَ',
    meaning: 'همزة قطع في أول الفعل الرباعي',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'hamzat',
    categoryLabel: 'همزة القطع',
    hint: 'ضع قبلها واواً: (وَأَكْرَمَ)، ما زالت الهمزة ظاهرة في النطق، إذن همزة قطع!',
    ruleExplanation: 'همزة القطع تثبت نطقاً ورسماً في أول الكلمة ووسطها.',
    options: ['أَكْرَمَ', 'اكْرَمَ', 'إِكْرَمَ']
  },
  {
    id: 'mid_9',
    word: 'انْتَبَهَ',
    meaning: 'همزة وصل في أول الفعل الخماسي',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'hamzat',
    categoryLabel: 'همزة الوصل',
    hint: 'ضع قبلها واواً: (وَانْتَبَهَ)، تسقط الهمزة لفظاً، لذلك تكتب ألفاً بدون رأس عين!',
    ruleExplanation: 'همزة الوصل تنطق في بداية الكلام وتسقط عند وصلها بما قبلها وتكتب (ا).',
    options: ['انْتَبَهَ', 'أنْتَبَهَ', 'إنْتَبَهَ']
  },
  {
    id: 'mid_10',
    word: 'النَّافِذَةُ',
    meaning: 'الـ شمسية ومد بالألف وتاء مربوطة',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'shamsiya_qamariya',
    categoryLabel: 'الـ الشمسية والتاء المربوطة',
    hint: 'النون حرف شمسي مشدد، والكلمة تنتهي بتاء مربوطة: اَنَّـ - ا - فِـ - ذَ - تُ',
    ruleExplanation: 'اجتمعت الـ الشمسية مع تاء مربوطة في نهاية الكلمة.',
    options: ['النَّافِذَةُ', 'انَّافِذَةُ', 'النَّافِذَتُ']
  },
  {
    id: 'mid_11',
    word: 'الْمَدْرَسَةُ',
    meaning: 'الـ قمرية وتاء مربوطة وسكون',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'shamsiya_qamariya',
    categoryLabel: 'الـ القمرية والتاء المربوطة',
    hint: 'اللام قمرية ساكنة تنطق، والكلمة تنتهي بتاء مربوطة: اَلْـ - مَدْ - رَ - سَـ - تُ',
    ruleExplanation: 'الـ قمرية ساكنة تنطق وتكتب والتاء في آخرها مربوطة.',
    options: ['الْمَدْرَسَةُ', 'المَدْرَسَتُ', 'ألمَدْرَسَةُ']
  },
  {
    id: 'mid_12',
    word: 'يُسْرًا',
    meaning: 'تنوين فتح على الراء مع ألف تنوين',
    level: 'intermediate',
    levelLabel: 'المستوى المتوسط',
    category: 'tanween',
    categoryLabel: 'تنوين الفتح',
    hint: 'تنوين فتح يلحقه ألف: يُـ - سْـ - رًا (﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾).',
    ruleExplanation: 'تنوين الفتح على الراء تلحقه ألف التنوين.',
    options: ['يُسْرًا', 'يُسْرَنْ', 'يُسْراًن']
  },

  // ==========================================
  // ٣. المستوى المحترف (فرسان وعباقرة الإملاء 👑)
  // الهمزات المتوسطة والمتطرفة، الألف اللينة، الحروف المحذوفة والزائدة
  // ==========================================
  {
    id: 'pro_1',
    word: 'سُؤَالٌ',
    meaning: 'همزة متوسطة على واو',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتوسطة على الواو',
    hint: 'الهمزة مفتوحة وقبلها سين مضمومة (سُـ - أَ)، والضمة أقوى من الفتحة ويناسبها الواو!',
    ruleExplanation: 'قاعدة أقوى الحركات: الضمة أقوى من الفتحة، لذا رسمت الهمزة على واو.',
    options: ['سُؤَالٌ', 'سُأَالٌ', 'سُئَالٌ']
  },
  {
    id: 'pro_2',
    word: 'ذِئْبٌ',
    meaning: 'همزة متوسطة على ياء (نبرة)',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتوسطة على الياء',
    hint: 'الهمزة ساكنة وقبلها ذال مكسورة (ذِ - ئْ)، والكسرة هي أقوى الحركات ويناسبها الياء!',
    ruleExplanation: 'الكسرة أقوى الحركات في الإملاء، فإذا سبقت الهمزة رسمت على نبرة/ياء.',
    options: ['ذِئْبٌ', 'ذِؤْبٌ', 'ذِأْبٌ']
  },
  {
    id: 'pro_3',
    word: 'مَسْؤُولٌ',
    meaning: 'همزة متوسطة مضمومة بعد ساكن',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتوسطة على الواو',
    hint: 'السين ساكنة والهمزة مضمومة (مَسْـ - أُو)، والضمة أقوى من السكون ويناسبها الواو!',
    ruleExplanation: 'الهمزة مضمومة وما قبلها ساكن، والضمة تغلب السكون فتكتب على واو.',
    options: ['مَسْؤُولٌ', 'مَسْأُولٌ', 'مَسْئُولٌ']
  },
  {
    id: 'pro_4',
    word: 'رَأْسٌ',
    meaning: 'همزة متوسطة على ألف',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتوسطة على الألف',
    hint: 'الراء مفتوحة والهمزة ساكنة (رَ - أْ)، والفتحة أقوى من السكون ويناسبها الألف!',
    ruleExplanation: 'الهمزة ساكنة بعد فتح، والفتحة أقوى من السكون فيناسبها الألف.',
    options: ['رَأْسٌ', 'رَؤْسٌ', 'رَئْسٌ']
  },
  {
    id: 'pro_5',
    word: 'قِرَاءَةٌ',
    meaning: 'همزة متوسطة مفتوحة بعد ألف مد ترسم على السطر',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتوسطة المفردة على السطر',
    hint: 'الهمزة مفتوحة وجاءت بعد ألف مد ساكنة (قِرَا - ءَ - ة)، فتفرد على السطر!',
    ruleExplanation: 'الهمزة المتوسطة المفتوحة بعد ألف ساكنة ترسم مفردة على السطر كراهية توالي الألفات.',
    options: ['قِرَاءَةٌ', 'قِرَأَةٌ', 'قِرَائَةٌ']
  },
  {
    id: 'pro_6',
    word: 'شَاطِئٌ',
    meaning: 'همزة متطرفة على ياء غير منقوطة',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتطرفة على الياء',
    hint: 'انظر لحركة الحرف الذي قبل الهمزة فقط: الطاء مكسورة (طِ)، والكسرة يناسبها الياء!',
    ruleExplanation: 'الهمزة المتطرفة تكتب على حرف يناسب حركة ما قبلها، وما قبلها مكسور.',
    options: ['شَاطِئٌ', 'شَاطِءٌ', 'شَاطِؤٌ']
  },
  {
    id: 'pro_7',
    word: 'بُطْءٌ',
    meaning: 'همزة متطرفة على السطر بعد حرف ساكن',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'hamzat',
    categoryLabel: 'الهمزة المتطرفة على السطر',
    hint: 'الطاء ساكنة (بُطْـ)، والهمزة المتطرفة بعد الساكن تكتب منفردة على السطر!',
    ruleExplanation: 'الهمزة المتطرفة ترسم على السطر إذا سبقها حرف ساكن أو حرف مد.',
    options: ['بُطْءٌ', 'بُطْئٌ', 'بُطْؤٌ']
  },
  {
    id: 'pro_8',
    word: 'دَعَا',
    meaning: 'ألف لينة ممدودة في آخر الفعل الثلاثي',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'advanced_rules',
    categoryLabel: 'الألف اللينة المتطرفة',
    hint: 'هات المضارع: (يَدْعُو)، أصل الألف واو، إذن تكتب ألفاً قائمة ممدودة (دَعَا)!',
    ruleExplanation: 'الألف اللينة في الأفعال الثلاثية ترسم قائمة (ا) إذا كان أصلها واواً.',
    options: ['دَعَا', 'دَعَى', 'دَعَأ']
  },
  {
    id: 'pro_9',
    word: 'قَضَى',
    meaning: 'ألف لينة مقصورة (على صورة الياء غير المنقوطة)',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'advanced_rules',
    categoryLabel: 'الألف اللينة المقصورة',
    hint: 'هات المضارع: (يَقْضِي)، أصل الألف ياء، إذن تكتب على صورة الياء (قَضَى)!',
    ruleExplanation: 'الألف اللينة في الأفعال الثلاثية ترسم على صورة ياء (ى) إذا كان أصلها ياء.',
    options: ['قَضَى', 'قَضَا', 'قَضَأ']
  },
  {
    id: 'pro_10',
    word: 'كَتَبُوا',
    meaning: 'واو الجماعة تلحقها ألف التفريق الفارقة',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'advanced_rules',
    categoryLabel: 'ألف التفريق الفارقة',
    hint: 'واو الجماعة في الأفعال نضع بعدها ألفاً فارقة تكتب ولا تنطق (كَتَبُوا)!',
    ruleExplanation: 'ألف التفريق تزاد بعد واو الجماعة للتفريق بينها وبين الواو الأصلية.',
    options: ['كَتَبُوا', 'كَتَبُو', 'كَتَبُوْن']
  },
  {
    id: 'pro_11',
    word: 'هَـٰذَا',
    meaning: 'اسم إشارة فيه ألف تنطق ولا تكتب',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'advanced_rules',
    categoryLabel: 'حروف تنطق ولا تكتب',
    hint: 'تنطق: (هَاذَا) لكننا نحذف الألف كتابة ونكتبها (هَذَا / هَـٰذَا) بدون مد ظاهر!',
    ruleExplanation: 'حذفت الألف رسماً بعد الهاء في أسماء الإشارة للتخفيف.',
    options: ['هَـٰذَا', 'هَاذَا', 'هَذَاة']
  },
  {
    id: 'pro_12',
    word: 'لَـٰكِنْ',
    meaning: 'حرف استدراك فيه ألف تنطق ولا تكتب بعد اللام',
    level: 'pro',
    levelLabel: 'المستوى المحترف',
    category: 'advanced_rules',
    categoryLabel: 'حروف تنطق ولا تكتب',
    hint: 'تنطق: (لَاكِنْ) ولكن نحذف الألف رسماً ونكتبها (لَكِنْ / لَـٰكِنْ)!',
    ruleExplanation: 'تحذف الألف رسماً من وسط (لكنْ ولَكِنَّ) رسماً وتثبت لفظاً.',
    options: ['لَـٰكِنْ', 'لَاكِنْ', 'لَكِنْة']
  }
];

interface SpellingHeroesStudioProps {
  studentName?: string;
  onAddStar?: () => void;
}

export const SpellingHeroesStudio: React.FC<SpellingHeroesStudioProps> = ({
  studentName = 'فهد',
  onAddStar
}) => {
  const [currentLevel, setCurrentLevel] = useState<SpellingLevel>('beginner');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mode, setMode] = useState<'visual' | 'listen' | 'quest'>('visual');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [levelScores, setLevelScores] = useState<Record<SpellingLevel, number>>({
    beginner: 0,
    intermediate: 0,
    pro: 0
  });
  const [showCertificate, setShowCertificate] = useState(false);

  // Filter words strictly by chosen level and category
  const levelWords = SPELLING_DATA.filter(w => w.level === currentLevel);
  const filteredWords = selectedCategory === 'all'
    ? levelWords
    : levelWords.filter(w => w.category === selectedCategory);

  const currentWord = filteredWords[currentIndex] || filteredWords[0] || levelWords[0];

  const handleSpeak = (text: string, rate: number = 0.85) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCheckSpelling = () => {
    if (!currentWord) return;
    // Normalize both for soft comparison (remove diacritics and normalize alif)
    const cleanUser = userInput.trim().replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا');
    const cleanTarget = currentWord.word.trim().replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا');

    if (cleanUser === cleanTarget) {
      audioManager.play('correct');
      setFeedback('correct');
      setLevelScores(prev => ({
        ...prev,
        [currentLevel]: prev[currentLevel] + 1
      }));
      if (onAddStar) onAddStar();
    } else {
      audioManager.play('wrong');
      setFeedback('wrong');
    }
  };

  const handleSelectOption = (opt: string) => {
    if (!currentWord) return;
    if (opt === currentWord.word) {
      audioManager.play('correct');
      setFeedback('correct');
      setLevelScores(prev => ({
        ...prev,
        [currentLevel]: prev[currentLevel] + 1
      }));
      if (onAddStar) onAddStar();
    } else {
      audioManager.play('wrong');
      setFeedback('wrong');
    }
  };

  const handleNextWord = () => {
    audioManager.play('click');
    setFeedback(null);
    setUserInput('');
    setIsWordVisible(mode === 'visual');
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevWord = () => {
    audioManager.play('click');
    setFeedback(null);
    setUserInput('');
    setIsWordVisible(mode === 'visual');
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLevelChange = (lvl: SpellingLevel) => {
    audioManager.play('click');
    setCurrentLevel(lvl);
    setSelectedCategory('all');
    setCurrentIndex(0);
    setFeedback(null);
    setUserInput('');
    setIsWordVisible(mode === 'visual');
  };

  // Level Definitions & Metadata
  const levelsConfig = [
    {
      id: 'beginner' as SpellingLevel,
      title: 'مبتدئ 🌱',
      badge: 'براعم الإملاء',
      gradeHint: 'للصف الأول والتأسيس',
      description: 'كلمات ثلاثية، حركات قصيرة، مدود واضحة، وتاء مربوطة بسيطة',
      activeBg: 'bg-emerald-600 text-white border-emerald-600 shadow-md',
      pillColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeColor: 'bg-emerald-500',
      heroRank: 'نجم الإملاء الواعد ⭐',
      count: SPELLING_DATA.filter(w => w.level === 'beginner').length
    },
    {
      id: 'intermediate' as SpellingLevel,
      title: 'متوسط ⚡',
      badge: 'أبطال التحدي',
      gradeHint: 'للصف الثاني والثالث',
      description: 'الـ الشمسية والقمرية، التنوين بأنواعه (فتح وضم وكسر)، والهمزات البسيطة',
      activeBg: 'bg-amber-500 text-slate-950 border-amber-500 shadow-md',
      pillColor: 'bg-amber-50 text-amber-900 border-amber-300',
      badgeColor: 'bg-amber-500',
      heroRank: 'فارس الإملاء المتألق ⚡',
      count: SPELLING_DATA.filter(w => w.level === 'intermediate').length
    },
    {
      id: 'pro' as SpellingLevel,
      title: 'محترف 👑',
      badge: 'فرسان وعباقرة الإملاء',
      gradeHint: 'للصفوف العليا والمتوسطة',
      description: 'الهمزات المتوسطة والمتطرفة بقواعدها، الألف اللينة، والحروف المحذوفة والزائدة',
      activeBg: 'bg-rose-600 text-white border-rose-600 shadow-md',
      pillColor: 'bg-rose-50 text-rose-900 border-rose-300',
      badgeColor: 'bg-rose-600',
      heroRank: 'ملك وعبقري الإملاء الأكبر 👑',
      count: SPELLING_DATA.filter(w => w.level === 'pro').length
    }
  ];

  const activeLevelConfig = levelsConfig.find(l => l.id === currentLevel) || levelsConfig[0];

  // Dynamic categories based on available categories in this level
  const availableCategories = Array.from(new Set(levelWords.map(w => w.category)));
  const categoryLabelsMap: Record<string, string> = {
    madd: 'المدود والحركات ✍️',
    shamsiya_qamariya: 'الـ الشمسية والقمرية ☀️🌙',
    taa_marbouta: 'التاء المربوطة والمفتوحة 🌸',
    tanween: 'التنوين بأنواعه 🔔',
    hamzat: 'الهمزات وقواعدها ⚡',
    advanced_rules: 'قواعد الألف اللينة والزيادة 📜'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans" style={{ direction: 'rtl' }}>
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/25">
              <span>👑 معمل الإملاء المتدرج</span>
              <span>•</span>
              <span>٣ مستويات متدرجة الصعوبة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-alexandria">
              أبطال الإملاء ✍️
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 mt-2 max-w-xl leading-relaxed font-medium">
              اختر مستواك المفضل وتحدَّ نفسك تدريجياً: من الكلمات البسيطة والحركات، إلى الـ الشمسية والتنوين، وصولاً إلى أصعب الهمزات والألف اللينة!
            </p>
          </div>

          {/* Child Score Badge & Level Rank */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/25 text-center shrink-0 min-w-[190px] shadow-lg">
            <span className="text-3xl block mb-1">👑</span>
            <span className="text-[11px] font-bold text-orange-100 block">{activeLevelConfig.heroRank}</span>
            <span className="text-2xl font-black text-amber-200">
              {levelScores[currentLevel]} كلمة متقنة
            </span>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="text-[10px] text-orange-200">المجموع الكلي:</span>
              <span className="text-xs font-black text-white">
                {levelScores.beginner + levelScores.intermediate + levelScores.pro} ⭐
              </span>
            </div>
            {(levelScores[currentLevel] >= 3 || (levelScores.beginner + levelScores.intermediate + levelScores.pro) >= 5) && (
              <button
                onClick={() => setShowCertificate(true)}
                className="mt-2.5 text-[11px] font-black bg-white text-orange-700 px-3 py-1 rounded-xl shadow-xs hover:bg-orange-50 transition-all cursor-pointer block w-full active:scale-95"
              >
                وسام بطل الإملاء 🎖️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* LEVEL SELECTOR RIBBON (Beginner, Intermediate, Pro)  */}
      {/* ==================================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-black text-slate-900 font-alexandria">
              اختر مستوى التحدي الإملائي:
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            القسم المختار: {activeLevelConfig.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {levelsConfig.map((lvl) => {
            const isSelected = currentLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => handleLevelChange(lvl.id)}
                className={`p-4 rounded-2xl border-2 text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `${lvl.activeBg} ring-2 ring-orange-400 scale-[1.02]`
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base sm:text-lg font-black font-alexandria">
                      {lvl.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-black/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lvl.gradeHint}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-white/90' : 'text-slate-500'
                    }`}
                  >
                    {lvl.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-white/90' : 'text-slate-400'}>
                    {lvl.count} كلمات تدريبية
                  </span>
                  <span className={isSelected ? 'text-white font-black' : 'text-orange-600 font-black'}>
                    {isSelected ? '✓ المستوى النشط' : 'اختيار المستوى ◀'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => {
            setMode('visual');
            setIsWordVisible(true);
            setFeedback(null);
            setUserInput('');
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'visual'
              ? 'bg-white text-orange-700 shadow-md font-black border border-orange-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>الإملاء المنظور (احفظ واكتب)</span>
        </button>

        <button
          onClick={() => {
            setMode('listen');
            setIsWordVisible(false);
            setFeedback(null);
            setUserInput('');
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'listen'
              ? 'bg-white text-rose-700 shadow-md font-black border border-rose-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>الإملاء المسموع (اختباري)</span>
        </button>

        <button
          onClick={() => {
            setMode('quest');
            setFeedback(null);
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'quest'
              ? 'bg-white text-purple-700 shadow-md font-black border border-purple-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>تحدي الإملاء الصحيح ⚡</span>
        </button>
      </div>

      {/* Category Filter Pills for Current Level */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentIndex(0);
            setFeedback(null);
            setUserInput('');
            setIsWordVisible(mode === 'visual');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          جميع ظواهر {activeLevelConfig.title} 🌟 ({levelWords.length})
        </button>

        {availableCategories.map((catKey) => (
          <button
            key={catKey}
            onClick={() => {
              setSelectedCategory(catKey);
              setCurrentIndex(0);
              setFeedback(null);
              setUserInput('');
              setIsWordVisible(mode === 'visual');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === catKey
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {categoryLabelsMap[catKey] || catKey}
          </button>
        ))}
      </div>

      {/* Main Interactive Word Card */}
      {currentWord ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center relative overflow-hidden">
          {/* Card Top Level Ribbon */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${activeLevelConfig.pillColor}`}>
                {activeLevelConfig.title}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {currentWord.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>الكلمة {currentIndex + 1} من {filteredWords.length}</span>
            </div>
          </div>

          {/* Audio Play Button */}
          <div className="mb-6 flex justify-center items-center gap-3">
            <button
              onClick={() => handleSpeak(currentWord.word, 0.85)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="استمع لنطق الكلمة"
            >
              <Volume2 className="w-8 h-8" />
            </button>

            <button
              onClick={() => handleSpeak(currentWord.word, 0.55)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="استماع بطيء لتمييز المقاطع"
            >
              <span>نطق بطيء</span>
              <span>🐢</span>
            </button>
          </div>

          {/* MODE 1: VISUAL DICTATION (Show then Hide) */}
          {mode === 'visual' && (
            <div className="my-6">
              {isWordVisible ? (
                <div>
                  <div className="text-4xl sm:text-6xl font-black text-slate-900 tracking-wide font-alexandria py-5 bg-orange-50/50 rounded-2xl border-2 border-orange-200">
                    {currentWord.word}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium">
                    انظر جيداً للكلمة وركز في حروفها وحركاتها، ثم اضغط على «أنا جاهز للكتابة» لاختبار ذاكرتك الإملائية!
                  </p>
                  <button
                    onClick={() => {
                      setIsWordVisible(false);
                      audioManager.play('click');
                    }}
                    className="mt-4 px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    أنا جاهز للكتابة! (إخفاء الكلمة 🙈)
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-slate-400 py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mb-4">
                    اكتب الكلمة التي حفظتها الآن بدقة ✍️
                  </div>
                  <button
                    onClick={() => setIsWordVisible(true)}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1 mx-auto mb-4 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>أريد تذكر الكلمة (إظهار مؤقت)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: LISTEN & WRITE */}
          {mode === 'listen' && (
            <div className="my-6">
              <div className="text-xl sm:text-2xl font-bold text-slate-700 py-3 bg-rose-50/50 rounded-2xl border border-rose-200 mb-4">
                استمع إلى الصوت واكتب الكلمة إملائياً بدقة 🎧
              </div>
            </div>
          )}

          {/* INPUT FIELD (for visual & listen mode) */}
          {(mode === 'visual' || mode === 'listen') && (!isWordVisible || mode === 'listen') && (
            <div className="max-w-md mx-auto my-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckSpelling()}
                  placeholder="اكتب الكلمة هنا..."
                  className="flex-1 text-center text-2xl font-bold font-alexandria p-3 rounded-2xl border-2 border-slate-300 focus:border-orange-500 focus:outline-hidden bg-slate-50"
                  autoFocus
                />
                <button
                  onClick={handleCheckSpelling}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  تحقق ✓
                </button>
              </div>

              {/* Virtual Diacritics Helper */}
              <div className="flex items-center justify-center gap-1 mt-3 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold ml-1">حركات سريعة:</span>
                {['َ', 'ُ', 'ِ', 'ّ', 'ً', 'ٌ', 'ٍ', 'ْ'].map((mark) => (
                  <button
                    key={mark}
                    onClick={() => setUserInput(prev => prev + mark)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-800 font-black text-base flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
                  >
                    {mark}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: QUEST / MULTIPLE CHOICE */}
          {mode === 'quest' && currentWord.options && (
            <div className="my-6 max-w-lg mx-auto">
              <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-4">
                أي الكلمات التالية مكتوبة إملائياً بالشكل الصحيح؟
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentWord.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-xl font-black font-alexandria text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {feedback === 'correct' && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 font-black text-lg text-emerald-700 mb-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>إجابة صحيحة يا {activeLevelConfig.heroRank}! 🌟</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-bold">
                {currentWord.ruleExplanation}
              </p>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 font-black text-base text-rose-700 mb-1">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>حاول مرة أخرى! انتبه للقاعدة الإملائية:</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                الكلمة الصحيحة هي: <strong className="font-black text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-rose-200">{currentWord.word}</strong>
              </p>
              <p className="text-[11px] text-rose-700 mt-1">
                تلميح: {currentWord.hint}
              </p>
            </div>
          )}

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
            <button
              onClick={handlePrevWord}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الكلمة السابقة</span>
            </button>

            <button
              onClick={handleNextWord}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>الكلمة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-md">
          <p className="text-slate-500 font-bold">لا توجد كلمات في هذا التصنيف حالياً.</p>
        </div>
      )}

      {/* Certificate Modal for Spelling Hero */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-400 text-center shadow-2xl relative">
            <span className="text-5xl block mb-2">👑</span>
            <h2 className="text-2xl font-black font-alexandria text-slate-900 mb-1">
              وسام بطل الإملاء
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              مُنح هذا الوسام تقديراً لتفوقك وإتقانك المهارات الإملائية في {activeLevelConfig.title}
            </p>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-4">
              <span className="text-xs text-amber-800 block">اسم البطل المتألق:</span>
              <span className="text-xl font-black text-slate-900 font-alexandria">{studentName}</span>
              <div className="mt-2 text-xs font-bold text-amber-900">
                اللقب المستحق: <span className="text-orange-700 font-black">{activeLevelConfig.heroRank}</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                أتقن {levelScores[currentLevel]} كلمة في {activeLevelConfig.title}، بمجموع {levelScores.beginner + levelScores.intermediate + levelScores.pro} كلمة متقنة! ⭐
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوسام</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
