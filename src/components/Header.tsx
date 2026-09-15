import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Award, 
  BrainCircuit, 
  Printer, 
  Search, 
  Menu, 
  X,
  Star,
  CheckCircle2,
  MessageCircle,
  Phone
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { audioManager } from '../utils/audio';

interface HeaderProps {
  currentGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  activeTab: 'units' | 'foundation' | 'kg' | 'quiz' | 'ai' | 'worksheets' | 'achievements';
  onChangeTab: (tab: 'units' | 'foundation' | 'kg' | 'quiz' | 'ai' | 'worksheets' | 'achievements') => void;
  stars: number;
  studentName: string;
  onOpenCertificate: () => void;
  onSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  activeTab,
  onChangeTab,
  stars,
  studentName,
  onOpenCertificate,
  onSearchQuery
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery && searchInput.trim()) {
      onSearchQuery(searchInput.trim());
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Ministry & Saudi Identity Strip */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>منصة لغتي التعليمية الشاملة • المنهاج السعودي المعتمد (١٤٤٧-١٤٤٨هـ)</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-100 text-[11px] sm:text-xs">
          <a
            id="top-whatsapp-contact-link"
            href="https://wa.me/33773659697?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AF%D8%B1%D9%88%D8%B3%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D9%85%D9%86%D9%87%D8%A7%D8%AC%20%D9%84%D8%BA%D8%AA%D9%8A"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-100 hover:text-white px-3 py-0.5 rounded-full transition-colors shadow-sm"
            title="واتساب الدروس والمعلومات"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">واتساب الدروس والمعلومات:</span>
            <span dir="ltr" className="font-bold text-white tracking-wider">+33 7 73 65 96 97</span>
          </a>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">المملكة العربية السعودية 🇸🇦</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          {/* Brand & Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => onChangeTab('units')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight font-alexandria">
                  لُغَتِي
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  السعودية
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                تأسيس ومنهاج الصفوف (١ - ٦)
              </p>
            </div>
          </div>

          {/* Center Grade Switcher Selector */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {Object.values(GRADES_DATA).map((grade) => (
              <button
                key={grade.id}
                id={`grade-nav-btn-${grade.id}`}
                onClick={() => onSelectGrade(grade.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                  currentGrade === grade.id
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80 scale-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {grade.id === 'foundation' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{grade.id === 'foundation' ? 'التأسيس' : grade.name.replace('الصف ', '')}</span>
              </button>
            ))}
          </div>

          {/* Right Action Icons & Student Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
              title="بحث في القواعد والدروس"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Audio Voice Toggle */}
            <button
              id="audio-mute-toggle-btn"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-colors border ${
                isMuted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Student Stars & Badge */}
            <div 
              id="student-stars-badge"
              onClick={() => onChangeTab('achievements')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors select-none"
              title="لوحة الإنجازات والشهادات"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-sm font-bold text-amber-800">{stars}</span>
              <span className="text-xs text-amber-700 hidden sm:inline">نجمة</span>
            </div>

            {/* WhatsApp Lessons & Inquiries Action */}
            <a
              id="header-whatsapp-btn"
              href="https://wa.me/33773659697?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AF%D8%B1%D9%88%D8%B3%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D9%85%D9%86%D9%87%D8%A7%D8%AC%20%D9%84%D8%BA%D8%AA%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="تواصل واتساب للدروس والمعلومات (+33773659697)"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>واتساب الدروس</span>
            </a>

            {/* Claim Certificate Button */}
            <button
              id="header-certificate-btn"
              onClick={onOpenCertificate}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 hover:opacity-95 active:scale-95 transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>شهادة تفوق</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="hidden md:flex items-center justify-between border-t border-slate-100 py-2">
          <nav className="flex items-center gap-1">
            <button
              id="nav-tab-units"
              onClick={() => onChangeTab('units')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'units'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الوحدات والدروس ({currentGradeData.name})</span>
            </button>

            <button
              id="nav-tab-kg"
              onClick={() => onChangeTab('kg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'kg'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
              }`}
            >
              <span>🌱</span>
              <span>روضة لغتي (KG1 و KG2)</span>
            </button>

            <button
              id="nav-tab-foundation"
              onClick={() => onChangeTab('foundation')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'foundation'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>معمل الحركات والتأسيس</span>
            </button>

            <button
              id="nav-tab-quiz"
              onClick={() => onChangeTab('quiz')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>بنك التمارين والاختبارات</span>
            </button>

            <button
              id="nav-tab-ai"
              onClick={() => onChangeTab('ai')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>المُعرب ومعلم لغتي الذكي</span>
            </button>

            <button
              id="nav-tab-worksheets"
              onClick={() => onChangeTab('worksheets')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'worksheets'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>أوراق العمل والطباعة</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>الطالب/ـة:</span>
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {studentName}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Drawer / Bar */}
      {searchOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-field"
                type="text"
                placeholder="ابحث عن درس أو قاعدة إملائية أو ظاهرة نحوية (مثال: اللام الشمسية، الهمزة المتوسطة، المبتدأ والخبر...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pr-9 pl-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800"
                autoFocus
              />
            </div>
            <button
              id="search-submit-btn"
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
            >
              بحث
            </button>
            <button
              id="search-close-btn"
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-2">اختر الصف الدراسي:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.values(GRADES_DATA).map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => {
                    onSelectGrade(grade.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-xs font-bold text-center border ${
                    currentGrade === grade.id
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {grade.id === 'foundation' ? 'التأسيس' : grade.name.replace('الصف ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <button
              onClick={() => {
                onChangeTab('kg');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'kg' ? 'bg-sky-50 text-sky-800' : 'text-slate-700'
              }`}
            >
              <span>🌱</span>
              <span>روضة لغتي (KG1 و KG2)</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('units');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'units' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>الوحدات والدروس ({currentGradeData.name})</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('foundation');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'foundation' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>معمل الحركات والتأسيس</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('quiz');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'quiz' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>بنك التمارين والاختبارات</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('ai');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'ai' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <span>المُعرب ومعلم لغتي الذكي</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('worksheets');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'worksheets' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>أوراق العمل والطباعة</span>
            </button>

            <a
              href="https://wa.me/33773659697?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AF%D8%B1%D9%88%D8%B3%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D9%85%D9%86%D9%87%D8%A7%D8%AC%20%D9%84%D8%BA%D8%AA%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-900 border border-emerald-300"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>واتساب الدروس والمعلومات</span>
              </div>
              <span dir="ltr" className="text-xs font-mono font-bold text-emerald-800">+33773659697</span>
            </a>

            <button
              onClick={() => {
                onOpenCertificate();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 mt-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>إصدار شهادة تفوق في لغتي</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
