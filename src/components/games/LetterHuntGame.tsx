import React, { useState, useEffect } from 'react';
import { 
  CENTRAL_LETTERS_DATA, 
  LetterItem 
} from '../../data/learningGamesData';
import { 
  audioManager 
} from '../../utils/audio';
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
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Train, 
  HelpCircle,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterHuntGameProps {
  initialSubGameIndex?: number;
  onFinishLevel: (accuracy: number, stars: number) => void;
  onBackToMap: () => void;
}

export const LetterHuntGame: React.FC<LetterHuntGameProps> = ({
  initialSubGameIndex = 0,
  onFinishLevel,
  onBackToMap
}) => {
  // 6 Sub-games:
  // 0: صيد الحرف (سمعي)
  // 1: أين الحرف؟ (بحث في شبكة)
  // 2: فرقع البالون (بالونات متحركة لطيفة)
  // 3: اسمع واختر (صوت إلى شكل)
  // 4: قطار الحروف (أول، وسط، آخر الكلمة)
  // 5: طابق الحرف (مطابقة أشكال)
  const [activeGameIdx, setActiveGameIdx] = useState<number>(initialSubGameIndex);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isLevelDone, setIsLevelDone] = useState<boolean>(false);

  // Current Target Letter
  const totalRounds = 5;
  const currentLetter: LetterItem = CENTRAL_LETTERS_DATA[(currentRound + activeGameIdx * 4) % CENTRAL_LETTERS_DATA.length];

  // Distractors
  const [options, setOptions] = useState<string[]>([]);
  const [balloonPopped, setBalloonPopped] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setupRound();
  }, [currentRound, activeGameIdx]);

  const setupRound = () => {
    setFeedbackMsg('');
    setBalloonPopped({});
    const others = CENTRAL_LETTERS_DATA
      .filter((l) => l.char !== currentLetter.char)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((l) => l.char);

    const mixed = [currentLetter.char, ...others].sort(() => 0.5 - Math.random());
    setOptions(mixed);

    // Speak prompt if audio game
    if (activeGameIdx === 0 || activeGameIdx === 3) {
      setTimeout(() => {
        handlePlayTargetSound();
      }, 300);
    }
  };

  const handlePlayTargetSound = () => {
    audioManager.speakArabic(`أين حرف ${currentLetter.name}؟ اسمع: ${currentLetter.soundAudioText}`, 0.85);
  };

  const handleSelectAnswer = (chosenChar: string) => {
    const isCorrect = chosenChar === currentLetter.char;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedbackMsg(playSuccessFeedback(1));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      recordMastery('letter', currentLetter.char);

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
      recordMistake('letter', currentLetter.char);
    }
  };

  const handleLevelComplete = () => {
    const accuracy = Math.round(((score + 1) / totalRounds) * 100);
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 2;
    setIsLevelDone(true);
    addTrackProgress('letters', stars, activeGameIdx, accuracy);
    onFinishLevel(accuracy, stars);
  };

  const titles = [
    '١. صيد الحرف 🎯',
    '٢. أين الحرف؟ 🔍',
    '٣. فرقع البالون 🎈',
    '٤. اسمع واختر 🎧',
    '٥. قطار الحروف 🚂',
    '٦. طابق الحرف 🧩'
  ];

  const descriptions = [
    'استمع إلى اسم الحرف أو صوته ثم اختر الحرف الصحيح من البطاقات.',
    'ابحث عن الحرف المطلوب بين الحروف المتشابهة لتمرن قوة الملاحظة.',
    'اضغط على البالون الملون الذي يحمل الحرف المطلوب ليفرقع بمرح!',
    'استمع لصوت الحرف بدقة ثم اختر شكله المطابق.',
    'حدد موضع الحرف المناسب (أول الكلمة، وسط الكلمة، آخر الكلمة).',
    'طابق شكل الحرف المنفصل بأشكاله داخل الكلمات المختلفة.'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="العودة لخريطة المسار"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                عالم الحروف 🔤
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

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>النقاط: {score}</span>
          </div>
        </div>
      </div>

      {/* Target Letter Display & Prompt */}
      {!isLevelDone && (
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePlayTargetSound}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-md hover:bg-emerald-50 transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>استمع لصوت الحرف 🔊</span>
            </button>
          </div>

          {activeGameIdx !== 3 ? (
            <div className="space-y-1">
              <span className="text-xs text-emerald-100 font-bold block">الحرف المطلوب:</span>
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-3xl border-2 border-white/40 flex items-center justify-center text-5xl font-black font-amiri shadow-inner">
                {currentLetter.char}
              </div>
              <p className="text-sm font-bold text-emerald-100">
                حرف ({currentLetter.name}) — مثل: {currentLetter.sampleWords.initial.word} {currentLetter.sampleWords.initial.emoji}
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <p className="text-base sm:text-lg font-black font-alexandria">
                🎧 استمع للصوت ثم اختر الحرف الصحيح من الأسفل:
              </p>
            </div>
          )}

          {feedbackMsg && (
            <div className="inline-block px-4 py-1.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-md animate-bounce">
              {feedbackMsg}
            </div>
          )}
        </div>
      )}

      {/* Game Interactive Area */}
      {!isLevelDone ? (
        <div className="space-y-4">
          {/* Sub-game 2: Balloon Game */}
          {activeGameIdx === 2 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <p className="text-xs font-bold text-slate-500 text-center mb-6">
                🎈 انقر على البالون الذي يحمل حرف ({currentLetter.char}):
              </p>

              <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap py-4">
                {options.map((char, idx) => {
                  const isPopped = !!balloonPopped[idx];
                  const balloonColors = [
                    'bg-rose-400 hover:bg-rose-500 border-rose-300',
                    'bg-sky-400 hover:bg-sky-500 border-sky-300',
                    'bg-amber-400 hover:bg-amber-500 border-amber-300',
                    'bg-emerald-400 hover:bg-emerald-500 border-emerald-300'
                  ];

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      <button
                        onClick={() => {
                          setBalloonPopped((p) => ({ ...p, [idx]: true }));
                          audioManager.play('click');
                          handleSelectAnswer(char);
                        }}
                        className={`w-20 h-26 sm:w-24 sm:h-32 rounded-t-full rounded-b-3xl border-4 text-white font-black text-3xl sm:text-4xl shadow-md transition-all transform hover:-translate-y-2 cursor-pointer flex items-center justify-center ${
                          balloonColors[idx % balloonColors.length]
                        } ${isPopped ? 'scale-0 opacity-0 duration-300' : 'duration-150'}`}
                      >
                        {char}
                      </button>
                      <div className="w-1 h-8 bg-slate-300 mt-1" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeGameIdx === 4 ? (
            /* Sub-game 4: Letter Train (مواضع الحرف في الكلمة) */
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  مواضع الحرف في الكلمة 🚂
                </span>
                <p className="text-sm font-bold text-slate-700 mt-2">
                  أين يقع حرف ({currentLetter.char}) في كلمة: «{currentLetter.sampleWords.medial.word}» {currentLetter.sampleWords.medial.emoji}؟
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                {[
                  { pos: 'initial', label: 'أول الكلمة', shape: currentLetter.positions.initial },
                  { pos: 'medial', label: 'وسط الكلمة', shape: currentLetter.positions.medial },
                  { pos: 'final', label: 'آخر الكلمة', shape: currentLetter.positions.final }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      // Correct answer for medial sample is 'medial'
                      handleSelectAnswer(currentLetter.char);
                    }}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/50 transition cursor-pointer text-center group"
                  >
                    <span className="text-3xl font-black font-amiri text-slate-900 block group-hover:scale-110 transition-transform">
                      {item.shape}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mt-1 block">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Standard Pick Choice (صيد الحرف، أين الحرف، اسمع واختر) */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {options.map((char, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(char)}
                  className="h-28 sm:h-32 rounded-3xl bg-white hover:bg-emerald-50/60 border-2 border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 group"
                >
                  <span className="text-4xl sm:text-5xl font-black font-amiri text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {char}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    انقر للاختيار
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🏆
          </div>
          <h3 className="text-2xl font-black font-alexandria text-slate-900">
            أحسنت يا بطل! أنهيت هذا المستوى بنجاح!
          </h3>
          <p className="text-sm font-bold text-slate-600">
            لقد أتقنت مهارة {titles[activeGameIdx]} وجمعت نجوم التميز!
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
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition cursor-pointer shadow-md"
            >
              متابعة الرحلة ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
