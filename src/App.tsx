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
import { TabType } from './components/Header';
import { GRADE1_SUPPORT_DRIVE_URL } from './data/grade1SupportPlansData';
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
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [currentGrade, setCurrentGrade] = useState<GradeId>('grade1');
  const [activeTab, setActiveTab] = useState<TabType>('units');
  const [studentName, setStudentName] = useState<string>('فهد المنصور');
  const [stars, setStars] = useState<number>(35);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(['quiz_found_1']);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    // Automatically route to units tab, support plans, or foundation if relevant
    if (query.includes('سبورة') || query.includes('رسم') || query.includes('whiteboard') || query.includes('لوحة')) {
      setActiveTab('whiteboard');
    } else if (query.includes('أسرة') || query.includes('أفراد') || query.includes('أبي') || query.includes('أمي') || query.includes('الميم') || query.includes('نشاط') || query.includes('أنشطة') || query.includes('توصيل') || query.includes('مطعم') || query.includes('معجون') || query.includes('سمكة') || query.includes('٤٢') || query.includes('42') || query.includes('مسجد') || query.includes('مدود') || query.includes('مد') || query.includes('كتابة')) {
      setCurrentGrade('grade1');
      setActiveTab('units');
    } else if (query.includes('دعم') || query.includes('فاقد') || query.includes('علاج') || query.includes('خطة دعم') || query.includes('خطط')) {
      setActiveTab('support_plans');
    } else if (query.includes('إملاء') || query.includes('قاموس') || query.includes('معجم') || query.includes('مفردات') || query.includes('صورة')) {
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
            onAddStars={handleAddStars}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {activeTab === 'ai' && <AiTutor currentGrade={currentGrade} />}

        {activeTab === 'whiteboard' && <InteractiveWhiteboard />}

        {activeTab === 'support_plans' && (
          <Grade1SupportPlans
            onBackToUnits={() => {
              setCurrentGrade('grade1');
              setActiveTab('units');
            }}
            onOpenWorksheet={() => setActiveTab('worksheets')}
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

      {/* App Install & Telegram Channel Popup Modal */}
      <AppInstallAndTelegramModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        telegramChannelUrl="https://t.me/arabiaeasy"
        telegramChannelHandle="arabiaeasy"
        autoOpenDelayMs={600}
      />

      {/* Persistent Floating Quick Bar for Grade 1 Support Plans & App Install */}
      <div className="no-print fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md bg-slate-950/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl border border-rose-500/40 shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <p className="text-[11px] font-black text-rose-300 truncate">
                خطط دعم الصف الأول (Google Drive)
              </p>
            </div>
            <p className="text-[10px] text-slate-300 truncate">
              مذكرات علاج الفاقد والضعف القرائي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="floating-install-app-btn"
            onClick={() => setIsInstallModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-[11px] font-black transition-all flex items-center gap-1 shadow-xs"
            title="تثبيت التطبيق على جهازك أو الانضمام لتلغرام"
          >
            <span>📲</span>
            <span>تثبيت</span>
          </button>
          <button
            id="floating-open-support-plans-btn"
            onClick={() => {
              setCurrentGrade('grade1');
              setActiveTab('support_plans');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all"
            title="تصفح بالموقع"
          >
            تصفح
          </button>
          <a
            id="floating-open-drive-btn"
            href={GRADE1_SUPPORT_DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-[11px] transition-all flex items-center gap-1 shadow-xs"
            title="فتح Google Drive"
          >
            <span>Drive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

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
                <span className="font-extrabold text-xl text-white font-alexandria">
                  منصة لُغَتِي التعليمية
                </span>
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
    </div>
  );
}
