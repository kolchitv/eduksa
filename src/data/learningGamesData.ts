/**
 * بنية بيانات مركزية للألعاب التعليمية
 * تتيح إضافة حروف، مقاطع، كلمات، صور، جمل، وقصص بدون تعديل كود الألعاب
 */

export type GameTrackId = 'letters' | 'harakat' | 'madd_syllables' | 'words_spelling' | 'reading_fluency';

export interface GameTrackInfo {
  id: GameTrackId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  targetSkill: string;
  levelsCount: number;
}

export const GAME_TRACKS: GameTrackInfo[] = [
  {
    id: 'letters',
    title: 'عالم الحروف',
    subtitle: 'شكل الحرف وصوته ومواضعه',
    emoji: '🔤',
    color: 'emerald',
    borderColor: 'border-emerald-400',
    bgGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    description: 'تعرف على شكل الحرف، اسمع صوته، ميزه بين الحروف، واكتشف مواضعه في أول ووسط وآخر الكلمة.',
    targetSkill: 'الوعي الصوتي والبصري للحروف الهجائية الـ 28',
    levelsCount: 6
  },
  {
    id: 'harakat',
    title: 'عالم الحركات',
    subtitle: 'الفتحة والضمة والكسرة والسكون',
    emoji: '🌈',
    color: 'amber',
    borderColor: 'border-amber-400',
    bgGradient: 'from-amber-400 via-orange-500 to-amber-600',
    description: 'أتقن نطق الحركات القصيرة، اسحب الحركة فوق الحرف، وميز السكون عن الحركة بكل سهولة.',
    targetSkill: 'أصوات الحركات القصيرة والمقطع الساكن',
    levelsCount: 5
  },
  {
    id: 'madd_syllables',
    title: 'عالم المدود والمقاطع',
    subtitle: 'الصوت الطويل ودمج المقاطع',
    emoji: '🚀',
    color: 'sky',
    borderColor: 'border-sky-400',
    bgGradient: 'from-sky-500 via-indigo-500 to-blue-600',
    description: 'ميز بين الصوت القصير والطويل (المد بالألف والواو والياء)، وركب المقاطع في قطار الكلمات.',
    targetSkill: 'المدود الثلاثة والتحليل والتركيب المقطعي',
    levelsCount: 6
  },
  {
    id: 'words_spelling',
    title: 'عالم الكلمات والإملاء',
    subtitle: 'بناء الكلمة والإملاء المتدرج',
    emoji: '🧩',
    color: 'purple',
    borderColor: 'border-purple-400',
    bgGradient: 'from-purple-500 via-violet-500 to-indigo-600',
    description: 'ابنِ الكلمة بالحروف والمقاطع، طابق الصورة بالكلمة، واكتب ما تسمعه بتدرج ذكي وممتع.',
    targetSkill: 'التركيب الإملائي من المقطع إلى الكلمة والجملة',
    levelsCount: 8
  },
  {
    id: 'reading_fluency',
    title: 'عالم القراءة والطلاقة',
    subtitle: 'من التهجئة البطيئة إلى الانطلاق',
    emoji: '📖',
    color: 'rose',
    borderColor: 'border-rose-400',
    bgGradient: 'from-rose-500 via-pink-500 to-red-600',
    description: 'القراءة البرقية، سباق القراءة، الجملة المختفية، والقراءة المتكررة لتصل لطلاقة وانطلاق ممتع.',
    targetSkill: 'السرعة والطلاقة والفهم القرائي بدون توتر',
    levelsCount: 8
  }
];

// 1. بيانات الحروف وأشكالها ومواضعها
export interface LetterItem {
  id: string;
  char: string;
  name: string;
  soundAudioText: string;
  positions: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  sampleWords: {
    initial: { word: string; emoji: string };
    medial: { word: string; emoji: string };
    final: { word: string; emoji: string };
  };
  confusingLetters: string[]; // حروف يسهل الخلط معها
}

