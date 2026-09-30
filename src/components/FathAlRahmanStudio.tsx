import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  Layers, 
  Award, 
  Star, 
  Search, 
  Compass, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  RotateCcw
} from 'lucide-react';
import { 
  FATH_GRADE_SECTIONS, 
  FATH_ALRAHMAN_ITEMS, 
  FathItem, 
  FathGradeSection 
} from '../data/fathAlRahmanReadingData';
import { audioManager } from '../utils/audio';

interface FathAlRahmanStudioProps {
  onAddStars?: (count: number) => void;
  initialGrade?: 'all' | 'kg' | 'grade1' | 'grade2' | 'grade3' | 'upper_grades';
}

export const FathAlRahmanStudio: React.FC<FathAlRahmanStudioProps> = ({
  onAddStars,
  initialGrade = 'all'
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'kg' | 'grade1' | 'grade2' | 'grade3' | 'upper_grades'>(initialGrade);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'syllable' | 'word' | 'sentence' | 'text'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteredItems, setMasteredItems] = useState<Record<string, boolean>>({});
  const [activeItemModal, setActiveItemModal] = useState<FathItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return FATH_ALRAHMAN_ITEMS.filter((item) => {
      const matchGrade = selectedGrade === 'all' || item.gradeLevel === selectedGrade;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        item.text.includes(searchQuery.trim()) ||
        item.skillLabel.includes(searchQuery.trim()) ||
        (item.explanation && item.explanation.includes(searchQuery.trim())) ||
        (item.quranSurah && item.quranSurah.includes(searchQuery.trim()));
      return matchGrade && matchCategory && matchSearch;
    });
  }, [selectedGrade, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredItems.length;
    const syllables = filteredItems.filter(i => i.category === 'syllable').length;
    const words = filteredItems.filter(i => i.category === 'word').length;
    const sentences = filteredItems.filter(i => i.category === 'sentence').length;
    const texts = filteredItems.filter(i => i.category === 'text').length;
    const masteredCount = Object.keys(masteredItems).filter(k => masteredItems[k]).length;
    return { total, syllables, words, sentences, texts, masteredCount };
  }, [filteredItems, masteredItems]);

  const handleSpeak = (text: string) => {
    // Remove Quranic signs or brackets for speech if present
    const clean = text.replace(/[\(\)\[\]\*]/g, '').trim();
    audioManager.speakArabic(clean, 0.85);
  };

  const handleToggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredItems(prev => {
      const updated = !prev[id];
      if (updated && onAddStars) {
        onAddStars(2);
      }
      return { ...prev, [id]: updated };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-xl border border-emerald-500/30 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                <span>مستخرج كتاب: فَتْحُ الرَّحْمَنِ فِي تَعْلِيمِ كَلِمَاتِ القُرْآنِ</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/10">
                سلسلة الفتح الرباني • مصنف لكل صف دراسي
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-alexandria tracking-tight">
              معمل الطلاقة والانطلاق القرائي الشامل 📖
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              تم استخراج وتصنيف جميع المقاطع الصوتية، الكلمات، الجمل، والنصوص القرآنية الكاملة من كتاب فتح الرحمن؛ لتناسب كل مرحلة وصف دراسي من الروضة وحتى المرحلة المتوسطة، مع نطق صوتي فوري وتدريبات تهجي تفاعلية.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة مذكرة القراءة</span>
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-black flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>المتقن: {stats.masteredCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Selector Tabs (معينات الصفوف) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>اختر الصف الدراسي لعرض المنهج والمهارات المناسبة له:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`p-3 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${
              selectedGrade === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <span>🌐 جميع الصفوف</span>
            <span className="text-[10px] opacity-75 font-normal">منهج متكامل</span>
          </button>

          {FATH_GRADE_SECTIONS.map((sec) => {
            const isSelected = selectedGrade === sec.gradeId;
            return (
              <button
                key={sec.gradeId}
                onClick={() => setSelectedGrade(sec.gradeId)}
                className={`p-3 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer text-center ${
                  isSelected
                    ? `bg-gradient-to-br ${sec.colorTheme} text-white border-transparent shadow-md ring-2 ring-emerald-500/30`
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                <span>{sec.gradeTitle}</span>
                <span className="text-[10px] opacity-75 font-normal line-clamp-1">{sec.skillsCovered[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Grade Overview Card (عند اختيار صف محدد) */}
      {selectedGrade !== 'all' && (() => {
        const sec = FATH_GRADE_SECTIONS.find(s => s.gradeId === selectedGrade);
        if (!sec) return null;
        return (
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
              <div>
                <h4 className="text-base font-black text-emerald-900">{sec.gradeTitle} — {sec.gradeSubtitle}</h4>
                <p className="text-xs text-emerald-800 mt-0.5">{sec.description}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 shrink-0">
                <span className="bg-white/80 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {sec.wordsCount} كلمة
                </span>
                <span className="bg-white/80 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {sec.sentencesCount} جملة
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-emerald-900">أبرز المهارات المستخرجة:</span>
              {sec.skillsCovered.map((sk, idx) => (
                <span key={idx} className="text-[11px] font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Filter by Category & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">التصنيف:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'syllable', label: '🧩 المقاطع الصوتية' },
            { id: 'word', label: '📖 الكلمات' },
            { id: 'sentence', label: '💬 الجمل' },
            { id: 'text', label: '📜 النصوص والآيات' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كلمة، مهارة، أو سورة..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all text-right"
          />
        </div>
      </div>

      {/* Grid of Extracted Content Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>المحتوى المعروض ({filteredItems.length} عنصر):</span>
          <span>اضغط على أي بطاقة لسماع النطق الفصيح 🔊</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredItems.map((item) => {
            const isMastered = !!masteredItems[item.id];
            const isText = item.category === 'text';
            const isSentence = item.category === 'sentence';

            return (
              <div
                key={item.id}
                onClick={() => handleSpeak(item.text)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer group hover:shadow-md relative flex flex-col justify-between ${
                  isText
                    ? 'sm:col-span-2 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/50 border-amber-200'
                    : isSentence
                    ? 'sm:col-span-2 bg-slate-50 hover:bg-white border-slate-200'
                    : 'bg-white hover:border-emerald-400 border-slate-200'
                } ${isMastered ? 'ring-2 ring-emerald-400/50 bg-emerald-50/30' : ''}`}
              >
                {/* Card Top: Badges & Bookmark */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {item.gradeName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.skillLabel}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleMastered(item.id, e)}
                    title={isMastered ? 'تم إتقانها' : 'تحديد كمتقنة'}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      isMastered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Center: Main Arabic Text */}
                <div className="py-2 text-center space-y-1">
                  <span className={`font-black font-amiri leading-relaxed block text-slate-900 group-hover:text-emerald-700 transition-colors ${
                    isText ? 'text-lg sm:text-xl' : isSentence ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                  }`}>
                    {item.text}
                  </span>

                  {item.explanation && (
                    <p className="text-[11px] text-slate-500 font-bold leading-normal">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>

                {/* Card Bottom: Surah Reference / Audio button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="font-bold text-amber-700">
                    {item.quranSurah || (item.pageNumber ? `صـ ${item.pageNumber}` : '')}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(item.text);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">لا توجد عناصر مطابقة لبحثك في هذا القسم</p>
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              إعادة ضبط جميع معايير البحث
            </button>
          </div>
        )}
      </div>

      {/* Pedagogical Methodology Summary (منهجية فتح الرحمن في التدريس والانطلاق) */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-black font-alexandria">
            منهجية وتوجيهات كتاب «فتح الرحمن» للمعلمين وأولياء الأمور
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="font-black text-amber-300 block">١. التهجي التراكمي:</span>
            <p>
              ينطق المتعلم الحرف الأول بمفرده، ثم الثاني بمفرده، ثم يجمعهما معاً (أَ + حَ = أَحَ)، ثم ينطق الثالث بمفرده (دَ)، ثم ينطق الكلمة كاملة (أَحَدَ)، حتى يتحول للتهجي البصري المباشر.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="font-black text-emerald-300 block">٢. المقارنة الصوتية الفورية:</span>
            <p>
              المقارنة بين الحركات القصيرة والمدود الطويلة (بَ / بَا - بِ / بِي - بُ / بُو)، والمقارنة بين الحروف المرققة والمفخمة (تَرَ / طَرَ - سَبَقَ / صَبَرَ) لمنع خلط مخارج الحروف.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="font-black text-sky-300 block">٣. الانطلاق القرائي والوصل:</span>
            <p>
              التدريب المستمر على جمل الوصل وإسقاط همزة الوصل والمد عند التقاء الساكنين (شَقَقْنَا ٱلْأَرْضَ - عَمِلُوا۟ ٱلصَّالِحَاتِ) وصولاً للطلاقة الكاملة في قراءة نصوص القرآن واللغة العربية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
