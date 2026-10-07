import { 
  StudentLessonProgressRecord, 
  LessonSkillType 
} from '../types/interactiveLesson';

const STORAGE_PREFIX = 'lughati_lesson_progress_';

export const getInitialLessonProgress = (lessonId: string): StudentLessonProgressRecord => {
  return {
    lessonId,
    lastUpdated: new Date().toISOString(),
    currentStep: 1,
    completedSteps: [],
    skillScores: {
      reading: 0,
      comprehension: 0,
      vocabulary: 0,
      shadda: 0,
      wordAnalysis: 0,
      fluency: 0,
      harakat: 0,
      dictation: 0
    },
    starsEarned: 0,
    challengeCompleted: false,
    fluencyTriesCount: 0
  };
};

export const loadStudentLessonProgress = (lessonId: string): StudentLessonProgressRecord => {
  if (typeof window === 'undefined') return getInitialLessonProgress(lessonId);
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${lessonId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getInitialLessonProgress(lessonId),
        ...parsed,
        skillScores: {
          ...getInitialLessonProgress(lessonId).skillScores,
          ...(parsed.skillScores || {})
        }
      };
    }
  } catch (e) {
    console.error('Failed to load student lesson progress', e);
  }
  return getInitialLessonProgress(lessonId);
};

export const saveStudentLessonProgress = (progress: StudentLessonProgressRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
      recommendedNextStep: getRecommendedNextStep(progress)
    };
    localStorage.setItem(`${STORAGE_PREFIX}${progress.lessonId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save student lesson progress', e);
  }
};

/**
 * Calculates adaptive recommendation based on the student's weakest or incomplete skill
 * Step 1: Reading
 * Step 2: Comprehension
 * Step 3: Vocabulary
 * Step 4: Shadda observation
 * Step 5: Word analysis
 * Step 6: Fluency
 * Step 7: Dictation prep
 * Step 8: Challenge
 */
export const getRecommendedNextStep = (progress: StudentLessonProgressRecord): number => {
  // If challenge is not completed and all previous steps are done, recommend challenge
  if (progress.completedSteps.length >= 7 && !progress.challengeCompleted) {
    return 8;
  }

  // Check which uncompleted step comes next
  for (let s = 1; s <= 7; s++) {
    if (!progress.completedSteps.includes(s)) {
      return s;
    }
  }

  // If all completed, check which skill has the lowest percentage
  const mapping: Array<{ step: number; score: number }> = [
    { step: 1, score: progress.skillScores.reading },
    { step: 2, score: progress.skillScores.comprehension },
    { step: 3, score: progress.skillScores.vocabulary },
    { step: 4, score: progress.skillScores.shadda },
    { step: 5, score: progress.skillScores.wordAnalysis },
    { step: 6, score: progress.skillScores.fluency },
    { step: 7, score: progress.skillScores.dictation }
  ];

  mapping.sort((a, b) => a.score - b.score);
  return mapping[0].step;
};

export const getStepNameAr = (step: number): string => {
  switch (step) {
    case 1: return 'أَقْرَأُ الْقِصَّةَ 📖';
    case 2: return 'أَفْهَمُ الْقِصَّةَ 🧠';
    case 3: return 'أُنَمِّي لُغَتِي 🌱';
    case 4: return 'أَقْرَأُ وَأُلاحِظُ 👀';
    case 5: return 'أُحَلِّلُ الْكَلِمَاتِ 🧩';
    case 6: return 'أَتَدَرَّبُ عَلَى الطَّلاقَةِ 🚀';
    case 7: return 'أَسْتَعِدُّ لِلإِمْلاءِ ✍️';
    case 8: return 'تَحَدِّي الدَّرْسِ 🏆';
    default: return 'المحطة التعليمية';
  }
};