export const CENTRAL_LETTERS_DATA: LetterItem[] = [
  {
    id: 'alif',
    char: 'أ',
    name: 'أَلِف',
    soundAudioText: 'أَ',
    positions: { isolated: 'أ', initial: 'أَ', medial: 'ـأَ', final: 'ـأَ' },
    sampleWords: {
      initial: { word: 'أَسَد', emoji: '🦁' },
      medial: { word: 'فَأْر', emoji: '🐭' },
      final: { word: 'قَرَأَ', emoji: '📖' }
    },
    confusingLetters: ['إ', 'آ', 'ل', 'و']
  },
  {
    id: 'baa',
    char: 'ب',
    name: 'بَاء',
    soundAudioText: 'بَ',
    positions: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
    sampleWords: {
      initial: { word: 'بَطَّة', emoji: '🦆' },
      medial: { word: 'حَبْل', emoji: '🪢' },
      final: { word: 'كَلْب', emoji: '🐶' }
    },
    confusingLetters: ['ت', 'ث', 'ن', 'ي']
  },
  {
    id: 'taa',
    char: 'ت',
    name: 'تَاء',
    soundAudioText: 'تَ',
    positions: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    sampleWords: {
      initial: { word: 'تُفَّاح', emoji: '🍎' },
      medial: { word: 'كِتَاب', emoji: '📚' },
      final: { word: 'بِنْت', emoji: '👧' }
    },
    confusingLetters: ['ب', 'ث', 'ط', 'ة']
  },
  {
    id: 'thaa',
    char: 'ث',
    name: 'ثَاء',
    soundAudioText: 'ثَ',
    positions: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
    sampleWords: {
      initial: { word: 'ثَعْلَب', emoji: '🦊' },
      medial: { word: 'كُمَّثْرَى', emoji: '🍐' },
      final: { word: 'مُثَلَّث', emoji: '📐' }
    },
    confusingLetters: ['ت', 'س', 'ص', 'ذ']
  },
  {
    id: 'jeem',
    char: 'ج',
    name: 'جِيم',
    soundAudioText: 'جَ',
    positions: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
    sampleWords: {
      initial: { word: 'جَمَل', emoji: '🐪' },
      medial: { word: 'شَجَرَة', emoji: '🌳' },
      final: { word: 'تَاج', emoji: '👑' }
    },
    confusingLetters: ['ح', 'خ', 'چ']
  },
  {
    id: 'haa',
    char: 'ح',
    name: 'حَاء',
    soundAudioText: 'حَ',
    positions: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
    sampleWords: {
      initial: { word: 'حِصَان', emoji: '🐎' },
      medial: { word: 'بَحْر', emoji: '🌊' },
      final: { word: 'تِمْسَاح', emoji: '🐊' }
    },
    confusingLetters: ['ج', 'خ', 'هـ']
  },
  {
    id: 'khaa',
    char: 'خ',
    name: 'خَاء',
    soundAudioText: 'خَ',
    positions: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
    sampleWords: {
      initial: { word: 'خَرُوف', emoji: '🐑' },
      medial: { word: 'نَخْلَة', emoji: '🌴' },
      final: { word: 'بِطِّيخ', emoji: '🍉' }
    },
    confusingLetters: ['ج', 'ح', 'غ']
  },
  {
    id: 'dal',
    char: 'د',
    name: 'دَال',
    soundAudioText: 'دَ',
    positions: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
    sampleWords: {
      initial: { word: 'دُبّ', emoji: '🐻' },
      medial: { word: 'حَدِيقَة', emoji: '🏡' },
      final: { word: 'وَلَد', emoji: '👦' }
    },
    confusingLetters: ['ذ', 'ر', 'ض', 'ط']
  },
  {
    id: 'dhal',
    char: 'ذ',
    name: 'ذَال',
    soundAudioText: 'ذَ',
    positions: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
    sampleWords: {
      initial: { word: 'ذُرَة', emoji: '🌽' },
      medial: { word: 'نَافِذَة', emoji: '🪟' },
      final: { word: 'قُنْفُذ', emoji: '🦔' }
    },
    confusingLetters: ['د', 'ز', 'ظ', 'ث']
  },
  {
    id: 'raa',
    char: 'ر',
    name: 'رَاء',
    soundAudioText: 'رَ',
    positions: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
    sampleWords: {
      initial: { word: 'رُمَّان', emoji: '🍎' },
      medial: { word: 'وَرْدَة', emoji: '🌹' },
      final: { word: 'نَمِر', emoji: '🐅' }
    },
    confusingLetters: ['ز', 'د', 'و', 'ل']
  },
  {
    id: 'zay',
    char: 'ز',
    name: 'زَاي',
    soundAudioText: 'زَ',
    positions: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
    sampleWords: {
      initial: { word: 'زَرَافَة', emoji: '🦒' },
      medial: { word: 'مَوْز', emoji: '🍌' },
      final: { word: 'خُبْز', emoji: '🍞' }
    },
    confusingLetters: ['ر', 'ذ', 'س']
  },
  {
    id: 'seen',
    char: 'س',
    name: 'سِين',
    soundAudioText: 'سَ',
    positions: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
    sampleWords: {
      initial: { word: 'سَمَكَة', emoji: '🐟' },
      medial: { word: 'مَسْجِد', emoji: '🕌' },
      final: { word: 'شَمْس', emoji: '☀️' }
    },
    confusingLetters: ['ش', 'ص', 'ث', 'ز']
  },
  {
    id: 'sheen',
    char: 'ش',
    name: 'شِين',
    soundAudioText: 'شَ',
    positions: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
    sampleWords: {
      initial: { word: 'شَمْس', emoji: '☀️' },
      medial: { word: 'مِشْمِش', emoji: '🍑' },
      final: { word: 'عُشّ', emoji: '🪺' }
    },
    confusingLetters: ['س', 'ص', 'ض']
  },
  {
    id: 'saad',
    char: 'ص',
    name: 'صَاد',
    soundAudioText: 'صَ',
    positions: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
    sampleWords: {
      initial: { word: 'صَقْر', emoji: '🦅' },
      medial: { word: 'عَصِير', emoji: '🧃' },
      final: { word: 'قَفَص', emoji: '🪵' }
    },
    confusingLetters: ['ض', 'س', 'ط']
  },
  {
    id: 'dhaad',
    char: 'ض',
    name: 'ضَاد',
    soundAudioText: 'ضَ',
    positions: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
    sampleWords: {
      initial: { word: 'ضِفْدَع', emoji: '🐸' },
      medial: { word: 'مِضْرَب', emoji: '🎾' },
      final: { word: 'بَيْض', emoji: '🥚' }
    },
    confusingLetters: ['ص', 'ظ', 'د', 'ط']
  },
  {
    id: 'taa_heavy',
    char: 'ط',
    name: 'طَاء',
    soundAudioText: 'طَ',
    positions: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
    sampleWords: {
      initial: { word: 'طَيَّارَة', emoji: '✈️' },
      medial: { word: 'قِطَّة', emoji: '🐱' },
      final: { word: 'بَطّ', emoji: '🦆' }
    },
    confusingLetters: ['ظ', 'ت', 'د', 'ض']
  },
  {
    id: 'dhaa_heavy',
    char: 'ظ',
    name: 'ظَاء',
    soundAudioText: 'ظَ',
    positions: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
    sampleWords: {
      initial: { word: 'ظَرْف', emoji: '✉️' },
      medial: { word: 'نَظَّارَة', emoji: '👓' },
      final: { word: 'حَظّ', emoji: '🍀' }
    },
    confusingLetters: ['ط', 'ض', 'ذ']
  },
  {
    id: 'ayn',
    char: 'ع',
    name: 'عَيْن',
    soundAudioText: 'عَ',
    positions: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
    sampleWords: {
      initial: { word: 'عَيْن', emoji: '👁️' },
      medial: { word: 'ثَعْلَب', emoji: '🦊' },
      final: { word: 'ضِفْدَع', emoji: '🐸' }
    },
    confusingLetters: ['غ', 'ء', 'ح']
  },
  {
    id: 'ghayn',
    char: 'غ',
    name: 'غَيْن',
    soundAudioText: 'غَ',
    positions: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
    sampleWords: {
      initial: { word: 'غَزَال', emoji: '🦌' },
      medial: { word: 'مَغْرِب', emoji: '🌇' },
      final: { word: 'دِمَاغ', emoji: '🧠' }
    },
    confusingLetters: ['ع', 'ف', 'خ']
  },
  {
    id: 'faa',
    char: 'ف',
    name: 'فَاء',
    soundAudioText: 'فَ',
    positions: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
    sampleWords: {
      initial: { word: 'فَرَاشَة', emoji: '🦋' },
      medial: { word: 'تُفَّاح', emoji: '🍎' },
      final: { word: 'خَرُوف', emoji: '🐑' }
    },
    confusingLetters: ['ق', 'غ', 'ب']
  },
  {
    id: 'qaaf',
    char: 'ق',
    name: 'قَاف',
    soundAudioText: 'قَ',
    positions: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
    sampleWords: {
      initial: { word: 'قَلَم', emoji: '✏️' },
      medial: { word: 'صَقْر', emoji: '🦅' },
      final: { word: 'إِبْرِيق', emoji: '🫖' }
    },
    confusingLetters: ['ف', 'ك', 'غ']
  },
  {
    id: 'kaaf',
    char: 'ك',
    name: 'كَاف',
    soundAudioText: 'كَ',
    positions: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    sampleWords: {
      initial: { word: 'كَلْب', emoji: '🐕' },
      medial: { word: 'سَمَكَة', emoji: '🐟' },
      final: { word: 'دِيك', emoji: '🐓' }
    },
    confusingLetters: ['ق', 'ل', 'د']
  },
  {
    id: 'laam',
    char: 'ل',
    name: 'لاَم',
    soundAudioText: 'لَ',
    positions: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
    sampleWords: {
      initial: { word: 'لَيْمُون', emoji: '🍋' },
      medial: { word: 'قَلَم', emoji: '✏️' },
      final: { word: 'جَمَل', emoji: '🐪' }
    },
    confusingLetters: ['ك', 'أ', 'ا', 'ر']
  },
  {
    id: 'meem',
    char: 'م',
    name: 'مِيم',
    soundAudioText: 'مَ',
    positions: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
    sampleWords: {
      initial: { word: 'مَوْز', emoji: '🍌' },
      medial: { word: 'قَمَر', emoji: '🌙' },
      final: { word: 'قَلَم', emoji: '✏️' }
    },
    confusingLetters: ['ن', 'و', 'هـ']
  },
  {
    id: 'noon',
    char: 'ن',
    name: 'نُون',
    soundAudioText: 'نَ',
    positions: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
    sampleWords: {
      initial: { word: 'نَجْمَة', emoji: '⭐' },
      medial: { word: 'عِنَب', emoji: '🍇' },
      final: { word: 'تِين', emoji: '🫐' }
    },
    confusingLetters: ['ب', 'ت', 'ي', 'ث']
  },
  {
    id: 'haa_plain',
    char: 'هـ',
    name: 'هَاء',
    soundAudioText: 'هَ',
    positions: { isolated: 'هـ', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
    sampleWords: {
      initial: { word: 'هِلاَل', emoji: '🌙' },
      medial: { word: 'فَهْد', emoji: '🐆' },
      final: { word: 'مِيَاه', emoji: '💧' }
    },
    confusingLetters: ['ة', 'ح', 'م']
  },
  {
    id: 'waw',
    char: 'و',
    name: 'وَاو',
    soundAudioText: 'وَ',
    positions: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
    sampleWords: {
      initial: { word: 'وَرْدَة', emoji: '🌹' },
      medial: { word: 'مَوْز', emoji: '🍌' },
      final: { word: 'دَلْو', emoji: '🪣' }
    },
    confusingLetters: ['ر', 'ز', 'ف', 'ق']
  },
  {
    id: 'yaa',
    char: 'ي',
    name: 'يَاء',
    soundAudioText: 'يَ',
    positions: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
    sampleWords: {
      initial: { word: 'يَد', emoji: '✋' },
      medial: { word: 'بَيْت', emoji: '🏠' },
      final: { word: 'شَاي', emoji: '🍵' }
    },
    confusingLetters: ['ب', 'ت', 'ث', 'ن', 'ى']
  }
];

// 2. بيانات الحركات القصيرة ومصنع الحركات
export interface HarakatItem {
  baseChar: string;
  charName: string;
  fatha: { text: string; audio: string; sample: string; emoji: string };
  damma: { text: string; audio: string; sample: string; emoji: string };
  kasra: { text: string; audio: string; sample: string; emoji: string };
  sukoon: { text: string; audio: string; sample: string; emoji: string };
}

export const CENTRAL_HARAKAT_DATA: HarakatItem[] = [
  {
    baseChar: 'ب',
    charName: 'الباء',
    fatha: { text: 'بَ', audio: 'بَ', sample: 'بَقَرَة', emoji: '🐄' },
    damma: { text: 'بُ', audio: 'بُ', sample: 'بُرْتُقَال', emoji: '🍊' },
    kasra: { text: 'بِ', audio: 'بِ', sample: 'بِنْت', emoji: '👧' },
    sukoon: { text: 'بْ', audio: 'أَبْ', sample: 'حَبْل', emoji: '🪢' }
  },
  {
    baseChar: 'م',
    charName: 'الميم',
    fatha: { text: 'مَ', audio: 'مَ', sample: 'مَوْز', emoji: '🍌' },
    damma: { text: 'مُ', audio: 'مُ', sample: 'مُعَلِّم', emoji: '👨‍🏫' },
    kasra: { text: 'مِ', audio: 'مِ', sample: 'مِقَصّ', emoji: '✂️' },
    sukoon: { text: 'مْ', audio: 'أَمْ', sample: 'شَمْس', emoji: '☀️' }
  },
  {
    baseChar: 'ر',
    charName: 'الراء',
    fatha: { text: 'رَ', audio: 'رَ', sample: 'رَجُل', emoji: '🧔' },
    damma: { text: 'رُ', audio: 'رُ', sample: 'رُمَّان', emoji: '🍎' },
    kasra: { text: 'رِ', audio: 'رِ', sample: 'رِجْل', emoji: '🦵' },
    sukoon: { text: 'رْ', audio: 'أَرْ', sample: 'وَرْدَة', emoji: '🌹' }
  },
  {
    baseChar: 'د',
    charName: 'الدال',
    fatha: { text: 'دَ', audio: 'دَ', sample: 'دَرَجَة', emoji: '🚲' },
    damma: { text: 'دُ', audio: 'دُ', sample: 'دُبّ', emoji: '🐻' },
    kasra: { text: 'دِ', audio: 'دِ', sample: 'دِيك', emoji: '🐓' },
    sukoon: { text: 'دْ', audio: 'أَدْ', sample: 'بَدْر', emoji: '🌕' }
  },
  {
    baseChar: 'س',
    charName: 'السين',
    fatha: { text: 'سَ', audio: 'سَ', sample: 'سَمَكَة', emoji: '🐟' },
    damma: { text: 'سُ', audio: 'سُ', sample: 'سُلَحْفَاة', emoji: '🐢' },
    kasra: { text: 'سِ', audio: 'سِ', sample: 'سِتَارَة', emoji: '🪟' },
    sukoon: { text: 'سْ', audio: 'أَسْ', sample: 'مَسْجِد', emoji: '🕌' }
  }
];

// 3. بيانات المدود والمقاطع
export interface MaddSyllableItem {
  baseChar: string;
  charName: string;
  pairs: {
    type: 'alif' | 'waw' | 'yaa';
    shortText: string;
    longText: string;
    shortAudio: string;
    longAudio: string;
    maddLetter: 'ا' | 'و' | 'ي';
    sampleWord: string;
    emoji: string;
  }[];
}

export const CENTRAL_MADD_DATA: MaddSyllableItem[] = [
  {
    baseChar: 'ب',
    charName: 'الباء',
    pairs: [
      { type: 'alif', shortText: 'بَ', longText: 'بَا', shortAudio: 'بَ', longAudio: 'بَا', maddLetter: 'ا', sampleWord: 'بَاب', emoji: '🚪' },
      { type: 'waw', shortText: 'بُ', longText: 'بُو', shortAudio: 'بُ', longAudio: 'بُو', maddLetter: 'و', sampleWord: 'بُومَة', emoji: '🦉' },
      { type: 'yaa', shortText: 'بِ', longText: 'بِي', shortAudio: 'بِ', longAudio: 'بِي', maddLetter: 'ي', sampleWord: 'طَبِيب', emoji: '🩺' }
    ]
  },
  {
    baseChar: 'ت',
    charName: 'التاء',
    pairs: [
      { type: 'alif', shortText: 'تَ', longText: 'تَا', shortAudio: 'تَ', longAudio: 'تَا', maddLetter: 'ا', sampleWord: 'تَاج', emoji: '👑' },
      { type: 'waw', shortText: 'تُ', longText: 'تُو', shortAudio: 'تُ', longAudio: 'تُو', maddLetter: 'و', sampleWord: 'تُوت', emoji: '🫐' },
      { type: 'yaa', shortText: 'تِ', longText: 'تِي', shortAudio: 'تِ', longAudio: 'تِي', maddLetter: 'ي', sampleWord: 'تِين', emoji: '🫐' }
    ]
  },
  {
    baseChar: 'ق',
    charName: 'القاف',
    pairs: [
      { type: 'alif', shortText: 'قَ', longText: 'قَا', shortAudio: 'قَ', longAudio: 'قَا', maddLetter: 'ا', sampleWord: 'قَالَ', emoji: '🗣️' },
      { type: 'waw', shortText: 'قُ', longText: 'قُو', shortAudio: 'قُ', longAudio: 'قُو', maddLetter: 'و', sampleWord: 'قُوت', emoji: '🌾' },
      { type: 'yaa', shortText: 'قِ', longText: 'قِي', shortAudio: 'قِ', longAudio: 'قِي', maddLetter: 'ي', sampleWord: 'قِيلَ', emoji: '📜' }
    ]
  },
  {
    baseChar: 'ن',
    charName: 'النون',
    pairs: [
      { type: 'alif', shortText: 'نَ', longText: 'نَا', shortAudio: 'نَ', longAudio: 'نَا', maddLetter: 'ا', sampleWord: 'نَار', emoji: '🔥' },
      { type: 'waw', shortText: 'نُ', longText: 'نُو', shortAudio: 'نُ', longAudio: 'نُو', maddLetter: 'و', sampleWord: 'نُور', emoji: '💡' },
      { type: 'yaa', shortText: 'نِ', longText: 'نِي', shortAudio: 'نِ', longAudio: 'نِي', maddLetter: 'ي', sampleWord: 'عِين', emoji: '👁️' }
    ]
  }
];

// خلايا المقاطع لتركيب الكلمات
export interface SyllableCombineItem {
  id: string;
  syllables: string[];
  fullWord: string;
  meaning: string;
  emoji: string;
  level: 1 | 2 | 3;
}

export const CENTRAL_SYLLABLE_COMBINE_DATA: SyllableCombineItem[] = [
  { id: 'sc1', syllables: ['دَ', 'رَ', 'سَ'], fullWord: 'دَرَسَ', meaning: 'تعلَم واجتهد', emoji: '📖', level: 1 },
  { id: 'sc2', syllables: ['كَتَـ', 'ـبَ'], fullWord: 'كَتَبَ', meaning: 'خط بالقلم', emoji: '✍️', level: 1 },
  { id: 'sc3', syllables: ['بَـا', 'بٌ'], fullWord: 'بَابٌ', meaning: 'مدخل البيت', emoji: '🚪', level: 1 },
  { id: 'sc4', syllables: ['مَـدْ', 'رَ', 'سَـ', 'ـةٌ'], fullWord: 'مَدْرَسَةٌ', meaning: 'صرح العلم', emoji: '🏫', level: 2 },
  { id: 'sc5', syllables: ['عُصْـ', 'فُو', 'رٌ'], fullWord: 'عُصْفُورٌ', meaning: 'طائر جميل مغرد', emoji: '🐦', level: 2 },
  { id: 'sc6', syllables: ['سَيَّـ', 'ـا', 'رَ', 'ةٌ'], fullWord: 'سَيَّارَةٌ', meaning: 'مركبة سريعة', emoji: '🚗', level: 3 }
];

// 4. بيانات بناء الكلمات والإملاء المصور
export interface WordSpellingItem {
  id: string;
  word: string;
  tashkeel: string;
  letters: string[];
  syllables: string[];
  emoji: string;
  category: 'animals' | 'school' | 'family' | 'food' | 'general';
  difficulty: 'easy' | 'medium' | 'advanced';
  distractorLetters: string[];
}

export const CENTRAL_SPELLING_WORDS: WordSpellingItem[] = [
  {
    id: 'sp_asad',
    word: 'اسد',
    tashkeel: 'أَسَدٌ',
    letters: ['أَ', 'سَ', 'دٌ'],
    syllables: ['أَ', 'سَـ', 'دٌ'],
    emoji: '🦁',
    category: 'animals',
    difficulty: 'easy',
    distractorLetters: ['ر', 'ب', 'م']
  },
  {
    id: 'sp_qalam',
    word: 'قلم',
    tashkeel: 'قَلَمٌ',
    letters: ['قَ', 'لَ', 'مٌ'],
    syllables: ['قَـ', 'لَـ', 'مٌ'],
    emoji: '✏️',
    category: 'school',
    difficulty: 'easy',
    distractorLetters: ['ف', 'ك', 'ن']
  },
  {
    id: 'sp_kitaab',
    word: 'كتاب',
    tashkeel: 'كِتَابٌ',
    letters: ['كِ', 'تَ', 'ا', 'بٌ'],
    syllables: ['كِـ', 'تَـا', 'بٌ'],
    emoji: '📚',
    category: 'school',
    difficulty: 'medium',
    distractorLetters: ['ل', 'ي', 'د']
  },
  {
    id: 'sp_samakah',
    word: 'سمكة',
    tashkeel: 'سَمَكَةٌ',
    letters: ['سَ', 'مَ', 'كَ', 'ةٌ'],
    syllables: ['سَـ', 'مَـ', 'كَـ', 'ةٌ'],
    emoji: '🐟',
    category: 'animals',
    difficulty: 'medium',
    distractorLetters: ['ش', 'ت', 'ص']
  },
  {
    id: 'sp_madrasah',
    word: 'مدرسة',
    tashkeel: 'مَدْرَسَةٌ',
    letters: ['مَ', 'دْ', 'رَ', 'سَ', 'ةٌ'],
    syllables: ['مَدْ', 'رَ', 'سَـ', 'ـةٌ'],
    emoji: '🏫',
    category: 'school',
    difficulty: 'advanced',
    distractorLetters: ['ت', 'ط', 'ن']
  },
  {
    id: 'sp_sayyarah',
    word: 'سيارة',
    tashkeel: 'سَيَّارَةٌ',
    letters: ['سَ', 'يْ', 'يَ', 'ا', 'رَ', 'ةٌ'],
    syllables: ['سَيْـ', 'يَـا', 'رَ', 'ةٌ'],
    emoji: '🚗',
    category: 'general',
    difficulty: 'advanced',
    distractorLetters: ['ص', 'ز', 'و']
  }
];

// 5. بيانات القراءة والطلاقة والقصص القصيرة
export interface FlashWordItem {
  id: string;
  word: string;
  tashkeel: string;
  emoji: string;
  exposureSeconds: number; // 2 or 3 seconds
  category: string;
}

export const CENTRAL_FLASH_WORDS: FlashWordItem[] = [
  { id: 'fw1', word: 'قَرَأَ', tashkeel: 'قَرَأَ', emoji: '📖', exposureSeconds: 2.5, category: 'أفعال ماضية' },
  { id: 'fw2', word: 'كَتَبَ', tashkeel: 'كَتَبَ', emoji: '✍️', exposureSeconds: 2.5, category: 'أفعال ماضية' },
  { id: 'fw3', word: 'شَرِبَ', tashkeel: 'شَرِبَ', emoji: '🥛', exposureSeconds: 2.5, category: 'أفعال ماضية' },
  { id: 'fw4', word: 'لَعِبَ', tashkeel: 'لَعِبَ', emoji: '⚽', exposureSeconds: 2.5, category: 'أفعال ماضية' },
  { id: 'fw5', word: 'المَدْرَسَة', tashkeel: 'الْمَدْرَسَةُ', emoji: '🏫', exposureSeconds: 3, category: 'كلمات مألوفة' },
  { id: 'fw6', word: 'العَصِير', tashkeel: 'الْعَصِيرُ', emoji: '🧃', exposureSeconds: 3, category: 'كلمات مألوفة' }
];

export interface FluencySentenceItem {
  id: string;
  sentence: string;
  meaningEmoji: string;
  targetSeconds: number;
  wordCount: number;
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
  };
}

