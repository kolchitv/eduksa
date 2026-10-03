import React, { useState, useEffect } from 'react';
import { 
  CENTRAL_SPELLING_WORDS, 
  WordSpellingItem 
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
  Puzzle, 
  Check, 
  Sparkles,
  Trophy,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuildWordAndSpellingGameProps {
  initialSubGameIndex?: number;
  onFinishLevel: (accuracy: number, stars: number) => void;
  onBackToMap: () => void;
}

export const BuildWordAndSpellingGame: React.FC<BuildWordAndSpellingGameProps> = ({
  initialSubGameIndex = 0,
  onFinishLevel,
  onBackToMap
}) => {
  // 8 Sub-games:
  // 0: ابنِ الكلمة (ترتيب الحروف)
  // 1: ابنِ الكلمة بالمقاطع
  // 2: الصورة والكلمة (مطابقة الصورة بالكلمة)
  // 3: الكلمة الناقصة
  // 4: اكتب ما تسمع (إملاء سمعي)
  // 5: الإملاء المصور
  // 6: ذاكرة الكلمات (بطاقات ذاكرة خفيفة)
  // 7: صحح الكلمة (اكتشاف وتصحيح الخطأ الإملائي)
  const [activeGameIdx, setActiveGameIdx] = useState<number>(initialSubGameIndex);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isLevelDone, setIsLevelDone] = useState<boolean>(false);

  // User input states
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');

  const totalRounds = 5;
  const currentWordItem: WordSpellingItem = CENTRAL_SPELLING_WORDS[currentRound % CENTRAL_SPELLING_WORDS.length];

  // Scrambled letters/syllables for building
  const [scrambledUnits, setScrambledUnits] = useState<string[]>([]);

  useEffect(() => {
    setupRound();
  }, [currentRound, activeGameIdx]);

  const setupRound = () => {
    setFeedbackMsg('');
    setPlacedLetters([]);
    setTypedInput('');

    if (activeGameIdx === 0) {
      // Scramble letters with 1 distractor
      const list = [...currentWordItem.letters, currentWordItem.distractorLetters[0]];
      setScrambledUnits(list.sort(() => 0.5 - Math.random()));
    } else if (activeGameIdx === 1) {
      // Scramble syllables
      setScrambledUnits([...currentWordItem.syllables].sort(() => 0.5 - Math.random()));
    } else if (activeGameIdx === 4 || activeGameIdx === 5) {
      setTimeout(() => {
        audioManager.speakArabic(`اكتب كلمة: ${currentWordItem.tashkeel}`, 0.85);
      }, 300);
    }
  };

  const handleHearWord = () => {
    audioManager.speakArabic(currentWordItem.tashkeel, 0.85);
  };

  const handleSelectAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedbackMsg(playSuccessFeedback(1));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      recordMastery('word', currentWordItem.tashkeel);

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
      recordMistake('spelling', currentWordItem.word);
    }
  };

  const handleLevelComplete = () => {
    const accuracy = Math.round(((score + 1) / totalRounds) * 100);
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 2;
    setIsLevelDone(true);
    addTrackProgress('words_spelling', stars, activeGameIdx, accuracy);
    onFinishLevel(accuracy, stars);
  };

  const titles = [
    '١. ابنِ الكلمة بالحروف 🧩',
    '٢. ابنِ الكلمة بالمقاطع 🧱',
    '٣. الصورة والكلمة 🖼️',
    '٤. الكلمة الناقصة ✍️',
    '٥. اكتب ما تسمع (إملاء ذكي) 🎧',
    '٦. الإملاء المصور 📸',
    '٧. ذاكرة الكلمات 🧠',
    '٨. صحح الكلمة 🔍'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-purple-100 flex items-center justify-between gap-4">
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
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800">
                عالم الكلمات والإملاء 🧩
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

        <div className="px-3.5 py-1.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-black text-xs flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>النقاط: {score}</span>
        </div>
      </div>

      {!isLevelDone ? (
        <div className="space-y-6">
          {/* Main Stage Banner */}
          <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleHearWord}
                className="px-4 py-2 rounded-2xl bg-white text-purple-950 font-black text-xs shadow-md hover:bg-purple-50 transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-purple-700" />
                <span>استمع للكلمة 🔊</span>
              </button>
            </div>

            {/* Visual Word / Emoji Header */}
            <div className="space-y-2">
              <div className="text-5xl sm:text-6xl">{currentWordItem.emoji}</div>

              {/* Sub-game 0 & 1: Placed boxes */}
              {(activeGameIdx === 0 || activeGameIdx === 1) && (
                <div className="space-y-2">
                  <span className="text-xs text-purple-200 font-bold block">
                    {activeGameIdx === 0 ? 'رتب الحروف لتكون الكلمة:' : 'رتب المقاطع لتكون الكلمة:'}
                  </span>

                  <div className="flex items-center justify-center gap-2 min-h-16 p-3 bg-white/20 rounded-2xl border-2 border-dashed border-white/40 flex-wrap">
                    {placedLetters.length === 0 ? (
                      <span className="text-xs text-purple-100">انقر على القطع بالأسفل لترتيبها هنا...</span>
                    ) : (
                      placedLetters.map((item, idx) => (
                        <span
                          key={idx}
                          onClick={() => setPlacedLetters((prev) => prev.filter((_, i) => i !== idx))}
                          className="px-3.5 py-1.5 bg-white text-slate-900 rounded-xl text-2xl font-black font-amiri shadow-xs cursor-pointer hover:bg-rose-50"
                          title="اضغط للإزالة"
                        >
                          {item} ✕
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Sub-game 2: Picture & Word */}
              {activeGameIdx === 2 && (
                <p className="text-lg font-black font-alexandria">
                  ما الكلمة المناسبة لهذه الصورة {currentWordItem.emoji}؟
                </p>
              )}

              {/* Sub-game 3: Missing letter */}
              {activeGameIdx === 3 && (
                <div className="text-3xl sm:text-4xl font-black font-amiri tracking-wider">
                  {currentWordItem.letters[0]} + ... + {currentWordItem.letters[currentWordItem.letters.length - 1]}
                </div>
              )}

              {/* Sub-game 7: Correct the error */}
              {activeGameIdx === 7 && (
                <div className="space-y-1">
                  <span className="text-xs text-purple-200 font-bold">هل الكلمة مكتوبة بشكل صحيح؟</span>
                  <div className="text-3xl font-black font-amiri">
                    {currentRound % 2 === 0 ? currentWordItem.tashkeel : currentWordItem.tashkeel.replace('س', 'ص')}
                  </div>
                </div>
              )}
            </div>

            {feedbackMsg && (
              <div className="inline-block px-4 py-1.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-md animate-bounce">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Interactive Choices Area */}
          {(activeGameIdx === 0 || activeGameIdx === 1) ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {scrambledUnits.map((unit, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      audioManager.speakArabic(unit, 0.85);
                      setPlacedLetters((prev) => [...prev, unit]);
                    }}
                    className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-400 text-3xl font-black font-amiri text-slate-900 shadow-xs cursor-pointer active:scale-95"
                  >
                    {unit}
                  </button>
                ))}
              </div>

              <div className="text-center pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const target = activeGameIdx === 0 ? currentWordItem.letters.join('') : currentWordItem.syllables.join('');
                    const isCorrect = placedLetters.join('') === target;
                    handleSelectAnswer(isCorrect);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition cursor-pointer shadow-md"
                >
                  تأكيد بناء الكلمة ✅
                </button>

                <button
                  onClick={() => setPlacedLetters([])}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  تفريغ
                </button>
              </div>
            </div>
          ) : (activeGameIdx === 4 || activeGameIdx === 5) ? (
            /* Dictation (Write What You Hear) */
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="اكتب الكلمة هنا..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 bg-white font-black text-lg text-center text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const clean = (s: string) => s.replace(/[\u064B-\u065F\u0670]/g, '').trim();
                    const isCorrect = clean(typedInput) === clean(currentWordItem.word) || clean(typedInput) === clean(currentWordItem.tashkeel);
                    handleSelectAnswer(isCorrect);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition cursor-pointer shadow-md"
                >
                  تأكيد الإملاء ✅
                </button>
              </div>
            </div>
          ) : activeGameIdx === 7 ? (
            /* Error Correction choices */
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <button
                onClick={() => handleSelectAnswer(currentRound % 2 === 0)}
                className="h-20 rounded-3xl bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 shadow-sm text-base font-black text-emerald-800 transition cursor-pointer"
              >
                صحيحة تماماً ✓
              </button>

              <button
                onClick={() => handleSelectAnswer(currentRound % 2 !== 0)}
                className="h-20 rounded-3xl bg-white hover:bg-rose-50 border-2 border-slate-200 hover:border-rose-400 shadow-sm text-base font-black text-rose-800 transition cursor-pointer"
              >
                تحتاج لتصحيح ✕
              </button>
            </div>
          ) : (
            /* Multi-choice Picture Match */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
              {[currentWordItem.tashkeel, 'سَمَكَةٌ', 'مَدْرَسَةٌ'].sort(() => 0.5 - Math.random()).map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(w === currentWordItem.tashkeel)}
                  className="p-4 rounded-3xl bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-400 shadow-sm text-center transition cursor-pointer active:scale-95 group"
                >
                  <span className="text-2xl font-black font-amiri text-slate-900 group-hover:text-purple-700 transition-colors">
                    {w}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🧩
          </div>
          <h3 className="text-2xl font-black font-alexandria text-slate-900">
            أحسنت يا بطل الكلمات والإملاء!
          </h3>
          <p className="text-sm font-bold text-slate-600">
            لقد تميزت في بناء الكلمات والتهجي الصحيح وجمعت نجوم التميز!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentRound(0);
                setScore(0);
                setIsLevelDone(false);
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعب</span>
            </button>

            <button
              onClick={onBackToMap}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition cursor-pointer shadow-md"
            >
              متابعة الرحلة ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
