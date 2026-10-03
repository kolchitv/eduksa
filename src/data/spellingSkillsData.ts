/**
 * بنية بيانات وبنك الكلمات لمهارات مسار الإملاء المطورة:
 * 1. التاء المربوطة والتاء المفتوحة (ة / ت)
 * 2. الهمزة المتوسطة (أ / ؤ / ئ / ء)
 * 3. الهمزة المتطرفة (أ / ؤ / ئ / ء)
 * 4. المفرد والمثنى والجمع (👤👥)
 *
 * البنك يدعم التخزين المركزي وإمكانية الإضافة من لوحة التحكم للمعلم
 */

export type SpellingSkillId = 'taa_types' | 'middle_hamza' | 'final_hamza' | 'singular_dual_plural';

export type SpellingSubSkill = 
  | 'taaMarbuta' 
  | 'taaMaftuha' 
  | 'middleHamza' 
  | 'finalHamza' 
  | 'singular' 
  | 'dual' 
  | 'plural';

export type SkillDifficulty = 'easy' | 'medium' | 'hard';

export interface SpellingSkillBankItem {
  id: string;
  word: string; // الكلمة المجردة (للمقارنة في الإملاء)
  tashkeel: string; // الكلمة بالتشكيل الكامل
  audioText: string; // النص المنطوق الفصيح
  emoji: string; // الرمز البصري أو الصورة
  skill: SpellingSkillId; // المهارة الأساسية
  subSkill: SpellingSubSkill; // المهارة الفرعية
  gradeLevel: string; // الصف الدراسي
  unit: string; // الوحدة
  difficulty: SkillDifficulty; // 🟢 سهل | 🟡 متوسط | 🔴 متقدم
  correctAnswer: string; // الإجابة الصحيحة
  options: string[]; // خيارات الاختيار من متعدد
  explanation: string; // الشرح والتفسير والقاعدة
  sentenceExample: string; // جملة قصيرة تحتوي على الكلمة للإملاء المتقدم
  
  // حقول متخصصة للتاء:
  incompleteWord?: string; // كلمة ناقصة (مدرسـ؟)
  wrongSpelling?: string; // كلمة بخطأ لتصحيحها (مدرست)
  
  // حقول متخصصة للهمزة المتوسطة والمتطرفة:
  hamzaChair?: 'أ' | 'ؤ' | 'ئ' | 'ء';
  whyWritten?: string; // سبب كتابة الهمزة (قاعدة أقوى الحركتين)
  
  // حقول متخصصة للمفرد والمثنى والجمع:
  singularForm?: string;
  dualForm?: string;
  pluralForm?: string;
  itemCountVisual?: number; // 1 | 2 | 3
}

