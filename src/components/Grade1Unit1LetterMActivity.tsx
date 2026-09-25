import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Trophy, 
  Star, 
  HelpCircle, 
  Play, 
  Check, 
  X, 
  Printer, 
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  ChevronLeft,
  VolumeX,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';

export interface ActivityWordItem {
  id: string;
  word: string;
  displayWithDiacritics: string;
  syllables: string[];
  positions: Array<'initial' | 'medial' | 'finalConnected' | 'finalIsolated'>;
  positionLabel: string;
  vowelTypes: string;
  meaning: string;
  description: string;
  iconSvg: string; // custom visual illustration
  categoryColor: string;
  accentBg: string;
  textColor: string;
  hasLetterM: boolean;
  audioGuide: string;
  sentenceExample: string;
}

export const LETTER_M_ACTIVITY_ITEMS: ActivityWordItem[] = [
  {
    id: 'matam',
    word: 'مَطْعَمٌ',
    displayWithDiacritics: 'مَـطْـعَـمٌ',
    syllables: ['مَطْـ', 'عَـ', 'مٌ'],
    positions: ['initial', 'finalIsolated'],
    positionLabel: 'أَوَّلُ وَآخِرُ الكَلِمَةِ (مَـ ... مٌ)',
    vowelTypes: 'فَتْحَةٌ قَصِيرَةٌ (مَـ) وَتَنْوِينُ ضَمٍّ (مٌ)',
    meaning: 'مكان إعداد وتناول الوجبات والأطعمة الشهية',
    description: 'تحتوي الكلمة على حرف الميم مرتين: ميم مفتوحة في أول الكلمة (مَـ)، وميم منونة في آخر الكلمة (مٌ).',
    categoryColor: 'from-amber-500 to-orange-500',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
    textColor: 'text-amber-700',
    hasLetterM: true,
    audioGuide: 'مَطْعَمٌ.. مَـ مَـ مَطْعَمٌ، فِيهَا مِيمٌ فِي أَوَّلِ الكَلِمَةِ وَمِيمٌ فِي آخِرِهَا',
    sentenceExample: 'ذَهَبَ فَوَّازٌ مَعَ أَبِيهِ إِلَى المَطْعَمِ',
    iconSvg: 'restaurant'
  },
  {
    id: 'maryam',
    word: 'مَرْيَمُ',
    displayWithDiacritics: 'مَـرْيَـمُ',
    syllables: ['مَرْ', 'يَـ', 'مُ'],
    positions: ['initial', 'finalIsolated'],
    positionLabel: 'أَوَّلُ وَآخِرُ الكَلِمَةِ (مَـ ... مُ)',
    vowelTypes: 'فَتْحَةٌ قَصِيرَةٌ (مَـ) وَضَمَّةٌ قَصِيرَةٌ (مُ)',
    meaning: 'اسم والدة فواز ونورة الكريمة نبع الحنان',
    description: 'اسم علم مؤنث يبدأ بحرف الميم المفتوح (مَـ)، وينتهي بالميم المضموم (مُ).',
    categoryColor: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-50 border-rose-200 text-rose-900',
    textColor: 'text-rose-700',
    hasLetterM: true,
    audioGuide: 'مَرْيَمُ.. مَـ مَـ مَرْيَمُ، أُمِّي مَرْيَمُ تَبْدَأُ بِالمِيمِ المَفْتُوحِ',
    sentenceExample: 'أُمِّي مَرْيَمُ تُعَلِّمُنِي الأَخْلَاقَ الحَمِيدَةَ',
    iconSvg: 'mother'
  },
  {
    id: 'majoon',
    word: 'مَعْجُونٌ',
    displayWithDiacritics: 'مَـعْـجُـونٌ',
    syllables: ['مَعْـ', 'جُو', 'نٌ'],
    positions: ['initial'],
    positionLabel: 'أَوَّلُ الكَلِمَةِ (مَـ)',
    vowelTypes: 'فَتْحَةٌ قَصِيرَةٌ فِي مَقْطَعٍ سَاكِنٍ (مَعْـ)',
    meaning: 'معجون الأسنان المنظف للأسنان واللثة',
    description: 'يبدأ بالميم المفتوحة التي تشكل مقطعاً ساكناً مع العين (مَعْـ).',
    categoryColor: 'from-sky-500 to-blue-600',
    accentBg: 'bg-sky-50 border-sky-200 text-sky-900',
    textColor: 'text-sky-700',
    hasLetterM: true,
    audioGuide: 'مَعْجُونٌ.. مَـ مَعْجُونُ الأَسْنَانِ، يَبْدَأُ بِحَرْفِ المِيمِ',
    sentenceExample: 'أُنَظِّفُ أَسْنَانِي بِالفُرْشَاةِ وَالمَعْجُونِ قَبْلَ النَّوْمِ',
    iconSvg: 'toothpaste'
  },
  {
    id: 'qalam',
    word: 'قَلَمٌ',
    displayWithDiacritics: 'قَـلَـمٌ',
    syllables: ['قَـ', 'لَـ', 'مٌ'],
    positions: ['finalConnected'],
    positionLabel: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ (ـمٌ)',
    vowelTypes: 'تَنْوِينُ ضَمٍّ فِي آخِرِ الكَلِمَةِ (ـمٌ)',
    meaning: 'أداة الكتابة والتسطير والتعلم',
    description: 'ينتهي بحرف الميم المتصل بما قبله مع تنوين الضم (ـمٌ).',
    categoryColor: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    textColor: 'text-emerald-700',
    hasLetterM: true,
    audioGuide: 'قَلَمٌ.. قَـ لَـ مٌ، يَنْتَهِي بِحَرْفِ المِيمِ',
    sentenceExample: 'أَمْسَكْتُ بِالقَلَمِ لِأَكْتُبَ حَرْفَ المِيمِ',
    iconSvg: 'pen'
  },
  {
    id: 'samaka',
    word: 'سَمَكَةٌ',
    displayWithDiacritics: 'سَـمَـكَـةٌ',
    syllables: ['سَـ', 'مَـ', 'كَـ', 'ةٌ'],
    positions: ['medial'],
    positionLabel: 'وَسَطُ الكَلِمَةِ (ـمَـ)',
    vowelTypes: 'فَتْحَةٌ قَصِيرَةٌ فِي وَسَطِ الكَلِمَةِ (ـمَـ)',
    meaning: 'كائن بحري لطيف يسبح في الماء بخفة ورشاقة',
    description: 'يقع حرف الميم في وسط الكلمة متصلاً من الطرفين ومفتوحاً (ـمَـ).',
    categoryColor: 'from-cyan-500 to-teal-500',
    accentBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    textColor: 'text-cyan-700',
    hasLetterM: true,
    audioGuide: 'سَمَكَةٌ.. سَـ مَـ كَـ ةٌ، المِيمُ فِي وَسَطِ الكَلِمَةِ',
    sentenceExample: 'السَّمَكَةُ الذَّهَبِيَّةُ تَسْبَحُ فِي الحَوْضِ',
    iconSvg: 'fish'
  },
  {
    id: 'melaqa',
    word: 'مِلْعَقَةٌ',
    displayWithDiacritics: 'مِـلْـعَـقَـةٌ',
    syllables: ['مِلْـ', 'عَـ', 'قَـ', 'ةٌ'],
    positions: ['initial'],
    positionLabel: 'أَوَّلُ الكَلِمَةِ (مِـ)',
    vowelTypes: 'كَسْرَةٌ قَصِيرَةٌ فِي مَقْطَعٍ سَاكِنٍ (مِلْـ)',
    meaning: 'أداة المائدة لتناول الطعام والشوربة',
    description: 'تبدأ بحرف الميم المكسور بصوت قصير (مِـ) يليه لام ساكنة (مِلْـ).',
    categoryColor: 'from-indigo-500 to-violet-600',
    accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    textColor: 'text-indigo-700',
    hasLetterM: true,
    audioGuide: 'مِلْعَقَةٌ.. مِـ مِلْعَقَةٌ، تَبْدَأُ بِالمِيمِ المَكْسُورَةِ',
    sentenceExample: 'آكُلُ الحَسَاءَ اللَّذِيذَ بِالمِلْعَقَةِ النَّظِيفَةِ',
    iconSvg: 'spoon'
  }
];

