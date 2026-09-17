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
import { CertificateModal } from './components/CertificateModal';
import { StudentAchievements } from './components/StudentAchievements';
import { WhatsAppContact } from './components/WhatsAppContact';
import { TelegramJoinModal } from './components/TelegramJoinModal';
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
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentGrade, setCurrentGrade] = useState<GradeId>('kg1');
  const [activeTab, setActiveTab] = useState<'units' | 'foundation' | 'kg' | 'quiz' | 'ai' | 'worksheets' | 'achievements' | 'dictionary'>('kg');
  const [studentName, setStudentName] = useState<string>('فهد المنصور');
  const [stars, setStars] = useState<number>(35);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(['quiz_found_1']);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
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
    // Automatically route to units tab or foundation if relevant
    if (query.includes('إملاء') || query.includes('قاموس') || query.includes('معجم') || query.includes('مفردات') || query.includes('صورة')) {
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
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'kg' && <KgStudio />}

        {activeTab === 'units' && (
          <UnitViewer
            curriculum={currentCurriculum}
            onOpenQuizForLesson={() => setActiveTab('quiz')}
            onOpenWorksheetForLesson={() => setActiveTab('worksheets')}
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

      {/* Telegram Channel Popup Modal on Opening */}
      <TelegramJoinModal
        channelUrl="https://t.me/arabialearning"
        channelName="العربية بسهولة"
        autoOpenDelayMs={600}
      />

      {/* Saudi Platform Footer */}
      <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          {/* Social Channels & Contact Banner in Footer */}
          <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 border border-emerald-500/20 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-right">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/30">
                <Send className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg font-alexandria flex items-center gap-2">
                  <span>انضم لمجتمعنا التعليمي وتواصل مع المشرفين</span>
                  <span className="text-xs bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full">تحديثات يومية</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  تابع قناة «العربية بسهولة» على تيليجرام وتواصل معنا عبر الواتساب للاستفسارات والدروس:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Telegram Channel Join Button */}
              <a
                id="footer-telegram-join-btn"
                href="https://t.me/arabialearning"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2.5 transition-all border border-sky-400/30 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>انضم إلى العربية بسهولة</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              {/* WhatsApp Direct Chat Button */}
              <a
                id="footer-whatsapp-chat-button"
                href="https://wa.me/33773659697?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AF%D8%B1%D9%88%D8%B3%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D9%85%D9%86%D9%87%D8%A7%D8%AC%20%D9%84%D8%BA%D8%AA%D9%8A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-all border border-emerald-400/30"
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
              <div className="pt-2">
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
