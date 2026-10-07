/**
 * بنك الاختبارات والتقييمات الشاملة المعتمدة
 * لجميع الصفوف والمراحل والمواد وفق الفترات والفصول الدراسية
 * مطابقة لنماذج وزارة التعليم واختبارات المعلمين الرسمية ١٤٤٨هـ
 */

import { GradeId } from '../types/curriculum';

export type ExamSubject = 'arabic' | 'islamic' | 'math' | 'science';

export type ExamPeriod = 'period1' | 'midterm' | 'period2' | 'final' | 'unit_eval' | 'diagnostic';

export type ExamQuestionType = 
  | 'first_letter_image'     // ألاحظ الصورة وأكتب الحرف الأول مع حركته
  | 'assemble_letters'       // أركب الحروف المنفصلة لتكون كلمة
  | 'syllable_analysis'      // أحلل الكلمة إلى مقاطع وحروف
  | 'demonstrative_pronoun'  // أكتب اسم الإشارة المناسب (هذا / هذه)
  | 'letter_positions'       // أكتب الحرف بأشكاله المختلفة (أول، وسط، متصل، منفصل)
  | 'match_image_word'       // أختار أو أصل الكلمة المناسبة للصورة
  | 'missing_letter'         // أكمل الحرف أو حرف المد الناقص
  | 'identify_sukoon'        // ألاحظ المقطع الساكن
  | 'oral_reading'           // قراءة الحروف والكلمات (شفهي)
  | 'dictation'              // أكتب ما يُملى عليّ
  | 'multiple_choice'        // اختيار من متعدد
  | 'sentence_order'         // أرتب الكلمات لتكون جملة مفيدة
  | 'grammar_extract';       // استخراج الظواهر اللغوية والإعراب

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  title: string;
  instructions: string;
  standardLabel?: string; // المعيار الوزاري الرسمي
  points: number;
  items: Array<{
    id: string;
    prompt?: string;
    imageEmoji?: string;
    imageLabel?: string;
    givenLetters?: string[];
    wordToAnalyze?: string;
    analysisParts?: string[]; // المقاطع المحللة
    assembledWord?: string;
    targetAnswer: string;
    options?: string[];
    audioPrompt?: string;
    hint?: string;
    modelExplanation?: string;
  }>;
}

export interface OfficialExam {
  id: string;
  title: string;
  subject: ExamSubject;
  subjectName: string;
  grade: GradeId;
  gradeName: string;
  term: 1 | 2 | 3;
  termName: string;
  period: ExamPeriod;
  periodName: string;
  unitName?: string;
  schoolYear: string;
  teacherName: string;
  writtenPoints: number;
  oralPoints: number;
  totalPoints: number;
  durationMinutes: number;
  description: string;
  questions: ExamQuestion[];
  evaluationRubric: {
    excellent: string;    // متفوق (100%)
    advanced: string;     // متقدم (90% - 99%)
    proficient: string;   // متمكن (80% - 89%)
    needsSupport: string; // غير مجتاز (أقل من 80%)
  };
}