export const CENTRAL_SPELLING_SKILLS_DATA: SpellingSkillBankItem[] = [
  // =========================================================================
  // 1. مهارة التاء المربوطة والتاء المفتوحة (ة / ت)
  // =========================================================================
  {
    id: 'taa_1',
    word: 'مدرسة',
    tashkeel: 'مَدْرَسَةٌ',
    audioText: 'مَدْرَسَة',
    emoji: '🏫',
    skill: 'taa_types',
    subSkill: 'taaMarbuta',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'مدرستي وأسرتي',
    difficulty: 'easy',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    incompleteWord: 'مَدْرَسَـ؟',
    wrongSpelling: 'مَدْرَسَت',
    explanation: 'تُنطق هاءً عند الوقف بالسكون (مَدْرَسَهْ)، وتُنطق تاءً عند الوصل بالحركات (مَدْرَسَةُ العِلْمِ)، لذلك تُكتب تاءً مربوطة (ة).',
    sentenceExample: 'ذَهَبَ فَوَّازٌ إِلَى المَدْرَسَةِ مُبَكِّرًا.'
  },
  {
    id: 'taa_2',
    word: 'بنت',
    tashkeel: 'بِنْتٌ',
    audioText: 'بِنْت',
    emoji: '👧',
    skill: 'taa_types',
    subSkill: 'taaMaftuha',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'أسرتي',
    difficulty: 'easy',
    correctAnswer: 'ت',
    options: ['ت', 'ة'],
    incompleteWord: 'بِنْـ؟',
    wrongSpelling: 'بِنْة',
    explanation: 'تُنطق تاءً عند الوقف بالسكون (بِنْتْ) وعند الوصل بالحركات (بِنْتٌ مُهَذَّبَةٌ)، لذلك تُكتب تاءً مفتوحة (ت).',
    sentenceExample: 'نُورَةُ بِنْتٌ صَالِحَةٌ وَمُهَذَّبَةٌ.'
  },
  {
    id: 'taa_3',
    word: 'شجرة',
    tashkeel: 'شَجَرَةٌ',
    audioText: 'شَجَرَة',
    emoji: '🌳',
    skill: 'taa_types',
    subSkill: 'taaMarbuta',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'حديقتي وبيئتي',
    difficulty: 'easy',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    incompleteWord: 'شَجَرَ؟',
    wrongSpelling: 'شَجَرَت',
    explanation: 'تُنطق هاءً عند الوقف (شَجَرَهْ)، وتُنطق تاءً عند الوصل (شَجَرَةُ التُّفَّاحِ)، فتُكتب تاءً مربوطة (ة).',
    sentenceExample: 'وَقَفَ العُصْفُورُ عَلَى غُصْنِ الشَّجَرَةِ.'
  },
  {
    id: 'taa_4',
    word: 'كتبت',
    tashkeel: 'كَتَبْتُ',
    audioText: 'كَتَبْتُ',
    emoji: '✍️',
    skill: 'taa_types',
    subSkill: 'taaMaftuha',
    gradeLevel: 'الصف الثاني والثالث',
    unit: 'ألعابي وهواياتي',
    difficulty: 'medium',
    correctAnswer: 'ت',
    options: ['ت', 'ة'],
    incompleteWord: 'كَتَبْـ؟',
    wrongSpelling: 'كَتَبْة',
    explanation: 'تاء الفاعل المتصلة بالفعل الماضي تاء مفتوحة دائمًا وتُنطق تاءً في الوقف والوصل.',
    sentenceExample: 'كَتَبْتُ وَاجِبَ لُغَتِي بِخَطٍّ جَمِيلٍ.'
  },
  {
    id: 'taa_5',
    word: 'حديقة',
    tashkeel: 'حَدِيقَةٌ',
    audioText: 'حَدِيقَة',
    emoji: '🏡',
    skill: 'taa_types',
    subSkill: 'taaMarbuta',
    gradeLevel: 'الصف الأول',
    unit: 'مدينتي',
    difficulty: 'easy',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    incompleteWord: 'حَدِيقَـ؟',
    wrongSpelling: 'حَدِيقَت',
    explanation: 'تُنطق هاءً عند الوقف وتُكتب تاءً مربوطة بنقطتين.',
    sentenceExample: 'لَعِبْنَا فِي حَدِيقَةِ المَنْزِلِ المُمْتِعَةِ.'
  },
  {
    id: 'taa_6',
    word: 'بيت',
    tashkeel: 'بَيْتٌ',
    audioText: 'بَيْت',
    emoji: '🏠',
    skill: 'taa_types',
    subSkill: 'taaMaftuha',
    gradeLevel: 'الصف الأول',
    unit: 'أسرتي',
    difficulty: 'easy',
    correctAnswer: 'ت',
    options: ['ت', 'ة'],
    incompleteWord: 'بَيْـ؟',
    wrongSpelling: 'بَيْة',
    explanation: 'اسم ثلاثي ساكن الوسط تاؤه أصلية ومفتوحة تُنطق تاءً في كل الأحوال.',
    sentenceExample: 'بَيْتُنَا جَمِيلٌ وَدَافِئٌ دَائِمًا.'
  },
  {
    id: 'taa_7',
    word: 'طبيبة',
    tashkeel: 'طَبِيبَةٌ',
    audioText: 'طَبِيبَة',
    emoji: '👩‍⚕️',
    skill: 'taa_types',
    subSkill: 'taaMarbuta',
    gradeLevel: 'الصف الثاني',
    unit: 'مهنتي',
    difficulty: 'medium',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    incompleteWord: 'طَبِيبَـ؟',
    wrongSpelling: 'طَبِيبَت',
    explanation: 'اسم مؤنث علامته التاء المربوطة التي تتحول لهاء عند السكون.',
    sentenceExample: 'أُمِّي طَبِيبَةٌ مَاهِرَةٌ تُسَاعِدُ المَرْضَى.'
  },
  {
    id: 'taa_8',
    word: 'سيارات',
    tashkeel: 'سَيَّارَاتٌ',
    audioText: 'سَيَّارَات',
    emoji: '🚗',
    skill: 'taa_types',
    subSkill: 'taaMaftuha',
    gradeLevel: 'الصف الثالث',
    unit: 'وسائل النقل',
    difficulty: 'hard',
    correctAnswer: 'ت',
    options: ['ت', 'ة'],
    incompleteWord: 'سَيَّارَا؟',
    wrongSpelling: 'سَيَّارَاة',
    explanation: 'جمع المؤنث السالم ينتهي دائمًا بتاء مفتوحة بعد ألف المد (ات).',
    sentenceExample: 'تَسِيرُ السَّيَّارَاتُ بِانْتِظَامٍ فِي الشَّارِعِ.'
  },
  {
    id: 'taa_9',
    word: 'فرحت',
    tashkeel: 'فَرِحَتْ',
    audioText: 'فَرِحَتْ',
    emoji: '😊',
    skill: 'taa_types',
    subSkill: 'taaMaftuha',
    gradeLevel: 'الصف الثاني',
    unit: 'مناسبات',
    difficulty: 'medium',
    correctAnswer: 'ت',
    options: ['ت', 'ة'],
    incompleteWord: 'فَرِحَـ؟',
    wrongSpelling: 'فَرِحَة',
    explanation: 'تاء التأنيث الساكنة المتصلة بالفعل الماضي تاء مفتوحة.',
    sentenceExample: 'فَرِحَتِ الأُسْرَةُ بِعَوْدَةِ المُسَافِرِ.'
  },
  {
    id: 'taa_10',
    word: 'حقيبة',
    tashkeel: 'حَقِيبَةٌ',
    audioText: 'حَقِيبَة',
    emoji: '🎒',
    skill: 'taa_types',
    subSkill: 'taaMarbuta',
    gradeLevel: 'الصف الأول',
    unit: 'أدواتي',
    difficulty: 'easy',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    incompleteWord: 'حَقِيبَـ؟',
    wrongSpelling: 'حَقِيبَت',
    explanation: 'تُنطق هاءً ساكنة عند الوقف وتُكتب تاءً مربوطة.',
    sentenceExample: 'رَتَّبَ الطَّالِبُ الكُتُبَ فِي الحَقِيبَةِ.'
  },

  // =========================================================================
  // 2. مهارة الهمزة المتوسطة (أ / ؤ / ئ / ء)
  // =========================================================================
  {
    id: 'mid_hamza_1',
    word: 'رأس',
    tashkeel: 'رَأْسٌ',
    audioText: 'رَأْس',
    emoji: '🧠',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الثالث والرابع',
    unit: 'جسم الإنسان وصحتي',
    difficulty: 'easy',
    correctAnswer: 'أ',
    options: ['أ', 'ؤ', 'ئ', 'ء'],
    hamzaChair: 'أ',
    incompleteWord: 'رَ؟ْسٌ',
    wrongSpelling: 'رَءْسٌ',
    whyWritten: 'الهمزة ساكنة وما قبلها مفتوح، والفتحة أقوى من السكون، لذلك كُتِبَتْ على الألف.',
    explanation: 'قاعدة أقوى الحركات: (الكسرة > الضمة > الفتحة > السكون). الفتحة أقوى من السكون ويناسبها الألف.',
    sentenceExample: 'شَعَرَ الوَلَدُ بِأَلَمٍ خَفِيفٍ فِي الرَّأْسِ.'
  },
  {
    id: 'mid_hamza_2',
    word: 'فؤاد',
    tashkeel: 'فُؤَادٌ',
    audioText: 'فُؤَاد',
    emoji: '❤️',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الرابع والخامس',
    unit: 'أخلاق وفضائل',
    difficulty: 'medium',
    correctAnswer: 'ؤ',
    options: ['ؤ', 'أ', 'ئ', 'ء'],
    hamzaChair: 'ؤ',
    incompleteWord: 'فُ؟َادٌ',
    wrongSpelling: 'فَأَادٌ',
    whyWritten: 'الهمزة مفتوحة وما قبلها مضموم، والضمة أقوى من الفتحة، لذلك كُتِبَتْ على الواو.',
    explanation: 'الضمة أقوى من الفتحة ويناسب الضمة حرف الواو.',
    sentenceExample: 'يَمْتَلِئُ فُؤَادُ المُؤْمِنِ بِالمَحَبَّةِ وَالسَّلاَمِ.'
  },
  {
    id: 'mid_hamza_3',
    word: 'ذئب',
    tashkeel: 'ذِئْبٌ',
    audioText: 'ذِئْب',
    emoji: '🐺',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الثالث والرابع',
    unit: 'عالم الحيوان',
    difficulty: 'easy',
    correctAnswer: 'ئ',
    options: ['ئ', 'أ', 'ؤ', 'ء'],
    hamzaChair: 'ئ',
    incompleteWord: 'ذِ؟ْبٌ',
    wrongSpelling: 'ذِأْبٌ',
    whyWritten: 'الهمزة ساكنة وما قبلها مكسور، والكسرة أقوى الحركات، لذلك كُتِبَتْ على النبرة (الياء).',
    explanation: 'الكسرة هي أقوى الحركات في اللغة العربية ويناسبها حرف الياء/النبرة.',
    sentenceExample: 'يَعِيشُ الذِّئْبُ فِي الغَابَاتِ وَالجِبَالِ.'
  },
  {
    id: 'mid_hamza_4',
    word: 'قراءة',
    tashkeel: 'قِرَاءَةٌ',
    audioText: 'قِرَاءَة',
    emoji: '📖',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الرابع والخامس',
    unit: 'العلم والمعرفة',
    difficulty: 'medium',
    correctAnswer: 'ء',
    options: ['ء', 'أ', 'ؤ', 'ئ'],
    hamzaChair: 'ء',
    incompleteWord: 'قِرَا؟َةٌ',
    wrongSpelling: 'قِرَائَةٌ',
    whyWritten: 'الهمزة المتوسطة مفتوحة بعد ألف مد ساكنة، لذلك تُكتب مفردة على السطر.',
    explanation: 'همزة مفتوحة بعد ألف مد ساكنة تُكتب على السطر لتجنب توالي حرفين متشابهين.',
    sentenceExample: 'القِرَاءَةُ تُغَذِّي العَقْلَ وَتَفْتَحُ الآفَاقَ.'
  },
  {
    id: 'mid_hamza_5',
    word: 'مؤمن',
    tashkeel: 'مُؤْمِنٌ',
    audioText: 'مُؤْمِن',
    emoji: '🤲',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الرابع',
    unit: 'قيم إسلامية',
    difficulty: 'medium',
    correctAnswer: 'ؤ',
    options: ['ؤ', 'أ', 'ئ', 'ء'],
    hamzaChair: 'ؤ',
    incompleteWord: 'مُ؟ْمِنٌ',
    wrongSpelling: 'مُأْمِنٌ',
    whyWritten: 'الهمزة ساكنة وما قبلها مضموم، والضمة أقوى من السكون، فناسبها الواو.',
    explanation: 'ضمة + سكون = الضمة تغلب وتجلس الهمزة على كرسي الواو.',
    sentenceExample: 'المُؤْمِنُ القَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللهِ.'
  },
  {
    id: 'mid_hamza_6',
    word: 'بئر',
    tashkeel: 'بِئْرٌ',
    audioText: 'بِئْر',
    emoji: '🪣',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الثالث',
    unit: 'الماء والحياة',
    difficulty: 'easy',
    correctAnswer: 'ئ',
    options: ['ئ', 'أ', 'ؤ', 'ء'],
    hamzaChair: 'ئ',
    incompleteWord: 'بِ؟ْرٌ',
    wrongSpelling: 'بِأْرٌ',
    whyWritten: 'الهمزة ساكنة وما قبلها مكسور، والكسرة أقوى الحركات فناسبها النبرة.',
    explanation: 'كسرة ما قبل الهمزة تفرض كتابة الهمزة على نبرة/ياء.',
    sentenceExample: 'اسْتَقَى القَوْمُ المَاءَ العَذْبَ مِنَ البِئْرِ.'
  },
  {
    id: 'mid_hamza_7',
    word: 'مسألة',
    tashkeel: 'مَسْأَلَةٌ',
    audioText: 'مَسْأَلَة',
    emoji: '📐',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الرابع',
    unit: 'العلوم والرياضيات',
    difficulty: 'medium',
    correctAnswer: 'أ',
    options: ['أ', 'ؤ', 'ئ', 'ء'],
    hamzaChair: 'أ',
    incompleteWord: 'مَسْ؟َلَةٌ',
    wrongSpelling: 'مَسْئَلَةٌ',
    whyWritten: 'الهمزة مفتوحة وما قبلها حرف صحيح ساكن، والفتحة أقوى من السكون فناسبها الألف.',
    explanation: 'فتحة الهمزة أقوى من سكون السين، فتجلس الهمزة على الألف.',
    sentenceExample: 'حَلَّ التِّلْمِيذُ المَسْأَلَةَ الحِسَابِيَّةَ بِذَكَاءٍ.'
  },
  {
    id: 'mid_hamza_8',
    word: 'مروءة',
    tashkeel: 'مُرُوءَةٌ',
    audioText: 'مُرُوءَة',
    emoji: '🌟',
    skill: 'middle_hamza',
    subSkill: 'middleHamza',
    gradeLevel: 'الصف الخامس والسادس',
    unit: 'مكارم الأخلاق',
    difficulty: 'hard',
    correctAnswer: 'ء',
    options: ['ء', 'ؤ', 'أ', 'ئ'],
    hamzaChair: 'ء',
    incompleteWord: 'مُرُو؟َةٌ',
    wrongSpelling: 'مُرُوئَةٌ',
    whyWritten: 'الهمزة مفتوحة بعد واو مد ساكنة، فتُكتب على السطر.',
    explanation: 'الهمزة المفتوحة بعد واو ساكنة مدية ترسم مفردة على السطر.',
    sentenceExample: 'تَحَلَّى العَرَبِيُّ بِالمُرُوءَةِ وَالشَّهَامَةِ.'
  },

  // =========================================================================
  // 3. مهارة الهمزة المتطرفة (أ / ؤ / ئ / ء)
  // =========================================================================
  {
    id: 'fin_hamza_1',
    word: 'شاطئ',
    tashkeel: 'شَاطِئٌ',
    audioText: 'شَاطِئ',
    emoji: '🏖️',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الثالث والرابع',
    unit: 'رحلات ونزهات',
    difficulty: 'easy',
    correctAnswer: 'ئ',
    options: ['ئ', 'أ', 'ؤ', 'ء'],
    hamzaChair: 'ئ',
    incompleteWord: 'شَاطِـ؟',
    wrongSpelling: 'شَاطِء',
    whyWritten: 'الحرف الذي يسبق الهمزة مكسور (الطَّاء)، والكسرة يناسبها الياء غير المنقوطة.',
    explanation: 'قاعدة الهمزة المتطرفة: نَنظر لحركة الحرف السابق لها فقط! ما قبلها مكسور فتُكتب على الياء (ئ).',
    sentenceExample: 'جَلَسَ الأَطْفَالُ يَلْعَبُونَ عَلَى شَاطِئِ البَحْرِ.'
  },
  {
    id: 'fin_hamza_2',
    word: 'سماء',
    tashkeel: 'سَمَاءٌ',
    audioText: 'سَمَاء',
    emoji: '☁️',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الثالث',
    unit: 'الطقس والكون',
    difficulty: 'easy',
    correctAnswer: 'ء',
    options: ['ء', 'أ', 'ؤ', 'ئ'],
    hamzaChair: 'ء',
    incompleteWord: 'سَمَا؟',
    wrongSpelling: 'سَمَائ',
    whyWritten: 'سُبِقَتِ الهمزة بألف مد ساكنة، فتُكتب متطرفة على السطر.',
    explanation: 'إذا سبقت الهمزة المتطرفة بساكن أو حرف مد (ألف، واو، ياء) تُكتب على السطر.',
    sentenceExample: 'تَلْمَعُ النُّجُومُ البرَّاقَةُ فِي السَّمَاءِ لَيْلًا.'
  },
  {
    id: 'fin_hamza_3',
    word: 'قرأ',
    tashkeel: 'قَرَأَ',
    audioText: 'قَرَأَ',
    emoji: '📚',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'القراءة والتعلم',
    difficulty: 'easy',
    correctAnswer: 'أ',
    options: ['أ', 'ؤ', 'ئ', 'ء'],
    hamzaChair: 'أ',
    incompleteWord: 'قَرَ؟',
    wrongSpelling: 'قَرَء',
    whyWritten: 'الحرف الذي يسبق الهمزة مفتوح (الراء)، والفتحة يناسبها الألف.',
    explanation: 'الهمزة في آخر الكلمة تتبع حركة ما قبلها، الراء مفتوحة فتجلس على الألف.',
    sentenceExample: 'قَرَأَ فَارِسٌ القِصَّةَ بِصَوْتٍ عالي وَوَاضِحٍ.'
  },
  {
    id: 'fin_hamza_4',
    word: 'لؤلؤ',
    tashkeel: 'لُؤْلُؤٌ',
    audioText: 'لُؤْلُؤ',
    emoji: '🦪',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الرابع',
    unit: 'كنوز البحار',
    difficulty: 'medium',
    correctAnswer: 'ؤ',
    options: ['ؤ', 'أ', 'ئ', 'ء'],
    hamzaChair: 'ؤ',
    incompleteWord: 'لُؤْلُـ؟',
    wrongSpelling: 'لُؤْلُء',
    whyWritten: 'الهمزة المتطرفة سُبِقَتْ بحرف مضموم (اللام)، والضمة يناسبها الواو.',
    explanation: 'ما قبل الهمزة المتطرفة مضموم، فتُكتب على الواو.',
    sentenceExample: 'اسْتَخْرَجَ الغَوَّاصُ اللُّؤْلُؤَ النَّفِيسَ مِنَ المَحَارِ.'
  },
  {
    id: 'fin_hamza_5',
    word: 'هدوء',
    tashkeel: 'هُدُوءٌ',
    audioText: 'هُدُوء',
    emoji: '🤫',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الرابع والخامس',
    unit: 'آداب وسلوك',
    difficulty: 'medium',
    correctAnswer: 'ء',
    options: ['ء', 'ؤ', 'ئ', 'أ'],
    hamzaChair: 'ء',
    incompleteWord: 'هُدُو؟',
    wrongSpelling: 'هُدُؤ',
    whyWritten: 'سُبِقَتِ الهمزة بواو مد ساكنة، فتُكتب مفردة على السطر.',
    explanation: 'الهمزة بعد واو المد الساكنة تُكتب متطرفة على السطر.',
    sentenceExample: 'يَعُمُّ الهُدُوءُ فِي المَكْتَبَةِ العَامَّةِ.'
  },
  {
    id: 'fin_hamza_6',
    word: 'دفء',
    tashkeel: 'دِفْءٌ',
    audioText: 'دِفْء',
    emoji: '🔥',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الرابع',
    unit: 'فصول السنة',
    difficulty: 'hard',
    correctAnswer: 'ء',
    options: ['ء', 'ئ', 'أ', 'ؤ'],
    hamzaChair: 'ء',
    incompleteWord: 'دِفْـ؟',
    wrongSpelling: 'دِفْئ',
    whyWritten: 'الفاء حرف ساكن (دِفْـ)، وما قبل الهمزة ساكن فتُكتب على السطر وليست على الياء.',
    explanation: 'انتبه! الفاء ساكنة وليست مكسورة، فالهمزة تجلس على السطر بعد الساكن.',
    sentenceExample: 'نَشْعُرُ بِالدِّفْءِ قُرْبَ مَوْقِدِ النَّارِ فِي الشِّتَاءِ.'
  },
  {
    id: 'fin_hamza_7',
    word: 'مبدأ',
    tashkeel: 'مَبْدَأٌ',
    audioText: 'مَبْدَأ',
    emoji: '🧭',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الرابع',
    unit: 'شخصيتي',
    difficulty: 'medium',
    correctAnswer: 'أ',
    options: ['أ', 'ء', 'ؤ', 'ئ'],
    hamzaChair: 'أ',
    incompleteWord: 'مَبْدَ؟',
    wrongSpelling: 'مَبْدَء',
    whyWritten: 'الدال حرف مفتوح، وما قبل الهمزة مفتوح فتُكتب على الألف.',
    explanation: 'ما قبل الهمزة مفتوح (دَ) فتُكتب الهمزة على الألف.',
    sentenceExample: 'الصِّدْقُ مَبْدَأٌ أَسَاسِيٌّ فِي حَيَاتِنَا.'
  },
  {
    id: 'fin_hamza_8',
    word: 'قارئ',
    tashkeel: 'قَارِئٌ',
    audioText: 'قَارِئ',
    emoji: '🎙️',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الثالث',
    unit: 'القرآن الكريم',
    difficulty: 'easy',
    correctAnswer: 'ئ',
    options: ['ئ', 'أ', 'ء', 'ؤ'],
    hamzaChair: 'ئ',
    incompleteWord: 'قَارِ؟',
    wrongSpelling: 'قَارِء',
    whyWritten: 'الراء مكسورة وما قبل الهمزة مكسور فتُكتب على الياء.',
    explanation: 'تُكتب الهمزة المتطرفة على الياء غير المنقوطة بعد الكسر.',
    sentenceExample: 'اسْتَمَعْنَا إِلَى قَارِئٍ مُتْقِنٍ لِلتِّلَاوَةِ.'
  },
  {
    id: 'fin_hamza_9',
    word: 'جزء',
    tashkeel: 'جُزْءٌ',
    audioText: 'جُزْء',
    emoji: '🧩',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الثالث والرابع',
    unit: 'الرياضيات واللغة',
    difficulty: 'medium',
    correctAnswer: 'ء',
    options: ['ء', 'ئ', 'أ', 'ؤ'],
    hamzaChair: 'ء',
    incompleteWord: 'جُزْ؟',
    wrongSpelling: 'جُزْئ',
    whyWritten: 'الزاي ساكنة، والهمزة المتطرفة بعد حرف ساكن تُكتب مفردة على السطر.',
    explanation: 'ما قبل الهمزة ساكن (جُزْ)، فتجلس الهمزة على السطر.',
    sentenceExample: 'حَفِظْتُ جُزْءًا مِنَ القُرْآنِ الكَرِيمِ.'
  },
  {
    id: 'fin_hamza_10',
    word: 'يجرؤ',
    tashkeel: 'يَجْرُؤُ',
    audioText: 'يَجْرُؤ',
    emoji: '🦁',
    skill: 'final_hamza',
    subSkill: 'finalHamza',
    gradeLevel: 'الصف الخامس',
    unit: 'الشجاعة والهمة',
    difficulty: 'hard',
    correctAnswer: 'ؤ',
    options: ['ؤ', 'أ', 'ئ', 'ء'],
    hamzaChair: 'ؤ',
    incompleteWord: 'يَجْرُ؟',
    wrongSpelling: 'يَجْرُء',
    whyWritten: 'الراء مضمومة، وما قبل الهمزة مضموم فناسبها الواو.',
    explanation: 'حركة الراء ضمة فتُكتب الهمزة على الواو.',
    sentenceExample: 'لاَ يَجْرُؤُ أَحَدٌ عَلَى تَجَاوُزِ النِّظَامِ.'
  },

  // =========================================================================
  // 4. مهارة المفرد والمثنى والجمع (👤👥)
  // =========================================================================
  {
    id: 'num_1',
    word: 'تفاحة',
    tashkeel: 'تُفَّاحَةٌ',
    audioText: 'تُفَّاحَة',
    emoji: '🍎',
    skill: 'singular_dual_plural',
    subSkill: 'singular',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'طعامي وغذائي',
    difficulty: 'easy',
    correctAnswer: 'مفرد',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'تُفَّاحَة',
    dualForm: 'تُفَّاحَتَانِ',
    pluralForm: 'تُفَّاحَات',
    itemCountVisual: 1,
    explanation: 'المفرد يدل على واحد أو واحدة (تفاحة واحدة). عند التثنية نزيد ألف ونون (تفاحتان)، وعند الجمع (تفاحات).',
    sentenceExample: 'أَكَلَ الطِّفْلُ تُفَّاحَةً حَمْرَاءَ لَذِيذَةً.'
  },
  {
    id: 'num_2',
    word: 'تفاحتان',
    tashkeel: 'تُفَّاحَتَانِ',
    audioText: 'تُفَّاحَتَانِ',
    emoji: '🍎🍎',
    skill: 'singular_dual_plural',
    subSkill: 'dual',
    gradeLevel: 'الصف الثاني',
    unit: 'طعامي وغذائي',
    difficulty: 'easy',
    correctAnswer: 'مثنى',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'تُفَّاحَة',
    dualForm: 'تُفَّاحَتَانِ',
    pluralForm: 'تُفَّاحَات',
    itemCountVisual: 2,
    explanation: 'المثنى يدل على اثنين أو اثنتين بزيادة ألف ونون (ان) أو ياء ونون (ين).',
    sentenceExample: 'فِي الطَّبَقِ تُفَّاحَتَانِ نَاضِجَتَانِ.'
  },
  {
    id: 'num_3',
    word: 'تفاحات',
    tashkeel: 'تُفَّاحَاتٌ',
    audioText: 'تُفَّاحَات',
    emoji: '🍎🍎🍎',
    skill: 'singular_dual_plural',
    subSkill: 'plural',
    gradeLevel: 'الصف الثاني والثالث',
    unit: 'طعامي وغذائي',
    difficulty: 'easy',
    correctAnswer: 'جمع',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'تُفَّاحَة',
    dualForm: 'تُفَّاحَتَانِ',
    pluralForm: 'تُفَّاحَات',
    itemCountVisual: 3,
    explanation: 'الجمع يدل على ثلاثة فأكثر، وجمع المؤنث السالم ينتهي بألف وتاء (ات).',
    sentenceExample: 'قَطَفَ المُزَارِعُ تُفَّاحَاتٍ كَثِيرَةً مِنَ الشَّجَرَةِ.'
  },
  {
    id: 'num_4',
    word: 'كتاب',
    tashkeel: 'كِتَابٌ',
    audioText: 'كِتَاب',
    emoji: '📘',
    skill: 'singular_dual_plural',
    subSkill: 'singular',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'مدرستي',
    difficulty: 'easy',
    correctAnswer: 'مفرد',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'كِتَاب',
    dualForm: 'كِتَابَانِ',
    pluralForm: 'كُتُب',
    itemCountVisual: 1,
    explanation: 'كتاب (مفرد) ↔ كتابان (مثنى) ↔ كتب (جمع تكسير).',
    sentenceExample: 'فَتَحَ سَالِمٌ كِتَابَ القِرَاءَةِ.'
  },
  {
    id: 'num_5',
    word: 'كتابان',
    tashkeel: 'كِتَابَانِ',
    audioText: 'كِتَابَانِ',
    emoji: '📚',
    skill: 'singular_dual_plural',
    subSkill: 'dual',
    gradeLevel: 'الصف الثاني',
    unit: 'مدرستي',
    difficulty: 'medium',
    correctAnswer: 'مثنى',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'كِتَاب',
    dualForm: 'كِتَابَانِ',
    pluralForm: 'كُتُب',
    itemCountVisual: 2,
    explanation: 'المثنى ينتهي بألف ونون مكسورة (كتابانِ).',
    sentenceExample: 'قَرَأْتُ كِتَابَيْنِ مُفِيدَيْنِ فِي الإِجَازَةِ.'
  },
  {
    id: 'num_6',
    word: 'كتب',
    tashkeel: 'كُتُبٌ',
    audioText: 'كُتُب',
    emoji: '📚📚',
    skill: 'singular_dual_plural',
    subSkill: 'plural',
    gradeLevel: 'الصف الثاني والثالث',
    unit: 'مدرستي',
    difficulty: 'medium',
    correctAnswer: 'جمع',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'كِتَاب',
    dualForm: 'كِتَابَانِ',
    pluralForm: 'كُتُب',
    itemCountVisual: 3,
    explanation: 'جمع تكسير تغيرت فيه بنية المفرد (كتاب -> كتب).',
    sentenceExample: 'وَضَعَتِ المُعَلِّمَةُ الكُتُبَ عَلَى الرَّفِّ.'
  },
  {
    id: 'num_7',
    word: 'معلم',
    tashkeel: 'مُعَلِّمٌ',
    audioText: 'مُعَلِّم',
    emoji: '👨‍🏫',
    skill: 'singular_dual_plural',
    subSkill: 'singular',
    gradeLevel: 'الصف الثاني والثالث',
    unit: 'مهن وشخصيات',
    difficulty: 'easy',
    correctAnswer: 'مفرد',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'مُعَلِّم',
    dualForm: 'مُعَلِّمَانِ',
    pluralForm: 'مُعَلِّمُونَ',
    itemCountVisual: 1,
    explanation: 'مفرد مذكر -> مثناه (معلمانِ) -> جمعه السالم (معلمونَ).',
    sentenceExample: 'شَرَحَ المُعَلِّمُ الدَّرْسَ بِوُضُوحٍ.'
  },
  {
    id: 'num_8',
    word: 'معلمون',
    tashkeel: 'مُعَلِّمُونَ',
    audioText: 'مُعَلِّمُونَ',
    emoji: '👨‍🏫👨‍🏫👨‍🏫',
    skill: 'singular_dual_plural',
    subSkill: 'plural',
    gradeLevel: 'الصف الثالث والرابع',
    unit: 'مهن وشخصيات',
    difficulty: 'hard',
    correctAnswer: 'جمع',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'مُعَلِّم',
    dualForm: 'مُعَلِّمَانِ',
    pluralForm: 'مُعَلِّمُونَ',
    itemCountVisual: 3,
    explanation: 'جمع مذكر سالم ينتهي بواو ونون مفتوحة (ونَ).',
    sentenceExample: 'اجْتَمَعَ المُعَلِّمُونَ فِي غُرْفَةِ الإِدَارَةِ.'
  },
  {
    id: 'num_9',
    word: 'طالبان',
    tashkeel: 'طَالِبَانِ',
    audioText: 'طَالِبَانِ',
    emoji: '👦👦',
    skill: 'singular_dual_plural',
    subSkill: 'dual',
    gradeLevel: 'الصف الثاني',
    unit: 'مدرستي',
    difficulty: 'medium',
    correctAnswer: 'مثنى',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'طَالِب',
    dualForm: 'طَالِبَانِ',
    pluralForm: 'طُلاَّب',
    itemCountVisual: 2,
    explanation: 'مثنى يدل على اثنين بزيادة ألف ونون على مفرده (طالب + ان).',
    sentenceExample: 'فَازَ الطَّالِبَانِ بِالمَرْكَزِ الأَوَّلِ فِي المُسَابَقَةِ.'
  },
  {
    id: 'num_10',
    word: 'سيارات',
    tashkeel: 'سَيَّارَاتٌ',
    audioText: 'سَيَّارَات',
    emoji: '🚗🚗🚗',
    skill: 'singular_dual_plural',
    subSkill: 'plural',
    gradeLevel: 'الصف الثاني والثالث',
    unit: 'وسائل النقل',
    difficulty: 'medium',
    correctAnswer: 'جمع',
    options: ['مفرد', 'مثنى', 'جمع'],
    singularForm: 'سَيَّارَة',
    dualForm: 'سَيَّارَتَانِ',
    pluralForm: 'سَيَّارَات',
    itemCountVisual: 3,
    explanation: 'جمع مؤنث سالم لمفرد (سيارة).',
    sentenceExample: 'وَقَفَتِ السَّيَّارَاتُ عِنْدَ الإِشَارَةِ الضَّوْئِيَّةِ.'
  }
];

// Helper to access custom items added by teacher
export function getCustomSpellingItems(): SpellingSkillBankItem[] {
  try {
    const raw = localStorage.getItem('lughati_custom_spelling_skills');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomSpellingItem(item: SpellingSkillBankItem): void {
  try {
    const current = getCustomSpellingItems();
    const updated = [item, ...current];
    localStorage.setItem('lughati_custom_spelling_skills', JSON.stringify(updated));
  } catch (e) {}
}

export function deleteCustomSpellingItem(id: string): void {
  try {
    const current = getCustomSpellingItems();
    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem('lughati_custom_spelling_skills', JSON.stringify(filtered));
  } catch (e) {}
}

export function resetCustomSpellingItems(): void {
  try {
    localStorage.removeItem('lughati_custom_spelling_skills');
  } catch (e) {}
}

export function getAllSpellingItems(): SpellingSkillBankItem[] {
  const custom = getCustomSpellingItems();
  return [...custom, ...CENTRAL_SPELLING_SKILLS_DATA];
}

export function getSpellingItemsBySkill(skill: SpellingSkillId): SpellingSkillBankItem[] {
  return getAllSpellingItems().filter(item => item.skill === skill);
}
