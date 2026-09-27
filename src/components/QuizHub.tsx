import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Star, 
  Award, 
  Volume2, 
  Sparkles, 
  ChevronLeft, 
  Flame,
  Trophy,
  Medal,
  Share2,
  Printer,
  X,
  Target,
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { GradeId, QuizQuestion } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuizHubProps {
  currentGrade: GradeId;
  studentName?: string;
  onAddStars: (count: number) => void;
  onQuizCompleted: (quizId: string) => void;
}

export const QuizHub: React.FC<QuizHubProps> = ({
  currentGrade,
  studentName = 'بطل لغتي',
  onAddStars,
  onQuizCompleted
}) => {
  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  // Streak state (0 to 5)
  const [consecutiveStreak, setConsecutiveStreak] = useState<number>(0);
  const [totalExcellenceMedals, setTotalExcellenceMedals] = useState<number>(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentSessionQuestions, setCurrentSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<{ question: string; isCorrect: boolean }[]>([]);

  // Load streak and medals from localStorage
  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem('lughati_quiz_streak');
      const savedMedals = localStorage.getItem('lughati_excellence_medals');
      if (savedStreak) setConsecutiveStreak(Math.min(5, Math.max(0, parseInt(savedStreak, 10))));
      if (savedMedals) setTotalExcellenceMedals(parseInt(savedMedals, 10));
    } catch (e) {}
  }, []);

  // Collect all questions for this grade
  const gradeQuestions: QuizQuestion[] = useMemo(() => {
    const list: QuizQuestion[] = [];
    currentGradeData.units.forEach((u) => {
      u.lessons.forEach((l) => {
        if (l.comprehensionQuestions && l.comprehensionQuestions.length > 0) {
          list.push(...l.comprehensionQuestions);
        }
      });
    });

    // Add high quality fallback / curriculum questions if few
    const additionalCurated: QuizQuestion[] = [
      // First Intermediate specific questions
      {
        id: 'cur_m1_1',
        question: 'ما علامة رفع المبتدأ والخبر إذا كانا جمع مذكر سالم في جملة (المُسْلِمُونَ صَادِقُونَ)؟',
        options: ['الواو', 'الألف', 'الضمة', 'النون'],
        correctIndex: 0,
        explanation: 'يرفع المبتدأ والخبر بالواو إذا كانا جمع مذكر سالم أو من الأسماء الخمسة.'
      },
      {
        id: 'cur_m1_2',
        question: 'ما نوع الهمزة في كلمة (اسْتَغْفَرَ) ولماذا؟',
        options: ['همزة وصل؛ لأنها ماضي فعل سداسي', 'همزة قطع؛ لأنها اسم', 'همزة متوسطة', 'همزة متطرفة'],
        correctIndex: 0,
        explanation: 'همزة الوصل تكون في ماضي وأمر ومصدر الفعلين الخماسي والسداسي.'
      },
      {
        id: 'cur_m1_3',
        question: 'ما عمل كان وأخواتها عند دخولها على الجملة الاسمية؟',
        options: [
          'ترفع المبتدأ ويسمى اسمها، وتنصب الخبر ويسمى خبرها',
          'تنصب المبتدأ وترفع الخبر',
          'تجزم المبتدأ والخبر',
          'تجر المبتدأ وتنصب الخبر'
        ],
        correctIndex: 0,
        explanation: 'كان وأخواتها أفعال ناسخة ترفع المبتدأ اسماً لها وتنصب الخبر خبراً لها.'
      },
      {
        id: 'cur_m1_4',
        question: 'ما صيغة أسلوب الأمر في قوله تعالى: ﴿وَلْيَتَلَطَّفْ﴾؟',
        options: ['الفعل المضارع المقترن بلام الأمر الجازمة', 'فعل أمر صريح', 'اسم فعل أمر', 'مصدر نائب عن فعل الأمر'],
        correctIndex: 0,
        explanation: 'صيغة الأمر هنا هي الفعل المضارع المقترن بلام الأمر الجازمة المكسورة.'
      },
      {
        id: 'cur_m1_5',
        question: 'ما إعراب كلمة (الوَطَنَ) في جملة: (إِنَّ الوَطَنَ عَزِيزٌ)؟',
        options: ['اسم إن منصوب وعلامة نصبه الفتحة', 'مبتدأ مرفوع بالضمة', 'خبر إن مرفوع', 'فاعل مرفوع بالضمة'],
        correctIndex: 0,
        explanation: 'إنَّ حرف ناسخ ينصب المبتدأ اسماً له، فالوطنَ اسم إن منصوب بالفتحة.'
      },
      {
        id: 'cur_m1_6',
        question: 'التاء في كلمة (مَعْلَمَاتٌ) هي تاء مفتوحة لأنها:',
        options: ['في جمع مؤنث سالم', 'في فعل ماضٍ', 'في اسم ثلاثي ساكن الوسط', 'في حرف'],
        correctIndex: 0,
        explanation: 'جمع المؤنث السالم ينتهي بتاء مفتوحة تنطق تاءً وصلاً ووقفاً.'
      },
      {
        id: 'cur_m1_7',
        question: 'ما اسم الإشارة المناسب للإشارة إلى المثنى المؤنث؟',
        options: ['هَاتَانِ / هَاتَيْنِ', 'هَذَانِ', 'هَؤُلَاءِ', 'تِلْكَ'],
        correctIndex: 0,
        explanation: '(هاتان) للمثنى المؤنث في حالة الرفع، و(هاتين) في حالتي النصب والجر.'
      },
      {
        id: 'cur_m1_8',
        question: 'أي الكلمات التالية تحوي مداً بالألف؟',
        options: ['كِتَابٌ', 'مَطَرٌ', 'سَفَرٌ', 'قَلَمٌ'],
        correctIndex: 0,
        explanation: 'كلمة (كِتَابٌ) تحوي فتحة على التاء تليها ألف المد الساكنة (تَا).'
      },
      {
        id: 'cur_m1_9',
        question: 'ما نوع اللام في كلمة (الشَّمْسُ)؟',
        options: ['لام شمسية تدغم في الحرف الذي بعدها', 'لام قمرية مظهرة', 'حرف جر أصلي', 'ألف مد'],
        correctIndex: 0,
        explanation: 'اللام الشمسية تكتب ولا تنطق ويكون الحرف بعدها مشدداً.'
      },
      {
        id: 'cur_m1_10',
        question: 'ما علامة نصب جمع المذكر السالم؟',
        options: ['الياء', 'الفتحة', 'الألف', 'الكسرة'],
        correctIndex: 0,
        explanation: 'ينصب جمع المذكر السالم وتكون علامة نصبه الياء نيابة عن الفتحة.'
      }
    ];

    return [...list, ...additionalCurated];
  }, [currentGradeData]);

  // Generate a random 5-question test round
  const generateNewRound = () => {
    // Shuffle questions
    const shuffled = [...gradeQuestions].sort(() => 0.5 - Math.random());
    const roundQuestions = shuffled.slice(0, 5);
    setCurrentSessionQuestions(roundQuestions);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setTestFinished(false);
    setTestPassed(false);
    setUserAnswersHistory([]);
  };

  // Initialize round on mount or grade change
  useEffect(() => {
    generateNewRound();
  }, [currentGrade, gradeQuestions.length]);

  const currentQ = currentSessionQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    audioManager.play('click');
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted || !currentQ) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedAnswer === currentQ.correctIndex;
    setUserAnswersHistory((prev) => [
      ...prev,
      { question: currentQ.question, isCorrect }
    ]);

    if (isCorrect) {
      audioManager.playCorrect();
      setScore((prev) => prev + 1);
      onAddStars(5);
    } else {
      audioManager.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < currentSessionQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Test finished! Evaluate score
      const finalScore = score + (selectedAnswer === currentQ?.correctIndex ? 0 : 0);
      const passed = finalScore >= 4; // 80% passing grade (4 out of 5)
      setTestFinished(true);
      setTestPassed(passed);

      if (passed) {
        audioManager.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onQuizCompleted(`round_${currentGrade}_${Date.now()}`);

        // Update streak
        const newStreak = consecutiveStreak + 1;
        setConsecutiveStreak(newStreak);
        try {
          localStorage.setItem('lughati_quiz_streak', newStreak.toString());
        } catch (e) {}

        // Check if student reached 5 consecutive quizzes!
        if (newStreak >= 5) {
          // Award Excellence Medal!
          const newMedals = totalExcellenceMedals + 1;
          setTotalExcellenceMedals(newMedals);
          setConsecutiveStreak(0); // Reset streak for next medal
          try {
            localStorage.setItem('lughati_excellence_medals', newMedals.toString());
            localStorage.setItem('lughati_quiz_streak', '0');
          } catch (e) {}

          // Trigger massive celebration & Open celebration modal!
          setTimeout(() => {
            setShowCelebrationModal(true);
            audioManager.playFanfare();
            triggerGrandConfetti();
          }, 600);
        }
      } else {
        // Reset streak on failed quiz
        setConsecutiveStreak(0);
        try {
          localStorage.setItem('lughati_quiz_streak', '0');
        } catch (e) {}
      }
    }
  };

  // Grand celebration confetti for Excellence Medal
  const triggerGrandConfetti = () => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Interactive Evaluation Top Dashboard */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 mb-8 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black mb-3 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>نِظَامُ التَّقْيِيمِ التَّفَاعُلِيِّ • بَنْكُ التَّمَارِينِ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-alexandria">
              تحدي مهارات ({currentGradeData.name})
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
              أكمل ٥ اختبارات متتالية بنجاح (٤/٥ على الأقل في كل اختبار) لتحصل على <strong className="text-amber-300 underline underline-offset-4 font-bold">«مِيدَالِيَّةَ التَّمَيُّزِ»</strong> الفخمة!
            </p>
          </div>

          {/* Excellence Medals & Stats Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Medals Showcase Card */}
            <div 
              onClick={() => {
                if (totalExcellenceMedals > 0) setShowCelebrationModal(true);
              }}
              className={`flex-1 md:flex-initial flex items-center gap-3 p-3.5 rounded-2xl border backdrop-blur-md transition-all ${
                totalExcellenceMedals > 0 
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 cursor-pointer hover:bg-amber-400/25 shadow-lg' 
                  : 'bg-white/10 border-white/20 text-slate-300'
              }`}
              title={totalExcellenceMedals > 0 ? "انقر لعرض وسام التميز" : "أكمل 5 اختبارات متتالية لتحصل عليها"}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                🏅
              </div>
              <div className="text-right">
                <p className="text-[11px] text-amber-200/80 font-bold">ميداليات التميز</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-amber-300">{totalExcellenceMedals}</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-black">أوسمة</span>
                </div>
              </div>
            </div>

            {/* Current Score in Round */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[11px] text-emerald-200 font-bold">نتيجة الجولة</p>
                <p className="text-xl font-black text-white">{score} / {currentSessionQuestions.length || 5}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Streak Consecutive Evaluation Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${consecutiveStreak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-black text-white">
                سلسلة النجاح المتتالي لميدالية التميز:
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                {consecutiveStreak} من ٥ اختبارات
              </span>
            </div>
            <span className="text-[11px] text-emerald-200">
              {5 - consecutiveStreak === 0 
                ? '🌟 مبروك! حققت الهدف وستحصل على الميدالية!' 
                : `متبقٍ ${5 - consecutiveStreak} اختبارات متتالية لتحقيق وسام التميز 🏅`}
            </span>
          </div>

          {/* 5 Interactive Streak Trackers */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((step) => {
              const isAchieved = consecutiveStreak >= step;
              const isCurrent = consecutiveStreak + 1 === step;

              return (
                <div 
                  key={step}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isAchieved
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md font-black scale-102 ring-2 ring-amber-300/40'
                      : isCurrent
                      ? 'bg-emerald-800/80 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 font-bold animate-pulse'
                      : 'bg-white/5 border-white/10 text-slate-400 font-medium'
                  }`}
                >
                  <span className="text-sm sm:text-base">
                    {isAchieved ? '⭐' : step === 5 ? '🏅' : '○'}
                  </span>
                  <span className="text-[10px] sm:text-xs">
                    اختبار {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Quiz Card Arena */}
      {!testFinished && currentQ ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
          {/* Header of Round: Question Index & Progress Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200">
                السؤال {currentIdx + 1} من {currentSessionQuestions.length}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium text-[11px]">
                اختبار قياس الكفاءة
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-emerald-700">
                {Math.round(((currentIdx + 1) / currentSessionQuestions.length) * 100)}%
              </span>
              <div className="w-32 sm:w-44 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / currentSessionQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Text & Arabic Speaker */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-bold font-amiri text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
              <button
                id="btn-speak-quiz-question"
                onClick={() => audioManager.speakArabic(currentQ.question)}
                className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-transform active:scale-95 shrink-0"
                title="استمع لنطق السؤال بالصوت العربي الفصيح"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswer === oIdx;
              const isCorrect = isAnswerSubmitted && oIdx === currentQ.correctIndex;
              const isWrong = isAnswerSubmitted && isSelected && oIdx !== currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
              if (isSelected && !isAnswerSubmitted) {
                btnStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold';
              } else if (isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs';
              } else if (isWrong) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold shadow-xs';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between group active:scale-98 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-xs font-bold flex items-center justify-center text-slate-600 group-hover:border-emerald-500 shrink-0">
                      {oIdx === 0 ? 'أ' : oIdx === 1 ? 'ب' : oIdx === 2 ? 'ج' : 'د'}
                    </span>
                    <span className="text-base font-amiri font-bold">{opt}</span>
                  </div>

                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Alert when submitted */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl mb-6 border text-xs sm:text-sm font-medium animate-in fade-in duration-200 ${
              selectedAnswer === currentQ.correctIndex
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="font-bold block mb-1">
                {selectedAnswer === currentQ.correctIndex ? '🌟 إجابة صحيحة وممتازة!' : '💡 توضيح القاعدة والحل الصحيح:'}
              </span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'انقر للمتابعة للسؤال التالي' : 'اختر الإجابة الصحيحة ثم انقر تحقق'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                id="btn-check-quiz-answer"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                تحقق من الإجابة
              </button>
            ) : (
              <button
                id="btn-next-quiz-question"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIdx + 1 === currentSessionQuestions.length ? 'إنهاء التقييم وعرض النتيجة' : 'السؤال التالي'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Round Result Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner ${
            testPassed ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {testPassed ? '🏆' : '📚'}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-alexandria mb-2">
            {testPassed ? 'مبارك يا بطل! اجتزت الاختبار بنجاح' : 'محاولة جيدة، واصل التدريب!'}
          </h3>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
            لقد حققت <span className="font-bold text-emerald-700 text-lg">{score}</span> من أصل <span className="font-bold text-lg">{currentSessionQuestions.length}</span> في اختبار مهارات {currentGradeData.name}.
          </p>

          {/* Consecutive Streak Update Notice */}
          <div className={`p-4 rounded-2xl max-w-md mx-auto mb-8 border text-right text-xs sm:text-sm ${
            testPassed
              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {testPassed ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-amber-900 font-black">
                    تمت إضافة هذا الاختبار إلى سلسلة التميز!
                  </p>
                  <p className="text-amber-800 text-[11px] font-normal mt-0.5">
                    سلسلتك الحالية: ({consecutiveStreak} من ٥ متتالية). {5 - consecutiveStreak > 0 ? `متبقٍ ${5 - consecutiveStreak} فقط نحو وسام التميز!` : 'حققت الهدف بنجاح!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-slate-900 font-bold">
                    تحتاج ٤ درجات على الأقل لإكمال سلسلة التميز
                  </p>
                  <p className="text-slate-600 text-[11px] font-normal mt-0.5">
                    لا تقلق، يمكنك إعادة الاختبار فوراً لتبدأ سلسلة نجاحات متتالية جديدة!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              id="btn-restart-quiz-round"
              onClick={generateNewRound}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بدء اختبار جديد (٥ أسئلة)</span>
            </button>

            {totalExcellenceMedals > 0 && (
              <button
                onClick={() => setShowCelebrationModal(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>🏅 عرض ميدالية التميز</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CELEBRATION MODAL FOR ACHIEVING 5 CONSECUTIVE QUIZZES (EXCELLENCE MEDAL)   */}
      {/* ========================================================================= */}
      {showCelebrationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowCelebrationModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-gradient-to-b from-white via-amber-50/40 to-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden animate-in zoom-in-95 duration-200 text-center p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button (X) */}
            <button
              id="close-celebration-modal-btn"
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق النافذة الاحتفالية"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Shining 3D Excellence Medal Asset */}
            <div className="relative mx-auto w-32 h-32 mb-4 flex items-center justify-center">
              {/* Rotating sunburst aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/30 to-amber-500/40 animate-spin duration-1000 blur-md"></div>
              
              {/* Gold Medal Outer Ring */}
              <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-yellow-200 shadow-2xl flex flex-col items-center justify-center p-2 text-slate-950 transform hover:scale-105 transition-transform">
                <span className="text-4xl drop-shadow-md">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-full mt-1 border border-amber-300">
                  ميدالية التميز
                </span>
              </div>

              {/* Saudi Green Ribbon hanging from medal */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
                <div className="w-4 h-6 bg-emerald-700 rounded-b-md shadow-md -rotate-12 border-t-2 border-emerald-900"></div>
                <div className="w-4 h-6 bg-emerald-700 rounded-b-md shadow-md rotate-12 border-t-2 border-emerald-900"></div>
              </div>
            </div>

            {/* Title & Celebration Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>إِنْجَازٌ اسْتِثْنَائِيٌّ فَرِيدٌ</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-alexandria mb-2">
              مَبْرُوكٌ يَا بَطَل! حَصَلْتَ عَلَى مِيدَالِيَّةِ التَّمَيُّزِ 🏅
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
              تقديراً لإنجازك العلمي الباهر بإكمال <strong className="text-emerald-700 font-extrabold">٥ اختبارات متتالية بنجاح فائق</strong> دون انقطاع في بنك التمارين!
            </p>

            {/* Official Certificate Card Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-amber-400 text-white text-right mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇸🇦</span>
                  <span className="text-[11px] font-bold text-emerald-300">منصة لغتي التعليمية المعتمدة</span>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  وسام فخري معتمد
                </span>
              </div>

              <p className="text-xs text-amber-300 font-semibold mb-1">تُمنح هذه الميدالية بفخر واعتزاز إلى:</p>
              <h4 className="text-lg sm:text-xl font-black text-white font-alexandria mb-2">
                {studentName} ⭐
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                لكفاءته المتميزة في استيعاب مقررات {currentGradeData.name}، وإتقان المهارات النحوية والإملائية والفهم القرائي بجدارة واستحقاق.
              </p>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-200">
                <span>سلسلة النجاح: ٥/٥ اختبارات متتالية 🔥</span>
                <span>إجمالي الميداليات: {totalExcellenceMedals} 🏅</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="celebration-continue-btn"
                onClick={() => {
                  setShowCelebrationModal(false);
                  generateNewRound();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>متابعة التحدي لميدالية جديدة 🚀</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>طباعة الشهادة 🖨️</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
