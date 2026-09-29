export interface MidYearLetterItem {
  id: string;
  letter: string;
  name: string;
  short: {
    fatha: string;
    kasra: string;
    damma: string;
  };
  long: {
    alif: string;
    yaa: string;
    waw: string;
  };
}

export const MIDYEAR_LETTERS_GRID: MidYearLetterItem[] = [
  // الصف الأول (م، ب، ل، د)
  {
    id: 'l_m',
    letter: 'م',
    name: 'الميم',
    short: { fatha: 'مَ', kasra: 'مِ', damma: 'مُ' },
    long: { alif: 'مَا', yaa: 'مِي', waw: 'مُو' }
  },
  {
    id: 'l_b',
    letter: 'ب',
    name: 'الباء',
    short: { fatha: 'بَ', kasra: 'بِ', damma: 'بُ' },
    long: { alif: 'بَا', yaa: 'بِي', waw: 'بُو' }
  },
  {
    id: 'l_l',
    letter: 'ل',
    name: 'اللام',
    short: { fatha: 'لَ', kasra: 'لِ', damma: 'لُ' },
    long: { alif: 'لَا', yaa: 'لِي', waw: 'لُو' }
  },
  {
    id: 'l_d',
    letter: 'د',
    name: 'الدال',
    short: { fatha: 'دَ', kasra: 'دِ', damma: 'دُ' },
    long: { alif: 'دَا', yaa: 'دِي', waw: 'دُو' }
  },

  // الصف الثاني (ن، ر، ص، ف)
  {
    id: 'l_n',
    letter: 'ن',
    name: 'النون',
    short: { fatha: 'نَ', kasra: 'نِ', damma: 'نُ' },
    long: { alif: 'نَا', yaa: 'نِي', waw: 'نُو' }
  },
  {
    id: 'l_r',
    letter: 'ر',
    name: 'الراء',
    short: { fatha: 'رَ', kasra: 'رِ', damma: 'رُ' },
    long: { alif: 'رَا', yaa: 'رِي', waw: 'رُو' }
  },
  {
    id: 'l_s9',
    letter: 'ص',
    name: 'الصاد',
    short: { fatha: 'صَ', kasra: 'صِ', damma: 'صُ' },
    long: { alif: 'صَا', yaa: 'صِي', waw: 'صُو' }
  },
  {
    id: 'l_f',
    letter: 'ف',
    name: 'الفاء',
    short: { fatha: 'فَ', kasra: 'فِ', damma: 'فُ' },
    long: { alif: 'فَا', yaa: 'فِي', waw: 'فُو' }
  },

  // الصف الثالث (س، ق، ت، ح)
  {
    id: 'l_s',
    letter: 'س',
    name: 'السين',
    short: { fatha: 'سَ', kasra: 'سِ', damma: 'سُ' },
    long: { alif: 'سَا', yaa: 'سِي', waw: 'سُو' }
  },
  {
    id: 'l_q',
    letter: 'ق',
    name: 'القاف',
    short: { fatha: 'قَ', kasra: 'قِ', damma: 'قُ' },
    long: { alif: 'قَا', yaa: 'قِي', waw: 'قُو' }
  },
  {
    id: 'l_t',
    letter: 'ت',
    name: 'التاء',
    short: { fatha: 'تَ', kasra: 'تِ', damma: 'تُ' },
    long: { alif: 'تَا', yaa: 'تِي', waw: 'تُو' }
  },
  {
    id: 'l_h7',
    letter: 'ح',
    name: 'الحاء',
    short: { fatha: 'حَ', kasra: 'حِ', damma: 'حُ' },
    long: { alif: 'حَا', yaa: 'حِي', waw: 'حُو' }
  },

  // الصف الرابع (أ، ط، ز، و)
  {
    id: 'l_a',
    letter: 'أ',
    name: 'الهمزة / الألف',
    short: { fatha: 'أَ', kasra: 'إِ', damma: 'أُ' },
    long: { alif: 'آ', yaa: 'إِي', waw: 'أُو' }
  },
  {
    id: 'l_t9',
    letter: 'ط',
    name: 'الطاء',
    short: { fatha: 'طَ', kasra: 'طِ', damma: 'طُ' },
    long: { alif: 'طَا', yaa: 'طِي', waw: 'طُو' }
  },
  {
    id: 'l_z',
    letter: 'ز',
    name: 'الزاي',
    short: { fatha: 'زَ', kasra: 'زِ', damma: 'زُ' },
    long: { alif: 'زَا', yaa: 'زِي', waw: 'زُو' }
  },
  {
    id: 'l_w',
    letter: 'و',
    name: 'الواو',
    short: { fatha: 'وَ', kasra: 'وِ', damma: 'وُ' },
    long: { alif: 'وَا', yaa: 'وِي', waw: 'وُو' }
  },

  // الصف الخامس (ج، ش، ض، ع)
  {
    id: 'l_j',
    letter: 'ج',
    name: 'الجيم',
    short: { fatha: 'جَ', kasra: 'جِ', damma: 'جُ' },
    long: { alif: 'جَا', yaa: 'جِي', waw: 'جُو' }
  },
  {
    id: 'l_sh',
    letter: 'ش',
    name: 'الشين',
    short: { fatha: 'شَ', kasra: 'شِ', damma: 'شُ' },
    long: { alif: 'شَا', yaa: 'شِي', waw: 'شُو' }
  },
  {
    id: 'l_d9',
    letter: 'ض',
    name: 'الضاد',
    short: { fatha: 'ضَ', kasra: 'ضِ', damma: 'ضُ' },
    long: { alif: 'ضَا', yaa: 'ضِي', waw: 'ضُو' }
  },
  {
    id: 'l_3',
    letter: 'ع',
    name: 'العين',
    short: { fatha: 'عَ', kasra: 'عِ', damma: 'عُ' },
    long: { alif: 'عَا', yaa: 'عِي', waw: 'عُو' }
  },

  // الصف السادس (ك، خ، ي، ذ)
  {
    id: 'l_k',
    letter: 'ك',
    name: 'الكاف',
    short: { fatha: 'كَ', kasra: 'كِ', damma: 'كُ' },
    long: { alif: 'كَا', yaa: 'كِي', waw: 'كُو' }
  },
  {
    id: 'l_kh',
    letter: 'خ',
    name: 'الخاء',
    short: { fatha: 'خَ', kasra: 'خِ', damma: 'خُ' },
    long: { alif: 'خَا', yaa: 'خِي', waw: 'خُو' }
  },
  {
    id: 'l_y',
    letter: 'ي',
    name: 'الياء',
    short: { fatha: 'يَ', kasra: 'يِ', damma: 'يُ' },
    long: { alif: 'يَا', yaa: 'يِي', waw: 'يُو' }
  },
  {
    id: 'l_dh',
    letter: 'ذ',
    name: 'الذال',
    short: { fatha: 'ذَ', kasra: 'ذِ', damma: 'ذُ' },
    long: { alif: 'ذَا', yaa: 'ذِي', waw: 'ذُو' }
  },

  // الصف السابع (هـ، ث، غ، ظ)
  {
    id: 'l_h',
    letter: 'هـ',
    name: 'الهاء',
    short: { fatha: 'هَـ', kasra: 'هِـ', damma: 'هُـ' },
    long: { alif: 'هَا', yaa: 'هِي', waw: 'هُو' }
  },
  {
    id: 'l_th',
    letter: 'ث',
    name: 'الثاء',
    short: { fatha: 'ثَ', kasra: 'ثِ', damma: 'ثُ' },
    long: { alif: 'ثَا', yaa: 'ثِي', waw: 'ثُو' }
  },
  {
    id: 'l_gh',
    letter: 'غ',
    name: 'الغين',
    short: { fatha: 'غَ', kasra: 'غِ', damma: 'غُ' },
    long: { alif: 'غَا', yaa: 'غِي', waw: 'غُو' }
  },
  {
    id: 'l_z9',
    letter: 'ظ',
    name: 'الظاء',
    short: { fatha: 'ظَ', kasra: 'ظِ', damma: 'ظُ' },
    long: { alif: 'ظَا', yaa: 'ظِي', waw: 'ظُو' }
  }
];

