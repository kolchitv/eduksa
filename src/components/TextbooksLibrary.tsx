import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Layers, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  ExternalLink, 
  BookMarked,
  Search,
  CheckCircle2,
  Volume2,
  Bookmark
} from 'lucide-react';
import { TEXTBOOKS_DATA, Textbook } from '../data/textbooksData';
import { GradeId } from '../types/curriculum';
import { audioManager } from '../utils/audio';

interface TextbooksLibraryProps {
  onSelectGradeAndUnit?: (grade: GradeId, unitNumber: number) => void;
  onNavigateToUnits?: () => void;
}

export const TextbooksLibrary: React.FC<TextbooksLibraryProps> = ({
  onSelectGradeAndUnit,
  onNavigateToUnits
}) => {
  const [selectedBook, setSelectedBook] = useState<Textbook>(TEXTBOOKS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>('all');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);

  const filteredBooks = TEXTBOOKS_DATA.filter(book => {
    const matchesFilter = 
      activeTab === 'all' ? true :
      activeTab === 'g1' ? book.id.includes('g1') :
      activeTab === 'g2' ? book.id.includes('g2') :
      activeTab === 'g3' ? book.id.includes('g3') :
      activeTab === 'g4' ? book.id.includes('g4') :
      activeTab === 'g5' ? book.id.includes('g5') :
      book.id.includes('g6');

    const matchesSearch = 
      searchQuery === '' ||
      book.title.includes(searchQuery) ||
      book.grade.includes(searchQuery) ||
      book.description.includes(searchQuery) ||
      book.units.some(u => u.title.includes(searchQuery) || u.topics.some(t => t.includes(searchQuery)));

    return matchesFilter && matchesSearch;
  });

  const handleReadAloud = (text: string) => {
    audioManager.speakArabic(text);
  };

  const handleJumpToUnit = (book: Textbook, unitNumber: number) => {
    let grade: GradeId = 'grade1';
    if (book.id.includes('g1')) grade = 'grade1';
    else if (book.id.includes('g2')) grade = 'grade2';
    else if (book.id.includes('g3')) grade = 'grade3';
    else if (book.id.includes('g4')) grade = 'grade4';
    else if (book.id.includes('g5')) grade = 'grade5';
    else if (book.id.includes('g6')) grade = 'grade6';

    if (onSelectGradeAndUnit) {
      onSelectGradeAndUnit(grade, unitNumber);
    } else if (onNavigateToUnits) {
      onNavigateToUnits();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-cairo">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-600/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <BookMarked className="w-4 h-4 text-emerald-300" />
            <span>المكتبة الرقمية لكتب لغتي المدرسية الرسمية المعتمدة ١٤٤٦-١٤٤٧هـ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-alexandria text-white">
            قسم كُتُبِ لُغَتِي الْمَدْرَسِيَّةِ التَّفَاعُلِيَّةِ
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            تصفح كتب لغتي المقررة من وزارة التعليم بالمملكة العربية السعودية لصفوف المرحلة الابتدائية (الصفوف الأول، الثاني، الثالث، الرابع، الخامس، والسادس)، وتعرّف على الفهارس الرسمية والوحدات والدروس التفصيلية وأرقام الصفحات لكل وحدة، مع إمكانية الانتقال المباشر للدروس التفاعلية والاستماع الصوتي.
          </p>
          
          {/* Quick Filter Buttons for All Grades */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <button
              id="tb-filter-all"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              جميع الكتب ({TEXTBOOKS_DATA.length})
            </button>
            <button
              id="tb-filter-g1"
              onClick={() => setActiveTab('g1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g1'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف الأول الابتدائي
            </button>
            <button
              id="tb-filter-g2"
              onClick={() => setActiveTab('g2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g2'
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف الثاني الابتدائي
            </button>
            <button
              id="tb-filter-g3"
              onClick={() => setActiveTab('g3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g3'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف الثالث الابتدائي
            </button>
            <button
              id="tb-filter-g4"
              onClick={() => setActiveTab('g4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g4'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف الرابع الابتدائي
            </button>
            <button
              id="tb-filter-g5"
              onClick={() => setActiveTab('g5')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g5'
                  ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف الخامس الابتدائي
            </button>
            <button
              id="tb-filter-g6"
              onClick={() => setActiveTab('g6')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'g6'
                  ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
            >
              الصف السادس الابتدائي
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -left-12 -bottom-12 opacity-10 pointer-events-none">
          <BookOpen className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          id="textbook-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن درس أو وحدة أو عنوان في كتب لغتي (مثل: عدل الملك عبدالعزيز، أخلاق المؤمنين، ليلى والسجادة الحمراء)..."
          className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
      </div>

      {/* Main Grid: Book Cards and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: Books List Cards (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>اختر كتاب لغتي للتصفح:</span>
          </h2>

          <div className="space-y-3">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook.id === book.id;
              return (
                <div
                  key={book.id}
                  id={`textbook-card-${book.id}`}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedUnitIndex(0);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${book.coverColor} text-white flex flex-col items-center justify-center shrink-0 shadow-sm`}>
                      <BookOpen className="w-6 h-6 mb-1" />
                      <span className="text-[9px] font-bold">لغتي</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {book.grade}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {book.semester}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {book.edition}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {book.units.length} وحدات
                        </span>
                        <span>•</span>
                        <span>{book.totalPages} صفحة</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Textbook Viewer (8 cols on lg) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Active Book Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-22 rounded-xl bg-gradient-to-br ${selectedBook.coverColor} text-white flex flex-col items-center justify-center shrink-0 shadow-md`}>
                  <BookOpen className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold">لغتي</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedBook.badge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-alexandria">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {selectedBook.edition}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="read-book-overview-audio-btn"
                  onClick={() => handleReadAloud(`${selectedBook.title}. ${selectedBook.description}`)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="استمع إلى وصف الكتاب"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {selectedBook.description}
            </p>

            {/* Units & Sections of Selected Book */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>فهرس الوحدات والمحتويات في الكتاب:</span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {selectedBook.units.map((unit, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          {unit.number === 0 ? '٠' : unit.number}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {unit.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-700">
                          الصفحات: ص {unit.startPage} - ص {unit.endPage}
                        </span>
                        <button
                          id={`jump-to-unit-${selectedBook.id}-${unit.number}`}
                          onClick={() => handleJumpToUnit(selectedBook, unit.number)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
                        >
                          <span>فتح الوحدة التفاعلية</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Topics */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-600 block mb-2">
                        الدروس والمحتويات الواردة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {unit.topics.map((topic, topicIdx) => (
                          <span 
                            key={topicIdx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 transition-colors"
                          >
                            • {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saudi Ministry Integration Note */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-300" />
                <span>جميع الكتب متوافقة مع أحدث طبعة لوزارة التعليم لعام ١٤٤٦هـ وتغطي كامل معايير مهاراتي والاختبارات الوطنية.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
