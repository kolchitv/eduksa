import React, { useState, useEffect, useRef } from 'react';
import { 
  SPELLING_CHAMPIONS_DATA, 
  SPELLING_TIERS_CONFIG, 
  SpellingPassage, 
  SpellingTier 
} from '../data/spellingChampionsData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Volume2, 
  Eye, 
  EyeOff, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star, 
  Printer, 
  HelpCircle, 
  Lightbulb, 
  Lock, 
  Unlock, 
  Trophy, 
  Flame, 
  BookOpen, 
  Share2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface SpellingChampionsStudioProps {
  studentName?: string;
  onAddStars: (count: number) => void;
  onOpenCertificate?: () => void;
  onBackToHome?: () => void;
  initialTier?: SpellingTier;
}

type DictationMode = 'manthoor' | 'ekhtibari';

export const SpellingChampionsStudio: React.FC<SpellingChampionsStudioProps> = ({
  studentName = 'بطل لغتي',
  onAddStars,
  onOpenCertificate,
  onBackToHome,
  initialTier = 'standard'
}) => {
  // Tier and Lesson State
  const [selectedTier, setSelectedTier] = useState<SpellingTier>(initialTier);
  const [currentMode, setCurrentMode] = useState<DictationMode>('manthoor');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('');
  
  // Game & Timer State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTextHidden, setIsTextHidden] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(SPELLING_TIERS_CONFIG[initialTier].audioSpeed);

  // Student Input & Results State
  const [studentInput, setStudentInput] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [feedbackTitle, setFeedbackTitle] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [comparisonResults, setComparisonResults] = useState<{
    targetWord: string;
    studentWord?: string;
    isCorrect: boolean;
  }[]>([]);
  const [passedCount, setPassedCount] = useState<number>(0);
  const [completedPassages, setCompletedPassages] = useState<string[]>([]);
  const [isPrintingWorksheet, setIsPrintingWorksheet] = useState<boolean>(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Filter passages by selected tier
  const tierPassages = SPELLING_CHAMPIONS_DATA.filter((p) => p.tier === selectedTier);
  const currentPassage = tierPassages.find((p) => p.id === selectedPassageId) || tierPassages[0] || SPELLING_CHAMPIONS_DATA[0];

  // Load saved completed passages on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lughati_spelling_champions_completed');
      if (saved) {
        setCompletedPassages(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // When tier changes, select the first passage of that tier and set recommended speed
  useEffect(() => {
    const passagesInTier = SPELLING_CHAMPIONS_DATA.filter((p) => p.tier === selectedTier);
    if (passagesInTier.length > 0) {
      setSelectedPassageId(passagesInTier[0].id);
    }
    setAudioSpeed(SPELLING_TIERS_CONFIG[selectedTier].audioSpeed);
    resetSession();
  }, [selectedTier]);

  // When mode or passage changes, reset session
  useEffect(() => {
    resetSession();
  }, [currentMode, selectedPassageId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getTargetText = (): string => {
    return currentMode === 'manthoor' ? currentPassage.manthoor : currentPassage.ekhtibari;
  };

  const resetSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setHintsUsed(0);
    setStudentInput('');
    setShowFeedback(false);
    setShowHintModal(false);

    const seconds = currentMode === 'manthoor' 
      ? currentPassage.recommendedSeconds.manthoor 
      : currentPassage.recommendedSeconds.ekhtibari;
    setTimeLeft(seconds);

    // In ekhtibari (test) mode, hide text by default; in manthoor show it initially for preview
    if (currentMode === 'ekhtibari') {
      setIsTextHidden(true);
    } else {
      setIsTextHidden(false);
    }
  };

  const handleStart = () => {
    if (isPlaying) return;

    audioManager.play('click');
    setIsPlaying(true);
    setIsPaused(false);
    setShowFeedback(false);
    
    // Auto-hide text when game starts in both modes to challenge student recall
    setIsTextHidden(true);

    // Focus input
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);

    const initialSeconds = currentMode === 'manthoor' 
      ? currentPassage.recommendedSeconds.manthoor 
      : currentPassage.recommendedSeconds.ekhtibari;
    
    setTimeLeft(initialSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleCheckAnswer(); // Auto check on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTogglePause = () => {
    if (!isPlaying) return;
    if (isPaused) {
      // Resume
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleCheckAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleToggleTextVisibility = () => {
    audioManager.play('click');
    if (isTextHidden) {
      setIsTextHidden(false);
      if (isPlaying) {
        setHintsUsed((prev) => prev + 1);
      }
    } else {
      setIsTextHidden(true);
    }
  };

  const handleSpeakText = () => {
    const textToSpeak = getTargetText();
    audioManager.speakArabic(textToSpeak, audioSpeed);
  };

  // Tashkeel helper keyboard insertion
  const handleInsertChar = (char: string) => {
    if (!isPlaying) return;
    audioManager.play('click');
    setStudentInput((prev) => prev + char);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Normalization logic
  const normalizeText = (text: string, strictHarakat: boolean = false): string => {
    let result = text.trim();
    if (!strictHarakat) {
      result = result
        .replace(/[\u064B-\u065F\u0670]/g, '') // remove harakat
        .replace(/[إأآا]/g, 'ا') // normalize alef
        .replace(/ة/g, 'ه') // normalize taa marboota for flexible match
        .replace(/ى/g, 'ي');
    }
    return result
      .replace(/[.,:؛،?!]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCheckAnswer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsTextHidden(false); // Reveal target text for side-by-side comparison

    const targetText = getTargetText();
    const rawTargetWords = targetText.split(/\s+/).filter(Boolean);
    const rawStudentWords = studentInput.split(/\s+/).filter(Boolean);

    // Is it advanced tier?
    const isStrictTier = selectedTier === 'advanced';
    const normTargetWords = rawTargetWords.map((w) => normalizeText(w, isStrictTier));
    const normStudentWords = rawStudentWords.map((w) => normalizeText(w, isStrictTier));

    let correctCount = 0;
    const diffs: { targetWord: string; studentWord?: string; isCorrect: boolean }[] = [];

    for (let i = 0; i < rawTargetWords.length; i++) {
      const studentWord = rawStudentWords[i];
      const isMatch = studentWord && normStudentWords[i] === normTargetWords[i];

      if (isMatch) {
        correctCount++;
        diffs.push({
          targetWord: rawTargetWords[i],
          studentWord: studentWord,
          isCorrect: true
        });
      } else {
        diffs.push({
          targetWord: rawTargetWords[i],
          studentWord: studentWord || '---',
          isCorrect: false
        });
      }
    }

    setComparisonResults(diffs);

    const accuracy = rawTargetWords.length > 0 ? correctCount / rawTargetWords.length : 0;
    let stars = 0;

    if (accuracy >= 0.95 && hintsUsed === 0) {
      stars = 3;
    } else if (accuracy >= 0.75) {
      stars = 2;
    } else if (accuracy >= 0.45) {
      stars = 1;
    } else {
      stars = 0;
    }

    setEarnedStars(stars);
    setPassedCount(correctCount);

    if (stars === 3) {
      setFeedbackTitle('بطل الإملاء الأسطوري! 🏆');
      setFeedbackMessage(
        selectedTier === 'advanced'
          ? `إتقان استثنائي وبراعة فائقة يا ${studentName}! كتبت النص المتقدم بكل دقة واحترافية بدون أخطاء.`
          : `أداء مذهل يا ${studentName}! كتبت الكلمات كاملة بدقة وسرعة وبدون أي مساعدة.`
      );
      audioManager.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onAddStars(5); // Award stars
    } else if (stars === 2) {
      setFeedbackTitle('عمل رائع ومتميز! 👍');
      setFeedbackMessage(
        `أحسنت يا ${studentName}! نسبة الإتقان عالية جداً (${Math.round(accuracy * 100)}%). راجع الكلمات باللون الأحمر لتصل للدرجة الكاملة.`
      );
      audioManager.playCorrect();
      onAddStars(3);
    } else if (stars === 1) {
      setFeedbackTitle('بداية طيبة ومحاولة جيدة! 🌟');
      setFeedbackMessage(
        `أنت في الطريق الصحيح يا ${studentName}. استمع للنص مرة أخرى وأعد المحاولة لتحصل على ٣ نجوم كاملة.`
      );
      audioManager.playCorrect();
      onAddStars(1);
    } else {
      setFeedbackTitle('واصل التدريب يا بطل! 💪');
      setFeedbackMessage(
        'الإملاء مهارة تتطور مع التمرين المستمر. استمع للنص بتمهل واكتب الكلمات كلمة بكلمة.'
      );
      audioManager.playWrong();
    }

    // Save completed passage id
    if (stars >= 2 && !completedPassages.includes(currentPassage.id)) {
      const nextList = [...completedPassages, currentPassage.id];
      setCompletedPassages(nextList);
      try {
        localStorage.setItem('lughati_spelling_champions_completed', JSON.stringify(nextList));
      } catch (e) {}
    }

    setShowFeedback(true);
  };

  const handleNextLesson = () => {
    const currentIndex = tierPassages.findIndex((p) => p.id === currentPassage.id);
    if (currentIndex < tierPassages.length - 1) {
      const nextPassage = tierPassages[currentIndex + 1];
      setSelectedPassageId(nextPassage.id);
    } else {
      // Completed all lessons in this tier!
      alert(`ما شاء الله! لقد أتممت جميع نصوص ${SPELLING_TIERS_CONFIG[selectedTier].name} بنجاح! 🎉`);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = tierPassages.findIndex((p) => p.id === currentPassage.id);
    if (currentIndex > 0) {
      const prevPassage = tierPassages[currentIndex - 1];
      setSelectedPassageId(prevPassage.id);
    }
  };

  const currentTierConfig = SPELLING_TIERS_CONFIG[selectedTier];
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const isTimerCritical = timeLeft <= 10 && isPlaying;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
      {/* Top Banner & Title Area */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Title & Badge */}
            <div className="flex items-center gap-3 text-right">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-slate-900 flex items-center justify-center text-3xl shadow-md border-2 border-amber-300">
                📝
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-alexandria tracking-tight">
                    أبطال الإملاء التفاعلي
                  </h1>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    مختبر الإملاء الذكي 🇸🇦
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  منظومة تدريب إملائي متدرجة للفئات الضعيفة، المتوسطة، والمتميزة مع التصحيح الذكي والمساعد الصوتي
                </p>
              </div>
            </div>

            {/* Top Quick Actions (Back, Worksheet, Certificate) */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة للدروس</span>
                </button>
              )}

              <button
                onClick={() => setIsPrintingWorksheet(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="طباعة ورقة تدريب إملائي مسطرة"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>طباعة ورقة الإملاء</span>
              </button>

              {onOpenCertificate && (
                <button
                  onClick={onOpenCertificate}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>شهادة بطل الإملاء</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Tier Navigation Tabs */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {(['support', 'standard', 'advanced'] as SpellingTier[]).map((tierKey) => {
              const cfg = SPELLING_TIERS_CONFIG[tierKey];
              const isSelected = selectedTier === tierKey;
              const countInTier = SPELLING_CHAMPIONS_DATA.filter((p) => p.tier === tierKey).length;

              return (
                <button
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`p-3 rounded-2xl text-right transition-all border-2 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? tierKey === 'support'
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : tierKey === 'standard'
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs ${
                        isSelected
                          ? tierKey === 'support'
                            ? 'bg-emerald-600 text-white'
                            : tierKey === 'standard'
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cfg.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 font-alexandria">
                          {cfg.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-white text-slate-600 border border-slate-200">
                          {countInTier} نصوص
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {cfg.sublabel}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-6">
        
        {/* Tier Info & Lesson Selector Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <span className="text-xl">{currentTierConfig.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">المستوى المختار:</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${currentTierConfig.badgeBg}`}>
                  {currentTierConfig.name}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  • {currentPassage.gradeLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentTierConfig.description}
              </p>
            </div>
          </div>

          {/* Lesson Dropdown & Mode Selector Switch */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
            {/* Passage Select */}
            <select
              id="passage-select-dropdown"
              value={currentPassage.id}
              onChange={(e) => setSelectedPassageId(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 transition w-full sm:w-auto cursor-pointer"
            >
              {tierPassages.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  {idx + 1}. {p.title} - {p.targetSkill}
                </option>
              ))}
            </select>

            {/* Mode Switcher: Manthoor vs Ekhtibari */}
            <div className="bg-slate-100 p-1 rounded-xl flex w-full sm:w-auto border border-slate-200">
              <button
                id="btn-mode-manthoor"
                onClick={() => setCurrentMode('manthoor')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currentMode === 'manthoor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="إملاء منظور: دراسة وتأمل النص أولاً ثم كتابته من الذاكرة"
              >
                👁️ إملاء منظور
              </button>
              <button
                id="btn-mode-ekhtibari"
                onClick={() => setCurrentMode('ekhtibari')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  currentMode === 'ekhtibari'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="إملاء اختباري: استماع للنص وكتابته دون رؤيته مسبقاً"
              >
                🎧 إملاء اختباري
              </button>
            </div>
          </div>
        </div>

        {/* Target Text Card (Card with blur & tools) */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200 hover:border-emerald-200 transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

          {/* Header of Target Card */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-emerald-600">📍</span>
                <span>{currentPassage.unit} • {currentPassage.title}</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  ({currentMode === 'manthoor' ? 'إملاء منظور' : 'إملاء اختباري'})
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  🎯 الظاهرة الإملائية: {currentPassage.targetSkill}
                </span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="hidden sm:inline">{currentPassage.skillDescription}</span>
              </div>
            </div>

            {/* Action Tools (Listen, Toggle Text, Hints, Audio Speed) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Audio Listen */}
              <button
                id="btn-listen-text"
                onClick={handleSpeakText}
                className="flex items-center gap-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 px-3.5 py-1.5 rounded-full transition font-extrabold text-xs border border-sky-200 cursor-pointer shadow-2xs"
                title="استمع إلى قراءة النص بصوت عربي نقي وطبيعي"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>استمع للنص</span>
              </button>

              {/* Speed Controller */}
              <button
                onClick={() => {
                  const nextSpeed = audioSpeed === 0.7 ? 0.85 : audioSpeed === 0.85 ? 1.0 : 0.7;
                  setAudioSpeed(nextSpeed);
                  audioManager.play('click');
                }}
                className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
                title="تبديل سرعة النطق"
              >
                {audioSpeed === 0.7 ? '🐢 0.7x (متمهل)' : audioSpeed === 0.85 ? '🚶 0.85x (عادي)' : '⚡ 1.0x (سريع)'}
              </button>

              {/* Eye Toggle (Hide / Show) */}
              <button
                id="btn-toggle-text-visibility"
                onClick={handleToggleTextVisibility}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition font-extrabold text-xs border cursor-pointer ${
                  isTextHidden
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
                title={isTextHidden ? 'إظهار النص لمراجعته' : 'إخفاء النص لاختبار الحفظ'}
              >
                {isTextHidden ? (
                  <>
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>إظهار النص</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-purple-600" />
                    <span>إخفاء النص</span>
                  </>
                )}
              </button>

              {/* Hints Button */}
              {currentPassage.hints && currentPassage.hints.length > 0 && (
                <button
                  onClick={() => setShowHintModal(!showHintModal)}
                  className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 cursor-pointer"
                  title="عرض إرشادات وتلميحات إملائية للدرس"
                >
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                </button>
              )}
            </div>
          </div>

          {/* Hint Dropdown if open */}
          {showHintModal && currentPassage.hints && (
            <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>إرشادات وتلميحات إملائية مهمة لهذا النص:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pr-2">
                {currentPassage.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* The Target Text Box */}
          <div className="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-2xl p-6 min-h-[130px] flex items-center justify-center relative select-none">
            <p
              id="spelling-target-text-display"
              className={`text-2xl sm:text-3xl md:text-4xl text-center font-bold text-slate-900 leading-loose transition-all duration-300 ${
                isTextHidden ? 'blur-md select-none opacity-40' : 'blur-none opacity-100'
              }`}
            >
              {getTargetText()}
            </p>

            {isTextHidden && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-xs rounded-2xl">
                <div className="bg-white/95 px-4 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-black text-slate-700 flex items-center gap-2">
                  <span>🔒 النص مخفي للاختبار</span>
                  <button
                    onClick={handleToggleTextVisibility}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    (انقر للكشف)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lower Workspace: Timer Panel + Input Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Timer & Session Status Panel (4 Cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col items-center justify-between gap-4">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>الوقت المتبقي:</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {currentMode === 'manthoor' ? 'منظور' : 'اختباري'}
              </span>
            </div>

            {/* Giant Timer Display */}
            <div className="my-2 text-center">
              <div
                id="spelling-timer-numeral"
                className={`text-6xl sm:text-7xl font-black font-mono tracking-tight transition-transform duration-200 ${
                  isTimerCritical ? 'text-rose-600 scale-110 animate-pulse' : 'text-slate-800'
                }`}
              >
                {minutes}:{seconds}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isPlaying ? (isPaused ? '⏸️ المؤقت متوقف مؤقتاً' : '⏳ جاري احتساب الوقت...') : 'اضغط "ابدأ" لبدء الإملاء'}
              </p>
            </div>

            {/* Start / Pause / Reset Buttons */}
            <div className="w-full space-y-2">
              {!isPlaying ? (
                <button
                  id="spelling-start-btn"
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>ابدأ الإملاء ▶️</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTogglePause}
                    className={`py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isPaused
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <span>{isPaused ? '▶️ استئناف' : '⏸️ إيقاف مؤقت'}</span>
                  </button>
                  <button
                    onClick={resetSession}
                    className="py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط</span>
                  </button>
                </div>
              )}

              {/* Reset session button if not playing */}
              {!isPlaying && (
                <button
                  onClick={resetSession}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة تعيين المؤقت</span>
                </button>
              )}
            </div>

            {/* Support Note for Weak Tier */}
            {selectedTier === 'support' && (
              <div className="w-full bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-200 text-[11px] text-emerald-900 text-center font-bold">
                🌱 وضع التأسيس: وقت إضافي وسرعة صوتية متمهلة لمساعدتك على الإتقان!
              </div>
            )}
          </div>

          {/* Student Writing & Input Area (8 Cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-between relative overflow-hidden">
            
            {/* Overlay if not started */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-20 rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-3xl shadow-xs">
                  <Lock className="w-7 h-7 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 font-alexandria">
                    منطقة الكتابة مقفلة
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    اضغط على زر <span className="font-bold text-emerald-700">"ابدأ الإملاء ▶️"</span> لبدء المؤقت وكتابة النص
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ابدأ الآن</span>
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="spelling-student-textarea"
                  className="text-sm font-black text-slate-800 flex items-center gap-2"
                >
                  <span>✍️</span>
                  <span>اكتب النص هنا يا {studentName}:</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {studentInput.trim() ? studentInput.trim().split(/\s+/).length : 0} كلمة
                </span>
              </div>

              {/* Input Textarea */}
              <textarea
                id="spelling-student-textarea"
                ref={textareaRef}
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="ابدأ بكتابة الكلمات كما تسمعها أو تتذكرها مع مراعاة الحركات والظواهر الإملائية..."
                className="w-full min-h-[140px] bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-xl sm:text-2xl font-sans leading-loose focus:outline-none focus:border-emerald-600 focus:bg-white transition resize-none text-slate-900"
                disabled={!isPlaying}
              />

              {/* On-Screen Virtual Tashkeel Toolbar (Great for Mobile & Chromebooks!) */}
              <div className="mt-3 p-2 bg-slate-100/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1.5 px-1">
                  <span>لوحة الحركات والهمزات المساعدة:</span>
                  <span className="text-[10px] text-slate-400">انقر لإدراج الحركة</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: 'َ (فتحة)', char: 'َ' },
                    { label: 'ُ (ضمة)', char: 'ُ' },
                    { label: 'ِ (كسرة)', char: 'ِ' },
                    { label: 'ْ (سكون)', char: 'ْ' },
                    { label: 'ّ (شدة)', char: 'ّ' },
                    { label: 'ً (تنوين فتح)', char: 'ً' },
                    { label: 'ٌ (تنوين ضم)', char: 'ٌ' },
                    { label: 'ٍ (تنوين كسر)', char: 'ٍ' },
                    { label: 'أ (ألف مهموزة)', char: 'أ' },
                    { label: 'إ (همزة مكسورة)', char: 'إ' },
                    { label: 'آ (همزة مد)', char: 'آ' },
                    { label: 'ء (همزة سطر)', char: 'ء' },
                    { label: 'ئ (همزة نبرة)', char: 'ئ' },
                    { label: 'ؤ (همزة واو)', char: 'ؤ' },
                    { label: 'ة (تاء مربوطة)', char: 'ة' },
                    { label: 'ـ (تطويل)', char: 'ـ' }
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertChar(btn.char)}
                      disabled={!isPlaying}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-300 rounded-lg text-sm font-bold shadow-2xs transition-all active:scale-90 disabled:opacity-50 cursor-pointer"
                      title={btn.label}
                    >
                      {btn.char}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Check Spelling */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-500">
                {hintsUsed > 0 && (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    كشفت النص {hintsUsed} مرة
                  </span>
                )}
              </div>

              <button
                id="spelling-submit-check-btn"
                onClick={handleCheckAnswer}
                disabled={!isPlaying && studentInput.trim() === ''}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white px-7 py-3 rounded-xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>تصحيح الإملاء ✅</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback & Detailed Diff Comparison Area */}
        {showFeedback && (
          <div
            id="spelling-feedback-section"
            className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 transition-all animate-in fade-in zoom-in-95 duration-200 ${
              earnedStars === 3
                ? 'border-emerald-500 bg-emerald-50/20'
                : earnedStars >= 1
                ? 'border-blue-400 bg-blue-50/20'
                : 'border-amber-400 bg-amber-50/20'
            }`}
          >
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 text-4xl sm:text-5xl mb-3">
                {[1, 2, 3].map((starIdx) => (
                  <span
                    key={starIdx}
                    className={`transition-all duration-300 ${
                      starIdx <= earnedStars
                        ? 'text-amber-400 scale-110 drop-shadow-md animate-bounce'
                        : 'text-slate-200 scale-95'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-alexandria mb-2">
                {feedbackTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {feedbackMessage}
              </p>

              {/* Stats Summary Bar */}
              <div className="grid grid-cols-3 gap-2 w-full mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-xl font-black text-emerald-600">{passedCount}</div>
                  <div className="text-[11px] font-bold text-slate-500">كلمات صحيحة</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-xl font-black text-rose-500">
                    {comparisonResults.length - passedCount}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">أخطاء محتملة</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-xl font-black text-amber-600">
                    {comparisonResults.length > 0
                      ? `${Math.round((passedCount / comparisonResults.length) * 100)}%`
                      : '0%'}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">نسبة الدقة</div>
                </div>
              </div>

              {/* Word-by-Word Diff Output Box */}
              <div className="w-full bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 text-right">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
                  <span>مقارنة الكلمات (الأخضر صحيح • الأحمر يحتاج تصحيح):</span>
                  <span className="text-[11px] text-slate-400">مرر الفأرة فوق الكلمة لمعرفة ما كتبته</span>
                </div>

                <div className="text-xl sm:text-2xl leading-loose font-sans flex flex-wrap gap-2 items-center justify-start">
                  {comparisonResults.map((item, idx) => (
                    <div
                      key={idx}
                      className={`relative group px-2 py-1 rounded-xl font-extrabold border transition-all ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300 line-through decoration-rose-500 decoration-2'
                      }`}
                      title={!item.isCorrect ? `كتبت: ${item.studentWord}` : 'صحيح ومتقن!'}
                    >
                      <span>{item.targetWord}</span>
                      {!item.isCorrect && (
                        <span className="block text-[10px] text-rose-700 font-mono no-underline leading-none mt-0.5">
                          ✍️ كتب: {item.studentWord}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Orthographic Diagnosis */}
              <div className="mt-4 w-full bg-white rounded-2xl p-4 border border-slate-200 text-right">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>التشخيص الإملائي للظاهرة ({currentPassage.targetSkill}):</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentPassage.skillDescription}. تأكد دائماً من نطق الكلمات بمقاطعها الساكنة وتمييز ال الشمسية التي تليها شدة وال القمرية التي تليها حركة.
                </p>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
                <button
                  onClick={resetSession}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة لهذا النص</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>الدرس التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Worksheet Modal */}
        {isPrintingWorksheet && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 printable-area max-h-[90vh] overflow-y-auto">
              <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-800">
                    ورقة تدريب إملائي قابلة للطباعة
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    🖨️ طباعة الآن
                  </button>
                  <button
                    onClick={() => setIsPrintingWorksheet(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="text-right space-y-6">
                <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-3">
                  <div>
                    <h2 className="font-black text-lg text-emerald-950 font-alexandria">
                      المملكة العربية السعودية • وزارة التعليم
                    </h2>
                    <p className="text-xs text-slate-600 font-bold">
                      مقرر لغتي الجميلة • ورقة تدريب أبطال الإملاء ({currentTierConfig.name})
                    </p>
                  </div>
                  <div className="text-left text-xs font-bold text-slate-700">
                    <div>اسم الطالب/ـة: .......................................</div>
                    <div>الصف: {currentPassage.gradeLevel}</div>
                    <div>التاريخ: ..... / ..... / ١٤٤ هـ</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">
                    {currentPassage.unit} • {currentPassage.title}
                  </div>
                  <div className="text-sm font-black text-emerald-900 mb-2">
                    الظاهرة المستهدفة: {currentPassage.targetSkill}
                  </div>
                  <div className="text-xl font-bold text-slate-800 leading-loose border-2 border-dashed border-emerald-300 p-4 rounded-xl bg-white text-center">
                    {getTargetText()}
                  </div>
                </div>

                {/* Ruled lines for handwriting practice */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold text-slate-600">
                    أكتب النص الإملائي بخط جميل ومرتب مع مراعاة الحركات وقواعد السطر:
                  </div>
                  {[1, 2, 3, 4, 5].map((lineNum) => (
                    <div
                      key={lineNum}
                      className="h-10 border-b-2 border-slate-300 border-dashed relative"
                    >
                      <span className="absolute right-0 bottom-1 text-[10px] text-slate-300 font-mono">
                        {lineNum}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                  <div>الدرجة: ( ..... / ١٠ ) ⭐⭐⭐</div>
                  <div>توقيع المعلم/ـة أو ولي الأمر: ......................</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
