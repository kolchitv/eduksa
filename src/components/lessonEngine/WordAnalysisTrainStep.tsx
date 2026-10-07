import React, { useState } from 'react';
import { CheckCircle2, Volume2, Sparkles, RotateCcw, Check, TrainTrack } from 'lucide-react';
import { InteractiveLessonData, InteractiveWordAnalysisItem } from '../../types/interactiveLesson';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface WordAnalysisTrainStepProps {
  lessonData: InteractiveLessonData;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const WordAnalysisTrainStep: React.FC<WordAnalysisTrainStepProps> = ({
  lessonData,
  onComplete,
  onNext
}) => {
  const { wordAnalysis } = lessonData;
  const words = wordAnalysis.words;

  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [filledCarriages, setFilledCarriages] = useState<Record<string, string[]>>({});
  const [evaluatedWords, setEvaluatedWords] = useState<Record<string, boolean>>({});

  const currentWord = words[activeWordIdx];
  const userCarriages = filledCarriages[currentWord.id] || [];

  // Scramble syllables for the user to choose
  const availableSyllables = React.useMemo(() => {
    return [...currentWord.syllables].sort(() => Math.random() - 0.5);
  }, [currentWord]);

  const handlePickSyllable = (syl: string) => {
    audioManager.play('click');
    if (userCarriages.length >= currentWord.syllables.length) return;
    const next = [...userCarriages, syl];
    setFilledCarriages((prev) => ({
      ...prev,
      [currentWord.id]: next
    }));
  };

  const handleRemoveSyllable = (idx: number) => {
    audioManager.play('click');
    const next = userCarriages.filter((_, i) => i !== idx);
    setFilledCarriages((prev) => ({
      ...prev,
      [currentWord.id]: next
    }));
    setEvaluatedWords((prev) => ({ ...prev, [currentWord.id]: false }));
  };

  const handleCheckWord = () => {
    const isCorrect = currentWord.syllables.every((s, i) => userCarriages[i] === s);
    setEvaluatedWords((prev) => ({
      ...prev,
      [currentWord.id]: isCorrect
    }));

    if (isCorrect) {
      audioManager.playFanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      audioManager.playWrong();
    }
  };

  const handleResetCurrentWord = () => {
    setFilledCarriages((prev) => ({
      ...prev,
      [currentWord.id]: []
    }));
    setEvaluatedWords((prev) => ({ ...prev, [currentWord.id]: false }));
  };

  const handleFinish = () => {
    onComplete(95);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center text-2xl font-black shadow-xs">
            🚂
          </div>
          <div>
            <span className="text-[11px] font-black text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              المحطة الخامسة • التحليل الصوتي والمقاطع
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-1">
              {wordAnalysis.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Word Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {words.map((w, idx) => {
          const isSelected = activeWordIdx === idx;
          const isDone = evaluatedWords[w.id];

          return (
            <button
              key={w.id}
              onClick={() => setActiveWordIdx(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-300'
                  : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="font-amiri text-lg">{w.word}</span>
              {isDone && <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Main Train Carriage Game Canvas */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Word Display Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="text-center sm:text-right">
            <span className="text-[11px] font-black text-slate-400">الْكَلِمَةُ الْمُرَادُ تَحْلِيلُهَا:</span>
            <div className="font-amiri text-4xl sm:text-5xl font-black text-indigo-950 mt-1">
              {currentWord.word}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => audioManager.speakArabic(currentWord.audioPrompt, 0.85)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>اقرأ الكلمة بالمقاطع 🔊</span>
            </button>

            <button
              onClick={handleResetCurrentWord}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة</span>
            </button>
          </div>
        </div>

        {/* The Train Visualization 🚂 */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-xl space-y-6 overflow-x-auto">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-bold border-b border-indigo-800 pb-2">
            <span>عربات قطار المقاطع الصوتية (ضع المقاطع بالترتيب من اليمين لليسار):</span>
            <span className="font-mono text-amber-300">{currentWord.syllables.length} مقاطع مطلوبة</span>
          </div>

          {/* Train Head + Carriages Container */}
          <div className="flex items-center gap-3 min-w-max py-4 justify-center sm:justify-start">
            {/* Locomotive Head */}
            <div className="w-20 h-24 bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 shrink-0">
              <span className="text-3xl">🚂</span>
              <span className="text-[10px] font-black uppercase mt-1">الْقِطَارُ</span>
            </div>

            {/* Carriages */}
            {currentWord.syllables.map((expectedSyl, cIdx) => {
              const userSyl = userCarriages[cIdx];
              const isChecked = evaluatedWords[currentWord.id];
              const isCorrectSyl = userSyl === expectedSyl;

              return (
                <div
                  key={cIdx}
                  onClick={() => userSyl && handleRemoveSyllable(cIdx)}
                  className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all duration-200 shadow-md ${
                    userSyl
                      ? isChecked
                        ? isCorrectSyl
                          ? 'bg-emerald-600/90 border-emerald-400 text-white'
                          : 'bg-rose-600/90 border-rose-400 text-white'
                        : 'bg-indigo-600 border-indigo-400 text-white scale-102'
                      : 'bg-slate-800/80 border-dashed border-indigo-400/50 text-slate-400 hover:border-amber-400'
                  }`}
                  title={userSyl ? 'انقر لإزالة المقطع' : 'عربة فارغة'}
                >
                  <span className="text-[10px] font-mono opacity-60">عربة {cIdx + 1}</span>
                  <span className="font-amiri text-2xl font-black">
                    {userSyl || '...'}
                  </span>
                  <span className="text-[9px] opacity-75">
                    {userSyl ? 'انقر للحذف' : 'فارغة'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Syllable Cards to Pick */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>انقر على المقطع الصوتي لإضافته لعربة القطار:</span>
            <span className="text-indigo-700">المقاطع المتاحة:</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center py-2">
            {availableSyllables.map((syl, sIdx) => {
              const alreadyCount = userCarriages.filter((s) => s === syl).length;
              const expectedCount = currentWord.syllables.filter((s) => s === syl).length;
              const isUsedUp = alreadyCount >= expectedCount;

              return (
                <button
                  key={sIdx}
                  onClick={() => !isUsedUp && handlePickSyllable(syl)}
                  disabled={isUsedUp}
                  className={`px-5 py-3 rounded-2xl font-amiri text-2xl font-black border transition-all cursor-pointer shadow-xs ${
                    isUsedUp
                      ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-40 cursor-not-allowed'
                      : 'bg-white hover:bg-indigo-50 text-indigo-950 border-indigo-300 hover:scale-105 active:scale-95'
                  }`}
                >
                  {syl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Validation */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div>
            <span className="font-black block text-sm">💡 القاعدة الصوتية لكلمة ({currentWord.word}):</span>
            <p className="mt-0.5">{currentWord.explanation}</p>
          </div>

          <button
            onClick={handleCheckWord}
            disabled={userCarriages.length < currentWord.syllables.length}
            className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs shadow-md transition disabled:opacity-40 cursor-pointer shrink-0"
          >
            تَحَقَّقْ مِنَ الْقِطَارِ 🚂
          </button>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold">
          ⭐ تمكنت من التحليل الصوتي بنجاح! حان موعد تحدي الطلاقة القرائية السلسة.
        </span>

        <button
          onClick={handleFinish}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>انْتَقِلْ إِلَى الطَّلاقَةِ الْقِرَائِيَّةِ (انْطَلِقْ 🚀)</span>
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
