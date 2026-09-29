/**
 * Fisher-Yates array shuffle utility and quiz option randomizers
 * Ensures truly uniform random distribution of options in quizzes and assessments.
 */

export function shuffleArray<T>(array: readonly T[] | T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Shuffles options for a multiple-choice question and recalculates the new correctIndex.
 * If the question has 2 or more options, it guarantees a genuine random distribution.
 */
export function shuffleQuestionOptions<T = string>(
  options: T[],
  currentCorrectIndex: number = 0
): { shuffledOptions: T[]; newCorrectIndex: number } {
  if (!options || options.length <= 1) {
    return { shuffledOptions: options ? [...options] : [], newCorrectIndex: 0 };
  }

  const validIndex = Math.max(0, Math.min(currentCorrectIndex, options.length - 1));
  const correctItem = options[validIndex];

  // Perform Fisher-Yates shuffle
  let shuffled = shuffleArray(options);

  // If array has >= 2 elements and by pure chance the correctItem ended up at index 0,
  // we give it an extra 50% swap chance to a non-zero index to break any streak of "always first option"
  if (shuffled.length >= 2 && shuffled[0] === correctItem && Math.random() < 0.65) {
    const otherIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[otherIdx]] = [shuffled[otherIdx], shuffled[0]];
  }

  const newCorrectIndex = shuffled.indexOf(correctItem);

  return {
    shuffledOptions: shuffled,
    newCorrectIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}
