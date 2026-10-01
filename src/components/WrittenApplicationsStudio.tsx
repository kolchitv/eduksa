import React, { useState } from 'react';
import { 
  WRITTEN_APPLICATIONS_DATA, 
  ApplicationLesson 
} from '../data/writtenApplicationsData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Printer, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Check, 
  X, 
  Award,
  Layers,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface WrittenApplicationsStudioProps {
  studentName?: string;
  onAddStars: (count: number) => void;
  onBackToStudio?: () => void;
}

export const WrittenApplicationsStudio: React.FC<WrittenApplicationsStudioProps> = ({
  studentName = 'بطل لغتي',
  onAddStars,
  onBackToStudio
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(WRITTEN_APPLICATIONS_DATA[0].id);
  const currentLesson = WRITTEN_APPLICATIONS_DATA.find((l) => l.id === selectedLessonId) || WRITTEN_APPLICATIONS_DATA[0];

  // User Answers State
  const [spellingAnswers, setSpellingAnswers] = useState<Record<string, string>>({});
  const [grammarAnswers, setGrammarAnswers] = useState<Record<string, string>>({});
  
  // Checking & Show Solutions State
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  const [score, setScore] = useState<{ spellingScore: number; grammarScore: number; total: number }>({
    spellingScore: 0,
    grammarScore: 0,
    total: 0
  });

  // Print Mode
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setSpellingAnswers({});
    setGrammarAnswers({});
    setIsEvaluated(false);
    setShowSolutions(false);
  };

  const handleSpellingInputChange = (itemId: string, value: string) => {
    setSpellingAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleGrammarInputChange = (key: string, value: string) => {
    setGrammarAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Normalization logic
  const cleanStr = (s: string) =>
    s
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,:؛،?!()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const handleEvaluate = () => {
    let spCorrect = 0;
    currentLesson.spellingExercise.items.forEach((item) => {
      const userAns = spellingAnswers[item.id] || '';
      if (cleanStr(userAns) && cleanStr(item.correctAnswer).includes(cleanStr(userAns))) {
        spCorrect++;
      }
    });

    let grCorrect = 0;
    currentLesson.grammarExercise.items.forEach((item, idx) => {
      const userAns = grammarAnswers[`gr_${idx}`] || '';
      const targetAns = item.correctAnswer || item.category || item.transformed || '';
      if (cleanStr(userAns) && cleanStr(targetAns).includes(cleanStr(userAns))) {
        grCorrect++;
      }
    });

    const totalPossible = currentLesson.spellingExercise.items.length + currentLesson.grammarExercise.items.length;
    const totalCorrect = spCorrect + grCorrect;
    const accuracy = totalPossible > 0 ? totalCorrect / totalPossible : 0;

    setScore({
      spellingScore: spCorrect,
      grammarScore: grCorrect,
      total: totalCorrect
    });
    setIsEvaluated(true);

    if (accuracy >= 0.8) {
      audioManager.playFanfare();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onAddStars(5);
    } else if (accuracy >= 0.5) {
      audioManager.playCorrect();
      onAddStars(3);
    } else {
      audioManager.playWrong();
      onAddStars(1);
    }
  };

  const handleReset = () => {
    setSpellingAnswers({});
    setGrammarAnswers({});
    setIsEvaluated(false);
    setShowSolutions(false);
  };

  return (
    <div className="w-full font-sans pb-12">
      {/* Studio Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-md">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria">
                  دفتر الإملاء والتطبيقات الكتابية
                </h2>
                <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  مرجع مرشدي في اللغة العربية • المستوى 3
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تطبيقات إملائية وكتابية تفاعلية أسبوعية مصححة ذاتياً مع التقييم الفوري وخيار الطباعة المباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {onBackToStudio && (
              <button
                onClick={onBackToStudio}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للمختبر الإملائي</span>
              </button>
            )}

            <button
              onClick={() => setIsPrinting(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="طباعة صفحة من الدفتر كنموذج ورقي"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>طباعة ورقة الدفتر</span>
            </button>
          </div>
        </div>

        {/* Weekly Tabs Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 mb-2">اختر درس الدفتر الأسبوعي:</div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {WRITTEN_APPLICATIONS_DATA.map((lesson) => {
              const isSelected = selectedLessonId === lesson.id;
              const isG4 = lesson.id.startsWith('g4_');
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonChange(lesson.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? isG4 
                        ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-300 scale-102'
                        : 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 scale-102'
                      : isG4
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isG4 && (
                    <span className="bg-amber-400 text-amber-950 text-[9px] px-1.5 py-0.2 rounded-md font-black">
                      المستوى 4 🎯
                    </span>
                  )}
                  <span className="text-[10px] opacity-75">{lesson.week}</span>
                  <span>{lesson.title.split('•')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Lesson Content Container */}
      <div className="space-y-6">
        {/* Lesson Banner Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                {currentLesson.unit}
              </span>
              <span className="text-xs font-medium text-indigo-200">
                {currentLesson.week}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-alexandria">
              {currentLesson.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-indigo-200 mt-2 flex-wrap">
              <span>🎯 ظاهرة الإملاء: {currentLesson.spellingTopic}</span>
              <span>•</span>
              <span>📝 تطبيق التراكيب: {currentLesson.grammarTopic}</span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>{showSolutions ? 'إخفاء الحلول' : 'كشف الحلول النموذجية 💡'}</span>
            </button>

            <button
              onClick={handleEvaluate}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تصحيح التمارين ✅</span>
            </button>
          </div>
        </div>

        {/* Section 1: Spelling Exercise (أنشطة الإملاء من الدفتر) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-indigo-100">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                ١
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 font-alexandria">
                  أولاً: أنشطة الإملاء ({currentLesson.spellingExercise.title})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLesson.spellingExercise.instruction}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              دفتر الإملاء ✏️
            </span>
          </div>

          {/* Exercise Items List */}
          <div className="space-y-3.5">
            {currentLesson.spellingExercise.items.map((item, idx) => {
              const userVal = spellingAnswers[item.id] || '';
              const isMatch = cleanStr(userVal) && cleanStr(item.correctAnswer).includes(cleanStr(userVal));

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEvaluated
                      ? isMatch
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-rose-50/60 border-rose-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-bold text-sm sm:text-base text-slate-900 font-sans">
                      {idx + 1}. {item.sentence}
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-72">
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => handleSpellingInputChange(item.id, e.target.value)}
                        placeholder="اكتب الإجابة..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold focus:outline-none focus:border-indigo-600 transition"
                      />
                      {isEvaluated && (
                        <span>
                          {isMatch ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Solution & Explanation if revealed or evaluated */}
                  {(showSolutions || (isEvaluated && !isMatch)) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs font-bold flex items-start gap-1.5 text-slate-600 animate-in fade-in duration-150">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-emerald-800">الحل النموذجي: </strong>
                        {item.correctAnswer} — <span className="font-normal text-slate-500">{item.explanation}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Grammar & Writing Applications (التطبيقات الكتابية من الدفتر) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-indigo-100">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                ٢
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 font-alexandria">
                  ثانياً: التطبيقات الكتابية ({currentLesson.grammarExercise.title})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLesson.grammarExercise.instruction}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              تطبيقات وتراكيب 📑
            </span>
          </div>

          {/* Exercise Items List */}
          <div className="space-y-3.5">
            {currentLesson.grammarExercise.items.map((item: any, idx: number) => {
              const key = `gr_${idx}`;
              const userVal = grammarAnswers[key] || '';
              const targetAnswer = item.correctAnswer || item.category || item.transformed || '';
              const isMatch = cleanStr(userVal) && cleanStr(targetAnswer).includes(cleanStr(userVal));

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEvaluated
                      ? isMatch
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-rose-50/60 border-rose-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-bold text-sm sm:text-base text-slate-900 font-sans">
                      {idx + 1}. {item.word || item.sentence || item.original || `${item.pronoun} (${item.verb})`}
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-72">
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => handleGrammarInputChange(key, e.target.value)}
                        placeholder="أدخل الحل المناسب..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold focus:outline-none focus:border-indigo-600 transition"
                      />
                      {isEvaluated && (
                        <span>
                          {isMatch ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Solution & Explanation */}
                  {(showSolutions || (isEvaluated && !isMatch)) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs font-bold flex items-start gap-1.5 text-slate-600 animate-in fade-in duration-150">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-emerald-800">الحل النموذجي: </strong>
                        {targetAnswer}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-bold leading-relaxed">
            💡 {currentLesson.grammarExercise.explanation}
          </div>
        </div>

        {/* Evaluation Summary Footer */}
        {isEvaluated && (
          <div className="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black">
                🌟
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 font-alexandria">
                  نتيجة تدريبات {currentLesson.week}: {score.total} منجز صحيح
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  أداء رائع يا {studentName}! تم تدقيق تطبيقات الإملاء والتراكيب النحوية بنجاح.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>

              <button
                onClick={() => {
                  const currIdx = WRITTEN_APPLICATIONS_DATA.findIndex((l) => l.id === selectedLessonId);
                  if (currIdx < WRITTEN_APPLICATIONS_DATA.length - 1) {
                    handleLessonChange(WRITTEN_APPLICATIONS_DATA[currIdx + 1].id);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                <span>الدرس الأسبوعي التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Printable Booklet Page Modal */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 printable-area max-h-[90vh] overflow-y-auto">
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-800">
                  معاينة ورقة الدفتر للطباعة (A4)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  🖨️ طباعة الآن
                </button>
                <button
                  onClick={() => setIsPrinting(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Content mimicking the booklet page */}
            <div className="text-right space-y-6">
              <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-3">
                <div>
                  <h2 className="font-black text-lg text-indigo-950 font-alexandria">
                    المملكة المغربية / المملكة العربية السعودية • دفتر الإملاء والتطبيقات الكتابية
                  </h2>
                  <p className="text-xs text-slate-600 font-bold">
                    مرجع مرشدي في اللغة العربية • {currentLesson.unit} ({currentLesson.week})
                  </p>
                </div>
                <div className="text-left text-xs font-bold text-slate-700">
                  <div>اسم التلميذ(ة): .......................................</div>
                  <div>المؤسسة: .......................................</div>
                  <div>تاريخ اليوم: ..... / ..... / ٢٠٢ مـ</div>
                </div>
              </div>

              {/* Part 1: Spelling */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-300">
                <h4 className="font-black text-sm text-indigo-950 mb-2 border-b border-indigo-200 pb-1">
                  أولاً: الإملاء — {currentLesson.spellingExercise.title}
                </h4>
                <p className="text-xs text-slate-700 mb-3">{currentLesson.spellingExercise.instruction}</p>
                <div className="space-y-2">
                  {currentLesson.spellingExercise.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200 border-dashed">
                      <span>{idx + 1}. {item.sentence}</span>
                      <span className="font-mono text-slate-400">..................................</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2: Grammar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-300">
                <h4 className="font-black text-sm text-indigo-950 mb-2 border-b border-indigo-200 pb-1">
                  ثانياً: التطبيقات الكتابية — {currentLesson.grammarExercise.title}
                </h4>
                <p className="text-xs text-slate-700 mb-3">{currentLesson.grammarExercise.instruction}</p>
                <div className="space-y-2">
                  {currentLesson.grammarExercise.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200 border-dashed">
                      <span>{idx + 1}. {item.word || item.sentence || item.original || `${item.pronoun} (${item.verb})`}</span>
                      <span className="font-mono text-slate-400">..................................</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <div>ملاحظة الأستاذ(ة): ............................................</div>
                <div>النقطة: ( ..... / ١٠ ) ⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
