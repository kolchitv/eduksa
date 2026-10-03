import React, { useState } from 'react';
import { 
  StudentGameProfile, 
  saveGameProfile 
} from '../../utils/adaptiveGameEngine';
import { getSpellingSkillsProfile } from '../../utils/spellingAdaptiveReview';
import { 
  GAME_TRACKS, 
  GameTrackId,
  CENTRAL_LETTERS_DATA, 
  CENTRAL_SPELLING_WORDS,
  CENTRAL_FLUENCY_SENTENCES,
  CENTRAL_SHORT_STORIES,
  getCustomTeacherData,
  saveCustomTeacherData,
  WordSpellingItem,
  FluencySentenceItem,
  ShortStoryItem
} from '../../data/learningGamesData';
import { audioManager } from '../../utils/audio';
import { 
  User, 
  Trophy, 
  Star, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Printer, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Volume2
} from 'lucide-react';

interface TeacherGamesDashboardProps {
  profile: StudentGameProfile;
  onUpdateProfile: (profile: StudentGameProfile) => void;
  onBackToStudentView: () => void;
}

export const TeacherGamesDashboard: React.FC<TeacherGamesDashboardProps> = ({
  profile,
  onUpdateProfile,
  onBackToStudentView
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'contentManager'>('analytics');
  
  // Custom content manager state
  const [customWords, setCustomWords] = useState<WordSpellingItem[]>(() => 
    getCustomTeacherData<WordSpellingItem[]>('teacher_words', [])
  );
  const [customSentences, setCustomSentences] = useState<FluencySentenceItem[]>(() => 
    getCustomTeacherData<FluencySentenceItem[]>('teacher_sentences', [])
  );
  const [customStories, setCustomStories] = useState<ShortStoryItem[]>(() => 
    getCustomTeacherData<ShortStoryItem[]>('teacher_stories', [])
  );

  // New word form
  const [newWord, setNewWord] = useState('');
  const [newWordEmoji, setNewWordEmoji] = useState('⭐');
  const [newWordSyllables, setNewWordSyllables] = useState('');

  // New sentence form
  const [newSentence, setNewSentence] = useState('');
  const [newSentenceEmoji, setNewSentenceEmoji] = useState('📖');

  // Compute overall mastery
  const trackKeys: GameTrackId[] = ['letters', 'harakat', 'madd_syllables', 'words_spelling', 'reading_fluency'];
  const avgMastery = Math.round(
    trackKeys.reduce((acc, k) => acc + profile.tracks[k].masteryPercentage, 0) / trackKeys.length
  );

  // Compute next recommended activity based on adaptive errors
  const getNextRecommendedActivity = () => {
    const { confusingLetters, weakHarakat, weakMadd, spellingErrorsCount, readingSpeedSlowCount } = profile.mistakes;
    const confusingKeys = Object.keys(confusingLetters);
    const harakatKeys = Object.keys(weakHarakat);
    const maddKeys = Object.keys(weakMadd);

    if (confusingKeys.length > 0) {
      const topLetter = confusingKeys.sort((a, b) => confusingLetters[b] - confusingLetters[a])[0];
      return {
        track: 'عالم الحروف 🔤',
        title: `تدريب مكثف على حرف (${topLetter}) ومواضعه`,
        reason: `لوحظ تكرار الخطأ في الحرف (${topLetter}) ${confusingLetters[topLetter]} مرات. يوصى بلعبة صيد الحرف وقطار المواضع.`
      };
    }

    if (harakatKeys.length > 0) {
      const topHaraka = harakatKeys.sort((a, b) => weakHarakat[b] - weakHarakat[a])[0];
      const harakaName = topHaraka === 'kasra' ? 'الكسرة' : topHaraka === 'damma' ? 'الضمة' : 'السكون';
      return {
        track: 'عالم الحركات 🌈',
        title: `مصنع الحركات وتحدي (${harakaName})`,
        reason: `يحتاج الطالب لدعم في تمييز صوت ${harakaName}. يوصى بلعبة ضع الحركة وصيد المقطع.`
      };
    }

    if (maddKeys.length > 0) {
      return {
        track: 'عالم المدود والمقاطع 🚀',
        title: 'صاروخ المدود: القصير والطويل',
        reason: 'لوحظ خلط بين الحركات القصيرة وحروف المد الثلاثة.'
      };
    }

    if (spellingErrorsCount > 2) {
      return {
        track: 'عالم الكلمات والإملاء 🧩',
        title: 'ابنِ الكلمة والإملاء المصور المتدرج',
        reason: 'تعزيز التحليل والتركيب الإملائي من المقطع إلى الكلمة.'
      };
    }

    if (readingSpeedSlowCount > 2) {
      return {
        track: 'عالم القراءة والطلاقة 📖',
        title: 'القراءة البرقية وسباق القراءة السلسة',
        reason: 'الانتقال التدريجي من التهجئة البطيئة إلى الطلاقة التعبيرية.'
      };
    }

    return {
      track: 'عالم القراءة والطلاقة 📖',
      title: 'مهمة اليوم: القراءة المتكررة وقصة قصيرة',
      reason: 'مستوى الطالب متقدم، واصل تعزيز الفهم القرائي والسرعة.'
    };
  };

  const nextActivity = getNextRecommendedActivity();

  // Reset demo student data
  const handleResetData = () => {
    if (confirm('هل تريد إعادة تعيين بيانات الطالب ونقاطه؟')) {
      const resetProfile: StudentGameProfile = {
        ...profile,
        totalStars: 0,
        streakDays: 1,
        levelBadge: 'مبتدئ الحروف 🌱',
        tracks: {
          letters: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
          harakat: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
          madd_syllables: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
          words_spelling: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
          reading_fluency: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] }
        },
        mistakes: {
          confusingLetters: {},
          weakHarakat: {},
          weakMadd: {},
          spellingErrorsCount: 0,
          readingSpeedSlowCount: 0,
          masteredLetters: [],
          masteredWords: [],
          totalGamesPlayed: 0,
          totalTimeMinutes: 0,
          lastActivityDate: new Date().toISOString()
        }
      };
      saveGameProfile(resetProfile);
      onUpdateProfile(resetProfile);
    }
  };

  // Add word
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    const syllables = newWordSyllables.trim()
      ? newWordSyllables.split('-').map(s => s.trim())
      : [newWord.trim()];

    const item: WordSpellingItem = {
      id: `custom_word_${Date.now()}`,
      word: newWord.trim().replace(/[ًٌٍَُِّْ]/g, ''),
      tashkeel: newWord.trim(),
      emoji: newWordEmoji.trim() || '⭐',
      letters: newWord.trim().split(''),
      syllables: syllables,
      category: 'general',
      difficulty: 'easy',
      distractorLetters: ['ب', 'م', 'ر']
    };

    const updated = [item, ...customWords];
    setCustomWords(updated);
    saveCustomTeacherData('teacher_words', updated);
    setNewWord('');
    setNewWordSyllables('');
    audioManager.playCorrect();
  };

  // Delete word
  const handleDeleteCustomWord = (id: string) => {
    const updated = customWords.filter(w => w.id !== id);
    setCustomWords(updated);
    saveCustomTeacherData('teacher_words', updated);
  };

  // Add sentence
  const handleAddCustomSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSentence.trim()) return;

    const item: FluencySentenceItem = {
      id: `custom_sentence_${Date.now()}`,
      sentence: newSentence.trim(),
      meaningEmoji: '📖',
      targetSeconds: 4,
      wordCount: newSentence.trim().split(' ').length,
      question: {
        prompt: 'مَاذَا قَرَأْتَ فِي الجُمْلَةِ؟',
        options: [newSentence.trim(), 'جُمْلَةٌ أُخْرَى', 'قِرَاءَةٌ سَرِيعَةٌ'],
        correctIndex: 0
      }
    };

    const updated = [item, ...customSentences];
    setCustomSentences(updated);
    saveCustomTeacherData('teacher_sentences', updated);
    setNewSentence('');
    audioManager.playCorrect();
  };

  const handleDeleteCustomSentence = (id: string) => {
    const updated = customSentences.filter(s => s.id !== id);
    setCustomSentences(updated);
    saveCustomTeacherData('teacher_sentences', updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Bar for Teacher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
              <span>👨‍🏫 لوحة المعلم والمشرف التربوي</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">
              تشخيص الأخطاء والتعلم التكيفي وإدارة المحتوى
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
            متابعة تقدم الطالب: <span className="text-amber-400">{profile.studentName}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition border border-white/10 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>طباعة التقرير</span>
          </button>
          
          <button
            onClick={onBackToStudentView}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/20 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لواجهة الطفل 🎮</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>التقرير والتشخيص التكيفي</span>
        </button>

        <button
          onClick={() => setActiveTab('contentManager')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'contentManager'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة المحتوى المركزي (إضافة بدون كود)</span>
          {(customWords.length > 0 || customSentences.length > 0) && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {customWords.length + customSentences.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ANALYTICS & DIAGNOSTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">المستوى والشارة</span>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                <span>🏅</span> {profile.levelBadge}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">مجموع النجوم</span>
              <span className="text-lg font-black text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {profile.totalStars} ⭐
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">نسبة الإتقان العامة</span>
              <span className="text-lg font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {avgMastery}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">سلسلة التدريب</span>
              <span className="text-lg font-black text-rose-500 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-rose-500" />
                {profile.streakDays} أيام
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">مدة التدريب</span>
              <span className="text-lg font-black text-sky-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {profile.mistakes.totalTimeMinutes} دقيقة
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">الأنشطة المكتملة</span>
              <span className="text-lg font-black text-purple-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {profile.mistakes.totalGamesPlayed} لعبة
              </span>
            </div>
          </div>

          {/* NEXT RECOMMENDED ACTIVITY (ADAPTIVE HIGHLIGHT) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-lg border border-indigo-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
                🎯
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/40 text-indigo-200 uppercase tracking-wider">
                  التوصية التربوية الذكية المتكيفة
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-300">
                  {nextActivity.title} ({nextActivity.track})
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bold">
                  {nextActivity.reason}
                </p>
              </div>
            </div>
          </div>

          {/* 5 TRACKS PROGRESS BREAKDOWN */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>مستويات الإتقان عبر المسارات الخمسة</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GAME_TRACKS.map(track => {
                const tr = profile.tracks[track.id];
                return (
                  <div key={track.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{track.emoji}</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{track.title}</h4>
                          <span className="text-[10px] text-slate-500">{track.levelsCount} مستويات متدرجة</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {tr.masteryPercentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${track.bgGradient} transition-all duration-500`}
                        style={{ width: `${tr.masteryPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                      <span>المستوى المفتوح: {tr.unlockedLevel} من {track.levelsCount}</span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {tr.starsEarned}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED SKILL DIAGNOSTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confusing Letters & Mastered */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>الحروف المشتبهة ومواضع الضعف</span>
                </span>
                <span className="text-xs font-bold text-slate-500">سجل الأخطاء</span>
              </h3>

              {Object.keys(profile.mistakes.confusingLetters).length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ممتاز! لم يتم رصد أي صعوبات متكررة في تمييز الحروف حتى الآن.</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profile.mistakes.confusingLetters).map(([char, count]) => (
                    <span 
                      key={char} 
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 text-xs font-black flex items-center gap-2"
                    >
                      <span className="text-base">{char}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px]">
                        {count} أخطاء
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Mastered Letters */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mb-2">
                  الحروف المتقنة بنجاح ({profile.mistakes.masteredLetters.length} حرف):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.mistakes.masteredLetters.map(char => (
                    <span key={char} className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                      {char}
                    </span>
                  ))}
                  {profile.mistakes.masteredLetters.length === 0 && (
                    <span className="text-xs text-slate-400 font-bold">قيد التدريب...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Harakat, Madd, & Spelling Errors */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                  <span>الحركات، المدود، والإملاء</span>
                </span>
                <span className="text-xs font-bold text-slate-500">التشخيص الدقيق</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">صعوبة الكسرة والضمة:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {profile.mistakes.weakHarakat['kasra'] || 0} كسرة / {profile.mistakes.weakHarakat['damma'] || 0} ضمة
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">تحدي السكون والمقطع الساكن:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {profile.mistakes.weakHarakat['sukoon'] || 0} تنبيهات
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">إجمالي أخطاء الإملاء المسجلة:</span>
                  <span className="font-black text-purple-600 dark:text-purple-400">
                    {profile.mistakes.spellingErrorsCount} خطأ
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">مؤشر بطء القراءة والتهجئة:</span>
                  <span className="font-black text-sky-600 dark:text-sky-400">
                    {profile.mistakes.readingSpeedSlowCount} مرات (تحتاج لطلاقة)
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Major Spelling Skills Diagnostics Card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  <span>تشخيص مهارات مسار الإملاء المطورة (التاءات، الهمزات، والعدد)</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  سجل الإتقان والمراجعة الذكية المتباعدة
                </span>
              </div>

              {(() => {
                const spellingProfile = getSpellingSkillsProfile();
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-900 dark:text-amber-200">التاء المربوطة والمفتوحة</span>
                          <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                            {spellingProfile.subSkillStats.taaMarbuta.mastery}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-amber-200 dark:bg-amber-900/60 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${spellingProfile.subSkillStats.taaMarbuta.mastery}%` }} />
                        </div>
                        <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block">
                          {spellingProfile.subSkillStats.taaMarbuta.errors} أخطاء مسجلة في الوقف
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-blue-900 dark:text-blue-200">الهمزة المتوسطة</span>
                          <span className="text-xs font-black text-blue-700 dark:text-blue-300">
                            {spellingProfile.subSkillStats.middleHamza.mastery}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900/60 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${spellingProfile.subSkillStats.middleHamza.mastery}%` }} />
                        </div>
                        <span className="text-[10px] text-blue-800 dark:text-blue-300 font-bold block">
                          {spellingProfile.subSkillStats.middleHamza.errors} أخطاء في كراسي الهمزة
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-teal-900 dark:text-teal-200">الهمزة المتطرفة</span>
                          <span className="text-xs font-black text-teal-700 dark:text-teal-300">
                            {spellingProfile.subSkillStats.finalHamza.mastery}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-teal-200 dark:bg-teal-900/60 overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${spellingProfile.subSkillStats.finalHamza.mastery}%` }} />
                        </div>
                        <span className="text-[10px] text-teal-800 dark:text-teal-300 font-bold block">
                          {spellingProfile.subSkillStats.finalHamza.errors} أخطاء في حركة السابق
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-900 dark:text-purple-200">المفرد والمثنى والجمع</span>
                          <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                            {spellingProfile.subSkillStats.dual.mastery}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-900/60 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${spellingProfile.subSkillStats.dual.mastery}%` }} />
                        </div>
                        <span className="text-[10px] text-purple-800 dark:text-purple-300 font-bold block">
                          {spellingProfile.subSkillStats.dual.errors + spellingProfile.subSkillStats.plural.errors} أخطاء في التحويل الإملائي
                        </span>
                      </div>
                    </div>

                    {/* Spaced repetition review queue */}
                    {spellingProfile.reviewQueue.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                        <span className="font-bold text-slate-500 block mb-2">
                          قائمة الكلمات الخاضعة للمراجعة الذكية المتباعدة (Spaced Repetition):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {spellingProfile.reviewQueue.map((item, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span>{item.tashkeel}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                                مرحلة {item.stage}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Reset Action */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold">
              هل ترغب في إعادة ضبط سجل الطالب لبدء عام دراسي جديد؟
            </span>
            <button
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين السجل</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRAL CONTENT MANAGER (NO HARD-CODING) */}
      {activeTab === 'contentManager' && (
        <div className="space-y-8">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold leading-relaxed">
            💡 <strong>ميزة الإدارة المركزية بدون تعديل كود:</strong> يمكنك إضافة كلمات جديدة ومقاطع وجمل وقصص مخصصة لفصلك الدراسي. تُحفظ هذه البيانات فورياً وتندمج تلقائياً مع ألعاب المنصة!
          </div>

          {/* 1. Add Word Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>إضافة كلمة جديدة لألعاب الإملاء والبناء والقراءة</span>
            </h3>

            <form onSubmit={handleAddCustomWord} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">الكلمة بالحركات</label>
                <input
                  type="text"
                  placeholder="مثال: شَجَرَةٌ"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">المقاطع (مفصولة بـ -)</label>
                <input
                  type="text"
                  placeholder="مثال: شَـ-جَـ-رَ-ةٌ"
                  value={newWordSyllables}
                  onChange={(e) => setNewWordSyllables(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">رمز الصورة (إيموجي)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="🌳"
                    value={newWordEmoji}
                    onChange={(e) => setNewWordEmoji(e.target.value)}
                    className="w-16 px-3 py-2 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-base font-bold"
                  />
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة الكلمة</span>
                  </button>
                </div>
              </div>
            </form>

            {/* List of custom words */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 block mb-3">
                الكلمات المضافة من المعلم ({customWords.length}):
              </span>
              {customWords.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold">لا توجد كلمات مضافة حالياً. الكلمات الافتراضية محملة في الألعاب.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {customWords.map(w => (
                    <div key={w.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{w.emoji}</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white">{w.word}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomWord(w.id)}
                        className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Add Fluency Sentence Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-500" />
              <span>إضافة جملة قصيرة لمسار الطلاقة والقراءة المتكررة</span>
            </h3>

            <form onSubmit={handleAddCustomSentence} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="مثال: زَرَعَ فَوَازٌ وَرْدَةً جَمِيلَةً فِي الحَدِيقَةِ."
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة الجملة</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 block mb-3">
                الجمل المضافة من المعلم ({customSentences.length}):
              </span>
              {customSentences.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold">لا توجد جمل مضافة حالياً. الجمل المركزية مفعلة تلقائياً.</p>
              ) : (
                <div className="space-y-2">
                  {customSentences.map(s => (
                    <div key={s.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">{s.sentence}</span>
                      <button
                        onClick={() => handleDeleteCustomSentence(s.id)}
                        className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
