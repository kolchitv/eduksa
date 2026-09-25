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
  Target,
  Circle,
  PenTool,
  Eraser,
  Volume1,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';

export interface Activity2Word {
  id: string;
  word: string;
  displayLetters: { char: string; isTarget: boolean; posLabel?: string }[];
  targetChar: string;
  position: 'initial' | 'medial' | 'finalConnected' | 'finalIsolated';
  positionLabel: string;
  vowel: 'fatha' | 'damma' | 'kasra' | 'sukoon';
  vowelLabel: string;
  vowelSound: string;
  syllables: string[];
  meaning: string;
  illustrationType: string;
  exampleSentence: string;
  categoryColor: string;
}

export const ACTIVITY_2_WORDS: Activity2Word[] = [
  {
    id: 'masjid',
    word: 'مَسْجِدٌ',
    displayLetters: [
      { char: 'مَـ', isTarget: true, posLabel: 'أول الكلمة' },
      { char: 'سْـ', isTarget: false },
      { char: 'جِـ', isTarget: false },
      { char: 'دٌ', isTarget: false }
    ],
    targetChar: 'مَـ',
    position: 'initial',
    positionLabel: 'أَوَّلُ الكَلِمَةِ (مَـ)',
    vowel: 'fatha',
    vowelLabel: 'فَتْحَةٌ (مَـ)',
    vowelSound: 'مَـ',
    syllables: ['مَسْـ', 'جِـ', 'دٌ'],
    meaning: 'بيت الله الذي نصلي فيه الصلوات الخمس جماعة',
    illustrationType: 'mosque',
    exampleSentence: 'يَذْهَبُ أَبِي سَعْدٌ إِلَى المَسْجِدِ لِأَدَاءِ الصَّلَاةِ',
    categoryColor: 'emerald'
  },
  {
    id: 'samakah',
    word: 'سَمَكَةٌ',
    displayLetters: [
      { char: 'سَـ', isTarget: false },
      { char: 'ـمَـ', isTarget: true, posLabel: 'وسط الكلمة' },
      { char: 'كَـ', isTarget: false },
      { char: 'ةٌ', isTarget: false }
    ],
    targetChar: 'ـمَـ',
    position: 'medial',
    positionLabel: 'وَسَطُ الكَلِمَةِ (ـمَـ)',
    vowel: 'fatha',
    vowelLabel: 'فَتْحَةٌ (ـمَـ)',
    vowelSound: 'مَـ',
    syllables: ['سَـ', 'مَـ', 'كَـ', 'ةٌ'],
    meaning: 'كائن بحري لطيف يسبح في الماء بخفة وزعانف جميلة',
    illustrationType: 'fish',
    exampleSentence: 'السَّمَكَةُ الذَّهَبِيَّةُ تَسْبَحُ فِي الحَوْضِ بِهِمَّةٍ',
    categoryColor: 'sky'
  },
  {
    id: 'qalam',
    word: 'قَلَمٌ',
    displayLetters: [
      { char: 'قَـ', isTarget: false },
      { char: 'لَـ', isTarget: false },
      { char: 'ـمٌ', isTarget: true, posLabel: 'آخر الكلمة متصل' }
    ],
    targetChar: 'ـمٌ',
    position: 'finalConnected',
    positionLabel: 'آخِرُ الكَلِمَةِ مُتَّصِلٌ (ـمٌ)',
    vowel: 'damma',
    vowelLabel: 'تَنْوِينُ ضَمٍّ (ـمٌ)',
    vowelSound: 'مُـ',
    syllables: ['قَـ', 'لَـ', 'مٌ'],
    meaning: 'أداة الكتابة والرسم وتدوين العلم والمعرفة',
    illustrationType: 'pen',
    exampleSentence: 'أَكْتُبُ دَرْسَ حَرْفِ المِيمِ بِالقَلَمِ الجَمِيلِ',
    categoryColor: 'amber'
  },
  {
    id: 'haram',
    word: 'هَرَمٌ',
    displayLetters: [
      { char: 'هَـ', isTarget: false },
      { char: 'رَ', isTarget: false },
      { char: 'مٌ', isTarget: true, posLabel: 'آخر الكلمة منفصل' }
    ],
    targetChar: 'مٌ',
    position: 'finalIsolated',
    positionLabel: 'آخِرُ الكَلِمَةِ مُنْفَصِلٌ (مٌ)',
    vowel: 'damma',
    vowelLabel: 'تَنْوِينُ ضَمٍّ (مٌ)',
    vowelSound: 'مُـ',
    syllables: ['هَـ', 'رَ', 'مٌ'],
    meaning: 'بناء هندسي ضخم وعريق ذو قاعدة مثلثة',
    illustrationType: 'pyramid',
    exampleSentence: 'رَسَمَ فَوَّازٌ شَكْلَ الهَرَمِ المُمَيَّزِ فِي دَفْتَرِهِ',
    categoryColor: 'indigo'
  },
  {
    id: 'miftah',
    word: 'مِفْتَاحٌ',
    displayLetters: [
      { char: 'مِـ', isTarget: true, posLabel: 'أول الكلمة' },
      { char: 'فْـ', isTarget: false },
      { char: 'تَا', isTarget: false },
      { char: 'حٌ', isTarget: false }
    ],
    targetChar: 'مِـ',
    position: 'initial',
    positionLabel: 'أَوَّلُ الكَلِمَةِ (مِـ)',
    vowel: 'kasra',
    vowelLabel: 'كَسْرَةٌ (مِـ)',
    vowelSound: 'مِـ',
    syllables: ['مِفْـ', 'تَا', 'حٌ'],
    meaning: 'أداة معدنية لفتح الأبواب والأقفال بأمان',
    illustrationType: 'key',
    exampleSentence: 'مَعَ أَبِي مِفْتَاحُ البَابِ الخَارِجِيِّ لِلْمَنْزِلِ',
    categoryColor: 'rose'
  },
  {
    id: 'muallim',
    word: 'مُعَلِّمٌ',
    displayLetters: [
      { char: 'مُـ', isTarget: true, posLabel: 'أول الكلمة' },
      { char: 'عَـ', isTarget: false },
      { char: 'لِّـ', isTarget: false },
      { char: 'مٌ', isTarget: true, posLabel: 'آخر الكلمة متصل' }
    ],
    targetChar: 'مُـ',
    position: 'initial',
    positionLabel: 'أَوَّلُ وَآخِرُ الكَلِمَةِ (مُـ ... ـمٌ)',
    vowel: 'damma',
    vowelLabel: 'ضَمَّةٌ (مُـ)',
    vowelSound: 'مُـ',
    syllables: ['مُـ', 'عَلْـ', 'لِـ', 'مٌ'],
    meaning: 'المربي الفاضل الذي ينير العقول بالعلم والأخلاق',
    illustrationType: 'teacher',
    exampleSentence: 'أَنَا أُحِبُّ مُعَلِّمِي الكَرِيمَ وَأَسْتَمِعُ لِنَصَائِحِهِ',
    categoryColor: 'teal'
  }
];