// Additional distractor words for the listening challenge
export const LISTENING_CHALLENGE_WORDS = [
  ...LETTER_M_ACTIVITY_ITEMS,
  {
    id: 'bab',
    word: 'بَابٌ',
    displayWithDiacritics: 'بَـابٌ',
    syllables: ['بَا', 'بٌ'],
    positions: [],
    positionLabel: 'لَا يُوجَدُ فِيهَا مِيم',
    vowelTypes: 'مَدٌّ بِالأَلِفِ (بَا)',
    meaning: 'مدخل البيت أو الغرفة',
    description: 'كلمة تبدأ بالباء وتنتهي بالباء، وليس فيها حرف الميم.',
    categoryColor: 'from-slate-500 to-gray-600',
    accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
    textColor: 'text-slate-600',
    hasLetterM: false,
    audioGuide: 'بَابٌ.. هَلْ فِيهَا مِيم؟ لَا، لَا يُوجَدُ مِيم فِي بَابٌ',
    sentenceExample: 'فَتَحَ فَوَّازٌ بَابَ الغُرْفَةِ',
    iconSvg: 'door'
  },
  {
    id: 'warda',
    word: 'وَرْدَةٌ',
    displayWithDiacritics: 'وَرْدَةٌ',
    syllables: ['وَرْ', 'دَ', 'ةٌ'],
    positions: [],
    positionLabel: 'لَا يُوجَدُ فِيهَا مِيم',
    vowelTypes: 'مَقْطَعٌ سَاكِنٌ (وَرْ)',
    meaning: 'زهرة جميلة عطرة',
    description: 'تبدأ بالواو وتنتهي بالتاء المربوطة، ليس فيها ميم.',
    categoryColor: 'from-slate-500 to-gray-600',
    accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
    textColor: 'text-slate-600',
    hasLetterM: false,
    audioGuide: 'وَرْدَةٌ.. هَلْ فِيهَا مِيم؟ لَا، لَا يُوجَدُ مِيم فِي وَرْدَةٌ',
    sentenceExample: 'سَقَى فَوَّازٌ وَرْدَةَ الحَدِيقَةِ',
    iconSvg: 'flower'
  },
  {
    id: 'kitaab',
    word: 'كِتَابٌ',
    displayWithDiacritics: 'كِـتَـابٌ',
    syllables: ['كِـ', 'تَا', 'بٌ'],
    positions: [],
    positionLabel: 'لَا يُوجَدُ فِيهَا مِيم',
    vowelTypes: 'كَسْرَةٌ وَمَدٌّ بِالأَلِفِ (تَا)',
    meaning: 'سفر القراءة والعلم',
    description: 'تبدأ بالكاف والتاء الممدودة والباء، لا تحتوي حرف الميم.',
    categoryColor: 'from-slate-500 to-gray-600',
    accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
    textColor: 'text-slate-600',
    hasLetterM: false,
    audioGuide: 'كِتَابٌ.. هَلْ فِيهَا مِيم؟ لَا، لَا يُوجَدُ مِيم فِي كِتَابٌ',
    sentenceExample: 'قَرَأَ يَاسِرٌ فِي الكِتَابِ المُلَوَّنِ',
    iconSvg: 'book'
  }
];

