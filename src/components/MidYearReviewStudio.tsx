import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Award, 
  Trophy, 
  Star, 
  Play, 
  Flame,
  Search,
  Check
} from 'lucide-react';
import { 
  MIDYEAR_LETTERS_GRID, 
  MIDYEAR_WORDS_COLUMNS, 
  MidYearLetterItem, 
  MidYearColumn 
} from '../data/midYearReviewData';
import { audioManager } from '../utils/audio';

interface MidYearReviewStudioProps {
  onAddStar?: () => void;
}

export const MidYearReviewStudio: React.FC<MidYearReviewStudioProps> = ({
  onAddStar
}) => {
  const [activeSheet, setActiveSheet] = useState<'sheet1_letters' | 'sheet2_words'>('sheet1_letters');
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');
  const [readWords, setReadWords] = useState<Record<string, boolean>>({});
  const [searchLetter, setSearchLetter] = useState<string>('');

  const handleSpeak = (text: string, rate: number = 0.8) => {
    audioManager.speakArabic(text, rate);
  };

  const handleMarkWordRead = (wordKey: string, wordText: string) => {
    if (!readWords[wordKey]) {
      setReadWords(prev => ({ ...prev, [wordKey]: true }));
      audioManager.play('correct');
      if (onAddStar) onAddStar();
    }
    handleSpeak(wordText, 0.75);
  };

  // Filter letters
  const filteredLetters = searchLetter.trim()
    ? MIDYEAR_LETTERS_GRID.filter(l => l.letter.includes(searchLetter.trim()) || l.name.includes(searchLetter.trim()))
    : MIDYEAR_LETTERS_GRID;

  // Filter columns for Sheet 2
  const filteredColumns = selectedColumnFilter === 'all'
    ? MIDYEAR_WORDS_COLUMNS
    : MIDYEAR_WORDS_COLUMNS.filter(c => c.id === selectedColumnFilter);

  const totalWordsCount = MIDYEAR_WORDS_COLUMNS.reduce((acc, col) => acc + col.words.length, 0);
  const masteredCount = Object.keys(readWords).length;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 sm:p-8 space-y-6" style={{ direction: 'rtl' }}>
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950 text-amber-300 shadow-xs">
                مراجعة إجازة منتصف العام • الصف الأول
              </span>
              <span className="text-xs text-amber-100 font-bold">
                إعداد: أ. سليمان بن عجاج العنزي
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              حَقِيبَةُ الْمُرَاجَعَةِ وَالْخُطَّةِ الْعِلَاجِيَّةِ الشَّامِلَةِ 🌟
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-2xl leading-relaxed">
              المذكرة المعتمدة لإتقان أصوات الحروف الـ ٢٨ القصيرة والطويلة، وبنك الـ ١٢٠ كلمة وجملة للانطلاق والطلاقة القرائية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-orange-50 font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-orange-600" />
              <span>طباعة الورقة (PDF)</span>
            </button>
          </div>
        </div>

        {/* Mastered Words Counter Pill */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-orange-200">الكلمات والجمل المتقنة:</span>
            <span className="font-black text-amber-200 text-sm">
              {masteredCount} من {totalWordsCount} كلمة وجملة
            </span>
          </div>

          <div className="flex items-center gap-1 font-bold text-orange-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>انقر على أي حرف أو كلمة للاستماع الصوتي الفوري!</span>
          </div>
        </div>
      </div>

      {/* Sheet Tabs Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSheet('sheet1_letters')}
          className={`py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSheet === 'sheet1_letters'
              ? 'bg-white text-amber-900 shadow-md border border-amber-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-lg">🔤</span>
          <span>الورقة ١: أَقْرَأُ الْحُرُوفَ بِأَصْوَاتِهَا الْقَصِيرَةِ وَالطَّوِيلَةِ</span>
        </button>

        <button
          onClick={() => setActiveSheet('sheet2_words')}
          className={`py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSheet === 'sheet2_words'
              ? 'bg-white text-rose-900 shadow-md border border-rose-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-lg">📖</span>
          <span>الورقة ٢: أَقْرَأُ الْكَلِمَاتِ وَالْجُمَلَ (١٢٠ كلمة وجملة)</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* SHEET 1: LETTERS SHORT & LONG VOWELS GRID            */}
      {/* ==================================================== */}
      {activeSheet === 'sheet1_letters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg font-alexandria">
                جدول الحروف الـ ٢٨ (الصوت القصير والصوت الطويل)
              </h3>
              <p className="text-xs text-slate-500">
                اللون الأصفر للصوت القصير (ـَ ، ـِ ، ـُ)، واللون السماوي للصوت الطويل (ألف المد، ياء المد، واو المد)
              </p>
            </div>

            {/* Quick Letter Search */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLetter}
                onChange={(e) => setSearchLetter(e.target.value)}
                placeholder="ابحث عن حرف..."
                className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Letter Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLetters.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs hover:border-amber-400 transition-all text-center flex flex-col"
              >
                {/* Letter Header */}
                <div className="bg-slate-900 text-white py-2 px-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">حرف {item.name}</span>
                  <button
                    onClick={() => handleSpeak(`${item.letter} بأصواتها: ${item.short.fatha}، ${item.short.kasra}، ${item.short.damma}. والمدود: ${item.long.alif}، ${item.long.yaa}، ${item.long.waw}`)}
                    className="p-1 rounded-md hover:bg-white/20 text-white transition-colors"
                    title="نطق الحرف بجميع أصواته"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-200" />
                  </button>
                </div>

                {/* Short Vowels Row (Yellow / Amber) */}
                <div className="bg-[#fff9db] border-b-2 border-amber-200/80 p-2.5">
                  <span className="text-[10px] font-black text-amber-900 block mb-1">الصوت القصير</span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleSpeak(item.short.fatha, 0.75)}
                      className="py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="فتحة"
                    >
                      {item.short.fatha}
                    </button>
                    <button
                      onClick={() => handleSpeak(item.short.kasra, 0.75)}
                      className="py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="كسرة"
                    >
                      {item.short.kasra}
                    </button>
                    <button
                      onClick={() => handleSpeak(item.short.damma, 0.75)}
                      className="py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="ضمة"
                    >
                      {item.short.damma}
                    </button>
                  </div>
                </div>

                {/* Long Vowels Row (Cyan / Sky) */}
                <div className="bg-[#e7f5ff] p-2.5 flex-1 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-sky-900 block mb-1">الصوت الطويل (المدود)</span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleSpeak(item.long.alif, 0.75)}
                      className="py-1 rounded-lg bg-sky-200/70 hover:bg-sky-300 text-sky-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="مد ألف"
                    >
                      {item.long.alif}
                    </button>
                    <button
                      onClick={() => handleSpeak(item.long.yaa, 0.75)}
                      className="py-1 rounded-lg bg-sky-200/70 hover:bg-sky-300 text-sky-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="مد ياء"
                    >
                      {item.long.yaa}
                    </button>
                    <button
                      onClick={() => handleSpeak(item.long.waw, 0.75)}
                      className="py-1 rounded-lg bg-sky-200/70 hover:bg-sky-300 text-sky-950 font-black text-xl font-serif transition-transform active:scale-95 cursor-pointer shadow-2xs"
                      title="مد واو"
                    >
                      {item.long.waw}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SHEET 2: WORDS & SENTENCES 10 COLUMNS                */}
      {/* ==================================================== */}
      {activeSheet === 'sheet2_words' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg font-alexandria">
                أَقْرَأُ الْكَلِمَاتِ وَالْجُمَلَ (الأعمدة العشرة المعتمدة)
              </h3>
              <p className="text-xs text-slate-500">
                انقر على أي كلمة للاستماع لنطقها واحتسابها ضمن رصيدك من الكلمات المتقنة!
              </p>
            </div>

            {/* Column Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                onClick={() => setSelectedColumnFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedColumnFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                جميع الأعمدة (١٠)
              </button>
              {MIDYEAR_WORDS_COLUMNS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColumnFilter(col.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedColumnFilter === col.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredColumns.map((col) => (
              <div
                key={col.id}
                className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-3.5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Column Header */}
                  <div className="pb-2.5 mb-2.5 border-b border-slate-200 text-center">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 mb-1 inline-block">
                      {col.badge}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 font-alexandria line-clamp-1">
                      {col.title}
                    </h4>
                  </div>

                  {/* Word List */}
                  <div className="space-y-1.5">
                    {col.words.map((word, wIdx) => {
                      const wordKey = `${col.id}_${wIdx}`;
                      const isMastered = !!readWords[wordKey];
                      return (
                        <button
                          key={wIdx}
                          onClick={() => handleMarkWordRead(wordKey, word)}
                          className={`w-full py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-between group active:scale-95 ${
                            isMastered
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black'
                              : 'bg-white hover:bg-orange-50/70 border-slate-200 hover:border-orange-300 text-slate-900 font-bold'
                          }`}
                        >
                          <span className="text-base sm:text-lg font-alexandria">
                            {word}
                          </span>

                          <span className="shrink-0">
                            {isMastered ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400 text-center font-bold">
                  {col.words.length} مفردات
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