export interface MidYearColumn {
  id: string;
  title: string;
  badge: string;
  themeColor: string;
  words: string[];
}

export const MIDYEAR_WORDS_COLUMNS: MidYearColumn[] = [
  {
    id: 'col_sakina',
    title: 'مقطع ساكن سريع',
    badge: 'سكون',
    themeColor: 'amber',
    words: ['كُنْ', 'قَدْ', 'سِرْ', 'لَمْ', 'صُمْ', 'قِفْ', 'رُدَّ', 'فُزْ', 'جِدْ', 'عِشْ', 'أَدْ', 'طِرْ']
  },
  {
    id: 'col_thulathi',
    title: 'كلمات ثلاثية بالحركات',
    badge: 'حركات قصيرة',
    themeColor: 'emerald',
    words: ['بَلَدُ', 'رَمَلَ', 'رَبَدَ', 'نَدِمَ', 'رَمَدُ', 'بَدَنُ', 'رَدَمَ', 'لَبِنُ', 'صَعُبَ', 'قَدُرَ', 'سَهُلَ', 'نَسَرَ']
  },
  {
    id: 'col_madd',
    title: 'كلمات بها مدود',
    badge: 'مدود',
    themeColor: 'blue',
    words: ['بَابُ', 'عُودُ', 'قِيسَ', 'نُورُ', 'صَادَ', 'فِيلُ', 'صِينُ', 'دَارُ', 'سُورُ', 'سُودُ', 'عِيدُ', 'جَادَ']
  },
  {
    id: 'col_sight',
    title: 'كلمات بصرية ومدود',
    badge: 'بصرية',
    themeColor: 'purple',
    words: ['حَامِدُ', 'يَأْتِي', 'مُوسَى', 'صُوَرِي', 'جَاهِلُ', 'صَادِقُ', 'حَصْرِي', 'وَقْتِي', 'حَرْفِي', 'لَوْمِي', 'عُودِي', 'رَامِي']
  },
  {
    id: 'col_verbs_sakina',
    title: 'أفعال بالمقطع الساكن',
    badge: 'أفعال ساكنة',
    themeColor: 'rose',
    words: ['نُمْسِكُ', 'نَصْرِفُ', 'مَلْعَبُ', 'مِرْسَمُ', 'مُخْلِصًا', 'مُحْسِنًا', 'أَسْلَمَ', 'أَخْلَدَ', 'يَغْسِلُ', 'يَفْرَحُ', 'يَفْقِدُ', 'يَصْمُدُ']
  },
  {
    id: 'col_verbs_mudaria',
    title: 'أفعال مضارعة بالحركات',
    badge: 'مضارع',
    themeColor: 'sky',
    words: ['يَهْرُبُ', 'يَقْبَلُ', 'نَسْهَرُ', 'يَحْجُبُ', 'يَبْسُطُ', 'يَغْرِسُ', 'يَزْرَعُ', 'يَحْمِلُ', 'أَحْمَدُ', 'أَخْرَجَ', 'أَعْلَمُ', 'أَخْبَرَ']
  },
  {
    id: 'col_shamsiya_qamariya',
    title: 'الـ الشمسية والـ القمرية',
    badge: 'الـ التعريف',
    themeColor: 'indigo',
    words: ['الشَّمْسُ', 'الْقَمَرُ', 'اللَّيْلُ', 'الْحِلْمُ', 'الصُّبْحُ', 'الْغَرْبُ', 'السُّرُجُ', 'الْكَرْبُ', 'التَّمْرُ', 'الْوَصْلُ', 'التَّوْتُ', 'الْعِلْمُ']
  },
  {
    id: 'col_tanween',
    title: 'ظواهر صوتية وتنوين',
    badge: 'تنوين وظواهر',
    themeColor: 'teal',
    words: ['الْفَصْلُ', 'اللَّوْنُ', 'الْقَصْرُ', 'الطَّيْرُ', 'الْحَرْفُ', 'الرَّمْلُ', 'الْحَوْرُ', 'الصَّبْرُ', 'الْبَوْقُ', 'الضَّبْعُ', 'الْعُنْوَانُ', 'النُّورُ']
  },
  {
    id: 'col_taa',
    title: 'التاء المربوطة والمفتوحة',
    badge: 'التاءات',
    themeColor: 'pink',
    words: ['بَيْتُ', 'شَجَرَةُ', 'لَوْحَةُ', 'ذَهَبَتْ', 'نَامَتْ', 'زَيْتُ', 'رَفْعَةُ', 'صَدْمَةُ', 'حُوتُ', 'صَدَقَةُ', 'فَاتَ', 'عِبْرَةُ']
  },
  {
    id: 'col_sentences',
    title: 'جمل الطلاقة والانطلاق القرائي',
    badge: 'جمل كاملة 🚀',
    themeColor: 'amber',
    words: [
      'أَكْرِمْ تُشْكَرْ',
      'أَحْسِنْ تُسْعَدْ',
      'اِعْمَلْ تَنْجَحْ',
      'فَيْصَلٌ يَقْرَأُ الْكُتُبَ',
      'مِنْ فَضْلِكَ مَنْ أَنْتَ؟',
      'الْوَلَدُ يَرْفَعُ الْعَلَمَ',
      'ذَاكِرْ دَرْسَكَ كَيْ تَنْجَحَ',
      'أَحْمَدُ يَكْتُبُ دَرْسَهُ',
      'هِنْدٌ تَقْرَأُ الْمُصْحَفَ',
      'نَحْنُ نَلْعَبُ وَنَمْرَحُ',
      'أَكَلَ الأَرْنَبُ الْجَزَرَ',
      'الْجَمَلُ يَأْكُلُ الْعُشْبَ'
    ]
  }
];
