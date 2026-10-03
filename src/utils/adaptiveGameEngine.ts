/**
 * محرك الألعاب والتعلم التكيفي المشترك (Adaptive Learning & Gamification Engine)
 * يدير التقدم، الأخطاء، مهمة اليوم، والتغذية الراجعة اللطيفة للطفل وواجهة المعلم
 */

import { GameTrackId } from '../data/learningGamesData';
import { audioManager } from './audio';
import { getWeakestSpellingSkill } from './spellingAdaptiveReview';

export interface DailyMissionActivity {
  id: string;
  title: string;
  trackId: GameTrackId;
  gameIndex: number;
  icon: string;
  completed: boolean;
  targetCount: number;
  currentCount: number;
  reason: string;
}

export interface StudentSkillMistakes {
  confusingLetters: Record<string, number>; // e.g. { 'ب': 3, 'ت': 2, 'ث': 1 }
  weakHarakat: Record<string, number>; // e.g. { 'kasra': 4, 'damma': 2, 'sukoon': 5 }
  weakMadd: Record<string, number>; // e.g. { 'yaa': 3, 'waw': 2 }
  spellingErrorsCount: number;
  readingSpeedSlowCount: number;
  masteredLetters: string[];
  masteredWords: string[];
  totalGamesPlayed: number;
  totalTimeMinutes: number;
  lastActivityDate: string;
}

export interface TrackProgress {
  unlockedLevel: number;
  starsEarned: number;
  masteryPercentage: number;
  completedLevels: number[];
}

export interface StudentGameProfile {
  studentName: string;
  totalStars: number;
  streakDays: number;
  levelBadge: string;
  tracks: Record<GameTrackId, TrackProgress>;
  mistakes: StudentSkillMistakes;
  dailyMission: {
    date: string;
    completed: boolean;
    activities: DailyMissionActivity[];
  };
}

const STORAGE_KEY = 'lughati_game_profile_v2';

// Profile Initializer
export function getOrCreateGameProfile(studentName = 'بطل لغتي'): StudentGameProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (studentName && parsed.studentName !== studentName) {
        parsed.studentName = studentName;
      }
      return parsed;
    }
  } catch (e) {}

  const initialProfile: StudentGameProfile = {
    studentName,
    totalStars: 15,
    streakDays: 3,
    levelBadge: 'فارس الحروف 🌟',
    tracks: {
      letters: { unlockedLevel: 1, starsEarned: 10, masteryPercentage: 35, completedLevels: [] },
      harakat: { unlockedLevel: 1, starsEarned: 5, masteryPercentage: 20, completedLevels: [] },
      madd_syllables: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
      words_spelling: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] },
      reading_fluency: { unlockedLevel: 1, starsEarned: 0, masteryPercentage: 0, completedLevels: [] }
    },
    mistakes: {
      confusingLetters: { 'ب': 2, 'ت': 1, 'د': 1 },
      weakHarakat: { 'kasra': 2, 'sukoon': 1 },
      weakMadd: {},
      spellingErrorsCount: 1,
      readingSpeedSlowCount: 0,
      masteredLetters: ['أ', 'م', 'ر', 'س'],
      masteredWords: ['أَسَد', 'قَلَم', 'بَاب'],
      totalGamesPlayed: 8,
      totalTimeMinutes: 24,
      lastActivityDate: new Date().toISOString()
    },
    dailyMission: generateDailyMission()
  };

  saveGameProfile(initialProfile);
  return initialProfile;
}