export interface PhoneticSoundPair {
  id: string;
  shortForm: string;
  shortLabel: string;
  shortExample: string;
  longForm: string;
  longLabel: string;
  longExample: string;
  vowelType: string;
  color: string;
}

export const PHONETIC_PAIRS: PhoneticSoundPair[] = [
  {
    id: 'fatha_alif',
    shortForm: 'مَـ',
    shortLabel: 'صَوْتٌ قَصِيرٌ (بِالفَتْحَةِ)',
    shortExample: 'مَـطَرٌ • مَـسْجِدٌ',
    longForm: 'مَا',
    longLabel: 'صَوْتٌ طَوِيلٌ (بِمَدِّ الأَلِفِ)',
    longExample: 'مَاءٌ • سَمَاءٌ • قَامَ',
    vowelType: 'فَتْحَةٌ مَعَ أَلِفِ المَدِّ',
    color: 'amber'
  },
  {
    id: 'damma_waw',
    shortForm: 'مُـ',
    shortLabel: 'صَوْتٌ قَصِيرٌ (بِالضَّمَّةِ)',
    shortExample: 'مُـعَلِّمٌ • مُـصْحَفٌ',
    longForm: 'مُو',
    longLabel: 'صَوْتٌ طَوِيلٌ (بِمَدِّ الوَاوِ)',
    longExample: 'لَيْمُونٌ • نُجُومٌ • يَقُومُ',
    vowelType: 'ضَمَّةٌ مَعَ وَاوِ المَدِّ',
    color: 'emerald'
  },
  {
    id: 'kasra_yaa',
    shortForm: 'مِـ',
    shortLabel: 'صَوْتٌ قَصِيرٌ (بِالكَسْرَةِ)',
    shortExample: 'مِـشْعَلٌ • مِـفْتَاحٌ',
    longForm: 'مِي',
    longLabel: 'صَوْتٌ طَوِيلٌ (بِمَدِّ اليَاءِ)',
    longExample: 'أُمِّي • سَمِيعٌ • جَمِيلٌ',
    vowelType: 'كَسْرَةٌ مَعَ يَاءِ المَدِّ',
    color: 'sky'
  }
];

