export type ReadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ReadingContentType = 
  | 'sentence' 
  | 'sentences_group' 
  | 'short_text' 
  | 'medium_text' 
  | 'long_text';

export type QuestionType = 
  | 'multiple_choice' 
  | 'order_events' 
  | 'find_word' 
  | 'wh_question' 
  | 'fill_blank' 
  | 'synonym_antonym';

export interface ComprehensionQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: number | string | string[]; // index for multiple choice, string for text/word, string[] for ordered items
  explanation?: string;
  targetWord?: string; // for find_word questions
  itemsToOrder?: string[]; // for event ordering
  category?: 'who' | 'where' | 'what' | 'why' | 'how' | 'general';
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  example?: string;
}

export interface ReadingTextItem {
  id: string;
  title: string;
  level: ReadingLevel;
  contentType: ReadingContentType;
  content: string; // Voweled Arabic text with full diacritics
  paragraphs?: string[]; // For Level 6 long text structured reading
  wordCount: number;
  targetSkills: string[]; // e.g. ["المد بالألف", "الشدة", "التاء المربوطة", "اللام الشمسية"]
  newVocabulary: VocabularyItem[];
  questions: ComprehensionQuestion[];
  expectedDurationSec: number; // in seconds
  audioUrl?: string;
  imageUrl?: string;
  orderIndex: number;
  isCustom?: boolean;
  createdAt?: string;
}

export interface StudentReadingRecord {
  textId: string;
  completed: boolean;
  bestDurationSec: number;
  wpm: number;
  comprehensionScore: number; // percentage 0-100
  fluencyStars: number; // 1-5
  completedAt: string;
  attemptCount: number;
}
