import { InteractiveLessonData } from '../types/interactiveLesson';
import { GRADE2_ALSADIQAN_LESSON } from './lessons/grade2_alsadiqan';

export const INTERACTIVE_LESSONS_REGISTRY: Record<string, InteractiveLessonData> = {
  'g2_u2_l1': GRADE2_ALSADIQAN_LESSON,
  'alsadiqan': GRADE2_ALSADIQAN_LESSON
};

export const getInteractiveLesson = (lessonId: string): InteractiveLessonData | null => {
  if (!lessonId) return null;
  return INTERACTIVE_LESSONS_REGISTRY[lessonId] || null;
};

export const hasInteractiveLesson = (lessonId: string): boolean => {
  return Boolean(INTERACTIVE_LESSONS_REGISTRY[lessonId]);
};
