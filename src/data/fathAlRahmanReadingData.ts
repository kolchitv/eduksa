/**
 * بيانات ومحتويات كتاب «فتح الرحمن في تعليم كلمات القرآن»
 * تم استخراج وتصنيف جميع المقاطع والكلمات والجمل والنصوص والقواعد حسب الصفوف والمراحل الدراسية
 */

export interface FathItem {
  id: string;
  text: string;
  transcription?: string;
  category: 'syllable' | 'word' | 'sentence' | 'text' | 'rule';
  skill: string;
  skillLabel: string;
  explanation?: string;
  quranSurah?: string; // المرجع القرآني إن وجد
  gradeLevel: 'kg' | 'grade1' | 'grade2' | 'grade3' | 'upper_grades';
  gradeName: string;
  pageNumber?: number;
  highlightIndices?: number[];
}

export interface FathGradeSection {
  gradeId: 'kg' | 'grade1' | 'grade2' | 'grade3' | 'upper_grades';
  gradeTitle: string;
  gradeSubtitle: string;
  colorTheme: string;
  description: string;
  skillsCovered: string[];
  syllablesCount: number;
  wordsCount: number;
  sentencesCount: number;
  textsCount: number;
}

export const FATH_GRADE_SECTIONS: FathGradeSection[] = [
  {
    gradeId: 'kg',
    gradeTitle: 'مرحلة رياض الأطفال والتمهيدي 🌱',
    gradeSubtitle: 'التعرف على الحروف وأشكالها والمتشابهات والتهجي الثنائي الأولي',
    colorTheme: 'from-amber-500 to-orange-500',
    description: 'تمكين نطق الحروف الهجائية الـ 28 بمخارجها الصحيحة، أشكال الحروف في أول ووسط وآخر الكلمة، التمييز بين الحروف المتشابهة صوتاً ورسماً، وتجميع حرفين بالفتح.',
    skillsCovered: ['حروف الهجاء الكاملة', 'أشكال الحروف (أول، وسط، آخر، منفصل)', 'مواضع رسم الهمزة', 'المتشابهات نطقاً ورسماً', 'تجميع حرفين بالفتح'],
    syllablesCount: 48,
    wordsCount: 24,
    sentencesCount: 6,
    textsCount: 0
  },
  {
    gradeId: 'grade1',
    gradeTitle: 'الصف الأول الابتدائي 🎒',
    gradeSubtitle: 'الحركات القصيرة الثلاث، المدود الطبيعية، والتنوين، وتجميع الكلمات الثلاثية',
    colorTheme: 'from-emerald-600 to-teal-600',
    description: 'إتقان أصوات الحركات القصيرة (فتح، كسر، ضم)، التهجي التراكمي للكلمات الثلاثية، المدود الثلاثة (ألف، ياء، واو)، والتنوين بأنواعه، وقراءة الجمل الثنائية والثلاثية.',
    skillsCovered: ['الحروف بالحركات الثلاث', 'تجميع الكلمات الثلاثية', 'المد بالألف', 'المد بالياء', 'المد بالواو', 'التنوين بالفتح والكسر والضم', 'جمل الانطلاق الأولى'],
    syllablesCount: 64,
    wordsCount: 160,
    sentencesCount: 28,
    textsCount: 8
  },
  {
    gradeId: 'grade2',
    gradeTitle: 'الصف الثاني الابتدائي 🌟',
    gradeSubtitle: 'المقطع الساكن، حروف القلقلة، اللام الشمسية والقمرية، والتشديد بالحركات',
    colorTheme: 'from-blue-600 to-indigo-600',
    description: 'تمكين قراءة المقطع الساكن مع ضبط صفات الحروف (القلقلة والهمس)، التمييز الدقيق بين اللام القمرية واللام الشمسية، قراءة الحرف المشدد بالحركات الثلاث، وجمل الطلاقة.',
    skillsCovered: ['المقطع الساكن', 'حروف القلقلة (قطب جد)', 'اللام القمرية (أبغ حجك وخف عقيمه)', 'اللام الشمسية (14 حرفاً)', 'الشدة بالفتح والكسر والضم', 'جمل الطلاقة القرآنية'],
    syllablesCount: 52,
    wordsCount: 120,
    sentencesCount: 24,
    textsCount: 12
  },
  {
    gradeId: 'grade3',
    gradeTitle: 'الصف الثالث الابتدائي 🏆',
    gradeSubtitle: 'الشدة مع التنوين، الشدة مع المدود، مدود الهمز (بدل، متصل، منفصل)، وأحكام الوقف',
    colorTheme: 'from-purple-600 to-pink-600',
    description: 'إتقان تراكيب الشدة مع التنوين والمدود، أحكام المد بسبب الهمزة (البدل، المتصل، المنفصل)، قواعد الوقف على أواخر الكلمات، ونصوص الانطلاق القرائي المتوسطة.',
    skillsCovered: ['التشديد مع التنوين', 'التشديد مع المدود', 'مد البدل', 'المد المتصل والمنفصل', 'الوقف على الساكن والمتحرك والتاء المربوطة', 'نصوص الطلاقة القرائية'],
    syllablesCount: 36,
    wordsCount: 96,
    sentencesCount: 20,
    textsCount: 16
  },
  {
    gradeId: 'upper_grades',
    gradeTitle: 'الصفوف العليا والمتوسطة (٤ - ٦ ومتوسط) 🚀',
    gradeSubtitle: 'المد اللازم، التقاء الساكنين، همزتا الوصل والقطع، والتراكيب القرآنية الكبرى',
    colorTheme: 'from-rose-700 to-red-900',
    description: 'التمكين الأقصى والانطلاق في التراكيب القرآنية المعقدة: المد اللازم 6 حركات، همزة الوصل والابتداء بالأفعال والأسماء، التخلص من التقاء الساكنين، والآيات الجامعة.',
    skillsCovered: ['المد اللازم الكلمي المثقل 6 حركات', 'همزة الوصل والقطع وأحكام الابتداء', 'التقاء الساكنين وحذف حرف المد وصلاً', 'المشدد الموقوف عليه', 'علامات المصحف (التسهيل والإمالة والإشمام)', 'نصوص الانطلاق الكبرى'],
    syllablesCount: 28,
    wordsCount: 88,
    sentencesCount: 18,
    textsCount: 20
  }
];

