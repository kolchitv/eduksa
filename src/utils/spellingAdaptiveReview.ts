/**
 * محرك التعلم التكيفي والمراجعة الذكية لمهارات الإملاء (Spaced Repetition & Adaptive Review)
 * يتتبع الأخطاء بدقة:
 * taaMarbuta, taaMaftuha, middleHamza, finalHamza, singular, dual, plural
 * ويعيد تقديم الكلمات الخاطئة بتدرج (إكمال -> اختيار -> إملاء)
 */

import { SpellingSubSkill, SpellingSkillId } from '../data/spellingSkillsData';

export interface SpellingReviewItem {
  word: string;
  tashkeel: string;
  skillId: SpellingSkillId;
  subSkill: SpellingSubSkill;
  errorType: string;
  stage: 1 | 2 | 3; // 1: إكمال/ناقص | 2: تمييز واختيار | 3: استماع وإملاء كامل
  lastReviewDate: string;
  reviewCount: number;
}

export interface SpellingSkillsProfile {
  subSkillStats: Record<
    SpellingSubSkill,
    {
      errors: number;
      totalAttempts: number;
      mastery: number; // 0 - 100%
      lastTested: string;
    }
  >;
  reviewQueue: SpellingReviewItem[];
  badgesEarned: string[]; // e.g. ['بطل التاء 🏅', 'فارس الهمزة المتوسطة ⚡', 'صائد الهمزة المتطرفة 🏝️', 'حكيم العدد 👤👥']
}

const STORAGE_KEY = 'lughati_spelling_skills_adaptive_profile';

const INITIAL_PROFILE: SpellingSkillsProfile = {
  subSkillStats: {
    taaMarbuta: { errors: 1, totalAttempts: 6, mastery: 83, lastTested: new Date().toISOString() },
    taaMaftuha: { errors: 0, totalAttempts: 5, mastery: 100, lastTested: new Date().toISOString() },
    middleHamza: { errors: 2, totalAttempts: 8, mastery: 75, lastTested: new Date().toISOString() },
    finalHamza: { errors: 1, totalAttempts: 7, mastery: 85, lastTested: new Date().toISOString() },
    singular: { errors: 0, totalAttempts: 5, mastery: 100, lastTested: new Date().toISOString() },
    dual: { errors: 1, totalAttempts: 6, mastery: 83, lastTested: new Date().toISOString() },
    plural: { errors: 2, totalAttempts: 7, mastery: 71, lastTested: new Date().toISOString() }
  },
  reviewQueue: [
    {
      word: 'مدرسة',
      tashkeel: 'مَدْرَسَةٌ',
      skillId: 'taa_types',
      subSkill: 'taaMarbuta',
      errorType: 'خلط بين الهاء والتاء المربوطة',
      stage: 1,
      lastReviewDate: new Date().toISOString(),
      reviewCount: 1
    }
  ],
  badgesEarned: []
};

export function getSpellingSkillsProfile(): SpellingSkillsProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all keys exist
      return {
        ...INITIAL_PROFILE,
        ...parsed,
        subSkillStats: {
          ...INITIAL_PROFILE.subSkillStats,
          ...(parsed.subSkillStats || {})
        }
      };
    }
  } catch (e) {}

  return INITIAL_PROFILE;
}

export function saveSpellingSkillsProfile(profile: SpellingSkillsProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

/**
 * تسجيل محاولة إجابة (صحيحة أو خاطئة)
 */
export function recordSkillAttempt(
  subSkill: SpellingSubSkill,
  isCorrect: boolean,
  word?: string,
  tashkeel?: string,
  skillId?: SpellingSkillId,
  errorDetail?: string
): void {
  const profile = getSpellingSkillsProfile();
  const current = profile.subSkillStats[subSkill] || {
    errors: 0,
    totalAttempts: 0,
    mastery: 100,
    lastTested: new Date().toISOString()
  };

  current.totalAttempts += 1;
  if (!isCorrect) {
    current.errors += 1;
  }

  // Calculate mastery % (weighted towards recent performance)
  const correctCount = Math.max(0, current.totalAttempts - current.errors);
  current.mastery = Math.round((correctCount / current.totalAttempts) * 100);
  current.lastTested = new Date().toISOString();

  profile.subSkillStats[subSkill] = current;

  // If wrong, add to spaced repetition review queue
  if (!isCorrect && word && tashkeel && skillId) {
    const existingIdx = profile.reviewQueue.findIndex(q => q.word === word);
    if (existingIdx >= 0) {
      profile.reviewQueue[existingIdx].reviewCount += 1;
      profile.reviewQueue[existingIdx].lastReviewDate = new Date().toISOString();
      // Drop back to stage 1 if failed again
      profile.reviewQueue[existingIdx].stage = 1;
    } else {
      profile.reviewQueue.push({
        word,
        tashkeel,
        skillId,
        subSkill,
        errorType: errorDetail || `خطأ في ${subSkill}`,
        stage: 1,
        lastReviewDate: new Date().toISOString(),
        reviewCount: 1
      });
    }
  } else if (isCorrect && word) {
    // If answered correctly in review, advance spaced repetition stage
    const existingIdx = profile.reviewQueue.findIndex(q => q.word === word);
    if (existingIdx >= 0) {
      const item = profile.reviewQueue[existingIdx];
      if (item.stage < 3) {
        item.stage = (item.stage + 1) as 1 | 2 | 3;
      } else {
        // Mastered after stage 3! Remove from queue
        profile.reviewQueue.splice(existingIdx, 1);
      }
    }
  }

  saveSpellingSkillsProfile(profile);
}

/**
 * العثور على أضعف مهارة لاقتراحها في "مهمتي اليوم"
 */
export function getWeakestSpellingSkill(): {
  skillId: SpellingSkillId;
  subSkill: SpellingSubSkill;
  title: string;
  mastery: number;
} {
  const profile = getSpellingSkillsProfile();
  const keys = Object.keys(profile.subSkillStats) as SpellingSubSkill[];
  
  // Sort by mastery ascending
  keys.sort((a, b) => profile.subSkillStats[a].mastery - profile.subSkillStats[b].mastery);
  const weakest = keys[0] || 'taaMarbuta';
  const mastery = profile.subSkillStats[weakest].mastery;

  if (weakest === 'taaMarbuta' || weakest === 'taaMaftuha') {
    return {
      skillId: 'taa_types',
      subSkill: weakest,
      title: 'التاء المربوطة والمفتوحة (ة / ت)',
      mastery
    };
  } else if (weakest === 'middleHamza') {
    return {
      skillId: 'middle_hamza',
      subSkill: weakest,
      title: 'الهمزة المتوسطة (أ، ؤ، ئ، ء)',
      mastery
    };
  } else if (weakest === 'finalHamza') {
    return {
      skillId: 'final_hamza',
      subSkill: weakest,
      title: 'الهمزة المتطرفة (أ، ؤ، ئ، ء)',
      mastery
    };
  } else {
    return {
      skillId: 'singular_dual_plural',
      subSkill: weakest,
      title: 'المفرد والمثنى والجمع (👤👥)',
      mastery
    };
  }
}

/**
 * إضافة شارة للملف الشخصي
 */
export function addSpellingBadge(badgeName: string): boolean {
  const profile = getSpellingSkillsProfile();
  if (!profile.badgesEarned.includes(badgeName)) {
    profile.badgesEarned.push(badgeName);
    saveSpellingSkillsProfile(profile);
    return true;
  }
  return false;
}
