import React, { useState, useEffect, useMemo } from 'react';
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
  Download,
  FolderOpen,
  ExternalLink,
  Heart
} from 'lucide-react';
import { GradeCurriculum, Lesson, Unit } from '../types/curriculum';
import { audioManager } from '../utils/audio';
import { InteractiveTextReader } from './InteractiveTextReader';
import { FamilyHotspotReader } from './FamilyHotspotReader';
import { LetterPhoneticsActivity } from './LetterPhoneticsActivity';
import { GRADE1_SUPPORT_DRIVE_URL } from '../data/grade1SupportPlansData';

interface UnitViewerProps {
  curriculum: GradeCurriculum;
  onOpenQuizForLesson?: (lesson: Lesson) => void;
  onOpenWorksheetForLesson?: (lesson: Lesson) => void;
  onOpenSupportPlans?: () => void;
}

export const UnitViewer: React.FC<UnitViewerProps> = ({
  curriculum,
  onOpenQuizForLesson,
  onOpenWorksheetForLesson,
  onOpenSupportPlans
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedWordPopup, setSelectedWordPopup] = useState<{ word: string; meaning: string; example: string } | null>(null);
  const [activityMode, setActivityMode] = useState<'text' | 'phonetics' | 'hotspot'>('text');

  const currentUnit = curriculum.units[selectedUnitIdx] || curriculum.units[0];
  const currentLesson = currentUnit?.lessons[selectedLessonIdx] || currentUnit?.lessons[0];

  // Auto-switch mode based on selected lesson
  useEffect(() => {
    if (currentLesson?.id === 'g1_u1_family_hotspot') {
      setActivityMode('hotspot');
    } else {
      setActivityMode('text');
    }
  }, [currentLesson?.id]);

  // Extract letter from lesson title
  const currentLetterChar = useMemo(() => {
    if (!currentLesson) return 'م';
    if (currentLesson.title.includes('المِيم') || currentLesson.title.includes('حَرْفُ (م)') || currentLesson.title.includes('حرف (م)')) return 'م';
    if (currentLesson.title.includes('البَاء') || currentLesson.title.includes('حَرْفُ (ب)') || currentLesson.title.includes('حرف (ب)')) return 'ب';
    if (currentLesson.title.includes('اللاَّم') || currentLesson.title.includes('حَرْفُ (ل)') || currentLesson.title.includes('حرف (ل)')) return 'ل';
    if (currentLesson.title.includes('الدَّال') || currentLesson.title.includes('حَرْفُ (د)') || currentLesson.title.includes('حرف (د)')) return 'د';
    if (currentLesson.title.includes('النُّون') || currentLesson.title.includes('حَرْفُ (ن)') || currentLesson.title.includes('حرف (ن)')) return 'ن';
    if (currentLesson.title.includes('الرَّاء') || currentLesson.title.includes('حَرْفُ (ر)') || currentLesson.title.includes('حرف (ر)')) return 'ر';
    return 'م';
  }, [currentLesson]);

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

      {/* Grade 1 Support & Remedial Plans Alert Banner */}
      {curriculum.id === 'grade1' && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border border-rose-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase">
                  جديد • خطط الدعم
                </span>
                <span className="text-xs text-rose-300 font-bold">
                  علاج الفاقد التعليمي والضعف القرائي
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-alexandria text-white">
                حقائب وخطط الدعم للصف الأول الابتدائي (Google Drive)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                مذكرات علاج الحروف، تدريبات المقطع الساكن، بطاقات الكلمات البصرية، واختبارات قياس الأثر العلاجي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto relative z-10">
            {onOpenSupportPlans && (
              <button
                id="unitviewer-open-support-plans-btn"
                onClick={onOpenSupportPlans}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>تصفح الخطط هنا</span>
              </button>
            )}

            <a
              id="unitviewer-open-drive-btn"
              href={GRADE1_SUPPORT_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>فتح Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

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
              </div>

              {/* Grade 1 Unit 1 Activity Selector Ribbon */}
              {curriculum.id === 'grade1' && selectedUnitIdx === 0 && (
                <div className="my-4 flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => {
                      setActivityMode('text');
                      audioManager.play('click');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activityMode === 'text'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>نَصُّ القِرَاءَةِ التَّفَاعُلِيُّ</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivityMode('phonetics');
                      audioManager.play('click');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activityMode === 'phonetics'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>مُخْتَبَرُ قِرَاءَةِ الحُرُوفِ بِالحَرَكَاتِ (القَصِيرَةُ وَالطَّوِيلَةُ) 🔤</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivityMode('hotspot');
                      audioManager.play('click');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activityMode === 'hotspot'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>أَسْتَمِعُ وَأَنْطِقُ: أفراد الأسرة (HOTSPOT) 👨‍👩‍👧‍👦</span>
                  </button>
                </div>
              )}

              {/* View Router for Active Activity */}
              {activityMode === 'hotspot' ? (
                <div className="my-4 animate-in fade-in duration-200">
                  <FamilyHotspotReader />
                </div>
              ) : activityMode === 'phonetics' ? (
                <div className="my-4 animate-in fade-in duration-200">
                  <LetterPhoneticsActivity initialLetter={currentLetterChar} />
                </div>
              ) : (
                <>
                  {/* Lesson Body: Interactive Text / Poem Reader with Word Highlight */}
                  <div className="my-8">
                    <InteractiveTextReader
                      text={currentLesson.text}
                      verses={currentLesson.verses}
                      title={currentLesson.title}
                    />
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

                  {/* Grade 1 Unit 1 Quick Access Cards */}
                  {curriculum.id === 'grade1' && selectedUnitIdx === 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => {
                          setActivityMode('phonetics');
                          audioManager.play('click');
                        }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100/80 hover:to-teal-100/80 border border-emerald-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-amiri font-black text-2xl shadow-xs">
                            {currentLetterChar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-black text-xs text-emerald-950">قِرَاءَةُ الحُرُوفِ بِالحَرَكَاتِ وَالْمَدِّ</h5>
                              <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 rounded">المكون ٤ و ٥</span>
                            </div>
                            <p className="text-[11px] text-emerald-800 mt-0.5">حرف {currentLetterChar} مع الحركات القصيرة والمدود الطويلة وتجريد الحرف</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                      </div>

                      <div 
                        onClick={() => {
                          setActivityMode('hotspot');
                          audioManager.play('click');
                        }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100/80 hover:to-pink-100/80 border border-rose-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-xs">
                            👨‍👩‍👧‍👦
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-black text-xs text-rose-950">أَسْتَمِعُ وَأَنْطِقُ: أفراد الأسرة (HOTSPOT)</h5>
                              <span className="text-[9px] bg-rose-200 text-rose-900 font-bold px-1.5 rounded">ص ١٩</span>
                            </div>
                            <p className="text-[11px] text-rose-800 mt-0.5">نظام الدوائر التفاعلية المحيطة بالكلمة مع نطق أبي، أمي، أخي...</p>
                          </div>
                        </div>
                        <span className="text-xs text-rose-700 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                      </div>
                    </div>
                  )}
                </>
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
