import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  FileText, 
  Music, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Download
} from 'lucide-react';
import { GradeCurriculum, Lesson, Unit } from '../types/curriculum';
import { audioManager } from '../utils/audio';

interface UnitViewerProps {
  curriculum: GradeCurriculum;
  onOpenQuizForLesson?: (lesson: Lesson) => void;
  onOpenWorksheetForLesson?: (lesson: Lesson) => void;
}

export const UnitViewer: React.FC<UnitViewerProps> = ({
  curriculum,
  onOpenQuizForLesson,
  onOpenWorksheetForLesson
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedWordPopup, setSelectedWordPopup] = useState<{ word: string; meaning: string; example: string } | null>(null);

  const currentUnit = curriculum.units[selectedUnitIdx] || curriculum.units[0];
  const currentLesson = currentUnit?.lessons[selectedLessonIdx] || currentUnit?.lessons[0];

  const handleReadText = async (textToRead: string) => {
    if (isPlayingAudio) {
      audioManager.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    await audioManager.speakArabic(textToRead);
    setIsPlayingAudio(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Unit Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {curriculum.name}
            </span>
            <span className="text-xs text-slate-500">
              {curriculum.units.length} وحدات دراسية معتمدة
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-alexandria">
            الوحدات والدروس ونصوص الاستماع
          </h2>
        </div>

        {/* Unit Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {curriculum.units.map((unit, idx) => (
            <button
              key={unit.id}
              onClick={() => {
                setSelectedUnitIdx(idx);
                setSelectedLessonIdx(0);
                audioManager.stopSpeaking();
                setIsPlayingAudio(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedUnitIdx === idx
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <span>{unit.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar of Lessons + Lesson Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Lessons & Phenomena in this Unit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lessons List Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>دروس ونصوص الوحدة ({currentUnit?.lessons.length || 0})</span>
              <span className="text-xs text-emerald-700 font-semibold">{currentUnit?.title}</span>
            </h3>

            <div className="space-y-2">
              {currentUnit?.lessons.map((lesson, lIdx) => {
                const isSelected = selectedLessonIdx === lIdx;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLessonIdx(lIdx);
                      audioManager.stopSpeaking();
                      setIsPlayingAudio(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        {lesson.type === 'poem' ? <Music className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold line-clamp-1">{lesson.title}</p>
                        <span className="text-[10px] text-slate-400">
                          {lesson.type === 'poem' ? 'نشيد وقصيدة' : 'نص قراءة واستماع'}
                        </span>
                      </div>
                    </div>

                    <ChevronLeft className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grammar & Spelling Phenomena for this Unit */}
          {currentUnit?.phenomena && currentUnit.phenomena.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>الظواهر الإملائية والنحوية للوحدة</span>
              </h3>

              <div className="space-y-3">
                {currentUnit.phenomena.map((ph) => (
                  <div key={ph.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900">{ph.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        {ph.category === 'spelling' ? 'إملاء' : ph.category === 'grammar' ? 'نحو' : 'صوتيات'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-2">{ph.rule}</p>
                    <div className="space-y-1 bg-white p-2 rounded-xl border border-slate-200">
                      {ph.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="flex items-center justify-between text-[11px]">
                          <span className="font-amiri text-emerald-800 font-bold">{ex.text}</span>
                          <span className="text-slate-500">{ex.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Panel: Selected Lesson Full View */}
        <div className="lg:col-span-8 space-y-6">
          {currentLesson ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              {/* Lesson Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {currentLesson.type === 'poem' ? 'نشيد وحفظ' : 'نص قراءة واستماع'}
                    </span>
                    {currentLesson.grammarFocus && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {currentLesson.grammarFocus}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-alexandria">
                    {currentLesson.title}
                  </h3>
                </div>

                {/* Action Buttons: Audio Playback, Quiz, Worksheet */}
                <div className="flex items-center gap-2">
                  <button
                    id="lesson-audio-speaker-btn"
                    onClick={() => handleReadText(currentLesson.text || currentLesson.audioText || '')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlayingAudio ? 'إيقاف الصوت' : 'استمع للنص كاملاً'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Body: Text or Poem Verses */}
              <div className="my-8">
                {currentLesson.type === 'poem' && currentLesson.verses ? (
                  <div className="space-y-4 max-w-xl mx-auto text-center py-4">
                    {currentLesson.verses.map((verse, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-4 bg-gradient-to-r from-emerald-50/50 via-slate-50 to-emerald-50/50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center text-lg sm:text-xl font-amiri font-bold text-slate-900"
                      >
                        <div className="text-right sm:text-center text-emerald-950">{verse.first}</div>
                        <div className="text-left sm:text-center text-emerald-900">{verse.second}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 bg-slate-50/60 rounded-3xl border border-slate-200/80">
                    <p className="text-xl sm:text-2xl font-amiri font-bold leading-loose text-slate-900 text-justify">
                      {currentLesson.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Vocabulary Chips (المفردات ومعانيها) */}
              {currentLesson.vocabulary && currentLesson.vocabulary.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>أنمي لغتي (معاني الكلمات والتراكيب)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.vocabulary.map((vocab, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-amiri text-lg font-extrabold text-emerald-950">
                            {vocab.word}
                          </span>
                          <button
                            onClick={() => audioManager.speakArabic(vocab.word)}
                            className="text-emerald-700 hover:text-emerald-900 p-1"
                            title="نطق الكلمة"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-slate-700">{vocab.meaning}</p>
                        {vocab.example && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            مثال: {vocab.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comprehension Quiz Prompt */}
              {currentLesson.comprehensionQuestions && currentLesson.comprehensionQuestions.length > 0 && (
                <div className="mt-8 p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/10">
                  <div>
                    <h5 className="font-extrabold text-base font-alexandria">اختبر فهمك لهذا الدرس!</h5>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      أجب عن أسئلة الفهم القرائي واحصل على نجوم التميز.
                    </p>
                  </div>
                  {onOpenQuizForLesson && (
                    <button
                      onClick={() => onOpenQuizForLesson(currentLesson)}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                    >
                      بدء تدريب الفهم القرائي
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">اختر درساً لعرض محتواه</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
