import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Star, 
  RotateCcw, 
  BookOpen, 
  Check, 
  Play,
  Layers,
  Send,
  ExternalLink
} from 'lucide-react';
import { 
  GRADE1_READING_SKILLS_ACTIVITIES, 
  ReadingSkillActivity 
} from '../data/grade1ReadingSkillsActivitiesData';
import { audioManager } from '../utils/audio';

interface Grade1ReadingSkillsActivitiesStudioProps {
  onBack?: () => void;
  onAddStar?: () => void;
}

export const Grade1ReadingSkillsActivitiesStudio: React.FC<Grade1ReadingSkillsActivitiesStudioProps> = ({
  onBack,
  onAddStar
}) => {
  const [activeActivityIndex, setActiveActivityIndex] = useState<number>(0);
  const [readWords, setReadWords] = useState<Record<string, boolean>>({});
  const [autoPlayIndex, setAutoPlayIndex] = useState<number | null>(null);

  const currentActivity = GRADE1_READING_SKILLS_ACTIVITIES[activeActivityIndex] || GRADE1_READING_SKILLS_ACTIVITIES[0];

  const handleSpeak = (text: string, rate: number = 0.8) => {
    audioManager.speakArabic(text, rate);
  };

  const handleWordClick = (word: string, wordKey: string) => {
    handleSpeak(word, 0.75);
    if (!readWords[wordKey]) {
      setReadWords(prev => ({ ...prev, [wordKey]: true }));
      audioManager.play('correct');
      if (onAddStar) onAddStar();
    }
  };

  const handlePlayAllWords = () => {
    let idx = 0;
    const words = currentActivity.words;
    
    const playNext = () => {
      if (idx < words.length) {
        setAutoPlayIndex(idx);
        handleSpeak(words[idx], 0.75);
        idx++;
        setTimeout(playNext, 1300);
      } else {
        setAutoPlayIndex(null);
      }
    };
    playNext();
  };

  const totalMasteredWords = Object.keys(readWords).length;
  const currentActivityMastered = currentActivity.words.filter((_, idx) => readWords[`${currentActivity.id}_${idx}`]).length;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 sm:p-8 space-y-6" style={{ direction: 'rtl' }}>
      {/* Studio Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950 text-amber-300 shadow-xs">
                أنشطة قرائية للمهارات الأساسية • الصف الأول
              </span>
              <a 
                href="https://t.me/weeed2030" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-sky-200 hover:text-white font-bold flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 transition-colors"
              >
                <span>إعداد: علوة السهيمي</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              الأَنْشِطَةُ الْقِرَائِيَّةُ لِلْمَهَارَاتِ الأَسَاسِيَّةِ 📚
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl leading-relaxed">
              ١١ نشاطاً قرائياً شاملاً (١٦٥ كلمة) تغطي حركات الفتح والكسر والضم، المدود، السكون، التنوين، الشدة، والـ الشمسية والقمرية، والتاءات.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>طباعة البطاقة (PDF)</span>
            </button>
          </div>
        </div>

        {/* Status Counter */}
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-sky-200">الكلمات المتقنة في هذا النشاط:</span>
            <span className="font-black text-amber-300 text-sm">
              {currentActivityMastered} من {currentActivity.words.length} كلمة
            </span>
            <span className="text-white/60">•</span>
            <span className="text-sky-200">المجموع الكلي:</span>
            <span className="font-black text-white text-sm">
              {totalMasteredWords} ⭐
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>انقر على أي بطاقة لسماع النطق واحتسابها ضمن رصيدك!</span>
          </div>
        </div>
      </div>

      {/* Activities Horizontal Tab Selector (11 Activities) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {GRADE1_READING_SKILLS_ACTIVITIES.map((act, idx) => {
          const isSelected = activeActivityIndex === idx;
          return (
            <button
              key={act.id}
              onClick={() => {
                setActiveActivityIndex(idx);
                audioManager.play('click');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-sky-400 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
              }`}>
                {act.pageNumber - 1}
              </span>
              <span>{act.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Main Active Activity Card */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-slate-300 space-y-6">
        {/* Activity Title Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
              {currentActivity.pageNumber - 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base sm:text-xl font-alexandria">
                  {currentActivity.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                  {currentActivity.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentActivity.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAllWords}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>استماع لكل الكلمات 🔊</span>
            </button>
          </div>
        </div>

        {/* 15 Words Grid (Matching 5 Rows × 3 Columns from original PDF) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {currentActivity.words.map((word, wIdx) => {
            const wordKey = `${currentActivity.id}_${wIdx}`;
            const isMastered = !!readWords[wordKey];
            const isPlayingNow = autoPlayIndex === wIdx;

            return (
              <button
                key={wIdx}
                onClick={() => handleWordClick(word, wordKey)}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer relative group flex items-center justify-between active:scale-95 shadow-2xs ${
                  isPlayingNow
                    ? 'border-indigo-500 bg-indigo-100/80 ring-2 ring-indigo-400 scale-[1.03]'
                    : isMastered
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-sky-50/70 hover:border-sky-300 text-slate-900'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-alexandria tracking-wide flex-1 text-center py-1">
                  {word}
                </span>

                <span className="shrink-0 p-1">
                  {isMastered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Activity Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              if (activeActivityIndex > 0) {
                setActiveActivityIndex(prev => prev - 1);
                audioManager.play('click');
              }
            }}
            disabled={activeActivityIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>النشاط السابق</span>
          </button>

          <span className="text-xs font-black text-slate-500">
            النشاط {activeActivityIndex + 1} من {GRADE1_READING_SKILLS_ACTIVITIES.length}
          </span>

          <button
            onClick={() => {
              if (activeActivityIndex < GRADE1_READING_SKILLS_ACTIVITIES.length - 1) {
                setActiveActivityIndex(prev => prev + 1);
                audioManager.play('click');
              }
            }}
            disabled={activeActivityIndex === GRADE1_READING_SKILLS_ACTIVITIES.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>النشاط التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
