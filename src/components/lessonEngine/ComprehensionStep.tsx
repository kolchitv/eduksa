import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { InteractiveLessonData, InteractiveStoryEvent } from '../../types/interactiveLesson';
import { audioManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ComprehensionStepProps {
  lessonData: InteractiveLessonData;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const ComprehensionStep: React.FC<ComprehensionStepProps> = ({
  lessonData,
  onComplete,
  onNext
}) => {
  const { comprehension, readingStory } = lessonData;
  const questions = comprehension.questions;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHintParagraph, setShowHintParagraph] = useState<string | null>(null);
  const [mode, setMode] = useState<'questions' | 'sequence'>('questions');

  // Sequence events game state
  const [shuffledEvents, setShuffledEvents] = useState<InteractiveStoryEvent[]>(() => {
    return [...comprehension.sequenceEvents].sort(() => Math.random() - 0.5);
  });
  const [userSequence, setUserSequence] = useState<InteractiveStoryEvent[]>([]);
  const [sequenceDone, setSequenceDone] = useState(false);

  const currentQ = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // Already answered
    audioManager.play('click');
    const isCorrect = optIndex === (currentQ.correctAnswer as number);

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));

    if (isCorrect) {
      audioManager.playCorrect();
      setShowHintParagraph(null);
    } else {
      audioManager.playWrong();
      if (currentQ.hintParagraphId) {
        setShowHintParagraph(currentQ.hintParagraphId);
      }
    }
  };

  const handleNextQuestion = () => {
    setShowHintParagraph(null);
    if (!isLastQuestion) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setMode('sequence');
    }
  };

  // Sequence game handlers
  const handlePickEvent = (event: InteractiveStoryEvent) => {
    audioManager.play('click');
    if (userSequence.some((e) => e.id === event.id)) return;

    const nextSeq = [...userSequence, event];
    setUserSequence(nextSeq);

    // If all events picked, evaluate
    if (nextSeq.length === comprehension.sequenceEvents.length) {
      const allCorrect = nextSeq.every((e, idx) => e.order === idx + 1);
      if (allCorrect) {
        audioManager.playFanfare();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setSequenceDone(true);
      } else {
        audioManager.playWrong();
      }
    }
  };

  const handleResetSequence = () => {
    setUserSequence([]);
    setSequenceDone(false);
    setShuffledEvents([...comprehension.sequenceEvents].sort(() => Math.random() - 0.5));
  };

  const calculateTotalScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === (q.correctAnswer as number)) {
        correctCount++;
      }
    });
    const qScore = (correctCount / questions.length) * 70;
    const seqScore = sequenceDone ? 30 : 0;
    return Math.round(qScore + seqScore);
  };

  const handleFinishStep = () => {
    const finalScore = calculateTotalScore();
    onComplete(finalScore);
    onNext();
  };

  const hintParagraphObj = readingStory.paragraphs.find((p) => p.id === showHintParagraph);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-2xl font-black shadow-xs">
            🧠
          </div>
          <div>
            <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              المحطة الثانية • الفهم القرائي والاستيعاب
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-1">
              {mode === 'questions' ? 'أَسْئِلَةُ فَهْمِ الْقِصَّةِ (أُجِيبُ)' : 'لُعْبَةُ تَرْتِيبِ أَحْدَاثِ الْقِصَّةِ 🎬'}
            </h3>
          </div>
        </div>

        {/* Sub-mode switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setMode('questions')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'questions'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            الأسئلة ({currentQIndex + 1}/{questions.length})
          </button>
          <button
            onClick={() => setMode('sequence')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'sequence'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            ترتيب الأحداث 🎬
          </button>
        </div>
      </div>

      {/* Mode 1: Questions (One question at a time) */}
      {mode === 'questions' && (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-black text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                السؤال {currentQIndex + 1} من {questions.length}
              </span>
              <button
                onClick={() => audioManager.speakArabic(currentQ.question, 0.85)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-purple-900 border border-slate-200 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>استمع للسؤال 🔊</span>
              </button>
            </div>

            <h4 className="font-alexandria text-xl sm:text-2xl font-black text-slate-900 leading-relaxed">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isAnswered = selectedAnswers[currentQ.id] !== undefined;
                const isCorrect = optIdx === (currentQ.correctAnswer as number);

                let btnStyle = 'bg-slate-50 hover:bg-purple-50/50 text-slate-800 border-slate-200 hover:border-purple-300';
                if (isAnswered) {
                  if (isSelected && isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 text-rose-900 border-rose-300';
                  } else if (isCorrect) {
                    btnStyle = 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`p-4 sm:p-5 rounded-2xl text-right text-base sm:text-lg font-bold font-alexandria transition-all border flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Hint for wrong answer */}
            {selectedAnswers[currentQ.id] !== undefined && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {selectedAnswers[currentQ.id] === (currentQ.correctAnswer as number) ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>⭐ أحسنت إجابة صحيحة! {currentQ.explanation}</span>
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>اقرأ الجزء مرة أخرى 🔎</span>
                      </span>
                      <button
                        onClick={() => setShowHintParagraph(showHintParagraph ? null : currentQ.hintParagraphId || 'p1')}
                        className="text-xs font-black text-purple-700 underline cursor-pointer"
                      >
                        {showHintParagraph ? 'إخفاء الفقرة' : 'إظهار الفقرة المرتبطة'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Inline Hint Paragraph from the story */}
                {showHintParagraph && hintParagraphObj && (
                  <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black text-purple-900 bg-purple-200 px-2 py-0.5 rounded-full">
                        مراجعة الفقرة المرتبطة من القصة:
                      </span>
                      <button
                        onClick={() => audioManager.speakArabic(hintParagraphObj.text, 0.85)}
                        className="text-xs text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع</span>
                      </button>
                    </div>
                    <p className="font-amiri text-xl leading-loose text-slate-900">
                      {hintParagraphObj.text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation between questions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentQIndex > 0) {
                  setCurrentQIndex((prev) => prev - 1);
                  setShowHintParagraph(null);
                }
              }}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {selectedAnswers[currentQ.id] !== undefined && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{isLastQuestion ? 'الانتقال إلى ترتيب أحداث القصة 🎬' : 'السؤال التالي'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Sequence Events Game (لعبة ترتيب أحداث القصة) */}
      {mode === 'sequence' && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-3xl text-xs text-purple-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span><strong>تعليمات اللعبة:</strong> انقر على بطاقات أحداث القصة بالترتيب الصحيح من البداية إلى النهاية!</span>
            </span>
            <button
              onClick={handleResetSequence}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة</span>
            </button>
          </div>

          {/* Chosen Sequence Area */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-purple-900 mb-2">
              الأحداث المرتبة ({userSequence.length} من {comprehension.sequenceEvents.length}):
            </h4>

            {userSequence.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold">
                انقر على البطاقات بالأسفل لترتيبها هنا بالترتيب الصحيح ⬇️
              </div>
            ) : (
              <div className="space-y-2">
                {userSequence.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-1 duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-alexandria">
                        {ev.text}
                      </span>
                    </div>
                    {ev.order === idx + 1 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                        صحيح ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remaining Available Events */}
          {!sequenceDone && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700">
                اختر الحدث التالي:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shuffledEvents.map((ev) => {
                  const isPicked = userSequence.some((e) => e.id === ev.id);
                  if (isPicked) return null;

                  return (
                    <button
                      key={ev.id}
                      onClick={() => handlePickEvent(ev)}
                      className="p-4 rounded-2xl bg-white hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 text-right text-xs sm:text-sm font-bold text-slate-900 transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-between"
                    >
                      <span>{ev.text}</span>
                      <span className="text-xs text-purple-600 font-bold shrink-0 mr-2">+ إضافة</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sequence Complete Celebration */}
          {sequenceDone && (
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-lg text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="text-4xl">🎉</div>
              <h4 className="text-xl font-black font-alexandria">
                رائع! فهمت أحداث القصة ورتّبتها ببراعة!
              </h4>
              <p className="text-xs text-emerald-100 max-w-lg mx-auto">
                أظهرت فهماً استيعابياً متميزاً لتسلسل قصة الصديقان، وأنت جاهز الآن لمحطة تنمية اللغة والمفردات!
              </p>
            </div>
          )}

          {/* Bottom Next Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setMode('questions')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
            >
              العودة للأسئلة
            </button>

            <button
              onClick={handleFinishStep}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>انْتَقِلْ إِلَى أُنَمِّي لُغَتِي 🌱</span>
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
