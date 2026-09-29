import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Volume2, 
  RotateCcw, 
  HelpCircle,
  Lightbulb,
  Check,
  X
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { shuffleQuestionOptions } from '../utils/shuffle';

export const Grade1Unit1Assessment: React.FC = () => {
  // Exercise 1: Match word to letter shape (ميم وأشكاله)
  const [q1Matches, setQ1Matches] = useState<Record<string, string>>({});
  // Exercise 2: Match letter to picture
  const [q2Matches, setQ2Matches] = useState<Record<string, string>>({});
  // Exercise 3: Syllable breakdown for بَلَدُ
  const [q3Inputs, setQ3Inputs] = useState({ s1: '', s2: '', s3: '', combined: '' });
  // Exercise 4: Missing letter
  const [q4Inputs, setQ4Inputs] = useState({ w1: '', w2: '', w3: '' });
  // Exercise 5: Selected shapes
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [resetCount, setResetCount] = useState<number>(0);

  // Q1 Data: Word to shape of letter M (options randomly shuffled so the answer is never predictable)
  const q1Words = useMemo(() => {
    const raw = [
      { id: 'w_qalam', word: 'قَلَمُ', correctShape: 'ـم', options: ['ـم', 'ـمـ', 'مـ', 'د'] },
      { id: 'w_zaman', word: 'زَمَانُ', correctShape: 'ـمـ', options: ['ـمـ', 'ـم', 'مـ', 'ر'] },
      { id: 'w_mawz', word: 'مَوْزُ', correctShape: 'مـ', options: ['مـ', 'ـم', 'ـمـ', 'ن'] },
      { id: 'w_hadiqah', word: 'حَدِيقَةُ', correctShape: 'ـد', options: ['ـد', 'د', 'ـل', 'مـ'] }
    ];
    return raw.map(item => {
      const { shuffledOptions } = shuffleQuestionOptions(item.options, item.options.indexOf(item.correctShape));
      return { ...item, options: shuffledOptions };
    });
  }, [resetCount]);

  // Q2 Data: Letter to Picture (options randomly shuffled so the answer is never predictably first)
  const q2Items = useMemo(() => {
    const raw = [
      { letter: 'ب', name: 'باء', correctImage: 'بطة', emoji: '🦆', options: ['بطة', 'رمان', 'موز', 'نخلة'] },
      { letter: 'ر', name: 'راء', correctImage: 'رمان', emoji: '🍎', options: ['رمان', 'موز', 'نخلة', 'بطة'] },
      { letter: 'م', name: 'ميم', correctImage: 'موز', emoji: '🍌', options: ['موز', 'بطة', 'رمان', 'نخلة'] },
      { letter: 'ن', name: 'نون', correctImage: 'نخلة', emoji: '🌴', options: ['نخلة', 'رمان', 'موز', 'بطة'] }
    ];
    return raw.map(item => {
      const { shuffledOptions } = shuffleQuestionOptions(item.options, item.options.indexOf(item.correctImage));
      return { ...item, options: shuffledOptions };
    });
  }, [resetCount]);

  const handleSelectQ1 = (wordId: string, shape: string) => {
    setQ1Matches(prev => ({ ...prev, [wordId]: shape }));
    audioManager.play('click');
  };

  const handleSelectQ2 = (letter: string, item: string) => {
    setQ2Matches(prev => ({ ...prev, [letter]: item }));
    audioManager.play('click');
  };

  const handleResetAll = () => {
    setQ1Matches({});
    setQ2Matches({});
    setQ3Inputs({ s1: '', s2: '', s3: '', combined: '' });
    setQ4Inputs({ w1: '', w2: '', w3: '' });
    setCompletedExercises([]);
    setResetCount(prev => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner matching the official test paper */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-indigo-950 text-white shadow-xl border border-rose-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                ورقة تقييم معتمدة • الفترة الأولى
              </span>
              <span className="text-xs text-rose-200 font-bold">
                إعداد المعلمة: منيرة العمري & منهاج لغتي
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
              تقييم الوحدة الأولى (أُسْرَتِي) - مهارات القراءة والكتابة
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
              تمارين تفاعلية متطابقة مع نموذج الاختبار: صِل الكلمة بشكل الحرف، صِل الحرف بالصورة، تحليل الكلمة لمقاطع، وإكمال الحرف الناقص.
            </p>
          </div>

          <button
            onClick={handleResetAll}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>إعادة الاختبار</span>
          </button>
        </div>
      </div>

      {/* Exercise 1: صِلِ الكَلِمَةَ بِشَكْلِ الحَرْفِ المُنَاسِبِ */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
              ١
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base font-alexandria">
              - صِلِ الكَلِمَةَ بِشَكْلِ الحَرْفِ المُنَاسِبِ:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">درجتان</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {q1Words.map((item) => {
            const currentChoice = q1Matches[item.id];
            const isCorrect = currentChoice === item.correctShape;

            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-black font-serif text-slate-900">
                    {item.word}
                  </span>
                  <button
                    onClick={() => audioManager.speakArabic(item.word, 0.75)}
                    className="p-1 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 font-bold">
                  اختر شكل الحرف الملون:
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {item.options.map((shape, sIdx) => {
                    const selected = currentChoice === shape;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleSelectQ1(item.id, shape)}
                        className={`py-2 px-2 rounded-xl text-base font-black font-serif transition-all border ${
                          selected
                            ? shape === item.correctShape
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-rose-600 text-white border-rose-700'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    );
                  })}
                </div>

                {currentChoice && (
                  <div className={`text-xs font-bold pt-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {isCorrect ? '✓ إجابة صحيحة ومتقنة!' : `✕ الصحيح هو: ${item.correctShape}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise 2: صِلِ الحَرْفَ بِالصُّورَةِ المُنَاسِبَةِ */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
              ٢
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base font-alexandria">
              - صِلِ الحَرْفَ بِالصُّورَةِ المُنَاسِبَةِ:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">درجتان</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {q2Items.map((item) => {
            const currentChoice = q2Matches[item.letter];
            const isCorrect = currentChoice === item.correctImage;

            return (
              <div key={item.letter} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {item.letter}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-600">
                  حرف ({item.name}) يبدأ به اسم:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {item.options.map((opt, oIdx) => {
                    const selected = currentChoice === opt;
                    const optEmoji = opt === 'بطة' ? '🦆' : opt === 'رمان' ? '🍎' : opt === 'موز' ? '🍌' : '🌴';

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectQ2(item.letter, opt)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                          selected
                            ? opt === item.correctImage
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-rose-600 text-white border-rose-700'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="text-xl">{optEmoji}</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {currentChoice && (
                  <div className={`text-xs font-bold pt-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {isCorrect ? '✓ رائع! إجابة صحيحة' : `✕ يبدأ به: ${item.correctImage}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise 3: حَلِّلِ الكَلِمَاتِ التَّالِيَةَ إِلَى مَقَاطِعَ ثُمَّ اكْتُبْهَا */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm">
              ٣
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base font-alexandria">
              - حَلِّلِ الكَلِمَةَ إِلَى مَقَاطِعَ ثُمَّ اكْتُبْهَا:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">درجة واحدة</span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">الكلمة المستهدفة:</span>
              <span className="text-2xl font-black font-serif text-amber-950 px-3 py-1 bg-white rounded-xl border border-amber-300 shadow-2xs">
                بَلَدُ
              </span>
              <button
                onClick={() => audioManager.speakArabic('بَلَدُ ، بَـ ، لَـ ، دُ', 0.7)}
                className="p-1.5 rounded-xl bg-amber-200 text-amber-900 hover:bg-amber-300"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-amber-800 font-bold">بَـ + لَـ + دُ = بَلَدُ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-black text-slate-700 block">التَّحْلِيلُ (المقاطع الصوتية):</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="بَـ"
                  value={q3Inputs.s1}
                  onChange={(e) => setQ3Inputs(prev => ({ ...prev, s1: e.target.value }))}
                  className="w-16 text-center text-lg font-black font-serif p-2 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
                <span className="font-bold text-slate-400">+</span>
                <input
                  type="text"
                  placeholder="لَـ"
                  value={q3Inputs.s2}
                  onChange={(e) => setQ3Inputs(prev => ({ ...prev, s2: e.target.value }))}
                  className="w-16 text-center text-lg font-black font-serif p-2 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
                <span className="font-bold text-slate-400">+</span>
                <input
                  type="text"
                  placeholder="دُ"
                  value={q3Inputs.s3}
                  onChange={(e) => setQ3Inputs(prev => ({ ...prev, s3: e.target.value }))}
                  className="w-16 text-center text-lg font-black font-serif p-2 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Reassembly */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-black text-slate-700 block">التَّرْكِيبُ (كتابة الكلمة كاملة):</span>
              <input
                type="text"
                placeholder="بَلَدُ"
                value={q3Inputs.combined}
                onChange={(e) => setQ3Inputs(prev => ({ ...prev, combined: e.target.value }))}
                className="w-full text-center text-xl font-black font-serif p-2 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 4: أَكْمِلِ الحَرْفَ النَّاقِصَ فِي الكَلِمَاتِ التَّالِيَةِ */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              ٤
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base font-alexandria">
              - أَكْمِلِ الحَرْفَ النَّاقِصَ فِي الكَلِمَاتِ التَّالِيَةِ:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">٣ درجات</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Item 1: رَمْلُ */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <span className="text-4xl block">🏖️</span>
            <p className="text-xs font-bold text-slate-600">رَ ... لُ (صورة رمل)</p>
            <div className="flex items-center justify-center gap-2">
              {['مـ', 'ـسـ', 'بـ'].map((c, i) => (
                <button
                  key={i}
                  onClick={() => setQ4Inputs(prev => ({ ...prev, w1: c }))}
                  className={`px-3 py-1.5 rounded-xl font-black font-serif text-base border transition-all ${
                    q4Inputs.w1 === c
                      ? c === 'مـ' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {q4Inputs.w1 && (
              <span className={`text-xs font-bold block ${q4Inputs.w1 === 'مـ' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {q4Inputs.w1 === 'مـ' ? '✓ رَمْلُ' : '✕ الصحيح: مـ'}
              </span>
            )}
          </div>

          {/* Item 2: عَسَلُ */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <span className="text-4xl block">🍯</span>
            <p className="text-xs font-bold text-slate-600">عَ ... لُ (صورة عسل)</p>
            <div className="flex items-center justify-center gap-2">
              {['ـسـ', 'ـمـ', 'ـد'].map((c, i) => (
                <button
                  key={i}
                  onClick={() => setQ4Inputs(prev => ({ ...prev, w2: c }))}
                  className={`px-3 py-1.5 rounded-xl font-black font-serif text-base border transition-all ${
                    q4Inputs.w2 === c
                      ? c === 'ـسـ' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {q4Inputs.w2 && (
              <span className={`text-xs font-bold block ${q4Inputs.w2 === 'ـسـ' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {q4Inputs.w2 === 'ـسـ' ? '✓ عَسَلُ' : '✕ الصحيح: ـسـ'}
              </span>
            )}
          </div>

          {/* Item 3: نَمِرُ */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <span className="text-4xl block">🐅</span>
            <p className="text-xs font-bold text-slate-600">نَ ... رُ (صورة نمر)</p>
            <div className="flex items-center justify-center gap-2">
              {['ـمـ', 'ـبـ', 'ـلـ'].map((c, i) => (
                <button
                  key={i}
                  onClick={() => setQ4Inputs(prev => ({ ...prev, w3: c }))}
                  className={`px-3 py-1.5 rounded-xl font-black font-serif text-base border transition-all ${
                    q4Inputs.w3 === c
                      ? c === 'ـمـ' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {q4Inputs.w3 && (
              <span className={`text-xs font-bold block ${q4Inputs.w3 === 'ـمـ' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {q4Inputs.w3 === 'ـمـ' ? '✓ نَمِرُ' : '✕ الصحيح: ـمـ'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Exercise 5: اكْتُبِ الحَرْفَ بِأَشْكَالِهِ المُخْتَلِفَةِ */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">
              ٥
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base font-alexandria">
              - مَعْرِضُ أَشْكَالِ الحُرُوفِ المُخْتَلِفَةِ لِلْكِتَابَةِ عَلَى السَّطْرِ:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">درجتان</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'الميم في الوسط', shape: 'ـمـ', example: 'نَمِرُ' },
            { label: 'الراء المتصلة', shape: 'ـر', example: 'نَمِرُ' },
            { label: 'النون في الأول', shape: 'نـ', example: 'نَمِرُ' },
            { label: 'اللام المتصلة', shape: 'ـل', example: 'عَسَلُ' },
            { label: 'الدال المنفصلة', shape: 'د', example: 'دَرَّاجَةُ' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-center space-y-1">
              <span className="text-3xl font-black font-serif text-purple-950 block">
                {item.shape}
              </span>
              <span className="text-[11px] font-bold text-slate-600 block">
                {item.label}
              </span>
              <span className="text-[10px] text-purple-800 bg-white px-2 py-0.5 rounded-md inline-block">
                مثل: {item.example}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
