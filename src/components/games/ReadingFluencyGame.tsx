import React, { useState, useEffect } from 'react';
import { 
  CENTRAL_FLASH_WORDS, 
  CENTRAL_FLUENCY_SENTENCES, 
  CENTRAL_SHORT_STORIES, 
  FlashWordItem, 
  FluencySentenceItem, 
  ShortStoryItem 
} from '../../data/learningGamesData';
import { audioManager } from '../../utils/audio';
import { 
  playGentleFeedback, 
  playSuccessFeedback, 
  recordMistake, 
  recordMastery,
  addTrackProgress 
} from '../../utils/adaptiveGameEngine';
import { 
  Volume2, 
  Star, 
  RotateCcw, 
  ArrowRight, 
  Car, 
  Eye, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Check, 
  Timer 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadingFluencyGameProps {
  initialSubGameIndex?: number;
  onFinishLevel: (accuracy: number, stars: number) => void;
  onBackToMap: () => void;
}

export const ReadingFluencyGame: React.FC<ReadingFluencyGameProps> = ({
  initialSubGameIndex = 0,
  onFinishLevel,
  onBackToMap
}) => {
  // 8 Sub-games:
  // 0: القراءة البرقية (تظهر لعدة ثوان ثم تختفي)
  // 1: اقرأ بسرعة (كلمات مألوفة)
  // 2: سباق القراءة (سيارة تتحرك بدون توتر)
  // 3: اقرأ واختر الصورة
  // 4: اقرأ الجملة واختر معناها
  // 5: الجملة المختفية (تختفي تدريجيا)
  // 6: القراءة المتكررة (محاولة 1 و 2 و 3 وإظهار التحسن الإيجابي)
  // 7: قصة قصيرة وسؤالان للفهم
  const [activeGameIdx, setActiveGameIdx] = useState<number>(initialSubGameIndex);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isLevelDone, setIsLevelDone] = useState<boolean>(false);

  // Flash word visibility
  const [flashVisible, setFlashVisible] = useState<boolean>(true);
  const [carPositionPercent, setCarPositionPercent] = useState<number>(10);

  // Repeated reading tries
  const [repeatedTries, setRepeatedTries] = useState<number[]>([]);

  const totalRounds = 4;
  const currentFlashItem: FlashWordItem = CENTRAL_FLASH_WORDS[currentRound % CENTRAL_FLASH_WORDS.length];
  const currentSentenceItem: FluencySentenceItem = CENTRAL_FLUENCY_SENTENCES[currentRound % CENTRAL_FLUENCY_SENTENCES.length];
  const currentStory: ShortStoryItem = CENTRAL_SHORT_STORIES[currentRound % CENTRAL_SHORT_STORIES.length];

  useEffect(() => {
    setFeedbackMsg('');
    setFlashVisible(true);

    if (activeGameIdx === 0) {
      // Flash word disappears after 2.5 seconds
      const timer = setTimeout(() => {
        setFlashVisible(false);
      }, (currentFlashItem.exposureSeconds || 2.5) * 1000);
      return () => clearTimeout(timer);
    } else if (activeGameIdx === 5) {
      // Disappearing sentence fades after 4 seconds
      const timer = setTimeout(() => {
        setFlashVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, activeGameIdx]);

  const handleSelectAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedbackMsg(playSuccessFeedback(1));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      setCarPositionPercent((prev) => Math.min(90, prev + 25));

      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          handleLevelComplete();
        } else {
          setCurrentRound((r) => r + 1);
          setAttempts(0);
        }
      }, 1000);
    } else {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);
      const msg = playGentleFeedback(nextAttempt);
      setFeedbackMsg(msg);
      recordMistake('reading_slow', currentSentenceItem.sentence);
    }
  };

  const handleLogRepeatedReadingTry = () => {
    // Record try with improving time
    const simulatedSeconds = [5.5, 4.2, 3.1];
    const newTries = [...repeatedTries, simulatedSeconds[repeatedTries.length] || 3.0];
    setRepeatedTries(newTries);
    audioManager.speakArabic(
      newTries.length === 1 ? 'محاولة أولى رائعة!' : newTries.length === 2 ? 'تحسن ملحوظ وسرعة أكبر!' : 'ممتاز جداً! أصبحت قراءتك سلسة وسريعة!',
      0.9
    );

    if (newTries.length >= 3) {
      handleSelectAnswer(true);
    }
  };

  const handleLevelComplete = () => {
    const accuracy = Math.round(((score + 1) / totalRounds) * 100);
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 2;
    setIsLevelDone(true);
    addTrackProgress('reading_fluency', stars, activeGameIdx, accuracy);
    onFinishLevel(accuracy, stars);
  };

  const titles = [
    '١. القراءة البرقية ⚡',
    '٢. اقرأ بسرعة وانطلاق 🚀',
    '٣. سباق القراءة الممتع 🏎️',
    '٤. اقرأ واختر الصورة 🖼️',
    '٥. اقرأ الجملة وافهم معناها 💡',
    '٦. الجملة المختفية 👻',
    '٧. القراءة المتكررة والتحسن 📈',
    '٨. قصة قصيرة وفهم قرائي 📖'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-rose-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="العودة للخريطة"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800">
                عالم القراءة والطلاقة 📖
              </span>
              <span className="text-xs font-bold text-slate-400">
                جولة {currentRound + 1} من {totalRounds}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-0.5">
              {titles[activeGameIdx]}
            </h3>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-black text-xs flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>النقاط: {score}</span>
        </div>
      </div>

      {!isLevelDone ? (
        <div className="space-y-6">
          {/* Main Stage Banner */}
          <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
            {/* Sub-game 0: Flash Reading */}
            {activeGameIdx === 0 && (
              <div className="space-y-3">
                <span className="text-xs text-rose-100 font-bold block">
                  انظر سريعاً للكلمة قبل أن تختفي! ⚡
                </span>

                <div className="h-28 flex items-center justify-center">
                  {flashVisible ? (
                    <div className="text-4xl sm:text-5xl font-black font-amiri bg-white/20 px-8 py-3 rounded-2xl border-2 border-white/40 shadow-inner animate-in zoom-in-95">
                      {currentFlashItem.tashkeel}
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-rose-200 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>اختفت الكلمة! ما الكلمة التي رأيتها؟</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-game 2: Reading Race (Car Track) */}
            {activeGameIdx === 2 && (
              <div className="space-y-3">
                <span className="text-xs text-rose-100 font-bold block">
                  سباق القراءة الهادئ 🏎️ (كل إجابة صحيحة تحرك سيارتك نحو خط النهاية)
                </span>

                {/* Road Canvas */}
                <div className="relative w-full h-14 bg-slate-900/60 rounded-2xl border border-white/20 overflow-hidden flex items-center px-4">
                  <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-white/30" />
                  <div
                    className="absolute transition-all duration-700 text-3xl"
                    style={{ right: `${carPositionPercent}%` }}
                  >
                    🏎️
                  </div>
                  <span className="absolute left-3 text-2xl">🏁</span>
                </div>

                <div className="text-2xl sm:text-3xl font-black font-amiri pt-2">
                  «{currentSentenceItem.sentence}»
                </div>
              </div>
            )}

            {/* Sub-game 5: Disappearing Sentence */}
            {activeGameIdx === 5 && (
              <div className="space-y-3">
                <span className="text-xs text-rose-100 font-bold block">
                  اقرأ الجملة قبل أن تختفي تدريجياً 👻
                </span>
                <div className="min-h-16 flex items-center justify-center">
                  <p className={`text-2xl sm:text-3xl font-black font-amiri transition-opacity duration-1000 ${
                    flashVisible ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {currentSentenceItem.sentence}
                  </p>
                </div>
              </div>
            )}

            {/* Sub-game 6: Repeated Reading (3 tries with positive progress tracking) */}
            {activeGameIdx === 6 && (
              <div className="space-y-3">
                <span className="text-xs text-rose-100 font-bold block">
                  القراءة المتكررة (اقرأ الجملة ٣ مرات ولاحظ كيف تصبح أسرع وأسلس!)
                </span>

                <div className="text-2xl sm:text-3xl font-black font-amiri bg-white/10 p-4 rounded-2xl border border-white/20">
                  {currentSentenceItem.sentence}
                </div>

                {/* Progress of the 3 tries */}
                <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2">
                  {[0, 1, 2].map((idx) => {
                    const isDone = repeatedTries[idx] !== undefined;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-center ${
                          isDone ? 'bg-white text-slate-900 border-white font-black' : 'bg-white/10 text-rose-100 border-white/20'
                        }`}
                      >
                        <span className="text-[10px] block opacity-75">المحاولة {idx + 1}</span>
                        <span className="text-xs font-black">
                          {isDone ? `⏱️ ${repeatedTries[idx]} ثانية ✓` : 'قيد الانتظار'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-game 7: Short Story with Comprehension */}
            {activeGameIdx === 7 && (
              <div className="space-y-3 text-right max-w-2xl mx-auto">
                <div className="text-center font-black text-xl font-alexandria">
                  {currentStory.title}
                </div>

                <div className="bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/20 space-y-2 text-base sm:text-lg font-amiri leading-relaxed">
                  {currentStory.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                <button
                  onClick={() => audioManager.speakArabic(currentStory.paragraphs.join(' '), 0.85)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-rose-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                  <span>استمع للقصة كاملة</span>
                </button>
              </div>
            )}

            {/* Default Sentence view for other games */}
            {(activeGameIdx === 1 || activeGameIdx === 3 || activeGameIdx === 4) && (
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-black font-amiri">
                  {currentSentenceItem.sentence}
                </div>
                <button
                  onClick={() => audioManager.speakArabic(currentSentenceItem.sentence, 0.85)}
                  className="px-3 py-1 rounded-xl bg-white text-rose-900 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>استمع 🔊</span>
                </button>
              </div>
            )}

            {feedbackMsg && (
              <div className="inline-block px-4 py-1.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-md animate-bounce">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Interactive Choices Area */}
          {activeGameIdx === 0 ? (
            /* Flash Word Choices */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
              {[currentFlashItem.tashkeel, 'كَتَبَ', 'شَرِبَ'].sort(() => 0.5 - Math.random()).map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(word === currentFlashItem.tashkeel)}
                  className="p-4 rounded-3xl bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-400 shadow-sm text-center transition cursor-pointer active:scale-95"
                >
                  <span className="text-2xl font-black font-amiri text-slate-900">{word}</span>
                </button>
              ))}
            </div>
          ) : activeGameIdx === 6 ? (
            /* Repeated Reading Action Button */
            <div className="text-center pt-2">
              <button
                onClick={handleLogRepeatedReadingTry}
                className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-black text-sm hover:bg-rose-700 transition cursor-pointer shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <span>قرأت الجملة بصوت عالٍ! 🗣️</span>
              </button>
            </div>
          ) : activeGameIdx === 7 ? (
            /* Story Questions Choices */
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">
                ❓ {currentStory.questions[0].prompt}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentStory.questions[0].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(oIdx === currentStory.questions[0].correctIndex)}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-right transition cursor-pointer text-xs font-black text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Sentence meaning / choices */
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">
                ❓ {currentSentenceItem.question.prompt}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentSentenceItem.question.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(oIdx === currentSentenceItem.question.correctIndex)}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-right transition cursor-pointer text-xs font-black text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            📖
          </div>
          <h3 className="text-2xl font-black font-alexandria text-slate-900">
            أحسنت يا بطل القراءة والطلاقة!
          </h3>
          <p className="text-sm font-bold text-slate-600">
            لقد تميزت في القراءة السريعة والفهم القرائي وحققت تقدماً مبهراً!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentRound(0);
                setScore(0);
                setIsLevelDone(false);
                setRepeatedTries([]);
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعب</span>
            </button>

            <button
              onClick={onBackToMap}
              className="px-6 py-2.5 rounded-2xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 transition cursor-pointer shadow-md"
            >
              متابعة الرحلة ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
