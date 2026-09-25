import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Square,
  CheckCircle2,
  Award,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Info,
  Clock,
  Compass,
  Smile,
  Star,
  Zap,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { 
  DICTIONARY_ENTRIES, 
  DictionaryEntry, 
  DICTIONARY_CATEGORIES 
} from '../data/dictionaryData';
import { audioManager } from '../utils/audio';
import { GradeId } from '../types/curriculum';

// Articulation Zones classification based on classical Arabic phonetics (مخارج الحروف)
export type ArticulationZone = 'all' | 'halq' | 'lisan' | 'shafatan' | 'jawf' | 'khayshum';

export interface ArticulationInfo {
  zone: ArticulationZone;
  zoneName: string;
  zoneIcon: string;
  primaryLetter: string;
  subLocation: string; // المخرج الخاص
  phoneticDescription: string;
  studentTips: string;
  mouthGuide: string;
}

export const ARTICULATION_ZONES_CONFIG: { id: ArticulationZone; name: string; icon: string; color: string; desc: string }[] = [
  { id: 'all', name: 'جميع المخارج', icon: '✨', color: 'bg-slate-100 text-slate-800', desc: 'استعراض كل كلمات المنهج' },
  { id: 'halq', name: 'مخرج الحلق', icon: '🗣️', color: 'bg-amber-100 text-amber-900 border-amber-300', desc: 'الهمزة، الهاء، العين، الحاء، الغين، الخاء' },
  { id: 'lisan', name: 'مخرج اللسان والأسنان', icon: '👅', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', desc: 'القاف، الكاف، الجيم، الشين، الضاد، اللام، النون، الراء، الطاء، الدال، التاء، الصاد، السين، الزاي، الظاء، الذال، الثاء' },
  { id: 'shafatan', name: 'مخرج الشفتين', icon: '👄', color: 'bg-rose-100 text-rose-900 border-rose-300', desc: 'الفاء، الباء، الميم، الواو غير المدية' },
  { id: 'jawf', name: 'مخرج الجوف (المدود)', icon: '🌬️', color: 'bg-sky-100 text-sky-900 border-sky-300', desc: 'الألف اللينة، واو المد، ياء المد' },
  { id: 'khayshum', name: 'مخرج الخيشوم (الغنة)', icon: '👃', color: 'bg-purple-100 text-purple-900 border-purple-300', desc: 'التنوين، النون والميم المشددتين' },
];

// Helper to determine the prominent articulation point for a given word
export function getArticulationDetails(entry: DictionaryEntry): ArticulationInfo {
  const clean = entry.wordWithNoHarakat.replace(/^(ال|أ|إ|آ)/, '');
  const firstLetter = clean[0] || entry.wordWithNoHarakat[0] || 'م';
  const hasTanween = entry.word.includes('ٌ') || entry.word.includes('ٍ') || entry.word.includes('ً');
  const hasMadd = entry.spellingCategory === 'madd' || entry.word.includes('َا') || entry.word.includes('ُو') || entry.word.includes('ِي');

  // Specific overrides based on spelling rule or target phoneme
  if (entry.spellingCategory === 'tanween' || hasTanween && entry.spellingCategory !== 'fatha_damma_kasra') {
    return {
      zone: 'khayshum',
      zoneName: 'الخيشوم (صوت الغنة)',
      zoneIcon: '👃',
      primaryLetter: 'التنوين (ـٌ ـٍ ـً)',
      subLocation: 'تجويف الأنف الداخلي الممتد إلى الحلق',
      phoneticDescription: 'صوت رخيم ذو نغمة جميلة يخرج من الأنف ولا عمل للسان فيه.',
      studentTips: 'ضع إصبعك برفق على أنفك أثناء نطق التنوين لتشعر باهتزاز صوت الغنة الصافي.',
      mouthGuide: 'الأنف والخيشوم'
    };
  }

  if (entry.spellingCategory === 'madd' && hasMadd) {
    return {
      zone: 'jawf',
      zoneName: 'الجوف (حروف المد الثلاثة)',
      zoneIcon: '🌬️',
      primaryLetter: 'الألف / الواو / الياء',
      subLocation: 'الخلاء الداخل في الحلق والفم الممتد',
      phoneticDescription: 'يمتد الصوت عبر مجرى الهواء دون أن ينقطع عند عضو معين من أعضاء النطق.',
      studentTips: 'افتح فمك براحة عند مد الألف (ـَا)، واضمم شفتيك عند مد الواو (ـُو)، واخفض فكك عند مد الياء (ـِي).',
      mouthGuide: 'تجويف الفم المفتوح'
    };
  }

  // Throat letters (حروف الحلق)
  if (['ء', 'ه', 'هـ', 'ع', 'ح', 'غ', 'خ'].includes(firstLetter) || entry.word.includes('ع') || entry.word.includes('ح') || entry.word.includes('خ')) {
    const throatLetter = ['ء', 'ه', 'هـ', 'ع', 'ح', 'غ', 'خ'].find(l => entry.wordWithNoHarakat.includes(l)) || firstLetter;
    let sub = 'وسط الحلق';
    let tip = 'اضغط بلطف في منتصف الحلق لنطق صوت عميق وواضح.';
    if (['ء', 'ه', 'هـ'].includes(throatLetter)) {
      sub = 'أقصى الحلق (مما يلي الصدر)';
      tip = 'أخرج الصوت برفق من عمق الحلق دون شدة زائدة.';
    } else if (['غ', 'خ'].includes(throatLetter)) {
      sub = 'أدنى الحلق (مما يلي اللهاة وفم المعدة)';
      tip = 'يخرج الصوت من أعلى الحلق مع ملامسة خفيفة لأعلى الحنك.';
    }
    return {
      zone: 'halq',
      zoneName: 'الحلق (الأصوات الحلقية)',
      zoneIcon: '🗣️',
      primaryLetter: throatLetter,
      subLocation: sub,
      phoneticDescription: `يخرج حرف (${throatLetter}) من تجويف الحلق بوضوح ونقاء صوتي.`,
      studentTips: tip,
      mouthGuide: 'عمق الحلق'
    };
  }

  // Lip letters (حروف الشفتين)
  if (['ف', 'ب', 'م', 'و'].includes(firstLetter) || entry.word.includes('م') || entry.word.includes('ب')) {
    const lipLetter = ['ف', 'ب', 'م', 'و'].find(l => entry.wordWithNoHarakat.includes(l)) || firstLetter;
    let tip = 'اطبق شفتيك بانسيابية ثم افتحهما برفق لإصدار صوت الحرف.';
    let sub = 'انطباق الشفتين';
    if (lipLetter === 'ف') {
      sub = 'بطن الشفة السفلى مع أطراف الثنايا العليا';
      tip = 'المس بطن الشفة السفلى برفق بأطراف أسنانك العليا مع خروج هواء خفيف.';
    } else if (lipLetter === 'و') {
      sub = 'انضمام الشفتين مع فرجة صغيرة';
      tip = 'اضمم شفتيك إلى الأمام كالدائرة الصغيرة دون إطباقهما بالكامل.';
    }
    return {
      zone: 'shafatan',
      zoneName: 'الشفتان (الأصوات الشفوية)',
      zoneIcon: '👄',
      primaryLetter: lipLetter,
      subLocation: sub,
      phoneticDescription: `يخرج حرف (${lipLetter}) بحركة محكمة من الشفتين مع نقاء المخرج.`,
      studentTips: tip,
      mouthGuide: 'الشفاه وحواف الأسنان'
    };
  }

  // Tongue letters (حروف اللسان) - default primary zone in Arabic
  const lisanLetter = firstLetter;
  let tip = 'ضع طرف لسانك عند أصول الثنايا العليا مع الحركة المضبوطة.';
  let sub = 'طرف اللسان وأصول الثنايا';
  if (['ق', 'ك'].includes(lisanLetter)) {
    sub = 'أقصى اللسان مع الحنك الأعلى';
    tip = lisanLetter === 'ق' ? 'ارفع مؤخرة لسانك للأعلى لإخراج القاف المفخمة بقوة.' : 'ارفع أقصى اللسان أسفل مخرج القاف قليلاً مع همس خفيف.';
  } else if (['ض'].includes(lisanLetter)) {
    sub = 'إحدى حافتي اللسان أو كلاهما مع الأضراس العليا (لغة الضاد)';
    tip = 'الصق حافة لسانك بالأضراس العليا بهدوء مع استطالة صوت الضاد المميزة.';
  } else if (['ص', 'س', 'ز'].includes(lisanLetter)) {
    sub = 'طرف اللسان مع ما فوق الثنايا السفلى (حروف الصفير)';
    tip = 'اجعل طرف لسانك قريباً من أسنانك السفلى لخروج صوت الصفير النقي (س/ص/ز).';
  } else if (['ط', 'د', 'ت'].includes(lisanLetter)) {
    sub = 'طرف اللسان مع أصول الثنايا العليا';
    tip = 'اطرق بطرف لسانك أصول أسنانك العليا بإحكام ثم حرره.';
  } else if (['ظ', 'ذ', 'ث'].includes(lisanLetter)) {
    sub = 'طرف اللسان مع أطراف الثنايا العليا (الحروف اللثوية)';
    tip = 'أخرج رأس لسانك قليلاً بين أسنانك العليا والسفلى لنطق ذ/ث/ظ نطقاً فصيحاً صحيحاً.';
  }

  return {
    zone: 'lisan',
    zoneName: 'اللسان (مخارج اللسان والأسنان)',
    zoneIcon: '👅',
    primaryLetter: lisanLetter,
    subLocation: sub,
    phoneticDescription: `يخرج حرف (${lisanLetter}) بحركة دقيقة ومتقنة للسان مع الحنك أو الأسنان.`,
    studentTips: tip,
    mouthGuide: 'طرف ووسط اللسان'
  };
}

// Saudi Curriculum Units filter
export const SAUDI_UNITS = [
  { id: 'all', name: 'جميع الوحدات' },
  { id: 'أسرتي', name: 'الوحدة 1: أسرتي وأقاربي' },
  { id: 'مدرستي', name: 'الوحدة 2: مدرستي' },
  { id: 'مدينتي', name: 'الوحدة 3: مدينتي وقريتي' },
  { id: 'صحتي', name: 'الوحدة 4: صحتي وغذائي' },
  { id: 'ألعابي', name: 'الوحدة 5: ألعابي وهواياتي' },
  { id: 'حيواناتي', name: 'الوحدة 6: حيواناتي' },
  { id: 'وطني', name: 'الوحدة 7: وطني السعودية' },
  { id: 'آداب', name: 'الوحدة 8: آداب وسلوك وأخلاق' },
] as const;

interface AudioDictionaryProps {
  initialWordId?: string;
  currentGrade?: GradeId;
  onAddStars?: (count: number) => void;
  studentName?: string;
  onNavigateToVisual?: () => void;
}

export const AudioDictionary: React.FC<AudioDictionaryProps> = ({
  initialWordId,
  currentGrade = 'grade1',
  onAddStars,
  studentName = 'البطل المتميز',
  onNavigateToVisual
}) => {
  // Speed setting: 0.5x (slow/articulation), 0.75x (steady), 1.0x (normal), 1.25x (fluent)
  const [playbackRate, setPlaybackRate] = useState<number>(0.5);
  // Repetition: 1, 2, or 3 times
  const [repeatCount, setRepeatCount] = useState<number>(1);
  // Selected Articulation Zone
  const [selectedZone, setSelectedZone] = useState<ArticulationZone>('all');
  // Selected Saudi Curriculum Unit
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  // Grade filter
  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    if (currentGrade === 'kg1' || currentGrade === 'kg2') return 'foundation';
    if (currentGrade === 'grade1') return 'grade1';
    if (currentGrade === 'grade2') return 'grade2';
    if (currentGrade === 'grade3') return 'grade3';
    return 'all';
  });
  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active word index
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);

  // Audio playing states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number>(-1);
  const [currentRepeatStep, setCurrentRepeatStep] = useState<number>(0);

  // Voice recording & mirror practice
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [hasPracticedActiveWord, setHasPracticedActiveWord] = useState<boolean>(false);
  const [practiceCelebration, setPracticeCelebration] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Subscribe to audioManager speaking status
  useEffect(() => {
    const unsub = audioManager.subscribeSpeaking((speaking) => {
      setIsPlaying(speaking);
      if (!speaking) {
        setActiveSyllableIndex(-1);
      }
    });
    return () => unsub();
  }, []);

  // Filter words
  const filteredWords = useMemo(() => {
    return DICTIONARY_ENTRIES.filter((entry) => {
      // Grade filter
      if (selectedGrade !== 'all') {
        if (selectedGrade === 'foundation' && entry.grade !== 'foundation' && entry.grade !== 'kg') return false;
        if (selectedGrade !== 'foundation' && entry.grade !== selectedGrade) return false;
      }

      // Unit filter
      if (selectedUnit !== 'all') {
        if (!entry.unitName.includes(selectedUnit) && !entry.category.includes(selectedUnit)) {
          return false;
        }
      }

      // Articulation zone filter
      if (selectedZone !== 'all') {
        const details = getArticulationDetails(entry);
        if (details.zone !== selectedZone) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchWord = entry.word.includes(q) || entry.wordWithNoHarakat.includes(q);
        const matchMeaning = entry.meaning.includes(q);
        const matchRule = entry.spellingRule.includes(q);
        const matchUnit = entry.unitName.includes(q);
        if (!matchWord && !matchMeaning && !matchRule && !matchUnit) return false;
      }

      return true;
    });
  }, [selectedGrade, selectedUnit, selectedZone, searchQuery]);

  // Set initial word if provided
  useEffect(() => {
    if (initialWordId) {
      const idx = filteredWords.findIndex((w) => w.id === initialWordId);
      if (idx !== -1) {
        setActiveWordIndex(idx);
      } else {
        const anyIdx = DICTIONARY_ENTRIES.findIndex((w) => w.id === initialWordId);
        if (anyIdx !== -1) {
          // Reset filters to show it
          setSelectedZone('all');
          setSelectedUnit('all');
          setSelectedGrade('all');
          setSearchQuery('');
          setActiveWordIndex(anyIdx);
        }
      }
    }
  }, [initialWordId]);

  // Current active word
  const activeWord: DictionaryEntry | undefined = filteredWords[activeWordIndex % (filteredWords.length || 1)] || DICTIONARY_ENTRIES[0];
  const articulation = useMemo(() => activeWord ? getArticulationDetails(activeWord) : null, [activeWord]);

  // Reset practice state when word changes
  useEffect(() => {
    setRecordedAudioUrl(null);
    setIsRecording(false);
    setHasPracticedActiveWord(false);
    setPracticeCelebration(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    audioManager.stopSpeaking();
  }, [activeWord?.id]);

  // Voice playback triggers
  const handlePlayWord = async (speed: number = playbackRate) => {
    if (!activeWord) return;
    try {
      if (repeatCount > 1) {
        await audioManager.speakRepeatedly(activeWord.word, speed, repeatCount, 800, (curr) => {
          setCurrentRepeatStep(curr);
        });
        setCurrentRepeatStep(0);
      } else {
        await audioManager.speakArabic(activeWord.word, speed);
      }
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  const handlePlaySyllables = async () => {
    if (!activeWord || !activeWord.syllables || activeWord.syllables.length === 0) return;
    try {
      await audioManager.speakSyllablesSequentially(
        activeWord.syllables,
        Math.max(0.5, playbackRate),
        (idx) => setActiveSyllableIndex(idx),
        450
      );
    } catch (e) {
      console.warn('Syllables playback error:', e);
    }
  };

  const handlePlaySingleSyllable = async (syllable: string, idx: number) => {
    setActiveSyllableIndex(idx);
    await audioManager.speakArabic(syllable, Math.max(0.45, playbackRate));
    setTimeout(() => setActiveSyllableIndex(-1), 600);
  };

  const handlePlaySentence = async () => {
    if (!activeWord) return;
    await audioManager.speakArabic(activeWord.sentence, Math.max(0.7, playbackRate));
  };

  // Microphone recording
  const startRecording = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      alert('الميكروفون غير مدعوم في هذا المتصفح');
      return;
    }

    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 6) {
            stopRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission or start failed:', err);
      // Fallback message
      alert('يرجى منح الإذن للوصول إلى الميكروفون لتسجيل صوتك ومقارنة نطقك.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleVerifyPronunciation = () => {
    setHasPracticedActiveWord(true);
    setPracticeCelebration(true);
    audioManager.playFanfare();
    if (onAddStars) {
      onAddStars(3);
    }
    setTimeout(() => {
      setPracticeCelebration(false);
    }, 3500);
  };

  const handleNextWord = () => {
    if (filteredWords.length === 0) return;
    setActiveWordIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevWord = () => {
    if (filteredWords.length === 0) return;
    setActiveWordIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleRandomWord = () => {
    if (filteredWords.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredWords.length);
    if (nextIdx === activeWordIndex) {
      nextIdx = (nextIdx + 1) % filteredWords.length;
    }
    setActiveWordIndex(nextIdx);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Introduction to Audio Dictionary & Articulation Training */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-cyan-950 p-6 md:p-8 text-white shadow-xl border border-emerald-700/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>المنهج السعودي • لغتي الجميلة • مهارات النطق الفصيح</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>القاموس الصوتي ومخارج الحروف</span>
              <span className="text-2xl">🔊</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              استمع إلى النطق العربي الفصيح لكلمات المناهج السعودية، مع إمكانية إبطاء السرعة حتى <span className="font-extrabold text-amber-300 underline underline-offset-4">0.5x (سلحفاة)</span> لملاحظة مخارج الحروف بدقة، والتدرب على اللسان والشفتين والحلق، ومقارنة صوتك بالصوت الفصيح!
            </p>
          </div>

          {/* Quick Articulation Speed Bar in Header */}
          <div className="bg-emerald-950/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-700/50 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>سرعة النطق لمخارج الحروف:</span>
              </span>
              <span className="text-amber-300 font-extrabold text-sm">{playbackRate}x</span>
            </div>

            {/* Speeds selector buttons */}
            <div className="grid grid-cols-4 gap-1.5 bg-emerald-900/80 p-1 rounded-xl border border-emerald-700/40">
              {[
                { rate: 0.5, label: '0.5x', hint: 'سلحفاة (مخارج الحروف)', icon: '🐢' },
                { rate: 0.75, label: '0.75x', hint: 'متمهل', icon: '🚶' },
                { rate: 1.0, label: '1.0x', hint: 'طبيعي', icon: '⚡' },
                { rate: 1.25, label: '1.25x', hint: 'سريع', icon: '🚀' }
              ].map((speed) => (
                <button
                  key={speed.rate}
                  onClick={() => setPlaybackRate(speed.rate)}
                  title={speed.hint}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all ${
                    playbackRate === speed.rate
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-102'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                  }`}
                >
                  <span className="text-xs">{speed.icon}</span>
                  <span className="text-[11px] leading-tight">{speed.label}</span>
                </button>
              ))}
            </div>

            {/* Repetitions Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-800/60 text-[11px] text-emerald-300">
              <span className="flex items-center gap-1">
                <Repeat className="w-3 h-3 text-emerald-400" />
                <span>تكرار النطق:</span>
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRepeatCount(num)}
                    className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center transition-colors ${
                      repeatCount === num
                        ? 'bg-amber-400 text-slate-950 font-extrabold'
                        : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                    }`}
                  >
                    {num}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Articulation Zones & Curriculum Units */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Top search & grade pills */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن كلمة أو مخرج حرف أو ظاهرة صوتية..."
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

          {/* Grade selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {DICTIONARY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
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

        {/* Articulation Zones Filters */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>مخارج الحروف المستهدفة (التدريب الصوتي):</span>
            </div>
            <span className="text-[11px] text-slate-500">
              المتاح: {filteredWords.length} كلمة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ARTICULATION_ZONES_CONFIG.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone.id);
                  setActiveWordIndex(0);
                }}
                className={`p-2.5 rounded-xl text-right transition-all border ${
                  selectedZone === zone.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{zone.icon}</span>
                  <span className="text-xs font-bold truncate">{zone.name}</span>
                </div>
                <p className={`text-[10px] line-clamp-1 ${selectedZone === zone.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {zone.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Saudi Curriculum Units filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">وحدات لغتي:</span>
          {SAUDI_UNITS.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                setSelectedUnit(unit.id);
                setActiveWordIndex(0);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedUnit === unit.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {unit.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Articulation Workshop Stage */}
      {activeWord ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Word Center Stage (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              {/* Word Navigation Ribbon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {activeWord.gradeName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {activeWord.unitName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevWord}
                    title="الكلمة السابقة"
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 px-1">
                    {(activeWordIndex % filteredWords.length) + 1} / {filteredWords.length}
                  </span>
                  <button
                    onClick={handleNextWord}
                    title="الكلمة التالية"
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRandomWord}
                    title="كلمة عشوائية للتدريب"
                    className="p-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors mr-1"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Huge Arabic Word Typography & Audio Controls */}
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="inline-block relative">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-wide font-serif py-2 select-all">
                    {activeWord.word}
                  </h1>
                  {isPlaying && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-emerald-600 text-white text-[11px] px-3 py-0.5 rounded-full font-bold shadow-sm animate-bounce">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>جارٍ النطق بالسرعة {playbackRate}x...</span>
                    </div>
                  )}
                  {currentRepeatStep > 0 && (
                    <div className="absolute -top-3 right-0 bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full shadow-2xs">
                      تكرار {currentRepeatStep} / {repeatCount}
                    </div>
                  )}
                </div>

                {/* Primary Audio Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {/* Normal / Selected Speed Play */}
                  <button
                    onClick={() => handlePlayWord(playbackRate)}
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                  >
                    <Volume2 className="w-6 h-6" />
                    <span>استمع للكلمة ({playbackRate}x)</span>
                  </button>

                  {/* Dedicated 0.5x Slowdown Articulation Button */}
                  <button
                    onClick={() => handlePlayWord(0.5)}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-md active:scale-98 transition-all border border-amber-400"
                    title="استمع ببطء شديد 0.5x لمخارج الحروف وحركة اللسان والشفتين"
                  >
                    <span className="text-lg">🐢</span>
                    <span>نطق بطيء (0.5x) للمخارج</span>
                  </button>

                  {/* Syllable By Syllable Step Play */}
                  <button
                    onClick={handlePlaySyllables}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm active:scale-98 transition-all border border-slate-300"
                    title="نطق المقاطع الصوتية مقطعاً مقطعاً بتأنٍ"
                  >
                    <Play className="w-4 h-4 text-emerald-700" />
                    <span>تهجئة مقطعية</span>
                  </button>
                </div>
              </div>

              {/* Syllable Breakdown Interactive Tiles (التقطيع الصوتي ومخارج المقاطع) */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>التحليل الصوتي للمقاطع (انقر على أي مقطع لسماعه معزولاً):</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    عدد المقاطع: {activeWord.syllables.length}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {activeWord.syllables.map((syl, idx) => {
                    const isCurrent = activeSyllableIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePlaySingleSyllable(syl, idx)}
                        className={`min-w-[64px] px-4 py-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 border-amber-500 scale-105 shadow-md font-black'
                            : 'bg-white text-emerald-950 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                        title={`انقر لسماع مقطع: ${syl}`}
                      >
                        <span className="text-2xl sm:text-3xl font-black font-serif">{syl}</span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1">مقطع {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meaning and Example Sentence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">المعنى والشرح:</span>
                  <p className="text-slate-700 leading-relaxed">{activeWord.meaning}</p>
                </div>
                <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-950">جملة من المنهج:</span>
                    <button
                      onClick={handlePlaySentence}
                      className="text-amber-800 hover:text-amber-950 flex items-center gap-1 font-bold text-[11px]"
                      title="استمع للجملة كاملة"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>سماع الجملة</span>
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-serif text-sm">{activeWord.sentence}</p>
                </div>
              </div>

              {/* Voice Mirror & Student Pronunciation Recording Practice */}
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Mic className="w-4 h-4 text-rose-600" />
                    <span>مرآة الصوت: تدرّب على النطق وسجّل صوتك</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    استمع لنفسك وقارن مع نطق المعلم
                  </span>
                </div>

                <div className="bg-linear-to-r from-rose-50/70 via-amber-50/50 to-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Record button and status */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
                      >
                        <Mic className="w-4 h-4" />
                        <span>ابدأ تسجيل صوتك 🎙️</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 animate-pulse"
                      >
                        <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
                        <span>إيقاف التسجيل ({recordingSeconds} ث)</span>
                      </button>
                    )}

                    <div className="text-xs text-slate-600">
                      {isRecording ? (
                        <span className="text-rose-600 font-extrabold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                          <span>تحدث الآن بوضوح: «{activeWord.word}»</span>
                        </span>
                      ) : recordedAudioUrl ? (
                        <span className="text-emerald-700 font-bold">
                          تم حفظ تسجيلك! استمع إليه الآن.
                        </span>
                      ) : (
                        <span>اضغط وسجل نطقك للكلمة بصوت مرتفع وواضح</span>
                      )}
                    </div>
                  </div>

                  {/* Playback of student recording */}
                  {recordedAudioUrl && (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <audio src={recordedAudioUrl} controls className="h-8 max-w-[180px]" />
                      <button
                        onClick={handleVerifyPronunciation}
                        disabled={hasPracticedActiveWord}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all ${
                          hasPracticedActiveWord
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{hasPracticedActiveWord ? 'تم التدريب! ⭐' : 'تأكيد الإتقان (+3 ⭐)'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {practiceCelebration && (
                  <div className="bg-amber-100 border border-amber-300 text-amber-950 p-3 rounded-2xl text-center text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>أحسنت يا {studentName}! نطق رائع ومخرج حرف متقن! أضيفت 3 نجوم لرصيدك! ⭐⭐⭐</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Articulation Anatomical Guide & Tips Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {articulation && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{articulation.zoneIcon}</span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {articulation.zoneName}
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        الحرف البارز: {articulation.primaryLetter}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    مخرج فصيح
                  </span>
                </div>

                {/* Sublocation detail */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">المخرج التشريحي الدقيق:</span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {articulation.subLocation}
                  </p>
                </div>

                {/* Tips for the student */}
                <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>كيف تنطق الحرف بشكل صحيح؟</span>
                  </div>
                  <p className="text-amber-950/90 leading-relaxed">
                    {articulation.studentTips}
                  </p>
                </div>

                {/* Phonetic Phenomenon / Spelling Rule */}
                <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/80 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-900 block">القاعدة والظاهرة الصوتية:</span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeWord.spellingRule}
                  </p>
                </div>

                {/* Action button to switch to Visual Dictionary for this word */}
                {onNavigateToVisual && (
                  <button
                    onClick={onNavigateToVisual}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>عرض البطاقة المصورة في القاموس المرئي</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick Word List in active category */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>كلمات أخرى في نفس المجموعة:</span>
                <span className="text-[11px] text-slate-400">({filteredWords.length} كلمة)</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {filteredWords.map((entry, idx) => {
                  const isCurrent = (activeWordIndex % filteredWords.length) === idx;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setActiveWordIndex(idx)}
                      className={`w-full text-right p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                        isCurrent
                          ? 'bg-emerald-700 text-white font-extrabold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-serif text-sm font-bold">{entry.word}</span>
                        <span className={`text-[10px] truncate ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                          • {entry.meaning}
                        </span>
                      </div>
                      <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-amber-300' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <p className="text-base font-bold text-slate-700">لا توجد كلمات مطابقة لمعايير البحث الحالية.</p>
          <button
            onClick={() => {
              setSelectedZone('all');
              setSelectedUnit('all');
              setSelectedGrade('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            إعادة ضبط الفلاتر وعرض الكل
          </button>
        </div>
      )}
    </div>
  );
};
