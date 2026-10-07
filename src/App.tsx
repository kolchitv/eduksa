import React, { useState, useEffect } from 'react';
import { GradeId, Lesson } from './types/curriculum';
import { GRADES_DATA } from './data/curriculumData';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { FoundationStudio } from './components/FoundationStudio';
import { KgStudio } from './components/KgStudio';
import { UnitViewer } from './components/UnitViewer';
import { QuizHub } from './components/QuizHub';
import { AiTutor } from './components/AiTutor';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { VisualDictionary } from './components/VisualDictionary';
import { TextbooksLibrary } from './components/TextbooksLibrary';
import { CertificateModal } from './components/CertificateModal';
import { StudentAchievements } from './components/StudentAchievements';
import { WhatsAppContact } from './components/WhatsAppContact';
import { AppInstallAndTelegramModal } from './components/AppInstallAndTelegramModal';
import { Grade1SupportPlans } from './components/Grade1SupportPlans';
import { InteractiveWhiteboard } from './components/whiteboard/InteractiveWhiteboard';
import { ReadingPathwayStudio } from './components/readingPath/ReadingPathwayStudio';
import { SummariesStudio } from './components/SummariesStudio';
import { SpellingChampionsStudio } from './components/SpellingChampionsStudio';
import { Grade1WrittenWorksheetStudio } from './components/Grade1WrittenWorksheetStudio';
import { LearningGamesHub } from './components/games/LearningGamesHub';
import { ExamsHub } from './components/ExamsHub';
import { DailyStudyReminderModal } from './components/DailyStudyReminderModal';
import { TabType } from './components/Header';
import { GRADE1_SUPPORT_DRIVE_URL } from './data/grade1SupportPlansData';
import { 
  parseRouteFromLocation, 
  getUrlForRoute, 
  getSeoMetadata, 
  applySeoMetadataToDom 
} from './utils/seoRouting';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Search,
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
  FolderOpen,
  Link2,
  Check,
  X
} from 'lucide-react';