interface Grade1Unit1Activity2Props {
  onBackToActivitiesHub?: () => void;
  onOpenActivity1?: () => void;
}

export const Grade1Unit1Activity2: React.FC<Grade1Unit1Activity2Props> = ({
  onBackToActivitiesHub,
  onOpenActivity1
}) => {
  const [activeTab, setActiveTab] = useState<'circling' | 'phonetics' | 'writing'>('circling');
  
  // Tab 1: Circling State
  const [circledWords, setCircledWords] = useState<Record<string, boolean>>({});
  const [identifiedPositions, setIdentifiedPositions] = useState<Record<string, string>>({});
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(0);
  
  // Tab 2: Phonetic Sorting Challenge State
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [phoneticScore, setPhoneticScore] = useState<number>(0);
  const [answeredChallenges, setAnsweredChallenges] = useState<Record<number, boolean>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Tab 3: Interactive Writing Canvas
  const [writingForm, setWritingForm] = useState<'initial' | 'medial' | 'finalConnected' | 'finalIsolated'>('initial');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const currentWord = ACTIVITY_2_WORDS[selectedWordIdx];

  // Initialize canvas
  useEffect(() => {
    if (activeTab === 'writing') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw baseline guide
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(30, canvas.height * 0.65);
      ctx.lineTo(canvas.width - 30, canvas.height * 0.65);
      ctx.stroke();

      // Draw top guide
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, canvas.height * 0.3);
      ctx.lineTo(canvas.width - 30, canvas.height * 0.3);
      ctx.stroke();
      ctx.setLineDash([]);
      setHasDrawn(false);
    }
  }, [activeTab, writingForm]);

  const handleCircleLetter = (wordId: string) => {
    audioManager.play('star');
    setCircledWords(prev => ({ ...prev, [wordId]: true }));
    audioManager.speakArabic(`أحسنت! هذا حرف الميم في كلمة ${currentWord.word}`);
  };

  const handleSelectPosition = (wordId: string, pos: string) => {
    const isCorrect = currentWord.position === pos || (currentWord.id === 'muallim');
    if (isCorrect) {
      audioManager.play('correct');
      setIdentifiedPositions(prev => ({ ...prev, [wordId]: pos }));
      audioManager.speakArabic(`ممتاز! موقع حرف الميم هو ${currentWord.positionLabel}`);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
    } else {
      audioManager.play('wrong');
      audioManager.speakArabic('حاول مرة أخرى، انظر جيداً إلى موضع الحرف في الكلمة');
    }
  };

  // Phonetic interactive questions
  const PHONETIC_QUESTIONS = [
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (مَـطَرٌ) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'مَطَرٌ.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'short',
      explanation: 'صَوْتٌ قَصِيرٌ بِالفَتْحَةِ (مَـ).'
    },
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (مَاءٌ) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'مَاءٌ.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'long',
      explanation: 'صَوْتٌ طَوِيلٌ بِمَدِّ الأَلِفِ (مَا).'
    },
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (مُـعَلِّمٌ) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'مُعَلِّمٌ.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'short',
      explanation: 'صَوْتٌ قَصِيرٌ بِالضَّمَّةِ (مُـ).'
    },
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (لَيْمُونٌ) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'لَيْمُونٌ.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'long',
      explanation: 'صَوْتٌ طَوِيلٌ بِمَدِّ الوَاوِ (مُو).'
    },
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (مِـشْعَلٌ) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'مِشْعَلٌ.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'short',
      explanation: 'صَوْتٌ قَصِيرٌ بِالكَسْرَةِ (مِـ).'
    },
    {
      prompt: 'اسْتَمِعْ إِلَى الكَلِمَةِ: (أُمِّي) .. هَلْ صَوْتُ المِيمِ فِيهَا قَصِيرٌ أَمْ طَوِيلٌ؟',
      audioPrompt: 'أُمِّي.. هَلْ هُوَ صَوْتٌ قَصِيرٌ أَمْ صَوْتٌ طَوِيلٌ؟',
      correctType: 'long',
      explanation: 'صَوْتٌ طَوِيلٌ بِمَدِّ اليَاءِ (مِي).'
    }
  ];

  const currentQ = PHONETIC_QUESTIONS[currentChallengeIdx];

  const handleAnswerPhonetic = (choice: 'short' | 'long') => {
    if (answeredChallenges[currentChallengeIdx]) return;
    const isCorrect = choice === currentQ.correctType;
    if (isCorrect) {
      audioManager.play('correct');
      setPhoneticScore(prev => prev + 10);
      setChallengeFeedback({ isCorrect: true, text: `رائع! إجابة صحيحة: ${currentQ.explanation}` });
      audioManager.speakArabic(`رائع! إجابة صحيحة: ${currentQ.explanation}`);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      audioManager.play('wrong');
      setChallengeFeedback({ isCorrect: false, text: `انتبه: ${currentQ.explanation}` });
      audioManager.speakArabic(`انتبه: ${currentQ.explanation}`);
    }
    setAnsweredChallenges(prev => ({ ...prev, [currentChallengeIdx]: true }));
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#059669'; // Emerald writing ink
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw baseline guide
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(30, canvas.height * 0.65);
    ctx.lineTo(canvas.width - 30, canvas.height * 0.65);
    ctx.stroke();
    ctx.setLineDash([]);
    setHasDrawn(false);
    audioManager.play('click');
  };

  // Render SVG Icon Helper
  const renderIllustration = (type: string) => {
    switch (type) {
      case 'mosque':
        return (
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl shadow-inner">
            🕌
          </div>
        );
      case 'fish':
        return (
          <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-3xl shadow-inner">
            🐟
          </div>
        );
      case 'pen':
        return (
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-inner">
            ✏️
          </div>
        );
      case 'pyramid':
        return (
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-3xl shadow-inner">
            🔺
          </div>
        );
      case 'key':
        return (
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-3xl shadow-inner">
            🔑
          </div>
        );
      case 'teacher':
        return (
          <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-3xl shadow-inner">
            👨‍🏫
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-3xl shadow-inner">
            ✨
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-400 shadow-xl overflow-hidden text-slate-900">
      {/* Activity Top Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-7 text-white relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-amber-800 shadow-xs">
                ⭐ النَّشَاطُ ٢ • الوَحْدَةُ الأُولَى (أُسْرَتِي)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-900/30 text-amber-100 border border-white/20">
                الصَّفُّ الأَوَّلُ الاِبْتِدَائِيُّ • كِتَابُ لُغَتِي
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white flex items-center gap-2">
              <span>أُمَيِّزُ مَوْقِعَ الحَرْفِ (م) وَأَرْسُمُ دَائِرَةً حَوْلَهُ، ثُمَّ أُمَيِّزُ بَيْنَ الصَّوْتِ القَصِيرِ وَالطَّوِيلِ وَأَكْتُبُهُ</span>
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-2xl">
              تَدْرِيبَاتٌ تِفَاعُلِيَّةٌ شَامِلَةٌ لِحَرْفِ المِيمِ: رَسْمُ الدَّائِرَةِ، تَمْيِيزُ المَوْقِعِ (أَوَّل، وَسَط، آخِر)، مُخْتَبَرُ الْمُدُودِ، وَسَبُّورَةُ الكِتَابَةِ.
            </p>
          </div>

          {/* Hub Navigation Shortcuts */}
          <div className="flex items-center gap-2 shrink-0">
            {onBackToActivitiesHub && (
              <button
                onClick={onBackToActivitiesHub}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs border border-white/30"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>قِسْمُ الأَنْشِطَةِ</span>
              </button>
            )}
            {onOpenActivity1 && (
              <button
                onClick={onOpenActivity1}
                className="px-3.5 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-300/30"
              >
                <Target className="w-3.5 h-3.5" />
                <span>نَشَاطُ ١ (ص ٤٢)</span>
              </button>
            )}
            <button
              onClick={() => {
                audioManager.speakArabic('النَّشَاطُ الثَّانِي: أُمَيِّزُ مَوْقِعَ حَرْفِ المِيمِ وَأَرْسُمُ دَائِرَةً حَوْلَهُ، ثُمَّ أُمَيِّزُ بَيْنَ الصَّوْتِ القَصِيرِ وَالطَّوِيلِ وَأَكْتُبُهُ');
              }}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/30"
              title="الاستماع لتعليمات النشاط"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Activity Sub-Modes Pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setActiveTab('circling');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              activeTab === 'circling'
                ? 'bg-white text-slate-900 ring-2 ring-amber-300'
                : 'bg-amber-600/60 hover:bg-amber-600 text-white'
            }`}
          >
            <Circle className="w-4 h-4 text-amber-500" />
            <span>١. أَرْسُمُ دَائِرَةً وَأُمَيِّزُ المَوْقِعَ ({Object.keys(circledWords).length}/{ACTIVITY_2_WORDS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('phonetics');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              activeTab === 'phonetics'
                ? 'bg-white text-slate-900 ring-2 ring-amber-300'
                : 'bg-amber-600/60 hover:bg-amber-600 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>٢. الصَّوْتُ القَصِيرُ وَالطَّوِيلُ (الْمُدُود)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('writing');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              activeTab === 'writing'
                ? 'bg-white text-slate-900 ring-2 ring-amber-300'
                : 'bg-amber-600/60 hover:bg-amber-600 text-white'
            }`}
          >
            <PenTool className="w-4 h-4 text-sky-600" />
            <span>٣. سَبُّورَةُ كِتَابَةِ أَشْكَالِ المِيمِ</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        {/* ============================================================== */}
        {/* TAB 1: CIRCLE THE LETTER & IDENTIFY ITS POSITION               */}
        {/* ============================================================== */}
        {activeTab === 'circling' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="text-sm font-black text-amber-950 font-alexandria">
                    المُهِمَّةُ: اِنْقُرْ عَلَى حَرْفِ المِيمِ (م) لِرَسْمِ دَائِرَةٍ حَوْلَهُ، ثُمَّ حَدِّدْ مَوْقِعَهُ الصَّحِيحَ فِي الكَلِمَةِ!
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    اخْتَرْ إِحْدَى الكَلِمَاتِ التَّالِيَةِ لِلتَّدْرِيبِ عَلَيْهَا:
                  </p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-xs font-black text-amber-950">
                  الإنجاز: {Object.keys(circledWords).length} مِن {ACTIVITY_2_WORDS.length} كَلِمَاتٍ
                </span>
              </div>
            </div>

            {/* Word Chips Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {ACTIVITY_2_WORDS.map((w, idx) => {
                const isSelected = selectedWordIdx === idx;
                const isCircled = !!circledWords[w.id];
                const isPosDone = !!identifiedPositions[w.id];
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWordIdx(idx);
                      audioManager.play('click');
                      audioManager.speakArabic(w.word);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 relative ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-md ring-2 ring-amber-300'
                        : isCircled && isPosDone
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isCircled && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                        ✓
                      </span>
                    )}
                    <span className="text-sm font-amiri font-bold">{w.word}</span>
                    <span className="text-[10px] opacity-80">{w.positionLabel.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Workstation Card for Current Word */}
            {currentWord && (
              <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
                  {/* Word Visual Identity */}
                  <div className="flex items-center gap-4">
                    {renderIllustration(currentWord.illustrationType)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          {currentWord.vowelLabel}
                        </span>
                        <span className="text-xs text-slate-500">
                          المعنى: {currentWord.meaning}
                        </span>
                      </div>
                      <h4 className="text-3xl sm:text-4xl font-black font-amiri text-slate-950 tracking-wider">
                        {currentWord.word}
                      </h4>
                    </div>
                  </div>

                  {/* Audio Speaker */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => audioManager.speakArabic(currentWord.word)}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>نُطْقُ الكَلِمَةِ</span>
                    </button>
                    <button
                      onClick={() => audioManager.speakArabic(currentWord.syllables.join(' .. '))}
                      className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all flex items-center gap-2 border border-slate-300 shadow-2xs"
                    >
                      <Volume1 className="w-4 h-4 text-amber-600" />
                      <span>تَقْطِيعٌ صَوْتِيٌّ: ({currentWord.syllables.join(' - ')})</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Letter Display with Clickable Circle Target */}
                <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 text-center space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    اِنْقُرْ عَلَى حَرْفِ المِيمِ (م) أَدْنَاهُ لِرَسْمِ الدَّائِرَةِ حَوْلَهُ:
                  </p>

                  <div className="flex items-center justify-center gap-4 sm:gap-6 py-4 flex-wrap">
                    {currentWord.displayLetters.map((l, lIdx) => {
                      const isCircled = !!circledWords[currentWord.id];
                      return (
                        <div
                          key={lIdx}
                          onClick={() => {
                            if (l.isTarget) {
                              handleCircleLetter(currentWord.id);
                            } else {
                              audioManager.play('wrong');
                              audioManager.speakArabic('هذا ليس حرف الميم، ابحث عن حرف الميم');
                            }
                          }}
                          className={`relative cursor-pointer transition-all p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] select-none ${
                            l.isTarget
                              ? isCircled
                                ? 'bg-amber-100 border-amber-500 scale-105 shadow-md ring-4 ring-amber-300/50'
                                : 'bg-slate-50 hover:bg-amber-50 border-amber-300 hover:scale-102 hover:border-amber-400'
                              : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {l.isTarget && isCircled && (
                            <div className="absolute inset-0 rounded-2xl border-4 border-amber-500 animate-pulse pointer-events-none flex items-center justify-center">
                              <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-600"></div>
                            </div>
                          )}

                          <span className="font-amiri text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                            {l.char}
                          </span>

                          <span className="text-[10px] text-slate-500 mt-2 font-bold">
                            {l.isTarget ? (isCircled ? 'دَائِرَةٌ مَرْسُومَةٌ ⭕' : 'اِنْقُرْ هُنَا 👈') : 'حَرْفٌ آخَرُ'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {circledWords[currentWord.id] && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-xs animate-in fade-in duration-200 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>أَحْسَنْتَ! تَمَّ رَسْمُ الدَّائِرَةِ حَوْلَ حَرْفِ المِيمِ فِي الكَلِمَةِ بِنَجَاحٍ.</span>
                    </div>
                  )}
                </div>

                {/* Sub-exercise: Position Identification */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span>حَدِّدْ مَوْقِعَ حَرْفِ المِيمِ (م) فِي كَلِمَةِ ({currentWord.word}):</span>
                    </h5>
                    {identifiedPositions[currentWord.id] && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        تم التحديد بنجاح ✓
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'initial', label: 'فِي أَوَّلِ الكَلِمَةِ (مَـ / مِـ / مُـ)' },
                      { id: 'medial', label: 'فِي وَسَطِ الكَلِمَةِ (ـمَـ)' },
                      { id: 'finalConnected', label: 'فِي آخِرِ الكَلِمَةِ مُتَّصِلٌ (ـمٌ)' },
                      { id: 'finalIsolated', label: 'فِي آخِرِ الكَلِمَةِ مُنْفَصِلٌ (مٌ)' }
                    ].map((pos) => {
                      const isSelected = identifiedPositions[currentWord.id] === pos.id;
                      const isTargetCorrect = currentWord.position === pos.id || (currentWord.id === 'muallim' && (pos.id === 'initial' || pos.id === 'finalConnected'));
                      return (
                        <button
                          key={pos.id}
                          onClick={() => handleSelectPosition(currentWord.id, pos.id)}
                          className={`p-4 rounded-2xl border text-right transition-all font-bold text-xs flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{pos.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Example in Context */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-900">مِثَالٌ فِي جُمْلَةٍ مُفِيدَةٍ: </span>
                    <span className="font-amiri text-base font-bold text-amber-950">«{currentWord.exampleSentence}»</span>
                  </div>
                  <button
                    onClick={() => audioManager.speakArabic(currentWord.exampleSentence)}
                    className="p-2 rounded-xl bg-amber-200 text-amber-900 hover:bg-amber-300 transition-all shrink-0"
                    title="الاستماع للجملة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Next / Previous Word Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={selectedWordIdx === 0}
                    onClick={() => setSelectedWordIdx(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span>الكَلِمَةُ السَّابِقَةُ</span>
                  </button>

                  <button
                    disabled={selectedWordIdx === ACTIVITY_2_WORDS.length - 1}
                    onClick={() => setSelectedWordIdx(prev => Math.min(ACTIVITY_2_WORDS.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                  >
                    <span>الكَلِمَةُ التَّالِيَةُ</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SHORT VOWELS VS LONG VOWELS (AL-MUDOOD)                 */}
        {/* ============================================================== */}
        {activeTab === 'phonetics' && (
          <div className="space-y-8">
            {/* Visual Guide Comparison Grid */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-emerald-950 font-alexandria flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>تَمْيِيزُ الصَّوْتِ القَصِيرِ (الحَرَكَات) وَالصَّوْتِ الطَّوِيلِ (الْمَدّ)</span>
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    الْحَرَكَةُ زَمَنُهَا قَصِيرٌ (فَتْحَة، ضَمَّة، كَسْرَة)، أَمَّا الْمَدُّ فَنَمُدُّ فِيهِ صَوْتَنَا مَعَ الأَلِفِ وَالْوَاوِ وَالْيَاءِ.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-emerald-300 font-black text-xs text-emerald-900 shadow-2xs">
                  نِقَاطُ التَّحَدِّي: {phoneticScore} ⭐
                </div>
              </div>

              {/* 3 Main Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PHONETIC_PAIRS.map((pair) => (
                  <div key={pair.id} className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
                    <div className="text-center pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {pair.vowelType}
                      </span>
                    </div>

                    {/* Short Sound Card */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-amiri text-2xl font-black text-amber-900">{pair.shortForm}</span>
                          <span className="text-[11px] font-bold text-amber-800">{pair.shortLabel}</span>
                        </div>
                        <p className="text-[10px] text-amber-700 mt-0.5 font-bold">مِثَال: {pair.shortExample}</p>
                      </div>
                      <button
                        onClick={() => audioManager.speakArabic(pair.shortForm)}
                        className="p-1.5 rounded-lg bg-amber-200 text-amber-900 hover:bg-amber-300 transition-all"
                        title="نطق الصوت القصير"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Long Sound Card */}
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-amiri text-2xl font-black text-emerald-900">{pair.longForm}</span>
                          <span className="text-[11px] font-bold text-emerald-800">{pair.longLabel}</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 mt-0.5 font-bold">مِثَال: {pair.longExample}</p>
                      </div>
                      <button
                        onClick={() => audioManager.speakArabic(pair.longForm)}
                        className="p-1.5 rounded-lg bg-emerald-200 text-emerald-900 hover:bg-emerald-300 transition-all"
                        title="نطق الصوت الطويل"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Auditory Challenge Station */}
            <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    تَحَدِّي الاِسْتِمَاعِ وَالتَّصْنِيفِ (السُّؤَالُ {currentChallengeIdx + 1} مِنْ {PHONETIC_QUESTIONS.length})
                  </span>
                  <h4 className="text-lg font-black font-alexandria text-white mt-1">
                    {currentQ.prompt}
                  </h4>
                </div>

                <button
                  onClick={() => audioManager.speakArabic(currentQ.audioPrompt)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>اسْتَمِعْ لِلسُّؤَالِ مَرَّةً أُخْرَى</span>
                </button>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleAnswerPhonetic('short')}
                  disabled={answeredChallenges[currentChallengeIdx]}
                  className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-amber-400 text-center transition-all group disabled:opacity-60 flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-3xl">⏱️</span>
                  <span className="text-base font-black text-white group-hover:text-amber-300">
                    صَوْتٌ قَصِيرٌ (حَرَكَة)
                  </span>
                  <span className="text-xs text-slate-400">
                    مَـ (فتحة) • مُـ (ضمة) • مِـ (كسرة)
                  </span>
                </button>

                <button
                  onClick={() => handleAnswerPhonetic('long')}
                  disabled={answeredChallenges[currentChallengeIdx]}
                  className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-emerald-400 text-center transition-all group disabled:opacity-60 flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-3xl">〰️</span>
                  <span className="text-base font-black text-white group-hover:text-emerald-300">
                    صَوْتٌ طَوِيلٌ (مَدّ)
                  </span>
                  <span className="text-xs text-slate-400">
                    مَا (مد ألف) • مُو (مد واو) • مِي (مد ياء)
                  </span>
                </button>
              </div>

              {/* Feedback Alert */}
              {challengeFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                    challengeFeedback.isCorrect
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {challengeFeedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-rose-400" />
                    )}
                    <span>{challengeFeedback.text}</span>
                  </div>

                  {currentChallengeIdx < PHONETIC_QUESTIONS.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentChallengeIdx(prev => prev + 1);
                        setChallengeFeedback(null);
                        audioManager.play('click');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-200 transition-all shrink-0"
                    >
                      السؤال التالي ◀
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INTERACTIVE LETTER M WRITING CANVAS (4 POSITIONS)       */}
        {/* ============================================================== */}
        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✍️</span>
                <div>
                  <h3 className="text-sm font-black text-sky-950 font-alexandria">
                    سَبُّورَةُ الكِتَابَةِ التَّفَاعُلِيَّةِ: تَدَرَّبْ عَلَى كِتَابَةِ حَرْفِ المِيمِ بِأَشْكَالِهِ الأَرْبَعَةِ عَلَى السَّطْرِ!
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5">
                    اخْتَرْ شَكْلَ الحَرْفِ، ثُمَّ ارْسُمْ بِإِصْبَعِكَ أَوْ بِالفَأْرَةِ عَلَى السَّبُّورَةِ مَعَ مُرَاعَاةِ السَّطْرِ المُنَقَّطِ.
                  </p>
                </div>
              </div>

              {/* Clear Canvas */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>مَسْحُ السَّبُّورَةِ</span>
                </button>
              </div>
            </div>

            {/* Shape Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'initial', form: 'مـ', title: 'فِي أَوَّلِ الكَلِمَةِ', guide: 'دائرة صغيرة فوق السطر ثم ذراع على السطر' },
                { id: 'medial', form: 'ـمـ', title: 'فِي وَسَطِ الكَلِمَةِ', guide: 'ذراع يمين ثم رأس الميم ثم ذراع يسار' },
                { id: 'finalConnected', form: 'ـم', title: 'فِي آخِرِ الكَلِمَةِ مُتَّصِلٌ', guide: 'ذراع ثم رأس الميم ينزل تحت السطر' },
                { id: 'finalIsolated', form: 'م', title: 'فِي آخِرِ الكَلِمَةِ مُنْفَصِلٌ', guide: 'رأس الميم فوق السطر وذيلها ينزل لأسفل' }
              ].map((item) => {
                const isSelected = writingForm === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setWritingForm(item.id as any);
                      audioManager.play('click');
                      audioManager.speakArabic(`شكل حرف الميم ${item.title}`);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="font-amiri text-4xl font-black leading-none">{item.form}</span>
                    <span className="text-xs font-bold">{item.title}</span>
                    <span className="text-[10px] opacity-80 line-clamp-1">{item.guide}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Canvas Area */}
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 text-center space-y-4">
              <div className="relative mx-auto inline-block border-2 border-dashed border-emerald-300 rounded-3xl bg-white shadow-inner overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={240}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="touch-none cursor-crosshair max-w-full block"
                />

                {/* Background Shadow Guide Text of the Letter */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
                  <span className="font-amiri text-9xl font-black text-slate-900 select-none">
                    {writingForm === 'initial' ? 'مـ' : writingForm === 'medial' ? 'ـمـ' : writingForm === 'finalConnected' ? 'ـم' : 'م'}
                  </span>
                </div>
              </div>

              {/* Drawing Controls and Feedback */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold text-slate-600">
                <span>🟢 السطر المتقطع هو خط الأساس للكتابة السليمة</span>
                {hasDrawn && (
                  <button
                    onClick={() => {
                      audioManager.play('fanfare');
                      confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
                      audioManager.speakArabic('خطك جميل ورائع، بارك الله فيك!');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>تَحْقِيقُ الرَّسْمِ وَتَقْيِيمُ الخَطِّ ⭐</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black">
              ⭐
            </div>
            <div>
              <h5 className="font-black text-xs text-slate-900">
                أَنْشِطَةُ كِتَابِ لُغَتِي المَعْتَمَدَةُ • الصَّفُّ الأَوَّلُ الاِبْتِدَائِيُّ
              </h5>
              <p className="text-[11px] text-slate-500">
                مُطَابِقٌ لِأَهْدَافِ المِنْهَاجِ السُّعُودِيِّ فِي تَعْلِيمِ القِرَاءَةِ وَالكِتَابَةِ لِلْمَرْحَلَةِ الابْتِدَائِيَّةِ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenActivity1 && (
              <button
                onClick={onOpenActivity1}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-300"
              >
                <span>الانتقال لنشاط ١ (ص ٤٢)</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {onBackToActivitiesHub && (
              <button
                onClick={onBackToActivitiesHub}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>قِسْمُ الأَنْشِطَةِ كَامِلاً</span>
                <Layers className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
