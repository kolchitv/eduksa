import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Flame, 
  Star, 
  Smile, 
  Eye, 
  Compass, 
  PenTool, 
  Plane, 
  RefreshCw,
  Trophy,
  Heart,
  Search,
  Filter,
  Shuffle,
  Printer,
  BookOpen,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { SPELLING_100_WORDS, SpellingWord } from '../data/spellingWordsData';
import confetti from 'canvas-confetti';

interface LetterItem {
  char: string;
  name: string;
  fatha: string;
  damma: string;
  kasra: string;
  word: string;
  emoji: string;
  meaning: string;
}

const KG_LETTERS: LetterItem[] = [
  { char: 'أ', name: 'أَلِف', fatha: 'أَ', damma: 'أُ', kasra: 'إِ', word: 'أَسَد', emoji: '🦁', meaning: 'أسد شجاع' },
  { char: 'ب', name: 'بَاء', fatha: 'بَ', damma: 'بُ', kasra: 'بِ', word: 'بَطَّة', emoji: '🦆', meaning: 'بطة تسبح' },
  { char: 'ت', name: 'تَاء', fatha: 'تَ', damma: 'تُ', kasra: 'تِ', word: 'تَاج', emoji: '👑', meaning: 'تاج ذهبي' },
  { char: 'ث', name: 'ثَاء', fatha: 'ثَ', damma: 'ثُ', kasra: 'ثِ', word: 'ثَعْلَب', emoji: '🦊', meaning: 'ثعلب ذكي' },
  { char: 'ج', name: 'جِيم', fatha: 'جَ', damma: 'جُ', kasra: 'جِ', word: 'جَمَل', emoji: '🐪', meaning: 'جمل الصبر' },
  { char: 'ح', name: 'حَاء', fatha: 'حَ', damma: 'حُ', kasra: 'حِ', word: 'حَمَامَة', emoji: '🕊️', meaning: 'حمامة السلام' },
  { char: 'خ', name: 'خَاء', fatha: 'خَ', damma: 'خُ', kasra: 'خِ', word: 'خَرُوف', emoji: '🐑', meaning: 'خروف وديع' },
  { char: 'د', name: 'دَال', fatha: 'دَ', damma: 'دُ', kasra: 'دِ', word: 'دُبّ', emoji: '🐻', meaning: 'دب لطيف' },
  { char: 'ذ', name: 'ذَال', fatha: 'ذَ', damma: 'ذُ', kasra: 'ذِ', word: 'ذُرَة', emoji: '🌽', meaning: 'ذرة صفراء' },
  { char: 'ر', name: 'رَاء', fatha: 'رَ', damma: 'رُ', kasra: 'رِ', word: 'رَائِد', emoji: '🚀', meaning: 'صاروخ فضاء' },
  { char: 'ز', name: 'زَاي', fatha: 'زَ', damma: 'زُ', kasra: 'زِ', word: 'زَرَافَة', emoji: '🦒', meaning: 'زرافة طويلة' },
  { char: 'س', name: 'سِين', fatha: 'سَ', damma: 'سُ', kasra: 'سِ', word: 'سَيَّارَة', emoji: '🚗', meaning: 'سيارة سريعة' },
  { char: 'ش', name: 'شِين', fatha: 'شَ', damma: 'شُ', kasra: 'شِ', word: 'شَمْس', emoji: '☀️', meaning: 'شمس مشرقة' },
  { char: 'ص', name: 'صَاد', fatha: 'صَ', damma: 'صُ', kasra: 'صِ', word: 'صَقْر', emoji: '🦅', meaning: 'صقر جارح' },
  { char: 'ض', name: 'ضَاد', fatha: 'ضَ', damma: 'ضُ', kasra: 'ضِ', word: 'ضِفْدَع', emoji: '🐸', meaning: 'ضفدع يقفز' },
  { char: 'ط', name: 'طَاء', fatha: 'طَ', damma: 'طُ', kasra: 'طِ', word: 'طَيَّارَة', emoji: '✈️', meaning: 'طائرة تحلق' },
  { char: 'ظ', name: 'ظَاء', fatha: 'ظَ', damma: 'ظُ', kasra: 'ظِ', word: 'ظَبْي', emoji: '🦌', meaning: 'ظبي رشيق' },
  { char: 'ع', name: 'عَيْن', fatha: 'عَ', damma: 'عُ', kasra: 'عِ', word: 'عَيْن', emoji: '👁️', meaning: 'عين مبصرة' },
  { char: 'غ', name: 'غَيْن', fatha: 'غَ', damma: 'غُ', kasra: 'غِ', word: 'غَزَال', emoji: '🦌', meaning: 'غزال جميل' },
  { char: 'ف', name: 'فَاء', fatha: 'فَ', damma: 'فُ', kasra: 'فِ', word: 'فِيل', emoji: '🐘', meaning: 'فيل ضخم' },
  { char: 'ق', name: 'قَاف', fatha: 'قَ', damma: 'قُ', kasra: 'قِ', word: 'قَلَم', emoji: '✏️', meaning: 'قلم للكتابة' },
  { char: 'ك', name: 'كَاف', fatha: 'كَ', damma: 'كُ', kasra: 'كِ', word: 'كِتَاب', emoji: '📖', meaning: 'كتاب مفيد' },
  { char: 'ل', name: 'لاَم', fatha: 'لَ', damma: 'لُ', kasra: 'لِ', word: 'لَيْمُون', emoji: '🍋', meaning: 'ليمون منعش' },
  { char: 'م', name: 'مِيم', fatha: 'مَ', damma: 'مُ', kasra: 'مِ', word: 'مَوْز', emoji: '🍌', meaning: 'موز لذيذ' },
  { char: 'ن', name: 'نُون', fatha: 'نَ', damma: 'نُ', kasra: 'نِ', word: 'نَجْمَة', emoji: '⭐', meaning: 'نجمة ساطعة' },
  { char: 'هـ', name: 'هَاء', fatha: 'هَ', damma: 'هُ', kasra: 'هِ', word: 'هِلاَل', emoji: '🌙', meaning: 'هلال منير' },
  { char: 'و', name: 'وَاو', fatha: 'وَ', damma: 'وُ', kasra: 'وِ', word: 'وَرْدَة', emoji: '🌹', meaning: 'وردة جميلة' },
  { char: 'ي', name: 'يَاء', fatha: 'يَ', damma: 'يُ', kasra: 'يِ', word: 'يَد', emoji: '✋', meaning: 'يد نظيفة' },
];