export default function App() {
  const initialRoute = parseRouteFromLocation();
  const [currentGrade, setCurrentGrade] = useState<GradeId>(initialRoute.grade);
  const [activeTab, setActiveTab] = useState<TabType>(initialRoute.tab);
  const [studentName, setStudentName] = useState<string>('فهد المنصور');
  const [stars, setStars] = useState<number>(35);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(['quiz_found_1']);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isDailyReminderOpen, setIsDailyReminderOpen] = useState<boolean>(false);
  const [hoursSinceLastVisit, setHoursSinceLastVisit] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReadingTrack, setSelectedReadingTrack] = useState<'all' | 'struggling' | 'short_text' | 'advanced'>(initialRoute.readingTrack || 'all');
  const [copiedLinkToast, setCopiedLinkToast] = useState<boolean>(false);

  // Dedicated URL Synchronization & Dynamic SEO Metadata
  useEffect(() => {
    const targetUrl = getUrlForRoute(activeTab, currentGrade, selectedReadingTrack);
    const seo = getSeoMetadata({ tab: activeTab, grade: currentGrade, readingTrack: selectedReadingTrack });
    applySeoMetadataToDom(seo);

    // Keep URL in sync without triggering full page reload
    if (typeof window !== 'undefined' && (window.location.pathname + window.location.search) !== targetUrl) {
      window.history.pushState({ tab: activeTab, grade: currentGrade, readingTrack: selectedReadingTrack }, '', targetUrl);
    }
  }, [activeTab, currentGrade, selectedReadingTrack]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation();
      setActiveTab(route.tab);
      setCurrentGrade(route.grade);
      if (route.readingTrack) setSelectedReadingTrack(route.readingTrack);
      const seo = getSeoMetadata(route);
      applySeoMetadataToDom(seo);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Local storage persistence
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('lughati_student_name');
      const savedStars = localStorage.getItem('lughati_stars');
      const savedQuizzes = localStorage.getItem('lughati_completed_quizzes');
      if (savedName) setStudentName(savedName);
      if (savedStars) setStars(parseInt(savedStars, 10));
      if (savedQuizzes) setCompletedQuizzes(JSON.parse(savedQuizzes));
    } catch (e) {}
  }, []);

  // Auto-open install and telegram modal on first visit after 2.5s
  useEffect(() => {
    try {
      const alreadyDismissed = sessionStorage.getItem('lughati_install_popup_dismissed');
      if (!alreadyDismissed) {
        const timer = setTimeout(() => {
          setIsInstallModalOpen(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  // Daily study reminder: trigger if user hasn't opened app for >= 24 hours
  useEffect(() => {
    try {
      const LAST_ACTIVE_KEY = 'lughati_last_active_timestamp';
      const DISMISSED_SESSION_KEY = 'lughati_daily_reminder_dismissed_session';

      const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
      const now = Date.now();
      const alreadyDismissedThisSession = sessionStorage.getItem(DISMISSED_SESSION_KEY);

      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        const elapsedHours = (now - lastActive) / (1000 * 60 * 60);
        setHoursSinceLastVisit(elapsedHours);

        // If >= 24 hours have passed and not already shown/dismissed in this session
        if (elapsedHours >= 24 && !alreadyDismissedThisSession) {
          const reminderTimer = setTimeout(() => {
            setIsDailyReminderOpen(true);
          }, 1500);
          return () => clearTimeout(reminderTimer);
        }
      } else {
        // Initial first visit: record timestamp
        localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
        setHoursSinceLastVisit(0);
      }
    } catch (e) {}
  }, []);

  const handleCloseDailyReminder = () => {
    setIsDailyReminderOpen(false);
    try {
      sessionStorage.setItem('lughati_daily_reminder_dismissed_session', 'true');
      localStorage.setItem('lughati_last_active_timestamp', Date.now().toString());
      setHoursSinceLastVisit(0);
    } catch (e) {}
  };

  const handleSimulate24Hours = () => {
    try {
      // Simulate 25 hours in the past
      const past25Hours = Date.now() - (25 * 60 * 60 * 1000);
      localStorage.setItem('lughati_last_active_timestamp', past25Hours.toString());
      sessionStorage.removeItem('lughati_daily_reminder_dismissed_session');
      setHoursSinceLastVisit(25);
      setIsDailyReminderOpen(true);
    } catch (e) {}
  };

  const handleUpdateStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('lughati_student_name', name);
    } catch (e) {}
  };

  const handleAddStars = (count: number) => {
    setStars((prev) => {
      const next = prev + count;
      try {
        localStorage.setItem('lughati_stars', next.toString());
      } catch (e) {}
      return next;
    });
  };

  const handleQuizCompleted = (quizId: string) => {
    setCompletedQuizzes((prev) => {
      if (!prev.includes(quizId)) {
        const next = [...prev, quizId];
        try {
          localStorage.setItem('lughati_completed_quizzes', JSON.stringify(next));
        } catch (e) {}
        return next;
      }
      return prev;
    });
  };

  const handleOpenReadingPathway = (track: 'all' | 'struggling' | 'short_text' | 'advanced' = 'all') => {
    setSelectedReadingTrack(track);
    setActiveTab('reading_path');
  };

  const handleCopyCurrentPageLink = () => {
    if (typeof window === 'undefined') return;
    const targetPath = getUrlForRoute(activeTab, currentGrade, selectedReadingTrack);
    const domain = window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://www.arabicksa.com';
    const fullUrl = `${domain}${targetPath}`;
    navigator.clipboard?.writeText(fullUrl).then(() => {
      setCopiedLinkToast(true);
      setTimeout(() => setCopiedLinkToast(false), 2500);
    });
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    // Automatically route to units tab, summaries, reading pathway, support plans, or foundation if relevant
    if (query.includes('ملخص') || query.includes('مذكرة') || query.includes('تذكير') || query.includes('قواعد المتوسطة') || query.includes('مذكرات')) {
      setActiveTab('summaries');
    } else if (query.includes('أول متوسط') || query.includes('اول متوسط') || query.includes('متوسط 1') || query.includes('م1') || query.includes('القيم الإسلامية')) {
      setCurrentGrade('intermediate1');
      setActiveTab('units');
    } else if (query.includes('ثاني متوسط') || query.includes('ثاني متوسط') || query.includes('متوسط 2') || query.includes('م2') || query.includes('تقنيات')) {
      setCurrentGrade('intermediate2');
      setActiveTab('units');
    } else if (query.includes('ثالث متوسط') || query.includes('متوسط 3') || query.includes('م3')) {
      setActiveTab('summaries');
    } else if (query.includes('انطلاق') || query.includes('قراءة') || query.includes('مسار') || query.includes('متعثر') || query.includes('طلاقة') || query.includes('نصوص') || query.includes('نص')) {
      handleOpenReadingPathway('all');
    } else if (query.includes('سبورة') || query.includes('رسم') || query.includes('whiteboard') || query.includes('لوحة')) {
      setActiveTab('whiteboard');
    } else if (query.includes('أسرة') || query.includes('أفراد') || query.includes('أبي') || query.includes('أمي') || query.includes('الميم') || query.includes('نشاط') || query.includes('أنشطة') || query.includes('توصيل') || query.includes('مطعم') || query.includes('معجون') || query.includes('سمكة') || query.includes('٤٢') || query.includes('42') || query.includes('مسجد') || query.includes('مدود') || query.includes('مد') || query.includes('كتابة')) {
      setCurrentGrade('grade1');
      setActiveTab('units');
    } else if (query.includes('كراسة') || query.includes('كراسة التمارين') || query.includes('تمارين كتابية') || query.includes('باعوش')) {
      setCurrentGrade('grade1');
      setActiveTab('grade1_workbook');
    } else if (query.includes('دعم') || query.includes('فاقد') || query.includes('علاج') || query.includes('خطة دعم') || query.includes('خطط')) {
      setActiveTab('support_plans');
    } else if (query.includes('إملاء') || query.includes('املاء') || query.includes('أبطال') || query.includes('ابطال') || query.includes('منظور') || query.includes('اختباري')) {
      setActiveTab('spelling_champions');
    } else if (query.includes('قاموس') || query.includes('معجم') || query.includes('مفردات') || query.includes('صورة')) {
      setActiveTab('dictionary');
    } else if (query.includes('حرف') || query.includes('شمسية') || query.includes('قمرية') || query.includes('تأسيس')) {
      setActiveTab('foundation');
    } else if (query.includes('إعراب') || query.includes('مساعد') || query.includes('معلم')) {
      setActiveTab('ai');
    } else {
      setActiveTab('units');
    }
  };

  const currentCurriculum = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification for Copied SEO Page Link */}
      {copiedLinkToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2.5 text-xs sm:text-sm font-black animate-in fade-in zoom-in-95 duration-200">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            ✓
          </span>
          <span>تم نسخ الرابط المباشر المخصص لهذه الصفحة بنجاح! 📋</span>
        </div>
      )}

      {/* Platform Header with Grade Selector & Controls */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={(g) => {
          setCurrentGrade(g);
          if (g === 'kg1' || g === 'kg2') {
            setActiveTab('kg');
          } else if (g === 'foundation') {
            setActiveTab('foundation');
          } else {
            setActiveTab('units');
          }
        }}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stars={stars}
        studentName={studentName}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onSearchQuery={handleSearchQuery}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onCopyPageLink={handleCopyCurrentPageLink}
        onOpenDailyReminder={() => setIsDailyReminderOpen(true)}
        isReminderOverdue={hoursSinceLastVisit >= 24}
      />

      {/* Main Grade Selector Ribbon */}
      <GradeSelector
        selectedGrade={currentGrade}
        onSelectGrade={(g) => {
          setCurrentGrade(g);
          if (g === 'kg1' || g === 'kg2') {
            setActiveTab('kg');
          } else if (g === 'foundation') {
            setActiveTab('foundation');
          } else {
            setActiveTab('units');
          }
        }}
        completedQuizzesCount={completedQuizzes.length}
        onOpenSupportPlans={() => setActiveTab('support_plans')}
        onOpenReadingPathway={handleOpenReadingPathway}
        onOpenSummaries={() => setActiveTab('summaries')}
        onOpenSpellingChampions={() => setActiveTab('spelling_champions')}
        onOpenGrade1Workbook={() => {
          setCurrentGrade('grade1');
          setActiveTab('grade1_workbook');
        }}
        onOpenExams={() => setActiveTab('exams')}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'kg' && <KgStudio />}

        {activeTab === 'units' && (
          <UnitViewer
            curriculum={currentCurriculum}
            onOpenQuizForLesson={() => setActiveTab('quiz')}
            onOpenWorksheetForLesson={() => setActiveTab('worksheets')}
            onOpenSupportPlans={() => setActiveTab('support_plans')}
            onOpenReadingPathway={handleOpenReadingPathway}
            onOpenSummaries={() => setActiveTab('summaries')}
            onOpenSpellingChampions={() => setActiveTab('spelling_champions')}
            onOpenExams={() => setActiveTab('exams')}
          />
        )}

        {activeTab === 'summaries' && (
          <SummariesStudio
            initialGrade={
              currentGrade === 'intermediate1' || currentGrade === 'intermediate2' || currentGrade === 'intermediate3'
                ? currentGrade
                : 'all'
            }
            onAddStars={handleAddStars}
            onNavigateToCurriculum={(gId) => {
              setCurrentGrade(gId as GradeId);
              setActiveTab('units');
            }}
          />
        )}

        {activeTab === 'books' && (
          <TextbooksLibrary
            onSelectGradeAndUnit={(grade, _unitNumber) => {
              setCurrentGrade(grade);
              setActiveTab('units');
            }}
            onNavigateToUnits={() => setActiveTab('units')}
          />
        )}

        {activeTab === 'foundation' && <FoundationStudio />}

        {activeTab === 'learning_games' && (
          <LearningGamesHub
            studentName={studentName}
            onAddStars={handleAddStars}
            onBackToMain={() => setActiveTab('units')}
          />
        )}

        {activeTab === 'dictionary' && (
          <VisualDictionary
            currentGrade={currentGrade}
            onAddStars={handleAddStars}
            studentName={studentName}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizHub
            currentGrade={currentGrade}
            studentName={studentName}
            onAddStars={handleAddStars}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsHub
            currentGrade={currentGrade}
            studentName={studentName}
            onAddStars={handleAddStars}
            onQuizCompleted={handleQuizCompleted}
            onBackToHome={() => setActiveTab('units')}
          />
        )}

        {activeTab === 'ai' && <AiTutor currentGrade={currentGrade} />}

        {activeTab === 'reading_path' && (
          <ReadingPathwayStudio
            studentName={studentName}
            onAddStars={handleAddStars}
            onBackToHome={() => setActiveTab('units')}
            initialTrack={selectedReadingTrack}
          />
        )}

        {activeTab === 'whiteboard' && <InteractiveWhiteboard />}

        {activeTab === 'spelling_champions' && (
          <SpellingChampionsStudio
            studentName={studentName}
            onAddStars={handleAddStars}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onBackToHome={() => setActiveTab('units')}
          />
        )}

        {activeTab === 'grade1_workbook' && (
          <Grade1WrittenWorksheetStudio
            studentName={studentName}
            onAddStars={handleAddStars}
            onBack={() => {
              setCurrentGrade('grade1');
              setActiveTab('units');
            }}
          />
        )}

        {activeTab === 'support_plans' && (
          <Grade1SupportPlans
            onBackToUnits={() => {
              setCurrentGrade('grade1');
              setActiveTab('units');
            }}
            onOpenWorksheet={() => setActiveTab('worksheets')}
            onOpenGrade1Workbook={() => setActiveTab('grade1_workbook')}
          />
        )}

        {activeTab === 'worksheets' && (
          <WorksheetGenerator
            currentGrade={currentGrade}
            studentName={studentName}
          />
        )}

        {activeTab === 'achievements' && (
          <StudentAchievements
            studentName={studentName}
            onUpdateStudentName={handleUpdateStudentName}
            stars={stars}
            completedQuizzes={completedQuizzes}
            currentGrade={currentGrade}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onOpenDailyReminder={() => setIsDailyReminderOpen(true)}
          />
        )}
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName={studentName}
        onUpdateStudentName={handleUpdateStudentName}
        currentGrade={currentGrade}
        stars={stars}
      />

      {/* Compact App Install Popup Modal */}
      <AppInstallAndTelegramModal
        isOpen={isInstallModalOpen}
        onClose={() => {
          setIsInstallModalOpen(false);
          try {
            sessionStorage.setItem('lughati_install_popup_dismissed', 'true');
          } catch (e) {}
        }}
      />

      {/* Daily Study Reminder Modal (24h Inactive Check) */}
      <DailyStudyReminderModal
        isOpen={isDailyReminderOpen}
        onClose={handleCloseDailyReminder}
        studentName={studentName}
        stars={stars}
        hoursSinceLastVisit={hoursSinceLastVisit}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          handleCloseDailyReminder();
        }}
        onSimulate24Hours={handleSimulate24Hours}
      />

      {/* Saudi Platform Footer */}
      <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          {/* Social Channels & Contact Banner in Footer */}
          <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/25 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="flex items-center gap-4 text-right relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-emerald-950/40">
                <Sparkles className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-white font-extrabold text-base sm:text-lg font-alexandria">
                    تابع قنواتنا التعليمية والبث المباشر
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-rose-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    بث مباشر تيك توك
                  </span>
                  <span className="text-[11px] bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full">
                    تحديثات يومية
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  تابع البث المباشر لشرح الدروس على <strong className="text-rose-300">تيك توك (arabiaeasy)</strong>، وقناة <strong className="text-sky-300">تيليجرام (arabiaeasy)</strong>، وتواصل معنا عبر <strong className="text-emerald-300">الواتساب</strong>:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto relative z-10">
              {/* TikTok Live Channel Button */}
              <a
                id="footer-tiktok-live-btn"
                href="https://www.tiktok.com/@arabiaeasy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 hover:from-rose-900 hover:to-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg border border-rose-500/40 flex items-center justify-center gap-2.5 transition-all group"
                title="قناتنا على تيك توك للبث المباشر: arabiaeasy"
              >
                {/* TikTok Icon */}
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.4 0 .78.08 1.12.22V9.45a6.35 6.35 0 0 0-1.12-.1 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.48V6.69z"/>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span>بث مباشر تيك توك</span>
                    <span className="text-[10px] text-rose-300 font-mono font-normal">@arabiaeasy</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Telegram Channel Join Button */}
              <a
                id="footer-telegram-join-btn"
                href="https://t.me/arabiaeasy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 transition-all border border-sky-400/30 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>تلغرام: @arabiaeasy</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              {/* WhatsApp Direct Chat Button */}
              <a
                id="footer-whatsapp-chat-button"
                href="https://wa.me/33773659697?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AF%D8%B1%D9%88%D8%B3%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D9%85%D9%86%D9%87%D8%A7%D8%AC%20%D9%84%D8%BA%D8%AA%D9%8A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all border border-emerald-400/30"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>واتساب: <span dir="ltr" className="font-mono text-amber-300 font-bold">+33 7 73 65 96 97</span></span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xl text-white font-alexandria">
                    منصة لُغَتِي التعليمية
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a 
                      href="https://www.arabicksa.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-400 font-mono hover:text-emerald-300 transition-colors flex items-center gap-1"
                    >
                      <span>www.arabicksa.com</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </a>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                      الموقع الرسمي 🇸🇦
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                منصة رقمية تفاعلية شاملة لتعليم مقرر لغتي الجميلة حسب المنهاج السعودي المعتمد من مرحلة التأسيس القرائي حتى الصف السادس الابتدائي، مدعومة بالمختبر الصوتي، المعرب الفوري، وبنك التمارين التفاعلية.
              </p>
              
              {/* Direct channels links list */}
              <div className="pt-2 space-y-2">
                <a
                  href="https://www.tiktok.com/@arabiaeasy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>بث مباشر تيك توك: <strong className="font-mono text-white underline underline-offset-4">@arabiaeasy</strong></span>
                </a>

                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>واتساب الاستفسارات والدروس: <span dir="ltr" className="font-mono font-bold text-white">+33773659697</span></span>
                </p>
              </div>
            </div>

            {/* Quick Grades Links */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                المراحل الدراسية
              </h4>
              <ul className="space-y-1.5 text-xs">
                {Object.values(GRADES_DATA).map((g) => (
                  <li key={g.id}>
                    <button
                      onClick={() => {
                        setCurrentGrade(g.id);
                        setActiveTab(g.id === 'foundation' ? 'foundation' : 'units');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {g.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Features */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                الأدوات التفاعلية
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• معمل الحركات والأصوات الهجائية الـ ٢٨</li>
                <li>• لعبة التمييز بين اللام الشمسية والقمرية</li>
                <li>• المُعرب النحوي ومساعد المعلم الذكي</li>
                <li>• أوراق العمل ونماذج تحسين الخط الجاهزة للطباعة</li>
                <li>• شهادات التفوق والتقدير المعتمدة</li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              جميع الحقوق محفوظة لمنهاج لغتي الجميلة © ١٤٤٧ - ١٤٤٨ هـ • المملكة العربية السعودية 🇸🇦
            </p>
            <div className="flex items-center gap-4">
              <span>مصممة وفق معايير وزارة التعليم</span>
              <span>•</span>
              <span>تعلّم ممتع وبناء لغوي متين</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          id="mobile-bottom-reading-path-btn"
          onClick={() => handleOpenReadingPathway('all')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black transition-all ${
            activeTab === 'reading_path'
              ? 'text-emerald-800 bg-emerald-100/80 scale-105'
              : 'text-slate-700 hover:text-emerald-700'
          }`}
        >
          <span className="text-base">🚀</span>
          <span>الانطلاق</span>
        </button>

        <button
          onClick={() => setActiveTab('units')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'units'
              ? 'text-emerald-800 bg-emerald-100/80 scale-105'
              : 'text-slate-700 hover:text-emerald-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>الوحدات</span>
        </button>

        <button
          onClick={() => setActiveTab('foundation')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'foundation'
              ? 'text-emerald-800 bg-emerald-100/80 scale-105'
              : 'text-slate-700 hover:text-emerald-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>التأسيس</span>
        </button>

        <button
          onClick={() => setActiveTab('whiteboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'whiteboard'
              ? 'text-emerald-800 bg-emerald-100/80 scale-105'
              : 'text-slate-700 hover:text-emerald-700'
          }`}
        >
          <span>✏️</span>
          <span>السبورة</span>
        </button>

        <button
          onClick={() => setActiveTab('support_plans')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'support_plans'
              ? 'text-rose-800 bg-rose-100/80 scale-105'
              : 'text-slate-700 hover:text-rose-700'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-rose-600" />
          <span>خطط الدعم</span>
        </button>
      </div>
    </div>
  );
}
