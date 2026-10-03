import React, { useState, useEffect } from 'react';
import { 
  GAME_TRACKS, 
  GameTrackId, 
  GameTrackInfo 
} from '../../data/learningGamesData';
import { 
  getOrCreateGameProfile, 
  saveGameProfile, 
  StudentGameProfile, 
  DailyMissionActivity,
  addTrackProgress 
} from '../../utils/adaptiveGameEngine';
import { audioManager } from '../../utils/audio';
import { DailyMissionCard } from './DailyMissionCard';
import { LetterHuntGame } from './LetterHuntGame';
import { HarakatFactoryGame } from './HarakatFactoryGame';
import { MaddRocketGame } from './MaddRocketGame';
import { BuildWordAndSpellingGame } from './BuildWordAndSpellingGame';
import { ReadingFluencyGame } from './ReadingFluencyGame';
import { TeacherGamesDashboard } from './TeacherGamesDashboard';
import { 
  Sparkles, 
  Star, 
  Trophy, 
  Flame, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  RotateCcw, 
  ChevronLeft, 
  Award, 
  ShieldCheck, 
  Volume2, 
  Users,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearningGamesHubProps {
  studentName?: string;
  onAddStars?: (count: number) => void;
  onBackToMain?: () => void;
}

// Level metadata for each track's journey map
const TRACK_LEVELS_METADATA: Record<GameTrackId, { title: string; subtitle: string; icon: string }[]> = {
  letters: [
    { title: 'صيد الحرف', subtitle: 'اسمع صوت الحرف واختره', icon: '🎯' },
    { title: 'أين الحرف؟', subtitle: 'ابحث عن الحرف داخل الشبكة', icon: '🔍' },
    { title: 'فرقع البالون', subtitle: 'فرقع البالون المطلوب بمرح', icon: '🎈' },
    { title: 'اسمع واختر', subtitle: 'اربط بين الصوت والشكل الصحيح', icon: '👂' },
    { title: 'قطار الحروف', subtitle: 'مواضع الحرف: أول ووسط وآخر الكلمة', icon: '🚂' },
    { title: 'طابق الحرف', subtitle: 'مطابقة أشكال الحرف المتنوعة', icon: '🧩' }
  ],
  harakat: [
    { title: 'مصنع الحركات', subtitle: 'دمج الحرف مع الفتحة والضمة والكسرة', icon: '🏭' },
    { title: 'اسمع الحركة', subtitle: 'تمييز نطق بَ / بُ / بِ', icon: '🔊' },
    { title: 'ضع الحركة', subtitle: 'اسحب الحركة المناسبة فوق الحرف', icon: '👆' },
    { title: 'صيد المقطع', subtitle: 'البحث عن المقطع القصير مَ / مُ / مِ', icon: '🎣' },
    { title: 'تحدي السكون', subtitle: 'تمييز الحرف الساكن عن المتحرك', icon: '⚡' }
  ],
  madd_syllables: [
    { title: 'صاروخ المدود', subtitle: 'تمييز الصوت القصير والطويل بَ ↔ بَا', icon: '🚀' },
    { title: 'اسمع القصير والطويل', subtitle: 'الوعي الصوتي للمدود الثلاثة', icon: '🎶' },
    { title: 'اختر حرف المد', subtitle: 'تحديد الألف والواو والياء المناسبة', icon: '✨' },
    { title: 'خلية المقاطع', subtitle: 'دمج مقطعين مثل مَ + دَ', icon: '🍯' },
    { title: 'قطار المقاطع', subtitle: 'ترتيب المقاطع لتكوين كلمة مفيدة', icon: '🚋' },
    { title: 'دمج الأصوات', subtitle: 'سماع المقاطع واحداً واحداً ثم الكلمة', icon: '🔊' }
  ],
  words_spelling: [
    { title: 'ابنِ الكلمة بالحروف', subtitle: 'ترتيب الحروف لتكوين الكلمة', icon: '🏗️' },
    { title: 'ابنِ الكلمة بالمقاطع', subtitle: 'تركيب المقاطع الصوتية', icon: '🧩' },
    { title: 'الصورة والكلمة', subtitle: 'مطابقة الصورة بالكلمة المناسبة', icon: '🖼️' },
    { title: 'الكلمة الناقصة', subtitle: 'اكتشاف الحرف الناقص وتكميله', icon: '🔍' },
    { title: 'اكتب ما تسمع', subtitle: 'إملاء سمعي تفاعلي متدرج', icon: '✍️' },
    { title: 'الإملاء المصور', subtitle: 'كتابة الكلمة المعبرة عن الصورة', icon: '📸' },
    { title: 'ذاكرة الكلمات', subtitle: 'بطاقات الذاكرة والمطابقة البصرية', icon: '🃏' },
    { title: 'صحح الكلمة', subtitle: 'اكتشاف الخطأ وتصحيحه بمهارة', icon: '🎯' }
  ],
  reading_fluency: [
    { title: 'القراءة البرقية', subtitle: 'تظهر الكلمة لثوانٍ ثم تختفي', icon: '⚡' },
    { title: 'اقرأ بسرعة', subtitle: 'قراءة كلمات بصرية مألوفة بسلاسة', icon: '🏎️' },
    { title: 'سباق القراءة', subtitle: 'حرك السيارة نحو خط النهاية بدون توتر', icon: '🏁' },
    { title: 'اقرأ واختر الصورة', subtitle: 'الربط السريع بين الجملة والصورة', icon: '🖼️' },
    { title: 'اقرأ الجملة واختر معناها', subtitle: 'الفهم القرائي السريع والمباشر', icon: '💡' },
    { title: 'الجملة المختفية', subtitle: 'اختفاء تدريجي لاختبار الطلاقة', icon: '🌫️' },
    { title: 'القراءة المتكررة', subtitle: '٣ محاولات إيجابية لقياس التحسن', icon: '🔄' },
    { title: 'قصة قصيرة وفهم مقروء', subtitle: 'نص قصير مع أسئلة استيعاب شيقة', icon: '📖' }
  ]
};

export const LearningGamesHub: React.FC<LearningGamesHubProps> = ({
  studentName = 'بطل لغتي',
  onAddStars,
  onBackToMain
}) => {
  // Game profile & adaptive engine state
  const [profile, setProfile] = useState<StudentGameProfile>(() => 
    getOrCreateGameProfile(studentName)
  );

  // Active navigation view:
  // 'hub': Main 5 tracks overview
  // 'track_map': The levels progression map for a specific track
  // 'playing': Active sub-game
  // 'teacher': Teacher dashboard
  const [activeView, setActiveView] = useState<'hub' | 'track_map' | 'playing' | 'teacher'>('hub');
  const [selectedTrackId, setSelectedTrackId] = useState<GameTrackId>('letters');
  const [activeSubGameIndex, setActiveSubGameIndex] = useState<number>(0);
  const [currentMissionActivity, setCurrentMissionActivity] = useState<DailyMissionActivity | null>(null);

  // Sync profile student name if passed from parent
  useEffect(() => {
    if (studentName && profile.studentName !== studentName) {
      const updated = { ...profile, studentName };
      setProfile(updated);
      saveGameProfile(updated);
    }
  }, [studentName]);

  // Audio welcome
  const handlePlayWelcomeAudio = () => {
    audioManager.speakArabic(
      `أهلاً بك يا ${profile.studentName} في ألعاب التأسيس! تعلّم، العب، واجمع النجوم. ابدأ بمهمتك اليومية أو اختر أحد العوالم الخمسة!`,
      0.9
    );
  };

  // Launch track map
  const handleSelectTrack = (trackId: GameTrackId) => {
    setSelectedTrackId(trackId);
    setActiveView('track_map');
  };

  // Launch subgame from map or mission
  const handleStartSubGame = (trackId: GameTrackId, levelIndex: number, missionAct?: DailyMissionActivity) => {
    setSelectedTrackId(trackId);
    setActiveSubGameIndex(levelIndex);
    if (missionAct) {
      setCurrentMissionActivity(missionAct);
    } else {
      setCurrentMissionActivity(null);
    }
    setActiveView('playing');
  };

  // When subgame finishes
  const handleFinishLevel = (accuracy: number, starsEarned: number) => {
    // 1. Add progress in engine
    addTrackProgress(selectedTrackId, starsEarned, activeSubGameIndex, accuracy);

    // 2. If it was a daily mission activity, mark it completed
    const updatedProfile = getOrCreateGameProfile(profile.studentName);
    if (currentMissionActivity) {
      const act = updatedProfile.dailyMission.activities.find(a => a.id === currentMissionActivity.id);
      if (act) {
        act.completed = true;
        act.currentCount = act.targetCount;
      }
      const allDone = updatedProfile.dailyMission.activities.every(a => a.completed);
      if (allDone) {
        updatedProfile.dailyMission.completed = true;
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      saveGameProfile(updatedProfile);
    }

    setProfile(updatedProfile);
    if (onAddStars) {
      onAddStars(starsEarned);
    }

    // Return to track map or hub
    setActiveView('track_map');
  };

  // Back to map from playing
  const handleBackToMap = () => {
    setActiveView('track_map');
  };

  // Back to hub from map
  const handleBackToHub = () => {
    setActiveView('hub');
  };

  const selectedTrackInfo = GAME_TRACKS.find(t => t.id === selectedTrackId) || GAME_TRACKS[0];
  const selectedTrackProgress = profile.tracks[selectedTrackId];
  const trackLevels = TRACK_LEVELS_METADATA[selectedTrackId] || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-cairo text-slate-800 dark:text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors" dir="rtl">
      
      {/* 1. TEACHER VIEW */}
      {activeView === 'teacher' && (
        <TeacherGamesDashboard 
          profile={profile}
          onUpdateProfile={(p) => setProfile(p)}
          onBackToStudentView={() => setActiveView('hub')}
        />
      )}

      {/* 2. PLAYING SUB-GAME VIEW */}
      {activeView === 'playing' && (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
          {selectedTrackId === 'letters' && (
            <LetterHuntGame 
              initialSubGameIndex={activeSubGameIndex}
              onFinishLevel={handleFinishLevel}
              onBackToMap={handleBackToMap}
            />
          )}
          {selectedTrackId === 'harakat' && (
            <HarakatFactoryGame 
              initialSubGameIndex={activeSubGameIndex}
              onFinishLevel={handleFinishLevel}
              onBackToMap={handleBackToMap}
            />
          )}
          {selectedTrackId === 'madd_syllables' && (
            <MaddRocketGame 
              initialSubGameIndex={activeSubGameIndex}
              onFinishLevel={handleFinishLevel}
              onBackToMap={handleBackToMap}
            />
          )}
          {selectedTrackId === 'words_spelling' && (
            <BuildWordAndSpellingGame 
              initialSubGameIndex={activeSubGameIndex}
              onFinishLevel={handleFinishLevel}
              onBackToMap={handleBackToMap}
            />
          )}
          {selectedTrackId === 'reading_fluency' && (
            <ReadingFluencyGame 
              initialSubGameIndex={activeSubGameIndex}
              onFinishLevel={handleFinishLevel}
              onBackToMap={handleBackToMap}
            />
          )}
        </div>
      )}

      {/* 3. TRACK LEVEL MAP (JOURNEY PATH VIEW) */}
      {activeView === 'track_map' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Header Card for the selected track */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${selectedTrackInfo.bgGradient} text-white shadow-xl relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl drop-shadow-md">{selectedTrackInfo.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white">
                      مسار رقم {GAME_TRACKS.findIndex(t => t.id === selectedTrackId) + 1}
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      {selectedTrackInfo.levelsCount} مستويات متدرجة
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
                    {selectedTrackInfo.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/90 font-bold max-w-xl mt-1">
                    {selectedTrackInfo.description}
                  </p>
                </div>
              </div>

              <button
                onClick={handleBackToHub}
                className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-stretch sm:self-auto justify-center"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للمسارات 🎮</span>
              </button>
            </div>

            {/* Mastery Bar */}
            <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span>نسبة الإتقان:</span>
                <div className="flex-1 sm:w-48 h-3 rounded-full bg-black/20 overflow-hidden">
                  <div 
                    className="h-full bg-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${selectedTrackProgress.masteryPercentage}%` }}
                  />
                </div>
                <span className="font-black text-amber-200">{selectedTrackProgress.masteryPercentage}%</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-amber-300 font-black">
                  <Star className="w-4 h-4 fill-amber-300" />
                  {selectedTrackProgress.starsEarned} نجمة مكتسبة
                </span>
              </div>
            </div>
          </div>

          {/* Level Progression Steps (1 to N) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗺️ خريطة المستويات المتدرجة</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                (يتطلب كل مستوى نسبة إتقان ٨٠٪ للانتقال للمستوى التالي)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trackLevels.map((lvl, index) => {
                const isUnlocked = index + 1 <= selectedTrackProgress.unlockedLevel;
                const isCompleted = selectedTrackProgress.completedLevels.includes(index);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (isUnlocked) {
                        handleStartSubGame(selectedTrackId, index);
                      } else {
                        audioManager.speakArabic('أكمل المستوى السابق بنسبة إتقان ثمانين بالمائة لفتح هذا المستوى يا بطل!');
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-850 hover:border-indigo-400 hover:shadow-md cursor-pointer border-slate-200 dark:border-slate-700'
                        : 'bg-slate-100/70 dark:bg-slate-900/40 opacity-60 border-dashed border-slate-300 dark:border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600'
                          : isUnlocked
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {lvl.icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            مستوى {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> تم الإتقان
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          {lvl.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                          {lvl.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isUnlocked ? (
                        <button className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400" title="مغلق حتى إتقان السابق">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN GAMES HUB SCREEN */}
      {activeView === 'hub' && (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Top Bar: Simple Title + Gamification info (Clean, no clutter) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>رحلة التأسيس القرائي الذكية</span>
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  متدرجة من الحرف إلى الطلاقة
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-alexandria text-slate-900 dark:text-white flex items-center gap-3">
                <span>🎮 ألعاب التأسيس</span>
                <button
                  onClick={handlePlayWelcomeAudio}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-600 text-slate-600 transition cursor-pointer"
                  title="استمع للترحيب"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-bold mt-1">
                تعلّم، العب، واجمع النجوم ⭐
              </p>
            </div>

            {/* Quick Minimal Gamification Badge for Child */}
            <div className="flex items-center gap-3 flex-wrap self-stretch md:self-auto justify-end">
              <div className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                  {profile.totalStars} نجمة
                </span>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center gap-2">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span className="text-xs font-black text-rose-900 dark:text-rose-200">
                  {profile.streakDays} أيام تدريب
                </span>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                  {profile.levelBadge}
                </span>
              </div>

              {/* Teacher Button (Quiet and separated) */}
              <button
                onClick={() => setActiveView('teacher')}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="لوحة تشخيص المعلم وإدارة المحتوى"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>لوحة المعلم 👨‍🏫</span>
              </button>
            </div>
          </div>

          {/* 7. DAILY MISSION CARD (مهمتي اليوم) */}
          <DailyMissionCard
            mission={profile.dailyMission}
            onStartActivity={(act) => handleStartSubGame(act.trackId, act.gameIndex, act)}
          />

          {/* 5 MAIN TRACKS CARDS (بطاقات كبيرة وملونة) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-alexandria text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🗺️ مسارات التعلم الخمسة</span>
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  رحلة واضحة ومتدرجة حتى يعرف طفلك ماذا يلعب الآن وما النشاط التالي
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAME_TRACKS.map((track, idx) => {
                const tr = profile.tracks[track.id];
                const isStarted = tr.masteryPercentage > 0;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id)}
                    className="group relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Accent Strip */}
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${track.bgGradient}`} />

                    <div>
                      {/* Top Bar: Icon + Levels count */}
                      <div className="flex items-center justify-between mb-4 mt-1">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition duration-300">
                          {track.emoji}
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          المسار {idx + 1}
                        </span>
                      </div>

                      {/* Name & Target */}
                      <h3 className="text-xl font-black font-alexandria text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {track.title}
                      </h3>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-2">
                        {track.subtitle}
                      </span>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        {track.description}
                      </p>
                    </div>

                    {/* Bottom Stats & Launch Button */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-500">نسبة التقدم:</span>
                          <span className="font-black text-slate-900 dark:text-white">{tr.masteryPercentage}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${track.bgGradient} transition-all duration-500`}
                            style={{ width: `${tr.masteryPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Stars & Action Button */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400" />
                          {tr.starsEarned} نجوم
                        </span>

                        <button className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition flex items-center gap-1.5 shadow-md">
                          <span>{isStarted ? 'تابع' : 'ابدأ'}</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
