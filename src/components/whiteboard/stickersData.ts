export interface StickerItem {
  id: string;
  type: 'stamp' | 'badge' | 'emoji' | 'character' | 'math' | 'arabic';
  content: string;
  label: string;
  color?: string;
  bg?: string;
}

export interface StickerCategory {
  id: string;
  name: string;
  icon: string;
  items: StickerItem[];
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'teacher_stamps',
    name: 'أختام وتشجيع المعلم 🌟',
    icon: '🌟',
    items: [
      { id: 'stamp_1', type: 'stamp', content: '🌟 ممتاز يا بطل!', label: 'ممتاز يا بطل', bg: '#fef3c7', color: '#b45309' },
      { id: 'stamp_2', type: 'stamp', content: '👏 أحسنت عملاً!', label: 'أحسنت عملاً', bg: '#dcfce7', color: '#15803d' },
      { id: 'stamp_3', type: 'stamp', content: '🌺 بارك الله فيك', label: 'بارك الله فيك', bg: '#fce7f3', color: '#be185d' },
      { id: 'stamp_4', type: 'stamp', content: '⭐ نجم الأسبوع', label: 'نجم الأسبوع', bg: '#e0e7ff', color: '#4338ca' },
      { id: 'stamp_5', type: 'stamp', content: '💡 إجابة ذكية ورائعة', label: 'إجابة ذكية', bg: '#fef9c3', color: '#a16207' },
      { id: 'stamp_6', type: 'stamp', content: '🎨 إبداع لا محدود', label: 'إبداع', bg: '#f3e8ff', color: '#7e22ce' },
      { id: 'stamp_7', type: 'stamp', content: '💯 درجة كاملة 10/10', label: 'درجة كاملة', bg: '#fee2e2', color: '#b91c1c' },
      { id: 'stamp_8', type: 'stamp', content: '✍️ خط جميل ومميز', label: 'خط جميل', bg: '#ccfbf1', color: '#0f766e' },
      { id: 'stamp_9', type: 'stamp', content: '🚀 واصل التقدم!', label: 'واصل التقدم', bg: '#ffedd5', color: '#c2410c' },
      { id: 'stamp_10', type: 'stamp', content: '👑 ملك الإملاء', label: 'ملك الإملاء', bg: '#fae8ff', color: '#86198f' },
      { id: 'stamp_11', type: 'stamp', content: '📖 قارئ متميز', label: 'قارئ متميز', bg: '#e0f2fe', color: '#0369a1' },
      { id: 'stamp_12', type: 'stamp', content: '❤️ فخور بك جداً', label: 'فخور بك', bg: '#ffe4e6', color: '#be123c' },
      { id: 'stamp_13', type: 'stamp', content: '🎯 مصيب في الهدف!', label: 'مصيب في الهدف', bg: '#ecfdf5', color: '#047857' },
      { id: 'stamp_14', type: 'stamp', content: '🏅 وسام التميز', label: 'وسام التميز', bg: '#fef08a', color: '#854d0e' },
      { id: 'stamp_15', type: 'stamp', content: '🏆 المركز الأول', label: 'المركز الأول', bg: '#fde047', color: '#713f12' },
      { id: 'stamp_16', type: 'stamp', content: '🌿 سلوك ومشاركة رائعة', label: 'مشاركة رائعة', bg: '#d1fae5', color: '#065f46' },
    ]
  },
  {
    id: 'animals',
    name: 'حيوانات وشخصيات لطيفة 🦁',
    icon: '🦁',
    items: [
      { id: 'anim_1', type: 'emoji', content: '🦁', label: 'أسد شجاع' },
      { id: 'anim_2', type: 'emoji', content: '🐘', label: 'فيل ذكي' },
      { id: 'anim_3', type: 'emoji', content: '🦒', label: 'زرافة' },
      { id: 'anim_4', type: 'emoji', content: '🐇', label: 'أرنب سريع' },
      { id: 'anim_5', type: 'emoji', content: '🦊', label: 'ثعلب' },
      { id: 'anim_6', type: 'emoji', content: '🐻', label: 'دب لطيف' },
      { id: 'anim_7', type: 'emoji', content: '🐼', label: 'باندا' },
      { id: 'anim_8', type: 'emoji', content: '🐨', label: 'كوالا' },
      { id: 'anim_9', type: 'emoji', content: '🐯', label: 'نمر' },
      { id: 'anim_10', type: 'emoji', content: '🐵', label: 'قرد مرح' },
      { id: 'anim_11', type: 'emoji', content: '🦄', label: 'يونيكورن سحري' },
      { id: 'anim_12', type: 'emoji', content: '🐦', label: 'عصفور مغرد' },
      { id: 'anim_13', type: 'emoji', content: '🦅', label: 'صقر جارح' },
      { id: 'anim_14', type: 'emoji', content: '🦉', label: 'بومة الحكمة' },
      { id: 'anim_15', type: 'emoji', content: '🐬', label: 'دلفين' },
      { id: 'anim_16', type: 'emoji', content: '🐢', label: 'سلحفاة حكيمة' },
      { id: 'anim_17', type: 'emoji', content: '🦋', label: 'فراشة ملونة' },
      { id: 'anim_18', type: 'emoji', content: '🐝', label: 'نحلة نشيطة' },
      { id: 'anim_19', type: 'emoji', content: '🐞', label: 'دعسوقة' },
      { id: 'anim_20', type: 'emoji', content: '🐪', label: 'جمل الصبر' },
    ]
  },
  {
    id: 'school_items',
    name: 'أدوات مدرسية وتعليمية 📚',
    icon: '📚',
    items: [
      { id: 'sch_1', type: 'emoji', content: '📖', label: 'كتاب مفتوح' },
      { id: 'sch_2', type: 'emoji', content: '📚', label: 'كتب مدرسية' },
      { id: 'sch_3', type: 'emoji', content: '✏️', label: 'قلم رصاص' },
      { id: 'sch_4', type: 'emoji', content: '🖋️', label: 'قلم حبر' },
      { id: 'sch_5', type: 'emoji', content: '🖍️', label: 'ألوان شمعية' },
      { id: 'sch_6', type: 'emoji', content: '📐', label: 'مثلث هندسي' },
      { id: 'sch_7', type: 'emoji', content: '📏', label: 'مسطرة قياس' },
      { id: 'sch_8', type: 'emoji', content: '✂️', label: 'مقص مدرسي' },
      { id: 'sch_9', type: 'emoji', content: '🎒', label: 'حقيبة مدرسية' },
      { id: 'sch_10', type: 'emoji', content: '🎓', label: 'قبعة التخرج' },
      { id: 'sch_11', type: 'emoji', content: '🔬', label: 'مجهر العلوم' },
      { id: 'sch_12', type: 'emoji', content: '🧪', label: 'أنبوب اختبار' },
      { id: 'sch_13', type: 'emoji', content: '🎨', label: 'لوحة رسم' },
      { id: 'sch_14', type: 'emoji', content: '💻', label: 'حاسوب محمول' },
      { id: 'sch_15', type: 'emoji', content: '⏰', label: 'ساعة منبه' },
      { id: 'sch_16', type: 'emoji', content: '🔔', label: 'جرس الحصة' },
      { id: 'sch_17', type: 'emoji', content: '🍎', label: 'تفاحة المعلم' },
      { id: 'sch_18', type: 'emoji', content: '💡', label: 'فكرة ملهمة' },
    ]
  },
  {
    id: 'arabic_letters',
    name: 'حروف وتشكيل لغتي 🔤',
    icon: '🔤',
    items: [
      { id: 'ar_1', type: 'arabic', content: 'أَ', label: 'ألف مفتوحة' },
      { id: 'ar_2', type: 'arabic', content: 'أُ', label: 'ألف مضمومة' },
      { id: 'ar_3', type: 'arabic', content: 'إِ', label: 'ألف مكسورة' },
      { id: 'ar_4', type: 'arabic', content: 'بَـ', label: 'باء أول الكلمة' },
      { id: 'ar_5', type: 'arabic', content: 'ـتـ', label: 'تاء وسط الكلمة' },
      { id: 'ar_6', type: 'arabic', content: 'ـث', label: 'ثاء آخر الكلمة' },
      { id: 'ar_7', type: 'arabic', content: 'ـة', label: 'تاء مربوطة' },
      { id: 'ar_8', type: 'arabic', content: 'الْـ', label: 'لام قمرية' },
      { id: 'ar_9', type: 'arabic', content: 'الشَّـ', label: 'لام شمسية' },
      { id: 'ar_10', type: 'arabic', content: 'ـاً', label: 'تنوين فتح' },
      { id: 'ar_11', type: 'arabic', content: 'ـٌ', label: 'تنوين ضم' },
      { id: 'ar_12', type: 'arabic', content: 'ـٍ', label: 'تنوين كسر' },
      { id: 'ar_13', type: 'arabic', content: 'ـّ', label: 'شدة' },
      { id: 'ar_14', type: 'arabic', content: 'ـْ', label: 'سكون' },
      { id: 'ar_15', type: 'arabic', content: '؟', label: 'علامة استفهام' },
      { id: 'ar_16', type: 'arabic', content: '!', label: 'علامة تعجب' },
    ]
  },
  {
    id: 'emojis_reactions',
    name: 'تفاعلات وإيموجي مرحة 😄',
    icon: '😄',
    items: [
      { id: 'em_1', type: 'emoji', content: '😃', label: 'مبتسم وسعيد' },
      { id: 'em_2', type: 'emoji', content: '🥳', label: 'احتفال وفرح' },
      { id: 'em_3', type: 'emoji', content: '🤩', label: 'منبهر بنجوم' },
      { id: 'em_4', type: 'emoji', content: '🤓', label: 'ذكي وعبقري' },
      { id: 'em_5', type: 'emoji', content: '🧐', label: 'مفكر باحث' },
      { id: 'em_6', type: 'emoji', content: '💪', label: 'قوي ومجتهد' },
      { id: 'em_7', type: 'emoji', content: '👏', label: 'تصفيق حار' },
      { id: 'em_8', type: 'emoji', content: '👍', label: 'إعجاب ممتاز' },
      { id: 'em_9', type: 'emoji', content: '🙌', label: 'تحية وترحيب' },
      { id: 'em_10', type: 'emoji', content: '❤️', label: 'قلب أحمر' },
      { id: 'em_11', type: 'emoji', content: '✨', label: 'بريق وتألق' },
      { id: 'em_12', type: 'emoji', content: '🔥', label: 'حماس ونشاط' },
      { id: 'em_13', type: 'emoji', content: '🌈', label: 'قوس قزح' },
      { id: 'em_14', type: 'emoji', content: '⭐', label: 'نجمة ذهبية' },
      { id: 'em_15', type: 'emoji', content: '🎉', label: 'قصاصات احتفال' },
      { id: 'em_16', type: 'emoji', content: '🏆', label: 'كأس ذهبي' },
    ]
  },
  {
    id: 'math_symbols',
    name: 'رموز الرياضيات والأشكال 🔢',
    icon: '🔢',
    items: [
      { id: 'm_1', type: 'math', content: '➕', label: 'جمع' },
      { id: 'm_2', type: 'math', content: '➖', label: 'طرح' },
      { id: 'm_3', type: 'math', content: '✖️', label: 'ضرب' },
      { id: 'm_4', type: 'math', content: '➗', label: 'قسمة' },
      { id: 'm_5', type: 'math', content: '🟰', label: 'يساوي' },
      { id: 'm_6', type: 'math', content: '>', label: 'أكبر من' },
      { id: 'm_7', type: 'math', content: '<', label: 'أصغر من' },
      { id: 'm_8', type: 'math', content: '½', label: 'نصف' },
      { id: 'm_9', type: 'math', content: '¼', label: 'ربع' },
      { id: 'm_10', type: 'math', content: '¾', label: 'ثلاثة أرباع' },
      { id: 'm_11', type: 'math', content: '٪', label: 'نسبة مئوية' },
      { id: 'm_12', type: 'math', content: '🔺', label: 'مثلث أحمر' },
      { id: 'm_13', type: 'math', content: '🟩', label: 'مربع أخضر' },
      { id: 'm_14', type: 'math', content: '🔵', label: 'دائرة زرقاء' },
      { id: 'm_15', type: 'math', content: '⭐', label: 'نجمة' },
      { id: 'm_16', type: 'math', content: '💎', label: 'شكل معيني' },
    ]
  }
];
