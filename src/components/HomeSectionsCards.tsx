import React from 'react';
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Award, 
  Image as ImageIcon, 
  FileText, 
  Printer, 
  Music, 
  ShieldCheck, 
  Trophy,
  Zap,
  Check,
  Library,
  Star,
  Flame,
  ArrowRight,
  Edit3,
  Gamepad2
} from 'lucide-react';
import { TabType } from './Header';
import { audioManager } from '../utils/audio';

interface SectionCardItem {
  id: TabType;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ElementType;
  accentBorderColor: string; // Tailored bottom border color matching user reference
  iconBgColor: string;      // Soft circular background
  iconTextColor: string;    // Icon vivid color
  hoverBorderColor: string;
  bgGlow: string;
}

interface HomeSectionsCardsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  studentName?: string;
  stars?: number;
  completedQuizzesCount?: number;
  className?: string;
}

export const HomeSectionsCards: React.FC<HomeSectionsCardsProps> = ({
  activeTab,
  onSelectTab,
  studentName = 'فهد',
  stars = 35,
  completedQuizzesCount = 1,
  className = ''
}) => {
  // 12 core sections arranged into clean rows of 4 cards each (3 full rows on desktop)
  const sections: SectionCardItem[] = [
    {
      id: 'units',
      title: 'الوحدات والمناهج',
      subtitle: 'الدروس والنصوص التفاعلية',
      badge: 'الأساس',
      icon: BookOpen,
      accentBorderColor: 'border-b-blue-600',
      iconBgColor: 'bg-blue-50',
      iconTextColor: 'text-blue-600',
      hoverBorderColor: 'hover:border-blue-400',
      bgGlow: 'hover:bg-blue-50/20'
    },
    {
      id: 'reading_path',
      title: 'مسار القراءة',
      subtitle: 'الفهم والطلاقة القرائية',
      badge: '٤ مسارات',
      icon: Compass,
      accentBorderColor: 'border-b-purple-600',
      iconBgColor: 'bg-purple-50',
      iconTextColor: 'text-purple-600',
      hoverBorderColor: 'hover:border-purple-400',
      bgGlow: 'hover:bg-purple-50/20'
    },
    {
      id: 'foundation',
      title: 'معمل التأسيس وفتح الرحمن',
      subtitle: 'الحروف والهجاء وكلمات القرآن للطلاقة والانطلاق',
      badge: 'فتح الرحمن 📖',
      icon: Sparkles,
      accentBorderColor: 'border-b-emerald-600',
      iconBgColor: 'bg-emerald-50',
      iconTextColor: 'text-emerald-600',
      hoverBorderColor: 'hover:border-emerald-400',
      bgGlow: 'hover:bg-emerald-50/20'
    },
    {
      id: 'learning_games',
      title: 'ألعاب التأسيس',
      subtitle: 'رحلة تعلم متدرجة وممتعة لمهارات القراءة',
      badge: 'جديد 🎮',
      icon: Gamepad2,
      accentBorderColor: 'border-b-purple-600',
      iconBgColor: 'bg-purple-50',
      iconTextColor: 'text-purple-600',
      hoverBorderColor: 'hover:border-purple-400',
      bgGlow: 'hover:bg-purple-50/20'
    },
    {
      id: 'spelling',
      title: 'أبطال الإملاء',
      subtitle: 'الإملاء المنظور والمسموع وتحديات الظواهر',
      badge: 'تحديات 👑',
      icon: Edit3,
      accentBorderColor: 'border-b-amber-500',
      iconBgColor: 'bg-amber-50',
      iconTextColor: 'text-amber-600',
      hoverBorderColor: 'hover:border-amber-400',
      bgGlow: 'hover:bg-amber-50/20'
    },
    {
      id: 'kg',
      title: 'رياض الأطفال',
      subtitle: 'المستوى الأول والثاني',
      badge: 'تمهيدي',
      icon: GraduationCap,
      accentBorderColor: 'border-b-amber-500',
      iconBgColor: 'bg-amber-50',
      iconTextColor: 'text-amber-600',
      hoverBorderColor: 'hover:border-amber-400',
      bgGlow: 'hover:bg-amber-50/20'
    },
    {
      id: 'quiz',
      title: 'بنك التقييمات',
      subtitle: 'ألعاب التحدي ونجوم التميز',
      badge: 'اختبارات',
      icon: Zap,
      accentBorderColor: 'border-b-rose-500',
      iconBgColor: 'bg-rose-50',
      iconTextColor: 'text-rose-600',
      hoverBorderColor: 'hover:border-rose-400',
      bgGlow: 'hover:bg-rose-50/20'
    },
    {
      id: 'dictionary',
      title: 'المعجم البصري',
      subtitle: 'كلمات مصورة وناطقة',
      badge: 'ناطق',
      icon: ImageIcon,
      accentBorderColor: 'border-b-teal-500',
      iconBgColor: 'bg-teal-50',
      iconTextColor: 'text-teal-600',
      hoverBorderColor: 'hover:border-teal-400',
      bgGlow: 'hover:bg-teal-50/20'
    },
    {
      id: 'summaries',
      title: 'ملخصات ومطويات',
      subtitle: 'مذكرات المراجعة المركزة',
      badge: 'مذكرات',
      icon: FileText,
      accentBorderColor: 'border-b-indigo-600',
      iconBgColor: 'bg-indigo-50',
      iconTextColor: 'text-indigo-600',
      hoverBorderColor: 'hover:border-indigo-400',
      bgGlow: 'hover:bg-indigo-50/20'
    },
    {
      id: 'worksheets',
      title: 'أوراق العمل',
      subtitle: 'توليد وطباعة أوراق التدريب',
      badge: 'PDF',
      icon: Printer,
      accentBorderColor: 'border-b-orange-500',
      iconBgColor: 'bg-orange-50',
      iconTextColor: 'text-orange-600',
      hoverBorderColor: 'hover:border-orange-400',
      bgGlow: 'hover:bg-orange-50/20'
    },
    {
      id: 'books',
      title: 'مكتبة المقررات',
      subtitle: 'المناهج والكتب المعتمدة',
      badge: 'الكتب',
      icon: Library,
      accentBorderColor: 'border-b-sky-600',
      iconBgColor: 'bg-sky-50',
      iconTextColor: 'text-sky-600',
      hoverBorderColor: 'hover:border-sky-400',
      bgGlow: 'hover:bg-sky-50/20'
    },
    {
      id: 'songs',
      title: 'الأناشيد المدرسية',
      subtitle: 'أناشيد مقررات لغتي بالصوت',
      badge: 'استماع',
      icon: Music,
      accentBorderColor: 'border-b-pink-500',
      iconBgColor: 'bg-pink-50',
      iconTextColor: 'text-pink-600',
      hoverBorderColor: 'hover:border-pink-400',
      bgGlow: 'hover:bg-pink-50/20'
    },
    {
      id: 'support_plans',
      title: 'الخطط العلاجية والمراجعة',
      subtitle: 'مراجعة منتصف العام الشاملة وبرامج الدعم',
      badge: 'جديد 🌟',
      icon: ShieldCheck,
      accentBorderColor: 'border-b-emerald-700',
      iconBgColor: 'bg-emerald-50',
      iconTextColor: 'text-emerald-700',
      hoverBorderColor: 'hover:border-emerald-400',
      bgGlow: 'hover:bg-emerald-50/20'
    },
    {
      id: 'achievements',
      title: 'لوحة الإنجازات',
      subtitle: 'الشهادات والنجوم والكؤوس',
      badge: 'كؤوس',
      icon: Trophy,
      accentBorderColor: 'border-b-yellow-500',
      iconBgColor: 'bg-yellow-50',
      iconTextColor: 'text-yellow-600',
      hoverBorderColor: 'hover:border-yellow-400',
      bgGlow: 'hover:bg-yellow-50/20'
    }
  ];

  const handleCardClick = (id: TabType) => {
    audioManager.play('click');
    onSelectTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`relative ${className} pb-12`}>
      {/* Background Hero Banner - Royal Blue matching user reference */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 pt-7 pb-16 sm:pb-20 px-4 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-300 font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مرحباً يا بطل {studentName}! 🌟</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-alexandria text-white leading-tight">
              أهلاً بك في منصة لغتي التعليمية
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 mt-2 max-w-2xl leading-relaxed">
              اختر القسم الذي تريد استكشافه اليوم، كل قسم منظم ومخصص لتتعلم بسهولة ومرح دون أي تشتت!
            </p>
          </div>

          {/* Child's Progress Badges */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shrink-0 shadow-lg">
            <div className="flex items-center gap-2 bg-amber-400/20 px-3.5 py-2 rounded-xl border border-amber-300/30">
              <span className="text-xl">⭐</span>
              <div>
                <span className="text-[10px] text-amber-200 block font-bold">رصيد النجوم</span>
                <span className="text-base font-black text-amber-300">{stars} نجمة</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-400/20 px-3.5 py-2 rounded-xl border border-emerald-300/30">
              <span className="text-xl">🎯</span>
              <div>
                <span className="text-[10px] text-emerald-200 block font-bold">تحديات منجزة</span>
                <span className="text-base font-black text-emerald-300">{completedQuizzesCount}</span>
              </div>
            </div>

            <button
              onClick={() => handleCardClick('achievements')}
              className="px-3 py-2 rounded-xl bg-white text-blue-900 font-black text-xs hover:bg-blue-50 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              شهاداتي 🎖️
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Cards: Exactly 4 columns on large screens, 3 on tablets, 2 on phones - No horizontal scroll */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20">
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5"
          style={{ direction: 'rtl' }}
        >
          {sections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={`group relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer border-b-[5px] ${
                  item.accentBorderColor
                } shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${
                  isActive
                    ? 'ring-3 ring-blue-600 shadow-xl bg-blue-50/20'
                    : 'border-t border-l border-r border-slate-100 hover:border-slate-200'
                } ${item.bgGlow}`}
              >
                {/* Circular Icon Container matching user mockup */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${item.iconBgColor} ${item.iconTextColor} flex items-center justify-center mb-3.5 transition-transform duration-200 group-hover:scale-110 shadow-xs`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </div>

                {/* Section Title */}
                <h3 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg font-alexandria group-hover:text-blue-700 transition-colors line-clamp-1">
                  {item.title}
                </h3>

                {/* Section Subtitle */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium leading-relaxed">
                  {item.subtitle}
                </p>

                {/* Micro Action Button */}
                <div className="mt-3.5 w-full pt-3 border-t border-slate-100 flex items-center justify-between">
                  {item.badge ? (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  ) : <span />}

                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                    <span>دخول</span>
                    <span className="group-hover:-translate-x-1 transition-transform">◀</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Motivational Footer Note */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h4 className="font-black text-sm text-emerald-950 font-alexandria">
                ابدأ رحلة التعلم الذكية خطوة بخطوة
              </h4>
              <p className="text-xs text-emerald-800">
                كل قسم مصمم ومفصول بالكامل لمساعدة الطفل على التركيز وإتقان مهارات القراءة والكتابة بدون أي تشتت.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCardClick('reading_path')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>انطلق في مسار القراءة اليوم</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