export function saveGameProfile(profile: StudentGameProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

// توليد 3 أنشطة يومية ذكية متكيفة مع مستوى وضعف الطفل
export function generateDailyMission(): { date: string; completed: boolean; activities: DailyMissionActivity[] } {
  const todayStr = new Date().toISOString().split('T')[0];
  const weakestSpelling = getWeakestSpellingSkill();

  const activities: DailyMissionActivity[] = [
    {
      id: 'mission_1',
      title: 'صيد حرف ميزك به النظام (ب أو م)',
      trackId: 'letters',
      gameIndex: 0,
      icon: '🎯',
      completed: false,
      targetCount: 3,
      currentCount: 0,
      reason: 'لتقوية تمييز شكل وصوت الحرف'
    },
    // نشاط إملائي تكيفي ذكي مبني على المهارة الأضعف لدى الطفل
    weakestSpelling.mastery < 85
      ? {
          id: 'mission_spelling_adaptive',
          title: `تحدي إتقان: ${weakestSpelling.title} (${weakestSpelling.mastery}% إتقان)`,
          trackId: 'words_spelling',
          gameIndex: 0,
          icon: '✍️',
          completed: false,
          targetCount: 3,
          currentCount: 0,
          reason: `تدريب علاجي لرفع نسبة الإتقان في ${weakestSpelling.title}`
        }
      : {
          id: 'mission_2',
          title: 'مصنع الحركات وتحدي السكون',
          trackId: 'harakat',
          gameIndex: 0,
          icon: '🌈',
          completed: false,
          targetCount: 3,
          currentCount: 0,
          reason: 'لإتقان نطق الفتحة والضمة والكسرة'
        },
    {
      id: 'mission_3',
      title: 'قراءة 5 كلمات مألوفة بسرعة',
      trackId: 'reading_fluency',
      gameIndex: 0,
      icon: '📖',
      completed: false,
      targetCount: 5,
      currentCount: 0,
      reason: 'للانتقال من التهجئة إلى الطلاقة'
    }
  ];

  return {
    date: todayStr,
    completed: false,
    activities
  };
}

// التغذية الراجعة اللطيفة (عدم معاقبة الطفل أبداً)
export const GENTLE_ENCOURAGEMENTS = [
  'حاول مرة أخرى 🌟',
  'أنت رائع، اقتربت جداً! 👏',
  'استمع مرة أخرى يا بطل 🔊',
  'فكر بهدوء، أنت قادر! 💖',
  'محاولة ممتازة، جرّب مجدداً ✨'
];

export function playGentleFeedback(attemptCount = 1): string {
  const msg = GENTLE_ENCOURAGEMENTS[Math.min(attemptCount - 1, GENTLE_ENCOURAGEMENTS.length - 1)];
  audioManager.speakArabic(msg, 0.9);
  return msg;
}

export function playSuccessFeedback(stars = 1): string {
  const msgs = ['أحسنت يا بطل! ⭐', 'رائع ومبدع! 🎉', 'إجابة صحيحة وممتازة! 🏆', 'فخور بك جداً! 🌟'];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  audioManager.playFanfare();
  audioManager.speakArabic(msg, 0.9);
  return msg;
}

// تسجيل الخطأ بطريقة تكيفية بدون إحراج الطفل
export function recordMistake(
  skillType: 'letter' | 'haraka' | 'madd' | 'spelling' | 'reading_slow',
  detail: string
): void {
  const profile = getOrCreateGameProfile();
  if (skillType === 'letter') {
    profile.mistakes.confusingLetters[detail] = (profile.mistakes.confusingLetters[detail] || 0) + 1;
  } else if (skillType === 'haraka') {
    profile.mistakes.weakHarakat[detail] = (profile.mistakes.weakHarakat[detail] || 0) + 1;
  } else if (skillType === 'madd') {
    profile.mistakes.weakMadd[detail] = (profile.mistakes.weakMadd[detail] || 0) + 1;
  } else if (skillType === 'spelling') {
    profile.mistakes.spellingErrorsCount += 1;
  } else if (skillType === 'reading_slow') {
    profile.mistakes.readingSpeedSlowCount += 1;
  }

  saveGameProfile(profile);
}

// تسجيل إتقان مهارة أو حرف
export function recordMastery(type: 'letter' | 'word', item: string): void {
  const profile = getOrCreateGameProfile();
  if (type === 'letter' && !profile.mistakes.masteredLetters.includes(item)) {
    profile.mistakes.masteredLetters.push(item);
  } else if (type === 'word' && !profile.mistakes.masteredWords.includes(item)) {
    profile.mistakes.masteredWords.push(item);
  }
  saveGameProfile(profile);
}

// إضافة نجوم وتحديث مستوى المسار
export function addTrackProgress(
  trackId: GameTrackId,
  starsToAdd: number,
  levelIndex: number,
  accuracyScore: number
): void {
  const profile = getOrCreateGameProfile();
  profile.totalStars += starsToAdd;

  const track = profile.tracks[trackId];
  track.starsEarned += starsToAdd;

  // إذا حقق نسبة 80% أو أكثر، يفتح المستوى التالي
  if (accuracyScore >= 80) {
    if (!track.completedLevels.includes(levelIndex)) {
      track.completedLevels.push(levelIndex);
    }
    if (track.unlockedLevel <= levelIndex + 1) {
      track.unlockedLevel = Math.min(8, levelIndex + 2);
    }
  }

  track.masteryPercentage = Math.min(100, Math.round((track.completedLevels.length / 6) * 100));

  // تحديث الشارة
  if (profile.totalStars >= 100) profile.levelBadge = 'ملك الطلاقة والقراءة 👑';
  else if (profile.totalStars >= 50) profile.levelBadge = 'بطل الكلمات الماهر 🚀';
  else if (profile.totalStars >= 25) profile.levelBadge = 'صائد الحركات الذكي 🌈';

  saveGameProfile(profile);
}
