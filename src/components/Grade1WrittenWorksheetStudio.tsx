import React, { useState } from 'react';
import { 
  GRADE1_WRITTEN_EXERCISES_DATA, 
  Grade1LetterExercise 
} from '../data/grade1WrittenExercisesData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  CheckCircle2, 
  Volume2, 
  RotateCcw, 
  Printer, 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Star, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Smile,
  Pencil
} from 'lucide-react';

interface Grade1WrittenWorksheetStudioProps {
  studentName?: string;
  onAddStars?: (count: number) => void;
  onBack?: () => void;
}

export const Grade1WrittenWorksheetStudio: React.FC<Grade1WrittenWorksheetStudioProps> = ({
  studentName = 'بطل الصف الأول',
  onAddStars,
  onBack
}) => {
  const [selectedLetterId, setSelectedLetterId] = useState<string>(GRADE1_WRITTEN_EXERCISES_DATA[0].id);
  const currentExercise = GRADE1_WRITTEN_EXERCISES_DATA.find((e) => e.id === selectedLetterId) || GRADE1_WRITTEN_EXERCISES_DATA[0];

  // User input states
  const [mergedInputs, setMergedInputs] = useState<Record<string, string>>({});
  const [syllableCounts, setSyllableCounts] = useState<Record<string, number>>({});
  const [sentenceBuilt, setSentenceBuilt] = useState<string[]>([]);
  const [selectedWordsWithLetter, setSelectedWordsWithLetter] = useState<Record<string, boolean>>({});

  // Feedback states
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const cleanStr = (s: string) =>
    (s || '')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,:؛،?!()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const handleSelectLetter = (letterId: string) => {
    setSelectedLetterId(letterId);
    setMergedInputs({});
    setSyllableCounts({});
    setSentenceBuilt([]);
    setSelectedWordsWithLetter({});
    setIsEvaluated(false);
    setShowSolutionModal(false);
  };

  const handleToggleSentenceWord = (word: string) => {
    audioManager.play('click');
    if (sentenceBuilt.includes(word)) {
      setSentenceBuilt((prev) => prev.filter((w) => w !== word));
    } else {
      setSentenceBuilt((prev) => [...prev, word]);
    }
  };

  const handleEvaluate = () => {
    setIsEvaluated(true);
    let score = 0;

    // 1) Syllables merge
    currentExercise.syllableMerge.forEach((item, idx) => {
      const user = mergedInputs[`merge_${idx}`] || '';
      if (cleanStr(user) === cleanStr(item.result)) {
        score += 2;
      }
    });

    // 2) Syllables count
    currentExercise.syllableBreakdown.forEach((item, idx) => {
      const user = syllableCounts[`count_${idx}`];
      if (user === item.syllableCount) {
        score += 2;
      }
    });

    // 3) Sentence ordering
    if (currentExercise.sentenceOrdering.length > 0) {
      const expected = cleanStr(currentExercise.sentenceOrdering[0].correctSentence);
      const user = cleanStr(sentenceBuilt.join(' '));
      if (user === expected) {
        score += 4;
      }
    }

    if (score >= 6) {
      audioManager.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onAddStars?.(5);
    } else {
      audioManager.playCorrect();
      onAddStars?.(3);
    }
  };

  const handleReset = () => {
    setMergedInputs({});
    setSyllableCounts({});
    setSentenceBuilt([]);
    setSelectedWordsWithLetter({});
    setIsEvaluated(false);
  };

  return (
    <div className="w-full font-sans pb-16">
      {/* Studio Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-500 text-white flex items-center justify-center text-3xl font-black shadow-md border-2 border-amber-300">
              ✏️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200">
                  كراسة التمارين الكتابية • المستوى الأول 🎒
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200">
                  إعداد: عيسى باعوش • المدرسة الرقمية 📘
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria mt-1">
                كراسة التمارين الكتابية للسنة الأولى من التعليم الابتدائي
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                أنشطة تفاعلية مشوقة لجميع حروف الهجاء: دمج المقاطع، تقطيع الكلمات، ترتيب الجمل، مع النطق الصوتي والطباعة A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة</span>
              </button>
            )}

            <button
              onClick={() => setShowSolutionModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>الحل النموذجي 💡</span>
            </button>

            <button
              onClick={() => setIsPrinting(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>طباعة ورقة الحرف A4</span>
            </button>
          </div>
        </div>

        {/* Letters Carousel Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 mb-2">
            <span>اختر الحرف للتطبيق من الكراسة (28 حرفاً):</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              الصفحة {currentExercise.pageNumber} من الكراسة
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {GRADE1_WRITTEN_EXERCISES_DATA.map((item) => {
              const isSelected = selectedLetterId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectLetter(item.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="text-sm">{item.drawingEmoji}</span>
                  <span className="text-base font-alexandria font-black">{item.letter}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({item.featuredDrawing})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Letter Exercise Container */}
      <div className="space-y-6">
        {/* Letter Hero Card */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <div className="w-18 h-18 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-5xl font-black border-2 border-white/40 shadow-inner">
              {currentExercise.letter}
            </div>
            <div>
              <span className="bg-white/20 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1">
                كراسة التمارين • ص {currentExercise.pageNumber}
              </span>
              <h3 className="text-2xl font-black font-alexandria">
                {currentExercise.letterName} — {currentExercise.featuredDrawing} {currentExercise.drawingEmoji}
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                تطبيقات كتابية منهجية لتعزيز الوعي الصوتي ومهارة الكتابة والتركيب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => audioManager.speakArabic(`${currentExercise.letterName}، ${currentExercise.featuredDrawing}`, 0.85)}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-amber-50 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>استمع لنطق الحرف 🔊</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Activity 1: أجمع المقاطع وأكتب كلمة مفيدة */}
        {/* ------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm">
                ١
              </span>
              <h4 className="font-black text-base text-slate-900 font-alexandria">
                أَجْمَعُ الْمَقَاطِعَ وَأَكْتُبُ كَلِمَةً مُفِيدَةً:
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              دمج مقاطع الحرف ({currentExercise.letter})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentExercise.syllableMerge.map((item, idx) => {
              const key = `merge_${idx}`;
              const userVal = mergedInputs[key] || '';
              const isMatch = cleanStr(userVal) === cleanStr(item.result);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEvaluated
                      ? isMatch
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-rose-50/70 border-rose-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.syllables.map((syl, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => audioManager.speakArabic(syl, 0.8)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 hover:border-amber-400 text-slate-900 font-black text-sm shadow-2xs cursor-pointer active:scale-95"
                          title="استمع للمقطع"
                        >
                          {syl}
                        </button>
                      ))}
                      <span className="text-slate-400 font-black">➔</span>
                    </div>

                    <button
                      onClick={() => audioManager.speakArabic(item.result, 0.85)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      title="استمع للكلمة كاملة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userVal}
                      onChange={(e) => setMergedInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder="اكتب الكلمة مجمعة..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-900 focus:outline-none focus:border-amber-500"
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

                  {isEvaluated && !isMatch && (
                    <div className="text-xs font-bold text-rose-600 mt-2">
                      الصواب: {item.result} ({item.meaning})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Activity 2: تقطيع الكلمات وحساب عدد المقاطع */}
        {/* ------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-900 flex items-center justify-center font-black text-sm">
                ٢
              </span>
              <h4 className="font-black text-base text-slate-900 font-alexandria">
                أُجَزِّئُ الْكَلِمَاتِ إِلَى مَقَاطِعَ وَأُحَدِّدُ عَدَدَهَا:
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              الوعي الصوتي والتقطيع
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentExercise.syllableBreakdown.map((item, idx) => {
              const key = `count_${idx}`;
              const userCount = syllableCounts[key];
              const isCorrect = userCount === item.syllableCount;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isEvaluated
                      ? isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-rose-50/70 border-rose-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    <button
                      onClick={() => audioManager.speakArabic(item.word, 0.85)}
                      className="text-slate-400 hover:text-amber-600 transition"
                      title="استمع للكلمة"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xl font-black text-slate-900 font-sans mb-2">
                    {item.word}
                  </div>

                  {/* Syllables visual blocks */}
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    {item.parts.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-black text-slate-500 block mb-2">
                    كم عدد مقاطع الكلمة؟
                  </span>

                  {/* Syllable count buttons: 1, 2, 3, 4 */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          audioManager.play('click');
                          setSyllableCounts((prev) => ({ ...prev, [key]: num }));
                        }}
                        className={`w-9 h-9 rounded-xl text-sm font-black transition cursor-pointer ${
                          userCount === num
                            ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {isEvaluated && (
                    <div className="text-xs font-bold mt-2">
                      {isCorrect ? (
                        <span className="text-emerald-700">✅ إجابة صحيحة ({item.syllableCount} مقاطع)</span>
                      ) : (
                        <span className="text-rose-600">الصحيح: {item.syllableCount} مقاطع</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Activity 3: أرتب الكلمات لأكتب جملة مفيدة */}
        {/* ------------------------------------------------------------------- */}
        {currentExercise.sentenceOrdering.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center font-black text-sm">
                  ٣
                </span>
                <h4 className="font-black text-base text-slate-900 font-alexandria">
                  أُرَتِّبُ الْكَلِمَاتِ لأَكْتُبَ جُمْلَةً مُفِيدَةً:
                </h4>
              </div>
              <span className="text-xl">
                {currentExercise.sentenceOrdering[0].meaningEmoji}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                اضغط على الكلمات بالترتيب الصحيح لتكوين الجملة المفيدة:
              </p>

              {/* Shuffled Word Chips */}
              <div className="flex items-center justify-center gap-2.5 flex-wrap p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {currentExercise.sentenceOrdering[0].wordsShuffled.map((word, wIdx) => {
                  const isUsed = sentenceBuilt.includes(word);
                  return (
                    <button
                      key={wIdx}
                      onClick={() => handleToggleSentenceWord(word)}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer shadow-xs ${
                        isUsed
                          ? 'bg-slate-200 text-slate-400 opacity-60'
                          : 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-slate-300 hover:border-amber-400 active:scale-95'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {/* Result Area */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 min-h-16 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {sentenceBuilt.length === 0 ? (
                    <span className="text-xs font-bold text-slate-400">
                      اضغط على الكلمات لتظهر هنا بالترتيب...
                    </span>
                  ) : (
                    sentenceBuilt.map((w, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleToggleSentenceWord(w)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-slate-900 text-sm font-black shadow-xs cursor-pointer hover:bg-rose-50"
                        title="اضغط للإزالة"
                      >
                        {w} ✕
                      </span>
                    ))
                  )}
                </div>

                {sentenceBuilt.length > 0 && (
                  <button
                    onClick={() => setSentenceBuilt([])}
                    className="text-xs text-rose-600 hover:underline font-bold shrink-0"
                  >
                    تفريغ
                  </button>
                )}
              </div>

              {isEvaluated && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
                  {cleanStr(sentenceBuilt.join(' ')) === cleanStr(currentExercise.sentenceOrdering[0].correctSentence) ? (
                    <span className="text-emerald-700 font-black">
                      🎉 أحسنت صنعاً! الجملة مرتبة بشكل تام: «{currentExercise.sentenceOrdering[0].correctSentence}»
                    </span>
                  ) : (
                    <span className="text-rose-600">
                      الترتيب الصحيح هو: «{currentExercise.sentenceOrdering[0].correctSentence}»
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* Activity 4: تمييز الكلمات التي تشتمل على الحرف */}
        {/* ------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center font-black text-sm">
                ٤
              </span>
              <h4 className="font-black text-base text-slate-900 font-alexandria">
                أُحَدِّدُ الْكَلِمَاتِ الَّتِي تَمَّ فِيهَا اسْتِعْمَالُ ({currentExercise.letterName}):
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              تمييز بصري وصوتي
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {currentExercise.wordsWithLetter.map((item, idx) => {
              const isChecked = selectedWordsWithLetter[item.word] || false;
              const isSuccess = isEvaluated && isChecked === item.hasLetter;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    audioManager.play('click');
                    setSelectedWordsWithLetter((prev) => ({ ...prev, [item.word]: !prev[item.word] }));
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                    isChecked
                      ? 'border-amber-500 bg-amber-50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="font-black text-base text-slate-900 block font-sans mb-1">
                    {item.word}
                  </span>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${
                      isChecked ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isChecked ? 'مختارة ✓' : 'اختر'}
                  </span>

                  {isEvaluated && (
                    <div className="text-[10px] font-black mt-1.5">
                      {item.hasLetter ? (
                        <span className="text-emerald-700">تشتمل على الحرف</span>
                      ) : (
                        <span className="text-slate-400">لا تشتمل</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Sticky Evaluation Toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-300 flex items-center gap-3">
        <button
          onClick={handleEvaluate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>تصحيح أنشطة الحرف ✅</span>
        </button>

        <button
          onClick={handleReset}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </button>
      </div>

      {/* Model Answer Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 font-alexandria">
                  الحل النموذجي — {currentExercise.letterName} (ص {currentExercise.pageNumber})
                </h3>
              </div>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h5 className="font-black text-sm text-amber-950 mb-2">١) دمج المقاطع:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  {currentExercise.syllableMerge.map((m, idx) => (
                    <li key={idx}>
                      {m.syllables.join(' + ')} ➔ <strong className="text-amber-900">{m.result}</strong> ({m.meaning})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                <h5 className="font-black text-sm text-orange-950 mb-2">٢) عدد المقاطع:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  {currentExercise.syllableBreakdown.map((b, idx) => (
                    <li key={idx}>
                      {b.word}: {b.parts.join(' / ')} (<strong>{b.syllableCount} مقاطع</strong>)
                    </li>
                  ))}
                </ul>
              </div>

              {currentExercise.sentenceOrdering.length > 0 && (
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                  <h5 className="font-black text-sm text-rose-950 mb-2">٣) الجملة المرتبة:</h5>
                  <p className="text-rose-900 font-black text-sm">
                    «{currentExercise.sentenceOrdering[0].correctSentence}»
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet Modal for Grade 1 Booklet */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 printable-area max-h-[90vh] overflow-y-auto">
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base text-slate-800">
                  معاينة ورقة الكراسة للطباعة A4 — {currentExercise.letterName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer shadow-xs"
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

            {/* Printable Booklet Page Content */}
            <div className="text-right space-y-6">
              <div className="flex items-center justify-between border-b-2 border-amber-900 pb-3">
                <div>
                  <h2 className="font-black text-lg text-amber-950 font-alexandria">
                    كراسة التمارين الكتابية للسنة الأولى من التعليم الابتدائي
                  </h2>
                  <p className="text-xs text-slate-600 font-bold">
                    إعداد: عيسى باعوش • {currentExercise.letterName} (الصفحة {currentExercise.pageNumber})
                  </p>
                </div>
                <div className="text-left text-xs font-bold text-slate-700">
                  <div>اسم التلميذ(ة): .......................................</div>
                  <div>القسم: الأول ( ... )</div>
                  <div>تاريخ اليوم: ..... / ..... / ٢٠٢ مـ</div>
                </div>
              </div>

              {/* Exercise 1 */}
              <div className="border border-slate-300 p-4 rounded-xl">
                <h4 className="font-black text-xs text-slate-900 mb-2">
                  ١ - أجمع المقاطع وأكتب كلمة مفيدة:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {currentExercise.syllableMerge.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                      <span>{m.syllables.join(' / ')} ➔</span>
                      <span className="font-mono text-slate-400">............................</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 2 */}
              <div className="border border-slate-300 p-4 rounded-xl">
                <h4 className="font-black text-xs text-slate-900 mb-2">
                  ٢ - أجزأ الكلمات إلى مقاطع وأكتب عددها:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {currentExercise.syllableBreakdown.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                      <span>{b.word} ➔</span>
                      <span className="font-mono text-slate-400">[ ... ] مقاطع</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 3 */}
              {currentExercise.sentenceOrdering.length > 0 && (
                <div className="border border-slate-300 p-4 rounded-xl">
                  <h4 className="font-black text-xs text-slate-900 mb-2">
                    ٣ - أرتب الكلمات لأكتب جملة مفيدة:
                  </h4>
                  <p className="text-xs text-slate-700 mb-2">
                    ({currentExercise.sentenceOrdering[0].wordsShuffled.join(' - ')})
                  </p>
                  <div className="font-mono text-slate-400 pt-1 border-t border-slate-200">
                    ................................................................................................
                  </div>
                </div>
              )}

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
