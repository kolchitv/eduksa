import React, { useState, useEffect } from 'react';
import { 
  CENTRAL_MADD_DATA, 
  CENTRAL_SYLLABLE_COMBINE_DATA, 
  MaddSyllableItem, 
  SyllableCombineItem 
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
  Rocket, 
  Train, 
  Play, 
  Sparkles,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MaddRocketGameProps {
  initialSubGameIndex?: number;
  onFinishLevel: (accuracy: number, stars: number) => void;
  onBackToMap: () => void;
}

export const MaddRocketGame: React.FC<MaddRocketGameProps> = ({
  initialSubGameIndex = 0,
  onFinishLevel,
  onBackToMap
}) => {
  // 6 Sub-games:
  // 0: صاروخ المدود (تمييز بَ ↔ بَا ، بُ ↔ بُو ، بِ ↔ بِي)
  // 1: اسمع القصير والطويل
  // 2: اختر حرف المد المناسب (ا / و / ي)
  // 3: خلية المقاطع (مَ + دَ)
  // 4: قطار المقاطع (ترتيب المقاطع لتكوين كلمة)
  // 5: دمج الأصوات (تشغيل مقطع مقطع ثم الكلمة)
  const [activeGameIdx, setActiveGameIdx] = useState<number>(initialSubGameIndex);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isLevelDone, setIsLevelDone] = useState<boolean>(false);

  // Train / Syllable order state
  const [selectedTrainSyllables, setSelectedTrainSyllables] = useState<string[]>([]);
  const [isMergingSounds, setIsMergingSounds] = useState<boolean>(false);

  const totalRounds = 5;
  const currentMaddItem: MaddSyllableItem = CENTRAL_MADD_DATA[currentRound % CENTRAL_MADD_DATA.length];
  const currentPair = currentMaddItem.pairs[currentRound % currentMaddItem.pairs.length];

  const currentCombineItem: SyllableCombineItem = CENTRAL_SYLLABLE_COMBINE_DATA[currentRound % CENTRAL_SYLLABLE_COMBINE_DATA.length];

  useEffect(() => {
    setFeedbackMsg('');
    setSelectedTrainSyllables([]);
    if (activeGameIdx === 1) {
      setTimeout(() => {
        audioManager.speakArabic(currentPair.longAudio, 0.85);
      }, 350);
    }
  }, [currentRound, activeGameIdx]);

  const handleSelectAnswer = (isCorrect: boolean) => {
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
      recordMistake('madd', currentPair.type);
    }
  };

  // Sound merge step-by-step
  const handlePlaySoundMerge = async () => {
    setIsMergingSounds(true);
    for (let i = 0; i < currentCombineItem.syllables.length; i++) {
      audioManager.speakArabic(currentCombineItem.syllables[i], 0.8);
      await new Promise((res) => setTimeout(res, 800));
    }
    // Full word
    audioManager.speakArabic(currentCombineItem.fullWord, 0.85);
    setIsMergingSounds(false);
  };

  const handleLevelComplete = () => {
    const accuracy = Math.round(((score + 1) / totalRounds) * 100);
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 3 : 2;
    setIsLevelDone(true);
    addTrackProgress('madd_syllables', stars, activeGameIdx, accuracy);
    onFinishLevel(accuracy, stars);
  };

  const titles = [
    '١. صاروخ المدود 🚀',
    '٢. اسمع القصير والطويل 🎧',
    '٣. اختر حرف المد المناسب ✍️',
    '٤. خلية المقاطع 🍯',
    '٥. قطار المقاطع 🚂',
    '٦. دمج الأصوات 🔊'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-sky-100 flex items-center justify-between gap-4">
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
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-100 text-sky-800">
                عالم المدود والمقاطع 🚀
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

        <div className="px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 font-black text-xs flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>النقاط: {score}</span>
        </div>
      </div>

      {!isLevelDone ? (
        <div className="space-y-6">
          {/* Main Stage Banner */}
          <div className="bg-gradient-to-br from-sky-500 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-center space-y-4">
            {/* Sub-games 0, 1: Madd Rocket Comparison */}
            {activeGameIdx === 0 || activeGameIdx === 1 ? (
              <div className="space-y-3">
                <span className="text-xs text-sky-100 font-bold block">
                  {activeGameIdx === 0 ? 'ميز بين الصوت القصير والصوت الطويل 🚀' : 'أي الصوتيين تسمعه الآن؟'}
                </span>

                <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                  <button
                    onClick={() => audioManager.speakArabic(currentPair.shortAudio, 0.85)}
                    className="p-4 sm:p-5 rounded-3xl bg-white/20 hover:bg-white/30 border-2 border-white/40 text-center transition cursor-pointer"
                  >
                    <span className="text-3xl sm:text-4xl font-black font-amiri block">
                      {currentPair.shortText}
                    </span>
                    <span className="text-[11px] font-bold text-sky-200 mt-1 block">
                      صوت قصير 🐢
                    </span>
                  </button>

                  <span className="text-2xl font-black">↔</span>

                  <button
                    onClick={() => audioManager.speakArabic(currentPair.longAudio, 0.85)}
                    className="p-4 sm:p-5 rounded-3xl bg-white text-slate-950 shadow-xl hover:scale-102 transition cursor-pointer text-center"
                  >
                    <span className="text-3xl sm:text-4xl font-black font-amiri text-indigo-700 block">
                      {currentPair.longText}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      صوت طويل (مد) 🚀
                    </span>
                  </button>
                </div>

                <p className="text-xs text-sky-100">
                  مثال: «{currentPair.sampleWord}» {currentPair.emoji}
                </p>
              </div>
            ) : activeGameIdx === 2 ? (
              /* Sub-game 2: Pick Madd Letter */
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-black font-alexandria">
                  ما حرف المد المناسب لحركة: ({currentPair.shortText})؟
                </p>
                <div className="w-24 h-24 mx-auto bg-white/25 rounded-3xl border-2 border-white/40 flex items-center justify-center text-5xl font-black font-amiri">
                  {currentPair.shortText} + ؟
                </div>
              </div>
            ) : activeGameIdx === 3 ? (
              /* Sub-game 3: Syllable Cell */
              <div className="space-y-3">
                <span className="text-xs text-sky-100 font-bold block">خلية المقاطع 🍯</span>
                <p className="text-sm font-bold">
                  اجمع المقطعين معاً: «{currentCombineItem.syllables[0]}» + «{currentCombineItem.syllables[1]}»
                </p>
                <div className="flex items-center justify-center gap-2">
                  {currentCombineItem.syllables.map((s, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-2xl bg-white/20 border border-white/40 text-2xl font-black font-amiri">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : activeGameIdx === 4 ? (
              /* Sub-game 4: Syllable Train */
              <div className="space-y-3">
                <span className="text-xs text-sky-100 font-bold block">قطار المقاطع 🚂</span>
                <p className="text-sm font-bold">
                  رتب المقاطع بالترتيب الصحيح لتكوين كلمة: «{currentCombineItem.fullWord}» {currentCombineItem.emoji}
                </p>

                {/* Train Wagons Visual */}
                <div className="p-3 bg-white/15 rounded-2xl border border-white/30 flex items-center justify-center gap-2 min-h-16 flex-wrap">
                  {selectedTrainSyllables.length === 0 ? (
                    <span className="text-xs text-sky-200">اضغط على المقاطع بالترتيب لتملأ عربات القطار...</span>
                  ) : (
                    selectedTrainSyllables.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-slate-900 rounded-xl font-black text-lg shadow-xs">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Sub-game 5: Sound Merge */
              <div className="space-y-3">
                <span className="text-xs text-sky-100 font-bold block">دمج الأصوات بالترديد 🔊</span>
                <div className="text-3xl sm:text-4xl font-black font-amiri">
                  {currentCombineItem.fullWord} {currentCombineItem.emoji}
                </div>
                <button
                  onClick={handlePlaySoundMerge}
                  disabled={isMergingSounds}
                  className="px-5 py-2.5 rounded-2xl bg-white text-indigo-900 font-black text-xs shadow-md hover:bg-sky-50 transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 fill-indigo-900" />
                  <span>{isMergingSounds ? 'جارِ تشغيل المقاطع بالتتابع...' : 'استمع لدمج المقاطع ثم الكلمة كاملة'}</span>
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
          {activeGameIdx === 0 || activeGameIdx === 1 ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleSelectAnswer(activeGameIdx === 1)}
                className="h-24 rounded-3xl bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 shadow-sm transition flex flex-col items-center justify-center cursor-pointer active:scale-95"
              >
                <span className="text-3xl font-black font-amiri text-slate-900">{currentPair.longText}</span>
                <span className="text-xs font-bold text-slate-400">صوت طويل (مد)</span>
              </button>

              <button
                onClick={() => handleSelectAnswer(activeGameIdx === 0)}
                className="h-24 rounded-3xl bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 shadow-sm transition flex flex-col items-center justify-center cursor-pointer active:scale-95"
              >
                <span className="text-3xl font-black font-amiri text-slate-900">{currentPair.shortText}</span>
                <span className="text-xs font-bold text-slate-400">صوت قصير</span>
              </button>
            </div>
          ) : activeGameIdx === 2 ? (
            /* Pick Madd Letter Choices (ا / و / ي) */
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {(['ا', 'و', 'ي'] as const).map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleSelectAnswer(letter === currentPair.maddLetter)}
                  className="h-24 rounded-3xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 shadow-sm transition flex items-center justify-center text-4xl font-black font-amiri text-slate-900 cursor-pointer active:scale-95"
                >
                  {letter}
                </button>
              ))}
            </div>
          ) : activeGameIdx === 4 ? (
            /* Train Syllables Click to Order */
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {currentCombineItem.syllables
                  .slice()
                  .sort(() => 0.5 - Math.random())
                  .map((syl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        audioManager.speakArabic(syl, 0.85);
                        setSelectedTrainSyllables((prev) => [...prev, syl]);
                      }}
                      className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 text-2xl font-black font-amiri text-slate-900 shadow-xs cursor-pointer active:scale-95"
                    >
                      {syl}
                    </button>
                  ))}
              </div>

              <div className="text-center pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const isMatch = selectedTrainSyllables.join('') === currentCombineItem.syllables.join('');
                    handleSelectAnswer(isMatch);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition cursor-pointer shadow-md"
                >
                  تأكيد ترتيب القطار ✅
                </button>

                <button
                  onClick={() => setSelectedTrainSyllables([])}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  مسح
                </button>
              </div>
            </div>
          ) : (
            /* Default Choice Options */
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleSelectAnswer(true)}
                className="h-24 rounded-3xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 shadow-sm transition flex flex-col items-center justify-center cursor-pointer active:scale-95"
              >
                <span className="text-2xl font-black font-amiri text-slate-900">{currentCombineItem.fullWord}</span>
                <span className="text-xs font-bold text-slate-400">{currentCombineItem.meaning} {currentCombineItem.emoji}</span>
              </button>

              <button
                onClick={() => handleSelectAnswer(false)}
                className="h-24 rounded-3xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 shadow-sm transition flex flex-col items-center justify-center cursor-pointer active:scale-95"
              >
                <span className="text-2xl font-black font-amiri text-slate-900">كَلِمَةٌ أُخْرَى</span>
                <span className="text-xs font-bold text-slate-400">خيار مختلف</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Level Finish Celebration */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🚀
          </div>
          <h3 className="text-2xl font-black font-alexandria text-slate-900">
            أحسنت يا رائد فضاء المدود والمقاطع!
          </h3>
          <p className="text-sm font-bold text-slate-600">
            لقد أتقنت تمييز المدود ودمج المقاطع بطلاقة واكتسبت نجوم التميز!
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
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition cursor-pointer shadow-md"
            >
              متابعة الرحلة ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
