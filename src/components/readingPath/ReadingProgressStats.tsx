import React from 'react';
import { 
  Award, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Layers,
  RotateCcw,
  Printer
} from 'lucide-react';
import { StudentReadingRecord, ReadingTextItem } from '../../types/readingPath';
import { READING_LEVEL_INFO } from '../../data/readingPathData';

interface ReadingProgressStatsProps {
  records: Record<string, StudentReadingRecord>;
  allTexts: ReadingTextItem[];
  studentName: string;
  onResetProgress?: () => void;
  onSelectTextToRead?: (text: ReadingTextItem) => void;
}

export const ReadingProgressStats: React.FC<ReadingProgressStatsProps> = ({
  records,
  allTexts,
  studentName,
  onResetProgress,
  onSelectTextToRead
}) => {
  const allRecordList = Object.values(records) as StudentReadingRecord[];
  const completedRecords = allRecordList.filter(r => r.completed);
  const totalCompleted = completedRecords.length;

  // Calculate Average Comprehension
  const avgComprehension = totalCompleted > 0
    ? Math.round(completedRecords.reduce((acc: number, r: StudentReadingRecord) => acc + (r.comprehensionScore || 0), 0) / totalCompleted)
    : 0;

  // Calculate Average Speed / WPM
  const avgWpm = totalCompleted > 0
    ? Math.round(completedRecords.reduce((acc: number, r: StudentReadingRecord) => acc + (r.wpm || 0), 0) / totalCompleted)
    : 0;

  // Calculate Total Stars
  const totalStars = completedRecords.reduce((acc: number, r: StudentReadingRecord) => acc + (r.fluencyStars || 0), 0);

  // Determine current active level
  let currentActiveLevel = 1;
  for (let l = 1; l <= 6; l++) {
    const levelTexts = allTexts.filter(t => t.level === l);
    const completedInLevel = levelTexts.filter(t => records[t.id]?.completed).length;
    if (completedInLevel === levelTexts.length && levelTexts.length > 0) {
      currentActiveLevel = Math.min(6, l + 1);
    } else {
      currentActiveLevel = l;
      break;
    }
  }

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Banner Stats */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  لوحة إنجازات وطلاقة القراءة
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  الطالب: {studentName}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
                المستوى الحالي في مسار القراءة: {currentActiveLevel} ({READING_LEVEL_INFO[currentActiveLevel]?.title.split('—')[1] || ''})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>طباعة التقرير</span>
            </button>
            {onResetProgress && (
              <button
                onClick={onResetProgress}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="تصفير السجل للتدريب مجدداً"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>النصوص المكتملة</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              {totalCompleted} <span className="text-xs text-slate-400 font-normal">/ {allTexts.length}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>متوسط الفهم القرائي</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-alexandria text-amber-300">
              {avgComprehension}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-xs text-sky-300 font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>سرعة القراءة (WPM)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-alexandria text-sky-300">
              {avgWpm} <span className="text-xs text-slate-400 font-normal">كلمة/دقيقة</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-xs text-yellow-300 font-bold mb-1">
              <Star className="w-4 h-4" />
              <span>مؤشر الطلاقة والنجوم</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-alexandria text-yellow-300 flex items-center gap-1">
              <span>{totalStars}</span>
              <span className="text-sm">⭐</span>
            </p>
          </div>
        </div>
      </div>

      {/* Levels Progress Cards (1 to 6) */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black font-alexandria text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>تدرّج المستويات الستة وإتقان القراءة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const info = READING_LEVEL_INFO[lvl];
            const levelTexts = allTexts.filter(t => t.level === lvl);
            const completedCount = levelTexts.filter(t => records[t.id]?.completed).length;
            const isFinished = levelTexts.length > 0 && completedCount === levelTexts.length;
            const isCurrent = currentActiveLevel === lvl;

            return (
              <div
                key={lvl}
                className={`p-5 rounded-3xl border transition-all ${
                  isFinished
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : isCurrent
                    ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-2xl">{info.icon}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                    isFinished
                      ? 'bg-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isFinished ? '✅ مكتمل' : isCurrent ? '📍 جاري التدريب' : 'قيد الانتظار'}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 font-alexandria mb-1">
                  {info.title}
                </h4>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {info.subtitle}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>نسبة الإنجاز:</span>
                    <span>{completedCount} من {levelTexts.length} نصوص</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full bg-gradient-to-r ${info.badgeColor}`}
                      style={{ width: `${levelTexts.length > 0 ? (completedCount / levelTexts.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {info.targetDescription}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Reading Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-black text-slate-900 font-alexandria flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>سجل قراءات الطالب التفصيلي</span>
          </h4>
          <span className="text-xs font-bold text-slate-500">
            {completedRecords.length} نصوص مسجلة
          </span>
        </div>

        {completedRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold">لم يكتمل أي نص بعد.</p>
            <p className="text-xs text-slate-400 mt-1">ابدأ الآن باختيار نص من مكتبة النصوص والانطلاق في القراءة!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {allTexts
              .filter(t => records[t.id]?.completed)
              .map((text) => {
                const rec = records[text.id];
                return (
                  <div key={text.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        لـ {text.level}
                      </span>
                      <div>
                        <h5 className="text-sm font-black text-slate-900">
                          {text.title}
                        </h5>
                        <div className="flex items-center gap-2.5 text-[11px] text-slate-500 mt-0.5">
                          <span>⏱️ {rec.bestDurationSec} ثانية</span>
                          <span>•</span>
                          <span>🚀 {rec.wpm} كلمة/د</span>
                          <span>•</span>
                          <span>🎯 فهم: {rec.comprehensionScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: rec.fluencyStars || 5 }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>

                      {onSelectTextToRead && (
                        <button
                          onClick={() => onSelectTextToRead(text)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          إعادة القراءة
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
