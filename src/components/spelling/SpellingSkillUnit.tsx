import React, { useState, useEffect, useMemo } from 'react';
import { 
  SpellingSkillId, 
  SpellingSubSkill, 
  SkillDifficulty, 
  SpellingSkillBankItem, 
  getSpellingItemsBySkill 
} from '../../data/spellingSkillsData';
import { 
  recordSkillAttempt, 
  addSpellingBadge,
  getSpellingSkillsProfile
} from '../../utils/spellingAdaptiveReview';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Trophy, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  Layers, 
  Check, 
  Edit3, 
  Compass, 
  Play, 
  Eye,
  Zap,
  Target,
  RefreshCw,
  Search,
  Train,
  ShoppingBasket
} from 'lucide-react';

interface SpellingSkillUnitProps {
  skillId: SpellingSkillId;
  studentName?: string;
  onAddStars: (count: number) => void;
  onBackToStudio: () => void;
  onOpenWordBank?: () => void;
}

export const SpellingSkillUnit: React.FC<SpellingSkillUnitProps> = ({
  skillId,
  studentName = 'بطل لغتي',
  onAddStars,
  onBackToStudio,
  onOpenWordBank
}) => {
  // Load skill items
  const skillItems = useMemo(() => getSpellingItemsBySkill(skillId), [skillId]);

  // Selected sub-game / tab
  const [activeGame, setActiveGame] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<SkillDifficulty>('easy');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect?: boolean; msg: string } | null>(null);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  // Input states for writing/dictation
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [balloonPopped, setBalloonPopped] = useState<Record<number, boolean>>({});

  // Sorting baskets state
  const [basketState, setBasketState] = useState<{
    placedItems: Record<string, string>; // itemId -> basketKey
    correctCount: number;
    currentSortingIndex: number;
  }>({
    placedItems: {},
    correctCount: 0,
    currentSortingIndex: 0
  });

  // Hunter Game state (for middle hamza)
  const [huntedIds, setHuntedIds] = useState<Record<string, boolean>>({});

  // Word Family state (for singular/dual/plural)
  const [familyMatched, setFamilyMatched] = useState<Record<string, boolean>>({});

  // Rule why written state
  const [selectedWhy, setSelectedWhy] = useState<string | null>(null);

  const currentItem: SpellingSkillBankItem = skillItems[currentIndex % skillItems.length] || skillItems[0];

  // Auto adapt difficulty based on user profile
  useEffect(() => {
    const profile = getSpellingSkillsProfile();
    let subSkillKey: SpellingSubSkill = 'taaMarbuta';
    if (skillId === 'middle_hamza') subSkillKey = 'middleHamza';
    else if (skillId === 'final_hamza') subSkillKey = 'finalHamza';
    else if (skillId === 'singular_dual_plural') subSkillKey = 'dual';

    const stat = profile.subSkillStats[subSkillKey];
    if (stat) {
      if (stat.mastery >= 90) setDifficulty('hard');
      else if (stat.mastery >= 70) setDifficulty('medium');
      else setDifficulty('easy');
    }
  }, [skillId]);

  // Reset round state on game or index switch
  useEffect(() => {
    setFeedback(null);
    setAttempts(0);
    setTypedAnswer('');
    setBalloonPopped({});
    setSelectedWhy(null);
  }, [activeGame, currentIndex, skillId]);

  // Reset basket game state when switching to game
  useEffect(() => {
    setBasketState({
      placedItems: {},
      correctCount: 0,
      currentSortingIndex: 0
    });
    setHuntedIds({});
    setFamilyMatched({});
  }, [activeGame, skillId]);

  // Skill metadata
  const skillMeta = useMemo(() => {
    switch (skillId) {
      case 'taa_types':
        return {
          title: 'التاء المربوطة والتاء المفتوحة (ة / ت)',
          badge: '🏅 بطل التاء',
          color: 'from-amber-500 via-orange-500 to-rose-500',
          borderColor: 'border-amber-400',
          games: [
            { id: 0, title: 'اختر الصحيح', icon: '🎯', desc: 'إكمال الكلمة بالتاء المناسبة' },
            { id: 1, title: 'صنف الكلمات', icon: '🧺', desc: 'سلتان: تاء مربوطة وتاء مفتوحة' },
            { id: 2, title: 'فرقع الصحيح', icon: '🎈', desc: 'فرقع بالون التاء المطلوبة' },
            { id: 3, title: 'أصلح الكلمة', icon: '🔨', desc: 'اكتشاف وتصحيح الخطأ الإملائي' },
            { id: 4, title: 'اسمع واكتب', icon: '🎧', desc: 'إملاء متدرج: كلمة -> جملة' }
          ]
        };
      case 'middle_hamza':
        return {
          title: 'الهمزة المتوسطة (أ / ؤ / ئ / ء)',
          badge: '⚡ بطل الهمزة المتوسطة',
          color: 'from-blue-600 via-indigo-600 to-purple-600',
          borderColor: 'border-blue-400',
          games: [
            { id: 0, title: 'كرسي الهمزة', icon: '🪑', desc: 'تحديد الكرسي المناسب للهمزة' },
            { id: 1, title: 'أكمل الكلمة', icon: '🧩', desc: 'تركيب الهمزة في موضعها الصحيح' },
            { id: 2, title: 'صائد الهمزة', icon: '🔍', desc: 'صيد كلمات الهمزة المتوسطة' },
            { id: 3, title: 'صنف الكلمات', icon: '🧺', desc: 'تصنيف الكلمات حسب كرسي الهمزة' },
            { id: 4, title: 'لماذا كُتِبَتْ هكذا؟', icon: '🧠', desc: 'تطبيق قاعدة أقوى الحركات' },
            { id: 5, title: 'إملاء الهمزة', icon: '🎧', desc: 'استماع وكتابة الكلمة والجملة' }
          ]
        };
      case 'final_hamza':
        return {
          title: 'الهمزة المتطرفة (أ / ؤ / ئ / ء)',
          badge: '🏝️ صائد الهمزة المتطرفة',
          color: 'from-teal-600 via-emerald-600 to-cyan-600',
          borderColor: 'border-teal-400',
          games: [
            { id: 0, title: 'اختر النهاية', icon: '🎯', desc: 'اختيار الهمزة المناسبة لآخر الكلمة' },
            { id: 1, title: 'أين تجلس الهمزة؟', icon: '🪑', desc: 'تطبيق قاعدة حركة الحرف السابق' },
            { id: 2, title: 'صنف الكلمات', icon: '🧺', desc: 'تصنيف حسب شكل الهمزة في نهايتها' },
            { id: 3, title: 'أصلح الخطأ', icon: '🔨', desc: 'تصحيح الخطأ الإملائي في الهمزة' },
            { id: 4, title: 'اسمع واكتب', icon: '🎧', desc: 'إملاء كلمات وجمل متطرفة' }
          ]
        };
      case 'singular_dual_plural':
        return {
          title: 'المفرد والمثنى والجمع (👤👥)',
          badge: '👑 حكيم العدد والإملاء',
          color: 'from-purple-600 via-pink-600 to-rose-600',
          borderColor: 'border-purple-400',
          games: [
            { id: 0, title: 'عدّ واختر', icon: '👀', desc: 'المفهوم البصري: تفاحة / تفاحتان / تفاحات' },
            { id: 1, title: 'قطار الكلمات', icon: '🚂', desc: 'ثلاث عربات: مفرد | مثنى | جمع' },
            { id: 2, title: 'أكمل العائلة', icon: '🧩', desc: 'كتاب -> كتابان -> [ ؟ ]' },
            { id: 3, title: 'حوّل الكلمة', icon: '🔄', desc: 'تحويل المفرد إلى مثنى وجمع' },
            { id: 4, title: 'فرقع المثنى', icon: '🎈', desc: 'فرقع الكلمات المثناة فقط' },
            { id: 5, title: 'عائلة الكلمة', icon: '🏠', desc: 'ربط المعلم بالمعلمان والمعلمون' },
            { id: 6, title: 'اكتب التحويل', icon: '✍️', desc: 'المرحلة الإملائية الكتابية الفعلية' }
          ]
        };
    }
  }, [skillId]);

  // Handle Play Audio
  const handlePlayAudio = (text: string) => {
    audioManager.speakArabic(text, 0.85);
  };

  // Check Answer Handler for Multiple Choices & Missing Fill
  const handleSelectAnswer = (choice: string) => {
    const isCorrect = choice.trim().toLowerCase() === currentItem.correctAnswer.trim().toLowerCase();
    recordSkillAttempt(
      currentItem.subSkill,
      isCorrect,
      currentItem.word,
      currentItem.tashkeel,
      currentItem.skill,
      isCorrect ? undefined : `اختار ${choice} بدلاً من ${currentItem.correctAnswer}`
    );

    if (isCorrect) {
      audioManager.play('correct');
      setFeedback({ isCorrect: true, msg: 'أحسنت يا بطل! إجابة صحيحة وممتازة 🌟' });
      setStarsEarned((s) => s + 1);
      onAddStars(1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 1400);
    } else {
      audioManager.play('wrong');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setFeedback({ 
          isCorrect: false, 
          msg: `اقتربت! تلميح: ${currentItem.explanation}` 
        });
      } else {
        setFeedback({ 
          isCorrect: false, 
          msg: 'حاول مرة أخرى 🌟 استمع جيداً للنطق!' 
        });
      }
    }
  };

  // Handle Sorting Basket Click / Drag
  const handleSortIntoBasket = (basketKey: string, expectedAnswer: string) => {
    const activeSortingItem = skillItems[basketState.currentSortingIndex % skillItems.length];
    if (!activeSortingItem) return;

    let isMatch = false;
    if (skillId === 'taa_types') {
      isMatch = activeSortingItem.correctAnswer === basketKey;
    } else if (skillId === 'singular_dual_plural') {
      isMatch = activeSortingItem.correctAnswer === basketKey;
    } else {
      // Middle or final hamza chair
      isMatch = activeSortingItem.hamzaChair === basketKey || activeSortingItem.correctAnswer === basketKey;
    }

    recordSkillAttempt(
      activeSortingItem.subSkill,
      isMatch,
      activeSortingItem.word,
      activeSortingItem.tashkeel,
      activeSortingItem.skill,
      isMatch ? undefined : `صنف ${activeSortingItem.word} في ${basketKey}`
    );

    if (isMatch) {
      audioManager.play('correct');
      onAddStars(1);
      setStarsEarned((s) => s + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        msg: `ممتاز! وضعت (${activeSortingItem.tashkeel}) في المكان الصحيح (${basketKey}) 🧺⭐`
      });

      setBasketState((prev) => ({
        placedItems: { ...prev.placedItems, [activeSortingItem.id]: basketKey },
        correctCount: prev.correctCount + 1,
        currentSortingIndex: prev.currentSortingIndex + 1
      }));
    } else {
      audioManager.play('wrong');
      setFeedback({
        isCorrect: false,
        msg: `انتبه يا بطل! الكلمة (${activeSortingItem.tashkeel}) لا تنتمي لسلة (${basketKey}). راجع القاعدة 💡`
      });
    }
  };

  // Handle Hunt Hamza Click
  const handleHuntWord = (item: SpellingSkillBankItem) => {
    const hasMiddleHamza = item.skill === 'middle_hamza';
    if (hasMiddleHamza) {
      audioManager.play('correct');
      setHuntedIds((prev) => ({ ...prev, [item.id]: true }));
      onAddStars(1);
      setStarsEarned((s) => s + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setFeedback({ isCorrect: true, msg: `صيد رائع! كلمة (${item.tashkeel}) تحتوي على همزة متوسطة 🎯` });
    } else {
      audioManager.play('wrong');
      setFeedback({ isCorrect: false, msg: `هذه الكلمة (${item.tashkeel}) لا تحتوي على همزة متوسطة، حاول ثانية!` });
    }
  };

  // Handle Balloon Popping Game
  const handleBalloonClick = (item: SpellingSkillBankItem, idx: number) => {
    setBalloonPopped((prev) => ({ ...prev, [idx]: true }));
    audioManager.play('click');

    let isTarget = false;
    if (skillId === 'taa_types') {
      isTarget = item.subSkill === 'taaMarbuta'; // target taa marbuta
    } else if (skillId === 'singular_dual_plural') {
      isTarget = item.subSkill === 'dual'; // target dual
    } else {
      isTarget = item.hamzaChair === 'أ' || item.hamzaChair === 'ئ';
    }

    if (isTarget) {
      audioManager.play('correct');
      onAddStars(1);
      setStarsEarned((s) => s + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setFeedback({ isCorrect: true, msg: `فرقعة صحيحة! كلمة (${item.tashkeel}) مطابقة للمطلوب 🎈` });
    } else {
      audioManager.play('wrong');
      setFeedback({ isCorrect: false, msg: `هذه الكلمة (${item.tashkeel}) ليست هي المطلوبة، ابحث عن غيرها! 🌟` });
    }
  };

  // Handle Typing Answer (For Dictation & Actual Writing Stages)
  const handleSubmitTypedAnswer = (e: React.FormEvent, targetWordOverride?: string) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;

    const targetToCheck = targetWordOverride || currentItem.word;
    const cleanStudent = typedAnswer.trim().replace(/[ًٌٍَُِّْـ]/g, '');
    const cleanTarget = targetToCheck.trim().replace(/[ًٌٍَُِّْـ]/g, '');

    // Normalize comparison forgivingly
    const isMatch = cleanStudent === cleanTarget;
    recordSkillAttempt(
      currentItem.subSkill,
      isMatch,
      targetToCheck,
      currentItem.tashkeel,
      currentItem.skill,
      isMatch ? undefined : `كتب: ${typedAnswer} بدلاً من ${targetToCheck}`
    );

    if (isMatch) {
      audioManager.play('correct');
      setFeedback({ isCorrect: true, msg: `رائع جداً! كتبت الكلمة (${targetToCheck}) بإتقان إملائي تام ✍️⭐` });
      setStarsEarned((s) => s + 2);
      onAddStars(2);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });

      if (starsEarned + 2 >= 10) {
        addSpellingBadge(skillMeta.badge);
      }

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setTypedAnswer('');
      }, 1800);
    } else {
      audioManager.play('wrong');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setFeedback({
        isCorrect: false,
        msg: newAttempts >= 2
          ? `تلميح إملائي: الكلمة تبدأ بـ (${cleanTarget.slice(0, 2)}...). راجع الحروف واكتبها بهدوء 🔊`
          : 'اقتربت! استمع للنطق مرة أخرى وحاول كتابتها بهدوء 🔊'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-cairo">
      {/* Top Banner with visual identity matching Spelling Champions Studio */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${skillMeta.color} text-white shadow-xl relative overflow-hidden border-2 border-white/20`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white border border-white/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>مسار الإملاء والظواهر الكتابية 🎯</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-slate-900 shadow-xs">
                {skillMeta.badge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
              {skillMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-bold mt-1 max-w-2xl leading-relaxed">
              تدرج شامل: التعرف البصري ← التصنيف ← إكمال الكلمة ← كتابة الكلمة ← إملاء الكلمة ثم إملاء داخل جملة.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
            <div className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-amber-200 font-black text-xs flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{starsEarned} نجوم مكتسبة</span>
            </div>

            {onOpenWordBank && (
              <button
                onClick={onOpenWordBank}
                className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="فتح بنك الكلمات"
              >
                <span>📚 بنك الكلمات</span>
              </button>
            )}

            <button
              onClick={onBackToStudio}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لنصوص الإملاء</span>
            </button>
          </div>
        </div>

        {/* 3 Difficulty Levels Switcher with Adaptive indicators */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs font-bold relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span>مستوى الصعوبة والتدرج:</span>
            <div className="bg-black/20 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  difficulty === 'easy' ? 'bg-emerald-400 text-slate-950 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                🟢 سهل (صور وتلميحات)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  difficulty === 'medium' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                🟡 متوسط (إكمال وتصنيف)
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  difficulty === 'hard' ? 'bg-rose-500 text-white shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                🔴 متقدم (كتابة وإملاء بدون خيارات)
              </button>
            </div>
          </div>

          <button
            onClick={() => handlePlayAudio(currentItem.explanation)}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition flex items-center gap-1.5 text-xs cursor-pointer"
            title="استمع للقاعدة الإملائية"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع للقاعدة</span>
          </button>
        </div>
      </div>

      {/* Internal Sub-Game Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shadow-xs">
        {skillMeta.games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">{g.icon}</span>
              <span>{g.title}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          GAME: CHOOSE THE CORRECT OPTION / HAMZA CHAIR / FINAL CHAIR (اختر الصحيح / كرسي الهمزة / اختر النهاية)
          ========================================================================= */}
      {activeGame === 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-black">
            <span>نشاط تفاعلي • الكلمة { (currentIndex % skillItems.length) + 1 } من { skillItems.length }</span>
          </div>

          {/* Visual Concept if Singular/Dual/Plural */}
          {skillId === 'singular_dual_plural' && (
            <div className="flex items-center justify-center gap-4 sm:gap-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 max-w-lg mx-auto">
              <div className="text-center">
                <span className="text-3xl block mb-1">🍎</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">مفرد (واحد)</span>
              </div>
              <span className="text-slate-400 font-black">←</span>
              <div className="text-center">
                <span className="text-3xl block mb-1">🍎🍎</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">مثنى (اثنان)</span>
              </div>
              <span className="text-slate-400 font-black">←</span>
              <div className="text-center">
                <span className="text-3xl block mb-1">🍎🍎🍎</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">جمع (ثلاثة فأكثر)</span>
              </div>
            </div>
          )}

          {/* Card Presentation */}
          <div className="space-y-3">
            <span className="text-5xl block animate-bounce">{currentItem.emoji}</span>
            
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-black font-alexandria tracking-wide text-slate-900 dark:text-white">
                {difficulty === 'hard'
                  ? currentItem.incompleteWord || currentItem.word.replace(/^./, '؟')
                  : currentItem.incompleteWord || currentItem.tashkeel}
              </h2>

              <button
                onClick={() => handlePlayAudio(currentItem.audioText)}
                className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 transition cursor-pointer"
                title="استمع للكلمة"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {skillId === 'taa_types' && 'تظهر كلمة ناقصة: اختر الحرف الصحيح (ة أو ت):'}
              {skillId === 'middle_hamza' && 'ما هو الكرسي الصحيح للهمزة في وسط هذه الكلمة؟'}
              {skillId === 'final_hamza' && 'ما هو شكل الهمزة المناسب لآخر هذه الكلمة؟'}
              {skillId === 'singular_dual_plural' && 'تأمل الصورة والعدد: هل تدل هذه الكلمة على مفرد أم مثنى أم جمع؟'}
            </p>
          </div>

          {/* Multiple Choices Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap max-w-xl mx-auto pt-2">
            {currentItem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xl sm:text-2xl font-black bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 transition shadow-sm cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: BASKET WORD SORTING / TRAIN CARRIAGES (صنف الكلمات / قطار الكلمات)
          ========================================================================= */}
      {(activeGame === 1 && skillId !== 'singular_dual_plural') && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🧺</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              لعبة تصنيف الكلمات الإملائية في السلال
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              {skillId === 'taa_types' && 'ضع الكلمات في سلة "ة" أو سلة "ت" بالضغط على السلة الصحيحة:'}
              {skillId === 'middle_hamza' && 'صنف الكلمات حسب كرسي الهمزة: على الألف أو الواو أو النبرة أو السطر:'}
              {skillId === 'final_hamza' && 'صنف الكلمات حسب موقع وشكل الهمزة المتطرفة في نهايتها:'}
            </p>
          </div>

          {/* Current Word Card to Sort */}
          {(() => {
            const activeSortItem = skillItems[basketState.currentSortingIndex % skillItems.length];
            if (!activeSortItem) return null;

            return (
              <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 max-w-sm mx-auto shadow-md space-y-2 animate-in zoom-in-95 duration-200">
                <span className="text-4xl block">{activeSortItem.emoji}</span>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white font-alexandria">
                  {activeSortItem.tashkeel}
                </h4>
                <button
                  onClick={() => handlePlayAudio(activeSortItem.audioText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-xs font-bold text-indigo-600 shadow-2xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع</span>
                </button>
              </div>
            );
          })()}

          {/* Baskets Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            {skillId === 'taa_types' ? (
              <>
                <button
                  onClick={() => handleSortIntoBasket('ة', 'ة')}
                  className="p-5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-center space-y-2 transition cursor-pointer shadow-sm hover:scale-103"
                >
                  <span className="text-3xl block">🧺</span>
                  <span className="text-2xl block font-alexandria">سلة (ة)</span>
                  <span className="text-[10px] text-amber-700 block">تاء مربوطة</span>
                </button>

                <button
                  onClick={() => handleSortIntoBasket('ت', 'ت')}
                  className="p-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-950 font-black text-center space-y-2 transition cursor-pointer shadow-sm hover:scale-103"
                >
                  <span className="text-3xl block">🧺</span>
                  <span className="text-2xl block font-alexandria">سلة (ت)</span>
                  <span className="text-[10px] text-rose-700 block">تاء مفتوحة</span>
                </button>
              </>
            ) : (
              [
                { key: 'أ', label: 'على الألف (أ)', color: 'bg-blue-50 border-blue-300 text-blue-900' },
                { key: 'ؤ', label: 'على الواو (ؤ)', color: 'bg-purple-50 border-purple-300 text-purple-900' },
                { key: 'ئ', label: 'على النبرة/الياء (ئ)', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
                { key: 'ء', label: 'على السطر (ء)', color: 'bg-amber-50 border-amber-300 text-amber-900' }
              ].map((basket) => (
                <button
                  key={basket.key}
                  onClick={() => handleSortIntoBasket(basket.key, basket.key)}
                  className={`p-4 rounded-2xl border-2 ${basket.color} font-black text-center space-y-1 transition cursor-pointer shadow-xs hover:scale-103`}
                >
                  <span className="text-2xl block">🧺</span>
                  <span className="text-xl block font-alexandria">{basket.key}</span>
                  <span className="text-[10px] block opacity-80">{basket.label}</span>
                </button>
              ))
            )}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: TRAIN OF WORDS (قطار الكلمات - للمفرد والمثنى والجمع)
          ========================================================================= */}
      {(activeGame === 1 && skillId === 'singular_dual_plural') && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🚂</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              قطار الكلمات: مفرد | مثنى | جمع
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              اضغط على عربة القطار المناسبة لوضع الكلمة المعروضة:
            </p>
          </div>

          {/* Active Word */}
          {(() => {
            const activeSortItem = skillItems[basketState.currentSortingIndex % skillItems.length];
            if (!activeSortItem) return null;

            return (
              <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 max-w-sm mx-auto shadow-md space-y-2 animate-in zoom-in-95 duration-200">
                <span className="text-4xl block">{activeSortItem.emoji}</span>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white font-alexandria">
                  {activeSortItem.tashkeel}
                </h4>
                <button
                  onClick={() => handlePlayAudio(activeSortItem.audioText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-xs font-bold text-purple-600 shadow-2xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع</span>
                </button>
              </div>
            );
          })()}

          {/* 3 Train Carriages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <button
              onClick={() => handleSortIntoBasket('مفرد', 'مفرد')}
              className="p-5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-center space-y-2 transition cursor-pointer shadow-sm hover:scale-103"
            >
              <span className="text-3xl block">🚃</span>
              <span className="text-xl block font-alexandria">عربة المفرد</span>
              <span className="text-[10px] text-amber-700 block">يدل على واحد (🍎)</span>
            </button>

            <button
              onClick={() => handleSortIntoBasket('مثنى', 'مثنى')}
              className="p-5 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 text-teal-950 font-black text-center space-y-2 transition cursor-pointer shadow-sm hover:scale-103"
            >
              <span className="text-3xl block">🚃</span>
              <span className="text-xl block font-alexandria">عربة المثنى</span>
              <span className="text-[10px] text-teal-700 block">يدل على اثنين (🍎🍎)</span>
            </button>

            <button
              onClick={() => handleSortIntoBasket('جمع', 'جمع')}
              className="p-5 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 font-black text-center space-y-2 transition cursor-pointer shadow-sm hover:scale-103"
            >
              <span className="text-3xl block">🚃</span>
              <span className="text-xl block font-alexandria">عربة الجمع</span>
              <span className="text-[10px] text-purple-700 block">ثلاثة فأكثر (🍎🍎🍎)</span>
            </button>
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: HAMZA HUNTER (صائد الهمزة المتوسطة)
          ========================================================================= */}
      {(activeGame === 2 && skillId === 'middle_hamza') && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🔍⚡</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              صائد الهمزة المتوسطة
            </h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              المطلوب: اضغط واصطد الكلمات التي تحتوي على همزة في وسطها فقط!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
            {[
              ...skillItems.slice(0, 5),
              { id: 'distract_1', word: 'كتاب', tashkeel: 'كِتَابٌ', emoji: '📘', skill: 'taa_types' as const, subSkill: 'taaMarbuta' as const },
              { id: 'distract_2', word: 'شمس', tashkeel: 'شَمْسٌ', emoji: '☀️', skill: 'taa_types' as const, subSkill: 'taaMarbuta' as const },
              { id: 'distract_3', word: 'قلم', tashkeel: 'قَلَمٌ', emoji: '✏️', skill: 'taa_types' as const, subSkill: 'taaMarbuta' as const }
            ].sort(() => 0.5 - Math.random()).map((item) => {
              const isHunted = huntedIds[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleHuntWord(item as SpellingSkillBankItem)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isHunted
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-95 opacity-80'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:scale-103'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-lg font-black font-alexandria">{item.tashkeel}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: BALLOON POPPING (فرقع الصحيح - للتاء والمثنى)
          ========================================================================= */}
      {((activeGame === 2 && skillId !== 'middle_hamza') || (activeGame === 4 && skillId === 'singular_dual_plural')) && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🎈</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              لعبة فرقعة البالونات الإملائية
            </h3>
            <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-bold">
              {skillId === 'taa_types' && 'المطلوب: فرقع الكلمات التي تنتهي بتاء مربوطة (ة) فقط!'}
              {skillId === 'singular_dual_plural' && 'المطلوب: فرقع الكلمات التي تدل على (المثنى) فقط!'}
              {skillId === 'final_hamza' && 'المطلوب: فرقع الكلمات التي تنتهي بهمزة على الألف أو الياء!'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            {skillItems.slice(0, 8).map((item, idx) => {
              const isPopped = balloonPopped[idx];
              const balloonColors = [
                'bg-rose-500 border-rose-600',
                'bg-sky-500 border-sky-600',
                'bg-amber-500 border-amber-600',
                'bg-emerald-500 border-emerald-600'
              ];
              const color = balloonColors[idx % balloonColors.length];

              return (
                <div key={item.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleBalloonClick(item, idx)}
                    className={`w-28 h-36 rounded-t-full rounded-b-3xl border-4 text-white font-black text-base sm:text-lg shadow-lg transition-all transform hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center p-2 text-center ${color} ${
                      isPopped ? 'scale-0 opacity-0 pointer-events-none duration-300' : 'duration-150'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="leading-tight">{item.tashkeel}</span>
                  </button>
                  <div className="w-1 h-8 bg-slate-300 -mt-1" />
                </div>
              );
            })}
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: FIX THE MISTAKE (أصلح الكلمة / أصلح الخطأ)
          ========================================================================= */}
      {activeGame === 3 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🔨</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              أصلح الخطأ الإملائي في الكلمة
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              الكلمة التالية تحتوي على خطأ إملائي شائع، اكتشفه وصححه يا بطل!
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 max-w-md mx-auto space-y-3">
            <span className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
              الكلمة المكتوبة بالخطأ:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-rose-900 dark:text-rose-100 line-through">
              {currentItem.wrongSpelling || currentItem.word + '؟'}
            </span>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
              اختر الكتابة الإملائية الصحيحة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSelectAnswer(currentItem.correctAnswer)}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 hover:bg-emerald-600 hover:text-white text-emerald-900 dark:text-emerald-100 font-black text-lg border border-emerald-300 transition cursor-pointer shadow-xs"
              >
                {currentItem.tashkeel}
              </button>
              <button
                onClick={() => {
                  audioManager.play('wrong');
                  setFeedback({ isCorrect: false, msg: 'هذه كتابة خاطئة أيضاً! راجع القاعدة الإملائية 🌟' });
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 text-slate-700 dark:text-slate-300 font-black text-lg border border-slate-200 transition cursor-pointer shadow-xs"
              >
                {currentItem.wrongSpelling || currentItem.word}
              </button>
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: WHY WAS IT WRITTEN LIKE THIS? (لماذا كتبت هكذا؟ - للهمزة المتوسطة)
          ========================================================================= */}
      {(activeGame === 4 && skillId === 'middle_hamza') && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🧠💡</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              لماذا كُتِبَتِ الهمزة هكذا؟ (تطبيق قاعدة أقوى الحركات)
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              سلم قوة الحركات: الكسرة (الياء) ← الضمة (الواو) ← الفتحة (الألف) ← السكون (السطر)
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 max-w-md mx-auto space-y-2">
            <span className="text-3xl block">{currentItem.emoji}</span>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white font-alexandria">
              {currentItem.tashkeel}
            </h4>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black inline-block">
              كرسي الهمزة: ({currentItem.hamzaChair})
            </span>
          </div>

          <div className="space-y-3 max-w-lg mx-auto text-right">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block text-center">
              اختر التعليل النحوي والإملائي الصحيح:
            </span>

            <div className="space-y-2">
              {[
                currentItem.whyWritten || currentItem.explanation,
                'لأن الهمزة متطرفة وتتبع حركة ما قبلها فقط.',
                'لأن حركة الهمزة أضعف من السكون.'
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const isCorrect = idx === 0;
                    setSelectedWhy(reason);
                    if (isCorrect) {
                      audioManager.play('correct');
                      onAddStars(2);
                      setStarsEarned((s) => s + 2);
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                      setFeedback({ isCorrect: true, msg: 'تعليل عبقري وممتاز! فهمت قاعدة أقوى الحركات 🌟' });
                    } else {
                      audioManager.play('wrong');
                      setFeedback({ isCorrect: false, msg: 'تعليل غير دقيق! تذكر أن ننظر لحركة الهمزة وحركة ما قبلها.' });
                    }
                  }}
                  className={`w-full p-4 rounded-2xl text-xs font-bold text-right border-2 transition cursor-pointer ${
                    selectedWhy === reason
                      ? idx === 0
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : 'bg-rose-50 border-rose-400 text-rose-950'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME: COMPLETE FAMILY & WORD FAMILY (أكمل العائلة / عائلة الكلمة - للعدد)
          ========================================================================= */}
      {((activeGame === 2 || activeGame === 5) && skillId === 'singular_dual_plural') && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🏠🧩</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              عائلة الكلمة: المفرد والمثنى والجمع
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              اربط بين صور عائلة الكلمة الواحدة وتأمل كيف تتغير علامة التثنية والجمع:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 text-center space-y-1">
              <span className="text-2xl">🍎</span>
              <span className="text-xs font-bold block text-slate-500">المفرد:</span>
              <span className="text-xl font-black font-alexandria">{currentItem.singularForm || currentItem.word}</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-teal-950 text-center space-y-1">
              <span className="text-2xl">🍎🍎</span>
              <span className="text-xs font-bold block text-slate-500">المثنى (+ ان):</span>
              <span className="text-xl font-black font-alexandria">{currentItem.dualForm || currentItem.word + 'ان'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 text-center space-y-1">
              <span className="text-2xl">🍎🍎🍎</span>
              <span className="text-xs font-bold block text-slate-500">الجمع:</span>
              <span className="text-xl font-black font-alexandria">{currentItem.pluralForm || currentItem.word + 'ات'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                audioManager.play('correct');
                onAddStars(1);
                setStarsEarned((s) => s + 1);
                setCurrentIndex((i) => i + 1);
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition cursor-pointer shadow-md"
            >
              العائلة التالية ⬅️
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          GAME: ACTUAL WRITING & DICTATION STAGE (اسمع واكتب / اكتب التحويل)
          ========================================================================= */}
      {(
        (activeGame === 4 && skillId === 'taa_types') ||
        (activeGame === 5 && skillId === 'middle_hamza') ||
        (activeGame === 4 && skillId === 'final_hamza') ||
        (activeGame === 6 && skillId === 'singular_dual_plural') ||
        (activeGame === 3 && skillId === 'singular_dual_plural')
      ) && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="space-y-1">
            <span className="text-4xl block">🎧✍️</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {skillId === 'singular_dual_plural' && activeGame === 6
                ? '✍️ اكتب التحويل بنفسك'
                : 'المرحلة الإملائية والكتابية الفعلية'}
            </h3>
            <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
              {skillId === 'singular_dual_plural' && activeGame === 6
                ? `حوّل كلمة (${currentItem.singularForm || currentItem.word}) إلى المثنى واكتبها بيدك:`
                : 'استمع للنطق الصوتي الفصيح ثم اكتب الكلمة كاملة في الصندوق بدون تخمين أو خيارات جاهزة!'}
            </p>
          </div>

          {/* Audio Box */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-3">
            <button
              onClick={() => handlePlayAudio(
                skillId === 'singular_dual_plural' && activeGame === 6
                  ? currentItem.dualForm || currentItem.word
                  : currentItem.audioText
              )}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition flex items-center justify-center gap-2 mx-auto shadow-md cursor-pointer active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>استمع للنطق بوضوح 🔊</span>
            </button>
            <span className="text-xs text-slate-400 block font-bold">
              اضغط على الزر لسماع الكلمة بتمهل
            </span>
          </div>

          {/* Actual Form */}
          <form
            onSubmit={(e) => handleSubmitTypedAnswer(
              e, 
              skillId === 'singular_dual_plural' && activeGame === 6
                ? currentItem.dualForm || currentItem.word
                : currentItem.word
            )}
            className="max-w-md mx-auto space-y-3"
          >
            <div>
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="اكتب الكلمة هنا بدون تردد..."
                className="w-full text-center py-4 px-4 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-950 text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>تحقق من صحة الإملاء</span>
              </button>
              <button
                type="button"
                onClick={() => setTypedAnswer('')}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="مسح"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Extended Sentence Challenge for advanced dictation */}
          {difficulty === 'hard' && currentItem.sentenceExample && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-right max-w-md mx-auto space-y-2">
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 block">
                تحدي الجملة القصيرة المتقدم:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                {currentItem.sentenceExample}
              </p>
              <button
                onClick={() => handlePlayAudio(currentItem.sentenceExample)}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استمع للجملة كاملة</span>
              </button>
            </div>
          )}

          {feedback && (
            <div className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-bold leading-relaxed ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}>
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      {/* Bottom Rule Explanation & Spaced Repetition Note */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white block mb-1">
            القاعدة الإملائية التوضيحية:
          </strong>
          <span>{currentItem.explanation}</span>
          {currentItem.whyWritten && (
            <span className="block mt-1 font-bold text-indigo-600 dark:text-indigo-400">
              💡 {currentItem.whyWritten}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
