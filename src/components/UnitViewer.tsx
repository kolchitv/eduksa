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
import { Grade1Unit1VisualReviewCard } from './Grade1Unit1VisualReviewCard';
import { GRADE1_SUPPORT_DRIVE_URL } from '../data/grade1SupportPlansData';

interface UnitViewerProps {
  curriculum: GradeCurriculum;
  onOpenQuizForLesson?: (lesson: Lesson) => void;
  onOpenWorksheetForLesson?: (lesson: Lesson) => void;
  onOpenSupportPlans?: () => void;
  onOpenReadingPathway?: (track?: 'all' | 'struggling' | 'short_text' | 'advanced') => void;
  onOpenSummaries?: () => void;
  onOpenSpellingChampions?: () => void;
}

export const UnitViewer: React.FC<UnitViewerProps> = ({
  curriculum,
  onOpenQuizForLesson,
  onOpenWorksheetForLesson,
  onOpenSupportPlans,
  onOpenReadingPathway: _onOpenReadingPathway,
  onOpenSummaries,
  onOpenSpellingChampions
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
  const isIntermediate = curriculum.id.startsWith('intermediate');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Intermediate Stage Notes Callout Banner (القسم المتوسط - مذكرات المتوسطة) */}
      {isIntermediate && onOpenSummaries && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white border-2 border-indigo-400/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-2xl shrink-0 font-bold shadow-md">
              📑
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  القسم المتوسط 🌟
                </span>
                <span className="text-xs text-indigo-200 font-bold">
                  مذكرات لغتي الخالدة المعتمدة
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-alexandria text-white">
                مذكرات المتوسطة • ملخصات وقواعد الاختبار المركزي
              </h3>
              <p className="text-xs text-slate-300">
                شروح مبسطة، خرائط ذهنية، نماذج اختبارية تفاعلية، وقوالب قابلة للطباعة لصفوف المرحلة المتوسطة.
              </p>
            </div>
          </div>
          <button
            id="unitviewer-open-intermediate-notes-btn"
            onClick={onOpenSummaries}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>فتح مذكرات المتوسطة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Unit Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              isIntermediate
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              {isIntermediate ? 'القسم المتوسط' : curriculum.name}
            </span>
            {isIntermediate && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
                {curriculum.name} • مذكرات المتوسطة 📑
              </span>
            )}
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
                unitSection === 'activities' && selectedActivityId !== 'workbook'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-700" />
              <span>🎯 قِسْمُ الأَنْشِطَةِ وَالتَّقْيِيمَاتِ</span>
            </button>

            <button
              id="top-mode-btn-grade1-workbook"
              onClick={() => {
                setUnitSection('activities');
                setSelectedActivityId('workbook');
                audioManager.play('click');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                unitSection === 'activities' && selectedActivityId === 'workbook'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-slate-950 shadow-md ring-2 ring-amber-300 scale-102'
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-950 border border-amber-300'
              }`}
            >
              <span>✏️</span>
              <span>كراسة التمارين (الصف 1) • 28 حرفاً 🌟</span>
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
                    <p className="text-[10px] text-amber-800 font-bold">جميع الأنشطة والتقييمات مجمعة هنا</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                  ٨ أنشطة 🌟
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
                  id="btn-sidebar-grade1-workbook-28"
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('workbook');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-3 rounded-2xl border text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                    unitSection === 'activities' && selectedActivityId === 'workbook'
                      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300 scale-[1.02]'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-slate-950 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✏️</span>
                    <div>
                      <div className="line-clamp-1 font-black text-xs text-slate-950">كراسة التمارين (الصف 1)</div>
                      <div className="text-[10px] text-amber-900 font-extrabold">28 حرفاً 🌟 شاملة بالصوت</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black shadow-xs">
                    28 حرفاً 🌟
                  </span>
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('letters_review');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'letters_review'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                      : 'bg-white hover:bg-teal-50 text-slate-800 border-teal-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>📑</span>
                    <span className="line-clamp-1 font-black">مُرَاجَعَةُ حُرُوفِ الوَحْدَةِ (الأَصْوَاتُ وَالمُدُودُ)</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('assessment');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'assessment'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>📝</span>
                    <span className="line-clamp-1 font-black">تَقْيِيمُ الوَحْدَةِ ١ (الفَتْرَةُ الأُولَى)</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setUnitSection('activities');
                    setSelectedActivityId('letter_d');
                    audioManager.play('click');
                  }}
                  className={`w-full text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    unitSection === 'activities' && selectedActivityId === 'letter_d'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🚲</span>
                    <span className="line-clamp-1 font-black">مَعْمَلُ حَرْفِ الدَّالِ (د) الشَّامِلُ</span>
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

          {/* Quick Access Card for Spelling Champions */}
          {onOpenSpellingChampions && (
            <div 
              onClick={onOpenSpellingChampions}
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-500 hover:to-amber-400 p-4 rounded-3xl border-2 border-amber-300 shadow-sm cursor-pointer transition-all active:scale-95 group text-slate-950"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  📝
                </div>
                <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  تفاعلي جديد
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-950 font-alexandria group-hover:text-emerald-950 transition-colors">
                أبطال الإملاء التفاعلي
              </h4>
              <p className="text-[11px] text-slate-800 mt-1 line-clamp-2">
                تدريب متدرج للفئات الضعيفة، المتوسطة، والمتميزة مع الإملاء المنظور والاختباري والتصحيح الفوري.
              </p>
              <div className="mt-2.5 pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs font-black text-slate-950">
                <span>فتح المختبر الإملائي</span>
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
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
                      setSelectedActivityId('letters_review');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all whitespace-nowrap shadow-2xs"
                  >
                    <span>📑</span>
                    <span>مُرَاجَعَةُ حُرُوفِ الوَحْدَةِ</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('assessment');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all whitespace-nowrap shadow-2xs"
                  >
                    <span>📝</span>
                    <span>تَقْيِيمُ الفَتْرَةِ ١</span>
                  </button>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('letter_d');
                      audioManager.play('click');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all whitespace-nowrap shadow-2xs"
                  >
                    <span>🚲</span>
                    <span>مَعْمَلُ حَرْفِ (د)</span>
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

              {/* Quick shortcut banner for Letter D Lesson (PDF 3: أ. ميعاد الشريف) */}
              {currentLesson?.id === 'g1_u1_ld' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚲</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-amber-950">
                          مَعْمَلُ حَرْفِ الدَّالِ (د) الشَّامِلُ وَقِصَّةُ الأَصْدِقَاءِ الثَّلَاثَةِ
                        </h4>
                        <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full border border-amber-300">
                          تفاعلي معتمد
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 mt-0.5">
                        مخرج حرف الدال الصوتي • تجريد الأصوات والمدود • محاكاة الضميرين (أَنْتَ / أَنْتِ) • قصة الأصدقاء الثلاثة الإثرائية.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('letter_d');
                      audioManager.play('click');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <span>دُخُولُ مَعْمَلِ الدَّالِ</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick shortcut banner for Letters Review Lesson (PDF 1) */}
              {currentLesson?.id === 'g1_u1_review_letters' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-teal-400 text-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📑</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-teal-950">
                          جَدْوَلُ مُرَاجَعَةِ حُرُوفِ الوَحْدَةِ الأُولَى: الأَصْوَاتُ وَالمُدُودُ
                        </h4>
                        <span className="text-[10px] bg-teal-200 text-teal-950 font-black px-2 py-0.5 rounded-full border border-teal-300">
                          جدول أصوات معتمد
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-900 mt-0.5">
                        الأصوات القصيرة والطويلة لجميع حروف الوحدة (م، ب، ل، د، ن، ر) مع التهجئة السريعة لمقاطع الحرفين.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('letters_review');
                      audioManager.play('click');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <span>فَتْحُ جَدْوَلِ المُرَاجَعَةِ</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick shortcut banner for Assessment Lesson (PDF 2: أ. منيرة العمري) */}
              {currentLesson?.id === 'g1_u1_evaluation_quiz' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-rose-500/15 border-2 border-rose-400 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📝</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-rose-950">
                          نَمُوذَجُ تَقْيِيمِ كِفَايَاتِ الوَحْدَةِ الأُولَى (الفَتْرَةُ الأُولَى)
                        </h4>
                        <span className="text-[10px] bg-rose-200 text-rose-950 font-black px-2 py-0.5 rounded-full border border-rose-300">
                          تقييم الفترة ١
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-900 mt-0.5">
                        نموذج قياس مهارات تفاعلي: صل الكلمة بشكل الحرف، صل الحرف بالصورة، التحليل الصوتي لكلمة بَلَدُ، والحرف الناقص.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUnitSection('activities');
                      setSelectedActivityId('assessment');
                      audioManager.play('click');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    <span>بَدْءُ التَّقْيِيمِ التَّفَاعُلِيِّ</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Lesson Body: Interactive Text or Visual Review Card for Review Lesson */}
              {currentLesson.id === 'g1_u1_review_letters' ? (
                <div className="my-8">
                  <Grade1Unit1VisualReviewCard />
                </div>
              ) : (
                <div className="my-8">
                  <InteractiveTextReader
                    text={currentLesson.text}
                    verses={currentLesson.verses}
                    title={currentLesson.title}
                  />
                </div>
              )}

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
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>الأنشطة والتقييمات المعتمدة للوحدة الأولى (أسرتي)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('letters_review');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100/90 hover:to-emerald-100/90 border border-teal-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                          📑
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-teal-950">مُرَاجَعَةُ حُرُوفِ الوَحْدَةِ</h5>
                            <span className="text-[8px] bg-teal-200 text-teal-900 font-bold px-1 rounded">معتمد</span>
                          </div>
                          <p className="text-[10px] text-teal-800 mt-0.5 line-clamp-1">الأصوات والمدود ومقاطع الحرفين</p>
                        </div>
                      </div>
                      <span className="text-xs text-teal-700 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('assessment');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100/90 hover:to-pink-100/90 border border-rose-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                          📝
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-rose-950">تَقْيِيمُ الوَحْدَةِ ١</h5>
                            <span className="text-[8px] bg-rose-200 text-rose-900 font-bold px-1 rounded">الفترة ١</span>
                          </div>
                          <p className="text-[10px] text-rose-800 mt-0.5 line-clamp-1">أشكال الحروف، التحليل الصوتي، والحرف الناقص</p>
                        </div>
                      </div>
                      <span className="text-xs text-rose-700 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('letter_d');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100/90 hover:to-orange-100/90 border border-amber-300 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
                          🚲
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-amber-950">مَعْمَلُ حَرْفِ الدَّالِ</h5>
                            <span className="text-[8px] bg-amber-200 text-amber-900 font-bold px-1 rounded">شامل</span>
                          </div>
                          <p className="text-[10px] text-amber-800 mt-0.5 line-clamp-1">مخرج الحرف، الضمائر، وقصة الأصدقاء الثلاثة</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-800 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('activity2');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl shadow-xs">
                          ⭐
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-slate-900">نَشَاطُ ٢: مَوَاقِعُ الحَرْفِ</h5>
                            <span className="text-[8px] bg-slate-200 text-slate-800 font-bold px-1 rounded">إنجازاتي</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">رسم دائرة والمدود وسبورة الكتابة</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('activity1');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shadow-xs">
                          🎯
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-slate-900">نَشَاطُ ص ٤٢: أَصِلُ الصُّوَرَ</h5>
                            <span className="text-[8px] bg-slate-200 text-slate-800 font-bold px-1 rounded">ص ٤٢</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">توصيل الحرف بالصور ونطق الأصوات</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 font-bold group-hover:translate-x-1 transition-transform">فتح ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        const targetIdx = currentUnit.lessons.findIndex((l) => l.id === 'g1_u1_review_letters');
                        if (targetIdx !== -1) setSelectedLessonIdx(targetIdx);
                        setUnitSection('lessons');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border-2 border-sky-300 cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                          🖼️
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="font-black text-xs text-sky-950">البِطَاقَةُ المُصَوَّرَةُ (أسرتي)</h5>
                            <span className="text-[8px] bg-sky-200 text-sky-950 font-bold px-1 rounded">الصورة الأصلية</span>
                          </div>
                          <p className="text-[10px] text-sky-800 mt-0.5 line-clamp-1">مراجعة الحروف بالأصوات والمدود ومقاطع الحرفين</p>
                        </div>
                      </div>
                      <span className="text-xs text-sky-700 font-bold group-hover:translate-x-1 transition-transform">عرض ◀</span>
                    </div>

                    <div 
                      onClick={() => {
                        setUnitSection('activities');
                        setSelectedActivityId('hub');
                        audioManager.play('click');
                      }}
                      className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
                          🎯
                        </div>
                        <div>
                          <h5 className="font-black text-xs text-amber-950">قِسْمُ الأَنْشِطَةِ الكَامِلُ</h5>
                          <p className="text-[10px] text-amber-800 mt-0.5 line-clamp-1">جميع الـ ٧ أنشطة مجمعة في مكان واحد</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-800 font-bold group-hover:translate-x-1 transition-transform">عرض الكل ◀</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grade 1 Unit 1 End-of-Unit Visual Poster Section */}
              {isGrade1Unit1 && currentLesson.id !== 'g1_u1_review_letters' && (
                <div className="mt-10 pt-8 border-t-2 border-dashed border-sky-300">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl shadow-xs">
                        🖼️
                      </span>
                      <div>
                        <h4 className="font-black text-sm sm:text-base text-sky-950 font-serif">
                          بِطَاقَةُ مُرَاجَعَةِ حُرُوفِ الوَحْدَةِ الأُولَى (الصُّورَةُ المُعْتَمَدَةُ)
                        </h4>
                        <p className="text-xs text-sky-800">
                          مراجعة ختامية لجميع حروف الوحدة الأولى (أسرتي: م، ب، ل، د، ن، ر) بالأصوات والمدود ومقاطع الحرفين.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const targetIdx = currentUnit.lessons.findIndex((l) => l.id === 'g1_u1_review_letters');
                        if (targetIdx !== -1) setSelectedLessonIdx(targetIdx);
                        setUnitSection('lessons');
                        audioManager.play('click');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>الانتقال لدرس المراجعة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Grade1Unit1VisualReviewCard showToolbar={true} />
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

      {/* Grade 1 Support & Remedial Plans Callout Card (At the end of Grade 1 units only) */}
      {curriculum.id === 'grade1' && (
        <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-rose-500/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center shrink-0 shadow-lg">
              <FolderOpen className="w-7 h-7 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  مجلد Google Drive المعتمد
                </span>
                <span className="text-xs text-rose-300 font-bold">
                  ختام وحدات الصف الأول الابتدائي
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black font-alexandria text-white">
                خطط الدعم الشاملة وعلاج الفاقد التعليمي ومذكرات الحروف الهجائية
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                تشمل كراسات الحروف، تدريبات المقطع الساكن، الكلمات البصرية، واختبارات قياس الأثر العلاجي المعتمدة لمعلمي وأولياء أمور الصف الأول.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
            {onOpenSupportPlans && (
              <button
                id="unitviewer-bottom-open-support-plans-btn"
                onClick={onOpenSupportPlans}
                className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>تصفح الخطط بالموقع</span>
              </button>
            )}

            <a
              id="unitviewer-bottom-open-drive-btn"
              href={GRADE1_SUPPORT_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <FolderOpen className="w-4 h-4 text-slate-950" />
              <span>تحميل من Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
