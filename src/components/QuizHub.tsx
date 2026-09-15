import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Star, 
  Award, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  ChevronLeft, 
  Flame,
  BrainCircuit
} from 'lucide-react';
import { GradeId, QuizQuestion } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuizHubProps {
  currentGrade: GradeId;
  onAddStars: (count: number) => void;
  onQuizCompleted: (quizId: string) => void;
}

export const QuizHub: React.FC<QuizHubProps> = ({
  currentGrade,
  onAddStars,
  onQuizCompleted
}) => {
  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  // Collect all questions for this grade
  const gradeQuestions: QuizQuestion[] = [];
  currentGradeData.units.forEach((u) => {
    u.lessons.forEach((l) => {
      if (l.comprehensionQuestions) {
        gradeQuestions.push(...l.comprehensionQuestions);
      }
    });
  });

  // Fallback / default questions if unit questions are few
  const defaultQuestions: QuizQuestion[] = [
    {
      id: 'gen_q1',
      question: 'أي الكلمات التالية تحوي مداً بالألف؟',
      options: ['كِتَابٌ', 'مَطَرٌ', 'سَفَرٌ', 'قَلَمٌ'],
      correctIndex: 0,
      explanation: 'كلمة (كِتَابٌ) تحوي فتحة على التاء تليها ألف المد (تَا).'
    },
    {
      id: 'gen_q2',
      question: 'ما نوع اللام في كلمة (القَلَمُ)؟',
      options: ['لام قمرية', 'لام شمسية', 'حرف أصلي', 'حرف نداء'],
      correctIndex: 0,
      explanation: 'اللام قمرية لأنها كُتبت ونُطقت وعليها سكون.'
    },
    {
      id: 'gen_q3',
      question: 'ما هو المبتدأ في جملة: (العِلْمُ نُورٌ)؟',
      options: ['العِلْمُ', 'نُورٌ', 'الجملة', 'لا يوجد مبتدأ'],
      correctIndex: 0,
      explanation: 'المبتدأ هو الاسم المرفوع الذي ابتدأت به الجملة وهو (العِلْمُ).'
    },
    {
      id: 'gen_q4',
      question: 'الهمزة في كلمة (اسْتَغْفَرَ) هي:',
      options: ['همزة وصل', 'همزة قطع', 'همزة متوسطة', 'همزة متطرفة'],
      correctIndex: 0,
      explanation: 'تسقط في النطق عند وصلها بالواو (وَاسْتَغْفَرَ) فهي همزة وصل.'
    },
  ];

  const questionsPool = gradeQuestions.length > 0 ? gradeQuestions : defaultQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questionsPool[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQ.correctIndex) {
      audioManager.playCorrect();
      setScore((prev) => prev + 1);
      onAddStars(5);
    } else {
      audioManager.playWrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questionsPool.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      audioManager.playFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      onQuizCompleted(`quiz_${currentGrade}`);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>بنك التمارين والأسئلة التفاعلية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-alexandria">
            تحدي مهارات ({currentGradeData.name})
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1">
            أجب عن الأسئلة المنهجية، عزز نقاطك، واكسب نجوم التميز وأوسمة لغتي!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-md">
            ★
          </div>
          <div>
            <p className="text-xs text-emerald-200">النتيجة الحالية</p>
            <p className="text-xl font-bold">{score} / {questionsPool.length}</p>
          </div>
        </div>
      </div>

      {/* Quiz Card Arena */}
      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-6 pb-4 border-b border-slate-100">
            <span>السؤال {currentIdx + 1} من {questionsPool.length}</span>
            <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questionsPool.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text & Speaker */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-bold font-amiri text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
              <button
                onClick={() => audioManager.speakArabic(currentQ.question)}
                className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-transform active:scale-95"
                title="استمع للسؤال"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswer === oIdx;
              const isCorrect = isAnswerSubmitted && oIdx === currentQ.correctIndex;
              const isWrong = isAnswerSubmitted && isSelected && oIdx !== currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
              if (isSelected && !isAnswerSubmitted) {
                btnStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold';
              } else if (isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
              } else if (isWrong) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between group active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-xs font-bold flex items-center justify-center text-slate-600 group-hover:border-emerald-500">
                      {oIdx === 0 ? 'أ' : oIdx === 1 ? 'ب' : oIdx === 2 ? 'ج' : 'د'}
                    </span>
                    <span className="text-base font-amiri font-bold">{opt}</span>
                  </div>

                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Alert when submitted */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl mb-6 border text-xs sm:text-sm font-medium ${
              selectedAnswer === currentQ.correctIndex
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="font-bold block mb-1">
                {selectedAnswer === currentQ.correctIndex ? '🌟 ممتاز! إجابة صحيحة' : '💡 توضيح القاعدة:'}
              </span>
              {currentQ.explanation}
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'انقر للمتابعة للسؤال التالي' : 'اختر إجابتك ثم انقر تحقق'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                id="btn-check-quiz-answer"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                تحقق من الإجابة
              </button>
            ) : (
              <button
                id="btn-next-quiz-question"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Victory Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
            🏆
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-alexandria mb-2">
            مبارك يا بطل! أتممت التحدي بنجاح
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            لقد حققت <span className="font-bold text-emerald-700">{score}</span> من أصل <span className="font-bold">{questionsPool.length}</span> في اختبار مهارات {currentGradeData.name}.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التحدي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
