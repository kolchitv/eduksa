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
  Heart,
  Star,
  Target,
  Layers,
  Trophy
} from 'lucide-react';
import { GradeCurriculum, Lesson, Unit } from '../types/curriculum';
import { audioManager } from '../utils/audio';
import { InteractiveTextReader } from './InteractiveTextReader';
import { FamilyHotspotReader } from './FamilyHotspotReader';
import { LetterPhoneticsActivity } from './LetterPhoneticsActivity';
import { Grade1Unit1LetterMActivity } from './Grade1Unit1LetterMActivity';
import { Grade1Unit1Activity2 } from './Grade1Unit1Activity2';
import { Grade1Unit1ActivitiesHub, Unit1ActivityId } from './Grade1Unit1ActivitiesHub';
import { GRADE1_SUPPORT_DRIVE_URL } from '../data/grade1SupportPlansData';

interface UnitViewerProps {
  curriculum: GradeCurriculum;
  onOpenQuizForLesson?: (lesson: Lesson) => void;
  onOpenWorksheetForLesson?: (lesson: Lesson) => void;
  onOpenSupportPlans?: () => void;
  onOpenReadingPathway?: (track?: 'all' | 'struggling' | 'short_text' | 'advanced') => void;
}

export const UnitViewer: React.FC<UnitViewerProps> = ({
  curriculum,
  onOpenQuizForLesson,
  onOpenWorksheetForLesson,
  onOpenSupportPlans,
  onOpenReadingPathway
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedWordPopup, setSelectedWordPopup] = useState<{ word: string; meaning: string; example: string } | null>(null);
  
  // Section router for Unit 1: 'lessons' (regular reading) vs 'activities' (Interactive Activities Section)
  const [unitSection, setUnitSection] = useState<'lessons' | 'activities'>('lessons');
  const [selectedActivityId, setSelectedActivityId] = useState<Unit1ActivityId>('hub');
  
  // Legacy activityMode for backward-compatibility with quick ribbons
  const [activityMode, setActivityMode] = useState<'text' | 'phonetics' | 'hotspot' | 'p42_matching' | 'activity_2'>('text');

  const currentUnit = curriculum.units[selectedUnitIdx] || curriculum.units[0];
  const currentLesson = currentUnit?.lessons[selectedLessonIdx] || currentUnit?.lessons[0];

  // Auto-switch mode or section based on selected lesson
  useEffect(() => {
    if (currentLesson?.id === 'g1_u1_family_hotspot') {
      setUnitSection('activities');
      setSelectedActivityId('hotspot');
      setActivityMode('hotspot');
    } else if (currentLesson?.id === 'g1_u1_lm_activity_p42') {
      setUnitSection('activities');
      setSelectedActivityId('activity1');
      setActivityMode('p42_matching');
    } else if (currentLesson?.id === 'g1_u1_activity_2') {
      setUnitSection('activities');
      setSelectedActivityId('activity2');
      setActivityMode('activity_2');
    } else {
      setUnitSection('lessons');
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

  const isGrade1Unit1 = curriculum.id === 'grade1' && selectedUnitIdx === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Quick Launch Banner for Reading Pathway */}
      {onOpenReadingPathway && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-2 border-emerald-400/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shrink-0 font-bold shadow-md">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  مسار القراءة المتدرج 📖
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  الانطلاق في القراءة (٦ مستويات)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black font-alexandria text-white">
                تعلّم القراءة من الجمل البسيطة للمتعثرين إلى النصوص الطويلة للمتميزين
              </h3>
              <p className="text-xs text-slate-300">
                تسجيل صوتي، مؤقت القراءة، أسئلة فهم مقروء، وإمكانية إضافة نصوص جديدة مباشرة للمسار.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              id="unitviewer-launch-reading-pathway-btn"
              onClick={() => onOpenReadingPathway('all')}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>دخول مسار الانطلاق في القراءة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Unit Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
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
                setUnitSection('lessons');
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

      {/* Grade 1 Unit 1 Master Mode Selector (الدروس vs قسم الأنشطة) */}
      {isGrade1Unit1 && (
        <div className="mb-8 p-3 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setUnitSection('lessons');
                audioManager.play('click');
              }}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                unitSection === 'lessons'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دُرُوسُ وَنُصُوصُ الوَحْدَةِ ({currentUnit?.lessons.length})</span>
            </button>

            <button
              onClick={() => {
                setUnitSection('activities');
                setSelectedActivityId('hub');
                audioManager.play('click');
              }}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                unitSection === 'activities'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-700" />
              <span>🎯 قِسْمُ الأَنْشِطَةِ التَّفَاعُلِيَّةِ (الوحدة الأولى - ٤ أنشطة)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="hidden md:inline">الوحدة الأولى: أُسْرَتِي</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
              {unitSection === 'activities' ? 'القسم النشط: الأنشطة التفاعلية ⭐' : 'القسم النشط: الدروس والنصوص 📖'}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar of Lessons + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Lessons & Activities in this Unit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Grade 1 Unit 1 Activities Section Card in Sidebar */}
          {isGrade1Unit1 && (
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">قِسْمُ الأَنْشِطَةِ (الوحدة الأولى)</h3>
                    <p className="text-[10px] text-amber-800 font-bold">جميع الأنشطة مجمعة هنا</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                  ٤ أنشطة
                </span>
              </div>

              {/* Grouped Activities List */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('hub');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'hub'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>جَمِيعُ الأَنْشِطَةِ (مَرْكَزُ التَّدْرِيبِ)</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('activity1');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'activity1'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-amber-700" />
                    <span className="line-clamp-1">نَشَاطُ ص ٤٢: أَصِلُ الصُّوَرَ بِحَرْفِ (م)</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('activity2');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'activity2'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-700 fill-current" />
                    <span className="line-clamp-1">نَشَاطُ ٢: مَوَاقِعُ الحَرْفِ وَالْمُدُودُ ⭐</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('hotspot');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'hotspot'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span className="line-clamp-1">نَشَاطُ أفراد الأسرة (HOTSPOT ص ١٩)</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('phonetics');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'phonetics'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="line-clamp-1">مُخْتَبَرُ قِرَاءَةِ الحُرُوفِ بِالحَرَكَاتِ</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Lessons List Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
              <span>دروس ونصوص الوحدة ({currentUnit?.lessons.length || 0})</span>
              <span className="text-xs text-emerald-700 font-semibold">{currentUnit?.title}</span>
            </h3>

            <div className="space-y-2">
              {currentUnit?.lessons.map((lesson, lIdx) => {
                const isSelected = selectedLessonIdx === lIdx && unitSection === 'lessons';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLessonIdx(lIdx);
                      setUnitSection('lessons');
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

        {/* Right Main Panel: Either Activities Hub OR Selected Lesson */}
        <div className="lg:col-span-8 space-y-6">
          {isGrade1Unit1 && unitSection === 'activities' ? (
            /* Dedicated Unit 1 Activities Hub */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <Grade1Unit1ActivitiesHub
                initialActivity={selectedActivityId}
                onSwitchToLesson={() => setUnitSection('lessons')}
              />
            </div>
          ) : currentLesson ? (
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

                {isGrade1Unit1 && (
                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('hub');
                      audioManager.play('click');
                    }}
                    className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                    <span>فَتْحُ قِسْمِ الأَنْشِطَةِ 🎯</span>
                  </button>
                )}
              </div>

              {/* Grade 1 Unit 1 Activity Selector Ribbon */}
              {isGrade1Unit1 && (
                <div className="my-4 flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => {
                      setUnitSection('lessons');
                      setActivityMode('text');
                      audioManager.play('click');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activityMode === 'text' && unitSection === 'lessons'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>نَصُّ القِرَاءَةِ التَّفَاعُلِيُّ</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('hub');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-amber-100 text-amber-950 hover:bg-amber-200 transition-all whitespace-nowrap border border-amber-300"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>قِسْمُ الأَنْشِطَةِ (الوحدة الأولى)</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('activity1');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all whitespace-nowrap"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    <span>نَشَاطُ ص ٤٢ (م) 🎯</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('activity2');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all whitespace-nowrap"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>نَشَاطُ ٢: مَوَاقِعُ الحَرْفِ وَالْمُدُودُ ⭐</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('hotspot');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all whitespace-nowrap"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>أفراد الأسرة (ص ١٩) 👨‍👩‍👧‍👦</span>
                  </button>
                </div>
              )}

              {/* Quick shortcut banner for Letter M Lesson */}
              {(currentLesson?.id === 'g1_u1_lm' || currentLesson?.id === 'g1_u1_lm_activity_p42' || currentLesson?.id === 'g1_u1_activity_2') && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <h4 className="text-xs font-black text-amber-950">
                        أَنْشِطَةُ كِتَابِ لُغَتِي المَعْتَمَدَةُ (حَرْفُ المِيمِ م)
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        النشاط ١ (ص ٤٢): توصيل الحرف بالصور • النشاط ٢: رسم الدائرة ومواقع الحرف والمدود وكتابة الحرف.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('activity1');
                        audioManager.play('click');
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-all flex items-center gap-1"
                    >
                      <span>نَشَاطُ ١ (ص ٤٢)</span>
                    </button>

                    <button
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('activity2');
                        audioManager.play('click');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>نَشَاطُ ٢ (إنجازاتي) ⭐</span>
                    </button>
                  </div>
                </div>
              )}

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
              {isGrade1Unit1 && (
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('activity2');
                      audioManager.play('click');
                    }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100/80 hover:to-orange-100/80 border border-amber-300 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xs">
                        ⭐
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-black text-xs text-amber-950">النَّشَاطُ ٢: مَوَاقِعُ الحَرْفِ وَالْمُدُودُ</h5>
                          <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 rounded">إنجازاتي</span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-0.5">رسم دائرة حول الميم وتحديد موضعه والمدود وسبورة الكتابة</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-800 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                  </div>

                  <div 
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('activity1');
                      audioManager.play('click');
                    }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100/80 hover:to-teal-100/80 border border-emerald-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-amiri font-black text-2xl shadow-xs">
                        🎯
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-black text-xs text-emerald-950">نَشَاطُ ص ٤٢: أَصِلُ الصُّوَرَ</h5>
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 rounded">ص ٤٢</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5">توصيل الحرف بالصور الستة ونطق الكلمات والمخارج</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
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
              <p className="text-sm font-bold text-slate-600">اختر درساً أو نشاطاً لعرض محتواه</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
