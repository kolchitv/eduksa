export type LessonSkillType = 
  | 'reading'
  | 'comprehension'
  | 'vocabulary'
  | 'shadda'
  | 'wordAnalysis'
  | 'fluency'
  | 'harakat'
  | 'dictation';

export interface InteractiveLessonParagraph {
  id: string;
  paragraphNumber: number;
  text: string;
  audioPrompt?: string;
  speaker?: string;
}

export interface InteractiveLessonVocabItem {
  word: string;
  meaning: string;
  example?: string;
  rootOrType?: string;
}

export interface InteractiveLessonQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'oral';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  hintParagraphId?: string; // الفقرة المرتبطة بالسؤال للعودة إليها ومراجعتها
  audioText?: string;
}

export interface InteractiveStoryEvent {
  id: string;
  text: string;
  order: number;
  hint?: string;
}

export interface InteractiveWordMap {
  targetWord: string;
  type: 'اسْمٌ' | 'فِعْلٌ' | 'حَرْفٌ';
  synonym: string; // مرادفها
  antonym: string; // ضدها
  sentenceExample: string; // في جملة
}

export interface InteractiveShaddaLetter {
  word: string;
  shaddaLetter: string;
  vowelWithShadda: string;
  breakdown: string; // e.g. نّ = نْ + نَ
  meaning?: string;
}

export interface InteractiveShaddaHunterWord {
  id: string;
  word: string;
  hasShadda: boolean;
  shaddaLetter?: string;
}

export interface InteractivePlaceShaddaItem {
  id: string;
  wordWithoutShadda: string;
  correctWord: string;
  letters: string[];
  shaddaIndex: number;
  audioPrompt: string;
}

export interface InteractiveWordAnalysisItem {
  id: string;
  word: string;
  syllables: string[];
  syllableTypes?: string[]; // e.g. ['مقطع ساكن', 'حرف مد']
  explanation: string;
  audioPrompt: string;
}

export interface InteractiveFluencySentence {
  id: string;
  text: string;
  audioPrompt: string;
  highlightWords?: string[];
}

export type ArabicHarakatMark = 'َ' | 'ُ' | 'ِ' | 'ْ' | 'ّ' | 'ً' | 'ٌ' | 'ٍ';

export interface InteractiveHarakatHunterItem {
  id: string;
  wordWithBlank: string;
  fullWord: string;
  targetChar: string;
  missingHarakat: ArabicHarakatMark;
  harakatOptions: Array<ArabicHarakatMark>;
  hint: string;
  audioPrompt: string;
}

export interface InteractiveHiddenWordItem {
  id: string;
  word: string;
  tashkeel: string;
  audioPrompt: string;
  meaning?: string;
}

export interface InteractiveChallengeQuestion {
  id: string;
  skillCategory: LessonSkillType;
  skillNameAr: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveLessonData {
  id: string;
  grade: string; // 'grade2'
  gradeName: string; // 'الصف الثاني الابتدائي'
  semester: number; // 1
  unitId: string; // 'g2_u2'
  unitTitle: string; // 'أَصْدِقَائِي وَجِيرَانِي'
  lessonNumber: number; // 1
  lessonTitle: string; // 'الصَّدِيقَانِ'
  subtitle: string; // 'قراءة • فهم • مفردات • تحليل • طلاقة • إملاء'
  targetAudience: string;

  // 1. أقرأ القصة
  readingStory: {
    title: string;
    paragraphs: InteractiveLessonParagraph[];
    fullText: string;
    audioText: string;
    clickableVocabulary: InteractiveLessonVocabItem[];
  };

  // 2. أفهم القصة
  comprehension: {
    title: string;
    description: string;
    questions: InteractiveLessonQuestion[];
    sequenceEvents: InteractiveStoryEvent[];
  };

  // 3. أنمي لغتي
  vocabularyGarden: {
    title: string;
    matchPairs: Array<{
      id: string;
      word: string;
      meaning: string;
      distractors: string[];
    }>;
    wordMap: InteractiveWordMap;
  };

  // 4. أقرأ وألاحظ
  observationSkill: {
    title: string;
    skillName: string; // 'ملاحظة الحرف المشدد'
    sampleSentence: string;
    shaddaLetters: InteractiveShaddaLetter[];
    shaddaHunterWords: InteractiveShaddaHunterWord[];
    placeShaddaExercise: InteractivePlaceShaddaItem[];
    expressiveSentences: Array<{
      id: string;
      text: string;
      speaker: string;
      emotion: string;
      audioPrompt: string;
    }>;
  };

  // 5. أحلل الكلمات (قطار المقاطع)
  wordAnalysis: {
    title: string;
    words: InteractiveWordAnalysisItem[];
  };

  // 6. الطلاقة القرائية (انطلق في القراءة)
  fluency: {
    title: string;
    sentences: InteractiveFluencySentence[];
  };

  // 7. الاستعداد للإملاء
  dictationPrep: {
    title: string;
    requiredDictationText: string;
    difficultWords: string[];
    harakatHunter: InteractiveHarakatHunterItem[];
    hiddenWords: InteractiveHiddenWordItem[];
  };

  // 8. تحدي الدرس النهائي
  challenge: {
    title: string;
    badgeName: string; // 'بطل الصديقان'
    badgeIcon: string;
    questions: InteractiveChallengeQuestion[];
  };
}

export interface StudentLessonSkillScores {
  reading: number;
  comprehension: number;
  vocabulary: number;
  shadda: number;
  wordAnalysis: number;
  fluency: number;
  harakat: number;
  dictation: number;
}

export interface StudentLessonProgressRecord {
  lessonId: string;
  lastUpdated: string;
  currentStep: number;
  completedSteps: number[];
  skillScores: StudentLessonSkillScores;
  starsEarned: number;
  challengeCompleted: boolean;
  fluencyTriesCount: number;
  recommendedNextStep?: number;
}
