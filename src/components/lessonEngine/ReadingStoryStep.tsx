import React, { useState } from 'react';
import { Volume2, RotateCcw, CheckCircle2, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { InteractiveLessonData } from '../../types/interactiveLesson';
import { audioManager } from '../../utils/audio';

interface ReadingStoryStepProps {
  lessonData: InteractiveLessonData;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const ReadingStoryStep: React.FC<ReadingStoryStepProps> = ({
  lessonData,
  onComplete,
  onNext
}) => {
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaning: string; example?: string } | null>(null);
  const [readParagraphs, setReadParagraphs] = useState<string[]>([]);
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const { readingStory } = lessonData;

  const handlePlayParagraph = (text: string, id: string) => {
    audioManager.speakArabic(text, 0.85);
    if (!readParagraphs.includes(id)) {
      setReadParagraphs((prev) => [...prev, id]);
    }
  };

  const handlePlayFullStory = () => {
    setIsPlayingFull(true);
    audioManager.speakArabic(readingStory.audioText, 0.85);
    setReadParagraphs(readingStory.paragraphs.map((p) => p.id));
    setTimeout(() => setIsPlayingFull(false), 8000);
  };

  const handleWordClick = (word: string) => {
    audioManager.speakArabic(word, 0.85);
    // Find vocabulary meaning
    const clean = word.replace(/[.,:؛،?!()\-]/g, '').trim();
    const vocab = readingStory.clickableVocabulary.find(
      (v) => v.word.replace(/[.,:؛،?!()\-]/g, '').trim() === clean
    );
    if (vocab) {
      setSelectedWord(vocab);
    }
  };

  const handleFinishReading = () => {
    audioManager.playCorrect();
    onComplete(100);
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl font-black shadow-xs">
            📖
          </div>
          <div>
            <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              المحطة الأولى • مهارة القراءة والاستماع
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria mt-1">
              {readingStory.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePlayFullStory}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingFull ? 'جاري القراءة...' : '🔊 استمع للقصة كاملة'}</span>
          </button>

          <button
            onClick={() => {
              audioManager.stopSpeaking();
              handlePlayFullStory();
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            title="إعادة القراءة"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">🔁 اقرأ مرة أخرى</span>
          </button>
        </div>
      </div>

      {/* Helpful instruction banner */}
      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3 text-xs text-sky-900">
        <Lightbulb className="w-4 h-4 text-sky-600 shrink-0" />
        <span>
          💡 <strong>نصيحة للبطل الصغير:</strong> اقرأ كل فقرة بهدوء، ويمكنك النقر على أي كلمة لسماع نطقها، والكلمات الملونة تظهر لك معناها!
        </span>
      </div>

      {/* Paragraphs Cards (Comfortable, well-spaced child view) */}
      <div className="space-y-4">
        {readingStory.paragraphs.map((p, idx) => {
          const isRead = readParagraphs.includes(p.id);
          return (
            <div
              key={p.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 ${
                isRead
                  ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-200'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-slate-500">
                    {p.speaker ? `الجزء (${p.speaker})` : `الفقرة ${idx + 1}`}
                  </span>
                </div>

                <button
                  onClick={() => handlePlayParagraph(p.text, p.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>استمع للفقرة 🔊</span>
                </button>
              </div>

              {/* Text with large clear font and clickable words */}
              <p className="font-amiri text-2xl sm:text-3xl leading-[2.2] sm:leading-[2.4] text-slate-900 text-right select-text">
                {p.text.split(' ').map((rawWord, wIdx) => {
                  const clean = rawWord.replace(/[.,:؛،?!()\-]/g, '').trim();
                  const isVocab = readingStory.clickableVocabulary.some(
                    (v) => v.word.replace(/[.,:؛،?!()\-]/g, '').trim() === clean
                  );

                  return (
                    <span
                      key={wIdx}
                      onClick={() => handleWordClick(rawWord)}
                      className={`inline-block px-1 rounded-lg transition-all cursor-pointer ${
                        isVocab
                          ? 'bg-amber-100/80 text-amber-950 font-bold hover:bg-amber-200 underline decoration-amber-400 decoration-2 underline-offset-4'
                          : 'hover:bg-slate-100 hover:text-emerald-800'
                      }`}
                      title={isVocab ? 'انقر لرؤية المعنى وسماع النطق' : 'انقر لسماع النطق'}
                    >
                      {rawWord}{' '}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Word Popover / Meaning Card */}
      {selectedWord && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl shadow-sm flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-amiri text-xl font-black text-amber-950">
                  {selectedWord.word}
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full">
                  معنى الكلمة
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                {selectedWord.meaning}
              </p>
              {selectedWord.example && (
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  مثال: {selectedWord.example}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedWord(null)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Completion & Next Button */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-bold">
          ⭐ أنجز قراءة وفهم القصة للانتقال إلى أسئلة الفهم!
        </div>

        <button
          onClick={handleFinishReading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>أَتْمَمْتُ الْقِرَاءَةَ.. انْتَقِلْ إِلَى أَفْهَمُ الْقِصَّةَ 🧠</span>
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
        </button>
      </div>
    </div>
  );
};
