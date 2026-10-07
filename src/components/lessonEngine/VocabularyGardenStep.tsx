import React, { useState } from 'react';
import { CheckCircle2, Volume2, Sparkles, Check, X, RotateCcw, Lightbulb } from 'lucide-react';
import { InteractiveLessonData } from '../../types/interactiveLesson';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface VocabularyGardenStepProps {
  lessonData: InteractiveLessonData;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const VocabularyGardenStep: React.FC<VocabularyGardenStepProps> = ({
  lessonData,
  onComplete,
  onNext
}) => {
  const { vocabularyGarden } = lessonData;
  const { matchPairs, wordMap } = vocabularyGarden;

  // Matching game state
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
  const [matchEvaluated, setMatchEvaluated] = useState(false);

  // Word Map state
  const [selectedAntonym, setSelectedAntonym] = useState<string>('');
  const [selectedSynonym, setSelectedSynonym] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSentence, setSelectedSentence] = useState<string>('');
  const [wordMapChecked, setWordMapChecked] = useState(false);

  const handleSelectMatch = (pairId: string, choice: string) => {
    audioManager.play('click');
    setSelectedMatches((prev) => ({
      ...prev,
      [pairId]: choice
    }));
  };

  const checkMatching = () => {
    setMatchEvaluated(true);
    const allCorrect = matchPairs.every((p) => selectedMatches[p.id] === p.meaning);
    if (allCorrect) {
      audioManager.playFanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      audioManager.playWrong();
    }
  };

  const checkWordMap = () => {
    setWordMapChecked(true);
    const isCorrect =
      selectedAntonym === wordMap.antonym &&
      selectedSynonym === wordMap.synonym &&
      selectedType === wordMap.type &&
      selectedSentence.length > 0;

    if (isCorrect) {
      audioManager.playFanfare();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } else {
      audioManager.playCorrect();
    }
  };

  const handleFinish = () => {
    let matchScore = 0;
    matchPairs.forEach((p) => {
      if (selectedMatches[p.id] === p.meaning) matchScore += 50 / matchPairs.length;
    });

    let mapScore = 0;
    if (selectedAntonym === wordMap.antonym) mapScore += 12.5;
    if (selectedSynonym === wordMap.synonym) mapScore += 12.5;
    if (selectedType === wordMap.type) mapScore += 12.5;
    if (selectedSentence) mapScore += 12.5;

    const total = Math.round(matchScore + mapScore);
    onComplete(total);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-2xl font-black shadow-xs">
            🌱
          </div>
          <div>
            <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              المحطة الثالثة • الثروة اللغوية والمفردات
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-1">
              {vocabularyGarden.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Part 1: صل الكلمة بمعناها */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              التدريب ١: أَصِلُ الْكَلِمَةَ بِمَعْنَاهَا
            </span>
            <p className="text-xs text-slate-500 mt-1">
              اختر المعنى الصحيح المعتمد في درس الصديقان لكل كلمة:
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedMatches({});
              setMatchEvaluated(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchPairs.map((pair) => {
            const allChoices = [pair.meaning, ...pair.distractors];
            const userChoice = selectedMatches[pair.id];
            const isCorrect = userChoice === pair.meaning;

            return (
              <div
                key={pair.id}
                className="p-5 bg-gradient-to-b from-slate-50 to-emerald-50/30 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4"
              >
                {/* Target Word */}
                <div className="text-center p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">الْكَلِمَةُ:</span>
                  <div className="font-amiri text-3xl font-black text-emerald-950">
                    {pair.word}
                  </div>
                  <button
                    onClick={() => audioManager.speakArabic(pair.word, 0.85)}
                    className="mt-2 text-xs text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع</span>
                  </button>
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-600 block text-right">
                    اختر المعنى الصحيح:
                  </span>
                  {allChoices.map((choice, cIdx) => {
                    const isSelected = userChoice === choice;
                    let style = 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200';
                    if (isSelected) {
                      if (matchEvaluated) {
                        style = isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-700 font-black shadow-sm'
                          : 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
                      } else {
                        style = 'bg-emerald-600 text-white border-emerald-700 font-black shadow-sm';
                      }
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleSelectMatch(pair.id, choice)}
                        className={`w-full p-3 rounded-2xl text-center text-sm font-bold font-alexandria border transition-all cursor-pointer ${style}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Check Matching Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={checkMatching}
            disabled={Object.keys(selectedMatches).length < matchPairs.length}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition disabled:opacity-40 cursor-pointer active:scale-95"
          >
            تَحَقَّقْ مِنْ مَعَانِي الْكَلِمَاتِ ✓
          </button>
        </div>
      </div>

      {/* Part 2: خريطة المفردة (الْجَدِيدُ) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              التدريب ٢: أُكْمِلُ خَرِيطَةَ الْمُفْرَدَةِ الآتِيَةِ
            </span>
            <p className="text-xs text-slate-500 mt-1">
              خريطة الكلمة لتعميق الفهم اللغوي واستخراج النوع والضد والمرادف واستخدامها في جملة
            </p>
          </div>

          <button
            onClick={() => audioManager.speakArabic('أكمل خريطة المفردة لكلمة الجديد، ضدها، مرادفها، نوعها، والكلمة في جملة')}
            className="text-xs text-teal-700 flex items-center gap-1 font-bold cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع للتعليمات</span>
          </button>
        </div>

        {/* Visual Word Map Tree Layout */}
        <div className="p-6 bg-gradient-to-br from-slate-50 via-teal-50/20 to-sky-50 rounded-3xl border border-teal-200/80 max-w-3xl mx-auto space-y-6">
          {/* Top: ضدها */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
              ⬆️ ضِدُّهَا:
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {['الْقَدِيمُ', 'الْكَبِيرُ', 'الْمَكْسُورُ'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedAntonym(item);
                    audioManager.play('click');
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                    selectedAntonym === item
                      ? 'bg-rose-600 text-white font-black border-rose-700 shadow-sm'
                      : 'bg-white hover:bg-rose-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Row: مرادفها | الكلمة المركزية | نوعها */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            {/* Left: مرادفها */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-black text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                ⬅️ مُرَادِفُهَا:
              </span>
              <div className="flex flex-col gap-1.5 w-full">
                {['الْحَدِيثُ', 'الْقَصِيرُ', 'السَّرِيعُ'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedSynonym(item);
                      audioManager.play('click');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                      selectedSynonym === item
                        ? 'bg-sky-600 text-white font-black border-sky-700 shadow-sm'
                        : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: الكلمة المستهدفة */}
            <div className="p-6 bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-slate-950 rounded-3xl border-4 border-white shadow-xl text-center space-y-2 scale-105">
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/30 px-2 py-0.5 rounded-full">
                الْمُفْرَدَةُ
              </span>
              <div className="font-amiri text-4xl font-black">
                {wordMap.targetWord}
              </div>
              <button
                onClick={() => audioManager.speakArabic(wordMap.targetWord, 0.85)}
                className="text-[11px] font-black underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>نطق الكلمة</span>
              </button>
            </div>

            {/* Right: نوعها */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300">
                ➡️ نَوْعُهَا:
              </span>
              <div className="flex flex-col gap-1.5 w-full">
                {['اسْمٌ', 'فِعْلٌ', 'حَرْفٌ'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedType(item);
                      audioManager.play('click');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                      selectedType === item
                        ? 'bg-indigo-600 text-white font-black border-indigo-700 shadow-sm'
                        : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: الكلمة في جملة */}
          <div className="flex flex-col items-center space-y-2 pt-2 border-t border-teal-200/50">
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              ⬇️ الْكَلِمَةُ فِي جُمْلَةٍ:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {[
                'اشْتَرَى أَبِي لِي ثَوْبًا جَدِيدًا لِلْعِيدِ.',
                'لَعِبَ عَمَّارٌ بِقِطَارِهِ الْجَدِيدِ.'
              ].map((sent, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setSelectedSentence(sent);
                    audioManager.play('click');
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold transition cursor-pointer border text-right leading-relaxed ${
                    selectedSentence === sent
                      ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-sm'
                      : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {sent}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Check Word Map */}
        <div className="flex justify-end pt-2">
          <button
            onClick={checkWordMap}
            disabled={!selectedAntonym || !selectedSynonym || !selectedType || !selectedSentence}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md transition disabled:opacity-40 cursor-pointer active:scale-95"
          >
            تَحَقَّقْ مِنْ خَرِيطَةِ الْمُفْرَدَةِ 🧩
          </button>
        </div>
      </div>

      {/* Bottom Completion Button */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold">
          ⭐ أنجز تدريبات المفردات للانتقال إلى محطة الشدة والملاحظة!
        </span>

        <button
          onClick={handleFinish}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>انْتَقِلْ إِلَى أَقْرَأُ وَأُلاحِظُ (الشَّدَّةُ) 👀</span>
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
