import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Sun, 
  Moon, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Play, 
  BookOpen,
  Award,
  HelpCircle
} from 'lucide-react';
import { ALPHABET_DATA } from '../data/curriculumData';
import { LetterVowel } from '../types/curriculum';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { KgStudio } from './KgStudio';

export const FoundationStudio: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<LetterVowel>(ALPHABET_DATA[0]);
  const [activeTab, setActiveTab] = useState<'kg' | 'letters' | 'sunMoon' | 'syllables' | 'tracing'>('kg');
  
  // Solar vs Lunar Game State
  const sunMoonWords = [
    { word: 'الشَّمْسُ', type: 'sun', meaning: 'Sun (شمسية - الحرف مشدد ولا تنطق اللام)' },
    { word: 'القَمَرُ', type: 'moon', meaning: 'Moon (قمرية - اللام ساكنة وتنطق)' },
    { word: 'السَّيَّارَةُ', type: 'sun', meaning: 'Car (شمسية)' },
    { word: 'الكِتَابُ', type: 'moon', meaning: 'Book (قمرية)' },
    { word: 'التَّمْرُ', type: 'sun', meaning: 'Dates (شمسية)' },
    { word: 'المَسْجِدُ', type: 'moon', meaning: 'Mosque (قمرية)' },
    { word: 'النَّخْلَةُ', type: 'sun', meaning: 'Palm Tree (شمسية)' },
    { word: 'الوَرْدَةُ', type: 'moon', meaning: 'Rose (قمرية)' },
    { word: 'الصَّقْرُ', type: 'sun', meaning: 'Falcon (شمسية)' },
    { word: 'البَيْتُ', type: 'moon', meaning: 'House (قمرية)' },
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [sunMoonScore, setSunMoonScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Syllable Segmentation State
  const syllableWords = [
    { word: 'مَدْرَسَةٌ', syllables: ['مَدْ', 'رَ', 'سَ', 'ةٌ'], explanation: 'مَدْ (مقطع ساكن) + رَ (متحرك) + سَ (متحرك) + ةٌ (متحرك)' },
    { word: 'كِتَابٌ', syllables: ['كِ', 'تَا', 'بٌ'], explanation: 'كِ (متحرك) + تَا (مقطع مد بالألف) + بٌ (متحرك)' },
    { word: 'عُصْفُورٌ', syllables: ['عُصْ', 'فُو', 'رٌ'], explanation: 'عُصْ (مقطع ساكن) + فُو (مقطع مد بالواو) + رٌ (متحرك)' },
    { word: 'سَيَّارَةٌ', syllables: ['سَيْ', 'يَا', 'رَ', 'ةٌ'], explanation: 'سَيْ (حرف مشدد فُك إدغامه) + يَا (مد بالألف) + رَ + ةٌ' },
  ];
  const [syllableIdx, setSyllableIdx] = useState(0);

  const handlePlayLetterAudio = (text: string) => {
    audioManager.speakArabic(text);
  };

  const handleSunMoonAnswer = (choice: 'sun' | 'moon') => {
    const current = sunMoonWords[currentWordIdx];
    if (choice === current.type) {
      audioManager.playCorrect();
      setSunMoonScore((prev) => prev + 1);
      setGameFeedback({ isCorrect: true, text: `إجابة صحيحة يا بطل! كلمة (${current.word}) ${current.meaning}` });
      if (sunMoonScore + 1 === sunMoonWords.length) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      audioManager.playWrong();
      setGameFeedback({ isCorrect: false, text: `حاول ثانية! كلمة (${current.word}) ${current.meaning}` });
    }
  };

  const nextSunMoonWord = () => {
    setGameFeedback(null);
    setCurrentWordIdx((prev) => (prev + 1) % sunMoonWords.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مرحلة التأسيس القرائي والإملائي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-alexandria">
              معمل الحركات والأصوات الهجائية
            </h2>
            <p className="text-emerald-100/80 text-sm max-w-2xl leading-relaxed">
              تعلّم الحروف الهجائية الـ ٢٨ مع الحركات القصيرة (الفتحة، الضمة، الكسرة، السكون)، المدود الطويلة، والتمييز بين اللام الشمسية واللام القمرية مع النطق الصوتي الفوري.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              id="subtab-kg-btn"
              onClick={() => setActiveTab('kg')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'kg'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🌱</span>
              <span>مسار KG1 و KG2 (الروضة)</span>
            </button>
            <button
              id="subtab-letters-btn"
              onClick={() => setActiveTab('letters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'letters'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              لوحة الحروف والحركات
            </button>
            <button
              id="subtab-sunmoon-btn"
              onClick={() => setActiveTab('sunMoon')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sunMoon'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>اللام الشمسية والقمرية</span>
            </button>
            <button
              id="subtab-syllables-btn"
              onClick={() => setActiveTab('syllables')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'syllables'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>تحليل المقاطع الصوتية</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 0: KG1 & KG2 STUDIO */}
      {activeTab === 'kg' && <KgStudio />}

      {/* TAB 1: 28 LETTERS & VOWELS MATRIX */}
      {activeTab === 'letters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Letters Grid (8 Cols on Desktop) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">اختر حرفاً للاستماع والتدريب</h3>
                <p className="text-xs text-slate-500">انقر على أي حرف لعرض حركاته ومدوده ومواضعه</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ٢٨ حرفاً هجائياً
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {ALPHABET_DATA.map((item) => {
                const isSelected = selectedLetter.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    id={`letter-grid-btn-${item.name}`}
                    onClick={() => {
                      setSelectedLetter(item);
                      handlePlayLetterAudio(item.name);
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-150 relative ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 scale-105 ring-2 ring-emerald-500'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold font-amiri">
                      {item.letter}
                    </span>
                    <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Detail Card (Vowels, Positions, Audio) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              {/* Card Header with Big Letter */}
              <div className="flex items-center justify-between bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-4xl font-bold font-amiri shadow-md">
                    {selectedLetter.letter}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900 font-alexandria">
                      حرف ال{selectedLetter.name} ({selectedLetter.letter})
                    </h4>
                    <p className="text-xs text-slate-500">استمع لأصوات الحرف مع الحركات والمدود</p>
                  </div>
                </div>

                <button
                  id="play-letter-name-audio"
                  onClick={() => handlePlayLetterAudio(`حرف ال${selectedLetter.name}`)}
                  className="p-3 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-transform active:scale-95"
                  title="نطق الحرف"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Short Vowels (الحركات القصيرة) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>الأصوات القصيرة (الحركات)</span>
                  </h5>
                  <span className="text-[10px] text-slate-400">انقر للاستماع</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'فَتْحَة', sound: selectedLetter.fatha, sub: 'بصوت الفتح' },
                    { label: 'ضَمَّة', sound: selectedLetter.damma, sub: 'بصوت الضم' },
                    { label: 'كَسْرَة', sound: selectedLetter.kasra, sub: 'بصوت الكسر' },
                    { label: 'سُكُون', sound: selectedLetter.sukoon, sub: 'بصوت السكون' },
                  ].map((vowel, i) => (
                    <button
                      key={i}
                      onClick={() => handlePlayLetterAudio(vowel.sound)}
                      className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl flex flex-col items-center justify-center transition-all group active:scale-95"
                    >
                      <span className="text-2xl font-bold font-amiri text-emerald-900 group-hover:text-emerald-700">
                        {vowel.sound}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 mt-1">{vowel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Long Vowels (المدود الطويلة) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>الأصوات الطويلة (حروف المد)</span>
                  </h5>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'مد بالألف', sound: selectedLetter.madAlif, match: 'يناسب الفتحة' },
                    { label: 'مد بالواو', sound: selectedLetter.madWaw, match: 'يناسب الضمة' },
                    { label: 'مد بالياء', sound: selectedLetter.madYaa, match: 'يناسب الكسرة' },
                  ].map((mad, i) => (
                    <button
                      key={i}
                      onClick={() => handlePlayLetterAudio(mad.sound)}
                      className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl flex flex-col items-center justify-center transition-all group active:scale-95"
                    >
                      <span className="text-2xl font-bold font-amiri text-amber-900 group-hover:text-amber-700">
                        {mad.sound}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 mt-1">{mad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Positions in Words (مواضع الحرف في الكلمة) */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>مواضع الحرف في الكلمة مع أمثلة</span>
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePlayLetterAudio(selectedLetter.examples.initial)}
                    className="p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-center group active:scale-95"
                  >
                    <span className="text-[10px] font-bold text-blue-600 block mb-1">أول الكلمة</span>
                    <span className="text-base font-bold font-amiri text-slate-800 group-hover:text-blue-900">
                      {selectedLetter.examples.initial}
                    </span>
                  </button>

                  <button
                    onClick={() => handlePlayLetterAudio(selectedLetter.examples.medial)}
                    className="p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-center group active:scale-95"
                  >
                    <span className="text-[10px] font-bold text-blue-600 block mb-1">وسط الكلمة</span>
                    <span className="text-base font-bold font-amiri text-slate-800 group-hover:text-blue-900">
                      {selectedLetter.examples.medial}
                    </span>
                  </button>

                  <button
                    onClick={() => handlePlayLetterAudio(selectedLetter.examples.final)}
                    className="p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-center group active:scale-95"
                  >
                    <span className="text-[10px] font-bold text-blue-600 block mb-1">آخر الكلمة</span>
                    <span className="text-base font-bold font-amiri text-slate-800 group-hover:text-blue-900">
                      {selectedLetter.examples.final}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Practice Button */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">تكرار النطق يقوي مهارة القراءة</span>
              <button
                onClick={() => {
                  handlePlayLetterAudio(`${selectedLetter.fatha} ، ${selectedLetter.damma} ، ${selectedLetter.kasra}`);
                }}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-emerald-800 active:scale-95 transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>نطق الحركات متتالية</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOLAR VS LUNAR (اللام الشمسية واللام القمرية) */}
      {activeTab === 'sunMoon' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Top Rule Explainer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>اللام الشمسية (☀️)</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                تُكتب ولا تُنطق، والحرف الذي بعدها مشدد دائماً (مثال: الشَّمْس، التَّمْر، الصَّقْر).
              </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-1">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>اللام القمرية (🌙)</span>
              </div>
              <p className="text-xs text-indigo-900/80 leading-relaxed">
                تُكتب وتُنطق، وعليها سكون ظاهر (مثال: القَمَر، البَيْت، المَسْجِد).
              </p>
            </div>
          </div>

          {/* Interactive Game Arena */}
          <div className="text-center py-6 px-4 bg-slate-50 rounded-3xl border border-slate-200 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
              <span>السؤال {currentWordIdx + 1} من {sunMoonWords.length}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                النقاط: {sunMoonScore} / {sunMoonWords.length}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-2">ما نوع (ال) في هذه الكلمة؟</p>
            
            <div className="flex items-center justify-center gap-3 my-4">
              <span className="text-4xl sm:text-5xl font-extrabold font-amiri text-slate-900 tracking-wide">
                {sunMoonWords[currentWordIdx].word}
              </span>
              <button
                onClick={() => handlePlayLetterAudio(sunMoonWords[currentWordIdx].word)}
                className="p-3 rounded-2xl bg-white text-emerald-700 border border-slate-200 hover:bg-emerald-50 transition-colors shadow-sm"
                title="استمع للنطق"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Options Buttons */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
              <button
                id="btn-sun-choice"
                onClick={() => handleSunMoonAnswer('sun')}
                className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Sun className="w-5 h-5" />
                <span>لام شمسية ☀️</span>
              </button>

              <button
                id="btn-moon-choice"
                onClick={() => handleSunMoonAnswer('moon')}
                className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Moon className="w-5 h-5" />
                <span>لام قمرية 🌙</span>
              </button>
            </div>

            {/* Feedback Alert */}
            {gameFeedback && (
              <div
                className={`mt-6 p-4 rounded-2xl text-sm font-bold flex items-center justify-between gap-3 ${
                  gameFeedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {gameFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span>{gameFeedback.text}</span>
                </div>
                <button
                  onClick={nextSunMoonWord}
                  className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  الكلمة التالية
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SYLLABLES SEGMENTATION (تحليل المقاطع الصوتية) */}
      {activeTab === 'syllables' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">تحليل الكلمات إلى مقاطع صوتية وحروف</h3>
            <p className="text-xs text-slate-500">
              قاعدة التحليل: الحرف المتحرك مقطع مستقل • الساكن مع ما قبله مقطع • حرف المد مع الممدود مقطع • الحرف المشدد يُفك إلى حرفين.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
              <span>الكلمة {syllableIdx + 1} من {syllableWords.length}</span>
              <button
                onClick={() => setSyllableIdx((prev) => (prev + 1) % syllableWords.length)}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold"
              >
                <span>كلمة أخرى</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Word */}
            <div className="my-6">
              <span className="text-4xl sm:text-5xl font-extrabold font-amiri text-emerald-950">
                {syllableWords[syllableIdx].word}
              </span>
            </div>

            {/* Segments Display */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 my-6 flex-wrap">
              {syllableWords[syllableIdx].syllables.map((syl, i) => (
                <button
                  key={i}
                  onClick={() => handlePlayLetterAudio(syl)}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border-2 border-emerald-500 text-emerald-900 text-2xl sm:text-3xl font-extrabold font-amiri flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all group"
                  title="استمع للمقطع"
                >
                  {syl}
                </button>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 text-right">
              <span className="text-emerald-700 block mb-1">💡 تفسير المقاطع:</span>
              {syllableWords[syllableIdx].explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
