import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Check, 
  Lightbulb,
  Search,
  Target
} from 'lucide-react';
import { InteractiveLessonData } from '../../types/interactiveLesson';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ObservationSkillStepProps {
  lessonData: InteractiveLessonData;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const ObservationSkillStep: React.FC<ObservationSkillStepProps> = ({
  lessonData,
  onComplete,
  onNext
}) => {
  const { observationSkill } = lessonData;
  const { shaddaLetters, shaddaHunterWords, placeShaddaExercise, expressiveSentences } = observationSkill;

  // Game 1: صائد الشدة
  const [selectedHuntedWords, setSelectedHuntedWords] = useState<string[]>([]);
  const [hunterChecked, setHunterChecked] = useState(false);

  // Game 2: أين الشدة؟
  const [currentPlaceIdx, setCurrentPlaceIdx] = useState(0);
  const [placedLetterIdx, setPlacedLetterIdx] = useState<Record<string, number>>({});
  const [placeChecked, setPlaceChecked] = useState<Record<string, boolean>>({});

  // Game 3: تكوين الكلمات المشددة (ص 65)
  const [builtWords, setBuiltWords] = useState<Record<string, string>>({});

  const toggleHunterWord = (wordId: string) => {
    audioManager.play('click');
    if (selectedHuntedWords.includes(wordId)) {
      setSelectedHuntedWords((prev) => prev.filter((w) => w !== wordId));
    } else {
      setSelectedHuntedWords((prev) => [...prev, wordId]);
    }
  };

  const evaluateHunter = () => {
    setHunterChecked(true);
    const correctIds = shaddaHunterWords.filter((w) => w.hasShadda).map((w) => w.id);
    const userSelectedCorrect = selectedHuntedWords.every((id) => correctIds.includes(id));
    const allFound = correctIds.every((id) => selectedHuntedWords.includes(id));

    if (userSelectedCorrect && allFound) {
      audioManager.playFanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      audioManager.playCorrect();
    }
  };

  const handlePlaceShadda = (exerciseId: string, letterIdx: number, targetIdx: number) => {
    audioManager.play('click');
    setPlacedLetterIdx((prev) => ({ ...prev, [exerciseId]: letterIdx }));
    const isCorrect = letterIdx === targetIdx;
    setPlaceChecked((prev) => ({ ...prev, [exerciseId]: isCorrect }));

    if (isCorrect) {
      audioManager.playCorrect();
    } else {
      audioManager.playWrong();
    }
  };

  const handleFinish = () => {
    onComplete(90);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl font-black shadow-xs">
            👀
          </div>
          <div>
            <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              المحطة الرابعة • الأداء القرائي والظاهرة الصوتية
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-1">
              {observationSkill.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Part 1: الجملة النموذجية وقاعدة الحرف المشدد */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            ١ - أَقْرَأُ الْجُمْلَةَ وَأُلاحِظُ الْحَرْفَ الْمُشَدَّدَ:
          </span>
          <button
            onClick={() => audioManager.speakArabic(observationSkill.sampleSentence, 0.85)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>استمع للجملة 🔊</span>
          </button>
        </div>

        {/* Big Sentence Card */}
        <div className="p-6 bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 rounded-3xl border-2 border-amber-300 text-center">
          <p className="font-amiri text-3xl sm:text-4xl leading-[2.2] text-slate-900">
            «
            <span className="text-rose-700 font-black underline decoration-rose-400">لَكِنَّهُ</span>{' '}
            سَقَطَ مِنْ يَدِهِ{' '}
            <span className="text-rose-700 font-black underline decoration-rose-400">فَتَكَسَّرَ</span>{' '}
            <span className="text-rose-700 font-black underline decoration-rose-400">وَتَفَكَّكَتْ</span>{' '}
            أَجْزَاؤُهُ.»
          </p>
        </div>

        {/* Rule reminder bubble (Official Rule) */}
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-950 space-y-1">
            <span className="font-black text-sm block">💡 قاعدة الشدة الذهبية في المنهج السعودي:</span>
            <p>
              الْحَرْفُ الْمُشَدَّدُ هُوَ حَرْفَانِ: الأَوَّلُ سَاكِنٌ وَالثَّانِي مُتَحَرِّكٌ، أُدْغِمَا مَعًا فَأَصْبَحَا حَرْفًا وَاحِدًا مُشَدَّدًا نَضَعُ عَلَيْهِ الشَّدَّةَ (ّ).
            </p>
          </div>
        </div>

        {/* Visual Letters Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shaddaLetters.map((sl, sIdx) => (
            <div
              key={sIdx}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center"
            >
              <div className="font-amiri text-2xl font-black text-rose-700">
                {sl.word}
              </div>
              <div className="text-xs font-black bg-white p-2 rounded-xl border border-slate-200 text-slate-800">
                الحرف المشدد: <span className="text-rose-600 font-bold text-base">{sl.vowelWithShadda}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                {sl.breakdown}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: لعبة صائد الشدة 🔎 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              لُعْبَةُ: صَائِدُ الشَّدَّةِ 🔎
            </span>
            <p className="text-xs text-slate-500 mt-1">
              انقر على جميع الكلمات التي تحتوي على حرف مشدد:
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedHuntedWords([]);
              setHunterChecked(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shaddaHunterWords.map((hw) => {
            const isSelected = selectedHuntedWords.includes(hw.id);
            let style = 'bg-slate-50 hover:bg-rose-50 text-slate-800 border-slate-200';
            if (isSelected) {
              if (hunterChecked) {
                style = hw.hasShadda
                  ? 'bg-emerald-600 text-white border-emerald-700 font-black shadow-sm'
                  : 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
              } else {
                style = 'bg-rose-600 text-white border-rose-700 font-black shadow-sm';
              }
            } else if (hunterChecked && hw.hasShadda) {
              style = 'bg-amber-100 text-amber-950 border-amber-300 font-bold';
            }

            return (
              <button
                key={hw.id}
                onClick={() => toggleHunterWord(hw.id)}
                className={`p-4 rounded-2xl text-center font-amiri text-2xl border transition-all cursor-pointer ${style}`}
              >
                {hw.word}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={evaluateHunter}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition cursor-pointer active:scale-95"
          >
            تَحَقَّقْ مِنْ كَلِمَاتِ الشَّدَّةِ 🔎
          </button>
        </div>
      </div>

      {/* Part 3: لعبة أين الشدة؟ 🎯 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            لُعْبَةُ: أَيْنَ الشَّدَّةُ؟ 🎯
          </span>
          <p className="text-xs text-slate-500 mt-1">
            تعرض الكلمة بدون شدة؛ انقر على الحرف الذي يجب أن نضع عليه الشدة:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {placeShaddaExercise.map((pe) => {
            const userPlaced = placedLetterIdx[pe.id];
            const isChecked = placeChecked[pe.id];

            return (
              <div
                key={pe.id}
                className="p-5 bg-gradient-to-b from-slate-50 to-purple-50/30 rounded-3xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    الكلمة المطلوبة: {pe.correctWord}
                  </span>
                  <button
                    onClick={() => audioManager.speakArabic(pe.correctWord, 0.85)}
                    className="text-xs text-purple-700 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>نطق الكلمة</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 py-2">
                  {pe.letters.map((letter, lIdx) => {
                    const isSelected = userPlaced === lIdx;
                    return (
                      <button
                        key={lIdx}
                        onClick={() => handlePlaceShadda(pe.id, lIdx, pe.shaddaIndex)}
                        className={`w-12 h-14 rounded-2xl flex flex-col items-center justify-center font-amiri text-2xl font-black transition cursor-pointer border ${
                          isSelected
                            ? lIdx === pe.shaddaIndex
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                              : 'bg-rose-50 text-rose-900 border-rose-300'
                            : 'bg-white hover:bg-purple-100 text-slate-900 border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] text-amber-500 leading-none">
                          {isSelected ? 'ّ' : ' '}
                        </span>
                        <span>{letter}</span>
                      </button>
                    );
                  })}
                </div>

                {isChecked !== undefined && (
                  <p className="text-center text-xs font-bold text-emerald-800">
                    {isChecked ? '✓ موضع صحيح للشدة!' : 'حاول مرة أخرى وضع الشدة على الحرف المضعف'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 4: أقرأ الجمل بصوت معبر */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs font-black text-slate-700">
          ٢ - أَقْرَأُ الْجُمَلَ بِصَوْتٍ مُعَبِّرٍ (الاسْتِفْهَامُ وَالاعْتِذَارُ وَالْحِكْمَةُ):
        </h4>

        <div className="space-y-3">
          {expressiveSentences.map((es) => (
            <div
              key={es.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full inline-block mb-1">
                  {es.speaker} • {es.emotion}
                </span>
                <p className="font-amiri text-xl sm:text-2xl text-slate-900 font-bold">
                  {es.text}
                </p>
              </div>

              <button
                onClick={() => audioManager.speakArabic(es.text, 0.85)}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>استمع للأداء المعبر 🔊</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold">
          ⭐ أتقنت مهارة الحرف المشدد! حان موعد قطار المقاطع والتحليل الصوتي.
        </span>

        <button
          onClick={handleFinish}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>انْتَقِلْ إِلَى أُحَلِّلُ الْكَلِمَاتِ (قِطَارُ الْمَقَاطِعِ 🚂)</span>
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