export const CENTRAL_FLUENCY_SENTENCES: FluencySentenceItem[] = [
  {
    id: 'fs1',
    sentence: 'قَرَأَ فَوَّازٌ قِصَّةً جَمِيلَةً.',
    meaningEmoji: '📖',
    targetSeconds: 4,
    wordCount: 4,
    question: {
      prompt: 'مَاذَا قَرَأَ فَوَّازٌ؟',
      options: ['قِصَّةً جَمِيلَةً', 'دَرْسَ الرِّيَاضِيَّاتِ', 'قَصِيدَةً قَصِيرَةً'],
      correctIndex: 0
    }
  },
  {
    id: 'fs2',
    sentence: 'شَرِبَتْ نُورَةُ الْحَلِيبَ الدَّافِئَ.',
    meaningEmoji: '🥛',
    targetSeconds: 4,
    wordCount: 4,
    question: {
      prompt: 'مَاذَا شَرِبَتْ نُورَةُ؟',
      options: ['الْحَلِيبَ الدَّافِئَ', 'عَصِيرَ الْبُرْتُقَالِ', 'الْمَاءَ الْبَارِدَ'],
      correctIndex: 0
    }
  },
  {
    id: 'fs3',
    sentence: 'رَسَمَ سَالِمٌ بَيْتًا صَغِيرًا وَحَدِيقَةً خَضْرَاءَ.',
    meaningEmoji: '🏡',
    targetSeconds: 5,
    wordCount: 6,
    question: {
      prompt: 'كَيْفَ كَانَتِ الْحَدِيقَةُ الَّتِي رَسَمَهَا سَالِمٌ؟',
      options: ['حَدِيقَةً خَضْرَاءَ', 'صَفْرَاءَ جَافَّةً', 'مَلِيئَةً بِالثَّلْجِ'],
      correctIndex: 0
    }
  }
];

