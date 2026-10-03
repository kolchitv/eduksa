import React, { useState, useEffect } from 'react';
import { 
  CENTRAL_HARAKAT_DATA, 
  HarakatItem 
} from '../../data/learningGamesData';
import { audioManager } from '../../utils/audio';
import { 
  playGentleFeedback, 
  playSuccessFeedback, 
  recordMistake, 
  addTrackProgress 
} from '../../utils/adaptiveGameEngine';
import { 
  Volume2, 
  Star, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HarakatFactoryGameProps {
  initialSubGameIndex?: number;
  onFinishLevel: (accuracy: number, stars: number) => void;
  onBackToMap: () => void;
}

export const HarakatFactoryGame: React.FC<HarakatFactoryGameProps> = ({
  initialSubGameIndex = 0,
  onFinishLevel,
  onBackToMap
}) => {
  // 5 Sub-games:
  // 0: مصنع الحركات (دمج الحرف مع الحركة: ب + َ = بَ)
  // 1: اسمع الحركة (استماع واختيار بَ / بُ / بِ)
  // 2: ضع الحركة (تظهر ب ويطلب اجعلها بُ)
  // 3: صيد المقطع (أين مَ؟ مَ - مُ - مِ)
  // 4: تحدي السكون (تمييز مَ / مْ ، بُ / بْ)
  const [activeGameIdx, setActiveGameIdx] = useState<number>(initialSubGameIndex);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isLevelDone, setIsLevelDone] = useState<boolean>(false);

  const totalRounds = 5;
  const currentItem: HarakatItem = CENTRAL_HARAKAT_DATA[currentRound % CENTRAL_HARAKAT_DATA.length];

  // Specific targets per round
  const targetHarakahType = currentRound % 4 === 0 ? 'fatha' : currentRound % 4 === 1 ? 'damma' : currentRound % 4 === 2 ? 'kasra' : 'sukoon';
  const targetData = currentItem[targetHarakahType];

  useEffect(() => {
    setFeedbackMsg('');
    if (activeGameIdx === 1 || activeGameIdx === 3) {
      setTimeout(() => {
        handlePlayAudio();
      }, 350);
    }
  }, [currentRound, activeGameIdx]);

  const handlePlayAudio = () => {
    audioManager.speakArabic(targetData.audio, 0.85);
  };

  const handleSelectAnswer = (chosenText: string) => {
    const isCorrect = chosenText === targetData.text;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedbackMsg(playSuccessFeedback(1));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });

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
      recordMistake('haraka', targetHarakahType);
    }
  };

  const handleLevelComplete = () => {
    const accuracy = Math.round(((score + 1) / totalRounds) * 100);
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 2;
    setIsLevelDone(true);
    addTrackProgress('harakat', stars, activeGameIdx, accuracy);
    onFinishLevel(accuracy, stars);
  };

  const titles = [
    '١. مصنع الحركات 🏭',
    '٢. اسمع الحركة 🎧',
    '٣. ضَعِ الحركة المناسبة 👆',
    '٤. صيد المقطع 🎯',
    '٥. تحدي السكون 🛑'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-amber-100 flex items-center justify-between gap-4">
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
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800">
                عالم الحركات 🌈
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

        <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>النقاط: {score}</span>
        </div>
      </div>

      {!isLevelDone ? (
        <div className="space-y-6">
          {/* Question Banner */}
          <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
            <button
              onClick={handlePlayAudio}
              className="px-4 py-2 rounded-2xl bg-white text-slate-950 font-black text-xs shadow-md hover:bg-amber-50 transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-orange-600" />
              <span>استمع لنطق الصوت 🔊</span>
            </button>

            {/* Sub-game 0: Factory Merge Animation */}
            {activeGameIdx === 0 ? (
              <div className="flex items-center justify-center gap-3 sm:gap-4 py-2 flex-wrap">
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 flex items-center justify-center text-4xl font-black font-amiri">
                  {currentItem.baseChar}
                </div>
                <span className="text-2xl font-black">+</span>
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 flex items-center justify-center text-4xl font-black font-amiri">
                  {targetHarakahType === 'fatha' ? 'َ' : targetHarakahType === 'damma' ? 'ُ' : targetHarakahType === 'kasra' ? 'ِ' : 'ْ'}
                </div>
                <span className="text-2xl font-black">=</span>
                <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white text-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-4xl font-black font-amiri animate-pulse">
                  ؟
                </div>
              </div>
            ) : activeGameIdx === 2 ? (
              /* Sub-game 2: Put Haraka on Letter */
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold text-amber-950">
                  اجعل الحرف ينطق بصوت: «{targetData.text}»
                </p>
                <div className="w-24 h-24 mx-auto bg-white/25 rounded-3xl border-2 border-white/40 flex items-center justify-center text-5xl font-black font-amiri shadow-inner">
                  {currentItem.baseChar}
                </div>
              </div>
            ) : (
              /* Sub-games 1, 3, 4: Listening / Sukoon Challenge */
              <div className="space-y-1">
                <span className="text-xs text-amber-100 font-bold block">
                  {activeGameIdx === 4 ? 'تحدي تمييز السكون عن الحركة 🛑' : 'اختر الصوت المطابق لما تسمعه:'}
                </span>
                <p className="text-2xl sm:text-3xl font-black font-alexandria">
                  {activeGameIdx === 4 ? `أين المقطع الساكن: «${currentItem.sukoon.text}»؟` : `أين صوت: «${targetData.text}»؟`}
                </p>
              </div>
            )}

            {feedbackMsg && (
              <div className="inline-block px-4 py-1.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-black shadow-md animate-bounce">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Interactive Choices Area */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[currentItem.fatha, currentItem.damma, currentItem.kasra, currentItem.sukoon].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioManager.speakArabic(opt.text, 0.85);
                  handleSelectAnswer(opt.text);
                }}
                className="h-28 sm:h-32 rounded-3xl bg-white hover:bg-amber-50/70 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 group"
              >
                <span className="text-4xl sm:text-5xl font-black font-amiri text-slate-900 group-hover:text-amber-600 transition-colors">
                  {opt.text}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {opt.sample} {opt.emoji}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🌈
          </div>
          <h3 className="text-2xl font-black font-alexandria text-slate-900">
            أحسنت يا بطل الحركات!
          </h3>
          <p className="text-sm font-bold text-slate-600">
            لقد أنهيت تدريبات {titles[activeGameIdx]} وجمعت نجوم التميز بنجاح!
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
              className="px-6 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition cursor-pointer shadow-md"
            >
              متابعة الرحلة ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