export const Grade1Unit1LetterMActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'match' | 'positions' | 'listenQuiz' | 'worksheet'>('match');
  const [connectedItems, setConnectedItems] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<ActivityWordItem | null>(LETTER_M_ACTIVITY_ITEMS[0]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // 0.85 normal, 0.5 slow turtle
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<'all' | 'initial' | 'medial' | 'final'>('all');

  const allConnected = connectedItems.length === LETTER_M_ACTIVITY_ITEMS.length;

  // Speak Arabic helper
  const handleSpeak = async (text: string, customRate?: number) => {
    const rateToUse = customRate ?? speechRate;
    audioManager.stopSpeaking();
    setIsSpeaking(true);
    await audioManager.speakArabic(text, rateToUse);
    setIsSpeaking(false);
  };

  // Connect item to center 'M'
  const handleToggleConnect = (itemId: string) => {
    if (connectedItems.includes(itemId)) {
      setConnectedItems(prev => prev.filter(id => id !== itemId));
      audioManager.play('click');
    } else {
      const newConnected = [...connectedItems, itemId];
      setConnectedItems(newConnected);
      audioManager.play('correct');

      const item = LETTER_M_ACTIVITY_ITEMS.find(i => i.id === itemId);
      if (item) {
        handleSpeak(item.audioGuide);
      }

      // If all 6 connected, trigger confetti!
      if (newConnected.length === LETTER_M_ACTIVITY_ITEMS.length) {
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  // Reset connections
  const handleResetConnections = () => {
    setConnectedItems([]);
    audioManager.play('click');
  };

  // Quiz handle answer
  const handleQuizAnswer = (hasM: boolean) => {
    const currentQ = LISTENING_CHALLENGE_WORDS[quizIndex];
    const isCorrect = currentQ.hasLetterM === hasM;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      audioManager.play('correct');
      setQuizFeedback({
        isCorrect: true,
        message: hasM 
          ? `أَحْسَنْتَ! 👏 كَلِمَةُ (${currentQ.word}) تَحْتَوِي عَلَى صَوْتِ حَرْفِ المِيمِ: ${currentQ.positionLabel}`
          : `إِجَابَةٌ رَائِعَةٌ! 🌟 كَلِمَةُ (${currentQ.word}) لَا تَحْتَوِي عَلَى حَرْفِ المِيمِ.`
      });
      handleSpeak(isCorrect ? 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ' : 'حَاوِلْ مَرَّةً أُخْرَى');
    } else {
      audioManager.play('wrong');
      setQuizFeedback({
        isCorrect: false,
        message: currentQ.hasLetterM
          ? `اِنْتَبِهْ! كَلِمَةُ (${currentQ.word}) تَحْتَوِي فِعْلًا عَلَى حَرْفِ المِيمِ: ${currentQ.positionLabel}`
          : `اِنْتَبِهْ! كَلِمَةُ (${currentQ.word}) لَا تُوجَدُ فِيهَا مِيم.`
      });
    }
  };

  const handleNextQuiz = () => {
    setQuizFeedback(null);
    if (quizIndex < LISTENING_CHALLENGE_WORDS.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Loop or finish
      setQuizIndex(0);
      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  // Render SVG illustration for words
  const renderIllustration = (type: string, isMatched: boolean) => {
    const baseClass = `w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 transform ${isMatched ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105'}`;
    
    switch (type) {
      case 'restaurant':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700`}>
            <span className="text-3xl select-none" role="img" aria-label="مطعم">🍽️</span>
          </div>
        );
      case 'mother':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-700`}>
            <span className="text-3xl select-none" role="img" aria-label="أمي مريم">🧕</span>
          </div>
        );
      case 'toothpaste':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-sky-100 border-2 border-sky-300 text-sky-700`}>
            <span className="text-3xl select-none" role="img" aria-label="معجون أسنان">🪥</span>
          </div>
        );
      case 'pen':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-700`}>
            <span className="text-3xl select-none" role="img" aria-label="قلم">✏️</span>
          </div>
        );
      case 'fish':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-cyan-100 border-2 border-cyan-300 text-cyan-700`}>
            <span className="text-3xl select-none" role="img" aria-label="سمكة">🐟</span>
          </div>
        );
      case 'spoon':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-indigo-100 border-2 border-indigo-300 text-indigo-700`}>
            <span className="text-3xl select-none" role="img" aria-label="ملعقة">🥄</span>
          </div>
        );
      case 'door':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-700`}>
            <span className="text-3xl select-none" role="img" aria-label="باب">🚪</span>
          </div>
        );
      case 'flower':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-700`}>
            <span className="text-3xl select-none" role="img" aria-label="وردة">🌸</span>
          </div>
        );
      case 'book':
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700`}>
            <span className="text-3xl select-none" role="img" aria-label="كتاب">📖</span>
          </div>
        );
      default:
        return (
          <div className={`${baseClass} flex items-center justify-center rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-700`}>
            <span className="text-3xl select-none">✨</span>
          </div>
        );
    }
  };

  // Filter items for positions tab
  const filteredPositionItems = LETTER_M_ACTIVITY_ITEMS.filter(item => {
    if (selectedPositionFilter === 'all') return true;
    if (selectedPositionFilter === 'initial') return item.positions.includes('initial');
    if (selectedPositionFilter === 'medial') return item.positions.includes('medial');
    if (selectedPositionFilter === 'final') return item.positions.includes('finalConnected') || item.positions.includes('finalIsolated');
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 mb-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-xs">
                كِتَابُ لُغَتِي • صَفْحَة ٤٢
              </span>
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-[11px] font-semibold">
                الصَّفُّ الأَوَّلُ الِابْتِدَائِيُّ • الفَصْلُ الأَوَّلُ
              </span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-600/60 text-white text-[11px] font-bold">
                الوِحْدَةُ الأُولَى: أُسْرَتِي (حَرْفُ المِيمِ)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white flex items-center gap-2">
              <span>أَصِلُ الحَرْفَ (م) بِالصُّوَرِ الَّتِي تَحْوِي صَوْتَهُ</span>
              <span className="text-amber-300">🎯</span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              يَسْتَمِعُ الطَّالِبُ إِلَى اسْمِ كُلِّ صُورَةٍ، ثُمَّ يَنْقُرُ عَلَى الصُّورَةِ لِيَصِلَهَا بِحَرْفِ المِيمِ (م) فِي الوَسَطِ، وَيَتَدَرَّبُ عَلَى مَخَارِجِ الحُرُوفِ وَمَوْقِعِ الصَّوْتِ.
            </p>
          </div>

          {/* Quick Actions & Rate Control */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 text-xs">
              <span className="text-emerald-200 px-2 font-bold text-[11px]">سُرْعَةُ النُّطْقِ:</span>
              <button
                onClick={() => setSpeechRate(0.85)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs ${
                  speechRate === 0.85 
                    ? 'bg-amber-400 text-slate-950 shadow-xs' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                عَادِي (1x)
              </button>
              <button
                onClick={() => setSpeechRate(0.5)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                  speechRate === 0.5 
                    ? 'bg-amber-400 text-slate-950 shadow-xs' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span>🐢 بَطِيءٌ (0.5x)</span>
              </button>
            </div>

            <button
              onClick={() => handleSpeak('أَصِلُ الحَرْفَ مِيم بِالصُّوَرِ الَّتِي تَحْوِي صَوْتَهُ. اِسْتَمِعْ لِكُلِّ كَلِمَةٍ ثُمَّ صِلْهَا بِالمِيمِ.')}
              className="px-3.5 py-2 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="سماع تعليمات النشاط"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>تَعْلِيمَاتُ النَّشَاطِ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('match');
            audioManager.play('click');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'match'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>لَوْحَةُ التَّوْصِيلِ التَّفَاعُلِيَّةِ (ص ٤٢)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {connectedItems.length} / {LETTER_M_ACTIVITY_ITEMS.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('positions');
            audioManager.play('click');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'positions'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>مَوَاضِعُ حَرْفِ المِيمِ (أَوَّل • وَسَط • آخِر)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('listenQuiz');
            audioManager.play('click');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'listenQuiz'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>تَحَدِّي التَّمْيِيزِ السَّمْعِيِّ (أَسْتَمِعُ وَأُصَفِّقُ) 👏</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('worksheet');
            audioManager.play('click');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'worksheet'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>كُرَّاسَةُ النَّشَاطِ لِلطِّبَاعَةِ 📄</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE MATCHING BOARD (PAGE 42) */}
      {activeTab === 'match' && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {connectedItems.length}/{LETTER_M_ACTIVITY_ITEMS.length}
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {allConnected ? '🎉 رَائِعٌ جِدًّا! لَقَدْ وَصَلْتَ جَمِيعَ الصُّوَرِ بِحَرْفِ المِيمِ بِنَجَاحٍ' : 'اِنْقُرْ عَلَى كُلِّ صُورَةٍ لِتَصِلَهَا بِحَرْفِ المِيمِ (م) فِي الوَسَطِ:'}
                </p>
                <span className="text-[11px] text-emerald-700">
                  اسْتَمِعْ لِصَوْتِ الكَلِمَةِ بَعْدَ التَّوْصِيلِ وَتَعَرَّفْ عَلَى مَوْقِعِ الحَرْفِ.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetConnections}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إِعَادَةُ التَّوْصِيلِ</span>
              </button>

              <button
                onClick={() => {
                  setConnectedItems(LETTER_M_ACTIVITY_ITEMS.map(i => i.id));
                  audioManager.play('correct');
                  try {
                    confetti({ particleCount: 50, spread: 60 });
                  } catch (e) {}
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تَوْصِيلُ الكُلِّ</span>
              </button>
            </div>
          </div>

          {/* Interactive Constellation Board */}
          <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-3xl p-6 sm:p-10 overflow-hidden">
            {/* Background circular decoration rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-emerald-400/50" />
              <div className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] rounded-full border border-emerald-300/40" />
            </div>

            {/* Central Target: LETTER M (م) */}
            <div className="flex flex-col items-center justify-center mb-8 relative z-10">
              <div 
                onClick={() => handleSpeak('حَرْفُ المِيمِ.. مَـ ، مُـ ، مِـ ، مْ')}
                className="cursor-pointer group relative flex flex-col items-center"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-600/30 border-4 border-white transition-all transform group-hover:scale-105 active:scale-95">
                  <span className="font-amiri text-5xl sm:text-6xl font-black leading-none drop-shadow-md">
                    م
                  </span>
                  <span className="text-[11px] font-bold text-emerald-100 tracking-wider mt-1">
                    حَرْفُ المِيمِ
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 shadow-xs text-xs font-bold text-emerald-800">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>انْقُرْ لِسَمَاعِ الحَرْفِ</span>
                </div>

                {/* Diacritics pills around center */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold font-amiri">مَـ</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold font-amiri">مُـ</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold font-amiri">مِـ</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold font-amiri">مْ</span>
                </div>
              </div>
            </div>

            {/* The 6 Textbook Pictures Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              {LETTER_M_ACTIVITY_ITEMS.map((item, idx) => {
                const isMatched = connectedItems.includes(item.id);
                const isCurrent = selectedWord?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedWord(item);
                      handleToggleConnect(item.id);
                    }}
                    className={`cursor-pointer rounded-3xl p-5 border-2 transition-all relative overflow-hidden group select-none ${
                      isMatched
                        ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/30'
                        : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Top status indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200">
                          {idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.accentBg}`}>
                          {item.positionLabel}
                        </span>
                      </div>

                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isMatched 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                      }`}>
                        {isMatched ? <Check className="w-4 h-4 stroke-[3]" /> : <Target className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Image illustration & Arabic Name */}
                    <div className="flex items-center gap-4 my-2">
                      <div className="shrink-0">
                        {renderIllustration(item.iconSvg, isMatched)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-amiri text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                          {item.word}
                        </h4>
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                          <span>صَوْتُ المِيمِ:</span>
                          <span className="font-amiri font-black text-sm bg-emerald-100 px-1.5 py-0.5 rounded-md text-emerald-950">
                            {item.vowelTypes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWord(item);
                          handleSpeak(item.audioGuide);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition-all"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>اسْتَمِعْ</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWord(item);
                          handleSpeak(item.word, 0.5);
                        }}
                        className="px-2 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1 text-[11px] transition-all border border-amber-200"
                        title="نطق بطيء للتدرب على المخارج"
                      >
                        <span>🐢 0.5x</span>
                      </button>

                      <span className={`font-bold text-[11px] flex items-center gap-1 ${
                        isMatched ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {isMatched ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مَوْصُولٌ بِـ (م)</span>
                          </>
                        ) : (
                          <span>اُنْقُرْ لِلتَّوْصِيلِ</span>
                        )}
                      </span>
                    </div>

                    {/* Connection Line Visual Indicator */}
                    {isMatched && (
                      <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Card for Selected Word */}
          {selectedWord && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {renderIllustration(selectedWord.iconSvg, true)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        تَحْلِيلُ الكَلِمَةِ صَوْتِيًّا
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedWord.positionLabel}
                      </span>
                    </div>
                    <h3 className="font-amiri text-3xl font-black text-slate-900 mt-1">
                      {selectedWord.word}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSpeak(selectedWord.audioGuide)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نُطْقُ الكَلِمَةِ وَالتَّعْرِيفِ</span>
                  </button>

                  <button
                    onClick={() => handleSpeak(selectedWord.syllables.join(' ... '), 0.5)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🐢 تَهْجِئَةُ المَقَاطِعِ (0.5x)</span>
                  </button>
                </div>
              </div>

              {/* Syllable Breakdown Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    تَقْطِيعُ الكَلِمَةِ إِلَى مَقَاطِعَ:
                  </span>
                  <div className="flex items-center gap-1.5 font-amiri text-xl font-bold text-emerald-950">
                    {selectedWord.syllables.map((syl, sIdx) => (
                      <span key={sIdx} className="bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {syl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    مَوْقِعُ حَرْفِ المِيمِ:
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {selectedWord.description}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    جُمْلَةٌ نَمُوذَجِيَّةٌ:
                  </span>
                  <p className="text-xs font-bold text-emerald-900 leading-tight font-amiri text-sm">
                    {selectedWord.sentenceExample}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LETTER POSITIONS LAB (أول الكلمة، وسطها، آخرها) */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                أَشْكَالُ وَمَوَاقِعُ حَرْفِ المِيمِ فِي الكَلِمَةِ (مـ ، ـمـ ، ـم ، م)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تَصْنِيفُ كَلِمَاتِ الصَّفْحَةِ ٤٢ حَسَبَ مَوْقِعِ صَوْتِ المِيمِ فِي الكَلِمَةِ.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedPositionFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedPositionFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                الكُلُّ ({LETTER_M_ACTIVITY_ITEMS.length})
              </button>
              <button
                onClick={() => setSelectedPositionFilter('initial')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedPositionFilter === 'initial'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                أَوَّلُ الكَلِمَةِ (مـ)
              </button>
              <button
                onClick={() => setSelectedPositionFilter('medial')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedPositionFilter === 'medial'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                وَسَطُ الكَلِمَةِ (ـمـ)
              </button>
              <button
                onClick={() => setSelectedPositionFilter('final')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedPositionFilter === 'final'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                آخِرُ الكَلِمَةِ (ـم / م)
              </button>
            </div>
          </div>

          {/* Forms Summary Visual Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-900 font-amiri text-3xl font-black flex items-center justify-center mb-2">
                مـ
              </div>
              <h4 className="text-xs font-bold text-slate-900">أَوَّلُ الكَلِمَةِ</h4>
              <p className="text-[11px] text-slate-500 mt-1">يَتَّصِلُ بِمَا بَعْدَهُ</p>
              <span className="text-[11px] font-bold text-emerald-700 mt-2 block font-amiri text-sm">
                مَطْعَمٌ • مَرْيَمُ • مَعْجُونٌ • مِلْعَقَةٌ
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-100 text-cyan-900 font-amiri text-3xl font-black flex items-center justify-center mb-2">
                ـمـ
              </div>
              <h4 className="text-xs font-bold text-slate-900">وَسَطُ الكَلِمَةِ</h4>
              <p className="text-[11px] text-slate-500 mt-1">يَتَّصِلُ مِنْ الطَّرَفَيْنِ</p>
              <span className="text-[11px] font-bold text-emerald-700 mt-2 block font-amiri text-sm">
                سَمَكَةٌ
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-900 font-amiri text-3xl font-black flex items-center justify-center mb-2">
                ـم
              </div>
              <h4 className="text-xs font-bold text-slate-900">آخِرُ الكَلِمَةِ مُتَّصِلٌ</h4>
              <p className="text-[11px] text-slate-500 mt-1">يَتَّصِلُ بِمَا قَبْلَهُ</p>
              <span className="text-[11px] font-bold text-emerald-700 mt-2 block font-amiri text-sm">
                قَلَمٌ
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 text-rose-900 font-amiri text-3xl font-black flex items-center justify-center mb-2">
                م
              </div>
              <h4 className="text-xs font-bold text-slate-900">آخِرُ الكَلِمَةِ مُنْفَصِلٌ</h4>
              <p className="text-[11px] text-slate-500 mt-1">يَأْتِي بَعْدَ حُرُوفِ الرَّفْسِ</p>
              <span className="text-[11px] font-bold text-emerald-700 mt-2 block font-amiri text-sm">
                مَرْيَمُ • مَطْعَمٌ
              </span>
            </div>
          </div>

          {/* Filtered Words List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositionItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.accentBg}`}>
                    {item.positionLabel}
                  </span>
                  <button
                    onClick={() => handleSpeak(item.audioGuide)}
                    className="p-1 text-slate-400 hover:text-emerald-700"
                    title="نطق"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {renderIllustration(item.iconSvg, true)}
                  <div>
                    <h4 className="font-amiri text-2xl font-black text-slate-900">{item.word}</h4>
                    <span className="text-xs text-slate-500">{item.meaning}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SMART LISTENING CHALLENGE ("أَسْتَمِعُ وَأُصَفِّقُ") */}
      {activeTab === 'listenQuiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                👏
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  لُعْبَةُ التَّصْفِيقِ عِنْدَ سَمَاعِ صَوْتِ المِيمِ (م)
                </h4>
                <p className="text-[11px] text-amber-800">
                  اسْتَمِعْ لِلْكَلِمَةِ جَيِّدًا، إِذَا سَمِعْتَ صَوْتَ المِيمِ صَفِّقْ، وَإِذَا لَمْ تَسْمَعْهُ اِخْتَرْ (لَا يُوجَدُ مِيم).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>النِّقَاطُ: {quizScore}</span>
            </div>
          </div>

          {/* Current Question Card */}
          {(() => {
            const currentQ = LISTENING_CHALLENGE_WORDS[quizIndex];
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md text-center space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>السُّؤَالُ {quizIndex + 1} مِنْ {LISTENING_CHALLENGE_WORDS.length}</span>
                  <span>{currentQ.hasLetterM ? 'سُؤَالُ تَمْيِيزٍ صَوْتِيٍّ' : 'اخْتِبَارُ ذَكَاءِ الأُذُنِ'}</span>
                </div>

                <div className="py-4">
                  <div className="mx-auto w-24 h-24 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center mb-4 shadow-inner">
                    {renderIllustration(currentQ.iconSvg, true)}
                  </div>

                  <h3 className="font-amiri text-4xl sm:text-5xl font-black text-slate-900 mb-2">
                    {currentQ.word}
                  </h3>

                  <button
                    onClick={() => handleSpeak(currentQ.word)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>اسْتَمِعْ لِنُطْقِ الكَلِمَةِ</span>
                  </button>
                </div>

                {/* Answer Buttons */}
                {!quizFeedback ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleQuizAnswer(true)}
                      className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xs"
                    >
                      <span className="text-2xl">👏</span>
                      <span>نَعَمْ، أَسْمَعُ صَوْتَ المِيمِ (م)</span>
                    </button>

                    <button
                      onClick={() => handleQuizAnswer(false)}
                      className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-950 font-black text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xs"
                    >
                      <span className="text-2xl">❌</span>
                      <span>لَا، لَا يُوجَدُ فِيهَا صَوْتُ المِيمِ</span>
                    </button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-2xl border-2 text-right animate-in fade-in duration-200 ${
                    quizFeedback.isCorrect 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-black text-sm">
                      {quizFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>إِجَابَةٌ صَحِيحَةٌ!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-rose-600" />
                          <span>إِجَابَةٌ غَيْرُ صَحِيحَةٍ!</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs font-bold leading-relaxed mb-4">
                      {quizFeedback.message}
                    </p>

                    <button
                      onClick={handleNextQuiz}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <span>السُّؤَالُ التَّالِي</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: WORKSHEET & PRINTABLE ACTIVITY VIEW */}
      {activeTab === 'worksheet' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                وَرَقَةُ عَمَلِ حَرْفِ المِيمِ (صَفْحَة ٤٢) لِلطِّبَاعَةِ وَالحَلِّ الوَرَقِيِّ
              </h4>
              <p className="text-[11px] text-slate-500">
                مُطَابِقَةٌ لِتَصْمِيمِ وَحُلُولِ كِتَابِ لُغَتِي لِلْمُعَلِّمِ وَوَلِيِّ الأَمْرِ.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طِبَاعَةُ النَّشَاطِ (A4)</span>
            </button>
          </div>

          {/* Printable Sheet Frame */}
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto shadow-sm print:border-none print:p-0">
            {/* School Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6 text-xs font-bold">
              <div>
                <p>المَمْلَكَةُ العَرَبِيَّةُ السَّعُودِيَّةُ</p>
                <p>وِزَارَةُ التَّعْلِيمِ</p>
                <p>مَادَّةُ لُغَتِي • الصَّفُّ الأَوَّلُ الِابْتِدَائِيُّ</p>
              </div>

              <div className="text-center">
                <span className="font-amiri text-2xl font-black block">نَشَاطُ حَرْفِ المِيمِ</span>
                <span className="text-[11px] text-slate-600">الوِحْدَةُ الأُولَى (أُسْرَتِي) - ص ٤٢</span>
              </div>

              <div className="text-left space-y-1">
                <p>اسْمُ الطَّالِبِ: ..............................</p>
                <p>الفَصْلُ: ١ / .......</p>
                <p>التَّارِيخُ: ..... / ..... / ١٤٤٨ هـ</p>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 mb-6 text-center">
              <h4 className="font-amiri text-lg font-black text-emerald-950 mb-1">
                السُّؤَالُ: أَصِلُ الحَرْفَ (م) بِالصُّوَرِ الَّتِي تَحْوِي صَوْتَهُ
              </h4>
              <p className="text-xs text-emerald-800">
                اُنْطُقِ اسْمَ كُلِّ صُورَةٍ، ثُمَّ ارْسُمْ خَطًّا يَصِلُ بَيْنَ الصُّورَةِ وَحَرْفِ المِيمِ (م) فِي الوَسَطِ.
              </p>
            </div>

            {/* Center 'M' and surrounding circles for print */}
            <div className="relative py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-slate-900 flex items-center justify-center font-amiri text-5xl font-black mb-8 shadow-sm">
                م
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full text-center">
                {LETTER_M_ACTIVITY_ITEMS.map((item, idx) => (
                  <div key={item.id} className="border-2 border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-between">
                    <span className="text-3xl mb-1">{idx === 0 ? '🍽️' : idx === 1 ? '🧕' : idx === 2 ? '🪥' : idx === 3 ? '✏️' : idx === 4 ? '🐟' : '🥄'}</span>
                    <span className="font-amiri text-xl font-black text-slate-900">{item.word}</span>
                    <span className="text-[10px] text-slate-500 mt-1">({item.positionLabel})</span>
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-400 mt-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Rating Stars Footer */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1">
                <span>تَقْيِيمُ المُعَلِّمِ:</span>
                <span className="text-amber-500 text-lg">⭐⭐⭐⭐⭐</span>
              </div>
              <div>
                <span>تَوْقِيعُ المُعَلِّمِ / وَلِيِّ الأَمْرِ: .....................</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