export interface ShortStoryItem {
  id: string;
  title: string;
  emoji: string;
  paragraphs: string[];
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const CENTRAL_SHORT_STORIES: ShortStoryItem[] = [
  {
    id: 'story1',
    title: 'الْعُصْفُورُ الصَّغِيرُ 🐦',
    emoji: '🐦',
    paragraphs: [
      'فِي صَبَاحِ يَوْمٍ جَمِيلٍ، وَقَفَ عُصْفُورٌ صَغِيرٌ عَلَى غُصْنِ شَجَرَةٍ.',
      'غَرَّدَ الْعُصْفُورُ بِصَوْتٍ عَذْبٍ، فَفَرِحَتْ نُورَةُ وَقَدَّمَتْ لَهُ حَبَّاتِ قَمْحٍ لَذِيذَةٍ.'
    ],
    questions: [
      {
        prompt: 'أَيْنَ وَقَفَ الْعُصْفُورُ الصَّغِيرُ؟',
        options: ['عَلَى غُصْنِ شَجَرَةٍ', 'عَلَى سُورِ الْحَدِيقَةِ', 'عَلَى نَافِذَةِ الْغُرْفَةِ'],
        correctIndex: 0,
        explanation: 'وَقَفَ الْعُصْفُورُ عَلَى غُصْنِ الشَّجَرَةِ فِي الصَّبَاحِ.'
      },
      {
        prompt: 'مَاذَا قَدَّمَتْ نُورَةُ لِلْعُصْفُورِ؟',
        options: ['حَبَّاتِ قَمْحٍ لَذِيذَةٍ', 'قِطْعَةَ حَلْوَى', 'كُوبًا مِنَ الْحَلِيبِ'],
        correctIndex: 0,
        explanation: 'قَدَّمَتْ نُورَةُ حَبَّاتِ قَمْحٍ لِيَأْكُلَهَا الْعُصْفُورُ.'
      }
    ]
  },
  {
    id: 'story2',
    title: 'فَرْحَةُ الشَّاطِئِ 🏖️',
    emoji: '🌊',
    paragraphs: [
      'ذَهَبَ أَحْمَدُ مَعَ أُسْرَتِهِ إِلَى شَاطِئِ الْبَحْرِ الْوَاسِعِ.',
      'بَنَى أَحْمَدُ قَلْعَةً كَبِيرَةً مِنَ الرِّمَالِ الذَّهَبِيَّةِ، وَوَضَعَ فَوْقَهَا عَلَمًا صَغِيرًا.'
    ],
    questions: [
      {
        prompt: 'إِلَى أَيْنَ ذَهَبَ أَحْمَدُ مَعَ أُسْرَتِهِ؟',
        options: ['إِلَى شَاطِئِ الْبَحْرِ', 'إِلَى مَدِينَةِ الأَلْعَابِ', 'إِلَى حَدِيقَةِ الْحَيَوَانِ'],
        correctIndex: 0,
        explanation: 'ذَهَبَ أَحْمَدُ مَعَ أُسْرَتِهِ إِلَى شَاطِئِ الْبَحْرِ.'
      },
      {
        prompt: 'مِمَّ بَنَى أَحْمَدُ قَلْعَتَهُ الْكَبِيرَةَ؟',
        options: ['مِنَ الرِّمَالِ الذَّهَبِيَّةِ', 'مِنَ الأَحْجَارِ الْمُلَوَّنَةِ', 'مِنَ الْخَشَبِ'],
        correctIndex: 0,
        explanation: 'بَنَى قَلْعَتَهُ مِنَ الرِّمَالِ الذَّهَبِيَّةِ عَلَى الشَّاطِئِ.'
      }
    ]
  }
];

// Helper to get custom teacher content stored in localStorage
export function getCustomTeacherData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`lughati_custom_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function saveCustomTeacherData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`lughati_custom_${key}`, JSON.stringify(data));
  } catch (e) {}
}
