import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, CheckCircle2, RotateCcw, Award, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { Grade1Unit1VisualReviewCard } from './Grade1Unit1VisualReviewCard';

export const Grade1Unit1LetterReview: React.FC = () => {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [readWords, setReadWords] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'visual' | 'interactive'>('visual');

  const lettersData = [
    {
      letter: 'م',
      name: 'ميم',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      badgeColor: 'bg-rose-600 text-white',
      shortVowels: [
        { char: 'مَ', phonetic: 'مَـ (فتحة قصيرة)' },
        { char: 'مُ', phonetic: 'مُـ (ضمة قصيرة)' },
        { char: 'مِ', phonetic: 'مِـ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'مَا', phonetic: 'مَا (مد بالألف)' },
        { char: 'مُو', phonetic: 'مُو (مد بالواو)' },
        { char: 'مِي', phonetic: 'مِي (مد بالياء)' }
      ]
    },
    {
      letter: 'ب',
      name: 'باء',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badgeColor: 'bg-blue-600 text-white',
      shortVowels: [
        { char: 'بَ', phonetic: 'بَـ (فتحة قصيرة)' },
        { char: 'بُ', phonetic: 'بُـ (ضمة قصيرة)' },
        { char: 'بِ', phonetic: 'بِـ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'بَا', phonetic: 'بَا (مد بالألف)' },
        { char: 'بُو', phonetic: 'بُو (مد بالواو)' },
        { char: 'بِي', phonetic: 'بِي (مد بالياء)' }
      ]
    },
    {
      letter: 'ل',
      name: 'لام',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeColor: 'bg-emerald-600 text-white',
      shortVowels: [
        { char: 'لَ', phonetic: 'لَـ (فتحة قصيرة)' },
        { char: 'لُ', phonetic: 'لُـ (ضمة قصيرة)' },
        { char: 'لِ', phonetic: 'لِـ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'لَا', phonetic: 'لَا (مد بالألف)' },
        { char: 'لُو', phonetic: 'لُو (مد بالواو)' },
        { char: 'لِي', phonetic: 'لِي (مد بالياء)' }
      ]
    },
    {
      letter: 'د',
      name: 'دال',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeColor: 'bg-amber-600 text-white',
      shortVowels: [
        { char: 'دَ', phonetic: 'دَ (فتحة قصيرة)' },
        { char: 'دُ', phonetic: 'دُ (ضمة قصيرة)' },
        { char: 'دِ', phonetic: 'دِ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'دَا', phonetic: 'دَا (مد بالألف)' },
        { char: 'دُو', phonetic: 'دُو (مد بالواو)' },
        { char: 'دِي', phonetic: 'دِي (مد بالياء)' }
      ]
    },
    {
      letter: 'ن',
      name: 'نون',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      badgeColor: 'bg-purple-600 text-white',
      shortVowels: [
        { char: 'نَ', phonetic: 'نَـ (فتحة قصيرة)' },
        { char: 'نُ', phonetic: 'نُـ (ضمة قصيرة)' },
        { char: 'نِ', phonetic: 'نِـ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'نَا', phonetic: 'نَا (مد بالألف)' },
        { char: 'نُو', phonetic: 'نُو (مد بالواو)' },
        { char: 'نِي', phonetic: 'نِي (مد بالياء)' }
      ]
    },
    {
      letter: 'ر',
      name: 'راء',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      badgeColor: 'bg-teal-600 text-white',
      shortVowels: [
        { char: 'رَ', phonetic: 'رَ (فتحة قصيرة)' },
        { char: 'رُ', phonetic: 'رُ (ضمة قصيرة)' },
        { char: 'رِ', phonetic: 'رِ (كسرة قصيرة)' }
      ],
      longVowels: [
        { char: 'رَا', phonetic: 'رَا (مد بالألف)' },
        { char: 'رُو', phonetic: 'رُو (مد بالواو)' },
        { char: 'رِي', phonetic: 'رِي (مد بالياء)' }
      ]
    }
  ];

  const twoLetterWords = [
    { word: 'مَنْ', breakdown: 'مَـ + نْ' },
    { word: 'نَبْ', breakdown: 'نَـ + بْ' },
    { word: 'لَدْ', breakdown: 'لَـ + دْ' },
    { word: 'رَدْ', breakdown: 'رَ + دْ' },
    { word: 'نَمْ', breakdown: 'نَـ + مْ' },
    { word: 'لَمْ', breakdown: 'لَـ + مْ' },
    { word: 'رَمْ', breakdown: 'رَ + مْ' },
    { word: 'دَرْ', breakdown: 'دَ + رْ' },
    { word: 'بَلْ', breakdown: 'بَـ + لْ' },
    { word: 'نَدْ', breakdown: 'نَـ + دْ' }
  ];

  const handlePlaySound = (soundText: string, id: string) => {
    setActiveCell(id);
    audioManager.speakArabic(soundText, 0.8);
    setTimeout(() => setActiveCell(null), 1000);
  };

  const handleToggleReadWord = (word: string) => {
    audioManager.speakArabic(word, 0.75);
    setReadWords(prev => 
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner matching the official worksheet */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white shadow-xl border border-emerald-600/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                مراجعة هامة ومعتمدة
              </span>
              <span className="text-xs text-emerald-200 font-bold">
                الوحدة الأولى: أُسْرَتِي (م ، ب ، ل ، د ، ن ، ر)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
              جدول مراجعة الحروف بالأصوات القصيرة والأصوات الطويلة
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
              انقر على أي حرف أو مد للاستماع إلى النطق السليم، ثم تدرب على القراءة السريعة لتهجئة مقاطع الحرفين.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => audioManager.speakArabic('مراجعة حروف الوحدة الأولى أسرتي: الحروف بالأصوات القصيرة والأصوات الطويلة، وقراءة مقاطع الحرفين.')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>نطق المقدمة</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs inside the banner */}
        <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-2">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>البطاقة المصورة (ورقة المراجعة الرسمية) 🖼️</span>
          </button>

          <button
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>الجدول التفاعلي المتقدم 📊</span>
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <Grade1Unit1VisualReviewCard />
      ) : (
        <>
      {/* Part 1: Table of Short & Long Vowels */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
              ١
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base font-alexandria">
                # الحروف بالأصوات القصيرة والأصوات الطويلة
              </h3>
              <p className="text-xs text-slate-500">
                قارن بين زمن نطق الحركة (صوت قصير) وزمن امتداد حرف المد (صوت طويل)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ٦ حروف أساسية
          </span>
        </div>

        {/* Master Vowels Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-xs font-black text-slate-700 bg-slate-100 rounded-tr-2xl border-b-2 border-slate-200 w-16">
                  الحرف
                </th>
                <th className="p-3 text-sm font-black text-emerald-950 bg-emerald-100/70 border-b-2 border-emerald-300" colSpan={3}>
                  🔊 الصوت القصير (الحركات)
                </th>
                <th className="p-3 text-sm font-black text-indigo-950 bg-indigo-100/70 rounded-tl-2xl border-b-2 border-indigo-300" colSpan={3}>
                  ✨ الصوت الطويل (المُدُود)
                </th>
              </tr>
              <tr className="text-xs font-bold text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="p-2 border-l border-slate-200">اسم الحرف</th>
                <th className="p-2 border-l border-slate-200">فَتْحَة ( َ )</th>
                <th className="p-2 border-l border-slate-200">ضَمَّة ( ُ )</th>
                <th className="p-2 border-l border-slate-200">كَسْرَة ( ِ )</th>
                <th className="p-2 border-l border-slate-200">مَدّ بِالأَلِف (ا)</th>
                <th className="p-2 border-l border-slate-200">مَدّ بِالوَاو (و)</th>
                <th className="p-2">مَدّ بِاليَاء (ي)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-base font-bold">
              {lettersData.map((item) => (
                <tr key={item.letter} className="hover:bg-slate-50/70 transition-colors">
                  {/* Letter badge */}
                  <td className="p-3 border-l border-slate-200">
                    <div className="flex flex-col items-center justify-center">
                      <span className={`w-9 h-9 rounded-xl ${item.badgeColor} flex items-center justify-center font-black text-lg shadow-xs`}>
                        {item.letter}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.name}</span>
                    </div>
                  </td>

                  {/* Short Vowels */}
                  {item.shortVowels.map((sv, idx) => {
                    const cellId = `sv_${item.letter}_${idx}`;
                    return (
                      <td key={idx} className="p-2 border-l border-slate-200">
                        <button
                          onClick={() => handlePlaySound(sv.char, cellId)}
                          className={`w-full py-2.5 px-2 rounded-xl text-xl font-black font-serif transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            activeCell === cellId
                              ? 'bg-emerald-600 text-white scale-105 shadow-md'
                              : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60'
                          }`}
                          title={`استمع لصوت: ${sv.phonetic}`}
                        >
                          <span>{sv.char}</span>
                          <span className="text-[10px] text-emerald-700/70 font-sans font-normal hidden sm:inline">
                            قصير
                          </span>
                        </button>
                      </td>
                    );
                  })}

                  {/* Long Vowels */}
                  {item.longVowels.map((lv, idx) => {
                    const cellId = `lv_${item.letter}_${idx}`;
                    return (
                      <td key={idx} className={`p-2 ${idx < 2 ? 'border-l border-slate-200' : ''}`}>
                        <button
                          onClick={() => handlePlaySound(lv.char, cellId)}
                          className={`w-full py-2.5 px-2 rounded-xl text-xl font-black font-serif transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            activeCell === cellId
                              ? 'bg-indigo-600 text-white scale-105 shadow-md'
                              : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/60'
                          }`}
                          title={`استمع لصوت: ${lv.phonetic}`}
                        >
                          <span>{lv.char}</span>
                          <span className="text-[10px] text-indigo-700/70 font-sans font-normal hidden sm:inline">
                            طويل 🎵
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Two-Letter Rapid Reading & Blending */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg">
              ٢
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base font-alexandria">
                # قِرَاءَةُ حَرْفَيْنِ: تَهْجِئَةُ الحَرْفَيْنِ (حَرْفًا حَرْفًا) ثُمَّ قِرَاءَةٌ سَرِيعَة
              </h3>
              <p className="text-xs text-slate-500">
                انقر على الكلمة للاستماع، ثم علّم عليها كـ "أتقنتُ قراءتها"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              المتقن: {readWords.length} من {twoLetterWords.length}
            </span>
            {readWords.length > 0 && (
              <button
                onClick={() => setReadWords([])}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="إعادة التعيين"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Rapid Reading Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {twoLetterWords.map((item, idx) => {
            const isRead = readWords.includes(item.word);
            return (
              <div
                key={idx}
                onClick={() => handleToggleReadWord(item.word)}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer relative group ${
                  isRead
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 hover:border-amber-300'
                }`}
              >
                {isRead && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
                <span className="text-2xl sm:text-3xl font-black font-serif text-slate-950 block mb-1">
                  {item.word}
                </span>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-amber-700 block">
                  {item.breakdown}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioManager.speakArabic(item.word, 0.7);
                  }}
                  className="mt-2 text-[11px] text-slate-500 hover:text-emerald-700 flex items-center justify-center gap-1 w-full"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>استماع</span>
                </button>
              </div>
            );
          })}
        </div>

        {readWords.length === twoLetterWords.length && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-center font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in-95">
            <Award className="w-5 h-5 text-amber-600" />
            <span>رائع جداً يا بطل! أتقنت قراءة جميع مقاطع حروف الوحدة الأولى بنجاح! ⭐⭐⭐</span>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