export const OFFICIAL_EXAMS_DATABASE: OfficialExam[] = [
  // =========================================================================
  // 1. الصف الأول الابتدائي - لغتي: اختبار منتصف الفصل الدراسي الأول ١٤٤٨هـ (PDF الصفحة 1-2 و 13)
  // =========================================================================
  {
    id: 'exam_g1_t1_midterm',
    title: 'اختبار مادة لغتي منتصف الفصل الدراسي الأول ١٤٤٨هـ',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (أسرتي) والوحدة الثانية (مدرستي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'أ/ غزيل السعدان',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'الاختبار النصفي الشامل التحريري والشفهي لمهارات لغتي للصف الأول الابتدائي وفق معايير وزارة التعليم مع نموذج الإجابة الرسمي.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪) - أتقن جميع المهارات والتحليل والإملاء بدقة تامة',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪) - أتقن معظم المهارات مع دقة عالية',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪) - حقق الحد الأدنى لمعيار الإتقان',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪) - يحتاج إلى خطة علاجية ودعم فردي'
    },
    questions: [
      {
        id: 'q1_first_letter',
        type: 'first_letter_image',
        title: 'السؤال الأول: ألاحظ الصورة، وأكتب الحرف الأول من اسمها بحركته',
        instructions: 'تأمل كل صورة، ثم اكتب الحرف الأول مضبوطاً بالشكل التام (الفتحة أو الضمة أو الكسرة).',
        standardLabel: 'تسمية الحروف الهجائية التي درستها وتحديد أصواتها القصيرة',
        points: 4,
        items: [
          {
            id: 'q1_item1',
            imageEmoji: '🍌',
            imageLabel: 'موز',
            targetAnswer: 'مَ',
            options: ['مَ', 'بَ', 'لَ', 'دَ'],
            audioPrompt: 'مَوْز .. الحرف الأول مَ مفتوحة',
            modelExplanation: 'الحرف الأول من (مَوْز) هو حرف الميم بالفتحة: مَ'
          },
          {
            id: 'q1_item2',
            imageEmoji: '🚪',
            imageLabel: 'باب',
            targetAnswer: 'بَ',
            options: ['بَ', 'مَ', 'دَ', 'لَ'],
            audioPrompt: 'بَاب .. الحرف الأول بَ مفتوحة',
            modelExplanation: 'الحرف الأول من (بَاب) هو حرف الباء بالفتحة: بَ'
          },
          {
            id: 'q1_item3',
            imageEmoji: '🍗',
            imageLabel: 'لحم',
            targetAnswer: 'لَ',
            options: ['لَ', 'دَ', 'نَ', 'رَ'],
            audioPrompt: 'لَحْم .. الحرف الأول لَ مفتوحة',
            modelExplanation: 'الحرف الأول من (لَحْم) هو حرف اللام بالفتحة: لَ'
          },
          {
            id: 'q1_item4',
            imageEmoji: '🐅',
            imageLabel: 'نمر',
            targetAnswer: 'نَ',
            options: ['نَ', 'دُ', 'مِ', 'لَ'],
            audioPrompt: 'نَمِر .. الحرف الأول نَ بالفتحة',
            modelExplanation: 'الحرف الأول من (نَمِر) هو حرف النون بالفتحة: نَ'
          }
        ]
      },
      {
        id: 'q2_assemble_letters',
        type: 'assemble_letters',
        title: 'السؤال الثاني: أركب الحروف المنفصلة لتكون كلمة صحيحة',
        instructions: 'اقرأ الحروف المنفصلة واكتبها متصلة رسماً صحيحاً بأشكالها وحركاتها.',
        standardLabel: 'رسم الحروف التي درست رسماً صحيحاً بأشكالها وحركاتها المختلفة',
        points: 4,
        items: [
          {
            id: 'q2_item1',
            givenLetters: ['لَ', 'بَ', 'نَ'],
            targetAnswer: 'لَبَن',
            assembledWord: 'لَبَن',
            options: ['لَبَن', 'بَلَد', 'نَمْل', 'مَامَا'],
            audioPrompt: 'لَـ .. بَـ .. نَ .. لَبَن',
            modelExplanation: 'عند وصل الحروف الثلاثة ينتج: لَبَن'
          },
          {
            id: 'q2_item2',
            givenLetters: ['بَ', 'لَ', 'دَ'],
            targetAnswer: 'بَلَد',
            assembledWord: 'بَلَد',
            options: ['بَلَد', 'لَبَن', 'نَمْل', 'دُود'],
            audioPrompt: 'بَـ .. لَـ .. دَ .. بَلَد',
            modelExplanation: 'عند وصل الحروف الثلاثة ينتج: بَلَد'
          },
          {
            id: 'q2_item3',
            givenLetters: ['نَ', 'مْ', 'لُ'],
            targetAnswer: 'نَمْل',
            assembledWord: 'نَمْلُ',
            options: ['نَمْل', 'لَبَن', 'مَامَا', 'بَلَد'],
            audioPrompt: 'نَـ .. مْـ .. لُ .. نَمْل',
            modelExplanation: 'عند وصل الحروف مع المقطع الساكن: نَمْلُ'
          },
          {
            id: 'q2_item4',
            givenLetters: ['مَ', 'ا', 'مَ', 'ا'],
            targetAnswer: 'مَامَا',
            assembledWord: 'مَامَا',
            options: ['مَامَا', 'بَابَا', 'نَمْل', 'بَلَد'],
            audioPrompt: 'مَـ .. ا .. مَـ .. ا .. مَامَا',
            modelExplanation: 'عند وصل المقطعين مع مد الألف: مَامَا'
          }
        ]
      },
      {
        id: 'q3_syllables_analysis',
        type: 'syllable_analysis',
        title: 'السؤال الثالث: أحلل الكلمة إلى حروفها ومقاطعها ثم أكتبها',
        instructions: 'فكك الكلمة إلى مقاطعها الصوتية وحروفها في الجدول المخصص.',
        standardLabel: 'تحليل الكلمات إلى مقاطع وأصوات (كتاب لغتي ص ٥٤)',
        points: 2,
        items: [
          {
            id: 'q3_item1',
            wordToAnalyze: 'نَدِمَ',
            analysisParts: ['نَـ', 'دِ', 'مَ'],
            targetAnswer: 'نَـ دِ مَ',
            options: ['نَـ | دِ | مَ', 'نَدْ | مَ', 'نَـ | دِمْ'],
            audioPrompt: 'نَدِمَ .. تحلل إلى: نَـ .. دِ .. مَ',
            modelExplanation: 'الكلمة من حركات قصيرة: الحرف الأول (نَـ)، الثاني (دِ)، الثالث (مَ).'
          },
          {
            id: 'q3_item2',
            wordToAnalyze: 'مُدُن',
            analysisParts: ['مُـ', 'دُ', 'ن'],
            targetAnswer: 'مُـ دُ ن',
            options: ['مُـ | دُ | ن', 'مُدْ | نُ', 'مُـ | دُنْ'],
            audioPrompt: 'مُدُن .. تحلل إلى: مُـ .. دُ .. ن',
            modelExplanation: 'الكلمة من ثلاث حركات قصيرة بالضم: (مُـ)، (دُ)، (ن).'
          }
        ]
      },
      {
        id: 'q4_demonstrative',
        type: 'demonstrative_pronoun',
        title: 'السؤال الرابع: أكتب اسم الإشارة المناسب للصورة (هَذَا / هَذِهِ)',
        instructions: 'تأمل الصورة وحدد هل يشار إليها بـ (هَذَا) للمفرد المذكر أم (هَذِهِ) للمفرد المؤنث.',
        standardLabel: 'قراءة وكتابة كلمات بصرية (هذا - هذه) من الذاكرة القريبة',
        points: 2,
        items: [
          {
            id: 'q4_item1',
            imageEmoji: '🚗',
            imageLabel: 'سَيَّارَة',
            targetAnswer: 'هَذِهِ',
            options: ['هَذِهِ', 'هَذَا'],
            audioPrompt: 'سَيَّارَة مؤنثة .. نقول: هَذِهِ سَيَّارَة',
            modelExplanation: 'السيارة مؤنثة تنتهي بتاء مربوطة، فنقول: هَذِهِ سَيَّارَة.'
          },
          {
            id: 'q4_item2',
            imageEmoji: '✂️',
            imageLabel: 'مِقَصّ',
            targetAnswer: 'هَذَا',
            options: ['هَذَا', 'هَذِهِ'],
            audioPrompt: 'مِقَصّ مذكر .. نقول: هَذَا مِقَصّ',
            modelExplanation: 'المقص مذكر، فنقول: هَذَا مِقَصّ.'
          }
        ]
      },
      {
        id: 'q5_dictation',
        type: 'dictation',
        title: 'السؤال الخامس: أكتب ما يُملى عليّ من الذاكرة القريبة',
        instructions: 'استمع للنطق الصوتي واكتب الكلمة بدقة وإتقان مع الحركات.',
        standardLabel: 'كتابة كلمات سبق دراسة حروفها مع الحركة القصيرة والطويلة',
        points: 3,
        items: [
          {
            id: 'q5_item1',
            prompt: 'الكلمة الأولى',
            targetAnswer: 'بَاب',
            options: ['بَاب', 'نَاب', 'تَاب', 'دَاب'],
            audioPrompt: 'بَاب .. باء مفتوحة مع مد الألف وباء منونة بالضم: بَاب',
            modelExplanation: 'كلمة (بَاب) تتكون من صوت طويل (بَا) وباء ساكنة أو منونة (ب).'
          },
          {
            id: 'q5_item2',
            prompt: 'الكلمة الثانية',
            targetAnswer: 'لِين',
            options: ['لِين', 'تِين', 'دِين', 'عِين'],
            audioPrompt: 'لِين .. لام مكسورة مع مد الياء ونون: لِين',
            modelExplanation: 'كلمة (لِين) تتكون من لام مكسورة ومد الياء (لِي) ثم نون.'
          },
          {
            id: 'q5_item3',
            prompt: 'الكلمة الثالثة',
            targetAnswer: 'نَدَب',
            options: ['نَدَب', 'بَلَد', 'لَبَن', 'رَدَم'],
            audioPrompt: 'نَدَب .. نون مفتوحة ودال مفتوحة وباء: نَدَب',
            modelExplanation: 'كلمة (نَدَب) تتكون من: نَـ .. دَ .. بَ'
          },
          {
            id: 'q5_item4',
            prompt: 'الكلمة الرابعة',
            targetAnswer: 'مَال',
            options: ['مَال', 'قَال', 'سَالَ', 'حَال'],
            audioPrompt: 'مَال .. ميم مفتوحة مع مد الألف ولام: مَال',
            modelExplanation: 'كلمة (مَال) صوت طويل (مَا) ثم لام.'
          }
        ]
      },
      {
        id: 'q6_oral_reading',
        type: 'oral_reading',
        title: 'السؤال السادس (الشفهي): أقرأ الحروف والكلمات بأصواتها السليمة',
        instructions: 'اختبار شفهي رسمي مخصص لقياس طلاقة نطق الحروف والكلمات (٥ درجات شفهي).',
        standardLabel: 'نطق وقراءة الحروف بأصواتها القصيرة والطويلة والساكنة نطقا سليما',
        points: 5,
        items: [
          {
            id: 'q6_letters_row',
            prompt: 'قراءة شبكة الحروف بالأصوات القصيرة والطويلة',
            targetAnswer: 'مَ - بُ - لِ - دَ - نُ - رِ - مَا - بُو - لِي',
            audioPrompt: 'مَ .. بُ .. لِ .. دَ .. نُ .. رِ .. مَا .. بُو .. لِي',
            modelExplanation: 'معيار القراءة الشفهية: درجة لكل مقطع سليم بدون تعثر.'
          },
          {
            id: 'q6_words_row',
            prompt: 'قراءة شبكة الكلمات المدروسة',
            targetAnswer: 'دُود - نَدَب - دُبّ - نَام - لَبَن - لِين - بَاب - مَال - نَمْل - بَلَد',
            audioPrompt: 'دُود .. نَدَب .. دُبّ .. نَام .. لَبَن .. لِين .. بَاب .. مَال .. نَمْل .. بَلَد',
            modelExplanation: 'قراءة الكلمات بطلاقة واسترسال دون تهجئة منفصلة.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. الصف الأول الابتدائي - لغتي: اختبار ومراجعة الفترة الأولى (PDF الصفحة 3-10)
  // =========================================================================
  {
    id: 'exam_g1_t1_period1',
    title: 'اختبار ومراجعة مادة لغتي الفترة الأولى للفصل الدراسي الأول',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'period1',
    periodName: 'اختبار الفترة الأولى (فترة ١)',
    unitName: 'الوحدة الأولى (أسرتي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'إعداد المعلمة: صابرين أبو طالب',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'الاختبار الفتري الأول المعتمد لقياس مدى استيعاب مهارات الوحدة الأولى (حروف: م، ب، ل، د، ن، ر)، تحليل الكلمات، ومواضع الحروف.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'p1_first_sound',
        type: 'first_letter_image',
        title: 'ألاحظ الصورة ثم أكتب الحرف الأول من اسمها مع حركته',
        instructions: 'حدد الحرف الأول وضعه في الدائرة مع الحركة المناسبة.',
        standardLabel: 'تسمية الحروف الهجائية التي درستها وتحديد حركتها',
        points: 4,
        items: [
          {
            id: 'p1_s1',
            imageEmoji: '🍋',
            imageLabel: 'ليمون',
            targetAnswer: 'لِ',
            options: ['لِ', 'لَ', 'لُ', 'مَ'],
            audioPrompt: 'لَيْمُون أو لِيمُون .. لِ بالكسرة',
            modelExplanation: 'تبدأ بـ لِـ'
          },
          {
            id: 'p1_s2',
            imageEmoji: '🍊',
            imageLabel: 'برتقال',
            targetAnswer: 'بُ',
            options: ['بُ', 'بَ', 'بِ', 'تُ'],
            audioPrompt: 'بُرْتُقَال .. بُ بالضمة',
            modelExplanation: 'تبدأ بـ بُـ'
          },
          {
            id: 'p1_s3',
            imageEmoji: '⭐',
            imageLabel: 'نجمة',
            targetAnswer: 'نَ',
            options: ['نَ', 'نُ', 'نِ', 'مَ'],
            audioPrompt: 'نَجْمَة .. نَ بالفتحة',
            modelExplanation: 'تبدأ بـ نَـ'
          },
          {
            id: 'p1_s4',
            imageEmoji: '🔑',
            imageLabel: 'مفتاح',
            targetAnswer: 'مِ',
            options: ['مِ', 'مَ', 'مُ', 'بِ'],
            audioPrompt: 'مِفْتَاح .. مِ بالكسرة',
            modelExplanation: 'تبدأ بـ مِـ'
          },
          {
            id: 'p1_s5',
            imageEmoji: '🐝',
            imageLabel: 'نحلة',
            targetAnswer: 'نَ',
            options: ['نَ', 'نُ', 'نِ', 'حَ'],
            audioPrompt: 'نَحْلَة .. نَ بالفتحة',
            modelExplanation: 'تبدأ بـ نَـ'
          },
          {
            id: 'p1_s6',
            imageEmoji: '🚲',
            imageLabel: 'دراجة',
            targetAnswer: 'دَ',
            options: ['دَ', 'دُ', 'دِ', 'رَ'],
            audioPrompt: 'دَرَّاجَة .. دَ بالفتحة',
            modelExplanation: 'تبدأ بـ دَ'
          },
          {
            id: 'p1_s7',
            imageEmoji: '🏠',
            imageLabel: 'بيت',
            targetAnswer: 'بَ',
            options: ['بَ', 'بُ', 'بِ', 'مَ'],
            audioPrompt: 'بَيْت .. بَ بالفتحة',
            modelExplanation: 'تبدأ بـ بَـ'
          }
        ]
      },
      {
        id: 'p1_match_words',
        type: 'match_image_word',
        title: 'أختار الكلمة المناسبة لكل صورة من بنك الكلمات',
        instructions: 'اختر الكلمة الصحيحة المطابقة للصورة المعروضة.',
        standardLabel: 'رسم الحروف وقراءة الكلمات البصرية ومطابقتها',
        points: 4,
        items: [
          {
            id: 'm_w1',
            imageEmoji: '🐅',
            imageLabel: 'صورة نمر',
            targetAnswer: 'نَمِر',
            options: ['نَمِر', 'دَم', 'مَال', 'لَبَن', 'بُلْبُل', 'بَاب', 'نَمْل', 'دُبّ'],
            modelExplanation: 'الصورة لنمر: نَمِر'
          },
          {
            id: 'm_w2',
            imageEmoji: '🩸',
            imageLabel: 'صورة دم',
            targetAnswer: 'دَم',
            options: ['دَم', 'نَمِر', 'مَال', 'لَبَن', 'بُلْبُل', 'بَاب', 'نَمْل', 'دُبّ'],
            modelExplanation: 'الصورة لقطرات دم: دَم'
          },
          {
            id: 'm_w3',
            imageEmoji: '💵',
            imageLabel: 'صورة مال ونقود',
            targetAnswer: 'مَال',
            options: ['مَال', 'دَم', 'نَمِر', 'لَبَن', 'بُلْبُل', 'بَاب', 'نَمْل', 'دُبّ'],
            modelExplanation: 'الصورة لأوراق نقدية: مَال'
          },
          {
            id: 'm_w4',
            imageEmoji: '🥛',
            imageLabel: 'صورة علبة لبن',
            targetAnswer: 'لَبَن',
            options: ['لَبَن', 'مَال', 'دَم', 'نَمِر', 'بُلْبُل', 'بَاب', 'نَمْل', 'دُبّ'],
            modelExplanation: 'الصورة لحليب ولبن: لَبَن'
          },
          {
            id: 'm_w5',
            imageEmoji: '🚪',
            imageLabel: 'صورة باب منزل',
            targetAnswer: 'بَاب',
            options: ['بَاب', 'لَبَن', 'مَال', 'دَم', 'بُلْبُل', 'نَمْل', 'دُبّ', 'نَمِر'],
            modelExplanation: 'الصورة لباب: بَاب'
          },
          {
            id: 'm_w6',
            imageEmoji: '🐦',
            imageLabel: 'صورة بلبل يغرد',
            targetAnswer: 'بُلْبُل',
            options: ['بُلْبُل', 'بَاب', 'لَبَن', 'مَال', 'نَمْل', 'دُبّ', 'نَمِر', 'دَم'],
            modelExplanation: 'الصورة لعصفور بلبل: بُلْبُل'
          },
          {
            id: 'm_w7',
            imageEmoji: '🧸',
            imageLabel: 'صورة دب لطيف',
            targetAnswer: 'دُبّ',
            options: ['دُبّ', 'بُلْبُل', 'بَاب', 'لَبَن', 'نَمْل', 'مَال', 'نَمِر', 'دَم'],
            modelExplanation: 'الصورة لدب: دُبّ'
          },
          {
            id: 'm_w8',
            imageEmoji: '🐜',
            imageLabel: 'صورة نمل يعمل',
            targetAnswer: 'نَمْل',
            options: ['نَمْل', 'دُبّ', 'بُلْبُل', 'بَاب', 'لَبَن', 'مَال', 'نَمِر', 'دَم'],
            modelExplanation: 'الصورة لنمل: نَمْل'
          }
        ]
      },
      {
        id: 'p1_letter_shapes',
        type: 'letter_positions',
        title: 'أكتب الحرف بأشكاله المختلفة (أول الكلمة، وسط الكلمة، آخر الكلمة متصل، منفصل)',
        instructions: 'حدد الرسم الصحيح للحرف في مواضعه الأربعة.',
        standardLabel: 'تكتب الحروف الهجائية التي درستها بأشكالها المختلفة من الذاكرة البعيدة',
        points: 4,
        items: [
          {
            id: 'pos_m',
            prompt: 'مواضع حرف ( م )',
            targetAnswer: 'مـ | ـمـ | ـم | م',
            options: ['مـ (أول) | ـمـ (وسط) | ـم (متصل) | م (منفصل)', 'م | مـ | ـم | ـمـ'],
            modelExplanation: 'حرف الميم: في أول الكلمة (مـ)، في وسطها (ـمـ)، في آخرها متصل (ـم)، ومنفصل (م).'
          },
          {
            id: 'pos_b',
            prompt: 'مواضع حرف ( ب )',
            targetAnswer: 'بـ | ـبـ | ـب | ب',
            options: ['بـ (أول) | ـبـ (وسط) | ـب (متصل) | ب (منفصل)', 'ب | بـ | ـبـ | ـب'],
            modelExplanation: 'حرف الباء: في أول الكلمة (بـ)، في وسطها (ـبـ)، في آخرها متصل (ـب)، ومنفصل (ب).'
          },
          {
            id: 'pos_l',
            prompt: 'مواضع حرف ( ل )',
            targetAnswer: 'لـ | ـلـ | ـل | ل',
            options: ['لـ (أول) | ـلـ (وسط) | ـل (متصل) | ل (منفصل)', 'ل | لـ | ـلـ | ـل'],
            modelExplanation: 'حرف اللام: في أول الكلمة (لـ)، في وسطها (ـلـ)، في آخرها متصل (ـل)، ومنفصل (ل).'
          },
          {
            id: 'pos_d',
            prompt: 'مواضع حرف ( د )',
            targetAnswer: 'د | ـد | ـد | د',
            options: ['د (أول) | ـد (وسط) | ـد (متصل) | د (منفصل)', 'دـ | ـدـ | د | ـد'],
            modelExplanation: 'حرف الدال من حروف الانفصال لا يتصل بما بعده: (د) و (ـد).'
          }
        ]
      },
      {
        id: 'p1_analysis_detail',
        type: 'syllable_analysis',
        title: 'أحلل الكلمات إلى مقاطع وأصوات ثم أكتبها',
        instructions: 'فكك كل كلمة في الدوائر المخصصة بحسب مقاطعها وأصواتها.',
        standardLabel: 'تحلل الكلمات إلى مقاطع وتحلل المقاطع إلى أصوات',
        points: 3,
        items: [
          {
            id: 'an_1',
            wordToAnalyze: 'نَدِمَ',
            analysisParts: ['نَـ', 'دِ', 'مَ'],
            targetAnswer: 'نَـ | دِ | مَ',
            options: ['نَـ | دِ | مَ', 'نَدْ | مَ', 'نَـ | دِمْ'],
            modelExplanation: 'تحليل: نَـ .. دِ .. مَ'
          },
          {
            id: 'an_2',
            wordToAnalyze: 'نَمْلُ',
            analysisParts: ['نَمْ', 'لُ'],
            targetAnswer: 'نَمْ | لُ',
            options: ['نَمْ | لُ', 'نَـ | مْ | لُ', 'نَـ | مْلُ'],
            modelExplanation: 'مقطع ساكن: (نَمْ) معاً ثم اللام المضمومة (لُ).'
          },
          {
            id: 'an_3',
            wordToAnalyze: 'بِلَادِي',
            analysisParts: ['بِـ', 'لَا', 'دِي'],
            targetAnswer: 'بِـ | لَا | دِي',
            options: ['بِـ | لَا | دِي', 'بِلْ | ا | دِي', 'بِـ | لَادْ | ي'],
            modelExplanation: 'صوت قصير (بِـ) + مد ألف (لَا) + مد ياء (دِي).'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. الصف الأول الابتدائي - لغتي: تقويم الوحدة الثانية (مدرستي) ١٤٤٨هـ (PDF الصفحة 41 و 46-49)
  // =========================================================================
  {
    id: 'exam_g1_t1_unit2',
    title: 'تقويم الوحدة الثانية (مدرستي) لمادة لغتي للفصل الدراسي الأول',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'unit_eval',
    periodName: 'تقويم وحدة (الوحدة ٢)',
    unitName: 'الوحدة الثانية (مدرستي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'المعلمة: منيرة العمري',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 40,
    description: 'تقويم شامل لمهارات الوحدة الثانية لحروف: ص، ف، س، ق، ت، ح وتدريبات تحليل المقاطع الصوتية وأسماء الإشارة وترتيب الجمل.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'u2_reading_words',
        type: 'oral_reading',
        title: 'السؤال الأول: أقرأ الكلمات التالية قراءة بصرية صحيحة',
        instructions: 'اقرأ الكلمات بسرعة ودقة وانقر للاستماع للنطق الفصيح.',
        standardLabel: 'قراءة كلمات تشتمل على حروف الوحدة',
        points: 4,
        items: [
          {
            id: 'u2_w1',
            prompt: 'قراءة الكلمات',
            targetAnswer: 'فَتَحَ - صَفَّقَ - سَحَقَ - تُفَّاح - صَفَحَ - فَاقَ - تَصِفُ - قَفَص',
            audioPrompt: 'فَتَحَ .. صَفَّقَ .. سَحَقَ .. تُفَّاح .. صَفَحَ .. فَاقَ .. تَصِفُ .. قَفَص',
            modelExplanation: 'قراءة الكلمات مع مراعاة الشدة والمدود والتاء المربوطة.'
          }
        ]
      },
      {
        id: 'u2_analysis',
        type: 'syllable_analysis',
        title: 'السؤال الثاني: أحلل الكلمات إلى مقاطع ثم أكتبها',
        instructions: 'حلل كل كلمة مع مراعاة المقطع الساكن والمدود.',
        standardLabel: 'تحليل الكلمات إلى مقاطع وحروف',
        points: 4,
        items: [
          {
            id: 'u2_an1',
            wordToAnalyze: 'فُصُول',
            analysisParts: ['فُـ', 'صُو', 'ل'],
            targetAnswer: 'فُـ | صُو | ل',
            options: ['فُـ | صُو | ل', 'فُصْ | و | ل', 'فُـ | صُولْ'],
            modelExplanation: 'فاء مضمومة + مد الواو (صُو) + لام (ل).'
          },
          {
            id: 'u2_an2',
            wordToAnalyze: 'بُسْتَان',
            analysisParts: ['بُسْ', 'تَا', 'ن'],
            targetAnswer: 'بُسْ | تَا | ن',
            options: ['بُسْ | تَا | ن', 'بُـ | سْ | تَا | ن', 'بُسْتْ | ا | ن'],
            modelExplanation: 'مقطع ساكن (بُسْ) + مد الألف (تَا) + نون (ن).'
          },
          {
            id: 'u2_an3',
            wordToAnalyze: 'سِبَاق',
            analysisParts: ['سِـ', 'بَا', 'ق'],
            targetAnswer: 'سِـ | بَا | ق',
            options: ['سِـ | بَا | ق', 'سِبْ | ا | ق', 'سِـ | بَاقْ'],
            modelExplanation: 'سين مكسورة (سِـ) + مد الألف (بَا) + قاف (ق).'
          },
          {
            id: 'u2_an4',
            wordToAnalyze: 'أَحْرِصُ',
            analysisParts: ['أَحْ', 'رِ', 'صُ'],
            targetAnswer: 'أَحْ | رِ | صُ',
            options: ['أَحْ | رِ | صُ', 'أَ | حْ | رِ | صُ', 'أَحْرْ | صُ'],
            modelExplanation: 'مقطع ساكن (أَحْ) + راء مكسورة (رِ) + صاد مضمومة (صُ).'
          }
        ]
      },
      {
        id: 'u2_sentence_order',
        type: 'sentence_order',
        title: 'السؤال الثالث: أرتب الكلمات لتكون جملة مفيدة ثم أكتبها',
        instructions: 'رتب الكلمات المبعثرة للحصول على جملة تامة المعنى.',
        standardLabel: 'ترتيب الكلمات لتكوين جملة مفيدة',
        points: 4,
        items: [
          {
            id: 'u2_ord1',
            prompt: 'القُرْآنَ - وَلِيدٌ - قَرَأَ',
            targetAnswer: 'قَرَأَ وَلِيدٌ القُرْآنَ',
            options: ['قَرَأَ وَلِيدٌ القُرْآنَ', 'وَلِيدٌ القُرْآنَ قَرَأَ', 'القُرْآنَ قَرَأَ وَلِيدٌ'],
            audioPrompt: 'قَرَأَ وَلِيدٌ القُرْآنَ',
            modelExplanation: 'الجملة الفعلية تبدأ بالفعل (قَرَأَ) ثم الفاعل (وَلِيدٌ) ثم المفعول به (القُرْآنَ).'
          }
        ]
      },
      {
        id: 'u2_missing_letter',
        type: 'missing_letter',
        title: 'السؤال الرابع: أكمل الحرف الناقص في الكلمات التالية مستعيناً بالصورة',
        instructions: 'اختر الحرف الناقص المناسب للصورة واكتبه في الفراغ.',
        standardLabel: 'كتابة الحروف بأصواتها ومواضعها حسب موضعها في الكلمة',
        points: 3,
        items: [
          {
            id: 'u2_mis1',
            imageEmoji: '👑',
            prompt: 'تـ....ـاج',
            targetAnswer: 'ـا',
            options: ['ـا', 'ـو', 'ـي', 'ـن'],
            modelExplanation: 'الصورة لتاج: تَاج (مد الألف)'
          },
          {
            id: 'u2_mis2',
            imageEmoji: '🐑',
            prompt: 'خَرُو....',
            targetAnswer: 'ف',
            options: ['ف', 'ق', 'ص', 'س'],
            modelExplanation: 'الصورة لخروف: خَرُوف (حرف الفاء في آخر الكلمة)'
          },
          {
            id: 'u2_mis3',
            imageEmoji: '🐎',
            prompt: 'حِـ....ـان',
            targetAnswer: 'صَـ',
            options: ['صَـ', 'سَـ', 'فَـ', 'قَـ'],
            modelExplanation: 'الصورة لحصان: حِصَان (حرف الصاد)'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. الصف الثاني الابتدائي - لغتي: اختبار الفترة الأولى ومنتصف الفصل
  // =========================================================================
  {
    id: 'exam_g2_t1_midterm',
    title: 'اختبار مادة لغتي منتصف الفصل الدراسي الأول - الصف الثاني',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade2',
    gradeName: 'الصف الثاني الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (أقاربي) والوحدة الثانية (أصدقائي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'إشراف قسم الصفوف الأولية',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار شامل لمهارات الصف الثاني: فهم المقروء، اللام الشمسية واللام القمرية، التاء المربوطة والمفتوحة والهاء، والتنوين.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'g2_q1_comprehension',
        type: 'multiple_choice',
        title: 'السؤال الأول: فهم المقروء (نص: صلة الرحم)',
        instructions: 'اقرأ النص التالي ثم أجب عن الأسئلة:',
        standardLabel: 'فهم النص المقروء واستيعاب معانيه وأفكاره',
        points: 4,
        items: [
          {
            id: 'g2_c1',
            prompt: 'فِي نِهَايَةِ الأُسْبُوعِ زَارَ فَوَّازٌ وَأُسْرَتُهُ جَدَّهُمْ فِي القَرْيَةِ. لِمَاذَا زَارَ فَوَّازٌ جَدَّهُ؟',
            targetAnswer: 'صِلَةً لِلرَّحِمِ وَبِرّاً بِهِ',
            options: ['صِلَةً لِلرَّحِمِ وَبِرّاً بِهِ', 'لِشِرَاءِ أَلْعَابٍ جَدِيدَةٍ', 'لِأَنَّ الجَدَّ غَاضِبٌ', 'لِلَّعِبِ فَقَطْ'],
            modelExplanation: 'الزيارة كانت براً بالجد وصلة للرحم.'
          },
          {
            id: 'g2_c2',
            prompt: 'مَا مَعْنَى كَلِمَةِ (صِلَةُ الرَّحِمِ)؟',
            targetAnswer: 'زِيَارَةُ الأَقَارِبِ وَالسُّؤَالُ عَنْهُمْ وَمُسَاعَدَتُهُمْ',
            options: [
              'زِيَارَةُ الأَقَارِبِ وَالسُّؤَالُ عَنْهُمْ وَمُسَاعَدَتُهُمْ',
              'اللَّعِبُ مَعَ الجِيرَانِ فِي الشَّارِعِ',
              'السَّفَرُ لِبِلَادٍ بَعِيدَةٍ',
              'النَّوْمُ مُبَكِّراً'
            ],
            modelExplanation: 'صلة الرحم هي تعهد الأقارب بالزيارة والتفقد والمساعدة.'
          }
        ]
      },
      {
        id: 'g2_q2_phonics',
        type: 'multiple_choice',
        title: 'السؤال الثاني: تصنيف الظواهر الصوتية والإملائية',
        instructions: 'اختر الإجابة الصحيحة لكل ظاهرة إملائية.',
        standardLabel: 'التمييز بين اللام الشمسية واللام القمرية والتاء المربوطة',
        points: 4,
        items: [
          {
            id: 'g2_p1',
            prompt: 'كَلِمَةُ (الشَّارِعُ) تَحْوِي:',
            targetAnswer: 'لَاماً شَمْسِيَّةً',
            options: ['لَاماً شَمْسِيَّةً', 'لَاماً قَمَرِيَّةً', 'تَنْوِينَ ضَمٍّ', 'تَاءً مَرْبُوطَةً'],
            modelExplanation: 'اللام الشمسية تكتب ولا تنطق وما بعدها مشدد (الشَّـ).'
          },
          {
            id: 'g2_p2',
            prompt: 'كَلِمَةُ (المَدْرَسَةُ) تَحْوِي:',
            targetAnswer: 'لَاماً قَمَرِيَّةً وَتَاءً مَرْبُوطَةً',
            options: [
              'لَاماً قَمَرِيَّةً وَتَاءً مَرْبُوطَةً',
              'لَاماً شَمْسِيَّةً وَتَاءً مَفْتُوحَةً',
              'مَدّاً بِالوَاوِ',
              'تَنْوِينَ كَسْرٍ'
            ],
            modelExplanation: 'اللام القمرية ساكنة وتنطق، والتاء المربوطة تنطق هاء عند الوقف.'
          },
          {
            id: 'g2_p3',
            prompt: 'كَلِمَةُ (كَتَبْتُ) تَنْتَهِي بِـ:',
            targetAnswer: 'تَاءِ مَفْتُوحَةٍ',
            options: ['تَاءِ مَفْتُوحَةٍ', 'تَاءِ مَرْبُوطَةٍ', 'هَاءِ ضَمِيرٍ', 'أَلِفٍ مَقْصُورَةٍ'],
            modelExplanation: 'تاء مفتوحة تنطق تاء وصلاً ووقفاً.'
          },
          {
            id: 'g2_p4',
            prompt: 'عِنْدَ تَنْوِينِ كَلِمَةِ (قَلَمٌ) تَنْوِينَ فَتْحٍ تُكْتَبُ:',
            targetAnswer: 'قَلَماً',
            options: ['قَلَماً', 'قَلَمَنْ', 'قَلَمٍ', 'قَلَمُ'],
            modelExplanation: 'تنوين الفتح تلحقه ألف تنوين الفتح (قَلَماً).'
          }
        ]
      },
      {
        id: 'g2_q3_grammar',
        type: 'multiple_choice',
        title: 'السؤال الثالث: التراكيب والأساليب اللغوية',
        instructions: 'حدد الأسلوب اللغوي أو اسم الإشارة والضمير المناسب.',
        standardLabel: 'توظيف الأساليب والتراكيب اللغوية في جمل مفيدة',
        points: 4,
        items: [
          {
            id: 'g2_g1',
            prompt: 'نَقُولُ: (........... وَلَدَانِ مُؤَدَّبَانِ)',
            targetAnswer: 'هَذَانِ',
            options: ['هَذَانِ', 'هَاتَانِ', 'هَؤُلَاءِ', 'هَذِهِ'],
            modelExplanation: '(هَذَانِ) اسم إشارة للمثنى المذكر.'
          },
          {
            id: 'g2_g2',
            prompt: 'أُسْلُوبُ التَّرَجِّي فِي اللُّغَةِ العَرَبِيَّةِ يَبْدَأُ بِـ:',
            targetAnswer: 'لَعَلَّ',
            options: ['لَعَلَّ', 'لَيْتَ', 'يَا', 'هَلْ'],
            modelExplanation: '(لَعَلَّ) حرف ترجٍّ للأمر المرغوب الممكن حصوله.'
          }
        ]
      },
      {
        id: 'g2_q4_dictation',
        type: 'dictation',
        title: 'السؤال الرابع: الإملاء الاختباري',
        instructions: 'استمع واكتب الكلمات مضبوطة بالحركات.',
        standardLabel: 'كتابة كلمات وجمل قصيرة إملاء صحيحاً',
        points: 3,
        items: [
          {
            id: 'g2_d1',
            prompt: 'اكتب الكلمة المسموعة',
            targetAnswer: 'صِلَةُ الرَّحِمِ',
            options: ['صِلَةُ الرَّحِمِ', 'سِلَةُ الرَّحِم', 'صِلَتُ الرَّحِم', 'صِلَةَ الرَّحَم'],
            audioPrompt: 'صِلَةُ الرَّحِمِ .. صِلَةُ بالتاء المربوطة والرَّحِمِ باللام الشمسية',
            modelExplanation: 'صِلَةُ الرَّحِمِ'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. الصف الثالث الابتدائي - لغتي: اختبار منتصف الفصل الدراسي الأول
  // =========================================================================
  {
    id: 'exam_g3_t1_midterm',
    title: 'اختبار مادة لغتي منتصف الفصل الدراسي الأول - الصف الثالث',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade3',
    gradeName: 'الصف الثالث الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (التعامل مع الآخرين) والوحدة الثانية (ربوع من بلادي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'معلمو الصف الثالث الابتدائي',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار نصفي شامل للصف الثالث لمهارات همزة الوصل والقطع، الأسماء الموصولة، صياغة أسلوب التعجب والاستثناء.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'g3_q1_text',
        type: 'multiple_choice',
        title: 'السؤال الأول: فهم المقروء (نص: الرياض عاصمة بلادي)',
        instructions: 'اقرأ النص ثم أجب عن الأسئلة:',
        standardLabel: 'استيعاب النص المقروء وتحليل أفكاره',
        points: 4,
        items: [
          {
            id: 'g3_t1',
            prompt: 'سُمِّيَتِ الرِّيَاضُ بِهَذَا الاسْمِ لِأَنَّهَا كَانَتْ فِي المَاضِي:',
            targetAnswer: 'رِيَاضاً خَضْرَاءَ كَثِيرَةَ البَسَاتِينِ وَالحَدَائِقِ',
            options: [
              'رِيَاضاً خَضْرَاءَ كَثِيرَةَ البَسَاتِينِ وَالحَدَائِقِ',
              'صَحْرَاءَ جَافَّةً لَا مَاءَ فِيهَا',
              'جِبَالاً عَالِيَةً جَلِيدِيَّةً',
              'شَاطِئاً بَحْرِيّاً كَبِيراً'
            ],
            modelExplanation: 'الرياض جمع روضة وهي الأرض الخضراء المليئة بالبساتين.'
          },
          {
            id: 'g3_t2',
            prompt: 'مِنْ أَبْرَزِ مَعَالِمِ مَدِينَةِ الرِّيَاضِ التَّارِيخِيَّةِ:',
            targetAnswer: 'قَصْرُ المَصْمَكِ',
            options: ['قَصْرُ المَصْمَكِ', 'بُرْجُ إِيفِل', 'مِينَاءُ جُدَّةَ', 'سَدُّ مَأْرِب'],
            modelExplanation: 'قصر المصمك شهد ملحمة فتح الرياض وتوحيد المملكة.'
          }
        ]
      },
      {
        id: 'g3_q2_hamza',
        type: 'multiple_choice',
        title: 'السؤال الثاني: همزتا الوصل والقطع',
        instructions: 'ميز بين همزة الوصل وهمزة القطع في الكلمات التالية:',
        standardLabel: 'التمييز بين همزة الوصل وهمزة القطع كتابة ونطقاً',
        points: 4,
        items: [
          {
            id: 'g3_h1',
            prompt: 'كَلِمَةُ (أَحْمَدُ) هَمْزَتُهَا:',
            targetAnswer: 'هَمْزَةُ قَطْعٍ تُرْسَمُ رَأْسَ عَيْنٍ فَوْقَ الأَلِفِ',
            options: [
              'هَمْزَةُ قَطْعٍ تُرْسَمُ رَأْسَ عَيْنٍ فَوْقَ الأَلِفِ',
              'هَمْزَةُ وَصْلٍ لَا تُرْسَمُ هَمْزَتُهَا',
              'أَلِفُ مَدٍّ',
              'هَمْزَةٌ مُتَطَرِّفَةٌ'
            ],
            modelExplanation: 'همزة القطع تنطق وصلاً ووقفاً وتكتب (أ).'
          },
          {
            id: 'g3_h2',
            prompt: 'كَلِمَةُ (انْطَلَقَ) هَمْزَتُهَا:',
            targetAnswer: 'هَمْزَةُ وَصْلٍ (وَانْطَلَقَ)',
            options: ['هَمْزَةُ وَصْلٍ (وَانْطَلَقَ)', 'هَمْزَةُ قَطْعٍ', 'هَمْزَةٌ مَمْدُودَةٌ', 'تَاءٌ مَفْتُوحَةٌ'],
            modelExplanation: 'إذا وضعت الواو قبلها (وانطلق) تسقط الهمزة في النطق، فهي همزة وصل.'
          }
        ]
      },
      {
        id: 'g3_q3_styles',
        type: 'multiple_choice',
        title: 'السؤال الثالث: أسلوب التعجب والاستثناء',
        instructions: 'اختر الصياغة النحوية الصحيحة للجمل التالية:',
        standardLabel: 'صياغة أسلوب التعجب وصياغة أسلوب الاستثناء بإلا',
        points: 4,
        items: [
          {
            id: 'g3_s1',
            prompt: 'نَتَعَجَّبُ مِنْ جَمَالِ الحَدِيقَةِ فَنَقُولُ:',
            targetAnswer: 'مَا أَجْمَلَ الحَدِيقَةَ!',
            options: ['مَا أَجْمَلَ الحَدِيقَةَ!', 'هَلِ الحَدِيقَةُ جَمِيلَةٌ؟', 'لَا تُفْسِدِ الحَدِيقَةَ!', 'يَا لَجَمَالِ المَنْزِلِ!'],
            modelExplanation: 'صيغة التعجب القياسية: ما أَفْعَلَ + المتعجب منه المنصوب: مَا أَجْمَلَ الحَدِيقَةَ!'
          },
          {
            id: 'g3_s2',
            prompt: 'حَضَرَ الطُّلَّابُ ........... طَالِباً (أُسْلُوبُ اسْتِثْنَاءٍ):',
            targetAnswer: 'إِلَّا',
            options: ['إِلَّا', 'لَعَلَّ', 'كَيْفَ', 'يَا'],
            modelExplanation: 'أداة الاستثناء المشهورة هي (إِلَّا).'
          }
        ]
      },
      {
        id: 'g3_q4_dictation',
        type: 'dictation',
        title: 'السؤال الرابع: إملاء جملة من الذاكرة',
        instructions: 'استمع للجملة واكتبها بدقة مع علامات الترقيم.',
        standardLabel: 'كتابة نصوص قصيرة إملاء صحيحاً مع علامات الترقيم',
        points: 3,
        items: [
          {
            id: 'g3_dt1',
            prompt: 'اكتب الجملة المسموعة',
            targetAnswer: 'الرِّيَاضُ عَاصِمَةُ المَمْلَكَةِ العَرَبِيَّةِ السُّعُودِيَّةِ.',
            options: [
              'الرِّيَاضُ عَاصِمَةُ المَمْلَكَةِ العَرَبِيَّةِ السُّعُودِيَّةِ.',
              'الرياد عاصمة المملكة العربية السعودية',
              'الرياض عاصمت المملكة',
              'الرِّيَاضُ عَاصِمَةٌ'
            ],
            audioPrompt: 'الرِّيَاضُ عَاصِمَةُ المَمْلَكَةِ العَرَبِيَّةِ السُّعُودِيَّةِ.',
            modelExplanation: 'جملة مفيدة تشتمل على اللام الشمسية والتاء المربوطة.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. الصف الرابع الابتدائي - لغتي: اختبار منتصف ونهاية الفصل الدراسي الأول
  // =========================================================================
  {
    id: 'exam_g4_t1_midterm',
    title: 'اختبار مادة لغتي الجميلة منتصف الفصل الدراسي الأول - الصف الرابع',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade4',
    gradeName: 'الصف الرابع الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (صحتي وبيئتي)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'لجنة تقويم لغتي الابتدائية',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار الصف الرابع النصفي المعتمد: الجملة الاسمية والجملة الفعلية، المبتدأ والخبر، أنواع الكلمة، والهمزة المتطرفة.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'g4_q1_grammar',
        type: 'multiple_choice',
        title: 'السؤال الأول: أقسام الكلمة وأنواع الجمل',
        instructions: 'حدد نوع الكلمة أو ركني الجملة بدقة:',
        standardLabel: 'تصنيف الكلمات إلى اسم وفعل وحرف وتحديد ركني الجملة الاسمية',
        points: 5,
        items: [
          {
            id: 'g4_gm1',
            prompt: 'تَنْقَسِمُ الكَلِمَةُ فِي اللُّغَةِ العَرَبِيَّةِ إِلَى:',
            targetAnswer: 'اسْمٍ وَفِعْلٍ وَحَرْفٍ',
            options: ['اسْمٍ وَفِعْلٍ وَحَرْفٍ', 'مُبْتَدَأٍ وَخَبَرٍ وَفَاعِلٍ', 'مَاضٍ وَمُضَارِعٍ وَأَمْرٍ', 'مُفْرَدٍ وَمُثَنَّى وَجَمْعٍ'],
            modelExplanation: 'أقسام الكلمة الثلاثة: الاسم، الفعل، الحرف.'
          },
          {
            id: 'g4_gm2',
            prompt: 'جُمْلَةُ: (الشَّجَرَةُ مُثْمِرَةٌ) هِيَ جُمْلَةٌ:',
            targetAnswer: 'اسْمِيَّةٌ تَتَكَوَّنُ مِنْ مُبْتَدَأٍ وَخَبَرٍ',
            options: ['اسْمِيَّةٌ تَتَكَوَّنُ مِنْ مُبْتَدَأٍ وَخَبَرٍ', 'فِعْلِيَّةٌ تَتَكَوَّنُ مِنْ فِعْلٍ وَفَاعِلٍ', 'شِبْهُ جُمْلَةٍ', 'جُمْلَةُ تَعَجُّبٍ'],
            modelExplanation: 'بدأت باسم (الشجرة) فهي جملة اسمية ركناها المبتدأ والخبر.'
          },
          {
            id: 'g4_gm3',
            prompt: 'حُكْمُ المُبْتَدَأِ وَالخَبَرِ الإِعْرَابِيُّ دَائِماً هُوَ:',
            targetAnswer: 'الرَّفْعُ (مَرْفُوعَانِ)',
            options: ['الرَّفْعُ (مَرْفُوعَانِ)', 'النَّصْبُ (مَنْصُوبَانِ)', 'الجَرُّ (مَجْرُورَانِ)', 'الجَزْمُ (مَجْزُومَانِ)'],
            modelExplanation: 'المبتدأ والخبر مرفوعان وعلامة رفعهما الأصلية الضمة.'
          }
        ]
      },
      {
        id: 'g4_q2_spelling',
        type: 'multiple_choice',
        title: 'السؤال الثاني: الظواهر الإملائية والهمزات',
        instructions: 'اختر الرسم الإملائي الصحيح:',
        standardLabel: 'رسم الكلمات التي تحوي همزة متطرفة أو تاء مربوطة ومفتوحة',
        points: 5,
        items: [
          {
            id: 'g4_sp1',
            prompt: 'كُتِبَتِ الهَمْزَةُ فِي كَلِمَةِ (شَاطِئ) عَلَى اليَاءِ لِأَنَّ مَا قَبْلَهَا:',
            targetAnswer: 'مَكْسُورٌ (حَرْفُ الطَّاءِ مَكْسُورٌ)',
            options: ['مَكْسُورٌ (حَرْفُ الطَّاءِ مَكْسُورٌ)', 'مَفْتُوحٌ', 'مَضْمُومٌ', 'سَاكِنٌ'],
            modelExplanation: 'الهمزة المتطرفة تتبع حركة ما قبلها، فإذا كُسر ما قبلها كتبت على ياء غير منقوطة.'
          },
          {
            id: 'g4_sp2',
            prompt: 'كُتِبَتِ الهَمْزَةُ فِي كَلِمَةِ (سَمَاء) عَلَى السَّطْرِ لِأَنَّهَا سُبِقَتْ بِـ:',
            targetAnswer: 'حَرْفِ مَدٍّ سَاكِنٍ (أَلِفِ المَدِّ)',
            options: ['حَرْفِ مَدٍّ سَاكِنٍ (أَلِفِ المَدِّ)', 'حَرْفٍ مَضْمُومٍ', 'حَرْفٍ مَكْسُورٍ', 'حَرْفٍ مُشَدَّدٍ'],
            modelExplanation: 'الهمزة المتطرفة بعد ساكن أو مد ترسم مفردة على السطر.'
          }
        ]
      },
      {
        id: 'g4_q3_dictation',
        type: 'dictation',
        title: 'السؤال الثالث: الإملاء والمهارات الكتابية',
        instructions: 'استمع للنص القصير واكتبه بدقة.',
        standardLabel: 'كتابة جملة كاملة تشمل الظواهر الإملائية المدروسة',
        points: 5,
        items: [
          {
            id: 'g4_d1',
            prompt: 'اكتب ما يملى عليك',
            targetAnswer: 'النَّظَافَةُ مِنَ الإِيمَانِ، وَهِيَ دَلِيلٌ عَلَى الرُّقِيِّ.',
            options: [
              'النَّظَافَةُ مِنَ الإِيمَانِ، وَهِيَ دَلِيلٌ عَلَى الرُّقِيِّ.',
              'النضافة من الايمان وهي دليل على الرقي',
              'النظافة من الايمان',
              'النَّظَافَةُ وَالرُّقِيُّ'
            ],
            audioPrompt: 'النَّظَافَةُ مِنَ الإِيمَانِ، وَهِيَ دَلِيلٌ عَلَى الرُّقِيِّ.',
            modelExplanation: 'النَّظَافَةُ مِنَ الإِيمَانِ، وَهِيَ دَلِيلٌ عَلَى الرُّقِيِّ.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 7. الصف الخامس الابتدائي - لغتي: اختبار منتصف الفصل الدراسي الأول
  // =========================================================================
  {
    id: 'exam_g5_t1_midterm',
    title: 'اختبار مادة لغتي الجميلة منتصف الفصل الدراسي الأول - الصف الخامس',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade5',
    gradeName: 'الصف الخامس الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (أخلاق وفضائل)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'قسم الصفوف العليا ولغتي',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار نصفي شامل للصف الخامس: علامات إعراب المبتدأ والخبر الفرعية (الألف والواو)، الهمزة المتوسطة، وأسلوب التوكيد.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'g5_q1_grammar',
        type: 'multiple_choice',
        title: 'السؤال الأول: علامات الرفع الفرعية للمبتدأ والخبر',
        instructions: 'حدد علامة الإعراب الصحيحة للمبتدأ والخبر:',
        standardLabel: 'تمييز علامات رفع المبتدأ والخبر الفرعية (الألف للمثنى والواو للجمع السالم والأسماء الخمسة)',
        points: 5,
        items: [
          {
            id: 'g5_gm1',
            prompt: 'فِي جُمْلَةِ: (المُعَلِّمَانِ مُخْلِصَانِ)، عَلامَةُ رَفْعِ المُبْتَدَأِ هِيَ:',
            targetAnswer: 'الأَلِفُ لِأَنَّهُ مُثَنَّى',
            options: ['الأَلِفُ لِأَنَّهُ مُثَنَّى', 'الضَّمَّةُ الظَّاهِرَةُ', 'الوَاوُ', 'ثُبُوتُ النُّونِ'],
            modelExplanation: 'المثنى يرفع وعلامة رفعه الألف نيابة عن الضمة.'
          },
          {
            id: 'g5_gm2',
            prompt: 'فِي جُمْلَةِ: (المُؤْمِنُونَ صَادِقُونَ)، عَلامَةُ رَفْعِ الخَبَرِ هِيَ:',
            targetAnswer: 'الوَاوُ لِأَنَّهُ جَمْعُ مُذَكَّرٍ سَالِمٌ',
            options: ['الوَاوُ لِأَنَّهُ جَمْعُ مُذَكَّرٍ سَالِمٌ', 'الضَّمَّةُ', 'الأَلِفُ', 'الفَتْحَةُ'],
            modelExplanation: 'جمع المذكر السالم يرفع وعلامة رفعه الواو.'
          },
          {
            id: 'g5_gm3',
            prompt: 'فِي جُمْلَةِ: (أَبُوكَ رَجُلٌ فَاضِلٌ)، المُبْتَدَأُ هُوَ (أَبُوكَ) وَعَلَامَةُ رَفْعِهِ:',
            targetAnswer: 'الوَاوُ لِأَنَّهُ مِنَ الأَسْمَاءِ الخَمْسَةِ',
            options: ['الوَاوُ لِأَنَّهُ مِنَ الأَسْمَاءِ الخَمْسَةِ', 'الضَّمَّةُ المُقَدَّرَةُ', 'الأَلِفُ', 'ثُبُوتُ النُّونِ'],
            modelExplanation: 'الأسماء الخمسة (أبو، أخو، حمو، فو، ذو) ترفع بالواو.'
          }
        ]
      },
      {
        id: 'g5_q2_hamza',
        type: 'multiple_choice',
        title: 'السؤال الثاني: الهمزة المتوسطة وقاعدة أقوى الحركات',
        instructions: 'حدد سبب رسم الهمزة المتوسطة في الكلمات التالية:',
        standardLabel: 'رسم الهمزة المتوسطة على الألف والواو والياء وفق قاعدة أقوى الحركتين',
        points: 5,
        items: [
          {
            id: 'g5_h1',
            prompt: 'رُسِمَتِ الهَمْزَةُ عَلَى الوَاوِ فِي كَلِمَةِ (مُؤْمِن) لِأَنَّ:',
            targetAnswer: 'الهمزة ساكنة وما قبلها مضموم والضمة أقوى من السكون',
            options: [
              'الهمزة ساكنة وما قبلها مضموم والضمة أقوى من السكون',
              'الهمزة مكسورة وما قبلها مفتوح',
              'الهمزة مفتوحة وما قبلها ساكن',
              'الهمزة متطرفة'
            ],
            modelExplanation: 'الضمة أقوى من السكون ويناسبها حرف الواو.'
          },
          {
            id: 'g5_h2',
            prompt: 'رُسِمَتِ الهَمْزَةُ عَلَى النَّبْرَةِ (اليَاءِ) فِي كَلِمَةِ (ذِئْب) لِأَنَّ:',
            targetAnswer: 'الهمزة ساكنة وما قبلها مكسور والكسرة أقوى الحركات',
            options: [
              'الهمزة ساكنة وما قبلها مكسور والكسرة أقوى الحركات',
              'الهمزة مفتوحة وما قبلها مضموم',
              'الهمزة مكسورة فقط',
              'الهمزة على السطر'
            ],
            modelExplanation: 'الكسرة هي أقوى الحركات ويناسبها النبرة أو الياء غير المنقوطة.'
          }
        ]
      },
      {
        id: 'g5_q3_dictation',
        type: 'dictation',
        title: 'السؤال الثالث: الإملاء والظواهر الإملائية',
        instructions: 'استمع للنص واكتبه بدقة.',
        standardLabel: 'كتابة كلمات تحوي همزة متوسطة وتنوين',
        points: 5,
        items: [
          {
            id: 'g5_d1',
            prompt: 'اكتب الجملة المسموعة',
            targetAnswer: 'يَمْتَلِئُ فُؤَادُ المُؤْمِنِ بِالمَحَبَّةِ وَالتَّفَاؤُلِ.',
            options: [
              'يَمْتَلِئُ فُؤَادُ المُؤْمِنِ بِالمَحَبَّةِ وَالتَّفَاؤُلِ.',
              'يمتلء فواد المومن بالمحبة والتفاؤل',
              'يمتلئ فؤاد المؤمن',
              'يَمْتَلِئُ القَلْبُ'
            ],
            audioPrompt: 'يَمْتَلِئُ فُؤَادُ المُؤْمِنِ بِالمَحَبَّةِ وَالتَّفَاؤُلِ.',
            modelExplanation: 'تشتمل على همزة متطرفة (يمتلئ) وهمزات متوسطة (فؤاد، المؤمن، التفاؤل).'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 8. الصف السادس الابتدائي - لغتي: اختبار منتصف ونهاية الفصل الدراسي الأول
  // =========================================================================
  {
    id: 'exam_g6_t1_midterm',
    title: 'اختبار مادة لغتي الجميلة منتصف الفصل الدراسي الأول - الصف السادس',
    subject: 'arabic',
    subjectName: 'لغتي الجميلة',
    grade: 'grade6',
    gradeName: 'الصف السادس الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (قدوات ومثل عليا)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'لجنة تقويم الصف السادس',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار الصف السادس النصفي: المشتقات (اسم الفاعل واسم المفعول)، كان وأخواتها، الأفعال الخمسة، وهمزة الوصل والقطع.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'g6_q1_grammar',
        type: 'multiple_choice',
        title: 'السؤال الأول: المشتقات والنواسخ',
        instructions: 'اختر الإجابة النحوية الصحيحة:',
        standardLabel: 'صياغة اسم الفاعل واسم المفعول والتعرف على عمل كان وأخواتها',
        points: 5,
        items: [
          {
            id: 'g6_gm1',
            prompt: 'اسْمُ الفَاعِلِ مِنَ الفِعْلِ الثُّلاثِيِّ (كَتَبَ) هُوَ:',
            targetAnswer: 'كَاتِبٌ عَلَى وَزْنِ فَاعِل',
            options: ['كَاتِبٌ عَلَى وَزْنِ فَاعِل', 'مَكْتُوبٌ عَلَى وَزْنِ مَفْعُول', 'كِتَابَةٌ', 'مَكْتَبٌ'],
            modelExplanation: 'يصاغ اسم الفاعل من الثلاثي على وزن فَاعِل: كَتَبَ ← كَاتِب.'
          },
          {
            id: 'g6_gm2',
            prompt: 'اسْمُ المَفْعُولِ مِنَ الفِعْلِ الثُّلاثِيِّ (سَمِعَ) هُوَ:',
            targetAnswer: 'مَسْمُوعٌ عَلَى وَزْنِ مَفْعُول',
            options: ['مَسْمُوعٌ عَلَى وَزْنِ مَفْعُول', 'سَامِعٌ عَلَى وَزْنِ فَاعِل', 'سَمِيعٌ', 'سَمَاعٌ'],
            modelExplanation: 'يصاغ اسم المفعول من الثلاثي على وزن مَفْعُول: سَمِعَ ← مَسْمُوع.'
          },
          {
            id: 'g6_gm3',
            prompt: 'عِنْدَ دُخُولِ (كَانَ) عَلَى جُمْلَةِ: (الطَّالِبُ مُجْتَهِدٌ) تُصْبِحُ:',
            targetAnswer: 'كَانَ الطَّالِبُ مُجْتَهِداً',
            options: ['كَانَ الطَّالِبُ مُجْتَهِداً', 'كَانَ الطَّالِبَ مُجْتَهِدٌ', 'كَانَ الطَّالِبُ مُجْتَهِدٌ', 'كَانَ الطَّالِبَ مُجْتَهِداً'],
            modelExplanation: 'كان ترفع المبتدأ اسماً لها وتنصب الخبر خبراً لها.'
          }
        ]
      },
      {
        id: 'g6_q2_verbs',
        type: 'multiple_choice',
        title: 'السؤال الثاني: الأفعال الخمسة وعلامات إعرابها',
        instructions: 'حدد الأفعال الخمسة وعلامة رفعها ونصبها وجزمها:',
        standardLabel: 'تمييز الأفعال الخمسة وإعرابها بثبوت النون وحذفها',
        points: 5,
        items: [
          {
            id: 'g6_v1',
            prompt: 'فِي جُمْلَةِ: (الطُّلَّابُ يُذَاكِرُونَ بِجِدٍّ)، الفِعْلُ (يُذَاكِرُونَ) مَرْفُوعٌ وَعَلامَةُ رَفْعِهِ:',
            targetAnswer: 'ثُبُوتُ النُّونِ لِأَنَّهُ مِنَ الأَفْعَالِ الخَمْسَةِ',
            options: ['ثُبُوتُ النُّونِ لِأَنَّهُ مِنَ الأَفْعَالِ الخَمْسَةِ', 'الضَّمَّةُ الظَّاهِرَةُ', 'الوَاوُ', 'حَذْفُ النُّونِ'],
            modelExplanation: 'الأفعال الخمسة ترفع بثبوت النون وتنصب وتجزم بحذفها.'
          }
        ]
      },
      {
        id: 'g6_q3_dictation',
        type: 'dictation',
        title: 'السؤال الثالث: الإملاء والظواهر الإملائية المتقدمة',
        instructions: 'استمع للنص واكتبه بدقة.',
        standardLabel: 'كتابة نصوص معقدة تشمل الهمزات والألف اللينة',
        points: 5,
        items: [
          {
            id: 'g6_d1',
            prompt: 'اكتب الجملة المسموعة',
            targetAnswer: 'العِلْمُ وَالأَخْلَاقُ هُمَا أَسَاسُ نَهْضَةِ الأُمَمِ وَبِنَاءِ الحَضَارَاتِ.',
            options: [
              'العِلْمُ وَالأَخْلَاقُ هُمَا أَسَاسُ نَهْضَةِ الأُمَمِ وَبِنَاءِ الحَضَارَاتِ.',
              'العلم والاخلاق اساس نهضة الامم',
              'العِلْمُ وَالأَخْلَاقُ',
              'بِنَاءِ الحَضَارَاتِ'
            ],
            audioPrompt: 'العِلْمُ وَالأَخْلَاقُ هُمَا أَسَاسُ نَهْضَةِ الأُمَمِ وَبِنَاءِ الحَضَارَاتِ.',
            modelExplanation: 'العِلْمُ وَالأَخْلَاقُ هُمَا أَسَاسُ نَهْضَةِ الأُمَمِ وَبِنَاءِ الحَضَارَاتِ.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 9. المرحلة المتوسطة (أول متوسط) - لغتي الخالدة: اختبار منتصف ونهاية الفصل الدراسي
  // =========================================================================
  {
    id: 'exam_m1_t1_midterm',
    title: 'اختبار مادة لغتي الخالدة منتصف الفصل الدراسي الأول - الصف الأول المتوسط',
    subject: 'arabic',
    subjectName: 'لغتي الخالدة',
    grade: 'intermediate1',
    gradeName: 'الصف الأول المتوسط',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الوحدة الأولى (القيم الإسلامية) والوحدة الثانية (الأعلام)',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'قسم اللغة العربية بالمرحلة المتوسطة',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 45,
    description: 'اختبار تشخيصي وفتري للمرحلة المتوسطة يشمل قواعد النحو، أسلوب الأمر، همزة الوصل والقطع في الأفعال، وتحليل النصوص الأدبية.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'm1_q1_grammar',
        type: 'multiple_choice',
        title: 'السؤال الأول: النحو والأساليب اللغوية',
        instructions: 'اختر الإجابة الدقيقة وفق القواعد النحوية:',
        standardLabel: 'إعراب المبتدأ والخبر وتمييز صيغ أسلوب الأمر والنواسخ',
        points: 5,
        items: [
          {
            id: 'm1_gm1',
            prompt: 'مَا إِعْرَابُ كَلِمَةِ (المُسْلِمُونَ) فِي: (كَانَ المُسْلِمُونَ صَادِقِينَ)؟',
            targetAnswer: 'اسم كان مرفوع وعلامة رفعه الواو لأنه جمع مذكر سالم',
            options: [
              'اسم كان مرفوع وعلامة رفعه الواو لأنه جمع مذكر سالم',
              'مبتدأ مرفوع بالضمة',
              'خبر كان منصوب بالياء',
              'فاعل مرفوع بالواو'
            ],
            modelExplanation: 'كان ترفع المبتدأ اسماً لها، والجمع المذكر السالم يرفع بالواو.'
          },
          {
            id: 'm1_gm2',
            prompt: 'صِيغَةُ أُسْلُوبِ الأَمْرِ فِي قَوْلِهِ تَعَالَى: ﴿وَبِالوَالِدَيْنِ إِحْسَاناً﴾ هِيَ:',
            targetAnswer: 'المصدر النائب عن فعل الأمر (أحسنوا إحساناً)',
            options: [
              'المصدر النائب عن فعل الأمر (أحسنوا إحساناً)',
              'فعل أمر صريح',
              'المضارع المقترن بلام الأمر',
              'اسم فعل أمر'
            ],
            modelExplanation: 'إحساناً مصدر ناب عن فعل الأمر الصريح أحسنوا.'
          }
        ]
      },
      {
        id: 'm1_q2_spelling',
        type: 'multiple_choice',
        title: 'السؤال الثاني: الرسم الإملائي للهمزة',
        instructions: 'حدد القاعدة الإملائية الصحيحة:',
        standardLabel: 'رسم همزة الوصل والقطع في الأفعال الخماسية والسداسية والأسماء',
        points: 5,
        items: [
          {
            id: 'm1_sp1',
            prompt: 'كَلِمَةُ (اسْتَخْرَجَ) هَمْزَتُهَا هَمْزَةُ وَصْلٍ لِأَنَّهَا:',
            targetAnswer: 'ماضي فعل سداسي',
            options: ['ماضي فعل سداسي', 'ماضي فعل خماسي', 'أمر فعل ثلاثي', 'مصدر سداسي'],
            modelExplanation: 'الفعل السداسي ماضيه وأمره ومصدره همزتها همزة وصل دائماً.'
          }
        ]
      },
      {
        id: 'm1_q3_dictation',
        type: 'dictation',
        title: 'السؤال الثالث: الإملاء والظواهر الإملائية',
        instructions: 'استمع واكتب العبارة بدقة:',
        standardLabel: 'كتابة فقرة متكاملة تراعي علامات الترقيم وقواعد الهمزات',
        points: 5,
        items: [
          {
            id: 'm1_dt1',
            prompt: 'اكتب ما يملى عليك',
            targetAnswer: 'إِنَّ التَّمَسُّكَ بِالقِيَمِ الإِسْلَامِيَّةِ يَمْنَحُ الإِنْسَانَ عِزَّةً وَرِفْعَةً فِي الدُّنْيَا وَالآخِرَةِ.',
            options: [
              'إِنَّ التَّمَسُّكَ بِالقِيَمِ الإِسْلَامِيَّةِ يَمْنَحُ الإِنْسَانَ عِزَّةً وَرِفْعَةً فِي الدُّنْيَا وَالآخِرَةِ.',
              'ان التمسك بالقيم الاسلامية يمنح الانسان عزة',
              'إِنَّ التَّمَسُّكَ بِالقِيَمِ',
              'عِزَّةً وَرِفْعَةً'
            ],
            audioPrompt: 'إِنَّ التَّمَسُّكَ بِالقِيَمِ الإِسْلَامِيَّةِ يَمْنَحُ الإِنْسَانَ عِزَّةً وَرِفْعَةً فِي الدُّنْيَا وَالآخِرَةِ.',
            modelExplanation: 'إِنَّ التَّمَسُّكَ بِالقِيَمِ الإِسْلَامِيَّةِ يَمْنَحُ الإِنْسَانَ عِزَّةً وَرِفْعَةً فِي الدُّنْيَا وَالآخِرَةِ.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 10. اختبار الدراسات الإسلامية - الصف الأول الابتدائي (الفترة الأولى ومنتصف الفصل)
  // =========================================================================
  {
    id: 'exam_islamic_g1_t1',
    title: 'اختبار مادة الدراسات الإسلامية منتصف الفصل الدراسي الأول - الصف الأول',
    subject: 'islamic',
    subjectName: 'الدراسات الإسلامية',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'التوحيد والفقه والسلوك',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'معلمو التربية الإسلامية',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 40,
    description: 'اختبار الدراسات الإسلامية لمهارات التوحيد (من ربي؟ ما ديني؟ من نبيي؟) والآداب والأذكار الإسلامية.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'is_q1',
        type: 'multiple_choice',
        title: 'السؤال الأول: أصول العقيدة الإسلامية الثلاثة',
        instructions: 'اختر الإجابة الصحيحة لكل سؤال عقدي:',
        standardLabel: 'معرفة الرب والدين والنبي صلى الله عليه وسلم',
        points: 8,
        items: [
          {
            id: 'is_item1',
            prompt: 'مَنْ رَبُّكَ؟',
            targetAnswer: 'رَبِّيَ اللهُ الَّذِي خَلَقَنِي وَخَلَقَ كُلَّ شَيْءٍ',
            options: [
              'رَبِّيَ اللهُ الَّذِي خَلَقَنِي وَخَلَقَ كُلَّ شَيْءٍ',
              'الشَّمْسُ وَالقَمَرُ',
              'المَلَائِكَةُ',
              'الطَّبِيعَةُ'
            ],
            audioPrompt: 'مَنْ رَبُّكَ؟ .. رَبِّيَ اللهُ',
            modelExplanation: 'الله هو الخالق الرازق المستحق للعبادة وحده.'
          },
          {
            id: 'is_item2',
            prompt: 'مَا دِينُكَ؟',
            targetAnswer: 'دِينِيَ الإِسْلَامُ',
            options: ['دِينِيَ الإِسْلَامُ', 'النَّصْرَانِيَّةُ', 'اليَهُودِيَّةُ', 'المَجُوسِيَّةُ'],
            audioPrompt: 'مَا دِينُكَ؟ .. دِينِيَ الإِسْلَامُ',
            modelExplanation: 'الإسلام هو الاستسلام لله بالتوحيد والانقياد له بالطاعة.'
          },
          {
            id: 'is_item3',
            prompt: 'مَنْ نَبِيُّكَ؟',
            targetAnswer: 'نَبِيِّي مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
            options: [
              'نَبِيِّي مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
              'نُوحٌ عَلَيْهِ السَّلَامُ',
              'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ',
              'مُوسَى عَلَيْهِ السَّلَامُ'
            ],
            audioPrompt: 'مَنْ نَبِيُّكَ؟ .. نَبِيِّي مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
            modelExplanation: 'خاتم الأنبياء والمرسلين نبينا محمد صلى الله عليه وسلم.'
          }
        ]
      },
      {
        id: 'is_q2',
        type: 'multiple_choice',
        title: 'السؤال الثاني: الفقه والآداب الإسلامية',
        instructions: 'اختر الأدب والسلوك الإسلامي القويم:',
        standardLabel: 'تطبيق الآداب الإسلامية (التسمية والأكل باليمين وبر الوالدين)',
        points: 7,
        items: [
          {
            id: 'is_f1',
            prompt: 'عِنْدَ البَدْءِ بِالأَكْلِ وَالشُّرْبِ أَقُولُ:',
            targetAnswer: 'بِسْمِ اللهِ',
            options: ['بِسْمِ اللهِ', 'الحَمْدُ لِلَّهِ', 'أَسْتَغْفِرُ اللهَ', 'سُبْحَانَ اللهِ'],
            audioPrompt: 'عِنْدَ البَدْءِ بِالأَكْلِ أَقُولُ: بِسْمِ اللهِ',
            modelExplanation: 'السنة التسمية قبل الأكل والأكل باليمين ومما يليك.'
          },
          {
            id: 'is_f2',
            prompt: 'عِنْدَ الفَرَاغِ مِنَ الأَكْلِ أَقُولُ:',
            targetAnswer: 'الحَمْدُ لِلَّهِ',
            options: ['الحَمْدُ لِلَّهِ', 'بِسْمِ اللهِ', 'اللهُ أَكْبَرُ', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ'],
            audioPrompt: 'عِنْدَ الانْتِهَاءِ مِنَ الطَّعَامِ أَقُولُ: الحَمْدُ لِلَّهِ',
            modelExplanation: 'نحمد الله ونشكره على نعمة الطعام والشراب.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 11. اختبار مادة الرياضيات - الصف الأول الابتدائي (منتصف الفصل الدراسي الأول)
  // =========================================================================
  {
    id: 'exam_math_g1_t1',
    title: 'اختبار مادة الرياضيات منتصف الفصل الدراسي الأول - الصف الأول',
    subject: 'math',
    subjectName: 'الرياضيات',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'الأعداد حتى ١٠، المقارنة والتصنيف وفق خاصية واحدة',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'قسم الرياضيات والصفوف الأولية',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 40,
    description: 'اختبار الرياضيات النصفي لمهارات العد، كتابة الأرقام، المقارنة (أكثر من، أقل من، يساوي)، والتصنيف حسب الشكل واللون.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'math_q1',
        type: 'multiple_choice',
        title: 'السؤال الأول: العد وكتابة الأرقام',
        instructions: 'عدّ الأشياء في كل مجموعة واختر العدد الصحيح:',
        standardLabel: 'يعد الطالب ويكتب الأعداد من ١ إلى ١٠ قراءة وكتابة وتمثيلاً',
        points: 8,
        items: [
          {
            id: 'm_c1',
            prompt: 'عَدَدُ التُّفَّاحَاتِ فِي المَجْمُوعَةِ: 🍎 🍎 🍎 🍎 🍎 هُوَ:',
            targetAnswer: '٥ (خَمْسَة)',
            options: ['٥ (خَمْسَة)', '٣ (ثَلَاثَة)', '٤ (أَرْبَعَة)', '٦ (سِتَّة)'],
            audioPrompt: '١، ٢، ٣، ٤، ٥ .. خمس تفاحات',
            modelExplanation: 'العدد ٥.'
          },
          {
            id: 'm_c2',
            prompt: 'عَدَدُ النُّجُومِ فِي المَجْمُوعَةِ: ⭐ ⭐ ⭐ هُوَ:',
            targetAnswer: '٣ (ثَلَاثَة)',
            options: ['٣ (ثَلَاثَة)', '٢ (اثْنَانِ)', '٤ (أَرْبَعَة)', '٥ (خَمْسَة)'],
            audioPrompt: 'ثلاث نجوم',
            modelExplanation: 'العدد ٣.'
          }
        ]
      },
      {
        id: 'math_q2',
        type: 'multiple_choice',
        title: 'السؤال الثاني: المقارنة والتصنيف',
        instructions: 'قارن بين المجموعات وحدد الأكثر والأقل:',
        standardLabel: 'المقارنة بين مجموعتين باستعمال (أكثر من، أقل من، يساوي)',
        points: 7,
        items: [
          {
            id: 'm_cp1',
            prompt: 'مَجْمُوعَةُ الكُرَاتِ (⚽ ⚽ ⚽ ⚽) بِالنِّسْبَةِ لِمَجْمُوعَةِ (⚽ ⚽):',
            targetAnswer: 'أَكْثَرُ مِنْ',
            options: ['أَكْثَرُ مِنْ', 'أَقَلُّ مِنْ', 'يُسَاوِي', 'لَا شَيْءَ مِمَّا سَبَقَ'],
            modelExplanation: '٤ كرات أكثر من كرتين.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 12. اختبار مادة العلوم - الصف الأول الابتدائي (الفترة الأولى ومنتصف الفصل)
  // =========================================================================
  {
    id: 'exam_science_g1_t1',
    title: 'اختبار مادة العلوم منتصف الفصل الدراسي الأول - الصف الأول',
    subject: 'science',
    subjectName: 'العلوم',
    grade: 'grade1',
    gradeName: 'الصف الأول الابتدائي',
    term: 1,
    termName: 'الفصل الدراسي الأول',
    period: 'midterm',
    periodName: 'منتصف الفصل (نصفي)',
    unitName: 'المخلوقات الحية والأشياء غير الحية، النباتات والحيوانات',
    schoolYear: '١٤٤٨هـ',
    teacherName: 'معلمو العلوم والبيئة',
    writtenPoints: 15,
    oralPoints: 5,
    totalPoints: 20,
    durationMinutes: 40,
    description: 'اختبار العلوم النصفي لمهارات التمييز بين الكائنات الحية والجمادات، أجزاء النبات ووظائفها، وحاجات الكائنات الحية.',
    evaluationRubric: {
      excellent: 'متفوق (متقن ١٠٠٪)',
      advanced: 'متقدم (متقن ٩٠٪ - ٩٩٪)',
      proficient: 'متمكن (متقن ٨٠٪ - ٨٩٪)',
      needsSupport: 'غير مجتاز (أقل من ٨٠٪)'
    },
    questions: [
      {
        id: 'sci_q1',
        type: 'multiple_choice',
        title: 'السؤال الأول: المخلوقات الحية والأشياء غير الحية',
        instructions: 'ميز بين الكائن الحي والجماد:',
        standardLabel: 'يصنف الطالب الأشياء إلى مخلوقات حية وأشياء غير حية',
        points: 8,
        items: [
          {
            id: 'sci_it1',
            prompt: 'أَيُّ الأَشْيَاءِ التَّالِيَةِ يُعَدُّ مَخْلُوقاً حَيّاً يَكْبُرُ وَيَتَغَذَّى؟',
            targetAnswer: 'العُصْفُورُ وَالشَّجَرَةُ',
            options: ['العُصْفُورُ وَالشَّجَرَةُ', 'السَّيَّارَةُ وَالبَيْتُ', 'القَلَمُ وَالكِتَابُ', 'الكُرَةُ'],
            modelExplanation: 'المخلوقات الحية تنمو وتتنفس وتتغذى وتتكاثر.'
          },
          {
            id: 'sci_it2',
            prompt: 'تَحْتَاجُ النَّبَاتَاتُ لِكَيْ تَعِيشَ وَتَنْمُوَ إِلَى:',
            targetAnswer: 'المَاءِ وَالهَوَاءِ وَضَوْءِ الشَّمْسِ وَالتُّرْبَةِ',
            options: [
              'المَاءِ وَالهَوَاءِ وَضَوْءِ الشَّمْسِ وَالتُّرْبَةِ',
              'الحَلْوَى وَالعَصِيرِ',
              'الظَّلَامِ فَقَطْ',
              'السَّيَّارَاتِ'
            ],
            modelExplanation: 'النبات يصنع غذاءه بضوء الشمس والماء والهواء.'
          }
        ]
      },
      {
        id: 'sci_q2',
        type: 'multiple_choice',
        title: 'السؤال الثاني: أجزاء النبات',
        instructions: 'حدد وظيفة كل جزء من أجزاء النبتة:',
        standardLabel: 'يتعرف الطالب على الجذور والساق والأوراق ووظائفها',
        points: 7,
        items: [
          {
            id: 'sci_p1',
            prompt: 'الجُزْءُ الَّذِي يُثَبِّتُ النَّبَاتَ فِي التُّرْبَةِ وَيَمْتَصُّ المَاءَ هُوَ:',
            targetAnswer: 'الجُذُورُ',
            options: ['الجُذُورُ', 'الأَوْرَاقُ', 'الأَزْهَارُ', 'السَّاقُ'],
            modelExplanation: 'الجذور تثبت النبتة وتمتص الماء والأملاح المعدنية من التربة.'
          }
        ]
      }
    ]
  }
];

export const ALL_GRADES_LIST: Array<{ id: GradeId | 'all'; name: string }> = [
  { id: 'all', name: 'جميع الصفوف والمراحل' },
  { id: 'foundation', name: 'التأسيس وفتح الرحمن' },
  { id: 'kg1', name: 'روضة أولى (KG1)' },
  { id: 'kg2', name: 'تمهيدي (KG2)' },
  { id: 'grade1', name: 'الصف الأول الابتدائي' },
  { id: 'grade2', name: 'الصف الثاني الابتدائي' },
  { id: 'grade3', name: 'الصف الثالث الابتدائي' },
  { id: 'grade4', name: 'الصف الرابع الابتدائي' },
  { id: 'grade5', name: 'الصف الخامس الابتدائي' },
  { id: 'grade6', name: 'الصف السادس الابتدائي' },
  { id: 'intermediate1', name: 'الصف الأول المتوسط' },
  { id: 'intermediate2', name: 'الصف الثاني المتوسط' },
  { id: 'intermediate3', name: 'الصف الثالث المتوسط' }
];

export const ALL_TERMS_LIST: Array<{ id: 1 | 2 | 3 | 'all'; name: string }> = [
  { id: 'all', name: 'جميع الفصول الدراسية' },
  { id: 1, name: 'الفصل الدراسي الأول' },
  { id: 2, name: 'الفصل الدراسي الثاني' },
  { id: 3, name: 'الفصل الدراسي الثالث' }
];

export const ALL_PERIODS_LIST: Array<{ id: ExamPeriod | 'all'; name: string }> = [
  { id: 'all', name: 'جميع الفترات والأنواع' },
  { id: 'period1', name: 'اختبار الفترة الأولى' },
  { id: 'midterm', name: 'اختبار منتصف الفصل (نصفي)' },
  { id: 'period2', name: 'اختبار الفترة الثانية' },
  { id: 'final', name: 'اختبار نهاية الفصل (نهائي)' },
  { id: 'unit_eval', name: 'تقويم الوحدات' },
  { id: 'diagnostic', name: 'اختبار تشخيصي ومعايير' }
];

export const ALL_SUBJECTS_LIST: Array<{ id: ExamSubject | 'all'; name: string; icon: string }> = [
  { id: 'all', name: 'جميع المواد الدراسية', icon: '📚' },
  { id: 'arabic', name: 'لغتي الجميلة', icon: '🇸🇦' },
  { id: 'islamic', name: 'الدراسات الإسلامية', icon: '🕌' },
  { id: 'math', name: 'الرياضيات', icon: '📐' },
  { id: 'science', name: 'العلوم والبيئة', icon: '🔬' }
];