export const KgStudio: React.FC = () => {
  const [stage, setStage] = useState<'kg1' | 'kg2'>('kg1');
  const [kg1Tab, setKg1Tab] = useState<'touch' | 'cards' | 'match' | 'listen' | 'tracing' | 'beginnerSpelling'>('touch');
  const [kg2Tab, setKg2Tab] = useState<'spelling100' | 'player' | 'builder' | 'speedQuiz' | 'planeGame' | 'printCards'>('spelling100');

  // ==========================
  // KG1 States
  // ==========================
  const [selectedLetterIdx, setSelectedLetterIdx] = useState<number>(0);
  const currentLetter = KG_LETTERS[selectedLetterIdx];

  // KG1 Game: Distinguish Letter
  const [distinguishTarget, setDistinguishTarget] = useState<LetterItem>(KG_LETTERS[0]);
  const [distinguishGrid, setDistinguishGrid] = useState<string[]>([]);
  const [distinguishFound, setDistinguishFound] = useState<number[]>([]);
  const [distinguishScore, setDistinguishScore] = useState<number>(0);

  // KG1 Game: Listen and Touch
  const [listenTarget, setListenTarget] = useState<LetterItem>(KG_LETTERS[0]);
  const [listenOptions, setListenOptions] = useState<LetterItem[]>([]);
  const [listenScore, setListenScore] = useState<number>(0);
  const [listenFeedback, setListenFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // ==========================
  // 100 Spelling Words State (KG1 & KG2)
  // ==========================
  const [wordFilter, setWordFilter] = useState<'all' | 'fatha' | 'kasra' | 'damma' | 'rubai'>('all');
  const [kg1Filter, setKg1Filter] = useState<'all' | 'fatha' | 'kasra' | 'damma' | 'rubai'>('all');
  const [kg1SearchQuery, setKg1SearchQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [activeSpellStep, setActiveSpellStep] = useState<number>(0); // 0: None, 1: char1, 2: char2, 3: char3, 4: char4, 5: full
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Filtered words for KG2
  const filteredWords = SPELLING_100_WORDS.filter((w) => {
    const matchesCategory = wordFilter === 'all' || w.category === wordFilter;
    const matchesSearch = 
      !searchQuery.trim() || 
      w.full.includes(searchQuery.trim()) || 
      w.meaning.includes(searchQuery.trim()) ||
      w.char1.includes(searchQuery.trim()) ||
      w.char2.includes(searchQuery.trim()) ||
      w.char3.includes(searchQuery.trim()) ||
      (w.char4 && w.char4.includes(searchQuery.trim()));
    return matchesCategory && matchesSearch;
  });

  // Filtered words for KG1 Beginner Spelling
  const kg1FilteredWords = SPELLING_100_WORDS.filter((w) => {
    const matchesCategory = kg1Filter === 'all' || w.category === kg1Filter;
    const matchesSearch = 
      !kg1SearchQuery.trim() || 
      w.full.includes(kg1SearchQuery.trim()) || 
      w.meaning.includes(kg1SearchQuery.trim()) ||
      w.char1.includes(kg1SearchQuery.trim()) ||
      w.char2.includes(kg1SearchQuery.trim()) ||
      w.char3.includes(kg1SearchQuery.trim()) ||
      (w.char4 && w.char4.includes(kg1SearchQuery.trim()));
    return matchesCategory && matchesSearch;
  });

  const activeSpellingWord: SpellingWord = filteredWords[currentWordIdx] || SPELLING_100_WORDS[0];

  // Word Builder State
  const [builderSlots, setBuilderSlots] = useState<(string | null)[]>([null, null, null]);
  const [builderOptions, setBuilderOptions] = useState<string[]>([]);
  const [builderFeedback, setBuilderFeedback] = useState<string | null>(null);

  // Speed Quiz State
  const [quizWord, setQuizWord] = useState<SpellingWord>(SPELLING_100_WORDS[0]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#0284c7');

  // Plane Game State
  const planeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [planeScore, setPlaneScore] = useState<number>(0);
  const [planeLives, setPlaneLives] = useState<number>(3);
  const [planeTarget, setPlaneTarget] = useState<string>('دَرَسَ');
  const [isPlaneRunning, setIsPlaneRunning] = useState<boolean>(false);

  // Audio Helper
  const speakText = (text: string) => {
    audioManager.speakArabic(text, 0.82);
  };

  // Setup Distinguish Game
  const generateDistinguishGame = (target: LetterItem) => {
    setDistinguishTarget(target);
    setDistinguishFound([]);
    const pool = KG_LETTERS.filter((l) => l.char !== target.char);
    const grid: string[] = [];
    // 4 target letters
    for (let i = 0; i < 4; i++) grid.push(target.char);
    // 8 distractors
    for (let i = 0; i < 8; i++) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      grid.push(rand.char);
    }
    // Shuffle
    grid.sort(() => Math.random() - 0.5);
    setDistinguishGrid(grid);
  };

  // Setup Listen Game
  const generateListenGame = () => {
    const target = KG_LETTERS[Math.floor(Math.random() * KG_LETTERS.length)];
    setListenTarget(target);
    const pool = KG_LETTERS.filter((l) => l.char !== target.char).sort(() => Math.random() - 0.5);
    const options = [target, pool[0], pool[1], pool[2]].sort(() => Math.random() - 0.5);
    setListenOptions(options);
    setListenFeedback(null);
    speakText(target.fatha);
  };

  // Setup Builder Game
  const initWordBuilder = (word: SpellingWord) => {
    const correctChars = [word.char1, word.char2, word.char3, word.char4].filter(Boolean) as string[];
    setBuilderSlots(new Array(correctChars.length).fill(null));
    setBuilderFeedback(null);
    const randomDistractors = ['مَـ', 'بَـ', 'سَـ', 'لَـ', 'رَ', 'فَـ', 'نَـ', 'تَـ'].filter(c => !correctChars.includes(c));
    const allOptions = [...correctChars, randomDistractors[0] || 'نَـ', randomDistractors[1] || 'تَـ'].sort(() => Math.random() - 0.5);
    setBuilderOptions(allOptions);
  };

  // Setup Speed Quiz
  const initSpeedQuiz = () => {
    const randomWord = SPELLING_100_WORDS[Math.floor(Math.random() * SPELLING_100_WORDS.length)];
    setQuizWord(randomWord);
    setQuizAnswered(false);
    setQuizFeedback(null);

    const distractors = SPELLING_100_WORDS.filter(w => w.id !== randomWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.full);

    const options = [randomWord.full, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
    speakText(randomWord.full);
  };

  useEffect(() => {
    generateDistinguishGame(KG_LETTERS[selectedLetterIdx]);
    generateListenGame();
    initWordBuilder(activeSpellingWord);
    initSpeedQuiz();
  }, []);

  // Update builder when active word changes
  useEffect(() => {
    if (activeSpellingWord) {
      initWordBuilder(activeSpellingWord);
    }
  }, [activeSpellingWord?.id]);

  // Canvas Handlers for Tracing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
  };

  // Step Spelling Audio handler
  const handlePlaySpellStep = (step: number) => {
    if (!activeSpellingWord) return;
    setActiveSpellStep(step);
    audioManager.playClick();
    if (step === 1) speakText(activeSpellingWord.char1);
    if (step === 2) speakText(activeSpellingWord.char2);
    if (step === 3) speakText(activeSpellingWord.char3);
    if (step === 4) {
      if (activeSpellingWord.char4) {
        speakText(activeSpellingWord.char4);
      } else {
        speakText(activeSpellingWord.full);
      }
    }
    if (step === 5) speakText(activeSpellingWord.full);
  };

  // Auto Full Blending (Sequential Step Player)
  const handlePlayFullBlending = async () => {
    if (!activeSpellingWord || isAutoPlaying) return;
    setIsAutoPlaying(true);

    // Step 1: Red Char
    setActiveSpellStep(1);
    await audioManager.speakArabic(activeSpellingWord.char1, 0.8);
    await new Promise((r) => setTimeout(r, 350));

    // Step 2: Blue Char
    setActiveSpellStep(2);
    await audioManager.speakArabic(activeSpellingWord.char2, 0.8);
    await new Promise((r) => setTimeout(r, 350));

    // Step 3: Green Char
    if (activeSpellingWord.char3) {
      setActiveSpellStep(3);
      await audioManager.speakArabic(activeSpellingWord.char3, 0.8);
      await new Promise((r) => setTimeout(r, 350));
    }

    // Step 4: Purple Char (for 4-letter words)
    if (activeSpellingWord.char4) {
      setActiveSpellStep(4);
      await audioManager.speakArabic(activeSpellingWord.char4, 0.8);
      await new Promise((r) => setTimeout(r, 350));
    }

    // Step 5 or 4: Complete Blended Word
    setActiveSpellStep(activeSpellingWord.char4 ? 5 : 4);
    await audioManager.speakArabic(activeSpellingWord.full, 0.75);
    audioManager.playCorrect();

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 }
    });

    setIsAutoPlaying(false);
  };

  // Pick Random Word
  const handlePickRandomWord = () => {
    audioManager.playClick();
    const randIdx = Math.floor(Math.random() * filteredWords.length);
    setCurrentWordIdx(randIdx);
    setActiveSpellStep(0);
    speakText(filteredWords[randIdx].full);
  };

  // Handle Builder Slot Click
  const handleSlotLetter = (char: string) => {
    audioManager.playClick();
    speakText(char);

    const firstEmpty = builderSlots.findIndex(s => s === null);
    if (firstEmpty === -1) return;

    const newSlots = [...builderSlots];
    newSlots[firstEmpty] = char;
    setBuilderSlots(newSlots);

    // If filled all slots, verify
    const expected = [activeSpellingWord.char1, activeSpellingWord.char2, activeSpellingWord.char3, activeSpellingWord.char4].filter(Boolean);
    const filledCount = newSlots.filter(Boolean).length;

    if (filledCount === expected.length) {
      const isCorrect = expected.every((c, i) => newSlots[i] === c);
      if (isCorrect) {
        audioManager.playCorrect();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setBuilderFeedback('🎉 أحسنت رائع! قمت بتركيب الكلمة بنجاح!');
        speakText(activeSpellingWord.full);
      } else {
        audioManager.playWrong();
        setBuilderFeedback('❌ حاول مجدداً يا بطل، انتبه لترتيب الحروف.');
      }
    }
  };

  // Reset Builder
  const handleResetBuilder = () => {
    audioManager.playClick();
    const expected = [activeSpellingWord.char1, activeSpellingWord.char2, activeSpellingWord.char3, activeSpellingWord.char4].filter(Boolean);
    setBuilderSlots(new Array(expected.length).fill(null));
    setBuilderFeedback(null);
  };

  // Handle Speed Quiz Choice
  const handleSpeedQuizChoice = (choice: string) => {
    if (quizAnswered) return;
    setQuizAnswered(true);

    if (choice === quizWord.full) {
      audioManager.playCorrect();
      setQuizScore(s => s + 1);
      setQuizFeedback({ isCorrect: true, text: `🎉 إجابة صحيحة وممتازة! الكلمة هي: ${quizWord.full} (${quizWord.meaning})` });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      audioManager.playWrong();
      setQuizFeedback({ isCorrect: false, text: `❌ الإجابة الصحيحة كانت: ${quizWord.full}` });
    }
  };

  // Handle Print 100 Words Sheet
  const handlePrintSheet = () => {
    window.print();
  };

  // Plane Game Loop (Interactive Canvas)
  useEffect(() => {
    if (kg2Tab !== 'planeGame' || !isPlaneRunning) return;

    const canvas = planeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let planeY = canvas.height / 2;
    let targetPlaneY = canvas.height / 2;

    const wordsPool = SPELLING_100_WORDS.map(w => w.full);
    const currentGoalWord = planeTarget || 'دَرَسَ';

    // Bubbles
    interface Bubble {
      x: number;
      y: number;
      text: string;
      speed: number;
      radius: number;
      isTarget: boolean;
    }

    const bubbles: Bubble[] = [];
    let spawnTimer = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetPlaneY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetPlaneY = e.touches[0].clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const render = () => {
      // Clear
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars in sky
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 47 + spawnTimer * 0.5) % canvas.width;
        const sy = (i * 29) % canvas.height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Smooth plane move
      planeY += (targetPlaneY - planeY) * 0.1;
      // Clamp
      if (planeY < 30) planeY = 30;
      if (planeY > canvas.height - 30) planeY = canvas.height - 30;

      // Draw Plane (Jet)
      ctx.save();
      ctx.translate(60, planeY);
      // Jet Body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(-25, -16);
      ctx.lineTo(-15, 0);
      ctx.lineTo(-25, 16);
      ctx.closePath();
      ctx.fill();

      // Wing
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-20, -22);
      ctx.lineTo(-5, -2);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(10, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Spawn Bubbles
      spawnTimer++;
      if (spawnTimer % 90 === 0) {
        const isTarget = Math.random() < 0.45;
        const text = isTarget 
          ? currentGoalWord 
          : wordsPool[Math.floor(Math.random() * wordsPool.length)];

        bubbles.push({
          x: canvas.width + 40,
          y: Math.random() * (canvas.height - 80) + 40,
          text,
          speed: 2 + Math.random() * 1.5,
          radius: 28,
          isTarget
        });
      }

      // Update Bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x -= b.speed;

        // Draw Bubble
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.isTarget ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = b.isTarget ? '#10b981' : '#38bdf8';
        ctx.stroke();

        // Draw Text inside bubble
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Alexandria", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.text, b.x, b.y);

        // Check Collision with Plane (at x=60, y=planeY)
        const dx = b.x - 60;
        const dy = b.y - planeY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < b.radius + 20) {
          // Collided
          if (b.isTarget) {
            audioManager.playCorrect();
            setPlaneScore((s) => s + 10);
            confetti({ particleCount: 20, spread: 45, origin: { x: 0.3, y: 0.5 } });
            // Pick a new target
            const newTarget = wordsPool[Math.floor(Math.random() * wordsPool.length)];
            setPlaneTarget(newTarget);
            speakText(newTarget);
          } else {
            audioManager.playWrong();
            setPlaneLives((l) => {
              if (l <= 1) {
                setIsPlaneRunning(false);
                return 0;
              }
              return l - 1;
            });
          }
          bubbles.splice(i, 1);
          continue;
        }

        // Out of screen
        if (b.x < -40) {
          bubbles.splice(i, 1);
        }
      }

      if (isPlaneRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [kg2Tab, isPlaneRunning, planeTarget]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
      {/* Top Kindergarten Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black mb-3 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>منهاج التأسيس والروضة (KG1 & KG2)</span>
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                🌟 بنك 100 كلمة تهجئة
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-alexandria tracking-tight">
              🌱 رَوْضَةُ لُغَتِي وَبَنْكُ الـ ١٠٠ كَلِمَةٍ لِلتَّهْجِئَةِ
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
              مسارات تعليمية تفاعلية للبراعم تشمل مخارج الحروف الـ ٢٨، الحركات القصيرة الثلاث، وبنكاً شاملاً يضم ١٠٠ كلمة ثلاثية ومدود ملونة مع التهجئة الصوتية الفورية والألعاب الذكية.
            </p>
          </div>

          {/* Stage Switcher: KG1 vs KG2 */}
          <div className="flex items-center bg-black/20 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md self-start md:self-auto shrink-0">
            <button
              id="kg-stage-btn-kg1"
              onClick={() => {
                setStage('kg1');
                audioManager.playClick();
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all duration-200 ${
                stage === 'kg1'
                  ? 'bg-white text-sky-900 shadow-lg scale-105'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <span className="text-xl">🌱</span>
              <div className="text-right">
                <div className="leading-tight">المسار الأول (KG1)</div>
                <div className="text-[10px] font-normal opacity-75">الحروف والأصوات وبراعم التهجئة</div>
              </div>
            </button>

            <button
              id="kg-stage-btn-kg2"
              onClick={() => {
                setStage('kg2');
                audioManager.playClick();
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all duration-200 ${
                stage === 'kg2'
                  ? 'bg-white text-emerald-900 shadow-lg scale-105'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <span className="text-xl">🌿</span>
              <div className="text-right">
                <div className="leading-tight">المسار الثاني (KG2)</div>
                <div className="text-[10px] font-normal opacity-75">بنك ١٠٠ كلمة والتهجئة الملونة</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KG1 SECTION: LETTERS, VOWELS, AND BEGINNER SPELLING WORDS                  */}
      {/* ========================================================================= */}
      {stage === 'kg1' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Sub-navigation for KG1 */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                id="kg1-tab-touch"
                onClick={() => setKg1Tab('touch')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'touch'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🔤</span>
                <span>المس الحرف وردد صوته</span>
              </button>

              <button
                id="kg1-tab-cards"
                onClick={() => setKg1Tab('cards')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'cards'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🖼️</span>
                <span>الحرف مع الصورة</span>
              </button>

              <button
                id="kg1-tab-beginnerSpelling"
                onClick={() => setKg1Tab('beginnerSpelling')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'beginnerSpelling'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🌟</span>
                <span>كلمات التهجئة الأولى (١٠٠ كلمة شاملة الرباعية)</span>
              </button>

              <button
                id="kg1-tab-match"
                onClick={() => setKg1Tab('match')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'match'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>👀</span>
                <span>ميّز الحرف (لعبة)</span>
              </button>

              <button
                id="kg1-tab-listen"
                onClick={() => setKg1Tab('listen')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'listen'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🎧</span>
                <span>اسمع والمس الحرف</span>
              </button>

              <button
                id="kg1-tab-tracing"
                onClick={() => setKg1Tab('tracing')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg1Tab === 'tracing'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>✍️</span>
                <span>تتبع الحرف على السطر</span>
              </button>
            </div>

            <div className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
              الحرف النشط: <span className="text-base text-sky-950 font-black">{currentLetter.char} ({currentLetter.name})</span>
            </div>
          </div>

          {/* VIEW 1: Touch & Repeat Letters */}
          {kg1Tab === 'touch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Letters Selector Grid */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base font-alexandria">
                    لوحة حروف الهجاء الـ ٢٨ للروضة
                  </h3>
                  <span className="text-xs font-bold text-slate-500">انقر للاستماع للصوت</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {KG_LETTERS.map((item, idx) => {
                    const isSelected = selectedLetterIdx === idx;
                    return (
                      <button
                        key={item.char}
                        id={`kg1-letter-btn-${item.char}`}
                        onClick={() => {
                          setSelectedLetterIdx(idx);
                          speakText(item.fatha);
                          audioManager.playClick();
                        }}
                        className={`h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-amiri text-2xl sm:text-3xl font-extrabold transition-all ${
                          isSelected
                            ? 'bg-sky-700 text-white shadow-md scale-105 ring-2 ring-sky-300'
                            : 'bg-slate-50 text-slate-800 hover:bg-sky-50 hover:text-sky-800 border border-slate-200'
                        }`}
                      >
                        <span>{item.char}</span>
                        <span className="text-[10px] font-sans font-bold opacity-75">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Big Letter Active Studio with 3 Vowels */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between text-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4">
                    <span>الحرف وصوته بالحركات القصيرة</span>
                  </div>

                  {/* Giant Letter Badge */}
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-amiri text-7xl font-extrabold shadow-lg shadow-sky-600/20 mx-auto my-2">
                    {currentLetter.char}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mt-2 font-alexandria">
                    حرف {currentLetter.name} ({currentLetter.char})
                  </h4>
                  <p className="text-xs text-slate-500 mb-6">
                    {currentLetter.emoji} {currentLetter.word} • {currentLetter.meaning}
                  </p>

                  {/* 3 Short Vowels Interactive Badges */}
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {/* Fatha */}
                    <button
                      onClick={() => speakText(currentLetter.fatha)}
                      className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 transition-all hover:scale-105 active:scale-95 text-center shadow-xs group"
                    >
                      <span className="text-2xl sm:text-3xl font-black font-amiri block text-amber-700 group-hover:scale-110 transition-transform">
                        {currentLetter.fatha}
                      </span>
                      <span className="text-[11px] font-bold block mt-1">الْفَتْحَة (ـَ)</span>
                    </button>

                    {/* Damma */}
                    <button
                      onClick={() => speakText(currentLetter.damma)}
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-900 transition-all hover:scale-105 active:scale-95 text-center shadow-xs group"
                    >
                      <span className="text-2xl sm:text-3xl font-black font-amiri block text-emerald-700 group-hover:scale-110 transition-transform">
                        {currentLetter.damma}
                      </span>
                      <span className="text-[11px] font-bold block mt-1">الضَّمَّة (ـُ)</span>
                    </button>

                    {/* Kasra */}
                    <button
                      onClick={() => speakText(currentLetter.kasra)}
                      className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-900 transition-all hover:scale-105 active:scale-95 text-center shadow-xs group"
                    >
                      <span className="text-2xl sm:text-3xl font-black font-amiri block text-rose-700 group-hover:scale-110 transition-transform">
                        {currentLetter.kasra}
                      </span>
                      <span className="text-[11px] font-bold block mt-1">الْكَسْرَة (ـِ)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const prevIdx = (selectedLetterIdx - 1 + KG_LETTERS.length) % KG_LETTERS.length;
                      setSelectedLetterIdx(prevIdx);
                      speakText(KG_LETTERS[prevIdx].fatha);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الحرف السابق</span>
                  </button>

                  <button
                    onClick={() => speakText(currentLetter.word)}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق الكلمة</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextIdx = (selectedLetterIdx + 1) % KG_LETTERS.length;
                      setSelectedLetterIdx(nextIdx);
                      speakText(KG_LETTERS[nextIdx].fatha);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <span>الحرف التالي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Visual Picture Cards */}
          {kg1Tab === 'cards' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {KG_LETTERS.map((item, idx) => (
                <div
                  key={item.char}
                  onClick={() => {
                    setSelectedLetterIdx(idx);
                    speakText(`${item.fatha}.. ${item.word}`);
                  }}
                  className="bg-white rounded-3xl p-4 border-2 border-slate-200 hover:border-sky-400 cursor-pointer text-center transition-all hover:scale-105 shadow-xs group"
                >
                  <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </div>
                  <div className="text-2xl font-black font-amiri text-sky-900 mb-1">
                    {item.fatha}
                  </div>
                  <div className="text-xs font-bold text-slate-700 font-alexandria">
                    {item.word}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 3: Beginner Spelling Words (100 Words with 4-Letter Support) */}
          {kg1Tab === 'beginnerSpelling' && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-sky-950 mb-1 font-alexandria">
                  🌟 كلمات التهجئة الأولى للبراعم (بنك الـ ١٠٠ كلمة شاملاً الكلمات الرباعية)
                </h3>
                <p className="text-xs sm:text-sm text-sky-800">
                  انقر على أي كلمة للاستماع لنطقها الصوتي المجزأ وتدريب الطفل على القراءة والتهجئة السريعة
                </p>
              </div>

              {/* Category Pills & Search Toolbar in KG1 */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setKg1Filter('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        kg1Filter === 'all'
                          ? 'bg-sky-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🌟 جميع الكلمات (١٠٠ كلمة)
                    </button>
                    <button
                      onClick={() => setKg1Filter('fatha')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        kg1Filter === 'fatha'
                          ? 'bg-rose-700 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      🔴 ثلاثي بالفتح (٣٠ كلمة)
                    </button>
                    <button
                      onClick={() => setKg1Filter('kasra')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        kg1Filter === 'kasra'
                          ? 'bg-sky-700 text-white shadow-sm'
                          : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                      }`}
                    >
                      🔵 حركة الكسر (١٥ كلمة)
                    </button>
                    <button
                      onClick={() => setKg1Filter('damma')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        kg1Filter === 'damma'
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      🟢 حركة الضم (١٥ كلمة)
                    </button>
                    <button
                      onClick={() => setKg1Filter('rubai')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        kg1Filter === 'rubai'
                          ? 'bg-purple-700 text-white shadow-sm'
                          : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                      }`}
                    >
                      🟣 كلمات رباعية ومقاطع ساكنة (٤٠ كلمة)
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="ابحث في كلمات التهجئة الأولى..."
                      value={kg1SearchQuery}
                      onChange={(e) => setKg1SearchQuery(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>
                    عرض <strong className="text-sky-700">{kg1FilteredWords.length}</strong> كلمة في هذا القسم
                  </span>
                  <span className="text-[11px] text-slate-400">
                    💡 انقر على البطاقة للاستماع للتهجئة الصوتية المجزأة الملونة
                  </span>
                </div>
              </div>

              {/* KG1 100 Words Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {kg1FilteredWords.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      if (w.char4) {
                        speakText(`${w.char1}.. ${w.char2}.. ${w.char3}.. ${w.char4}.. ${w.full}`);
                      } else {
                        speakText(`${w.char1}.. ${w.char2}.. ${w.char3}.. ${w.full}`);
                      }
                      audioManager.playClick();
                    }}
                    className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-sky-400 text-center transition-all hover:scale-105 shadow-xs hover:shadow-md group relative"
                  >
                    <div className="absolute top-3 left-3 text-[10px] font-bold text-slate-400">
                      #{w.id}
                    </div>
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">{w.emoji}</div>
                    <div className="text-2xl font-black text-slate-900 font-alexandria mb-1 flex items-center justify-center gap-0.5 flex-wrap">
                      <span className="text-rose-600">{w.char1}</span>
                      <span className="text-sky-600">{w.char2}</span>
                      <span className="text-emerald-600">{w.char3}</span>
                      {w.char4 && <span className="text-purple-600">{w.char4}</span>}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 mb-1">
                      {w.meaning}
                    </div>
                    <div className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block bg-sky-50 text-sky-800">
                      {w.categoryName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: Distinguish Letter Game */}
          {kg1Tab === 'match' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
                <Eye className="w-4 h-4" />
                <span>لعبة تمييز الحرف البصري</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-alexandria">
                ابحث عن حرف (<span className="text-sky-700">{distinguishTarget.char}</span>) والمس جميع مواضعه!
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                وجدت: <span className="font-bold text-emerald-600">{distinguishFound.length}</span> من 4 حروف هدف
              </p>

              {/* Grid of 12 letters */}
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
                {distinguishGrid.map((char, idx) => {
                  const isFound = distinguishFound.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (char === distinguishTarget.char) {
                          if (!distinguishFound.includes(idx)) {
                            const updated = [...distinguishFound, idx];
                            setDistinguishFound(updated);
                            audioManager.playCorrect();
                            speakText(char);
                            if (updated.length === 4) {
                              confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                              setDistinguishScore((s) => s + 1);
                            }
                          }
                        } else {
                          audioManager.playWrong();
                        }
                      }}
                      className={`h-16 rounded-2xl font-black text-2xl transition-all select-none ${
                        isFound
                          ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                          : 'bg-slate-100 hover:bg-sky-100 text-slate-800 active:scale-95 border border-slate-200'
                      }`}
                    >
                      {isFound ? '⭐' : char}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => generateDistinguishGame(distinguishTarget)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة اللعبة</span>
                </button>
                <button
                  onClick={() => {
                    const nextIdx = (selectedLetterIdx + 1) % KG_LETTERS.length;
                    setSelectedLetterIdx(nextIdx);
                    generateDistinguishGame(KG_LETTERS[nextIdx]);
                  }}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>الحرف التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: Listen and Touch */}
          {kg1Tab === 'listen' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <Volume2 className="w-4 h-4" />
                <span>لعبة اسمع والمس الحرف</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-alexandria">
                استمع لصوت الحرف والمس الخيار الصحيح
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                النقاط: <span className="font-bold text-emerald-700">{listenScore}</span> نجوم
              </p>

              {/* Big Repeat Button */}
              <button
                onClick={() => speakText(listenTarget.fatha)}
                className="w-20 h-20 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 mx-auto mb-8 transition-transform hover:scale-110 active:scale-95"
                title="أعد نطق الصوت"
              >
                <Volume2 className="w-9 h-9" />
              </button>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                {listenOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (opt.char === listenTarget.char) {
                        audioManager.playCorrect();
                        setListenScore((s) => s + 1);
                        setListenFeedback({ isCorrect: true, text: '🎉 رائع جداً! إجابة صحيحة' });
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                        setTimeout(generateListenGame, 1500);
                      } else {
                        audioManager.playWrong();
                        setListenFeedback({ isCorrect: false, text: '❌ حاول مرة أخرى يا بطل' });
                      }
                    }}
                    className="h-20 rounded-3xl bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 text-3xl font-black text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-xs"
                  >
                    {opt.fatha}
                  </button>
                ))}
              </div>

              {listenFeedback && (
                <div className={`p-3 rounded-2xl text-xs font-bold mb-4 ${
                  listenFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {listenFeedback.text}
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: Tracing */}
          {kg1Tab === 'tracing' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <h3 className="font-extrabold text-lg text-slate-900 font-alexandria">
                    كتابة وتتبع حرف ({currentLetter.char}) على السطر
                  </h3>
                  <p className="text-xs text-slate-500">
                    استخدم إصبعك أو الفأرة لرسم الحرف على السطور المدرسية
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {['#0284c7', '#16a34a', '#dc2626', '#eab308', '#9333ea'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPenColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${penColor === c ? 'border-slate-800 scale-110' : 'border-white'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Drawing Box */}
              <div className="relative border-2 border-dashed border-sky-300 rounded-3xl overflow-hidden bg-slate-50 mb-4 touch-none">
                <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-slate-200/80 pointer-events-none select-none font-alexandria">
                  {currentLetter.char}
                </div>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={240}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-60 block cursor-crosshair"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>مسح السطر</span>
                </button>
                <button
                  onClick={() => {
                    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
                    audioManager.playCorrect();
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ممتاز! خط رائع</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* KG2 SECTION: 100 SPELLING WORDS SUITE                                     */}
      {/* ========================================================================= */}
      {stage === 'kg2' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Sub-navigation for KG2 */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                id="kg2-tab-spelling100"
                onClick={() => setKg2Tab('spelling100')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'spelling100'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>💯</span>
                <span>بنك الـ ١٠٠ كلمة للتهجئة</span>
              </button>

              <button
                id="kg2-tab-player"
                onClick={() => setKg2Tab('player')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'player'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🔤</span>
                <span>استوديو التهجئة الصوتية الملونة</span>
              </button>

              <button
                id="kg2-tab-builder"
                onClick={() => setKg2Tab('builder')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'builder'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🧩</span>
                <span>لوحة تركيب الكلمة</span>
              </button>

              <button
                id="kg2-tab-speedQuiz"
                onClick={() => {
                  setKg2Tab('speedQuiz');
                  initSpeedQuiz();
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'speedQuiz'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>⚡</span>
                <span>تحدي التهجئة السريعة</span>
              </button>

              <button
                id="kg2-tab-plane"
                onClick={() => {
                  setKg2Tab('planeGame');
                  setIsPlaneRunning(true);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'planeGame'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>✈️</span>
                <span>طائرة صيد الكلمات</span>
              </button>

              <button
                id="kg2-tab-print"
                onClick={() => setKg2Tab('printCards')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  kg2Tab === 'printCards'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🖨️</span>
                <span>طباعة بطاقات الـ ١٠٠ كلمة</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePickRandomWord}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-700" />
                <span>🎲 كلمة عشوائية</span>
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* VIEW 1: 100 SPELLING WORDS BANK & FILTER */}
          {/* ========================================== */}
          {kg2Tab === 'spelling100' && (
            <div className="space-y-6">
              {/* Category Pills & Search Toolbar */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setWordFilter('all');
                        setCurrentWordIdx(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        wordFilter === 'all'
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🌟 جميع الكلمات (١٠٠ كلمة)
                    </button>
                    <button
                      onClick={() => {
                        setWordFilter('fatha');
                        setCurrentWordIdx(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        wordFilter === 'fatha'
                          ? 'bg-rose-700 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      🔴 ثلاثي بالفتح (٣٠ كلمة)
                    </button>
                    <button
                      onClick={() => {
                        setWordFilter('kasra');
                        setCurrentWordIdx(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        wordFilter === 'kasra'
                          ? 'bg-sky-700 text-white shadow-sm'
                          : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                      }`}
                    >
                      🔵 حركة الكسر (١٥ كلمة)
                    </button>
                    <button
                      onClick={() => {
                        setWordFilter('damma');
                        setCurrentWordIdx(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        wordFilter === 'damma'
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      🟢 حركة الضم (١٥ كلمة)
                    </button>
                    <button
                      onClick={() => {
                        setWordFilter('rubai');
                        setCurrentWordIdx(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        wordFilter === 'rubai'
                          ? 'bg-purple-700 text-white shadow-sm'
                          : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                      }`}
                    >
                      🟣 كلمات رباعية ومقاطع ساكنة (٤٠ كلمة)
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="ابحث في الـ ١٠٠ كلمة..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentWordIdx(0);
                      }}
                      className="w-full pl-3 pr-9 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>
                    عرض <strong className="text-emerald-700">{filteredWords.length}</strong> كلمة في هذا القسم
                  </span>
                  <span className="text-[11px] text-slate-400">
                    💡 انقر على أي كلمة لفتح التهجئة الصوتية الفورية
                  </span>
                </div>
              </div>

              {/* 100 Words Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredWords.map((w, idx) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      setCurrentWordIdx(idx);
                      setKg2Tab('player');
                      speakText(w.full);
                    }}
                    className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-500 text-center cursor-pointer transition-all hover:scale-105 hover:shadow-md group relative"
                  >
                    <div className="absolute top-3 left-3 text-[10px] font-bold text-slate-400">
                      #{w.id}
                    </div>
                    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                      {w.emoji}
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-alexandria mb-1 flex items-center justify-center gap-0.5 flex-wrap">
                      <span className="text-rose-600">{w.char1}</span>
                      <span className="text-sky-600">{w.char2}</span>
                      <span className="text-emerald-600">{w.char3}</span>
                      {w.char4 && <span className="text-purple-600">{w.char4}</span>}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 mb-1">
                      {w.meaning}
                    </div>
                    <div className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-800">
                      {w.categoryName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW 2: INTERACTIVE PHONICS STUDIO PLAYER */}
          {/* ========================================== */}
          {kg2Tab === 'player' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Carousel Picker with 100 Words */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-700">
                    اختر الكلمة من بنك الـ ١٠٠:
                  </span>
                  <span className="text-xs text-slate-400">
                    كلمة {currentWordIdx + 1} من {filteredWords.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {filteredWords.map((w, idx) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setCurrentWordIdx(idx);
                        setActiveSpellStep(0);
                        speakText(w.full);
                      }}
                      className={`px-3.5 py-2 rounded-2xl shrink-0 font-bold text-xs flex items-center gap-1.5 transition-all ${
                        currentWordIdx === idx
                          ? 'bg-emerald-700 text-white shadow-md scale-105'
                          : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                      }`}
                    >
                      <span>{w.emoji}</span>
                      <span className="font-alexandria">{w.full}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Phonics Player Display */}
              <div className="bg-white p-8 rounded-3xl border-2 border-emerald-300 shadow-lg text-center">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>التهجئة الصوتية الملونة • {activeSpellingWord.categoryName}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    بطاقة رقم #{activeSpellingWord.id}
                  </span>
                </div>

                {/* Big Color Letters Display */}
                <div className="my-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3 sm:gap-5 text-5xl sm:text-6xl font-black font-alexandria select-none flex-wrap">
                  {/* Char 1 (Red) */}
                  <span
                    onClick={() => handlePlaySpellStep(1)}
                    className={`cursor-pointer transition-transform hover:scale-110 ${
                      activeSpellStep === 1 ? 'scale-125 text-rose-600 drop-shadow-md' : 'text-rose-500'
                    }`}
                    title="الحرف الأول (أحمر)"
                  >
                    {activeSpellingWord.char1}
                  </span>

                  <span className="text-slate-300 text-2xl font-light">-</span>

                  {/* Char 2 (Blue) */}
                  <span
                    onClick={() => handlePlaySpellStep(2)}
                    className={`cursor-pointer transition-transform hover:scale-110 ${
                      activeSpellStep === 2 ? 'scale-125 text-sky-600 drop-shadow-md' : 'text-sky-500'
                    }`}
                    title="الحرف الثاني (أزرق)"
                  >
                    {activeSpellingWord.char2}
                  </span>

                  {activeSpellingWord.char3 && (
                    <>
                      <span className="text-slate-300 text-2xl font-light">-</span>
                      {/* Char 3 (Green) */}
                      <span
                        onClick={() => handlePlaySpellStep(3)}
                        className={`cursor-pointer transition-transform hover:scale-110 ${
                          activeSpellStep === 3 ? 'scale-125 text-emerald-600 drop-shadow-md' : 'text-emerald-500'
                        }`}
                        title="الحرف الثالث (أخضر)"
                      >
                        {activeSpellingWord.char3}
                      </span>
                    </>
                  )}

                  {activeSpellingWord.char4 && (
                    <>
                      <span className="text-slate-300 text-2xl font-light">-</span>
                      {/* Char 4 (Purple) */}
                      <span
                        onClick={() => handlePlaySpellStep(4)}
                        className={`cursor-pointer transition-transform hover:scale-110 ${
                          activeSpellStep === 4 ? 'scale-125 text-purple-600 drop-shadow-md' : 'text-purple-500'
                        }`}
                        title="الحرف الرابع (بنفسجي)"
                      >
                        {activeSpellingWord.char4}
                      </span>
                    </>
                  )}
                </div>

                {/* Blended Result Word */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl">{activeSpellingWord.emoji}</span>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-alexandria tracking-wide">
                    {activeSpellingWord.full}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 font-bold mb-2">
                  المعنى: {activeSpellingWord.meaning}
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 max-w-md mx-auto mb-6">
                  مثال في جملة: «{activeSpellingWord.sentence}»
                </div>

                {/* Step Pronunciation Buttons */}
                <div className={`grid grid-cols-2 ${activeSpellingWord.char4 ? 'sm:grid-cols-5' : 'sm:grid-cols-4'} gap-2.5 max-w-xl mx-auto mb-6`}>
                  <button
                    onClick={() => handlePlaySpellStep(1)}
                    className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-rose-600" />
                    <span>١. ({activeSpellingWord.char1})</span>
                  </button>
                  <button
                    onClick={() => handlePlaySpellStep(2)}
                    className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>٢. ({activeSpellingWord.char2})</span>
                  </button>
                  {activeSpellingWord.char3 && (
                    <button
                      onClick={() => handlePlaySpellStep(3)}
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>٣. ({activeSpellingWord.char3})</span>
                    </button>
                  )}
                  {activeSpellingWord.char4 && (
                    <button
                      onClick={() => handlePlaySpellStep(4)}
                      className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Volume2 className="w-4 h-4 text-purple-600" />
                      <span>٤. ({activeSpellingWord.char4})</span>
                    </button>
                  )}
                  <button
                    onClick={() => handlePlaySpellStep(activeSpellingWord.char4 ? 5 : 4)}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 col-span-2 sm:col-span-1"
                  >
                    <Volume2 className="w-4 h-4 text-amber-600" />
                    <span>{activeSpellingWord.char4 ? '٥. دمج' : '٤. دمج'}</span>
                  </button>
                </div>

                {/* Full Automatic Sequential Blending */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePlayFullBlending}
                    disabled={isAutoPlaying}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-black text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{isAutoPlaying ? 'جاري تشغيل التهجئة المتسلسلة...' : 'تشغيل التهجئة الصوتية المتسلسلة'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = (currentWordIdx + 1) % filteredWords.length;
                      setCurrentWordIdx(next);
                      speakText(filteredWords[next].full);
                    }}
                    className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1"
                    title="الكلمة التالية"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW 3: INTERACTIVE WORD BUILDER           */}
          {/* ========================================== */}
          {kg2Tab === 'builder' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>لوحة تركيب الكلمات من الحروف</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{activeSpellingWord.emoji}</span>
                <div className="text-right">
                  <h3 className="text-xl font-black text-slate-900 font-alexandria">
                    ركّب كلمة: <span className="text-emerald-700">({activeSpellingWord.meaning})</span>
                  </h3>
                  <p className="text-xs text-slate-500">اختر الحروف بالترتيب الصحيح لملء المربعات الثلاثة</p>
                </div>
              </div>

              {/* Dynamic Slots for 3 or 4 letters */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 my-6 flex-wrap">
                {builderSlots.map((slot, sIdx) => {
                  const colorClasses = [
                    'border-rose-400 bg-rose-50 text-rose-700',
                    'border-sky-400 bg-sky-50 text-sky-700',
                    'border-emerald-400 bg-emerald-50 text-emerald-700',
                    'border-purple-400 bg-purple-50 text-purple-700'
                  ];
                  return (
                    <div
                      key={sIdx}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-dashed flex items-center justify-center text-2xl sm:text-3xl font-black font-alexandria shadow-xs ${
                        colorClasses[sIdx % colorClasses.length]
                      }`}
                    >
                      {slot || '؟'}
                    </div>
                  );
                })}
              </div>

              {/* Scrambled Character Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {builderOptions.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlotLetter(char)}
                    className="w-16 h-16 rounded-2xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border-2 border-slate-300 text-2xl font-black font-amiri text-slate-800 transition-all hover:scale-110 active:scale-95 shadow-xs"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {builderFeedback && (
                <div className="p-3 rounded-2xl text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300">
                  {builderFeedback}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetBuilder}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>

                <button
                  onClick={() => {
                    const next = (currentWordIdx + 1) % filteredWords.length;
                    setCurrentWordIdx(next);
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>كلمة جديدة</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW 4: SPEED SPELLING CHALLENGE QUIZ     */}
          {/* ========================================== */}
          {kg2Tab === 'speedQuiz' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>تحدي التهجئة السريعة (بنك الـ ١٠٠ كلمة)</span>
                </div>
                <div className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  النقاط: {quizScore} 🌟
                </div>
              </div>

              <div className="my-4">
                <div className="text-5xl mb-3">{quizWord.emoji}</div>
                <h3 className="text-xl font-black text-slate-900 font-alexandria mb-1">
                  استمع جيداً واختر الكلمة المطابقة:
                </h3>
                <p className="text-xs text-slate-500">
                  المعنى: {quizWord.meaning}
                </p>
              </div>

              {/* Big Repeat Voice Button */}
              <button
                onClick={() => speakText(quizWord.full)}
                className="w-18 h-18 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mx-auto transition-transform hover:scale-110 active:scale-95"
                title="استمع للكلمة"
              >
                <Volume2 className="w-8 h-8" />
              </button>

              {/* 4 Word Choices */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quizOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpeedQuizChoice(opt)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-500 text-2xl font-black text-slate-900 font-alexandria transition-all hover:scale-105 active:scale-95 shadow-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizFeedback && (
                <div className={`p-3 rounded-2xl text-xs font-bold ${
                  quizFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {quizFeedback.text}
                </div>
              )}

              <button
                onClick={initSpeedQuiz}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW 5: AIRPLANE WORD CATCHER GAME        */}
          {/* ========================================== */}
          {kg2Tab === 'planeGame' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <h3 className="font-black text-lg text-slate-900 font-alexandria flex items-center gap-2">
                    <span>✈️ طائرة صيد الكلمات من بنك الـ ١٠٠</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">تفاعلية</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    حرّك الطائرة للأعلى والأسفل لاصطياد كلمة الهدف: <span className="font-black text-emerald-700 text-sm">({planeTarget})</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>{planeScore} نقطة</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{planeLives} أرواح</span>
                  </div>
                </div>
              </div>

              {/* Game Canvas Box */}
              <div className="relative rounded-3xl overflow-hidden shadow-inner border-2 border-sky-400 mb-4 bg-sky-950">
                <canvas
                  ref={planeCanvasRef}
                  width={720}
                  height={320}
                  className="w-full h-80 block cursor-ns-resize touch-none"
                />
                {!isPlaneRunning && (
                  <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-white p-6">
                    <Plane className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                    <h4 className="text-xl font-black mb-1">طائرة صيد الكلمات</h4>
                    <p className="text-xs text-slate-300 mb-4 max-w-sm">
                      وجّه طائرتك نحو فقاعة الكلمة المطلوبة بدقة وتفادَ الكلمات المشتتة لتبقى محلقاً!
                    </p>
                    <button
                      onClick={() => {
                        setIsPlaneRunning(true);
                        setPlaneScore(0);
                        setPlaneLives(3);
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg"
                    >
                      ابدأ الطيران السريع 🚀
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>تلميح: مرر إصبعك أو الفأرة عمودياً لتوجيه الطائرة</span>
                <button
                  onClick={() => speakText(planeTarget)}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>اسمع كلمة الهدف ({planeTarget})</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW 6: PRINTABLE 100-WORD FLASHCARDS      */}
          {/* ========================================== */}
          {kg2Tab === 'printCards' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-alexandria flex items-center gap-2">
                    <Printer className="w-5 h-5 text-emerald-600" />
                    <span>بطاقات تدريب وقراءة الـ ١٠٠ كلمة للطباعة المنزلية والمدرسية</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    جاهزة للطباعة والقص واستخدامها في الفصل المنزلي أو المدرسي
                  </p>
                </div>
                <button
                  onClick={handlePrintSheet}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الآن (Print)</span>
                </button>
              </div>

              {/* Printable Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-white rounded-3xl border border-slate-200">
                {SPELLING_100_WORDS.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-2xl border border-slate-300 text-center space-y-1"
                  >
                    <div className="text-xs text-slate-400 font-bold">#{w.id}</div>
                    <div className="text-2xl">{w.emoji}</div>
                    <div className="text-xl font-black text-slate-900 font-alexandria">
                      {w.full}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {w.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
