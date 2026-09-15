export type GradeId = 'kg1' | 'kg2' | 'foundation' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6';

export interface LetterVowel {
  letter: string;
  name: string;
  fatha: string;
  damma: string;
  kasra: string;
  sukoon: string;
  madAlif: string;
  madWaw: string;
  madYaa: string;
  examples: {
    initial: string;
    medial: string;
    final: string;
  };
}

export interface GrammarPhenomenon {
  id: string;
  title: string;
  category: 'spelling' | 'grammar' | 'phonics' | 'style';
  summary: string;
  rule: string;
  examples: Array<{
    text: string;
    highlight: string;
    explanation: string;
  }>;
  exercises?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioPrompt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'reading' | 'poem' | 'grammar' | 'spelling' | 'calligraphy' | 'expression';
  text?: string;
  verses?: Array<{ first: string; second: string }>;
  audioText?: string;
  vocabulary?: Array<{ word: string; meaning: string; example: string }>;
  grammarFocus?: string;
  spellingFocus?: string;
  comprehensionQuestions?: QuizQuestion[];
  worksheetContent?: {
    instructions: string;
    tasks: string[];
  };
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  theme: string;
  iconName: string;
  color: string;
  lessons: Lesson[];
  phenomena: GrammarPhenomenon[];
}

export interface GradeCurriculum {
  id: GradeId;
  name: string;
  subtitle: string;
  ageGroup: string;
  color: string;
  accentColor: string;
  icon: string;
  description: string;
  keySkills: string[];
  units: Unit[];
}

export interface StudentProgress {
  studentName: string;
  grade: GradeId;
  stars: number;
  completedQuizzes: string[];
  completedLessons: string[];
  certificatesEarned: Array<{
    id: string;
    title: string;
    gradeName: string;
    date: string;
    score: number;
  }>;
}