// بنك البيانات الكامل مستخرجاً من الكتاب حرفاً حرفاً وكلمةً كلمة
export const FATH_ALRAHMAN_ITEMS: FathItem[] = [
  // =========================================================================
  // ١. مستوى الروضة والتمهيدي (KG & Pre-K)
  // =========================================================================
  // حروف الهجاء الأساسية الـ 28 (ص 6)
  { id: 'fath_kg_01', text: 'أ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الألف / الهمزة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_02', text: 'ب', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الباء (مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_03', text: 'ت', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف التاء (مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_04', text: 'ث', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الثاء (لثوي مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_05', text: 'ج', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الجيم', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_06', text: 'ح', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الحاء (حلقي مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_07', text: 'خ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الخاء (مفخم دائماً)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_08', text: 'د', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الدال', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_09', text: 'ذ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الذال (لثوي مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_10', text: 'ر', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الراء (يدور بين التفخيم والترقيق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_11', text: 'ز', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الزاي', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_12', text: 'س', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف السين (صفير مرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_13', text: 'ش', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الشين (تفشي)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_14', text: 'ص', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الصاد (مفخم ومطبق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_15', text: 'ض', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الضاد (استطالة ومفخم ومطبق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_16', text: 'ط', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الطاء (أقوى الحروف تفخيماً)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_17', text: 'ظ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الظاء (لثوي مفخم ومطبق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_18', text: 'ع', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف العين (حلقي متوسط)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_19', text: 'غ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الغين (مفخم)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_20', text: 'ف', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الفاء', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_21', text: 'ق', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف القاف (مفخم وقلقلة)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_22', text: 'ك', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الكاف (همس ومرقق)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_23', text: 'ل', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف اللام', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_24', text: 'م', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الميم', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_25', text: 'ن', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف النون', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_26', text: 'هـ', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الهاء', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_27', text: 'و', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الواو', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },
  { id: 'fath_kg_28', text: 'ي', category: 'syllable', skill: 'alphabet', skillLabel: 'حروف الهجاء', explanation: 'حرف الياء', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 6 },

  // أشكال الحروف ومواضع الهمزة (ص 7)
  { id: 'fath_kg_29', text: 'بـ  ـبـ  ـب  ب', category: 'syllable', skill: 'letter_forms', skillLabel: 'أشكال الحروف', explanation: 'أشكال حرف الباء في أول ووسط وآخر الكلمة ومنفصلاً', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_30', text: 'أُو۟لَـٰٓئِكَ', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'الهمزة على الألف في أول الكلمة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_31', text: 'السَّيِّئُ', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'الهمزة المتطرفة على السطر', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_32', text: 'اللُّؤْلُؤُ', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'الهمزة المتوسطة والمتطرفة على الواو', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_33', text: 'إِيتَاءِ', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'همزة مكسورة تحت الألف ثم همزة على السطر', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_34', text: 'لَأَيَةً', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'الهمزة على الألف بعد لام التوكيد', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },
  { id: 'fath_kg_35', text: 'فَأَدْرَأْتُمْ', category: 'word', skill: 'hamza_forms', skillLabel: 'مواضع الهمزة', explanation: 'الهمزة الساكنة على الألف في وسط الكلمة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 7 },

  // الحروف المتشابهة نطقاً (ص 8)
  { id: 'fath_kg_36', text: 'تَ - طَ - دَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين التاء المرققة والطاء المفخمة والدال المجهورة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_37', text: 'ثَ - سَ - صَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين الثاء اللثوية والسين المرققة والصاد المفخمة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_38', text: 'دَ - ضَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين الدال المرققة والضاد المستطيلة المفخمة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_39', text: 'قَ - كَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين القاف اللهوية المفخمة والكاف المهموسة المرققة', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_40', text: 'ضَ - ظَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين الضاد من حافة اللسان والظاء اللثوية', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_41', text: 'ءَ - عَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين أقصى الحلق (الهمزة) ووسط الحلق (العين)', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },
  { id: 'fath_kg_42', text: 'خَ - غَ', category: 'syllable', skill: 'phonetic_pairs', skillLabel: 'متشابهات نطقاً', explanation: 'التمييز بين الخاء المهموسة والغين المجهورة من أدنى الحلق', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 8 },

  // تدريبات تجميع حرفين بالفتح (ص 10 - 11)
  { id: 'fath_kg_43', text: 'أَبَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + بَ = أَبَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_44', text: 'أَتَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + تَ = أَتَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_45', text: 'أَثَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + ثَ = أَثَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_46', text: 'بَتَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'بَ + تَ = بَتَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_47', text: 'بَثَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'بَ + ثَ = بَثَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_48', text: 'تَتَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'تَ + تَ = تَتَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_49', text: 'تَثَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'تَ + ثَ = تَثَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 10 },
  { id: 'fath_kg_50', text: 'أَجَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + جَ = أَجَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_51', text: 'أَحَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + حَ = أَحَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_52', text: 'أَخَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'أَ + خَ = أَخَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_53', text: 'بَدَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'بَ + دَ = بَدَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_54', text: 'بَرَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'بَ + رَ = بَرَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_55', text: 'حَدَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'حَ + دَ = حَدَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_56', text: 'حَزَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'حَ + زَ = حَزَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_57', text: 'خَدَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'خَ + دَ = خَدَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },
  { id: 'fath_kg_58', text: 'خَذَ', category: 'syllable', skill: 'two_letter_fusion', skillLabel: 'تجميع حرفين', explanation: 'خَ + ذَ = خَذَ', gradeLevel: 'kg', gradeName: 'رياض الأطفال', pageNumber: 11 },

  // =========================================================================
  // ٢. الصف الأول الابتدائي (Grade 1)
  // =========================================================================
  // بداية تعليم الكلمات بالتهجي التراكمي (ص 13)
  { id: 'fath_g1_01', text: 'أَحَدَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'أَ + حَ = أَحَ + دَ = أَحَدَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_02', text: 'أَخَذَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'أَ + خَ = أَخَ + ذَ = أَخَذَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_03', text: 'ذَرَأَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'ذَ + رَ = ذَرَ + أَ = ذَرَأَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_04', text: 'حَذَرَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'حَ + ذَ = حَذَ + رَ = حَذَرَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_05', text: 'حَسَدَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'حَ + سَ = حَسَ + دَ = حَسَدَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_06', text: 'شَجَرَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'شَ + جَ = شَجَ + رَ = شَجَرَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },
  { id: 'fath_g1_07', text: 'صَبَرَ', category: 'word', skill: 'word_building', skillLabel: 'تهجي وبناء الكلمة', explanation: 'صَ + بَ = صَبَ + رَ = صَبَرَ', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 13 },

  // كلمات بالفتح من القرآن الكريم - تدريب 1 (ص 14)
  { id: 'fath_g1_08', text: 'وَجَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الضحى: ٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_09', text: 'وَعَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الحديد: ١٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_10', text: 'وَلَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البلد: ٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_11', text: 'عَدَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'المؤمنون: ١١٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_12', text: 'كَتَبَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الحشر: ٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_13', text: 'كَسَبَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'المسد: ٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_14', text: 'كَذَبَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'النجم: ١١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_15', text: 'ذَهَبَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'القيامة: ٣٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_16', text: 'نَزَلَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الحديد: ١٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_17', text: 'سَأَلَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'المعارج: ١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_18', text: 'حَمَلَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'طه: ١١١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_19', text: 'عَمَلَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'آل عمران: ١٩٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_20', text: 'كَتَمَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ١٤١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_21', text: 'عَزَمَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'محمد: ٢١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_22', text: 'سَلَفَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ٢٧٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_23', text: 'كَشَفَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'النحل: ٥٤', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_24', text: 'زَعَمَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'التغابن: ٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_25', text: 'نَبَذَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ١٠١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_26', text: 'أَمَرَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'العلق: ١٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_27', text: 'مَكَرَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'النحل: ٢٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_28', text: 'بَلَغَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الأحقاف: ١٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_29', text: 'نَزَغَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'يوسف: ١٠٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_30', text: 'غَضَبَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'النور: ٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_31', text: 'سَبَقَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'طه: ٩٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_32', text: 'وَرَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'القصص: ٢٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_33', text: 'بَسَطَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الشورى: ٢٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_34', text: 'خَتَمَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },
  { id: 'fath_g1_35', text: 'ظَلَمَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'الطلاق: ١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 14 },

  // كلمات بالفتح تدريب 2 وجمل (ص 15)
  { id: 'fath_g1_36', text: 'تَرَكَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'فاطر: ٤٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_37', text: 'سَرَقَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'يوسف: ٧٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_38', text: 'فَصَلَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ٢٤٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_39', text: 'رَفَثَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات بالفتح', quranSurah: 'البقرة: ١٩٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_40', text: 'وَسَلَكَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'طه: ٥٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_41', text: 'وَقَعَدَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'التوبة: ٩٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_42', text: 'وَزَهَقَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'الإسراء: ٨١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_43', text: 'وَوَضَعَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'الرحمن: ٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_44', text: 'فَمَكَثَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'النمل: ٢٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_45', text: 'فَخَرَجَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'القصص: ٧٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_46', text: 'فَحَشَرَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'النازعات: ٢٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_47', text: 'وَذَكَرَ', category: 'word', skill: 'short_vowels_fatha', skillLabel: 'كلمات رباعية بالفتح', quranSurah: 'الأعلى: ١٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },

  // جمل بالفتح (ص 15)
  { id: 'fath_g1_48', text: 'أَحَدَ عَشَرَ', category: 'sentence', skill: 'short_vowels_fatha', skillLabel: 'جمل بالفتح', explanation: 'جملة ثنائية بالفتح', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_49', text: 'عَبَسَ وَبَسَرَ', category: 'sentence', skill: 'short_vowels_fatha', skillLabel: 'جمل بالفتح', explanation: 'قراءة كلمتين متتابعتين بالفتح بانسيابية', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_50', text: 'جَعَلَ لَكَ', category: 'sentence', skill: 'short_vowels_fatha', skillLabel: 'جمل بالفتح', explanation: 'وصل الفعل بالحرف', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },
  { id: 'fath_g1_51', text: 'صَبَرَ وَغَفَرَ', category: 'sentence', skill: 'short_vowels_fatha', skillLabel: 'جمل بالفتح', explanation: 'قراءة كلمتين مع حرف العطف', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 15 },

  // كلمات بالكسر تدريب 1 و 2 (ص 17 - 19)
  { id: 'fath_g1_52', text: 'فَرِحَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'التوبة: ٨١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_53', text: 'كَرِهَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الأنفال: ٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_54', text: 'لَبِثَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'هود: ٦٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_55', text: 'خَسِرَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الأنعام: ١٤٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_56', text: 'غَضِبَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الفتح: ٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_57', text: 'شَرِبَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'البقرة: ٢٤٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_58', text: 'وَسِعَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'البقرة: ٢٥٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_59', text: 'سَخِرَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'التوبة: ٧٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_60', text: 'يَئِسَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'المائدة: ٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_61', text: 'نَسِيَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الزمر: ٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_62', text: 'شَهِدَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'البقرة: ١٨٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_63', text: 'عَمِلَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الكهف: ٨٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },
  { id: 'fath_g1_64', text: 'بَخِلَ', category: 'word', skill: 'short_vowels_kasra', skillLabel: 'كلمات بالكسر', quranSurah: 'الليل: ٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 18 },

  // جمل بالكسر (ص 19)
  { id: 'fath_g1_65', text: 'جَهَرَ بِهِ', category: 'sentence', skill: 'short_vowels_kasra', skillLabel: 'جمل بالكسر', explanation: 'جملة فعل وحرف جر مجرور', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 19 },
  { id: 'fath_g1_66', text: 'وَجَعَلَ كَلِمَةَ', category: 'sentence', skill: 'short_vowels_kasra', skillLabel: 'جمل بالكسر', explanation: 'فعل ومفعول به', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 19 },
  { id: 'fath_g1_67', text: 'لِأَهَبَ لَكِ', category: 'sentence', skill: 'short_vowels_kasra', skillLabel: 'جمل بالكسر', explanation: 'حرف لام مكسورة مع فعل', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 19 },
  { id: 'fath_g1_68', text: 'نَزَلَ بِهِ', category: 'sentence', skill: 'short_vowels_kasra', skillLabel: 'جمل بالكسر', explanation: 'قراءة الوصل بالحركات', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 19 },

  // كلمات بالضم وتدريباتها (ص 21 - 23)
  { id: 'fath_g1_69', text: 'هُدِيَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'آل عمران: ١٠١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_70', text: 'نُقِرَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'المدثر: ٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_71', text: 'أُفِكَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'الذاريات: ٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_72', text: 'سُئِلَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'البقرة: ١٠٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_73', text: 'قُرِئَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'الانشقاق: ٢١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_74', text: 'ذُبِحَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'المائدة: ٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_75', text: 'رُسُلُ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'الأنعام: ١٢٤', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_76', text: 'سُبُلَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'النحل: ٦٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },
  { id: 'fath_g1_77', text: 'كَبُرَ', category: 'word', skill: 'short_vowels_damma', skillLabel: 'كلمات بالضم', quranSurah: 'الأنعام: ٣٥', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 22 },

  // جمل بالضم (ص 23)
  { id: 'fath_g1_78', text: 'فَغَفَرَ لَهُ', category: 'sentence', skill: 'short_vowels_damma', skillLabel: 'جمل بالضم', explanation: 'فعل مع حرف وضمير مضموم', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 23 },
  { id: 'fath_g1_79', text: 'أَذِنَ لَهُ', category: 'sentence', skill: 'short_vowels_damma', skillLabel: 'جمل بالضم', explanation: 'فعل ثلاثي بحركة كسر متبوع بجار ومجرور', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 23 },
  { id: 'fath_g1_80', text: 'فَهْوَ يَصِلُ', category: 'sentence', skill: 'short_vowels_damma', skillLabel: 'جمل بالضم', explanation: 'ضمير وفعل مضارع مضموم الآخر', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 23 },
  { id: 'fath_g1_81', text: 'وَحَسُنَ أُولَـٰٓئِكَ', category: 'sentence', skill: 'short_vowels_damma', skillLabel: 'جمل بالضم', explanation: 'قراءة بالضم مع اسم الإشارة', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 23 },

  // المد بالألف والياء والواو تدريب 1 و 2 (ص 24 - 35)
  { id: 'fath_g1_82', text: 'قَالَ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', explanation: 'قاف مفتوحة متبوعة بألف مد طبيعي حركتان', quranSurah: 'البقرة: ٣٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_83', text: 'تَابَ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'المائدة: ٧١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_84', text: 'طَابَ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'النساء: ٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_85', text: 'خَافَ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'البقرة: ١٨٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_86', text: 'نَارُ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'الهمزة: ٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_87', text: 'فَاطِرِ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'الأنعام: ١٤', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_88', text: 'نَاقَةُ', category: 'word', skill: 'madd_alif', skillLabel: 'المد بالألف', quranSurah: 'الأعراف: ٧٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 26 },
  { id: 'fath_g1_89', text: 'تَابَ مَعَكَ', category: 'sentence', skill: 'madd_alif', skillLabel: 'جمل المد بالألف', explanation: 'فعل مع حرف جر وضمير', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 27 },
  { id: 'fath_g1_90', text: 'قَالَ هِيَ عَصَايَ', category: 'sentence', skill: 'madd_alif', skillLabel: 'جمل المد بالألف', explanation: 'قراءة متصلة لمدود الألف', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 27 },

  { id: 'fath_g1_91', text: 'سَبِيلَ', category: 'word', skill: 'madd_yaa', skillLabel: 'المد بالياء', explanation: 'باء مكسورة مع ياء مد طبيعي حركتان', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 29 },
  { id: 'fath_g1_92', text: 'يَتِيمَ', category: 'word', skill: 'madd_yaa', skillLabel: 'المد بالياء', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 29 },
  { id: 'fath_g1_93', text: 'شَدِيدُ', category: 'word', skill: 'madd_yaa', skillLabel: 'المد بالياء', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 29 },
  { id: 'fath_g1_94', text: 'نَذِيرِ', category: 'word', skill: 'madd_yaa', skillLabel: 'المد بالياء', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 29 },
  { id: 'fath_g1_95', text: 'بَصِيرُ', category: 'word', skill: 'madd_yaa', skillLabel: 'المد بالياء', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 29 },
  { id: 'fath_g1_96', text: 'فِيهَا مَنَـٰفِعُ وَمَشَارِبُ', category: 'sentence', skill: 'madd_yaa', skillLabel: 'جمل المد بالياء', explanation: 'جملة قرآنية تجمع المد بالياء والمد بالألف', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 31 },

  { id: 'fath_g1_97', text: 'يَقُولُ', category: 'word', skill: 'madd_waw', skillLabel: 'المد بالواو', explanation: 'قاف مضمومة متبوعة بواو مد طبيعي', quranSurah: 'البقرة: ٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 34 },
  { id: 'fath_g1_98', text: 'تَكُونُ', category: 'word', skill: 'madd_waw', skillLabel: 'المد بالواو', quranSurah: 'البقرة: ٢١٤', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 34 },
  { id: 'fath_g1_99', text: 'أَعُوذُ', category: 'word', skill: 'madd_waw', skillLabel: 'المد بالواو', quranSurah: 'الفلق: ١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 34 },
  { id: 'fath_g1_100', text: 'رَسُولُ', category: 'word', skill: 'madd_waw', skillLabel: 'المد بالواو', quranSurah: 'النساء: ١٧١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 34 },
  { id: 'fath_g1_101', text: 'دَخَلُوا۟ عَلَىٰ يُوسُفَ', category: 'sentence', skill: 'madd_waw', skillLabel: 'جمل المد بالواو', explanation: 'جملة تجمع مد الواو مع الألف الفارقة والمد بالألف', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 35 },

  // التنوين بأنواعه الثلاثة (ص 41 - 52)
  { id: 'fath_g1_102', text: 'عَذَابًا', category: 'word', skill: 'tanween_fath', skillLabel: 'تنوين الفتح', quranSurah: 'آل عمران: ٥٦', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 43 },
  { id: 'fath_g1_103', text: 'صَوَابًا', category: 'word', skill: 'tanween_fath', skillLabel: 'تنوين الفتح', quranSurah: 'النبأ: ٣٨', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 43 },
  { id: 'fath_g1_104', text: 'سُبَاتًا', category: 'word', skill: 'tanween_fath', skillLabel: 'تنوين الفتح', quranSurah: 'النبأ: ٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 43 },
  { id: 'fath_g1_105', text: 'ثَقِيلًا', category: 'word', skill: 'tanween_fath', skillLabel: 'تنوين الفتح', quranSurah: 'الإنسان: ٢٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 43 },
  { id: 'fath_g1_106', text: 'وَكِيلًا', category: 'word', skill: 'tanween_fath', skillLabel: 'تنوين الفتح', quranSurah: 'النساء: ٨١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 43 },

  { id: 'fath_g1_107', text: 'نَبَإٍ', category: 'word', skill: 'tanween_kasr', skillLabel: 'تنوين الكسر', quranSurah: 'الأنعام: ٦٧', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 47 },
  { id: 'fath_g1_108', text: 'فَلَكٍ', category: 'word', skill: 'tanween_kasr', skillLabel: 'تنوين الكسر', quranSurah: 'يس: ٤٠', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 47 },
  { id: 'fath_g1_109', text: 'صُحُفٍ', category: 'word', skill: 'tanween_kasr', skillLabel: 'تنوين الكسر', quranSurah: 'عبس: ١٣', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 47 },
  { id: 'fath_g1_110', text: 'نَعِيمٍ', category: 'word', skill: 'tanween_kasr', skillLabel: 'تنوين الكسر', quranSurah: 'الواقعة: ٨٩', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 48 },
  { id: 'fath_g1_111', text: 'عَظِيمٍ', category: 'word', skill: 'tanween_kasr', skillLabel: 'تنوين الكسر', quranSurah: 'آل عمران: ١٧٤', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 48 },
  { id: 'fath_g1_112', text: 'فِي مَقَامٍ أَمِينٍ', category: 'sentence', skill: 'tanween_kasr', skillLabel: 'جمل تنوين الكسر', explanation: 'جار ومجرور موصوف بتنوين كسر', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 48 },

  { id: 'fath_g1_113', text: 'وَلَدٌ', category: 'word', skill: 'tanween_damm', skillLabel: 'تنوين الضم', quranSurah: 'الزخرف: ٨١', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 51 },
  { id: 'fath_g1_114', text: 'رَجُلٌ', category: 'word', skill: 'tanween_damm', skillLabel: 'تنوين الضم', quranSurah: 'النساء: ١٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 51 },
  { id: 'fath_g1_115', text: 'كَاتِبٌ', category: 'word', skill: 'tanween_damm', skillLabel: 'تنوين الضم', quranSurah: 'البقرة: ٢٨٢', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 51 },
  { id: 'fath_g1_116', text: 'غَفُورٌ عَلِيمٌ', category: 'sentence', skill: 'tanween_damm', skillLabel: 'جمل تنوين الضم', explanation: 'اسمان من أسماء الله الحسنى بتنوين الضم', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 52 },
  { id: 'fath_g1_117', text: 'عَزِيزٌ حَكِيمٌ', category: 'sentence', skill: 'tanween_damm', skillLabel: 'جمل تنوين الضم', explanation: 'خبر مرفوع بتنوين الضم', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 52 },
  { id: 'fath_g1_118', text: 'نَاصِحٌ أَمِينٌ', category: 'sentence', skill: 'tanween_damm', skillLabel: 'جمل تنوين الضم', explanation: 'مبتدأ وخبر بتنوين الضم', gradeLevel: 'grade1', gradeName: 'الصف الأول', pageNumber: 52 },

  // =========================================================================
  // ٣. الصف الثاني الابتدائي (Grade 2)
  // =========================================================================
  // السكون والمقاطع الساكنة (ص 53 - 56)
  { id: 'fath_g2_01', text: 'أَبْ', category: 'syllable', skill: 'sukoon_qalqala', skillLabel: 'المقطع الساكن والقلقلة', explanation: 'همزة مفتوحة مع باء ساكنة مقلقلة (قطب جد)', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },
  { id: 'fath_g2_02', text: 'أَتْ', category: 'syllable', skill: 'sukoon_hams', skillLabel: 'المقطع الساكن والهمس', explanation: 'همزة مفتوحة مع تاء ساكنة مهموسة (فحثه شخص سكت)', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },
  { id: 'fath_g2_03', text: 'أَجْ', category: 'syllable', skill: 'sukoon_qalqala', skillLabel: 'المقطع الساكن والقلقلة', explanation: 'جيم ساكنة مقلقلة', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },
  { id: 'fath_g2_04', text: 'فَحْ', category: 'syllable', skill: 'sukoon_hams', skillLabel: 'المقطع الساكن والهمس', explanation: 'حاء ساكنة مهموسة ورخوة', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },
  { id: 'fath_g2_05', text: 'فَقْ', category: 'syllable', skill: 'sukoon_qalqala', skillLabel: 'المقطع الساكن والقلقلة', explanation: 'قاف ساكنة مفخمة ومقلقلة', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },
  { id: 'fath_g2_06', text: 'بَلْ', category: 'syllable', skill: 'sukoon_general', skillLabel: 'المقطع الساكن', explanation: 'لام ساكنة متوسطة المخرج', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 53 },

  // كلمات السكون (ص 54 - 56)
  { id: 'fath_g2_07', text: 'كَأْسٍ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'الإنسان: ٥', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_08', text: 'أَبْصِرْ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'الكهف: ٢٦', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_09', text: 'تَدْعُونَ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'الأنعام: ٤٠', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_10', text: 'بِإِذْنِ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'البقرة: ٩٧', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_11', text: 'مَرْيَمَ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'البقرة: ٨٧', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_12', text: 'تَجْرِي', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'البقرة: ٢٥', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_13', text: 'سَقْفًا', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'الأنبياء: ٣٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_14', text: 'نَفْعًا', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'المائدة: ٧٦', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },
  { id: 'fath_g2_15', text: 'يَعْدِلُونَ', category: 'word', skill: 'sukoon_words', skillLabel: 'كلمات السكون', quranSurah: 'الأنعام: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 55 },

  // جمل السكون والطلاقة (ص 56)
  { id: 'fath_g2_16', text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', category: 'sentence', skill: 'sukoon_sentences', skillLabel: 'جمل السكون', explanation: 'آية جامعة للمقاطع الساكنة والقلقلة', quranSurah: 'الإخلاص: ٣', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },
  { id: 'fath_g2_17', text: 'وَلَسَوْفَ يَرْضَىٰ', category: 'sentence', skill: 'sukoon_sentences', skillLabel: 'جمل السكون', quranSurah: 'الليل: ٢١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },
  { id: 'fath_g2_18', text: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', category: 'sentence', skill: 'sukoon_sentences', skillLabel: 'جمل السكون', quranSurah: 'الشرح: ٤', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },
  { id: 'fath_g2_19', text: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', category: 'sentence', skill: 'sukoon_sentences', skillLabel: 'جمل السكون', quranSurah: 'الكافرون: ٦', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },
  { id: 'fath_g2_20', text: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا', category: 'sentence', skill: 'sukoon_sentences', skillLabel: 'جمل السكون', quranSurah: 'النبأ: ٩', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },
  { id: 'fath_g2_21', text: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', category: 'text', skill: 'sukoon_texts', skillLabel: 'نصوص السكون', quranSurah: 'الفيل: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 56 },

  // اللام القمرية (ص 57)
  { id: 'fath_g2_22', text: 'ٱلْأَرْضُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', explanation: 'لام ساكنة مظهرة حكمها الإظهار القمري (حرف الهمزة)', quranSurah: 'البقرة: ٢٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },
  { id: 'fath_g2_23', text: 'ٱلْبَـٰطِلُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', quranSurah: 'الأنفال: ٨', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },
  { id: 'fath_g2_24', text: 'ٱلْغَيْبُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', quranSurah: 'الأنعام: ٥٠', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },
  { id: 'fath_g2_25', text: 'ٱلْحَكِيمُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', quranSurah: 'البقرة: ٣٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },
  { id: 'fath_g2_26', text: 'ٱلْفَلَقُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', quranSurah: 'الفلق: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },
  { id: 'fath_g2_27', text: 'وَٱلْقَمَرُ', category: 'word', skill: 'lam_qamariyyah', skillLabel: 'اللام القمرية', quranSurah: 'الشمس: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 57 },

  // اللام الشمسية (ص 69)
  { id: 'fath_g2_28', text: 'ٱلشَّمْسُ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', explanation: 'لام شمسية تدغم في الشين المشددة ولا تنطق', quranSurah: 'الشمس: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },
  { id: 'fath_g2_29', text: 'ٱلصِّرَٰطَ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', quranSurah: 'الفاتحة: ٦', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },
  { id: 'fath_g2_30', text: 'ٱلنُّورِ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', quranSurah: 'الحديد: ٩', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },
  { id: 'fath_g2_31', text: 'ٱلسَّلَـٰمُ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', quranSurah: 'النساء: ٩٤', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },
  { id: 'fath_g2_32', text: 'ٱلدِّمَآءَ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', quranSurah: 'البقرة: ٣٠', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },
  { id: 'fath_g2_33', text: 'بِٱلدِّينِ', category: 'word', skill: 'lam_shamsiyyah', skillLabel: 'اللام الشمسية', explanation: 'دخول الباء على اللام الشمسية وحذف همزة الوصل خطاً ولفظاً', quranSurah: 'الماعون: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 69 },

  // الشدة بالحركات الثلاث (ص 60 - 68)
  { id: 'fath_g2_34', text: 'رَبَّ', category: 'syllable', skill: 'shaddah_fatha', skillLabel: 'الشدة بالفتح', explanation: 'حرف مشدد أصله راء مفتوحة وباء ساكنة فباء مفتوحة', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 60 },
  { id: 'fath_g2_35', text: 'سَبَّحَ', category: 'word', skill: 'shaddah_fatha', skillLabel: 'الشدة بالفتح', quranSurah: 'الحديد: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 61 },
  { id: 'fath_g2_36', text: 'رَبَّنَا', category: 'word', skill: 'shaddah_fatha', skillLabel: 'الشدة بالفتح', quranSurah: 'البقرة: ١٢٧', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 61 },
  { id: 'fath_g2_37', text: 'قَدَّرَ', category: 'word', skill: 'shaddah_fatha', skillLabel: 'الشدة بالفتح', quranSurah: 'الأعلى: ٣', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 61 },
  { id: 'fath_g2_38', text: 'عَلَّمَ', category: 'word', skill: 'shaddah_fatha', skillLabel: 'الشدة بالفتح', quranSurah: 'العلق: ٤', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 61 },
  { id: 'fath_g2_39', text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', category: 'text', skill: 'shaddah_fatha', skillLabel: 'نصوص الشدة بالفتح', quranSurah: 'الفاتحة: ٥', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 62 },

  { id: 'fath_g2_40', text: 'زُوِّجَتْ', category: 'word', skill: 'shaddah_kasra', skillLabel: 'الشدة بالكسر', quranSurah: 'التكوير: ٧', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 64 },
  { id: 'fath_g2_41', text: 'كُوِّرَتْ', category: 'word', skill: 'shaddah_kasra', skillLabel: 'الشدة بالكسر', quranSurah: 'التكوير: ١', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 64 },
  { id: 'fath_g2_42', text: 'فَصَلِّ', category: 'word', skill: 'shaddah_kasra', skillLabel: 'الشدة بالكسر', quranSurah: 'الكوثر: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 64 },
  { id: 'fath_g2_43', text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', category: 'text', skill: 'shaddah_kasra', skillLabel: 'نصوص الشدة بالكسر', quranSurah: 'الفاتحة: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 65 },

  { id: 'fath_g2_44', text: 'يُحِبُّ', category: 'word', skill: 'shaddah_damma', skillLabel: 'الشدة بالضم', quranSurah: 'البقرة: ١٩٠', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 67 },
  { id: 'fath_g2_45', text: 'يَعُضُّ', category: 'word', skill: 'shaddah_damma', skillLabel: 'الشدة بالضم', quranSurah: 'الفرقان: ٢٧', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 67 },
  { id: 'fath_g2_46', text: 'يَدُعُّ', category: 'word', skill: 'shaddah_damma', skillLabel: 'الشدة بالضم', quranSurah: 'الماعون: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 67 },
  { id: 'fath_g2_47', text: 'إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُتَّقِينَ', category: 'sentence', skill: 'shaddah_damma', skillLabel: 'جمل الشدة بالضم', quranSurah: 'التوبة: ٤', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 68 },
  { id: 'fath_g2_48', text: 'فَذَٰلِكَ ٱلَّذِي يَدُعُّ ٱلْيَتِيمَ', category: 'text', skill: 'shaddah_damma', skillLabel: 'نصوص الشدة بالضم', quranSurah: 'الماعون: ٢', gradeLevel: 'grade2', gradeName: 'الصف الثاني', pageNumber: 68 },

  // =========================================================================
  // ٤. الصف الثالث الابتدائي (Grade 3)
  // =========================================================================
  // التشديد مع التنوين (ص 72 - 74)
  { id: 'fath_g3_01', text: 'حُبًّا', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'البقرة: ١٦٥', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 73 },
  { id: 'fath_g3_02', text: 'صَفًّا', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'الصف: ٤', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 73 },
  { id: 'fath_g3_03', text: 'حَقًّا', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'البقرة: ٢٣٦', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 73 },
  { id: 'fath_g3_04', text: 'بِحَقٍّ', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'المائدة: ١١٦', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 74 },
  { id: 'fath_g3_05', text: 'قَوِيٌّ', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'الحديد: ٢٥', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 74 },
  { id: 'fath_g3_06', text: 'مُّسْتَقِرٌّ', category: 'word', skill: 'shaddah_tanween', skillLabel: 'الشدة مع التنوين', quranSurah: 'القمر: ٣٨', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 74 },
  { id: 'fath_g3_07', text: 'عَدُوٌّ مُّبِينٌ', category: 'sentence', skill: 'shaddah_tanween', skillLabel: 'جمل الشدة والتنوين', explanation: 'تنوين ضم مشدد موصوف', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 74 },

  // مدود الهمزة: البدل والمتصل والمنفصل (ص 37 - 40)
  { id: 'fath_g3_08', text: 'ءَامَنَ', category: 'word', skill: 'madd_badal', skillLabel: 'مد البدل', explanation: 'همزة سبقت حرف المد ومقداره حركتان', quranSurah: 'البقرة: ١٣', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 37 },
  { id: 'fath_g3_09', text: 'ءَادَمَ', category: 'word', skill: 'madd_badal', skillLabel: 'مد البدل', quranSurah: 'البقرة: ٣١', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 37 },
  { id: 'fath_g3_10', text: 'أُوتِيَ', category: 'word', skill: 'madd_badal', skillLabel: 'مد البدل', quranSurah: 'البقرة: ١٣٦', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 37 },
  { id: 'fath_g3_11', text: 'إِيمَـٰنًا', category: 'word', skill: 'madd_badal', skillLabel: 'مد البدل', explanation: 'همزة مكسورة سبقت ياء المد', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 37 },

  { id: 'fath_g3_12', text: 'جَزَاءُ', category: 'word', skill: 'madd_muttasil', skillLabel: 'المد المتصل', explanation: 'حرف المد والهمزة في كلمة واحدة وحكمه واجب ٤ أو ٥ حركات', quranSurah: 'المائدة: ٨٥', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 38 },
  { id: 'fath_g3_13', text: 'شَاءَ', category: 'word', skill: 'madd_muttasil', skillLabel: 'المد المتصل', quranSurah: 'النبأ: ٣٩', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 38 },
  { id: 'fath_g3_14', text: 'سِيٓءَ', category: 'word', skill: 'madd_muttasil', skillLabel: 'المد المتصل', quranSurah: 'العنكبوت: ٣٣', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 38 },
  { id: 'fath_g3_15', text: 'سُوٓءَ', category: 'word', skill: 'madd_muttasil', skillLabel: 'المد المتصل', quranSurah: 'البقرة: ٤٩', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 38 },

  { id: 'fath_g3_16', text: 'وَمَآ أُرِيدُ', category: 'sentence', skill: 'madd_munfasil', skillLabel: 'المد المنفصل', explanation: 'حرف المد في نهاية كلمة والهمزة في بداية الكلمة التالية (جائز ٢ أو ٤ أو ٥)', quranSurah: 'هود: ٨٨', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 39 },
  { id: 'fath_g3_17', text: 'يَـٰبَنِيٓ ءَادَمَ', category: 'sentence', skill: 'madd_munfasil', skillLabel: 'المد المنفصل', quranSurah: 'الأعراف: ٢٦', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 39 },
  { id: 'fath_g3_18', text: 'قَالُوٓا۟ أُوذِينَا', category: 'sentence', skill: 'madd_munfasil', skillLabel: 'المد المنفصل', quranSurah: 'الأعراف: ١٢٩', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 39 },
  { id: 'fath_g3_19', text: 'هَـٰٓؤُلَآءِ', category: 'word', skill: 'madd_munfasil_muttasil', skillLabel: 'مد منفصل ومتصل معاً', explanation: 'ها مد منفصل، لاء مد متصل', quranSurah: 'النساء: ١٤٣', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 39 },

  // أحكام الوقف والتهجي وقفاً (ص 58 - 59)
  { id: 'fath_g3_20', text: 'قُلْ هُوَ ٱللَّهُ أَحَدْ', category: 'sentence', skill: 'waqf_qalqala', skillLabel: 'الوقف على القلقلة', explanation: 'الوقف على الدال بالسكون العارض مع القلقلة الكبرى', quranSurah: 'الإخلاص: ١', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 59 },
  { id: 'fath_g3_21', text: 'ذَرْنِي وَمَنْ خَلَقْتُ وَحِيدَا', category: 'sentence', skill: 'waqf_iwad', skillLabel: 'الوقف بمد العوض', explanation: 'الوقف على تنوين الفتح بألف مد عوض حركتان', quranSurah: 'المدثر: ١١', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 59 },
  { id: 'fath_g3_22', text: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكْ', category: 'sentence', skill: 'waqf_sukoon', skillLabel: 'الوقف على السكون', explanation: 'تسكين الكاف عند الوقف مع همسها', quranSurah: 'الشرح: ١', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 58 },
  { id: 'fath_g3_23', text: 'لَّقَدْ كَانَ لَكُمْ فِيهِمْ أُسْوَةٌ حَسَنَهْ', category: 'sentence', skill: 'waqf_taa_marbuta', skillLabel: 'الوقف على التاء المربوطة', explanation: 'تنطق التاء المربوطة هاءً ساكنة عند الوقف', quranSurah: 'الممتحنة: ٦', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 58 },
  { id: 'fath_g3_24', text: 'قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ (المد العارض للسكون)', category: 'text', skill: 'waqf_arid', skillLabel: 'المد العارض للسكون', explanation: 'مد الواو قبل النون الساكنة وقفاً ٢ أو ٤ أو ٦ حركات', quranSurah: 'المؤمنون: ١', gradeLevel: 'grade3', gradeName: 'الصف الثالث', pageNumber: 59 },

  // =========================================================================
  // ٥. الصفوف العليا والمرحلة المتوسطة (Grades 4 - 6 & Intermediate)
  // =========================================================================
  // المد اللازم الكلمي المثقل 6 حركات (ص 70)
  { id: 'fath_ug_01', text: 'حَآدَّ', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', explanation: 'حرف مد بعده حرف مشدد في كلمة واحدة (٦ حركات لزوماً)', quranSurah: 'المجادلة: ٢٢', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_02', text: 'دَآبَّةٍ', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', quranSurah: 'النحل: ٤٩', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_03', text: 'كَآفَّةً', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', quranSurah: 'التوبة: ٣٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_04', text: 'ٱلْحَآقَّةُ', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', quranSurah: 'الحاقة: ١', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_05', text: 'ٱلصَّآخَّةُ', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', quranSurah: 'عبس: ٣٣', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_06', text: 'ءَامِّينَ', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', explanation: 'همزة ممدودة بعدها ميم مشددة ٦ حركات مع الغنة', quranSurah: 'المائدة: ٢', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },
  { id: 'fath_ug_07', text: 'أَتُحَـٰٓجُّوٓنِّي', category: 'word', skill: 'madd_lazim', skillLabel: 'المد اللازم الكلمي المثقل', explanation: 'كلمة تحوي مدين لازمين كلميين مثقلين متتابعين (٦ + ٦ حركات)', quranSurah: 'الأنعام: ٨٠', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 70 },

  // همزتا الوصل والقطع وأحكام الابتداء (ص 77)
  { id: 'fath_ug_08', text: 'ٱلْقُرْءَانُ  /  ٱلرَّحْمَـٰنُ', category: 'word', skill: 'hamzat_wasl', skillLabel: 'همزة الوصل في الأسماء المعرفة', explanation: 'تفتح همزة الوصل وجوباً عند البدء بالمعرف بـ (ال)', quranSurah: 'الرحمن: ١', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 77 },
  { id: 'fath_ug_09', text: 'ٱقْرَأْ  /  ٱهْدِنَا', category: 'word', skill: 'hamzat_wasl_verbs', skillLabel: 'همزة الوصل المكسورة في الأفعال', explanation: 'تكسر همزة الوصل في الأفعال إذا كان ثالث الفعل مفتوحاً أو مكسوراً', quranSurah: 'العلق: ١ / الفاتحة: ٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 77 },
  { id: 'fath_ug_10', text: 'ٱسْتُهْزِئَ  /  ٱجْتُثَّتْ', category: 'word', skill: 'hamzat_wasl_verbs', skillLabel: 'همزة الوصل المضمومة في الأفعال', explanation: 'تضم همزة الوصل إذا كان ثالث الفعل مضموماً ضماً لازماً', quranSurah: 'الأنعام: ١٠ / إبراهيم: ٢٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 77 },
  { id: 'fath_ug_11', text: 'ٱمْرَأَةَ  /  ٱبْنَ', category: 'word', skill: 'hamzat_wasl_nouns', skillLabel: 'الأسماء السماعية السبعة', explanation: 'ابن، ابنة، امرؤ، امرأة، اثنان، اثنتان، اسم (تكسر همزة الوصل فيها دائماً)', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 77 },
  { id: 'fath_ug_12', text: 'ٱمْشُوا۟ وَٱصْبِرُوٓا۟', category: 'sentence', skill: 'hamzat_wasl', skillLabel: 'استثناءات همزة الوصل', explanation: 'تكسر الهمزة في (امشوا) لأن أصل ثالث الفعل مكسور (امشيوا)', quranSurah: 'ص: ٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 77 },

  // التقاء الساكنين وحذف حرف المد وصلاً (ص 76)
  { id: 'fath_ug_13', text: 'شَقَقْنَا ٱلْأَرْضَ  (تنطق: شَقَقْنَـلْأَرْضَ)', category: 'sentence', skill: 'drop_vowel_wasl', skillLabel: 'سقوط حرف المد وصلاً', explanation: 'يسقط ألف المد لالتقاء الساكنين وتنتقل القراءة من النون للّام القمرية مباشرة', quranSurah: 'عبس: ٢٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },
  { id: 'fath_ug_14', text: 'صَبَبْنَا ٱلْمَآءَ  (تنطق: صَبَبْنَـلْمَاءَ)', category: 'sentence', skill: 'drop_vowel_wasl', skillLabel: 'سقوط حرف المد وصلاً', quranSurah: 'عبس: ٢٥', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },
  { id: 'fath_ug_15', text: 'ذِى ٱلْأَوْتَادِ  (تنطق: ذِلْأَوْتَادِ)', category: 'sentence', skill: 'drop_vowel_wasl', skillLabel: 'سقوط حرف المد وصلاً', explanation: 'حذف ياء المد وصلاً لمنع التقاء الساكنين', quranSurah: 'الفجر: ١٠', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },
  { id: 'fath_ug_16', text: 'وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ  (تنطق: وَعَمِلُـصَّالِحَاتِ)', category: 'sentence', skill: 'drop_vowel_wasl', skillLabel: 'سقوط واو المد وصلاً', explanation: 'حذف واو المد والهمزة واللام الشمسية والانتقال من اللام إلى الصاد المشددة', quranSurah: 'البينة: ٧', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },
  { id: 'fath_ug_17', text: 'قَوْمًا ٱللَّهُ  (تنطق: قَوْمَنِ ٱللَّهُ)', category: 'sentence', skill: 'tanween_kasr_wasl', skillLabel: 'كسر التنوين عند التقاء الساكنين', explanation: 'ينطق التنوين نوناً مكسورة وصلاً لمنع التقاء الساكنين', quranSurah: 'الأعراف: ١٦٤', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },
  { id: 'fath_ug_18', text: 'عُزَيْرٌ ٱبْنُ  (تنطق: عُزَيْرُنِ ٱبْنُ)', category: 'sentence', skill: 'tanween_kasr_wasl', skillLabel: 'كسر التنوين عند التقاء الساكنين', quranSurah: 'التوبة: ٣٠', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 76 },

  // كلمات الانطلاق القرائي الطويلة والتراكيب الخاصة (ص 78 - 81)
  { id: 'fath_ug_19', text: 'أَنُلْزِمُكُمُوهَا', category: 'word', skill: 'complex_word', skillLabel: 'تراكيب طويلة', explanation: 'كلمة قرآنية متصلة من ١٠ أحرف مع ضمائر متصلة', quranSurah: 'هود: ٢٨', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 79 },
  { id: 'fath_ug_20', text: 'فَسَيَكْفِيكَهُمُ ٱللَّهُ', category: 'word', skill: 'complex_word', skillLabel: 'تراكيب طويلة', explanation: 'أطول تركيب في سياق الآية', quranSurah: 'البقرة: ١٣٧', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 56 },
  { id: 'fath_ug_21', text: 'لَيَسْتَفِزُّونَكَ', category: 'word', skill: 'complex_word', skillLabel: 'تراكيب طويلة', quranSurah: 'الإسراء: ٧٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 79 },
  { id: 'fath_ug_22', text: 'نَضْطَرُّهُمْ', category: 'word', skill: 'complex_word', skillLabel: 'تراكيب مفخمة ومرققة', explanation: 'نون مرققة بعدها ضاد مفخمة فطاء مفخمة مشددة', quranSurah: 'لقمان: ٢٤', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 80 },
  { id: 'fath_ug_23', text: 'مَجْر۪ىٰهَا  (إمالة كبرى)', category: 'word', skill: 'quranic_symbols', skillLabel: 'علامات ضبط المصحف', explanation: 'نقطة معينة تحت الراء تدل على الإمالة الكبرى بين الفتحة والكسرة', quranSurah: 'هود: ٤١', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 81 },
  { id: 'fath_ug_24', text: 'تَأْمَ۫نَّا  (إشمام / اختلاس)', category: 'word', skill: 'quranic_symbols', skillLabel: 'علامات ضبط المصحف', explanation: 'ضم الشفتين إشارة للضمة المدغمة دون صوت (إشمام)', quranSurah: 'يوسف: ١١', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 81 },
  { id: 'fath_ug_25', text: 'ءَ۬اعْجَمِيٌّ  (تسهيل الهمزة)', category: 'word', skill: 'quranic_symbols', skillLabel: 'علامات ضبط المصحف', explanation: 'دائرة سوداء فوق الهمزة الثانية تدل على تسهيلها بين الهمزة والألف', quranSurah: 'فصلت: ٤٤', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 81 },

  // نصوص الطلاقة الكبرى والآيات الجامعة (ص 82 - 85)
  { id: 'fath_ug_26', text: 'إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ لَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'فصلت: ٨', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 84 },
  { id: 'fath_ug_27', text: 'رَبَّنَآ إِنَّنَآ ءَامَنَّا فَٱغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ ٱلنَّارِ', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'آل عمران: ١٦', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 84 },
  { id: 'fath_ug_28', text: 'وَقُلْ جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَـٰطِلُ إِنَّ ٱلْبَـٰطِلَ كَانَ زَهُوقًا', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'الإسراء: ٨١', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 83 },
  { id: 'fath_ug_29', text: 'هُوَ ٱلْأَوَّلُ وَٱلْـَٔاخِرُ وَٱلظَّـٰهِرُ وَٱلْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'الحديد: ٣', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 83 },
  { id: 'fath_ug_30', text: 'فَلِلَّهِ ٱلْحَمْدُ رَبِّ ٱلسَّمَـٰوَٰتِ وَرَبِّ ٱلْأَرْضِ رَبِّ ٱلْعَـٰلَمِينَ * وَلَهُ ٱلْكِبْرِيَآءُ فِي ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَهُوَ ٱلْعَيزِيزُ ٱلْحَكِيمُ', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'الجاثية: ٣٦ - ٣٧', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 84 },
  { id: 'fath_ug_31', text: 'هُوَ ٱللَّهُ ٱلَّذِي لَآ إِلَـٰهَ إِلَّا هُوَ عَالِمُ ٱلْغَيْبِ وَٱلشَّهَـٰدَةِ هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ * هُوَ ٱللَّهُ ٱلَّذِي لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَـٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ سُبْحَـٰنَ ٱللَّهِ عَمَّا يُشْرِكُونَ', category: 'text', skill: 'quranic_fluency_text', skillLabel: 'نصوص الانطلاق التام', quranSurah: 'الحشر: ٢٢ - ٢٣', gradeLevel: 'upper_grades', gradeName: 'الصفوف العليا والمتوسط', pageNumber: 85 }
];
