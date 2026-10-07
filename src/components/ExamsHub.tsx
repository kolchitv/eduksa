import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Printer, 
  Eye, 
  Play, 
  ArrowRight, 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  Trophy, 
  Award, 
  Volume2, 
  RotateCcw, 
  Share2, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Check, 
  X, 
  Layers, 
  Flame, 
  GraduationCap,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { 
  OFFICIAL_EXAMS_DATABASE, 
  OfficialExam, 
  ExamSubject, 
  ExamPeriod, 
  ALL_GRADES_LIST, 
  ALL_TERMS_LIST, 
  ALL_PERIODS_LIST, 
  ALL_SUBJECTS_LIST,
  ExamQuestion 
} from '../data/examsData';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { MinistryOfEducationLogo } from './MinistryOfEducationLogo';
import { QuizHub } from './QuizHub';

interface ExamsHubProps {
  currentGrade: GradeId;
  studentName?: string;
  onAddStars: (count: number) => void;
  onQuizCompleted?: (quizId: string) => void;
  onBackToHome?: () => void;
}

type HubViewMode = 'list' | 'take_exam' | 'model_answer' | 'print_preview';

export const ExamsHub: React.FC<ExamsHubProps> = ({
  currentGrade,
  studentName = 'بطل لغتي',
  onAddStars,
  onQuizCompleted,
  onBackToHome
}) => {
  // Filters State
  const [selectedGrade, setSelectedGrade] = useState<GradeId | 'all'>('all');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3 | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<ExamPeriod | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Exam and Mode
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<HubViewMode>('list');
  const [isPrintModelAnswer, setIsPrintModelAnswer] = useState<boolean>(false);

  // Student Answers during taking exam
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [isOralCompleted, setIsOralCompleted] = useState<boolean>(false);
  const [oralScore, setOralScore] = useState<number>(5);

  // Auto-sync initial grade filter if requested
  useEffect(() => {
    if (currentGrade && selectedGrade === 'all') {
      setSelectedGrade(currentGrade);
    }
  }, [currentGrade]);

  // Find currently active exam
  const activeExam = useMemo(() => {
    return OFFICIAL_EXAMS_DATABASE.find(e => e.id === selectedExamId) || null;
  }, [selectedExamId]);

  // Filtered exams list
  const filteredExams = useMemo(() => {
    return OFFICIAL_EXAMS_DATABASE.filter(exam => {
      if (selectedGrade !== 'all' && exam.grade !== selectedGrade) return false;
      if (selectedTerm !== 'all' && exam.term !== selectedTerm) return false;
      if (selectedPeriod !== 'all' && exam.period !== selectedPeriod) return false;
      if (selectedSubject !== 'all' && exam.subject !== selectedSubject) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = exam.title.toLowerCase().includes(query);
        const matchTeacher = exam.teacherName.toLowerCase().includes(query);
        const matchUnit = exam.unitName?.toLowerCase().includes(query) || false;
        const matchGrade = exam.gradeName.toLowerCase().includes(query);
        const matchSubject = exam.subjectName.toLowerCase().includes(query);
        if (!matchTitle && !matchTeacher && !matchUnit && !matchGrade && !matchSubject) {
          return false;
        }
      }
      return true;
    });
  }, [selectedGrade, selectedTerm, selectedPeriod, selectedSubject, searchQuery]);

  // Launch Exam in a specific mode
  const handleOpenExam = (exam: OfficialExam, mode: HubViewMode, printModel = false) => {
    setSelectedExamId(exam.id);
    setViewMode(mode);
    setIsPrintModelAnswer(printModel);
    setStudentAnswers({});
    setIsExamSubmitted(false);
    setCalculatedScore(0);
    setIsOralCompleted(false);
    setOralScore(exam.oralPoints);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioManager.play('click');
  };

  // Record an answer
  const handleAnswerChange = (itemId: string, answer: string) => {
    if (isExamSubmitted) return;
    setStudentAnswers(prev => ({
      ...prev,
      [itemId]: answer
    }));
  };

  // Grade the exam
  const handleSubmitExam = () => {
    if (!activeExam) return;

    let earnedWritten = 0;
    let totalItemsCount = 0;

    activeExam.questions.forEach(q => {
      const pointsPerItem = q.points / Math.max(1, q.items.length);
      q.items.forEach(item => {
        totalItemsCount++;
        const studentAns = (studentAnswers[item.id] || '').trim().toLowerCase();
        const targetAns = item.targetAnswer.trim().toLowerCase();

        // Forgiving check for Arabic diacritics / formatting
        const cleanStudent = studentAns.replace(/[ًٌٍَُِّْـ]/g, '');
        const cleanTarget = targetAns.replace(/[ًٌٍَُِّْـ]/g, '');

        if (cleanStudent === cleanTarget || (studentAns && targetAns.includes(studentAns))) {
          earnedWritten += pointsPerItem;
        }
      });
    });

    const finalWritten = Math.min(activeExam.writtenPoints, Math.round(earnedWritten * 10) / 10);
    const finalTotal = Math.round(finalWritten + oralScore);

    setCalculatedScore(finalTotal);
    setIsExamSubmitted(true);

    // Audio & Rewards
    if (finalTotal >= activeExam.totalPoints * 0.9) {
      audioManager.playFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onAddStars(10);
    } else if (finalTotal >= activeExam.totalPoints * 0.7) {
      audioManager.play('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onAddStars(5);
    } else {
      audioManager.play('wrong');
    }

    if (onQuizCompleted) {
      onQuizCompleted(activeExam.id);
    }
  };

  // Compute Rubric status
  const getRubricStatus = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 98) {
      return { label: 'متفوق (متقن ١٠٠٪)', color: 'bg-emerald-500 text-white', icon: '🌟' };
    } else if (percentage >= 90) {
      return { label: 'متقدم (متقن ٩٠٪ - ٩٩٪)', color: 'bg-teal-500 text-white', icon: '👏' };
    } else if (percentage >= 80) {
      return { label: 'متمكن (متقن ٨٠٪ - ٨٩٪)', color: 'bg-blue-500 text-white', icon: '👍' };
    } else {
      return { label: 'غير مجتاز (أقل من ٨٠٪ - بحاجة لدعم)', color: 'bg-rose-500 text-white', icon: '💡' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-cairo">
      {/* =========================================================================
          VIEW MODE 1: EXAM LIST & FILTERS (الواجهة الرئيسية لبنك الاختبارات)
          ========================================================================= */}
      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          {/* Hero Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl border-2 border-emerald-600/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>بنك الاختبارات المعتمدة ١٤٤٨هـ 🇸🇦</span>
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20">
                    جميع الفترات والفصول والصفوف
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-alexandria tracking-tight">
                  قسم الاختبارات الفترية والنصفيّة والنهائية
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100 font-bold leading-relaxed">
                  نماذج اختبارات رسمية مطابقة لمواصفات وزارة التعليم بالمملكة العربية السعودية، تدعم الحل التفاعلي الذكي، نماذج الإجابة للمعلمين وأولياء الأمور، والطباعة الرسمية A4 المسطرة.
                </p>
              </div>

              {/* Top Quick Actions */}
              <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end flex-wrap">
                {onBackToHome && (
                  <button
                    onClick={onBackToHome}
                    className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer border border-white/20 shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                  </button>
                )}

                <div className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs flex items-center gap-2 shadow-md">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>{filteredExams.length} اختبار متاح</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                <span className="text-xl">📝</span>
                <div>
                  <span className="block text-[10px] text-emerald-200">الأنماط:</span>
                  <span>تحريري + شفهي</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <span className="block text-[10px] text-emerald-200">معايير الوزارة:</span>
                  <span>متفوق / متقدم / متمكن</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                <span className="text-xl">🖨️</span>
                <div>
                  <span className="block text-[10px] text-emerald-200">الطباعة:</span>
                  <span>نماذج A4 جاهزة</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                <span className="text-xl">✅</span>
                <div>
                  <span className="block text-[10px] text-emerald-200">نماذج الإجابة:</span>
                  <span>تصحيح رسمي معتمد</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="ابحث باسم الاختبار، المعلم، الصف، أو الوحدة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Subject Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {ALL_SUBJECTS_LIST.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => {
                      setSelectedSubject(subj.id);
                      audioManager.play('click');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      selectedSubject === subj.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{subj.icon}</span>
                    <span>{subj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown Filters: Grade, Term, Period */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Grade Filter */}
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 block mb-1">
                  الصف والمرحلة الدراسية:
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeId | 'all')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {ALL_GRADES_LIST.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Term Filter */}
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 block mb-1">
                  الفصل الدراسي:
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value === 'all' ? 'all' : (parseInt(e.target.value, 10) as 1 | 2 | 3))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {ALL_TERMS_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Filter */}
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 block mb-1">
                  الفترة ونوع الاختبار:
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as ExamPeriod | 'all')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {ALL_PERIODS_LIST.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-alexandria flex items-center gap-2">
                <span>📋</span>
                <span>قائمة الاختبارات المتاحة</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {filteredExams.length}
                </span>
              </h2>

              <span className="text-xs text-slate-500 font-bold">
                اختر اختباراً لبدء الحل التفاعلي، أو الاطلاع على نموذج الإجابة، أو الطباعة
              </span>
            </div>

            {filteredExams.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-5xl block animate-bounce">🔍</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">
                  لم يتم العثور على اختبارات مطابقة لهذا الفلتر
                </h3>
                <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
                  جرب تغيير خيارات الفلترة أو مسح عبارة البحث لعرض المزيد من الاختبارات الرسمية.
                </p>
                <button
                  onClick={() => {
                    setSelectedGrade('all');
                    setSelectedTerm('all');
                    setSelectedPeriod('all');
                    setSelectedSubject('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredExams.map((exam) => {
                  return (
                    <div
                      key={exam.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-xs hover:shadow-md flex flex-col justify-between gap-4 group"
                    >
                      {/* Card Header */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <span>🇸🇦</span>
                              <span>{exam.subjectName}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                              {exam.periodName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {exam.termName}
                            </span>
                          </div>

                          <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            {exam.totalPoints} درجة
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-700 transition font-alexandria leading-snug">
                            {exam.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {exam.description}
                          </p>
                        </div>

                        {/* Metadata row */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{exam.gradeName}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{exam.teacherName}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{exam.durationMinutes} دقيقة</span>
                          </span>
                          <span>•</span>
                          <span>{exam.schoolYear}</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                        {/* Print Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenExam(exam, 'print_preview', false)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="طباعة ورقة الاختبار الرسمية A4 للطالب"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ورقة الاختبار</span>
                          </button>

                          <button
                            onClick={() => handleOpenExam(exam, 'model_answer', true)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="عرض ونموذج الإجابة للمعلم"
                          >
                            <Eye className="w-3.5 h-3.5 text-rose-600" />
                            <span>نموذج الإجابة</span>
                          </button>
                        </div>

                        {/* Solve Button */}
                        <button
                          onClick={() => handleOpenExam(exam, 'take_exam', false)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>حل الاختبار تفاعلياً 🚀</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: INTERACTIVE STUDENT EXAM / MODEL ANSWER (حل الاختبار أو نموذج الإجابة)
          ========================================================================= */}
      {(viewMode === 'take_exam' || viewMode === 'model_answer') && activeExam && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          {/* Top Bar with Back and Print shortcuts */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>العودة لقائمة الاختبارات</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'take_exam' ? 'model_answer' : 'take_exam')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'model_answer'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{viewMode === 'model_answer' ? 'إغلاق نموذج الإجابة' : 'عرض نموذج الإجابة الرسمي 🎯'}</span>
              </button>

              <button
                onClick={() => setViewMode('print_preview')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>طباعة ورقية A4</span>
              </button>
            </div>
          </div>

          {/* Official Ministry Exam Paper Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-lg space-y-6">
            {/* Ministry Header Matching PDF */}
            <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="text-right space-y-0.5">
                  <p>المملكة العربية السعودية</p>
                  <p>وزارة التعليم</p>
                  <p>الإدارة العامة للتعليم</p>
                  <p className="font-black text-emerald-700">{activeExam.subjectName} • {activeExam.gradeName}</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-12 flex items-center justify-center">
                    <MinistryOfEducationLogo className="w-14 h-12" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">عام {activeExam.schoolYear}</span>
                </div>

                <div className="text-left space-y-1">
                  <div className="inline-block p-2 rounded-xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-center font-black">
                    <span className="block text-[10px]">الدرجة الكلية</span>
                    <span className="text-lg font-alexandria">{activeExam.totalPoints}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">الزمن: {activeExam.durationMinutes} دقيقة</p>
                </div>
              </div>

              {/* Title & Student Info Row */}
              <div className="pt-2 text-center">
                <h2 className="text-xl sm:text-2xl font-black font-alexandria text-slate-900 dark:text-white">
                  {activeExam.title}
                </h2>
                {viewMode === 'model_answer' && (
                  <span className="inline-block mt-1 px-4 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs animate-pulse">
                    ⚠️ نموذج الإجابة الرسمي المعتمد للمعلم وولي الأمر
                  </span>
                )}
              </div>

              {/* Student Name & Date line */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>اسم الطالب/ـة: <span className="font-black text-emerald-700">{studentName}</span></div>
                <div>الصف: <span className="font-black">{activeExam.gradeName}</span></div>
                <div>المعلم/ـة: <span className="font-black text-indigo-700">{activeExam.teacherName}</span></div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
              {activeExam.questions.map((question, qIdx) => {
                const isModel = viewMode === 'model_answer';

                return (
                  <div
                    key={question.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-alexandria">
                          {question.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">
                          {question.instructions}
                        </p>
                        {question.standardLabel && (
                          <span className="inline-block mt-1 text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                            🎯 المعيار: {question.standardLabel}
                          </span>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-black shrink-0">
                        {question.points} درجات
                      </span>
                    </div>

                    {/* Question Type: First Letter from Image */}
                    {question.type === 'first_letter_image' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          const isCorrect = studentAns.trim() === item.targetAnswer.trim();

                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between text-center gap-3 shadow-2xs"
                            >
                              <span className="text-5xl">{item.imageEmoji}</span>
                              <span className="text-xs font-bold text-slate-500">{item.imageLabel}</span>

                              {isModel ? (
                                <div className="w-12 h-12 rounded-xl bg-rose-50 border-2 border-rose-500 flex items-center justify-center text-2xl font-black text-rose-700 font-alexandria shadow-xs">
                                  {item.targetAnswer}
                                </div>
                              ) : (
                                <div className="space-y-2 w-full">
                                  {item.options ? (
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {item.options.map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => handleAnswerChange(item.id, opt)}
                                          className={`py-1.5 px-2 rounded-xl text-base font-black border transition cursor-pointer ${
                                            studentAns === opt
                                              ? 'bg-emerald-600 text-white border-emerald-600'
                                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="الحرف..."
                                      value={studentAns}
                                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                      className="w-full text-center py-1.5 rounded-xl border border-slate-300 font-black text-lg text-emerald-700"
                                    />
                                  )}
                                </div>
                              )}

                              {isExamSubmitted && !isModel && (
                                <span className={`text-[10px] font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isCorrect ? '✓ إجابة صحيحة' : `الإجابة: ${item.targetAnswer}`}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Assemble Letters */}
                    {question.type === 'assemble_letters' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          const isCorrect = studentAns.trim() === item.targetAnswer.trim();

                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-center space-y-3"
                            >
                              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-2 text-xl font-black font-alexandria tracking-widest text-slate-800 dark:text-slate-200">
                                {item.givenLetters?.map((lt, lIdx) => (
                                  <span key={lIdx} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 shadow-2xs">
                                    {lt}
                                  </span>
                                ))}
                              </div>

                              {isModel ? (
                                <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 font-black text-xl font-alexandria">
                                  {item.targetAnswer}
                                </div>
                              ) : (
                                <div>
                                  {item.options ? (
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {item.options.map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => handleAnswerChange(item.id, opt)}
                                          className={`py-1.5 px-2 rounded-xl text-sm font-black border transition cursor-pointer ${
                                            studentAns === opt
                                              ? 'bg-emerald-600 text-white border-emerald-600'
                                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="الكلمة المركبة..."
                                      value={studentAns}
                                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                      className="w-full text-center py-2 rounded-xl border border-slate-300 font-black text-base"
                                    />
                                  )}
                                </div>
                              )}

                              {isExamSubmitted && !isModel && (
                                <span className={`text-[10px] font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isCorrect ? '✓ صحيح' : `الصواب: ${item.targetAnswer}`}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Syllable Analysis */}
                    {question.type === 'syllable_analysis' && (
                      <div className="space-y-3 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          const isCorrect = studentAns.trim() === item.targetAnswer.trim();

                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-500">الكلمة:</span>
                                <span className="text-2xl font-black font-alexandria text-slate-900 dark:text-white px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200">
                                  {item.wordToAnalyze}
                                </span>
                              </div>

                              {isModel ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-rose-700">التحليل النموذجي:</span>
                                  <div className="flex items-center gap-1.5">
                                    {item.analysisParts?.map((pt, pIdx) => (
                                      <span
                                        key={pIdx}
                                        className="w-12 h-10 rounded-xl bg-rose-50 border-2 border-rose-500 flex items-center justify-center font-black text-lg text-rose-800 font-alexandria"
                                      >
                                        {pt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {item.options?.map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleAnswerChange(item.id, opt)}
                                      className={`px-4 py-2 rounded-xl text-sm font-black border transition cursor-pointer ${
                                        studentAns === opt
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Demonstrative Pronouns (هذا / هذه) */}
                    {question.type === 'demonstrative_pronoun' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          const isCorrect = studentAns.trim() === item.targetAnswer.trim();

                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-4xl">{item.imageEmoji}</span>
                                <div>
                                  <span className="text-base font-black text-slate-800 dark:text-white font-alexandria block">
                                    {item.imageLabel}
                                  </span>
                                  <span className="text-[10px] text-slate-500">اختر اسم الإشارة</span>
                                </div>
                              </div>

                              {isModel ? (
                                <div className="px-4 py-2 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 font-black text-lg font-alexandria">
                                  {item.targetAnswer}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {['هَذَا', 'هَذِهِ'].map((pronoun) => (
                                    <button
                                      key={pronoun}
                                      onClick={() => handleAnswerChange(item.id, pronoun)}
                                      className={`px-4 py-2 rounded-xl font-black text-sm border transition cursor-pointer ${
                                        studentAns === pronoun
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      {pronoun}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Match Image to Word */}
                    {question.type === 'match_image_word' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-2"
                            >
                              <span className="text-4xl block">{item.imageEmoji}</span>
                              {isModel ? (
                                <span className="block p-1.5 rounded-xl bg-rose-50 text-rose-700 font-black text-sm border border-rose-300">
                                  {item.targetAnswer}
                                </span>
                              ) : (
                                <select
                                  value={studentAns}
                                  onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                                >
                                  <option value="">اختر الكلمة...</option>
                                  {item.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Oral Reading (شفهي) */}
                    {question.type === 'oral_reading' && (
                      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-4">
                        {question.items.map((item) => (
                          <div key={item.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {item.prompt}
                              </span>
                              <button
                                onClick={() => audioManager.speakArabic(item.audioPrompt || item.targetAnswer, 0.85)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>استمع للنطق الصوتي الفصيح</span>
                              </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 text-center text-lg sm:text-xl font-black font-alexandria text-slate-900 dark:text-white leading-loose tracking-wide">
                              {item.targetAnswer}
                            </div>
                          </div>
                        ))}

                        {/* Oral Evaluation Checklist */}
                        <div className="pt-2 flex items-center justify-between text-xs font-bold">
                          <span>تقييم المعلم للقراءة الشفهية:</span>
                          <div className="flex items-center gap-1.5">
                            {[5, 4, 3, 2].map((pts) => (
                              <button
                                key={pts}
                                onClick={() => setOralScore(pts)}
                                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                                  oralScore === pts
                                    ? 'bg-indigo-600 text-white font-black'
                                    : 'bg-white dark:bg-slate-800 text-slate-700'
                                }`}
                              >
                                {pts} درجات
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Question Type: Dictation */}
                    {question.type === 'dictation' && (
                      <div className="space-y-3 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => audioManager.speakArabic(item.audioPrompt || item.targetAnswer, 0.8)}
                                  className="p-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition cursor-pointer border border-amber-200"
                                  title="استمع للكلمة"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  {item.prompt || 'استمع ثم اكتب:'}
                                </span>
                              </div>

                              {isModel ? (
                                <div className="px-5 py-2 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 font-black text-lg font-alexandria">
                                  {item.targetAnswer}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="اكتب الإملاء هنا..."
                                  value={studentAns}
                                  onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                                  className="w-full sm:w-64 py-2 px-3 rounded-xl border border-slate-300 text-center font-black text-base text-slate-900 dark:text-white"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Type: Multiple Choice Standard */}
                    {question.type === 'multiple_choice' && (
                      <div className="space-y-3 pt-2">
                        {question.items.map((item) => {
                          const studentAns = studentAnswers[item.id] || '';
                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                                  {item.prompt}
                                </h5>
                                {item.audioPrompt && (
                                  <button
                                    onClick={() => audioManager.speakArabic(item.audioPrompt!, 0.85)}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.options?.map((opt) => {
                                  const isSelected = studentAns === opt;
                                  const isCorrectOpt = isModel && opt === item.targetAnswer;

                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleAnswerChange(item.id, opt)}
                                      className={`p-3 rounded-xl text-xs font-bold text-right transition border cursor-pointer ${
                                        isCorrectOpt
                                          ? 'bg-rose-50 border-rose-500 text-rose-900 font-black'
                                          : isSelected
                                          ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results & Submit Area */}
            {viewMode === 'take_exam' && (
              <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 space-y-4">
                {!isExamSubmitted ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200">
                    <div>
                      <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200 font-alexandria">
                        هل أكملت حل جميع الأسئلة؟
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        اضغط لإنهاء الاختبار والحصول على التصحيح التلقائي وتقرير معايير الوزارة.
                      </p>
                    </div>

                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition cursor-pointer active:scale-95"
                    >
                      تسليم الاختبار ورصد الدرجة 🏁
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-xl space-y-4 animate-in zoom-in-95">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-right">
                        <span className="text-xs font-black text-emerald-200 uppercase">النتيجة النهائية</span>
                        <h3 className="text-3xl font-black font-alexandria">
                          حصلت على: {calculatedScore} من {activeExam.totalPoints} درجة
                        </h3>
                        <p className="text-xs text-white/90 mt-1">
                          {getRubricStatus(calculatedScore, activeExam.totalPoints).label}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMode('model_answer')}
                          className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-emerald-50 transition cursor-pointer shadow-sm"
                        >
                          راجع نموذج الإجابة 📝
                        </button>
                        <button
                          onClick={() => {
                            setIsExamSubmitted(false);
                            setStudentAnswers({});
                            setCalculatedScore(0);
                          }}
                          className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
                          title="إعادة المحاولة"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: PRINT PREVIEW (ورقة اختبار رسمية A4 قابلة للطباعة)
          ========================================================================= */}
      {viewMode === 'print_preview' && activeExam && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          {/* Top Bar with Print and Close */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
            <button
              onClick={() => setViewMode('list')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              العودة للبنك
            </button>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrintModelAnswer}
                  onChange={(e) => setIsPrintModelAnswer(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>طباعة كـ (نموذج إجابة محلول للمعلم)</span>
              </label>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الورقة الآن (A4)</span>
              </button>
            </div>
          </div>

          {/* Printable Official Sheet */}
          <div className="bg-white text-slate-950 p-8 sm:p-12 border-2 border-slate-300 rounded-3xl shadow-lg print:border-none print:shadow-none print:p-0 space-y-6 text-right">
            {/* Header Table */}
            <div className="border-2 border-slate-900 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <div>
                  <p>المملكة العربية السعودية</p>
                  <p>وزارة التعليم</p>
                  <p>الإدارة العامة للتعليم</p>
                </div>
                <div className="text-center">
                  <h3 className="text-base font-black font-alexandria">{activeExam.title}</h3>
                  <p className="text-xs font-bold text-slate-700">{activeExam.periodName} • عام {activeExam.schoolYear}</p>
                  {isPrintModelAnswer && (
                    <span className="text-xs font-black text-rose-600 block mt-0.5">(نموذج الإجابة الرسمي)</span>
                  )}
                </div>
                <div className="text-left">
                  <p>المادة: {activeExam.subjectName}</p>
                  <p>الصف: {activeExam.gradeName}</p>
                  <p>الزمن: {activeExam.durationMinutes} دقيقة</p>
                </div>
              </div>

              {/* Student info & Tabulation Box */}
              <div className="border-t border-slate-300 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs font-bold gap-3">
                <div className="flex-1">
                  اسم الطالب/ـة: ...........................................................
                </div>
                <div className="border border-slate-400 p-2 rounded text-center text-[11px]">
                  الدرجة: ( ..... / {activeExam.totalPoints} )
                </div>
              </div>
            </div>

            {/* Questions for Printing */}
            <div className="space-y-6">
              {activeExam.questions.map((q, qIndex) => (
                <div key={q.id} className="border border-slate-300 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between font-bold text-sm border-b pb-2">
                    <h4>{q.title}</h4>
                    <span className="text-xs text-slate-500">[{q.points} درجات]</span>
                  </div>

                  {q.type === 'first_letter_image' && (
                    <div className="grid grid-cols-4 gap-3 text-center">
                      {q.items.map((it) => (
                        <div key={it.id} className="border p-3 rounded-lg space-y-2">
                          <span className="text-3xl block">{it.imageEmoji}</span>
                          <span className="text-xs text-slate-500 block">{it.imageLabel}</span>
                          <div className="h-9 border-b-2 border-dotted border-slate-400 flex items-center justify-center font-black text-base text-rose-600">
                            {isPrintModelAnswer ? it.targetAnswer : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'assemble_letters' && (
                    <div className="grid grid-cols-4 gap-3 text-center">
                      {q.items.map((it) => (
                        <div key={it.id} className="border p-3 rounded-lg space-y-2">
                          <span className="font-bold text-sm block tracking-widest">{it.givenLetters?.join(' ')}</span>
                          <div className="h-9 border-b-2 border-dotted border-slate-400 flex items-center justify-center font-black text-sm text-rose-600">
                            {isPrintModelAnswer ? it.targetAnswer : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'syllable_analysis' && (
                    <div className="space-y-2">
                      {q.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between border p-2 rounded">
                          <span className="font-black text-sm">{it.wordToAnalyze}</span>
                          <div className="flex items-center gap-1">
                            {it.analysisParts?.map((pt, pIdx) => (
                              <div key={pIdx} className="w-12 h-8 border border-slate-400 flex items-center justify-center font-bold text-xs text-rose-600">
                                {isPrintModelAnswer ? pt : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'demonstrative_pronoun' && (
                    <div className="grid grid-cols-2 gap-3">
                      {q.items.map((it) => (
                        <div key={it.id} className="border p-3 rounded flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{it.imageEmoji}</span>
                            <span className="text-xs font-bold">{it.imageLabel}</span>
                          </div>
                          <div className="w-20 h-7 border-b border-dotted border-slate-400 text-center font-black text-sm text-rose-600">
                            {isPrintModelAnswer ? it.targetAnswer : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'dictation' && (
                    <div className="space-y-2">
                      {[1, 2, 3].map((l) => (
                        <div key={l} className="h-9 border-b-2 border-dashed border-slate-400 flex items-center px-2 text-xs text-rose-600 font-black">
                          {isPrintModelAnswer && l === 1 ? q.items.map(i => i.targetAnswer).join(' - ') : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Teacher Signatures and Rubric */}
            <div className="border-t-2 border-slate-400 pt-4 flex items-center justify-between text-xs font-bold">
              <div>توقيع المعلم/ـة: ................................</div>
              <div>توقيع ولي الأمر: ................................</div>
              <div>مع تمنياتنا بالتوفيق والنجاح 🌟</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
