export interface Grade1LetterExercise {
  id: string;
  letter: string;
  letterName: string;
  pageNumber: number;
  featuredDrawing: string;
  drawingEmoji: string;
  
  // دمج المقاطع
  syllableMerge: {
    syllables: string[];
    result: string;
    meaning: string;
  }[];

  // تقطيع الكلمات وحساب المقاطع
  syllableBreakdown: {
    word: string;
    parts: string[];
    syllableCount: number;
  }[];

  // ترتيب الكلمات لتكوين جملة
  sentenceOrdering: {
    wordsShuffled: string[];
    correctSentence: string;
    meaningEmoji: string;
  }[];

  // تمييز الكلمات التي تشتمل على الحرف
  wordsWithLetter: {
    word: string;
    hasLetter: boolean;
  }[];
}

export const GRADE1_WRITTEN_EXERCISES_DATA: Grade1LetterExercise[] = [
  // -------------------------------------------------------------------------
  // 1) حرف الدال (د) - الصفحة 3
  // -------------------------------------------------------------------------
  {
    id: 'letter_dal',
    letter: 'د',
    letterName: 'حرف الدال',
    pageNumber: 3,
    featuredDrawing: 'دِيكٌ',
    drawingEmoji: '🐓',
    syllableMerge: [
      { syllables: ['دُ', 'مْـ', 'يَـ', 'ةٌ'], result: 'دُمْيَةٌ', meaning: 'لعبة الأطفال' },
      { syllables: ['قِرْ', 'دٌ'], result: 'قِرْدٌ', meaning: 'حيوان أليف ذكي' },
      { syllables: ['دُو', 'دٌ'], result: 'دُودٌ', meaning: 'دودة الحرير' },
      { syllables: ['مَـا', 'ئِـ', 'دَ', 'ةٌ'], result: 'مَائِدَةٌ', meaning: 'مائدة الطعام' }
    ],
    syllableBreakdown: [
      { word: 'مِـدَادٌ', parts: ['مِـ', 'دَا', 'دٌ'], syllableCount: 3 },
      { word: 'جَدَّةٌ', parts: ['جَدْ', 'دَ', 'ةٌ'], syllableCount: 3 },
      { word: 'دِرْهَمٌ', parts: ['دِرْ', 'هَ', 'مٌ'], syllableCount: 3 },
      { word: 'دُخَانٌ', parts: ['دُ', 'خَا', 'نٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['دَرْسَهُ', 'كَتَبَ', 'فَوَّازٌ', 'بِإِتْقَانٍ'],
        correctSentence: 'كَتَبَ فَوَّازٌ دَرْسَهُ بِإِتْقَانٍ',
        meaningEmoji: '📝'
      }
    ],
    wordsWithLetter: [
      { word: 'دِيكٌ', hasLetter: true },
      { word: 'قَلَمٌ', hasLetter: false },
      { word: 'وَرْدَةٌ', hasLetter: true },
      { word: 'مَائِدَةٌ', hasLetter: true },
      { word: 'عَلَمٌ', hasLetter: false },
      { word: 'دُودٌ', hasLetter: true }
    ]
  },

  // -------------------------------------------------------------------------
  // 2) حرف الميم (م) - الصفحة 4
  // -------------------------------------------------------------------------
  {
    id: 'letter_meem',
    letter: 'م',
    letterName: 'حرف الميم',
    pageNumber: 4,
    featuredDrawing: 'مَوْزَةٌ',
    drawingEmoji: '🍌',
    syllableMerge: [
      { syllables: ['مَـا', 'ءٌ'], result: 'مَاءٌ', meaning: 'الماء سر الحياة' },
      { syllables: ['مُصْـ', 'حَـ', 'فٌ'], result: 'مُصْحَفٌ', meaning: 'القرآن الكريم' },
      { syllables: ['نَـ', 'مِـ', 'رٌ'], result: 'نَمِرٌ', meaning: 'حيوان مفترس سريع' },
      { syllables: ['قَـ', 'مِيـ', 'صٌ'], result: 'قَمِيصٌ', meaning: 'لباس جميل' }
    ],
    syllableBreakdown: [
      { word: 'مِدَادٌ', parts: ['مِـ', 'دَا', 'دٌ'], syllableCount: 3 },
      { word: 'مَائِدَةٌ', parts: ['مَا', 'ئِـ', 'دَ', 'ةٌ'], syllableCount: 4 },
      { word: 'قَامَ', parts: ['قَا', 'مَ'], syllableCount: 2 },
      { word: 'مَدْرَسَةٌ', parts: ['مَدْ', 'رَ', 'سَ', 'ةٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['أُمِّي', 'تُعِدُّ', 'الشَّهِيَّ', 'الطَّعَامَ'],
        correctSentence: 'أُمِّي تُعِدُّ الطَّعَامَ الشَّهِيَّ',
        meaningEmoji: '🍲'
      }
    ],
    wordsWithLetter: [
      { word: 'مَامَا', hasLetter: true },
      { word: 'دُبٌّ', hasLetter: false },
      { word: 'رَمَادٌ', hasLetter: true },
      { word: 'عَادَ', hasLetter: false },
      { word: 'دَمْدَمَ', hasLetter: true },
      { word: 'مَدَارٌ', hasLetter: true }
    ]
  },

  // -------------------------------------------------------------------------
  // 3) حرف الراء (ر) - الصفحة 5
  // -------------------------------------------------------------------------
  {
    id: 'letter_raa',
    letter: 'ر',
    letterName: 'حرف الراء',
    pageNumber: 5,
    featuredDrawing: 'رُمَّانٌ',
    drawingEmoji: '🍎',
    syllableMerge: [
      { syllables: ['سَـ', 'رِيـ', 'رٌ'], result: 'سَرِيرٌ', meaning: 'مكان النوم المريح' },
      { syllables: ['رُمْـ', 'مَـا', 'نٌ'], result: 'رُمَّانٌ', meaning: 'فاكهة لذيذة' },
      { syllables: ['قُـ', 'رُو', 'نٌ'], result: 'قُرُونٌ', meaning: 'قرون الكبش' }
    ],
    syllableBreakdown: [
      { word: 'سَرِيرٌ', parts: ['سَـ', 'رِيـ', 'رٌ'], syllableCount: 3 },
      { word: 'رُمَّانٌ', parts: ['رُمْـ', 'مَا', 'نٌ'], syllableCount: 3 },
      { word: 'قُرُونٌ', parts: ['قُـ', 'رُو', 'نٌ'], syllableCount: 3 },
      { word: 'بَحْرٌ', parts: ['بَحْـ', 'رٌ'], syllableCount: 2 },
      { word: 'رَجُلٌ', parts: ['رَ', 'جُ', 'لٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['رَمَى', 'فِي', 'سَالِمٌ', 'الْكُرَةَ', 'الْمَرْمَى'],
        correctSentence: 'رَمَى سَالِمٌ الْكُرَةَ فِي الْمَرْمَى',
        meaningEmoji: '⚽'
      }
    ],
    wordsWithLetter: [
      { word: 'رَبَابٌ', hasLetter: true },
      { word: 'مِحْرَارٌ', hasLetter: true },
      { word: 'رِمَالٌ', hasLetter: true },
      { word: 'كَلْبٌ', hasLetter: false },
      { word: 'بَحْرٌ', hasLetter: true }
    ]
  },

  // -------------------------------------------------------------------------
  // 4) حرف الباء (ب) - الصفحة 6
  // -------------------------------------------------------------------------
  {
    id: 'letter_baa',
    letter: 'ب',
    letterName: 'حرف الباء',
    pageNumber: 6,
    featuredDrawing: 'بَطَّةٌ',
    drawingEmoji: '🦆',
    syllableMerge: [
      { syllables: ['بُو', 'مٌ'], result: 'بُومٌ', meaning: 'طائر ليلي' },
      { syllables: ['بَرْ', 'رَا', 'دٌ'], result: 'بَرَّادٌ', meaning: 'إبريق الشاي' },
      { syllables: ['رَ', 'بَا', 'بٌ'], result: 'رَبَابٌ', meaning: 'آلة وترية' }
    ],
    syllableBreakdown: [
      { word: 'بَابٌ', parts: ['بَا', 'بٌ'], syllableCount: 2 },
      { word: 'طَبِيبٌ', parts: ['طَ', 'بِيـ', 'بٌ'], syllableCount: 3 },
      { word: 'بُوقٌ', parts: ['بُو', 'قٌ'], syllableCount: 2 },
      { word: 'بَصَلٌ', parts: ['بَ', 'صَ', 'لٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['بَابَ', 'بَاسِمٌ', 'فَتَحَ', 'الْبَيْتِ'],
        correctSentence: 'فَتَحَ بَاسِمٌ بَابَ الْبَيْتِ',
        meaningEmoji: '🚪'
      }
    ],
    wordsWithLetter: [
      { word: 'بَصَلٌ', hasLetter: true },
      { word: 'زَرْبِيَّةٌ', hasLetter: true },
      { word: 'كَلْبٌ', hasLetter: true },
      { word: 'دِيكٌ', hasLetter: false },
      { word: 'طَبِيبٌ', hasLetter: true }
    ]
  },

  // -------------------------------------------------------------------------
  // 5) حرف السين (س) - الصفحة 7
  // -------------------------------------------------------------------------
  {
    id: 'letter_seen',
    letter: 'س',
    letterName: 'حرف السين',
    pageNumber: 7,
    featuredDrawing: 'سَمَكَةٌ',
    drawingEmoji: '🐟',
    syllableMerge: [
      { syllables: ['أَ', 'سَـ', 'دٌ'], result: 'أَسَدٌ', meaning: 'ملك الغابة' },
      { syllables: ['سَـا', 'عَـ', 'ةٌ'], result: 'سَاعَةٌ', meaning: 'لمعرفة الوقت' },
      { syllables: ['سُـ', 'لَحْـ', 'فَـا', 'ةٌ'], result: 'سُلَحْفَاةٌ', meaning: 'حيوان هادئ معمر' }
    ],
    syllableBreakdown: [
      { word: 'أَسَدٌ', parts: ['أَ', 'سَ', 'دٌ'], syllableCount: 3 },
      { word: 'سَاعَةٌ', parts: ['سَا', 'عَ', 'ةٌ'], syllableCount: 3 },
      { word: 'سُلَحْفَاةٌ', parts: ['سُ', 'لَحْ', 'فَا', 'ةٌ'], syllableCount: 4 },
      { word: 'سُورٌ', parts: ['سُو', 'رٌ'], syllableCount: 2 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['سَامِي', 'فِي', 'يَسْبَحُ', 'الْمَسْبَحِ'],
        correctSentence: 'يَسْبَحُ سَامِي فِي الْمَسْبَحِ',
        meaningEmoji: '🏊'
      }
    ],
    wordsWithLetter: [
      { word: 'مَدْرَسَةٌ', hasLetter: true },
      { word: 'سَاعَةٌ', hasLetter: true },
      { word: 'شَرِبَ', hasLetter: false },
      { word: 'سُورٌ', hasLetter: true },
      { word: 'فَانُوسٌ', hasLetter: true },
      { word: 'مُشْطٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 6) حرف الفاء (ف) - الصفحة 8
  // -------------------------------------------------------------------------
  {
    id: 'letter_faa',
    letter: 'ف',
    letterName: 'حرف الفاء',
    pageNumber: 8,
    featuredDrawing: 'فِيلٌ',
    drawingEmoji: '🐘',
    syllableMerge: [
      { syllables: ['فُو', 'لٌ'], result: 'فُولٌ', meaning: 'نبات البقوليات' },
      { syllables: ['فِيـ', 'لٌ'], result: 'فِيلٌ', meaning: 'حيوان ضخم' },
      { syllables: ['فَـ', 'رَا', 'شَـ', 'ةٌ'], result: 'فَرَاشَةٌ', meaning: 'حشرة زاهية الألوان' }
    ],
    syllableBreakdown: [
      { word: 'فُولٌ', parts: ['فُو', 'لٌ'], syllableCount: 2 },
      { word: 'فِيلٌ', parts: ['فِي', 'لٌ'], syllableCount: 2 },
      { word: 'فَرَاشَةٌ', parts: ['فَ', 'رَا', 'شَ', 'ةٌ'], syllableCount: 4 },
      { word: 'دَفْتَرٌ', parts: ['دَفْ', 'تَ', 'رٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['فَرَاشَةٌ', 'تَطِيرُ', 'فَوْقَ', 'الزُّهُورِ'],
        correctSentence: 'تَطِيرُ فَرَاشَةٌ فَوْقَ الزُّهُورِ',
        meaningEmoji: '🦋'
      }
    ],
    wordsWithLetter: [
      { word: 'دَفْتَرٌ', hasLetter: true },
      { word: 'قِلاَدَةٌ', hasLetter: false },
      { word: 'قُفْلٌ', hasLetter: true },
      { word: 'فَرْدٌ', hasLetter: true },
      { word: 'قَفَصٌ', hasLetter: true },
      { word: 'قِرْدٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 7) حرف اللام (ل) - الصفحة 9
  // -------------------------------------------------------------------------
  {
    id: 'letter_laam',
    letter: 'ل',
    letterName: 'حرف اللام',
    pageNumber: 9,
    featuredDrawing: 'لَيْمُونٌ',
    drawingEmoji: '🍋',
    syllableMerge: [
      { syllables: ['قَـ', 'لَـ', 'مٌ'], result: 'قَلَمٌ', meaning: 'أداة الكتابة' },
      { syllables: ['لاَ', 'عِـ', 'بٌ'], result: 'لاَعِبٌ', meaning: 'لاعب رياضي' },
      { syllables: ['غَـ', 'زَا', 'لَـ', 'ةٌ'], result: 'غَزَالَةٌ', meaning: 'حيوان رشيق' }
    ],
    syllableBreakdown: [
      { word: 'قَلَمٌ', parts: ['قَ', 'لَ', 'مٌ'], syllableCount: 3 },
      { word: 'لاَعِبٌ', parts: ['لاَ', 'عِ', 'بٌ'], syllableCount: 3 },
      { word: 'غَزَالَةٌ', parts: ['غَ', 'زَا', 'لَ', 'ةٌ'], syllableCount: 4 },
      { word: 'لَحْمٌ', parts: ['لَحْ', 'مٌ'], syllableCount: 2 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['لَبَنًا', 'شَرِبَتْ', 'لَيْلَى', 'طَازَجًا'],
        correctSentence: 'شَرِبَتْ لَيْلَى لَبَنًا طَازَجًا',
        meaningEmoji: '🥛'
      }
    ],
    wordsWithLetter: [
      { word: 'دَفَاتِرُ', hasLetter: false },
      { word: 'قِلاَدَةٌ', hasLetter: true },
      { word: 'عُلَبٌ', hasLetter: true },
      { word: 'قُفْلٌ', hasLetter: true },
      { word: 'لَحْمٌ', hasLetter: true },
      { word: 'أَسْنَانٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 8) حرف الصاد (ص) - الصفحة 10
  // -------------------------------------------------------------------------
  {
    id: 'letter_saad',
    letter: 'ص',
    letterName: 'حرف الصاد',
    pageNumber: 10,
    featuredDrawing: 'صَيَّادٌ',
    drawingEmoji: '🎣',
    syllableMerge: [
      { syllables: ['صِـ', 'بَـا', 'غَـ', 'ةٌ'], result: 'صِبَاغَةٌ', meaning: 'طلاء وألوان' },
      { syllables: ['صُو', 'فٌ'], result: 'صُوفٌ', meaning: 'صوف الخروف' },
      { syllables: ['صُنْـ', 'دُو', 'قٌ'], result: 'صُنْدُوقٌ', meaning: 'صندوق الألعاب' }
    ],
    syllableBreakdown: [
      { word: 'صِبَاغَةٌ', parts: ['صِ', 'بَا', 'غَ', 'ةٌ'], syllableCount: 4 },
      { word: 'صُوفٌ', parts: ['صُو', 'فٌ'], syllableCount: 2 },
      { word: 'صُنْدُوقٌ', parts: ['صُنْ', 'دُو', 'قٌ'], syllableCount: 3 },
      { word: 'صَبِيٌّ', parts: ['صَ', 'بِيْ', 'يٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['صَابِرٌ', 'صَادَ', 'سَمَكَةً', 'كَبِيرَةً'],
        correctSentence: 'صَادَ صَابِرٌ سَمَكَةً كَبِيرَةً',
        meaningEmoji: '🐟'
      }
    ],
    wordsWithLetter: [
      { word: 'قَفَصٌ', hasLetter: true },
      { word: 'صُورَةٌ', hasLetter: true },
      { word: 'سَبُّورَةٌ', hasLetter: false },
      { word: 'صَبِيٌّ', hasLetter: true },
      { word: 'ضِمَادٌ', hasLetter: false },
      { word: 'طَبْلٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 9) حرف الذال (ذ) - الصفحة 11
  // -------------------------------------------------------------------------
  {
    id: 'letter_dhal',
    letter: 'ذ',
    letterName: 'حرف الذال',
    pageNumber: 11,
    featuredDrawing: 'ذِئْبٌ',
    drawingEmoji: '🐺',
    syllableMerge: [
      { syllables: ['ذِ', 'رَا', 'عٌ'], result: 'ذِرَاعٌ', meaning: 'ذراع الإنسان' },
      { syllables: ['ذُ', 'بَـا', 'بٌ'], result: 'ذُبَابٌ', meaning: 'حشرة طائرة' }
    ],
    syllableBreakdown: [
      { word: 'ذِرَاعٌ', parts: ['ذِ', 'رَا', 'عٌ'], syllableCount: 3 },
      { word: 'ذُبَابٌ', parts: ['ذُ', 'بَا', 'بٌ'], syllableCount: 3 },
      { word: 'بُذُورٌ', parts: ['بُ', 'ذُو', 'رٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['إِلَى', 'الْمَدْرَسَةِ', 'ذَاكِرٌ', 'ذَهَبَ'],
        correctSentence: 'ذَهَبَ ذَاكِرٌ إِلَى الْمَدْرَسَةِ',
        meaningEmoji: '🏫'
      }
    ],
    wordsWithLetter: [
      { word: 'ذِئْبٌ', hasLetter: true },
      { word: 'بُذُورٌ', hasLetter: true },
      { word: 'نَافِذَةٌ', hasLetter: true },
      { word: 'تِلْمِيذٌ', hasLetter: true },
      { word: 'دَفْتَرٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 10) حرف الزاي (ز) - الصفحة 12
  // -------------------------------------------------------------------------
  {
    id: 'letter_zay',
    letter: 'ز',
    letterName: 'حرف الزاي',
    pageNumber: 12,
    featuredDrawing: 'زَيْتُونٌ',
    drawingEmoji: '🫒',
    syllableMerge: [
      { syllables: ['غَـ', 'زَا', 'لَـ', 'ةٌ'], result: 'غَزَالَةٌ', meaning: 'غزالة برية' },
      { syllables: ['بَـا', 'زٌ'], result: 'بَازٌ', meaning: 'صقر جارح' },
      { syllables: ['زَرْ', 'بِيـ', 'يَـ', 'ةٌ'], result: 'زَرْبِيَّةٌ', meaning: 'سجادة زاهية' }
    ],
    syllableBreakdown: [
      { word: 'غَزَالَةٌ', parts: ['غَ', 'زَا', 'لَ', 'ةٌ'], syllableCount: 4 },
      { word: 'بَازٌ', parts: ['بَا', 'زٌ'], syllableCount: 2 },
      { word: 'زَرْبِيَّةٌ', parts: ['زَرْ', 'بِيْ', 'يَ', 'ةٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['الزُّهُورِ', 'رَائِحَةُ', 'حُزْمَةِ', 'زَكِيَّةٌ'],
        correctSentence: 'زَكِيَّةٌ رَائِحَةُ حُزْمَةِ الزُّهُورِ',
        meaningEmoji: '💐'
      }
    ],
    wordsWithLetter: [
      { word: 'مِزْمَارٌ', hasLetter: true },
      { word: 'أَزْهَارٌ', hasLetter: true },
      { word: 'مَغْزَلٌ', hasLetter: true },
      { word: 'جَزِيرَةٌ', hasLetter: true },
      { word: 'قَلَمٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 11) حرف الطاء (ط) - الصفحة 13
  // -------------------------------------------------------------------------
  {
    id: 'letter_taa_heavy',
    letter: 'ط',
    letterName: 'حرف الطاء',
    pageNumber: 13,
    featuredDrawing: 'طَمَاطِمُ',
    drawingEmoji: '🍅',
    syllableMerge: [
      { syllables: ['طَـ', 'بِيـ', 'بٌ'], result: 'طَبِيبٌ', meaning: 'يعالج المرضى' },
      { syllables: ['بَـ', 'طَّـ', 'ةٌ'], result: 'بَطَّةٌ', meaning: 'تسبح في الماء' },
      { syllables: ['طَـ', 'رِيـ', 'قٌ'], result: 'طَرِيقٌ', meaning: 'طريق معبد' },
      { syllables: ['لَـ', 'طِيـ', 'فٌ'], result: 'لَطِيفٌ', meaning: 'مهذب ورقيق' }
    ],
    syllableBreakdown: [
      { word: 'طَبِيبٌ', parts: ['طَ', 'بِي', 'بٌ'], syllableCount: 3 },
      { word: 'طَرِيقٌ', parts: ['طَ', 'رِي', 'قٌ'], syllableCount: 3 },
      { word: 'أَمْطَارٌ', parts: ['أَمْ', 'طَا', 'رٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['الأَمْطَارُ', 'بِغَزَارَةٍ', 'تَهْطِلُ'],
        correctSentence: 'تَهْطِلُ الأَمْطَارُ بِغَزَارَةٍ',
        meaningEmoji: '🌧️'
      },
      {
        wordsShuffled: ['فَاطِمُ', 'لَذِيذٍ', 'فَطَرَتْ', 'بِفَطِيرٍ'],
        correctSentence: 'فَطَرَتْ فَاطِمُ بِفَطِيرٍ لَذِيذٍ',
        meaningEmoji: '🥞'
      }
    ],
    wordsWithLetter: [
      { word: 'طَمَاطِمُ', hasLetter: true },
      { word: 'مِطْرَقَةٌ', hasLetter: true },
      { word: 'بِطِّيخٌ', hasLetter: true },
      { word: 'كِتَابٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 12) حرف الضاد (ض) - الصفحة 14
  // -------------------------------------------------------------------------
  {
    id: 'letter_dhaad',
    letter: 'ض',
    letterName: 'حرف الضاد',
    pageNumber: 14,
    featuredDrawing: 'ضَبٌّ',
    drawingEmoji: '🦎',
    syllableMerge: [
      { syllables: ['ضَـ', 'بَـا', 'بٌ'], result: 'ضَبَابٌ', meaning: 'غيوم قريبة من الأرض' },
      { syllables: ['ضِـ', 'رَا', 'سٌ'], result: 'ضِرَاسٌ', meaning: 'أسنان قوية' },
      { syllables: ['مِضْـ', 'رَ', 'بٌ'], result: 'مِضْرَبٌ', meaning: 'مضرب التنس' }
    ],
    syllableBreakdown: [
      { word: 'مَرِيضٌ', parts: ['مَ', 'رِي', 'ضٌ'], syllableCount: 3 },
      { word: 'بَيْضَةٌ', parts: ['بَيْ', 'ضَ', 'ةٌ'], syllableCount: 3 },
      { word: 'حَامِضٌ', parts: ['حَا', 'مِ', 'ضٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['مِضْرَبٌ', 'بِيَدِ', 'كَبِيرٌ', 'رَضِيَّةَ'],
        correctSentence: 'بِيَدِ رَضِيَّةَ مِضْرَبٌ كَبِيرٌ',
        meaningEmoji: '🎾'
      },
      {
        wordsShuffled: ['رِضْوَانَ', 'حَوْلَ', 'مَائِدَةِ', 'أُسْرَةُ', 'رَمَضَانَ'],
        correctSentence: 'أُسْرَةُ رِضْوَانَ حَوْلَ مَائِدَةِ رَمَضَانَ',
        meaningEmoji: '🌙'
      }
    ],
    wordsWithLetter: [
      { word: 'ضَيْفٌ', hasLetter: true },
      { word: 'بَيْضَةٌ', hasLetter: true },
      { word: 'ضَخْمٌ', hasLetter: true },
      { word: 'صَقْرٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 13) حرف النون (ن) - الصفحة 15
  // -------------------------------------------------------------------------
  {
    id: 'letter_noon',
    letter: 'ن',
    letterName: 'حرف النون',
    pageNumber: 15,
    featuredDrawing: 'نَمِرٌ',
    drawingEmoji: '🐅',
    syllableMerge: [
      { syllables: ['لَـ', 'بَـ', 'نٌ'], result: 'لَبَنٌ', meaning: 'حليب طيب' },
      { syllables: ['نَـ', 'سِيـ', 'مٌ'], result: 'نَسِيمٌ', meaning: 'هواء عليل' },
      { syllables: ['لِـ', 'سَـا', 'نٌ'], result: 'لِسَانٌ', meaning: 'عضو النطق' },
      { syllables: ['بُسْـ', 'تَـا', 'نٌ'], result: 'بُسْتَانٌ', meaning: 'حديقة زهور' }
    ],
    syllableBreakdown: [
      { word: 'نَمِرٌ', parts: ['نَ', 'مِ', 'رٌ'], syllableCount: 3 },
      { word: 'نَعْنَاعٌ', parts: ['نَعْ', 'نَا', 'عٌ'], syllableCount: 3 },
      { word: 'صَابُونٌ', parts: ['صَا', 'بُو', 'نٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['الْفَانُوسِ', 'مُنِيرٌ', 'ضَوْءُ'],
        correctSentence: 'ضَوْءُ الْفَانُوسِ مُنِيرٌ',
        meaningEmoji: '🏮'
      }
    ],
    wordsWithLetter: [
      { word: 'نَافِذَةٌ', hasLetter: true },
      { word: 'فَانُوسٌ', hasLetter: true },
      { word: 'نَعْنَاعٌ', hasLetter: true },
      { word: 'بَابٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 14) حرف العين (ع) - الصفحة 16
  // -------------------------------------------------------------------------
  {
    id: 'letter_ayn',
    letter: 'ع',
    letterName: 'حرف العين',
    pageNumber: 16,
    featuredDrawing: 'عَلَمٌ',
    drawingEmoji: '🇲🇦',
    syllableMerge: [
      { syllables: ['عَـ', 'سَـ', 'لٌ'], result: 'عَسَلٌ', meaning: 'عسل النحل' },
      { syllables: ['عِيـ', 'دٌ'], result: 'عِيدٌ', meaning: 'فرحة العيد' },
      { syllables: ['عُـ', 'شٌّ'], result: 'عُشٌّ', meaning: 'بيت الطائر' },
      { syllables: ['جُـ', 'مُـ', 'عَـ', 'ةٌ'], result: 'جُمُعَةٌ', meaning: 'يوم الجمعة المبارك' }
    ],
    syllableBreakdown: [
      { word: 'عَسَلٌ', parts: ['عَ', 'سَ', 'لٌ'], syllableCount: 3 },
      { word: 'عَلَمٌ', parts: ['عَ', 'لَ', 'مٌ'], syllableCount: 3 },
      { word: 'ذِرَاعٌ', parts: ['ذِ', 'رَا', 'عٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['تَصْنَعُ', 'النَّحْلَةُ', 'شَهِيًّا', 'عَسَلاً'],
        correctSentence: 'تَصْنَعُ النَّحْلَةُ عَسَلاً شَهِيًّا',
        meaningEmoji: '🐝'
      },
      {
        wordsShuffled: ['عَدْنَانُ', 'عَلَى', 'عُودٍ', 'عَازِفٌ'],
        correctSentence: 'عَدْنَانُ عَازِفٌ عَلَى عُودٍ',
        meaningEmoji: '🎵'
      }
    ],
    wordsWithLetter: [
      { word: 'عَسَلٌ', hasLetter: true },
      { word: 'عُودٌ', hasLetter: true },
      { word: 'عَلَمٌ', hasLetter: true },
      { word: 'كِتَابٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 15) حرف التاء (ت) - الصفحة 17
  // -------------------------------------------------------------------------
  {
    id: 'letter_taa',
    letter: 'ت',
    letterName: 'حرف التاء',
    pageNumber: 17,
    featuredDrawing: 'تِينٌ',
    drawingEmoji: '🫐',
    syllableMerge: [
      { syllables: ['كَتْـ', 'كُو', 'تٌ'], result: 'كَتْكُوتٌ', meaning: 'صغير الدجاجة' },
      { syllables: ['بَـ', 'نَـا', 'تٌ'], result: 'بَنَاتٌ', meaning: 'جمع بنت' },
      { syllables: ['فُسْـ', 'تَـا', 'نٌ'], result: 'فُسْتَانٌ', meaning: 'ثوب الفتاة' },
      { syllables: ['كَـا', 'تِـ', 'بٌ'], result: 'كَاتِبٌ', meaning: 'يكتب القصص' }
    ],
    syllableBreakdown: [
      { word: 'تِينٌ', parts: ['تِي', 'نٌ'], syllableCount: 2 },
      { word: 'تُوتٌ', parts: ['تُو', 'تٌ'], syllableCount: 2 },
      { word: 'فُسْتَانٌ', parts: ['فُسْ', 'تَا', 'نٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['بِمِظَلَّةٍ', 'فَتِيحَةُ', 'تَسْتَظِلُّ'],
        correctSentence: 'تَسْتَظِلُّ فَتِيحَةُ بِمِظَلَّةٍ',
        meaningEmoji: '☂️'
      },
      {
        wordsShuffled: ['عَمَّتِي', 'تُوتْرُوزُ', 'كَتْكُوتًا', 'رَسَمَتْ'],
        correctSentence: 'رَسَمَتْ عَمَّتِي تُوتْرُوزُ كَتْكُوتًا',
        meaningEmoji: '🐥'
      }
    ],
    wordsWithLetter: [
      { word: 'تُوتٌ', hasLetter: true },
      { word: 'تِينٌ', hasLetter: true },
      { word: 'كَتْكُوتٌ', hasLetter: true },
      { word: 'صَقْرٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 16) حرف الظاء (ظ) - الصفحة 18
  // -------------------------------------------------------------------------
  {
    id: 'letter_dhaa_heavy',
    letter: 'ظ',
    letterName: 'حرف الظاء',
    pageNumber: 18,
    featuredDrawing: 'ظِفْرٌ',
    drawingEmoji: '💅',
    syllableMerge: [
      { syllables: ['غَـ', 'لِيـ', 'ظٌ'], result: 'غَلِيظٌ', meaning: 'سميك وقوي' },
      { syllables: ['ظِـ', 'لاَ', 'لٌ'], result: 'ظِلاَلٌ', meaning: 'ظل الأشجار' },
      { syllables: ['مِـ', 'ظَـ', 'لَّـ', 'ةٌ'], result: 'مِظَلَّةٌ', meaning: 'تحمي من المطر' },
      { syllables: ['نَـظْـ', 'ظَـا', 'رَ', 'ةٌ'], result: 'نَظَّارَةٌ', meaning: 'لحماية العين' }
    ],
    syllableBreakdown: [
      { word: 'ظِلٌّ', parts: ['ظِلْ', 'لٌ'], syllableCount: 2 },
      { word: 'مِظَلَّةٌ', parts: ['مِ', 'ظَلْ', 'لَ', 'ةٌ'], syllableCount: 4 },
      { word: 'مَحْفُوظٌ', parts: ['مَحْ', 'فُو', 'ظٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['شَجَرَةٍ', 'ظِلِّ', 'فِي', 'يَسْتَظِلُّ', 'مَحْفُوظٌ'],
        correctSentence: 'يَسْتَظِلُّ مَحْفُوظٌ فِي ظِلِّ شَجَرَةٍ',
        meaningEmoji: '🌳'
      }
    ],
    wordsWithLetter: [
      { word: 'ظِلٌّ', hasLetter: true },
      { word: 'مِظَلَّةٌ', hasLetter: true },
      { word: 'نَظَّارَةٌ', hasLetter: true },
      { word: 'جَبَلٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 17) حرف الحاء (ح) - الصفحة 19
  // -------------------------------------------------------------------------
  {
    id: 'letter_haa_clean',
    letter: 'ح',
    letterName: 'حرف الحاء',
    pageNumber: 19,
    featuredDrawing: 'حِصَانٌ',
    drawingEmoji: '🐎',
    syllableMerge: [
      { syllables: ['حِـ', 'مَـا', 'رٌ'], result: 'حِمَارٌ', meaning: 'حيوان صبور' },
      { syllables: ['حَـ', 'بْـ', 'لٌ'], result: 'حَبْلٌ', meaning: 'حبل متين' },
      { syllables: ['لِـ', 'حَـا', 'فٌ'], result: 'لِحَافٌ', meaning: 'غطاء دافئ' },
      { syllables: ['حَطْـ', 'طَـا', 'بٌ'], result: 'حَطَّابٌ', meaning: 'يجمع الحطب' }
    ],
    syllableBreakdown: [
      { word: 'حِصَانٌ', parts: ['حِ', 'صَا', 'نٌ'], syllableCount: 3 },
      { word: 'تُفَّاحَةٌ', parts: ['تُفْ', 'فَا', 'حَ', 'ةٌ'], syllableCount: 4 },
      { word: 'جَنَاحٌ', parts: ['جَ', 'نَا', 'حٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['حَسَّامٌ', 'كَثِيرًا', 'حَطَبَ', 'صَبَاحًا', 'حَطَبًا'],
        correctSentence: 'حَطَبَ حَسَّامٌ صَبَاحًا حَطَبًا كَثِيرًا',
        meaningEmoji: '🪓'
      }
    ],
    wordsWithLetter: [
      { word: 'حَبْلٌ', hasLetter: true },
      { word: 'حِمَارٌ', hasLetter: true },
      { word: 'تُفَّاحَةٌ', hasLetter: true },
      { word: 'بَابٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 18) حرف الهاء (هـ) - الصفحة 20
  // -------------------------------------------------------------------------
  {
    id: 'letter_haa_breathing',
    letter: 'هـ',
    letterName: 'حرف الهاء',
    pageNumber: 20,
    featuredDrawing: 'هُدْهُدٌ',
    drawingEmoji: '🐦',
    syllableMerge: [
      { syllables: ['هَـ', 'دِيـ', 'يَـ', 'ةٌ'], result: 'هَدِيَّةٌ', meaning: 'هدية مفرحة' },
      { syllables: ['هِـ', 'لاَ', 'لٌ'], result: 'هِلاَلٌ', meaning: 'هلال أول الشهر' },
      { syllables: ['فَـ', 'هْـ', 'دٌ'], result: 'فَهْدٌ', meaning: 'فهد سريع' },
      { syllables: ['زَهْـ', 'رَ', 'ةٌ'], result: 'زَهْرَةٌ', meaning: 'زهرة فواحة' }
    ],
    syllableBreakdown: [
      { word: 'هُدْهُدٌ', parts: ['هُدْ', 'هُ', 'دٌ'], syllableCount: 3 },
      { word: 'هِلاَلٌ', parts: ['هِ', 'لاَ', 'لٌ'], syllableCount: 3 },
      { word: 'زَهْرَةٌ', parts: ['زَهْ', 'رَ', 'ةٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['فَاطِمَ', 'هَاتَفَ', 'بِنْتَهُ', 'مَحْمُودٌ'],
        correctSentence: 'هَاتَفَ مَحْمُودٌ بِنْتَهُ فَاطِمَ',
        meaningEmoji: '📞'
      }
    ],
    wordsWithLetter: [
      { word: 'هِلاَلٌ', hasLetter: true },
      { word: 'فَهْدٌ', hasLetter: true },
      { word: 'هُدْهُدٌ', hasLetter: true },
      { word: 'شَمْسٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 19) الهمزة (ء) - الصفحة 21
  // -------------------------------------------------------------------------
  {
    id: 'letter_hamza',
    letter: 'ء',
    letterName: 'الهمزة',
    pageNumber: 21,
    featuredDrawing: 'مَاءٌ',
    drawingEmoji: '💧',
    syllableMerge: [
      { syllables: ['دَ', 'وَا', 'ءٌ'], result: 'دَوَاءٌ', meaning: 'دواء الشفاء' },
      { syllables: ['هَـ', 'وَا', 'ءٌ'], result: 'هَوَاءٌ', meaning: 'هواء نقي' },
      { syllables: ['رَ', 'ئِيـ', 'سٌ'], result: 'رَئِيسٌ', meaning: 'رئيس الفريق' },
      { syllables: ['مَـا', 'ئِـ', 'دَ', 'ةٌ'], result: 'مَائِدَةٌ', meaning: 'مائدة الأسرة' }
    ],
    syllableBreakdown: [
      { word: 'مَاءٌ', parts: ['مَا', 'ءٌ'], syllableCount: 2 },
      { word: 'دَوَاءٌ', parts: ['دَ', 'وَا', 'ءٌ'], syllableCount: 3 },
      { word: 'هَوَاءٌ', parts: ['هَ', 'وَا', 'ءٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['هَذِهِ', 'جِرَاءٍ', 'صَغِيرَةٍ', 'أَرْبَعَةُ'],
        correctSentence: 'هَذِهِ أَرْبَعَةُ جِرَاءٍ صَغِيرَةٍ',
        meaningEmoji: '🐕'
      },
      {
        wordsShuffled: ['حَسْنَاءُ', 'حَسَاءً', 'تَحْتَسِي', 'مَسَاءً'],
        correctSentence: 'تَحْتَسِي حَسْنَاءُ حَسَاءً مَسَاءً',
        meaningEmoji: '🥣'
      }
    ],
    wordsWithLetter: [
      { word: 'مَاءٌ', hasLetter: true },
      { word: 'دَوَاءٌ', hasLetter: true },
      { word: 'سَمَاءٌ', hasLetter: true },
      { word: 'قَلَمٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 20) حرف الجيم (ج) - الصفحة 22
  // -------------------------------------------------------------------------
  {
    id: 'letter_jeem',
    letter: 'ج',
    letterName: 'حرف الجيم',
    pageNumber: 22,
    featuredDrawing: 'جَمَلٌ',
    drawingEmoji: '🐪',
    syllableMerge: [
      { syllables: ['جَـ', 'مَـ', 'لٌ'], result: 'جَمَلٌ', meaning: 'سفينة الصحراء' },
      { syllables: ['جَـ', 'دِيـ', 'دٌ'], result: 'جَدِيدٌ', meaning: 'ثوب جديد' },
      { syllables: ['دَ', 'جَـا', 'جَـ', 'ةٌ'], result: 'دَجَاجَةٌ', meaning: 'دجاجة المزرعة' },
      { syllables: ['نَجْـ', 'جَـا', 'رٌ'], result: 'نَجَّارٌ', meaning: 'يصنع الأثاث الخشبي' }
    ],
    syllableBreakdown: [
      { word: 'جَمَلٌ', parts: ['جَ', 'مَ', 'لٌ'], syllableCount: 3 },
      { word: 'دَرَّاجَةٌ', parts: ['دَرْ', 'رَا', 'جَ', 'ةٌ'], syllableCount: 4 },
      { word: 'شَجَرَةٌ', parts: ['شَ', 'جَ', 'رَ', 'ةٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['مَحْجُوبٌ', 'لِيُطْعِمَ', 'نِعَاجَهُ', 'جَاءَ', 'الْجَائِعَةَ'],
        correctSentence: 'جَاءَ مَحْجُوبٌ لِيُطْعِمَ نِعَاجَهُ الْجَائِعَةَ',
        meaningEmoji: '🐑'
      }
    ],
    wordsWithLetter: [
      { word: 'جَمَلٌ', hasLetter: true },
      { word: 'دَجَاجَةٌ', hasLetter: true },
      { word: 'جَدِيدٌ', hasLetter: true },
      { word: 'دَفْتَرٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 21) حرف الخاء (خ) - الصفحة 23
  // -------------------------------------------------------------------------
  {
    id: 'letter_khaa',
    letter: 'خ',
    letterName: 'حرف الخاء',
    pageNumber: 23,
    featuredDrawing: 'خَرُوفٌ',
    drawingEmoji: '🐑',
    syllableMerge: [
      { syllables: ['خُـ', 'بْـ', 'زٌ'], result: 'خُبْزٌ', meaning: 'خبز طازج' },
      { syllables: ['خُـ', 'ضَـ', 'رٌ'], result: 'خُضَرٌ', meaning: 'خضار صحية' },
      { syllables: ['خَـا', 'وٍ'], result: 'خَاوٍ', meaning: 'فارغ' },
      { syllables: ['خِـ', 'رَا', 'فٌ'], result: 'خِرَافٌ', meaning: 'جمع خروف' }
    ],
    syllableBreakdown: [
      { word: 'خَوْخٌ', parts: ['خَوْ', 'خٌ'], syllableCount: 2 },
      { word: 'خَرُوفٌ', parts: ['خَ', 'رُو', 'فٌ'], syllableCount: 3 },
      { word: 'بَاخِرَةٌ', parts: ['بَا', 'خِ', 'رَ', 'ةٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['تَحْتَ', 'النَّخِيلِ', 'خَمْسَةُ', 'أَشْجَارِ', 'خِرَافٍ'],
        correctSentence: 'خَمْسَةُ خِرَافٍ تَحْتَ أَشْجَارِ النَّخِيلِ',
        meaningEmoji: '🌴'
      }
    ],
    wordsWithLetter: [
      { word: 'خُبْزٌ', hasLetter: true },
      { word: 'خَوْخٌ', hasLetter: true },
      { word: 'خِرَافٌ', hasLetter: true },
      { word: 'قَمَرٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 22) حرف الغين (غ) - الصفحة 24
  // -------------------------------------------------------------------------
  {
    id: 'letter_ghayn',
    letter: 'غ',
    letterName: 'حرف الغين',
    pageNumber: 24,
    featuredDrawing: 'غَزَالٌ',
    drawingEmoji: '🦌',
    syllableMerge: [
      { syllables: ['غَـ', 'سِيـ', 'لٌ'], result: 'غَسِيلٌ', meaning: 'ملابس نظيفة' },
      { syllables: ['مَـغْـ', 'رِ', 'بٌ'], result: 'مَغْرِبٌ', meaning: 'وقت غروب الشمس' },
      { syllables: ['صِـ', 'بَـا', 'غٌ'], result: 'صِبَاغٌ', meaning: 'ألوان' },
      { syllables: ['فَـ', 'رَا', 'غٌ'], result: 'فَرَاغٌ', meaning: 'وقت الفراغ' }
    ],
    syllableBreakdown: [
      { word: 'غَزَالٌ', parts: ['غَ', 'زَا', 'لٌ'], syllableCount: 3 },
      { word: 'غِرْبَالٌ', parts: ['غِرْ', 'بَا', 'لٌ'], syllableCount: 3 },
      { word: 'دِمَاغٌ', parts: ['دِ', 'مَا', 'غٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['عَلَى', 'شَجَرَةٍ', 'غُصْنِ', 'فِي', 'بَبَّغَاءُ', 'الْغَابَةِ'],
        correctSentence: 'بَبَّغَاءُ عَلَى غُصْنِ شَجَرَةٍ فِي الْغَابَةِ',
        meaningEmoji: '🦜'
      }
    ],
    wordsWithLetter: [
      { word: 'غَزَالٌ', hasLetter: true },
      { word: 'غِرْبَالٌ', hasLetter: true },
      { word: 'مَغْرِبٌ', hasLetter: true },
      { word: 'عَلَمٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 23) حرف الكاف (ك) - الصفحة 25
  // -------------------------------------------------------------------------
  {
    id: 'letter_kaaf',
    letter: 'ك',
    letterName: 'حرف الكاف',
    pageNumber: 25,
    featuredDrawing: 'كَرَزٌ',
    drawingEmoji: '🍒',
    syllableMerge: [
      { syllables: ['شُبْـ', 'بَـا', 'كٌ'], result: 'شُبَّاكٌ', meaning: 'نافذة البيت' },
      { syllables: ['دُكْـ', 'كَـا', 'نٌ'], result: 'دُكَّانٌ', meaning: 'متجر الحي' },
      { syllables: ['كَعْـ', 'كَـ', 'ةٌ'], result: 'كَعْكَةٌ', meaning: 'حلوى لذيذة' },
      { syllables: ['مَكْـ', 'تَـ', 'بٌ'], result: 'مَكْتَبٌ', meaning: 'للدراسة والعمل' }
    ],
    syllableBreakdown: [
      { word: 'كَعْكَةٌ', parts: ['كَعْ', 'كَ', 'ةٌ'], syllableCount: 3 },
      { word: 'سِكِّينٌ', parts: ['سِكْ', 'كِي', 'نٌ'], syllableCount: 3 },
      { word: 'كُؤُوسٌ', parts: ['كُ', 'ؤُو', 'سٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['كَمَالٌ', 'يَرْكُضَ', 'أَنْ', 'يُحِبُّ', 'كَثِيرًا'],
        correctSentence: 'يُحِبُّ كَمَالٌ أَنْ يَرْكُضَ كَثِيرًا',
        meaningEmoji: '🏃'
      },
      {
        wordsShuffled: ['كَمَالٌ', 'يَكْرَهُ', 'بِالسُّكَّرِ', 'الْكَعْكَ'],
        correctSentence: 'يَكْرَهُ كَمَالٌ الْكَعْكَ بِالسُّكَّرِ',
        meaningEmoji: '🍰'
      }
    ],
    wordsWithLetter: [
      { word: 'كَعْكَةٌ', hasLetter: true },
      { word: 'كِتَابٌ', hasLetter: true },
      { word: 'شُبَّاكٌ', hasLetter: true },
      { word: 'قَلَمٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 24) حرف الثاء (ث) - الصفحة 26
  // -------------------------------------------------------------------------
  {
    id: 'letter_thaa',
    letter: 'ث',
    letterName: 'حرف الثاء',
    pageNumber: 26,
    featuredDrawing: 'ثَوْرٌ',
    drawingEmoji: '🐂',
    syllableMerge: [
      { syllables: ['ثَوْ', 'بٌ'], result: 'ثَوْبٌ', meaning: 'لباس نظيف' },
      { syllables: ['ثُو', 'مٌ'], result: 'ثُومٌ', meaning: 'نبات مفيد' },
      { syllables: ['ثَـ', 'لاَ', 'ثَـ', 'ةٌ'], result: 'ثَلاَثَةٌ', meaning: 'رقم 3' },
      { syllables: ['ثِـ', 'قَـا', 'بٌ'], result: 'ثِقَابٌ', meaning: 'عود الثقاب' }
    ],
    syllableBreakdown: [
      { word: 'ثَوْرٌ', parts: ['ثَوْ', 'رٌ'], syllableCount: 2 },
      { word: 'ثَلاَّجَةٌ', parts: ['ثَلْ', 'لاَ', 'جَ', 'ةٌ'], syllableCount: 4 },
      { word: 'مُثَلَّثٌ', parts: ['مُ', 'ثَلْ', 'لَ', 'ثٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['كُلْثُومٍ', 'بِنْتُ', 'مُثَلَّثَاتٍ', 'تَرْسُمُ'],
        correctSentence: 'تَرْسُمُ بِنْتُ كُلْثُومٍ مُثَلَّثَاتٍ',
        meaningEmoji: '📐'
      }
    ],
    wordsWithLetter: [
      { word: 'ثَوْبٌ', hasLetter: true },
      { word: 'ثُومٌ', hasLetter: true },
      { word: 'ثَلاَثَةٌ', hasLetter: true },
      { word: 'تُوتٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 25) حرف القاف (ق) - الصفحة 27
  // -------------------------------------------------------------------------
  {
    id: 'letter_qaaf',
    letter: 'ق',
    letterName: 'حرف القاف',
    pageNumber: 27,
    featuredDrawing: 'قَمَرٌ',
    drawingEmoji: '🌕',
    syllableMerge: [
      { syllables: ['فَـ', 'رِيـ', 'قٌ'], result: 'فَرِيقٌ', meaning: 'فريق رياضي' },
      { syllables: ['طَـ', 'بِيـ', 'قٌ'], result: 'طَبِيقٌ', meaning: 'أكلة شهية' },
      { syllables: ['بَـ', 'قَـ', 'رَ', 'ةٌ'], result: 'بَقَرَةٌ', meaning: 'تعطينا الحليب' },
      { syllables: ['قِـ', 'طَـا', 'رٌ'], result: 'قِطَارٌ', meaning: 'قطار سريع' }
    ],
    syllableBreakdown: [
      { word: 'قَمَرٌ', parts: ['قَ', 'مَ', 'رٌ'], syllableCount: 3 },
      { word: 'بَقَرَةٌ', parts: ['بَ', 'قَ', 'رَ', 'ةٌ'], syllableCount: 4 },
      { word: 'قِطَارٌ', parts: ['قِ', 'طَا', 'رٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['طَائِرٌ', 'الصَّقْرُ', 'مِنْقَارٌ', 'قَوِيٌّ', 'لَهُ'],
        correctSentence: 'الصَّقْرُ طَائِرٌ لَهُ مِنْقَارٌ قَوِيٌّ',
        meaningEmoji: '🦅'
      },
      {
        wordsShuffled: ['بَرْقُوقًا', 'السُّوقِ', 'رُقَيَّةُ', 'اشْتَرَتْ', 'مِنَ'],
        correctSentence: 'اشْتَرَتْ رُقَيَّةُ بَرْقُوقًا مِنَ السُّوقِ',
        meaningEmoji: '🍇'
      }
    ],
    wordsWithLetter: [
      { word: 'قَمَرٌ', hasLetter: true },
      { word: 'قِطَارٌ', hasLetter: true },
      { word: 'بَقَرَةٌ', hasLetter: true },
      { word: 'فِيلٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 26) حرف الشين (ش) - الصفحة 28
  // -------------------------------------------------------------------------
  {
    id: 'letter_sheen',
    letter: 'ش',
    letterName: 'حرف الشين',
    pageNumber: 28,
    featuredDrawing: 'شَمْسٌ',
    drawingEmoji: '☀️',
    syllableMerge: [
      { syllables: ['شَـمْـ', 'سٌ'], result: 'شَمْسٌ', meaning: 'تضيء الكون' },
      { syllables: ['شَـا', 'يٌ'], result: 'شَايٌ', meaning: 'مشروب دافئ' },
      { syllables: ['خَـ', 'شَـ', 'بٌ'], result: 'خَشَبٌ', meaning: 'خشب الأشجار' },
      { syllables: ['رِيـ', 'شٌ'], result: 'رِيشٌ', meaning: 'ريش الطيور' }
    ],
    syllableBreakdown: [
      { word: 'شَمْسٌ', parts: ['شَمْ', 'سٌ'], syllableCount: 2 },
      { word: 'مِشْمِشٌ', parts: ['مِشْ', 'مِ', 'شٌ'], syllableCount: 3 },
      { word: 'فَرَاشَاتٌ', parts: ['فَ', 'رَا', 'شَا', 'تٌ'], syllableCount: 4 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['الشُّحْرُورُ', 'فَوْقَ', 'يَشْدُو', 'شَجَرَةٍ', 'غُصْنِ'],
        correctSentence: 'الشُّحْرُورُ يَشْدُو فَوْقَ غُصْنِ شَجَرَةٍ',
        meaningEmoji: '🐦'
      },
      {
        wordsShuffled: ['شِبْشِبُ', 'رَشِيدَةَ', 'قَشِيبٌ', 'أُخْتِ', 'شَفِيقٍ'],
        correctSentence: 'شِبْشِبُ شَفِيقٍ أُخْتِ رَشِيدَةَ قَشِيبٌ',
        meaningEmoji: '🩴'
      }
    ],
    wordsWithLetter: [
      { word: 'شَمْسٌ', hasLetter: true },
      { word: 'مِشْمِشٌ', hasLetter: true },
      { word: 'شَايٌ', hasLetter: true },
      { word: 'سَمَكَةٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 27) حرف الواو (و) - الصفحة 29
  // -------------------------------------------------------------------------
  {
    id: 'letter_waaw',
    letter: 'و',
    letterName: 'حرف الواو',
    pageNumber: 29,
    featuredDrawing: 'وَرْدَةٌ',
    drawingEmoji: '🌹',
    syllableMerge: [
      { syllables: ['دَلْـ', 'وٌ'], result: 'دَلْوٌ', meaning: 'لجلب الماء' },
      { syllables: ['وِ', 'عَـا', 'ءٌ'], result: 'وِعَاءٌ', meaning: 'إناء للطعام' },
      { syllables: ['وَ', 'رَ', 'قَـ', 'ةٌ'], result: 'وَرَقَةٌ', meaning: 'ورقة الشجر' },
      { syllables: ['لَـوْ', 'زٌ'], result: 'لَوْزٌ', meaning: 'مكسرات مفيدة' }
    ],
    syllableBreakdown: [
      { word: 'وَرَقَةٌ', parts: ['وَ', 'رَ', 'قَ', 'ةٌ'], syllableCount: 4 },
      { word: 'دَلْوٌ', parts: ['دَلْ', 'وٌ'], syllableCount: 2 },
      { word: 'وَطْوَاطٌ', parts: ['وَطْ', 'وَا', 'طٌ'], syllableCount: 3 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['حَمَلاَنِ', 'الْوَادِي', 'يَلْهُوَانِ', 'بِجَانِبِ'],
        correctSentence: 'حَمَلاَنِ يَلْهُوَانِ بِجَانِبِ الْوَادِي',
        meaningEmoji: '🐑'
      },
      {
        wordsShuffled: ['مَزْهُوٌّ', 'الطَّاوُوسُ', 'الطَّوِيلِ', 'بِرِيشِهِ'],
        correctSentence: 'الطَّاوُوسُ مَزْهُوٌّ بِرِيشِهِ الطَّوِيلِ',
        meaningEmoji: '🦚'
      }
    ],
    wordsWithLetter: [
      { word: 'وَرْدَةٌ', hasLetter: true },
      { word: 'دَلْوٌ', hasLetter: true },
      { word: 'وِعَاءٌ', hasLetter: true },
      { word: 'قَلَمٌ', hasLetter: false }
    ]
  },

  // -------------------------------------------------------------------------
  // 28) حرف الياء (ي) - الصفحة 30
  // -------------------------------------------------------------------------
  {
    id: 'letter_yaa',
    letter: 'ي',
    letterName: 'حرف الياء',
    pageNumber: 30,
    featuredDrawing: 'يَدٌ',
    drawingEmoji: '✋',
    syllableMerge: [
      { syllables: ['طَـ', 'وِيـ', 'لٌ'], result: 'طَوِيلٌ', meaning: 'عالي القامة' },
      { syllables: ['صَـ', 'بِيـ', 'يٌ'], result: 'صَبِيٌّ', meaning: 'طفل صغير' },
      { syllables: ['رَا', 'دْ', 'يُـ', 'و'], result: 'رَادْيُو', meaning: 'مذياع الصوت' },
      { syllables: ['فَـ', 'نَـا', 'نِيـ', 'سُ'], result: 'فَنَانِيسُ', meaning: 'فوانيس رمضانية' }
    ],
    syllableBreakdown: [
      { word: 'يَدٌ', parts: ['يَ', 'دٌ'], syllableCount: 2 },
      { word: 'دُمْيَةٌ', parts: ['دُمْ', 'يَ', 'ةٌ'], syllableCount: 3 },
      { word: 'نَايٌ', parts: ['نَا', 'يٌ'], syllableCount: 2 }
    ],
    sentenceOrdering: [
      {
        wordsShuffled: ['فِي', 'الْجَوِّ', 'طُيُورٌ', 'هَذِهِ', 'تُحَلِّقُ'],
        correctSentence: 'تُحَلِّقُ هَذِهِ طُيُورٌ فِي الْجَوِّ',
        meaningEmoji: '🕊️'
      },
      {
        wordsShuffled: ['تَرْوِي', 'الْوُرُودَ', 'وَالْعُشْبَ', 'وِدَادُ'],
        correctSentence: 'تَرْوِي وِدَادُ الْوُرُودَ وَالْعُشْبَ',
        meaningEmoji: '🌷'
      }
    ],
    wordsWithLetter: [
      { word: 'يَدٌ', hasLetter: true },
      { word: 'طَيْرٌ', hasLetter: true },
      { word: 'بَيْتٌ', hasLetter: true },
      { word: 'أَسَدٌ', hasLetter: false }
    ]
  }
];
