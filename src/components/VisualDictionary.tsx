import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Layers, 
  Edit3, 
  Eye, 
  Ear, 
  Printer, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  Lightbulb,
  Heart,
  Share2,
  HelpCircle,
  Play
} from 'lucide-react';
import { 
  DICTIONARY_ENTRIES, 
  DICTIONARY_CATEGORIES, 
  SPELLING_SKILL_FILTERS, 
  DictionaryEntry 
} from '../data/dictionaryData';
import { audioManager } from '../utils/audio';
import { GradeId } from '../types/curriculum';
import { AudioDictionary } from './AudioDictionary';

interface VisualDictionaryProps {
  currentGrade?: GradeId;
  onAddStars?: (count: number) => void;
  studentName?: string;
}

export const VisualDictionary: React.FC<VisualDictionaryProps> = ({
  currentGrade = 'grade1',
  onAddStars,
  studentName = 'الطالب المتميز'
}) => {
  // Mode selection: 'browse' (Visual Dictionary) vs 'audio' (Audio Dictionary & Articulation) vs 'dictation' (Spelling Lab)
  const [activeMode, setActiveMode] = useState<'browse' | 'audio' | 'dictation'>('browse');
  const [selectedAudioWordId, setSelectedAudioWordId] = useState<string | undefined>(undefined);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    if (currentGrade === 'kg1' || currentGrade === 'kg2') return 'foundation';
    if (currentGrade === 'grade1') return 'grade1';
    if (currentGrade === 'grade2') return 'grade2';
    if (currentGrade === 'grade3') return 'grade3';
    return 'all';
  });
  const [selectedSpellingSkill, setSelectedSpellingSkill] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeEntryModal, setActiveEntryModal] = useState<DictionaryEntry | null>(null);

  // Dictation Lab State
  const [dictationType, setDictationType] = useState<'seen' | 'audio' | 'letters'>('seen');
  const [dictationIndex, setDictationIndex] = useState<number>(0);
  const [userSpellingInput, setUserSpellingInput] = useState<string>('');
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);
  const [seenTimer, setSeenTimer] = useState<number>(0);
  const [isWordHidden, setIsWordHidden] = useState<boolean>(false);
  const [dictationResult, setDictationResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [dictationStreak, setDictationStreak] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Arabic Alphabet list for quick letter filtering
  const arabicAlphabet = [
    'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
  ];

  // Load favorites from local storage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('lughati_dict_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch (e) {}
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('lughati_dict_favorites', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Filtered dictionary entries
  const filteredEntries = useMemo(() => {
    return DICTIONARY_ENTRIES.filter(entry => {
      // Grade filter
      if (selectedGrade !== 'all') {
        if (selectedGrade === 'foundation' && entry.grade !== 'foundation' && entry.grade !== 'kg') return false;
        if (selectedGrade !== 'foundation' && entry.grade !== selectedGrade) return false;
      }
      // Spelling skill filter
      if (selectedSpellingSkill !== 'all' && entry.spellingCategory !== selectedSpellingSkill) {
        return false;
      }
      // Letter filter
      if (selectedLetter !== 'all') {
        const firstLetter = entry.wordWithNoHarakat.replace(/^(ال|أ|إ|آ)/, '')[0] || entry.wordWithNoHarakat[0];
        if (selectedLetter === 'أ' && (entry.wordWithNoHarakat.startsWith('أ') || entry.wordWithNoHarakat.startsWith('إ') || entry.wordWithNoHarakat.startsWith('ا'))) {
          // match
        } else if (!entry.wordWithNoHarakat.includes(selectedLetter)) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchWord = entry.word.includes(q) || entry.wordWithNoHarakat.includes(q);
        const matchMeaning = entry.meaning.includes(q);
        const matchRule = entry.spellingRule.includes(q);
        const matchCategory = entry.category.includes(q);
        const matchUnit = entry.unitName.includes(q);
        if (!matchWord && !matchMeaning && !matchRule && !matchCategory && !matchUnit) return false;
      }
      return true;
    });
  }, [selectedGrade, selectedSpellingSkill, selectedLetter, searchQuery]);

  // Dictation active list
  const dictationWords = useMemo(() => {
    if (filteredEntries.length > 0) return filteredEntries;
    return DICTIONARY_ENTRIES;
  }, [filteredEntries]);

  const currentDictationWord = dictationWords[dictationIndex % dictationWords.length];

  // Handle Seen Dictation Timer
  useEffect(() => {
    if (activeMode === 'dictation' && dictationType === 'seen') {
      setIsWordHidden(false);
      setSeenTimer(4);
      const interval = setInterval(() => {
        setSeenTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsWordHidden(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsWordHidden(false);
    }
  }, [activeMode, dictationType, dictationIndex]);

  // Reset spelling inputs when question changes
  useEffect(() => {
    setUserSpellingInput('');
    setAssembledLetters([]);
    setDictationResult('idle');
    setShowHint(false);
  }, [dictationIndex, dictationType]);

  // Audio helper
  const handleSpeak = (text: string, rate: number = 0.85) => {
    audioManager.speakArabic(text, rate);
  };

  const handleSpeakSyllableSequence = async (syllables: string[]) => {
    for (const syl of syllables) {
      await audioManager.speakArabic(syl, 0.75);
      await new Promise(r => setTimeout(r, 250));
    }
    if (currentDictationWord) {
      await audioManager.speakArabic(currentDictationWord.word, 0.85);
    }
  };

  // Check user dictation answer
  const handleCheckDictation = () => {
    if (!currentDictationWord) return;

    let studentAttempt = userSpellingInput.trim();
    if (dictationType === 'letters') {
      studentAttempt = assembledLetters.join('');
    }

    if (!studentAttempt) return;

    // Normalize for lenient comparison (strip diacritics for base match if needed, or exact comparison)
    const normalizeArabic = (s: string) => s.replace(/[\u064B-\u065F\u0670]/g, '').trim();
    const cleanAttempt = normalizeArabic(studentAttempt);
    const cleanTarget = normalizeArabic(currentDictationWord.wordWithNoHarakat || currentDictationWord.word);

    const isExact = cleanAttempt === cleanTarget;

    if (isExact) {
      setDictationResult('correct');
      setDictationStreak(prev => prev + 1);
      audioManager.playCorrect();
      if (onAddStars) onAddStars(3);
    } else {
      setDictationResult('wrong');
      setDictationStreak(0);
      audioManager.playWrong();
    }
  };

  const handleNextDictation = () => {
    setDictationIndex(prev => (prev + 1) % dictationWords.length);
  };

  // Keyboard Harakat input helper
  const handleAppendChar = (char: string) => {
    setUserSpellingInput(prev => prev + char);
  };

  const handleBackspace = () => {
    setUserSpellingInput(prev => prev.slice(0, -1));
  };

  const harakatKeyboard = [
    { label: 'َ (فتحة)', char: 'َ' },
    { label: 'ُ (ضمة)', char: 'ُ' },
    { label: 'ِ (كسرة)', char: 'ِ' },
    { label: 'ْ (سكون)', char: 'ْ' },
    { label: 'ّ (شدة)', char: 'ّ' },
    { label: 'ً (تنوين فتح)', char: 'ً' },
    { label: 'ٌ (تنوين ضم)', char: 'ٌ' },
    { label: 'ٍ (تنوين كسر)', char: 'ٍ' },
    { label: 'أ (همزة قطع)', char: 'أ' },
    { label: 'إ (همزة مكسورة)', char: 'إ' },
    { label: 'آ (همزة مد)', char: 'آ' },
    { label: 'ء (همزة سطر)', char: 'ء' },
    { label: 'ؤ (همزة واو)', char: 'ؤ' },
    { label: 'ئ (همزة ياء)', char: 'ئ' },
    { label: 'ى (ألف لينة)', char: 'ى' },
    { label: 'ة (تاء مربوطة)', char: 'ة' },
    { label: 'ت (تاء مفتوحة)', char: 'ت' },
    { label: 'ـ (وصلة مد)', char: 'ـ' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/20 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>مقرر لغتي الجميلة • المنهاج السعودي المعتمد</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-alexandria tracking-tight text-white flex items-center gap-3">
              <span>قَامُوسُ لُغَتِي الْمُصَوَّرُ وَمُخْتَبَرُ الإِمْلاءِ</span>
              <span className="text-3xl sm:text-4xl">🎨</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              معجم بصري ناطق يعرض كلمات المنهج المعتمدة مع صور توضيحية عالية الدقة، تقطيع مقطعي صوتي، وشرح الظواهر الإملائية لكل المراحل من التأسيس حتى الصفوف العليا.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-500/30 shrink-0 self-start md:self-center gap-1">
            <button
              id="btn-dict-browse-mode"
              onClick={() => setActiveMode('browse')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === 'browse'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>القاموس المصوّر</span>
            </button>

            <button
              id="btn-dict-audio-mode"
              onClick={() => setActiveMode('audio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === 'audio'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>القاموس الصوتي والمخارج</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                0.5x 🐢
              </span>
            </button>

            <button
              id="btn-dict-spelling-mode"
              onClick={() => setActiveMode('dictation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === 'dictation'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>مختبر الإملاء الذكي</span>
              {dictationStreak > 0 && (
                <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  🔥 {dictationStreak}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: VISUAL DICTIONARY BROWSER                                          */}
      {/* ========================================================================= */}
      {activeMode === 'browse' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Grade Pills */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="dict-search-input"
                  type="text"
                  placeholder="ابحث عن كلمة، معنى، ظاهرة إملائية، أو اسم وحدة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Grade Selection Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {DICTIONARY_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    id={`dict-grade-tab-${cat.id}`}
                    onClick={() => setSelectedGrade(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedGrade === cat.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spelling Skill Dropdown & Quick Alphabet Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-xs font-bold text-slate-600 shrink-0">المهارة الإملائية:</span>
                <select
                  id="dict-skill-filter-select"
                  value={selectedSpellingSkill}
                  onChange={(e) => setSelectedSpellingSkill(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SPELLING_SKILL_FILTERS.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                <button
                  onClick={() => setSelectedLetter('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedLetter === 'all'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  كل الحروف
                </button>
                {arabicAlphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                      selectedLetter === letter
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count & Action Strip */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>عدد الكلمات المعروضة: </span>
              <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {filteredEntries.length} كلمة
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة بطاقات القاموس</span>
            </button>
          </div>

          {/* Dictionary Grid Cards */}
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-800">لم يتم العثور على كلمات مطابقة</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                جرب تغيير الحرف المختار أو مسح خانة البحث لعرض مفردات المنهج.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLetter('all');
                  setSelectedSpellingSkill('all');
                  setSelectedGrade('all');
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredEntries.map(entry => {
                const isFav = favorites.includes(entry.id);
                return (
                  <div
                    key={entry.id}
                    id={`dict-card-${entry.id}`}
                    onClick={() => setActiveEntryModal(entry)}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer hover:border-emerald-300"
                  >
                    {/* Card Image Header with Illustration and Badges */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={entry.imageUrl}
                        alt={entry.word}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to stylized emoji card if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
                          {entry.gradeName}
                        </span>
                      </div>

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                        <button
                          onClick={(e) => toggleFavorite(entry.id, e)}
                          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-slate-700 flex items-center justify-center transition-transform active:scale-90"
                          title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
                        </button>
                      </div>

                      {/* Floating Emoji Icon */}
                      <div className="absolute bottom-2.5 right-3 w-10 h-10 rounded-2xl bg-white/95 shadow-md flex items-center justify-center text-xl">
                        {entry.imageEmoji}
                      </div>

                      {/* Unit name strip */}
                      <div className="absolute bottom-2.5 left-3 text-[11px] text-white/90 font-medium truncate max-w-[180px]">
                        {entry.unitName}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Word Display & Pronunciation */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-alexandria tracking-wide">
                            {entry.word}
                          </h3>
                          <button
                            id={`btn-speak-word-${entry.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(entry.word, 0.8);
                            }}
                            className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors active:scale-95 shrink-0"
                            title="استمع لنطق الكلمة"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Meaning */}
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          <span className="font-bold text-slate-800">المعنى: </span>
                          {entry.meaning}
                        </p>
                      </div>

                      {/* Syllables Breakdown (التقطيع الصوتي) */}
                      <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                          <span>التحليل الصوتي (المقاطع):</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakSyllableSequence(entry.syllables);
                            }}
                            className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold text-[10px]"
                          >
                            <Play className="w-2.5 h-2.5" />
                            <span>تهجئة</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {entry.syllables.map((syl, i) => (
                            <span
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(syl, 0.7);
                              }}
                              className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-900 font-extrabold text-xs rounded-lg shadow-2xs hover:bg-emerald-50 cursor-pointer"
                              title={`استمع للمقطع: ${syl}`}
                            >
                              {syl}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Spelling rule summary pill */}
                      <div className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 font-medium">
                        <span className="font-bold">القاعدة: </span>
                        <span className="line-clamp-1">{entry.spellingRule}</span>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1 flex-wrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(entry.sentence, 0.85);
                          }}
                          className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>الجملة</span>
                        </button>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAudioWordId(entry.id);
                              setActiveMode('audio');
                            }}
                            className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 transition-colors"
                            title="تدرب على مخارج الحروف بالسرعة البطيئة 0.5x"
                          >
                            <Volume2 className="w-3 h-3 text-amber-600" />
                            <span>المخارج (0.5x)</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMode('dictation');
                              const idx = dictationWords.findIndex(w => w.id === entry.id);
                              if (idx !== -1) setDictationIndex(idx);
                            }}
                            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>إملاء</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: AUDIO DICTIONARY & ARTICULATION TRAINING                           */}
      {/* ========================================================================= */}
      {activeMode === 'audio' && (
        <AudioDictionary
          initialWordId={selectedAudioWordId}
          currentGrade={currentGrade}
          onAddStars={onAddStars}
          studentName={studentName}
          onNavigateToVisual={() => setActiveMode('browse')}
        />
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SMART SPELLING & DICTATION LAB                                     */}
      {/* ========================================================================= */}
      {activeMode === 'dictation' && currentDictationWord && (
        <div className="space-y-6">
          {/* Dictation Mode Selector Ribbon */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-alexandria flex items-center gap-2">
                  <span>مُخْتَبَرُ الإِمْلاءِ وَالتَّهْجِئَةِ النَّمُوذَجِيِّ</span>
                  <span>✍️</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  اختر نمط الإملاء المناسب وتدرّب على كتابة الحركات والظواهر الإملائية المقررة.
                </p>
              </div>

              {/* Dictation Type Selector */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  id="dict-type-seen"
                  onClick={() => setDictationType('seen')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dictationType === 'seen'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>الإملاء المنظور</span>
                </button>
                <button
                  id="dict-type-audio"
                  onClick={() => setDictationType('audio')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dictationType === 'audio'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Ear className="w-3.5 h-3.5" />
                  <span>الإملاء المسموع (الاختباري)</span>
                </button>
                <button
                  id="dict-type-letters"
                  onClick={() => setDictationType('letters')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dictationType === 'letters'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>بنك الحركات والمقاطع</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Dictation Board */}
            <div className="pt-6 max-w-3xl mx-auto space-y-6">
              {/* Word Card & Stimulus Area */}
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 text-center relative overflow-hidden">
                {/* Progress & Stats */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                  <span>الكلمة {dictationIndex + 1} من {dictationWords.length}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                      ⭐ المتتالي: {dictationStreak}
                    </span>
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {currentDictationWord.gradeName}
                    </span>
                  </div>
                </div>

                {/* Stimulus Display */}
                <div className="space-y-4">
                  {/* Image Display (Always shown or hidden based on difficulty) */}
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-white shadow-md overflow-hidden border-2 border-emerald-200 relative flex items-center justify-center">
                    <img
                      src={currentDictationWord.imageUrl}
                      alt={currentDictationWord.word}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-2xl drop-shadow">
                      {currentDictationWord.imageEmoji}
                    </span>
                  </div>

                  {/* Seen Dictation Countdown or Word Display */}
                  {dictationType === 'seen' && (
                    <div className="py-2">
                      {!isWordHidden ? (
                        <div className="space-y-2 animate-in fade-in zoom-in-95">
                          <div className="text-xs font-bold text-emerald-800 bg-emerald-100 inline-block px-3 py-1 rounded-full">
                            👀 انظر للكلمة جيداً واحفظ رسمها ({seenTimer} ثوانٍ)
                          </div>
                          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-alexandria tracking-wide">
                            {currentDictationWord.word}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-600 bg-slate-200/80 inline-block px-3 py-1 rounded-full">
                            ✍️ اختفت الكلمة! اكتبها الآن من ذاكرتك الإملائية
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auditory Dictation Display */}
                  {dictationType === 'audio' && (
                    <div className="py-3 space-y-3">
                      <div className="text-xs font-bold text-slate-600 bg-sky-100 text-sky-900 inline-block px-3 py-1 rounded-full">
                        🎧 استمع لنطق الكلمة جيداً ثم اكتبها مع الحركات
                      </div>
                      <div>
                        <button
                          id="btn-dict-listen-audio"
                          onClick={() => handleSpeak(currentDictationWord.word, 0.8)}
                          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg flex items-center gap-2.5 mx-auto transition-transform active:scale-95"
                        >
                          <Volume2 className="w-6 h-6" />
                          <span className="text-base">استمع لنطق الكلمة</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Letters and Syllables Assembly Display */}
                  {dictationType === 'letters' && (
                    <div className="py-2 space-y-3">
                      <div className="text-xs font-bold text-amber-900 bg-amber-100 inline-block px-3 py-1 rounded-full">
                        🧩 رتّب المقاطع الصوتية والحركات لتكوين الكلمة
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSpeakSyllableSequence(currentDictationWord.syllables)}
                          className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>استماع للتقطيع</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Context sentence hint */}
                  <div className="text-xs text-slate-600 italic bg-white/70 p-3 rounded-2xl border border-slate-200 max-w-lg mx-auto">
                    <span className="font-bold text-slate-800">السياق في الجملة: </span>
                    <span>{currentDictationWord.sentence}</span>
                  </div>
                </div>
              </div>

              {/* Student Input Field & Verification */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                {dictationType !== 'letters' ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 text-right">
                      اكتب الكلمة هنا (يمكنك استخدام لوحة الحركات أدناه للضبط الدقيق):
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="student-dictation-input"
                        type="text"
                        value={userSpellingInput}
                        onChange={(e) => setUserSpellingInput(e.target.value)}
                        placeholder="اكتب الكلمة هنا..."
                        className="flex-1 px-4 py-3.5 text-2xl font-bold text-center border-2 border-emerald-400/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-slate-900 font-alexandria"
                        autoComplete="off"
                        autoCorrect="off"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCheckDictation();
                        }}
                      />
                      <button
                        onClick={handleBackspace}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center border border-slate-200"
                        title="حذف حرف"
                      >
                        مسافة خلفية ⌫
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Letter and Syllables Assembly Board */
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-700">المقاطع المرتبة للكلمة:</div>
                    <div className="min-h-16 p-3 bg-slate-50 border-2 border-dashed border-emerald-300 rounded-2xl flex items-center justify-center gap-2 flex-wrap">
                      {assembledLetters.length === 0 ? (
                        <span className="text-xs text-slate-400">انقر على المقاطع أدناه لتركيب الكلمة</span>
                      ) : (
                        assembledLetters.map((syl, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setAssembledLetters(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="px-3 py-2 bg-emerald-600 text-white font-extrabold text-lg rounded-xl shadow-xs hover:bg-rose-600 transition-colors"
                            title="انقر للحذف"
                          >
                            {syl}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Available Syllable Chunks (Shuffled) */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-600">بنك المقاطع الصوتية المتاحة:</div>
                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        {/* Render unique shuffled options from syllables */}
                        {[...currentDictationWord.syllables].sort().map((syl, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAssembledLetters(prev => [...prev, syl]);
                              handleSpeak(syl, 0.7);
                            }}
                            className="px-4 py-2 bg-white border-2 border-emerald-400 hover:border-emerald-600 text-emerald-900 font-extrabold text-lg rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                          >
                            {syl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* On-Screen Harakat & Special Characters Keyboard */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                    <span>لوحة مفاتيح الحركات والظواهر الإملائية السريعة:</span>
                    <span className="text-[10px] text-emerald-700">انقر لإدراج الحركة أو الهمزة مباشرة</span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                    {harakatKeyboard.map((k, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAppendChar(k.char)}
                        className="py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs active:scale-95 transition-all"
                        title={k.label}
                      >
                        {k.char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Alert if Checked */}
                {dictationResult === 'correct' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 font-bold text-base">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <span>أحسنت يا بطل! إجابة إملائية صحيحة ومتقنة (+3 نجوم) 🎉</span>
                    </div>
                    <div className="text-xs text-emerald-800">
                      <span className="font-bold">القاعدة الإملائية: </span>
                      {currentDictationWord.spellingRule}
                    </div>
                  </div>
                )}

                {dictationResult === 'wrong' && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 font-bold text-base">
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                      <span>حاول مرة أخرى! انتبه للرسم الإملائي الصحيح:</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 bg-white p-2.5 rounded-xl border border-rose-200 text-center font-alexandria">
                      الكتابة الصحيحة: <span className="text-emerald-700 text-lg font-extrabold mr-2">{currentDictationWord.word}</span>
                    </div>
                    <div className="text-xs text-rose-800">
                      <span className="font-bold">تذكّر القاعدة: </span>
                      {currentDictationWord.spellingRule}
                    </div>
                  </div>
                )}

                {/* Bottom Verification & Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showHint ? 'إخفاء التلميح' : 'تلميح إملائي'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {dictationResult === 'idle' ? (
                      <button
                        id="btn-check-spelling"
                        onClick={handleCheckDictation}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95"
                      >
                        تحقق من الإملاء ✓
                      </button>
                    ) : (
                      <button
                        id="btn-next-spelling-word"
                        onClick={handleNextDictation}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <span>الكلمة التالية</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Hint Box */}
                {showHint && (
                  <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 animate-in fade-in">
                    <span className="font-bold">💡 تلميح: </span>
                    {currentDictationWord.spellingRule}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORD DETAILS MODAL (When clicking any card in Browse Mode)                 */}
      {/* ========================================================================= */}
      {activeEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 bg-slate-100">
              <img
                src={activeEntryModal.imageUrl}
                alt={activeEntryModal.word}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <button
                onClick={() => setActiveEntryModal(null)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>

              <div className="absolute bottom-3 right-4 text-white">
                <span className="text-xs bg-emerald-600 px-2.5 py-0.5 rounded-full font-bold">
                  {activeEntryModal.gradeName}
                </span>
                <div className="text-xs opacity-90 mt-1">{activeEntryModal.unitName}</div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-alexandria">
                    {activeEntryModal.word}
                  </h2>
                  {activeEntryModal.root && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      الجذر اللغوي: <span className="font-bold text-emerald-800 font-mono">{activeEntryModal.root}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSpeak(activeEntryModal.word, 0.8)}
                  className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-1.5 font-bold text-xs"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>استماع</span>
                </button>
              </div>

              {/* Meaning */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-500 mb-1">المعنى اللغوي:</div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {activeEntryModal.meaning}
                </p>
              </div>

              {/* Syllables Analysis */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-600">المقاطع الصوتية (التهجئة المقطعية):</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeEntryModal.syllables.map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => handleSpeak(syl, 0.7)}
                      className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold text-sm rounded-xl hover:bg-emerald-100"
                    >
                      {syl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spelling Rule */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                <div className="text-xs font-bold text-amber-900">المهارة والقاعدة الإملائية:</div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {activeEntryModal.spellingRule}
                </p>
              </div>

              {/* Sentence */}
              <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-sky-900 mb-1">شاهد في جملة:</div>
                  <p className="text-xs text-sky-950 font-medium">
                    {activeEntryModal.sentence}
                  </p>
                </div>
                <button
                  onClick={() => handleSpeak(activeEntryModal.sentence, 0.85)}
                  className="p-2 rounded-xl bg-sky-200 text-sky-900 hover:bg-sky-300 shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const word = activeEntryModal;
                    setActiveEntryModal(null);
                    setSelectedAudioWordId(word.id);
                    setActiveMode('audio');
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>القاموس الصوتي (0.5x للمخارج)</span>
                </button>
                <button
                  onClick={() => {
                    const word = activeEntryModal;
                    setActiveEntryModal(null);
                    setActiveMode('dictation');
                    const idx = dictationWords.findIndex(w => w.id === word.id);
                    if (idx !== -1) setDictationIndex(idx);
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>انتقل للاختبار الإملائي</span>
                </button>
                <button
                  onClick={() => setActiveEntryModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
