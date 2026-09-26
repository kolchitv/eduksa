import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Mic, 
  MicOff, 
  Square, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Timer, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  Star, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Zap,
  VolumeX,
  Shuffle,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ReadingTextItem, 
  StudentReadingRecord, 
  ComprehensionQuestion 
} from '../../types/readingPath';
import { READING_LEVEL_INFO } from '../../data/readingPathData';
import { audioManager } from '../../utils/audio';

interface ReadingStudioPracticeProps {
  text: ReadingTextItem;
  onBackToLibrary: () => void;
  onCompleteSession: (record: StudentReadingRecord) => void;
  onAddStars: (count: number) => void;
  studentName: string;
}

type StudioStep = 'intro' | 'reading' | 'comprehension' | 'results';

export const ReadingStudioPractice: React.FC<ReadingStudioPracticeProps> = ({
  text,
  onBackToLibrary,
  onCompleteSession,
  onAddStars,
  studentName
}) => {
  const [currentStep, setCurrentStep] = useState<StudioStep>('intro');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isTextHidden, setIsTextHidden] = useState(false);
  const [focusLineMode, setFocusLineMode] = useState(false);

  // Audio Reading state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);

  // Live Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const recordingTimerRef = useRef<any>(null);

  // Questions & Answers state
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [orderedItemsState, setOrderedItemsState] = useState<Record<string, string[]>>({});
  const [isAnswersSubmitted, setIsAnswersSubmitted] = useState(false);
  const [comprehensionScore, setComprehensionScore] = useState(100);

  // Level Info
  const levelInfo = READING_LEVEL_INFO[text.level] || READING_LEVEL_INFO[1];

  // Initialize Ordered items for order_events questions
  useEffect(() => {
    const initialOrders: Record<string, string[]> = {};
    text.questions.forEach((q) => {
      if (q.type === 'order_events' && q.itemsToOrder) {
        // Shuffle items initially
        const shuffled = [...q.itemsToOrder].sort(() => Math.random() - 0.5);
        initialOrders[q.id] = shuffled;
      }
    });
    setOrderedItemsState(initialOrders);
  }, [text]);

  // Stopwatch timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Voice recording timer effect
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Start Reading Action
  const handleStartReading = () => {
    setCurrentStep('reading');
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    audioManager.playClick();
  };

  // Play Model Voice (TTS)
  const handlePlayModelAudio = () => {
    if (isPlayingAudio) {
      audioManager.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioManager.speakArabic(text.content, 0.85)
        .then(() => setIsPlayingAudio(false))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  // Voice Recording Toggle
  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setHasRecording(false);
      audioManager.play('success');
    } else {
      setIsRecording(false);
      setHasRecording(true);
      audioManager.playClick();
    }
  };

  // Finish Reading and Move to Comprehension
  const handleFinishReading = () => {
    setIsTimerRunning(false);
    setIsPlayingAudio(false);
    audioManager.stopSpeaking();
    if (isRecording) setIsRecording(false);

    if (text.questions && text.questions.length > 0) {
      setCurrentStep('comprehension');
    } else {
      calculateAndShowResults(100);
    }
    audioManager.playClick();
  };

  // Move Ordered item up/down
  const handleMoveOrderItem = (qId: string, fromIndex: number, toIndex: number) => {
    const currentList = orderedItemsState[qId] || [];
    if (toIndex < 0 || toIndex >= currentList.length) return;
    const updated = [...currentList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderedItemsState({ ...orderedItemsState, [qId]: updated });
  };

  // Submit Comprehension Answers
  const handleSubmitComprehension = () => {
    setIsAnswersSubmitted(true);

    let correctCount = 0;
    const totalQ = text.questions.length;

    text.questions.forEach((q) => {
      if (q.type === 'order_events') {
        const userOrder = orderedItemsState[q.id] || [];
        const correctOrder = q.correctAnswer as string[];
        const isAllCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
        if (isAllCorrect) correctCount++;
      } else if (q.type === 'multiple_choice' || q.type === 'wh_question' || q.type === 'synonym_antonym') {
        if (Number(userAnswers[q.id]) === Number(q.correctAnswer)) {
          correctCount++;
        }
      } else if (q.type === 'find_word') {
        if (userAnswers[q.id] === q.targetWord || userAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const score = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 100;
    setComprehensionScore(score);

    setTimeout(() => {
      calculateAndShowResults(score);
    }, 1200);
  };

  // Results Calculation
  const calculateAndShowResults = (compScore: number) => {
    const finalSeconds = Math.max(5, elapsedSeconds);
    const wpm = Math.round((text.wordCount / (finalSeconds / 60)));
    
    // Determine stars
    let starsEarned = 3;
    if (compScore >= 80 && wpm >= 20) starsEarned = 5;
    else if (compScore >= 60) starsEarned = 4;
    else starsEarned = 3;

    onAddStars(starsEarned * 2);

    // Save record
    const record: StudentReadingRecord = {
      textId: text.id,
      completed: true,
      bestDurationSec: finalSeconds,
      wpm,
      comprehensionScore: compScore,
      fluencyStars: starsEarned,
      completedAt: new Date().toISOString(),
      attemptCount: 1
    };

    onCompleteSession(record);
    setCurrentStep('results');

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Helper formatting seconds
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    if (mins > 0) {
      return `${mins} دقيقة و ${remainingSecs} ثانية`;
    }
    return `${remainingSecs} ثانية`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={onBackToLibrary}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمكتبة</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r ${levelInfo.badgeColor} text-white shadow-xs`}>
            المستوى {text.level}
          </span>
          <span className="text-xs font-extrabold text-slate-700">
            {text.title}
          </span>
        </div>

        {/* Live Timer badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-mono font-bold text-xs shadow-inner">
          <Timer className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>{elapsedSeconds} ثانية</span>
        </div>
      </div>

      {/* ================= STEP 1: INTRO / READY CARD ================= */}
      {currentStep === 'intro' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-950/60 animate-bounce">
            🚀
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              تحدي الانطلاق في القراءة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              جاهز للقراءة يا بطل؟
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              سوف تقرأ نص «<span className="text-amber-300 font-bold">{text.title}</span>» وسيحسب النظام دقتك ومدتك الزمنية وسرعتك في القراءة!
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-0.5">عدد الكلمات</span>
              <span className="text-lg font-black text-amber-300">{text.wordCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-0.5">المدة المتوقعة</span>
              <span className="text-lg font-black text-emerald-300">{text.expectedDurationSec} ث</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-0.5">أسئلة الفهم</span>
              <span className="text-lg font-black text-sky-300">{text.questions.length}</span>
            </div>
          </div>

          {/* Target Skills Pills */}
          {text.targetSkills && text.targetSkills.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {text.targetSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-bold">
                  ✨ {s}
                </span>
              ))}
            </div>
          )}

          {/* Start CTA Button */}
          <div className="pt-4">
            <button
              id="start-reading-practice-btn"
              onClick={handleStartReading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl hover:shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>ابدأ القراءة الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: READING STUDIO FLOW ================= */}
      {currentStep === 'reading' && (
        <div className="space-y-6">
          {/* Controls Bar: Audio, Hide, Font Size, Recording */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Audio Model Playback */}
            <div className="flex items-center gap-2">
              <button
                id="play-tts-model-btn"
                onClick={handlePlayModelAudio}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white shadow-md animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                }`}
                title="استمع للقراءة النموذجية الصوتية المضبوطة بالحركات"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>إيقاف الصوت</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 استمع للنموذج</span>
                  </>
                )}
              </button>

              {/* Hide / Show Text Toggle */}
              <button
                onClick={() => setIsTextHidden(!isTextHidden)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isTextHidden 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="أخفِ النص لاختبار التذكر والطلاقة"
              >
                {isTextHidden ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>إظهار النص</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>🙈 أخفِ النص</span>
                  </>
                )}
              </button>
            </div>

            {/* Voice Recorder & Font Size Controls */}
            <div className="flex items-center gap-2">
              <button
                id="toggle-recording-btn"
                onClick={handleToggleRecording}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse shadow-md' 
                    : hasRecording 
                    ? 'bg-purple-100 text-purple-900 border border-purple-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="سجل قراءتك بصوتك"
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? `🎙️ جاري التسجيل (${recordingSeconds}ث)` : hasRecording ? '✅ تم التسجيل' : '🎙️ سجّل قراءتك'}</span>
              </button>

              {/* Font Size Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    fontSize === 'normal' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  عادي
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    fontSize === 'large' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  كبير
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    fontSize === 'xlarge' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  كبير جداً
                </button>
              </div>
            </div>
          </div>

          {/* Main Reading Text Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-emerald-100 shadow-xl relative min-h-[260px] flex flex-col justify-between">
            {/* Watermark Logo / Level */}
            <div className="absolute top-4 left-4 opacity-10 pointer-events-none text-6xl">
              📖
            </div>

            {isTextHidden ? (
              <div className="my-auto py-12 text-center space-y-3">
                <EyeOff className="w-12 h-12 mx-auto text-amber-500 animate-pulse" />
                <h4 className="text-lg font-black text-slate-800 font-alexandria">
                  النص مخفي الآن!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  حاول تذكر النص وقراءته غيباً أو اضغط على «إظهار النص» للعودة.
                </p>
                <button
                  onClick={() => setIsTextHidden(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  إظهار النص مجدداً
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Text Content */}
                <div 
                  className={`font-amiri font-bold text-slate-900 leading-loose text-justify ${
                    fontSize === 'normal' 
                      ? 'text-xl sm:text-2xl' 
                      : fontSize === 'large' 
                      ? 'text-2xl sm:text-3xl' 
                      : 'text-3xl sm:text-4xl leading-loose'
                  }`}
                >
                  {text.paragraphs && text.paragraphs.length > 0 ? (
                    text.paragraphs.map((p, idx) => (
                      <p key={idx} className="mb-5 last:mb-0 indent-6">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="whitespace-pre-line">
                      {text.content}
                    </p>
                  )}
                </div>

                {/* New Vocabulary Box if available */}
                {text.newVocabulary && text.newVocabulary.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>المفردات والكلمات الجديدة:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {text.newVocabulary.map((v, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                          <span className="font-extrabold text-amber-900 ml-1.5">({v.word})</span>
                          <span>: {v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action: Finish Reading Button */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>المدة المستغرقة حتى الآن: <strong className="text-slate-900 font-mono">{elapsedSeconds}</strong> ثانية</span>
              </div>

              <button
                id="finish-reading-go-to-comprehension-btn"
                onClick={handleFinishReading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>✅ أنهيت القراءة (الانتقال لأسئلة الفهم)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: COMPREHENSION QUESTIONS ================= */}
      {currentStep === 'comprehension' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white border border-indigo-500/30 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-xl">
                ❓
              </div>
              <div>
                <h3 className="text-base font-black font-alexandria text-white">
                  أسئلة الفهم والاستيعاب القرائي
                </h3>
                <p className="text-xs text-indigo-200">
                  أجب عن الأسئلة التالية للتأكد من فهمك الدقيق للنص
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
              {text.questions.length} أسئلة
            </span>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {text.questions.map((q, qIndex) => {
              if (q.type === 'order_events') {
                const currentOrder = orderedItemsState[q.id] || [];
                return (
                  <div key={q.id} className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-2 mt-3">
                      {currentOrder.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                              {itemIdx + 1}
                            </span>
                            <span>{item}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveOrderItem(q.id, itemIdx, itemIdx - 1)}
                              disabled={itemIdx === 0}
                              className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-800 text-xs font-black cursor-pointer"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrderItem(q.id, itemIdx, itemIdx + 1)}
                              disabled={itemIdx === currentOrder.length - 1}
                              className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-800 text-xs font-black cursor-pointer"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Multiple Choice / WH Question / Find Word / Synonyms
              return (
                <div key={q.id} className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {q.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = q.type === 'find_word' 
                        ? userAnswers[q.id] === opt 
                        : userAnswers[q.id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            if (q.type === 'find_word') {
                              setUserAnswers({ ...userAnswers, [q.id]: opt });
                            } else {
                              setUserAnswers({ ...userAnswers, [q.id]: optIdx });
                            }
                            audioManager.playClick();
                          }}
                          className={`p-3.5 rounded-2xl border text-right text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Answers CTA */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">
              تأكد من اختيار إجابة لكل سؤال ثم اضغط على زر الاعتماد.
            </span>

            <button
              id="submit-comprehension-answers-btn"
              onClick={handleSubmitComprehension}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>اعتماد الإجابات ورؤية النتيجة</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: FINAL RESULTS & BADGE ================= */}
      {currentStep === 'results' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
            ⭐
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              إنجاز رائع ومتميز!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              بارك الله فيك يا بطل، {studentName}!
            </h2>
            <p className="text-sm text-slate-300">
              أتممت قراءة نص «<span className="text-amber-300 font-bold">{text.title}</span>» بنجاح واستحققت نجوم الطلاقة.
            </p>
          </div>

          {/* Results Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">المدة الكلية</span>
              <span className="text-xl font-black font-alexandria text-emerald-300">
                {formatTime(elapsedSeconds)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">سرعة القراءة</span>
              <span className="text-xl font-black font-alexandria text-sky-300">
                {Math.round((text.wordCount / (Math.max(5, elapsedSeconds) / 60)))} <span className="text-xs font-normal">كلمة/د</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">الفهم القرائي</span>
              <span className="text-xl font-black font-alexandria text-amber-300">
                {comprehensionScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block mb-1">النجوم المكتسبة</span>
              <span className="text-xl font-black font-alexandria text-yellow-300 flex items-center justify-center gap-1">
                <span>+6</span>
                <span>⭐</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={handleStartReading}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التحدي لتحسين الوقت</span>
            </button>

            <button
              onClick={onBackToLibrary}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>متابعة المسار واختيار النص التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
