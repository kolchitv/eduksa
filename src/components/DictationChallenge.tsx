import React, { useState, useEffect, useRef } from 'react';
import { 
  DICTATION_CHALLENGE_WORDS, 
  SPELLING_TIERS_CONFIG, 
  DictationWordItem, 
  SpellingTier 
} from '../data/spellingChampionsData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Star, 
  Trophy, 
  Lightbulb, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Award,
  Zap,
  Repeat,
  Check,
  Printer
} from 'lucide-react';

interface DictationChallengeProps {
  studentName?: string;
  onAddStars: (count: number) => void;
  initialTier?: SpellingTier;
  onBackToStudio?: () => void;
  onOpenCertificate?: () => void;
}

export const DictationChallenge: React.FC<DictationChallengeProps> = ({
  studentName = 'بطل لغتي',
  onAddStars,
  initialTier = 'standard',
  onBackToStudio,
  onOpenCertificate
}) => {
  const [selectedTier, setSelectedTier] = useState<SpellingTier>(initialTier);
  const [sessionWords, setSessionWords] = useState<DictationWordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [studentInput, setStudentInput] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [listenCount, setListenCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Evaluation State
  const [evaluationState, setEvaluationState] = useState<'waiting' | 'correct' | 'incorrect'>('waiting');
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalStarsWon, setTotalStarsWon] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState<{
    item: DictationWordItem;
    studentAnswer: string;
    isCorrect: boolean;
  }[]>([]);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(SPELLING_TIERS_CONFIG[initialTier].audioSpeed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filter words by tier and pick a shuffled round of 10 words
  const startNewRound = (tier: SpellingTier) => {
    const tierWords = DICTATION_CHALLENGE_WORDS.filter((w) => w.tier === tier);
    const shuffled = [...tierWords].sort(() => Math.random() - 0.5);
    const roundList = shuffled.slice(0, 10);

    setSessionWords(roundList);
    setCurrentIndex(0);
    setStudentInput('');
    setListenCount(0);
    setShowHint(false);
    setEvaluationState('waiting');
    setRoundHistory([]);
    setIsRoundFinished(false);
    setAudioSpeed(SPELLING_TIERS_CONFIG[tier].audioSpeed);

    // Auto focus and auto speak first word after short delay
    setTimeout(() => {
      if (roundList.length > 0) {
        speakWord(roundList[0], SPELLING_TIERS_CONFIG[tier].audioSpeed);
      }
      inputRef.current?.focus();
    }, 400);
  };

  // On mount or when tier changes
  useEffect(() => {
    startNewRound(selectedTier);
  }, [selectedTier]);

  const currentWordItem: DictationWordItem | undefined = sessionWords[currentIndex];

  const speakWord = (item?: DictationWordItem, speed?: number) => {
    const target = item || currentWordItem;
    if (!target) return;

    setIsPlayingAudio(true);
    setListenCount((prev) => prev + 1);

    const actualSpeed = speed !== undefined ? speed : audioSpeed;
    audioManager.speakArabic(target.word, actualSpeed)
      .finally(() => {
        setIsPlayingAudio(false);
      });
  };

  const handleSlowListen = () => {
    if (!currentWordItem) return;
    speakWord(currentWordItem, 0.6); // Extra slow syllable speed
  };

  // Normalization logic for checking
  const normalizeInput = (text: string, strictHarakat: boolean = false): string => {
    let result = text.trim();
    if (!strictHarakat) {
      result = result
        .replace(/[\u064B-\u065F\u0670]/g, '') // remove harakat
        .replace(/[إأآا]/g, 'ا') // normalize alef
        .replace(/ة/g, 'ه') // flexible taa marboota
        .replace(/ى/g, 'ي');
    }
    return result
      .replace(/[.,:؛،?!]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCheckWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWordItem || !studentInput.trim() || evaluationState !== 'waiting') return;

    const isStrict = selectedTier === 'advanced';
    const normTarget = normalizeInput(currentWordItem.word, isStrict);
    const normStudent = normalizeInput(studentInput, isStrict);

    const isMatch = normStudent === normTarget;

    if (isMatch) {
      // Correct!
      setEvaluationState('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const starsToAdd = showHint ? 1 : 2;
      setTotalStarsWon((prev) => prev + starsToAdd);
      onAddStars(starsToAdd);

      audioManager.playCorrect();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });

      setRoundHistory((prev) => [
        ...prev,
        { item: currentWordItem, studentAnswer: studentInput, isCorrect: true }
      ]);
    } else {
      // Incorrect!
      setEvaluationState('incorrect');
      setStreak(0);
      audioManager.playWrong();

      setRoundHistory((prev) => [
        ...prev,
        { item: currentWordItem, studentAnswer: studentInput, isCorrect: false }
      ]);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < sessionWords.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setStudentInput('');
      setListenCount(0);
      setShowHint(false);
      setEvaluationState('waiting');

      setTimeout(() => {
        if (sessionWords[nextIdx]) {
          speakWord(sessionWords[nextIdx]);
        }
        inputRef.current?.focus();
      }, 300);
    } else {
      // Finished Round!
      setIsRoundFinished(true);
      audioManager.playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRetryCurrentWord = () => {
    setEvaluationState('waiting');
    setStudentInput('');
    inputRef.current?.focus();
    speakWord();
  };

  // Keyboard toolbar insert
  const handleInsertChar = (char: string) => {
    if (evaluationState !== 'waiting') return;
    audioManager.play('click');
    setStudentInput((prev) => prev + char);
    inputRef.current?.focus();
  };

  const currentTierConfig = SPELLING_TIERS_CONFIG[selectedTier];
  const correctCount = roundHistory.filter((r) => r.isCorrect).length;

  return (
    <div className="w-full font-sans">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-xs border border-amber-300">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria">
                  تحدي الإملاء الصوتي السريع
                </h2>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  تقييم فوري 🎯
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                استمع إلى الكلمة بدقة واكتبها، واحصل على تصحيح فوري مع الشرح الإملائي المتكامل
              </p>
            </div>
          </div>

          {/* Stats Badges: Streak & Stars */}
          <div className="flex items-center gap-2.5">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-black shadow-2xs">
              <Flame className={`w-4 h-4 text-orange-500 ${streak > 0 ? 'animate-bounce' : ''}`} />
              <span>السلسلة: {streak}</span>
            </div>

            {/* Stars Won */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-black shadow-2xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>+{totalStarsWon} نجمة</span>
            </div>

            {/* Back button to text studio if callback provided */}
            {onBackToStudio && (
              <button
                onClick={onBackToStudio}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>نصوص الإملاء</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tier Selector Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-400 pl-1 shrink-0">اختر الفئة:</span>
            {(['support', 'standard', 'advanced'] as SpellingTier[]).map((tierKey) => {
              const cfg = SPELLING_TIERS_CONFIG[tierKey];
              const isSelected = selectedTier === tierKey;

              return (
                <button
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? tierKey === 'support'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : tierKey === 'standard'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Restart Round Button */}
          <button
            onClick={() => startNewRound(selectedTier)}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="بدء جولة جديدة بكلمات مختلفة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>جولة جديدة (١٠ كلمات)</span>
          </button>
        </div>
      </div>

      {/* Main Challenge Game Body */}
      {!isRoundFinished && currentWordItem ? (
        <div className="space-y-6">
          {/* Progress Bar & Word Counter */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                {currentIndex + 1}
              </span>
              <span>الكلمة {currentIndex + 1} من {sessionWords.length}</span>
              <span className="text-[10px] text-slate-400">• {currentWordItem.targetSkill}</span>
            </div>

            {/* Visual Progress Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {sessionWords.map((_, idx) => {
                const historyItem = roundHistory[idx];
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                      idx === currentIndex
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-110'
                        : historyItem
                        ? historyItem.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {historyItem ? (historyItem.isCorrect ? '✓' : '✕') : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Speaker Card */}
          <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 text-center relative overflow-hidden">
            <div className="max-w-md mx-auto flex flex-col items-center">
              
              {/* Category & Skill Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${currentTierConfig.badgeBg}`}>
                  {currentWordItem.categoryName}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  🎯 {currentWordItem.targetSkill}
                </span>
              </div>

              {/* Big Animated Speaker Button */}
              <div className="relative my-3">
                {isPlayingAudio && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
                )}
                <button
                  id="dictation-listen-main-btn"
                  onClick={() => speakWord()}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all cursor-pointer active:scale-95 group ${
                    isPlayingAudio
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 ring-4 ring-emerald-300 scale-105'
                      : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-teal-500'
                  }`}
                  title="استمع إلى الكلمة المطلوبة"
                >
                  <Volume2 className={`w-10 h-10 transition-transform group-hover:scale-110 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span className="text-[10px] font-black mt-1">انقر للاستماع</span>
                </button>
              </div>

              {/* Secondary Audio Controls (Slow listen, Replay Count) */}
              <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
                <button
                  onClick={handleSlowListen}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  title="استمع بنطق مقطعي بطيء لمساعدتك"
                >
                  <span>🐢 استماع متمهل (0.6x)</span>
                </button>

                <button
                  onClick={() => speakWord(currentWordItem, 0.9)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  title="إعادة نطق الكلمة بالسرعة الطبيعية"
                >
                  <Repeat className="w-3.5 h-3.5 text-slate-500" />
                  <span>تكرار (استمعت {listenCount} مرات)</span>
                </button>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                    showHint
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white hover:bg-amber-50 text-slate-600 border-slate-300'
                  }`}
                  title="كشف تلميح إملائي للكلمة"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showHint ? 'إخفاء التلميح' : 'تلميح'}</span>
                </button>
              </div>

              {/* Hint Box if revealed */}
              {showHint && (
                <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs font-bold text-amber-950 animate-in fade-in duration-150 flex items-center gap-2 text-right">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>تلميح إملائي: {currentWordItem.hint}</span>
                </div>
              )}
            </div>
          </div>

          {/* Typing Input Card & Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-200">
            <form onSubmit={handleCheckWord} className="max-w-xl mx-auto space-y-4">
              <label
                htmlFor="dictation-input-field"
                className="block text-sm font-black text-slate-800 text-center"
              >
                ✍️ اكتب الكلمة التي سمعتها يا {studentName}:
              </label>

              {/* Input Field */}
              <div className="relative">
                <input
                  id="dictation-input-field"
                  ref={inputRef}
                  type="text"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  disabled={evaluationState !== 'waiting'}
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="اكتب الكلمة هنا..."
                  className={`w-full py-4 px-6 rounded-2xl text-2xl sm:text-3xl text-center font-bold font-sans transition-all border-2 focus:outline-none ${
                    evaluationState === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-100'
                      : evaluationState === 'incorrect'
                      ? 'bg-rose-50 border-rose-500 text-rose-900 ring-4 ring-rose-100'
                      : 'bg-slate-50 border-slate-300 focus:border-emerald-600 focus:bg-white text-slate-900'
                  }`}
                />

                {/* Instant Check Indicator if evaluated */}
                {evaluationState === 'correct' && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                )}
                {evaluationState === 'incorrect' && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500">
                    <XCircle className="w-7 h-7" />
                  </div>
                )}
              </div>

              {/* Virtual Tashkeel & Diacritics Toolbar */}
              {evaluationState === 'waiting' && (
                <div className="p-2.5 bg-slate-100/90 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1.5 px-1">
                    <span>لوحة الحركات والهمزات المساعدة:</span>
                    <span className="text-[10px] text-slate-400">انقر للإدراج</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {[
                      { label: 'َ (فتحة)', char: 'َ' },
                      { label: 'ُ (ضمة)', char: 'ُ' },
                      { label: 'ِ (كسرة)', char: 'ِ' },
                      { label: 'ْ (سكون)', char: 'ْ' },
                      { label: 'ّ (شدة)', char: 'ّ' },
                      { label: 'ً (تنوين فتح)', char: 'ً' },
                      { label: 'ٌ (تنوين ضم)', char: 'ٌ' },
                      { label: 'ٍ (تنوين كسر)', char: 'ٍ' },
                      { label: 'أ', char: 'أ' },
                      { label: 'إ', char: 'إ' },
                      { label: 'آ', char: 'آ' },
                      { label: 'ء', char: 'ء' },
                      { label: 'ئ', char: 'ئ' },
                      { label: 'ؤ', char: 'ؤ' },
                      { label: 'ة', char: 'ة' },
                      { label: 'ـ', char: 'ـ' }
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertChar(btn.char)}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-300 rounded-lg text-sm font-bold shadow-2xs transition-all active:scale-90 cursor-pointer"
                        title={btn.label}
                      >
                        {btn.char}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Check Word OR Proceed */}
              <div className="pt-2 flex items-center justify-center gap-3">
                {evaluationState === 'waiting' ? (
                  <button
                    type="submit"
                    disabled={!studentInput.trim()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تحقق من الكلمة ✅</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-3 flex-wrap">
                    {evaluationState === 'incorrect' && (
                      <button
                        type="button"
                        onClick={handleRetryCurrentWord}
                        className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>إعادة محاولة الكلمة</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNextWord}
                      className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <span>الكلمة التالية ➡️</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Instant Evaluation Feedback Card */}
            {evaluationState !== 'waiting' && (
              <div
                className={`mt-6 p-5 rounded-2xl border-2 transition-all animate-in fade-in zoom-in-95 duration-200 text-right ${
                  evaluationState === 'correct'
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {evaluationState === 'correct' ? '🎉' : '💡'}
                    </span>
                    <h4 className="text-base font-black font-alexandria">
                      {evaluationState === 'correct'
                        ? 'إجابة صحيحة ومتقنة! أحسنت يا بطل'
                        : 'إجابة تحتاج تصحيحاً، قارن بين الكلمتين:'}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                    {evaluationState === 'correct' ? '+2 نجمة ⭐' : '0 نجمة'}
                  </span>
                </div>

                {/* Side by Side Word Comparison */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-around gap-4 text-center my-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">الكلمة الصحيحة المطلوبة</span>
                    <span className="text-2xl font-black text-emerald-700 font-sans tracking-wide">
                      {currentWordItem.word}
                    </span>
                  </div>
                  <div className="text-slate-300 font-bold text-xl">↔️</div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">ما كتبته أنت</span>
                    <span
                      className={`text-2xl font-black font-sans tracking-wide ${
                        evaluationState === 'correct' ? 'text-emerald-700' : 'text-rose-600 line-through'
                      }`}
                    >
                      {studentInput}
                    </span>
                  </div>
                </div>

                {/* Pedagogical Rule Explanation */}
                <div className="text-xs font-bold leading-relaxed flex items-start gap-2 pt-1 text-slate-700">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">القاعدة الإملائية: </strong>
                    {currentWordItem.explanation}
                  </span>
                </div>

                {currentWordItem.exampleSentence && (
                  <div className="text-[11px] text-slate-500 mt-1 pr-6 italic">
                    مثال سياقي: «{currentWordItem.exampleSentence}»
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : isRoundFinished ? (
        /* Round Completed Summary Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-4 border-emerald-400 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-lg mx-auto mb-4 border-2 border-amber-300">
            🏆
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-alexandria mb-2">
            اكتمل تحدي الإملاء بنجاح!
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            تهانينا يا <span className="font-extrabold text-emerald-800">{studentName}</span>، لقد أتممت جولة الكلمات الصوتية في {currentTierConfig.name}!
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-emerald-600">{correctCount} / {sessionWords.length}</div>
              <div className="text-[11px] font-bold text-slate-500">كلمات صحيحة</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-orange-500">{bestStreak} 🔥</div>
              <div className="text-[11px] font-bold text-slate-500">أعلى سلسلة</div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-amber-500">+{totalStarsWon} ⭐</div>
              <div className="text-[11px] font-bold text-slate-500">نجوم مكتسبة</div>
            </div>
          </div>

          {/* Review of Words in this Round */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-right mb-6">
            <h4 className="text-xs font-black text-slate-700 mb-3">سجل كلمات الجولة:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {roundHistory.map((h, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    h.isCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : 'bg-rose-50 text-rose-950 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{h.isCorrect ? '✅' : '❌'}</span>
                    <span className="font-bold font-sans text-sm">{h.item.word}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{h.item.targetSkill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Round Actions */}
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <button
              onClick={() => startNewRound(selectedTier)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>جولة جديدة بنفس الفئة</span>
            </button>

            {selectedTier === 'support' && (
              <button
                onClick={() => setSelectedTier('standard')}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>الانتقال للفئة المتوسطة 🚀</span>
              </button>
            )}

            {selectedTier === 'standard' && (
              <button
                onClick={() => setSelectedTier('advanced')}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>تحدي الفرسان المتميزين 🏆</span>
              </button>
            )}

            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>عرض شهادة التميز</span>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
