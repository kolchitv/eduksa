import React, { useState } from 'react';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  FileCheck2, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  Star, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  Check,
  ChevronDown
} from 'lucide-react';

interface Grade4SupportExercisesHubProps {
  studentName?: string;
  onAddStars?: (count: number) => void;
  onBack?: () => void;
}

export const Grade4SupportExercisesHub: React.FC<Grade4SupportExercisesHubProps> = ({
  studentName = 'بطل لغتي',
  onAddStars,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<'spelling' | 'taraakeeb' | 'sarf'>('spelling');
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 1) Spelling Component State (الألف الممدودة والمقصورة)
  // ---------------------------------------------------------------------------
  const [spellingAnswers, setSpellingAnswers] = useState<Record<string, string>>({
    w1: '', // ضُحَى
    w2: '', // رُؤْيَا
    w3: '', // شَكَا
    w4: '', // دَنَا
    w5: '', // رَمَى
    w6: '', // إِلَى
    w7: '', // سَلْوَى
    w8: '', // قَضَايَا
    w9: '', // مَضَى
    w10: '', // مَا
  });

  const [paragraphErrors, setParagraphErrors] = useState<Record<string, string>>({
    err1: '', // صَحَى -> صَحَا
    err2: '', // دُنْيَى -> دُنْيَا
    err3: '', // أَقْصَا -> أَقْصَى
    err4: '', // يَحْيَا -> يَحْيَى
    err5: '', // الدُّمَا -> الدُّمَى
  });

  const [generatedMamdooda, setGeneratedMamdooda] = useState<string>('دَعَا - أَنَا - رَسَا');
  const [generatedMaqsoora, setGeneratedMaqsoora] = useState<string>('مَرْعَى - اقْتَدَى - مَرْوَى');

  // ---------------------------------------------------------------------------
  // 2) Taraakeeb State (المفعول به ظاهر وضمير + نائب الفاعل)
  // ---------------------------------------------------------------------------
  const [taraakeebAnswers, setTaraakeebAnswers] = useState<{
    m1_val: string;
    m1_type: string;
    m2_val: string;
    m2_type: string;
    m3_val: string;
    m3_type: string;
  }>({
    m1_val: '',
    m1_type: 'ظاهر',
    m2_val: '',
    m2_type: 'ضمير',
    m3_val: '',
    m3_type: 'ظاهر',
  });

  const [naebFaielChoices, setNaebFaielChoices] = useState<Record<string, boolean>>({
    sent1: false, // تُرفَعُ السَّيَّارَةُ -> true
    sent2: false, // تَذْهَبُ البِنْتُ -> false
    sent3: false, // يُصلَحُ العَطَبُ -> true
    sent4: false, // تُقَدَّمُ الهَدِيَّةُ -> true
  });

  // ---------------------------------------------------------------------------
  // 3) Sarf State (الفعل المبني للمجهول ماض ومضارع)
  // ---------------------------------------------------------------------------
  const [sarfAnswers, setSarfAnswers] = useState<Record<string, string>>({
    s1: '', // قُطِفَتِ الثِّمَارُ
    s2: '', // أُصْلِحَ الجِهَازُ
    s3: '', // يُدَّخَرُ المَالُ
    s4: '', // اشْتُرِيَتْ سِلْعَةٌ
    s5: '', // أُتْقِنَ الدَّوْرُ إِتْقَاناً
    s6: '', // تُصَانُ اللَّوْحَةُ الإِلِكْتَرُونِيَّةُ
  });

  const [verbTransformAnswers, setVerbTransformAnswers] = useState<Record<string, string>>({
    v1: '', // يُكْتَشَفُ
    v2: '', // اسْتُقْبِلَ
    v3: '', // يُحْصَدُ
    v4: '', // سُمِّدَ
  });

  // Normalization helper
  const clean = (str: string) =>
    (str || '')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,:؛،?!()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Evaluation logic
  const handleEvaluateAll = () => {
    setIsEvaluated(true);
    let correctPoints = 0;

    // Spelling ex1
    if (spellingAnswers.w1.includes('ى') || clean(spellingAnswers.w1) === 'ضحي') correctPoints++;
    if (spellingAnswers.w2.includes('ا') || clean(spellingAnswers.w2) === 'رويا') correctPoints++;
    if (spellingAnswers.w3.includes('ا') || clean(spellingAnswers.w3) === 'شكا') correctPoints++;
    if (spellingAnswers.w4.includes('ا') || clean(spellingAnswers.w4) === 'دنا') correctPoints++;
    if (spellingAnswers.w5.includes('ى') || clean(spellingAnswers.w5) === 'رمي') correctPoints++;
    if (spellingAnswers.w6.includes('ى') || clean(spellingAnswers.w6) === 'الي') correctPoints++;
    if (spellingAnswers.w7.includes('ى') || clean(spellingAnswers.w7) === 'سلوي') correctPoints++;
    if (spellingAnswers.w8.includes('ا') || clean(spellingAnswers.w8) === 'قضايا') correctPoints++;
    if (spellingAnswers.w9.includes('ى') || clean(spellingAnswers.w9) === 'مضي') correctPoints++;
    if (spellingAnswers.w10.includes('ا') || clean(spellingAnswers.w10) === 'ما') correctPoints++;

    // Paragraph error correction
    if (clean(paragraphErrors.err1).includes('صحا')) correctPoints++;
    if (clean(paragraphErrors.err2).includes('دنيا')) correctPoints++;
    if (clean(paragraphErrors.err3).includes('اقصي')) correctPoints++;
    if (clean(paragraphErrors.err4).includes('يحيي')) correctPoints++;
    if (clean(paragraphErrors.err5).includes('الدمي')) correctPoints++;

    // Naeb faiel
    if (naebFaielChoices.sent1 && !naebFaielChoices.sent2 && naebFaielChoices.sent3 && naebFaielChoices.sent4) {
      correctPoints += 3;
    }

    if (correctPoints >= 10) {
      audioManager.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onAddStars?.(5);
    } else {
      audioManager.playCorrect();
      onAddStars?.(3);
    }
  };

  const handleReset = () => {
    setIsEvaluated(false);
    setShowSolutionModal(false);
    setSpellingAnswers({ w1: '', w2: '', w3: '', w4: '', w5: '', w6: '', w7: '', w8: '', w9: '', w10: '' });
    setParagraphErrors({ err1: '', err2: '', err3: '', err4: '', err5: '' });
    setTaraakeebAnswers({ m1_val: '', m1_type: 'ظاهر', m2_val: '', m2_type: 'ضمير', m3_val: '', m3_type: 'ظاهر' });
    setNaebFaielChoices({ sent1: false, sent2: false, sent3: false, sent4: false });
    setSarfAnswers({ s1: '', s2: '', s3: '', s4: '', s5: '', s6: '' });
    setVerbTransformAnswers({ v1: '', v2: '', v3: '', v4: '' });
  };

  const handleQuickInsert = (key: string, char: 'ا' | 'ى') => {
    audioManager.play('click');
    setSpellingAnswers((prev) => ({ ...prev, [key]: char }));
  };

  return (
    <div className="w-full font-sans pb-16">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-700 text-white flex items-center justify-center text-2xl font-black shadow-md border border-emerald-400">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  م/م زاكموزن • أنشطة داعمة
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  الـمستوى: الرابع ابتدائـي 🎯
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria mt-1">
                أنشطة تثبيت وتقويم وتطبيقات داعمة
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                مكون الإملاء (الألف الممدودة والمقصورة) • مكون التراكيب (المفعول به ونائب الفاعل) • مكون الصرف والتحويل (المبني للمجهول)
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة</span>
              </button>
            )}

            <button
              onClick={() => setShowSolutionModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>الحل النموذجي المعتمد 💡</span>
            </button>

            <button
              onClick={() => setIsPrinting(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>طباعة ورقة العمل A4</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('spelling')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSection === 'spelling'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>✏️</span>
            <span>١) مكون الإملاء (الألف الممدودة والمقصورة)</span>
          </button>

          <button
            onClick={() => setActiveSection('taraakeeb')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSection === 'taraakeeb'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>📑</span>
            <span>٢) مكون التراكيب (المفعول به ونائب الفاعل)</span>
          </button>

          <button
            onClick={() => setActiveSection('sarf')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSection === 'sarf'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>🔄</span>
            <span>٣) مكون الصرف والتحويل (المبني للمجهول)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1) مكون الإملاء: الألف الممدودة والمقصورة / تثبيت */}
      {/* ========================================================================= */}
      {activeSection === 'spelling' && (
        <div className="space-y-6">
          {/* Card: تذكير (قاعدة الألف الممدودة والمقصورة) */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                تَذْكِيرٌ 📌
              </span>
              <h3 className="text-base font-black text-emerald-950 font-alexandria">
                أُلاحِظُ الْجَدْوَلَ وَالْقَوَاعِدَ:
              </h3>
            </div>

            {/* Table from PDF page 1 */}
            <div className="overflow-x-auto rounded-2xl border border-emerald-300 bg-white mb-4">
              <table className="w-full text-center text-sm font-bold">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="py-2.5 px-4 border-l border-emerald-500">فِعْلٌ</th>
                    <th className="py-2.5 px-4 border-l border-emerald-500">اِسْمٌ</th>
                    <th className="py-2.5 px-4">حَرْفٌ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 text-slate-800">
                  <tr>
                    <td className="py-2 border-l border-emerald-100 font-sans">قَضَى (مقصورة)</td>
                    <td className="py-2 border-l border-emerald-100 font-sans">مُصْطَفَى (مقصورة)</td>
                    <td className="py-2 font-sans">عَلَى (مقصورة)</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2 border-l border-emerald-100 font-sans">اهْتَدَى (مقصورة)</td>
                    <td className="py-2 border-l border-emerald-100 font-sans">عَصَا (ممدودة)</td>
                    <td className="py-2 font-sans">إِلَى (مقصورة)</td>
                  </tr>
                  <tr>
                    <td className="py-2 border-l border-emerald-100 font-sans">نَمَا (ممدودة)</td>
                    <td className="py-2 border-l border-emerald-100 font-sans">فَتَى (مقصورة)</td>
                    <td className="py-2 font-sans">مَا (ممدودة)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rule summary bullets from PDF */}
            <div className="space-y-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-white/80 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">🔹</span>
                <span>تَرِدُ الأَلِفُ فِي آخِرِ الْكَلِمَةِ (فِي الأَفْعَالِ وَالأَسْمَاءِ وَالْحُرُوفِ).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">🔹</span>
                <span>تَتَشَابَهُ الأَلِفُ نُطْقاً وَتَخْتَلِفُ رَسْماً.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">🔹</span>
                <span>تَأْتِي الأَلِفُ مَرَّةً <strong className="text-rose-600">مَقْصُورَةً (ى)</strong> وَمَرَّةً <strong className="text-sky-600">مَمْدُودَةً (ا)</strong>.</span>
              </div>
            </div>
          </div>

          {/* Exercise 1: أكمل بألف ممدودة أو مقصورة */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                  ١
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                  أُكْمِلُ بِأَلِفٍ مَمْدُودَةٍ (ا) أَوْ مَقْصُورَةٍ (ى) مَا يَلِي:
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                10 كلمات تطبيقية
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { id: 'w1', label: 'ضُحَـ...', full: 'ضُحَى', expected: 'ى', note: 'اسم ثلاثي أصله ياء' },
                { id: 'w2', label: 'رُؤْيَـ...', full: 'رُؤْيَا', expected: 'ا', note: 'اسم سُبقت ألفه بياء' },
                { id: 'w3', label: 'شَكَـ...', full: 'شَكَا', expected: 'ا', note: 'فعل ثلاثي مضارعه يَشْكُو' },
                { id: 'w4', label: 'دَنَـ...', full: 'دَنَا', expected: 'ا', note: 'فعل ثلاثي مضارعه يَدْنُو' },
                { id: 'w5', label: 'رَمَـ...', full: 'رَمَى', expected: 'ى', note: 'فعل ثلاثي مضارعه يَرْمِي' },
                { id: 'w6', label: 'إِلَـ...', full: 'إِلَى', expected: 'ى', note: 'حرف جر بألف مقصورة' },
                { id: 'w7', label: 'سَلْوَ...', full: 'سَلْوَى', expected: 'ى', note: 'اسم فوق الثلاثي' },
                { id: 'w8', label: 'قَضَايَـ...', full: 'قَضَايَا', expected: 'ا', note: 'اسم فوق الثلاثي سبقت ألفه بياء' },
                { id: 'w9', label: 'مَضَـ...', full: 'مَضَى', expected: 'ى', note: 'فعل ثلاثي مضارعه يَمْضِي' },
                { id: 'w10', label: 'مَـ...', full: 'مَا', expected: 'ا', note: 'حرف بألف ممدودة قائمة' },
              ].map((item, idx) => {
                const val = spellingAnswers[item.id] || '';
                const isCorrect = val === item.expected || val === item.full;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all text-center ${
                      isEvaluated
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-rose-50 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                      <button
                        onClick={() => audioManager.speakArabic(item.full, 0.85)}
                        className="text-slate-400 hover:text-emerald-600 transition cursor-pointer p-1"
                        title="استمع للكلمة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-lg font-black text-slate-900 font-sans mb-2">
                      {item.label}
                    </div>

                    {/* Quick Choice Buttons: ا / ى */}
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <button
                        onClick={() => handleQuickInsert(item.id, 'ا')}
                        className={`w-9 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                          val === 'ا'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-300'
                        }`}
                      >
                        ا (ممدودة)
                      </button>
                      <button
                        onClick={() => handleQuickInsert(item.id, 'ى')}
                        className={`w-9 h-8 rounded-lg text-xs font-black transition cursor-pointer ${
                          val === 'ى'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-300'
                        }`}
                      >
                        ى (مقصورة)
                      </button>
                    </div>

                    {isEvaluated && (
                      <div className="text-[11px] font-bold mt-1">
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> صحيح ({item.full})
                          </span>
                        ) : (
                          <span className="text-rose-700">
                            الصحيح: {item.full}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exercise 2: أكتشف الأخطاء في الفقرة وأصححها */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                  ٢
                </span>
                <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                  أَكْتَشِفُ الأَخْطَاءَ الْوَارِدَةَ فِي الْفِقْرَةِ التَّالِيَةِ وَأُصَحِّحُهَا:
                </h4>
              </div>
              <button
                onClick={() =>
                  audioManager.speakArabic(
                    'صَحَا الْجَوُّ، فَقَرَّرَتْ هُدَى وَأُخْتُهَا دُنْيَا الذَّهَابَ إِلَى الْمَصْنَعِ فِي أَقْصَى الْمَدِينَةِ لإِجْرَاءِ مُقَابَلَةٍ مَعَ السَّيِّدِ يَحْيَى مُدِيرِ الإِنْتَاجِ بِالْمَصْنَعِ لِتَعَرُّفِ مَرَاحِلِ إِنْتَاجِ الدُّمَى.',
                    0.85
                  )
                }
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استماع للفقرة 🔊</span>
              </button>
            </div>

            {/* The Raw Paragraph Card from PDF */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-5 text-right font-sans text-base sm:text-lg leading-relaxed text-slate-800">
              «<span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded-md font-black border border-rose-300">صَحَى</span> الْجَوُّ، 
              فَقَرَّرَتْ هُدَى وَأُخْتُهَا <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded-md font-black border border-rose-300">دُنْيَى</span> الذَّهَابَ إِلَى الْمَصْنَعِ فِي <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded-md font-black border border-rose-300">أَقْصَا</span> الْمَدِينَةِ 
              لإِجْرَاءِ مُقَابَلَةٍ مَعَ السَّيِّدِ <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded-md font-black border border-rose-300">يَحْيَا</span> مُدِيرِ الإِنْتَاجِ بِالْمَصْنَعِ 
              لِتَعَرُّفِ مَرَاحِلِ إِنْتَاجِ <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded-md font-black border border-rose-300">الدُّمَا</span>»
            </div>

            {/* Error Table from PDF */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black">
                    <th className="py-2.5 px-4 border-l border-slate-200 w-1/3">الْكَلِمَةُ الْخَاطِئَةُ فِي الْفِقْرَةِ</th>
                    <th className="py-2.5 px-4 w-1/3">تَصْحِيحُهَا الصَّوَابُ</th>
                    <th className="py-2.5 px-4 w-1/3">التَّعْلِيلُ الإِمْلائِيُّ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                  {[
                    { key: 'err1', wrong: 'صَحَى', correct: 'صَحَا', why: 'فعل ثلاثي أصل ألفه واو (يَصْحُو)' },
                    { key: 'err2', wrong: 'دُنْيَى', correct: 'دُنْيَا', why: 'اسم غير ثلاثي سُبقت ألفه بياء فتكتب ممدودة' },
                    { key: 'err3', wrong: 'أَقْصَا', correct: 'أَقْصَى', why: 'اسم فوق الثلاثي لم تُسبق ألفه بياء فتكتب مقصورة' },
                    { key: 'err4', wrong: 'يَحْيَا', correct: 'يَحْيَى', why: 'اسم علم كُتب بالألف المقصورة لتمييزه عن الفعل المضارع' },
                    { key: 'err5', wrong: 'الدُّمَا', correct: 'الدُّمَى', why: 'جمع دمية، اسم ثلاثي أصل ألفه ياء' },
                  ].map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 border-l border-slate-200 font-sans text-rose-600 font-black text-base">
                        {row.wrong}
                      </td>
                      <td className="py-3 px-4 border-l border-slate-200">
                        <input
                          type="text"
                          value={paragraphErrors[row.key]}
                          onChange={(e) => setParagraphErrors((prev) => ({ ...prev, [row.key]: e.target.value }))}
                          placeholder={`اكتب تصحيح (${row.wrong})...`}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-sm bg-white focus:outline-none focus:border-emerald-600"
                        />
                        {isEvaluated && (
                          <div className="text-xs mt-1">
                            {clean(paragraphErrors[row.key]).includes(clean(row.correct)) ? (
                              <span className="text-emerald-700 font-black">✅ ممتاز ({row.correct})</span>
                            ) : (
                              <span className="text-rose-600">الصحيح: {row.correct}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs font-normal text-slate-500">
                        {row.why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Exercise 3: آتي بثلاث كلمات منتهية بألف ممدودة وثلاث بألف مقصورة */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                ٣
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                آتِي بِثَلاَثِ كَلِمَاتٍ مُنْتَهِيَةٍ بِأَلِفٍ مَمْدُودَةٍ (ا) وَثَلاَثِ كَلِمَاتٍ مُنْتَهِيَةٍ بِأَلِفٍ مَقْصُورَةٍ (ى):
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
                <span className="text-xs font-black text-sky-900 block mb-2">
                  كَلِمَاتٌ مُنْتَهِيَةٌ بِأَلِفٍ مَمْدُودَةٍ (ا):
                </span>
                <input
                  type="text"
                  value={generatedMamdooda}
                  onChange={(e) => setGeneratedMamdooda(e.target.value)}
                  placeholder="مثال: دَعَا - أَنَا - رَسَا"
                  className="w-full px-3.5 py-2 rounded-xl border border-sky-300 bg-white font-bold text-sm text-slate-900"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  نموذج الإجابة: دَعَا - أَنَا - رَسَا (أو: عَصَا، دَنَا، شَكَا)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-xs font-black text-emerald-900 block mb-2">
                  كَلِمَاتٌ مُنْتَهِيَةٌ بِأَلِفٍ مَقْصُورَةٍ (ى):
                </span>
                <input
                  type="text"
                  value={generatedMaqsoora}
                  onChange={(e) => setGeneratedMaqsoora(e.target.value)}
                  placeholder="مثال: مَرْعَى - اقْتَدَى - مَرْوَى"
                  className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-sm text-slate-900"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  نموذج الإجابة: مَرْعَى - اقْتَدَى - مَرْوَى (أو: هُدَى، فَتَى، قَضَى)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2) مكون التراكيب: المفعول به ظاهر وضمير + نائب الفاعل */}
      {/* ========================================================================= */}
      {activeSection === 'taraakeeb' && (
        <div className="space-y-6">
          {/* تذكير التراكيب */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white rounded-3xl p-6 border-2 border-indigo-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                تَذْكِيرٌ 📌
              </span>
              <h3 className="text-base font-black text-indigo-950 font-alexandria">
                الْمَفْعُولُ بِهِ (ظَاهِر وَضَمِير) + نَائِبُ الْفَاعِلِ:
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-2xl border border-indigo-200">
                <h5 className="font-black text-xs text-indigo-900 mb-2">١) الْمَفْعُولُ بِهِ:</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  هُوَ الَّذِي وَقَعَ عَلَيْهِ الْفِعْلُ، قَدْ يَأْتِي <strong className="text-indigo-800">ظَاهِراً</strong> (وَيَكُونُ مَنْصُوباً) مِثْلُ: «تَحْمِلُ رُقَيَّةُ سَلَّةً»، وَقَدْ يَأْتِي <strong className="text-purple-800">ضَمِيراً</strong> (كَافُ الْمُخَاطَبِ، هَاءُ الْغَائِبِ، يَاءُ الْمُتَكَلِّمِ) مِثْلُ: «سَأَلَـكَ الأُسْتَاذُ».
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-200">
                <h5 className="font-black text-xs text-indigo-900 mb-2">٢) نَائِبُ الْفَاعِلِ:</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  إِذْ بُنِيَ الْفِعْلُ لِلْمَجْهُولِ حُذِفَ فَاعِلُهُ وَنَابَ عَنْهُ الْمَفْعُولُ بِهِ الَّذِي يَصِيرُ آخِرُهُ مَرْفُوعاً وَيُسَمَّى <strong className="text-emerald-800">نَائِبَ الْفَاعِلِ</strong>.
                  <br />
                  مِثَالٌ: أَصْلَحَ أَيُّوبُ الْجِهَازَ (مبني للمعلوم) ➔ أُصْلِحَ الْجِهَازُ (مبني للمجهول).
                </p>
              </div>
            </div>
          </div>

          {/* Exercise 1: استخراج المفعول به وبيان نوعه */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm">
                ١
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                أَسْتَخْرِجُ الْمَفْعُولَ بِهِ مِنَ الْجُمَلِ الآتِيَةِ وَأُبَيِّنُ نَوْعَهُ:
              </h4>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black">
                    <th className="py-2.5 px-4 border-l border-slate-200">الْجُمْلَةُ</th>
                    <th className="py-2.5 px-4 border-l border-slate-200">الْمَفْعُولُ بِهِ</th>
                    <th className="py-2.5 px-4">نَوْعُهُ (ظَاهِرٌ / ضَمِيرٌ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                  <tr>
                    <td className="py-3 px-4 border-l border-slate-200 font-sans">
                      يُزَوِّدُ الْفَلَّاحُ النَّاسَ بِالْخُضَرِ
                    </td>
                    <td className="py-3 px-4 border-l border-slate-200">
                      <input
                        type="text"
                        value={taraakeebAnswers.m1_val}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m1_val: e.target.value }))}
                        placeholder="المفعول به (النَّاسَ)..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={taraakeebAnswers.m1_type}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m1_type: e.target.value }))}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                      >
                        <option value="ظاهر">ظَاهِرٌ ✅</option>
                        <option value="ضمير">ضَمِيرٌ</option>
                      </select>
                    </td>
                  </tr>

                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 border-l border-slate-200 font-sans">
                      أَرْسَلَهَا الأَبُ إِلَى الْبَادِيَةِ
                    </td>
                    <td className="py-3 px-4 border-l border-slate-200">
                      <input
                        type="text"
                        value={taraakeebAnswers.m2_val}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m2_val: e.target.value }))}
                        placeholder="المفعول به (ـهَا)..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={taraakeebAnswers.m2_type}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m2_type: e.target.value }))}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                      >
                        <option value="ضمير">ضَمِيرٌ ✅</option>
                        <option value="ظاهر">ظَاهِرٌ</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 border-l border-slate-200 font-sans">
                      زُرْتُ الْقَصَبَةَ
                    </td>
                    <td className="py-3 px-4 border-l border-slate-200">
                      <input
                        type="text"
                        value={taraakeebAnswers.m3_val}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m3_val: e.target.value }))}
                        placeholder="المفعول به (الْقَصَبَةَ)..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={taraakeebAnswers.m3_type}
                        onChange={(e) => setTaraakeebAnswers((prev) => ({ ...prev, m3_type: e.target.value }))}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                      >
                        <option value="ظاهر">ظَاهِرٌ ✅</option>
                        <option value="ضمير">ضَمِيرٌ</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Exercise 2: أحيط بنائب الفاعل */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm">
                ٢
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                أُحِيطُ بِنَائِبِ الْفَاعِلِ فِي الْجُمَلِ الآتِيَةِ (اختر الجمل التي تشتمل على نائب فاعل):
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'sent1', text: 'تُرْفَعُ السَّيَّارَةُ', target: 'السَّيَّارَةُ', isNaeb: true },
                { key: 'sent2', text: 'تَذْهَبُ الْبِنْتُ', target: 'الْبِنْتُ (فاعل)', isNaeb: false },
                { key: 'sent3', text: 'يُصْلَحُ الْعَطَبُ', target: 'الْعَطَبُ', isNaeb: true },
                { key: 'sent4', text: 'تُقَدَّمُ الْهَدِيَّةُ', target: 'الْهَدِيَّةُ', isNaeb: true },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() =>
                    setNaebFaielChoices((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                    naebFaielChoices[item.key]
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="font-black text-base text-slate-900 font-sans">
                    ❖ {item.text}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      naebFaielChoices[item.key]
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {naebFaielChoices[item.key] && <Check className="w-3.5 h-3.5" />}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 ملحوظة: الجمل المبنية للمجهول المشتملة على نائب فاعل هي: (تُرفَعُ السَّيَّارَةُ، يُصْلَحُ العَطَبُ، تُقَدَّمُ الهَدِيَّةُ).
            </p>
          </div>

          {/* Exercise 3: الإعراب النموذجي */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm">
                ٣
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                أُعْرِبُ إِعْرَاباً تَامّاً نَمُوذَجِيّاً:
              </h4>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <span className="bg-indigo-700 text-white text-xs font-black px-2.5 py-0.5 rounded-full inline-block">
                  الْجُمْلَةُ الأُولَى: يَغْرِسُ الأَوْلادُ الزُّهُورَ
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-bold text-slate-700 pt-2">
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-indigo-950 font-black">يَغْرِسُ: </span>
                    فِعْلٌ مُضَارِعٌ مَرْفُوعٌ بِالضَّمَّةِ الظَّاهِرَةِ عَلَى آخِرِهِ.
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-indigo-950 font-black">الأَوْلادُ: </span>
                    فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ الظَّاهِرَةِ عَلَى آخِرِهِ.
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-indigo-950 font-black">الزُّهُورَ: </span>
                    مَفْعُولٌ بِهِ مَنْصُوبٌ بِالْفَتْحَةِ الظَّاهِرَةِ عَلَى آخِرِهِ.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <span className="bg-emerald-700 text-white text-xs font-black px-2.5 py-0.5 rounded-full inline-block">
                  الْجُمْلَةُ الثَّانِيَةُ: حُصِدَ الزَّرْعُ
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-2">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-950 font-black">حُصِدَ: </span>
                    فِعْلٌ مَاضٍ مَبْنِيٌّ لِلْمَجْهُولِ مَبْنِيٌّ عَلَى الْفَتْحِ.
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-950 font-black">الزَّرْعُ: </span>
                    نَائِبُ الْفَاعِلِ مَرْفُوعٌ بِالضَّمَّةِ الظَّاهِرَةِ عَلَى آخِرِهِ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3) مكون الصرف والتحويل: الفعل المبني للمجهول (ماضٍ ومضارع) */}
      {/* ========================================================================= */}
      {activeSection === 'sarf' && (
        <div className="space-y-6">
          {/* تذكير الصرف */}
          <div className="bg-gradient-to-br from-blue-50 via-sky-50/60 to-white rounded-3xl p-6 border-2 border-blue-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                تَذْكِيرٌ 📌
              </span>
              <h3 className="text-base font-black text-blue-950 font-alexandria">
                الْفِعْلُ الْمَبْنِيُّ لِلْمَجْهُولِ (الْمَاضِي وَالْمُضَارِعُ):
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-blue-200">
                <span className="bg-rose-100 text-rose-900 text-xs font-black px-2 py-0.5 rounded-md inline-block mb-1.5">
                  الْفِعْلُ الْمَاضِي الْمَبْنِيُّ لِلْمَجْهُولِ
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-bold">
                  «يُضَمُّ أَوَّلُهُ وَيُكْسَرُ مَا قَبْلَ آخِرِهِ»
                  <br />
                  مِثَالٌ: <strong className="text-blue-900">طَحَنَ</strong> ➔ <strong className="text-rose-700">طُـحِـنَ</strong> (طُحِنَ الْقَمْحُ).
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200">
                <span className="bg-sky-100 text-sky-900 text-xs font-black px-2 py-0.5 rounded-full inline-block mb-1.5">
                  الْفِعْلُ الْمُضَارِعُ الْمَبْنِيُّ لِلْمَجْهُولِ
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-bold">
                  «يُضَمُّ أَوَّلُهُ وَيُفْتَحُ مَا قَبْلَ آخِرِهِ»
                  <br />
                  مِثَالٌ: <strong className="text-blue-900">يَصْنَعُ</strong> ➔ <strong className="text-sky-700">يُـصْـنَـعُ / تُصْنَعُ</strong> (تُصْنَعُ الْمِزْهَرِيَّةُ).
                </p>
              </div>
            </div>
          </div>

          {/* Exercise 1: أجعل الأفعال مبنية للمجهول وأغير ما ينبغي تغييره */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                ١
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                أَجْعَلُ الأَفْعَالَ فِي الْجُمَلِ التَّالِيَةِ مَبْنِيَّةً لِلْمَجْهُولِ وَأُغَيِّرُ مَا يَنْبَغِي تَغْيِيرُهُ:
              </h4>
            </div>

            <div className="space-y-3">
              {[
                { key: 's1', original: 'قَطَفَ الْعُمَّالُ الثِّمَارَ', target: 'قُطِفَتِ الثِّمَارُ', note: 'تأنيث الفعل لأن الثمار مؤنث' },
                { key: 's2', original: 'أَصْلَحَ سَعِيدٌ الْجِهَازَ', target: 'أُصْلِحَ الْجِهَازُ', note: 'حذف الفاعل سعيد ورفع الجهاز' },
                { key: 's3', original: 'يَدَّخِرُ الْمُقْتَصِدُ الْمَالَ', target: 'يُدَّخَرُ الْمَالُ', note: 'مضارع: ضم الأول وفتح ما قبل الآخر' },
                { key: 's4', original: 'اشْتَرَى التَّاجِرُ سِلْعَةً', target: 'اشْتُرِيَتْ سِلْعَةٌ', note: 'سلعةٌ نائب فاعل مرفوع بالضم' },
                { key: 's5', original: 'أَتْقَنَ الْمُمَثِّلُ الدَّوْرَ إِتْقَاناً', target: 'أُتْقِنَ الدَّوْرُ إِتْقَاناً', note: 'الدورُ نائب فاعل مرفوع' },
                { key: 's6', original: 'يَصُونُ أَيُّوبُ اللَّوْحَةَ الإِلِكْتَرُونِيَّةَ', target: 'تُصَانُ اللَّوْحَةُ الإِلِكْتَرُونِيَّةُ', note: 'يصون تتحول إلى تُصان مع اللوحة' },
              ].map((item, idx) => (
                <div key={item.key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-black text-sm sm:text-base text-slate-900 font-sans">
                      {idx + 1}. {item.original} ➔
                    </span>

                    <input
                      type="text"
                      value={sarfAnswers[item.key]}
                      onChange={(e) => setSarfAnswers((prev) => ({ ...prev, [item.key]: e.target.value }))}
                      placeholder={`أدخل التحويل (${item.target})...`}
                      className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {isEvaluated && (
                    <div className="mt-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                      <span className="text-emerald-700">الصحيح: {item.target}</span>
                      <span className="font-normal text-slate-400">({item.note})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 2: أحول الأفعال التالية للمبني للمجهول وأركبها في جملة مفيدة */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                ٢
              </span>
              <h4 className="font-black text-sm sm:text-base text-slate-900 font-alexandria">
                أُحَوِّلُ الأَفْعَالَ التَّالِيَةَ إِلَى الْمَبْنِيِّ لِلْمَجْهُولِ وَأُرَكِّبُهَا فِي جُمْلَةٍ مُفِيدَةٍ:
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { key: 'v1', verb: 'يَكْتَشِفُ', passive: 'يُكْتَشَفُ', sentence: 'يُكْتَشَفُ الدَّوَاءُ' },
                { key: 'v2', verb: 'اسْتَقْبَلَ', passive: 'اسْتُقْبِلَ', sentence: 'اسْتُقْبِلَ الضُّيُوفُ' },
                { key: 'v3', verb: 'يَحْصُدُ', passive: 'يُحْصَدُ', sentence: 'يُحْصَدُ الزَّرْعُ بِالْمِنْجَلِ' },
                { key: 'v4', verb: 'سَمَّدَ', passive: 'سُمِّدَ', sentence: 'سُمِّدَتِ التُّرْبَةُ بِالسَّمَادِ الْحَيَوَانِيِّ' },
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-blue-900 font-sans">
                      {item.verb}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ➔ {item.passive}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={verbTransformAnswers[item.key]}
                    onChange={(e) => setVerbTransformAnswers((prev) => ({ ...prev, [item.key]: e.target.value }))}
                    placeholder={`جملة مفيدة: ${item.sentence}`}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                  />

                  {isEvaluated && (
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      النموذج: {item.sentence}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Sticky Evaluation Toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-300 flex items-center gap-3">
        <button
          onClick={handleEvaluateAll}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>تصحيح التمارين بالكامل ✅</span>
        </button>

        <button
          onClick={handleReset}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </button>
      </div>

      {/* Solution Modal matching PDF pages 2, 4, 6 */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 font-alexandria">
                  عناصر التصحيح والحل النموذجي (الصفحات ٢، ٤، ٦)
                </h3>
              </div>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <h5 className="font-black text-sm text-emerald-950 mb-2">تصحيح مكون الإملاء:</h5>
                <p>1) ضُحَى - رُؤْيَا - شَكَا - دَنَا - رَمَى - إِلَى - سَلْوَى - قَضَايَا - مَضَى - مَا</p>
                <p className="mt-1">
                  2) الأخطاء وتصحيحها: صَحَى ➔ صَحَا | دُنْيَى ➔ دُنْيَا | أَقْصَا ➔ أَقْصَى | يَحْيَا ➔ يَحْيَى | الدُّمَا ➔ الدُّمَى
                </p>
                <p className="mt-1">3) ممدودة: دَعَا - أَنَا - رَسَا | مقصورة: مَرْعَى - اقْتَدَى - مَرْوَى</p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                <h5 className="font-black text-sm text-indigo-950 mb-2">تصحيح مكون التراكيب:</h5>
                <p>1) المفعول به: النَّاسَ (ظاهر) | ـهَا (ضمير) | الْقَصَبَةَ (ظاهر)</p>
                <p className="mt-1">2) نائب الفاعل: السَّيَّارَةُ، الْعَطَبُ، الْهَدِيَّةُ</p>
                <p className="mt-1">3) الإعراب: يَغْرِسُ (مضارع مرفوع) الأَوْلادُ (فاعل مرفوع) الزُّهُورَ (مفعول به منصوب) | حُصِدَ (ماض مبني للمجهول) الزَّرْعُ (نائب فاعل مرفوع بالضمة)</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <h5 className="font-black text-sm text-blue-950 mb-2">تصحيح مكون الصرف والتحويل:</h5>
                <p>1) قُطِفَتِ الثِّمَارُ | أُصْلِحَ الْجِهَازُ | يُدَّخَرُ الْمَالُ | اشْتُرِيَتْ سِلْعَةٌ | أُتْقِنَ الدَّوْرُ إِتْقَاناً | تُصَانُ اللَّوْحَةُ الإِلِكْتَرُونِيَّةُ</p>
                <p className="mt-1">2) يُكْتَشَفُ الدَّوَاءُ | اسْتُقْبِلَ الضُّيُوفُ | يُحْصَدُ الزَّرْعُ بِالْمِنْجَلِ | سُمِّدَتِ التُّرْبَةُ بِالسَّمَادِ الْحَيَوَانِيِّ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet Modal */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 printable-area max-h-[90vh] overflow-y-auto">
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-800">
                  معاينة ورقة الأنشطة الداعمة للطباعة (A4)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  🖨️ طباعة الآن
                </button>
                <button
                  onClick={() => setIsPrinting(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Content matching PDF Layout */}
            <div className="text-right space-y-6">
              <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-3">
                <div>
                  <h2 className="font-black text-lg text-emerald-950 font-alexandria">
                    م/م زاكموزن • أنشطة داعمة وتثبيت
                  </h2>
                  <p className="text-xs text-slate-600 font-bold">
                    المستوى الرابع ابتدائي • مكون الإملاء والتراكيب والصرف
                  </p>
                </div>
                <div className="text-left text-xs font-bold text-slate-700">
                  <div>اسم التلميذ(ة): .......................................</div>
                  <div>القسم: الرابع ( ... )</div>
                  <div>تاريخ اليوم: ..... / ..... / ٢٠٢ مـ</div>
                </div>
              </div>

              {/* PDF Content */}
              <div className="space-y-4 text-xs">
                <div className="border border-slate-300 p-3 rounded-lg">
                  <h4 className="font-black text-slate-900 mb-2">١) أكمل بألف ممدودة أو مقصورة:</h4>
                  <p className="font-sans leading-loose">
                    ضُحَـ... - رُؤْيَـ... - شَكَـ... - دَنَـ... - رَمَـ... - إِلَـ... - سَلْوَ... - قَضَايَـ... - مَضَـ... - مَـ...
                  </p>
                </div>

                <div className="border border-slate-300 p-3 rounded-lg">
                  <h4 className="font-black text-slate-900 mb-2">٢) أكتشف الأخطاء الواردة في الفقرة وأصححها:</h4>
                  <p className="italic mb-2">«صَحَى الْجَوُّ، فَقَرَّرَتْ هُدَى وَأُخْتُهَا دُنْيَى الذَّهَابَ إِلَى الْمَصْنَعِ فِي أَقْصَا الْمَدِينَةِ لإِجْرَاءِ مُقَابَلَةٍ مَعَ السَّيِّدِ يَحْيَا مُدِيرِ الإِنْتَاجِ بِالْمَصْنَعِ لِتَعَرُّفِ مَرَاحِلِ إِنْتَاجِ الدُّمَا»</p>
                  <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-200 pt-2 font-mono">
                    <div>الأخطاء: .......................................</div>
                    <div>تصحيحها: .......................................</div>
                  </div>
                </div>

                <div className="border border-slate-300 p-3 rounded-lg">
                  <h4 className="font-black text-slate-900 mb-2">٣) آتي بثلاث كلمات بألف ممدودة وثلاث بألف مقصورة:</h4>
                  <div>كلمات بألف ممدودة: ................................................................</div>
                  <div className="mt-1">كلمات بألف مقصورة: ................................................................</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <div>ملاحظة الأستاذ(ة): ............................................</div>
                <div>النقطة: ( ..... / ١٠ ) ⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
