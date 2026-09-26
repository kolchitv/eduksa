import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  MessageCircle,
  BookMarked,
  Palette,
  Edit3,
  Send,
  ExternalLink,
  FolderOpen,
  Sliders
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { audioManager } from '../utils/audio';
import { WhatsAppContact } from './WhatsAppContact';
import { AudioSettingsModal } from './AudioSettingsModal';

export type TabType = 'units' | 'books' | 'foundation' | 'kg' | 'quiz' | 'ai' | 'worksheets' | 'achievements' | 'dictionary' | 'support_plans' | 'whiteboard' | 'reading_path';

interface HeaderProps {
  currentGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  stars: number;
  studentName: string;
  onOpenCertificate: () => void;
  onSearchQuery?: (q: string) => void;
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  activeTab,
  onChangeTab,
  stars,
  studentName,
  onOpenCertificate,
  onSearchQuery,
  onOpenInstallModal
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Ministry & Saudi Identity Strip */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>منصة لغتي التعليمية الشاملة • المنهاج السعودي المعتمد (١٤٤٧-١٤٤٨هـ)</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100 text-[11px] sm:text-xs">
          {/* Direct Google Drive Grade 1 Support Link in Top Strip */}
          <a
            id="top-strip-grade1-support-drive-link"
            href="https://drive.google.com/drive/folders/1Ux9UU0BD8aFFzaNzw66i4_tzAm2zm6jY"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border border-amber-200 transition-all text-[11px] shadow-xs"
            title="فتح مجلد خطط دعم الصف الأول على Google Drive"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
            <span>📁 خطط دعم الصف الأول (Google Drive)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          {/* TikTok Live link in top strip */}
          <a
            id="top-strip-tiktok-live-link"
            href="https://www.tiktok.com/@arabiaeasy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 hover:bg-rose-600 text-white font-bold border border-rose-300/40 transition-all text-[11px]"
            title="بث مباشر تيك توك: @arabiaeasy"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>بث مباشر تيك توك: arabiaeasy</span>
          </a>

          {/* Telegram link in top strip */}
          <a
            id="top-strip-telegram-link"
            href="https://t.me/arabiaeasy"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/30 hover:bg-sky-500 text-white font-bold border border-sky-300/30 transition-all text-[11px]"
            title="انضم إلى قناة تلغرام @arabiaeasy"
          >
            <Send className="w-3 h-3 text-sky-200" />
            <span>تلغرام: @arabiaeasy</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="hidden sm:inline">المملكة العربية السعودية 🇸🇦</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => onChangeTab('units')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight font-alexandria">
                  لُغَتِي
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  السعودية
                </span>
              </div>
            </div>
          </div>

          {/* Direct prominent Reading Pathway Launch Button */}
          <button
            id="header-direct-reading-pathway-btn"
            onClick={() => onChangeTab('reading_path')}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md hover:shadow-lg border border-emerald-400/40 active:scale-95 transition-all cursor-pointer group shrink-0"
            title="الانتقال إلى مسار الانطلاق في القراءة المتدرج (للمتعثرين والمتقدمين)"
          >
            <span className="text-base sm:text-lg animate-bounce">🚀</span>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-tight font-alexandria">الانطلاق في القراءة</span>
                <span className="bg-amber-400 text-amber-950 text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-black shadow-xs">
                  مسار القراءة 📖
                </span>
              </div>
              <p className="text-[10px] text-emerald-100 hidden sm:block leading-none">
                جمل للمتعثرين • نصوص قصيرة • نصوص متقدمة
              </p>
            </div>
          </button>

          {/* Center Grade Selector (Dropdown to keep header uncluttered) */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              id="header-grade-dropdown-btn"
              onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                {currentGrade.startsWith('kg') ? '🌱' : currentGrade === 'foundation' ? '✨' : '📖'}
              </div>
              <span>{currentGradeData.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${gradeDropdownOpen ? 'rotate-180 text-emerald-700' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {gradeDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  اختر الصف الدراسي:
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                  {Object.values(GRADES_DATA).map((grade) => {
                    const isSelected = currentGrade === grade.id;
                    return (
                      <button
                        key={grade.id}
                        id={`dropdown-grade-${grade.id}`}
                        onClick={() => {
                          onSelectGrade(grade.id);
                          setGradeDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold text-right transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {grade.id.startsWith('kg') ? '🌱' : grade.id === 'foundation' ? '✨' : '📖'}
                          </span>
                          <span>{grade.name}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Student Stats */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Small Non-Floating WhatsApp Button inside navbar */}
            <WhatsAppContact phoneNumber="33773659697" displayNumber="+33 7 73 65 96 97" variant="compact" />

            {/* Search Trigger */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
              title="بحث في الدروس والقواعد"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Audio Voice Controls & Settings */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200">
              <button
                id="audio-mute-toggle-btn"
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg transition-colors ${
                  isMuted
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white text-emerald-700 shadow-xs hover:bg-emerald-50'
                }`}
                title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                id="audio-settings-modal-btn"
                onClick={() => setAudioModalOpen(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-white transition-colors"
                title="إعدادات واختبار النطق العربي (حل مشاكل الصوت)"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Install App & Telegram Popup Trigger Button */}
            {onOpenInstallModal && (
              <button
                id="header-install-app-btn"
                onClick={onOpenInstallModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 animate-pulse"
                title="تثبيت التطبيق على جهازك أو الانضمام لقناة تلغرام"
              >
                <span>📲</span>
                <span>تثبيت التطبيق</span>
              </button>
            )}

            {/* Student Stars & Badge */}
            <button 
              id="student-stars-badge"
              onClick={() => onChangeTab('achievements')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 border border-amber-300 rounded-xl cursor-pointer transition-all shadow-2xs active:scale-95 select-none"
              title="لوحة الإنجازات والشهادات - انقر للاطلاع"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-sm font-extrabold text-amber-900">{stars}</span>
              <span className="text-xs font-bold text-amber-800 hidden sm:inline">نجمة</span>
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
        <div className="hidden md:flex items-center justify-between border-t border-slate-100 py-1.5 overflow-x-auto">
          <nav className="flex items-center gap-1">
            <button
              id="nav-tab-reading-path"
              onClick={() => onChangeTab('reading_path')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reading_path'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'text-emerald-950 hover:text-white hover:bg-emerald-700 bg-emerald-100/90 border border-emerald-300 shadow-2xs'
              }`}
            >
              <span className="text-amber-300 font-bold">🚀</span>
              <span>الانطلاق في القراءة</span>
              <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded font-black">المسار 📖</span>
            </button>

            <button
              id="nav-tab-units"
              onClick={() => onChangeTab('units')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'units'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>الوحدات والدروس</span>
            </button>

            <button
              id="nav-tab-books"
              onClick={() => onChangeTab('books')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'books'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
              <span>كُتُب لُغَتِي المدرسية</span>
            </button>

            <button
              id="nav-tab-kg"
              onClick={() => onChangeTab('kg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'kg'
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
              }`}
            >
              <span>🌱</span>
              <span>روضة لغتي (KG)</span>
            </button>

            <button
              id="nav-tab-foundation"
              onClick={() => onChangeTab('foundation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'foundation'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>معمل التأسيس</span>
            </button>

            <button
              id="nav-tab-dictionary"
              onClick={() => onChangeTab('dictionary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dictionary'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>القاموس الصوتي والمرئي</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                0.5x 🐢
              </span>
            </button>

            <button
              id="nav-tab-quiz"
              onClick={() => onChangeTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>الاختبارات</span>
            </button>

            <button
              id="nav-tab-ai"
              onClick={() => onChangeTab('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>المُعرب الذكي</span>
            </button>

            <button
              id="nav-tab-whiteboard"
              onClick={() => onChangeTab('whiteboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'whiteboard'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'text-teal-800 hover:text-white hover:bg-teal-600 bg-teal-50 border border-teal-200 shadow-2xs'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>السبورة التفاعلية ✏️</span>
              <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded font-bold">جديد</span>
            </button>

            <button
              id="nav-tab-support-plans"
              onClick={() => onChangeTab('support_plans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'support_plans'
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
                  : 'text-rose-800 hover:text-white hover:bg-rose-600 bg-rose-100/90 border border-rose-300/80 shadow-2xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <FolderOpen className="w-3.5 h-3.5" />
              <span>خطط الدعم (الصف الأول) 📁</span>
            </button>

            <button
              id="nav-tab-worksheets"
              onClick={() => onChangeTab('worksheets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'worksheets'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>أوراق العمل</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 whitespace-nowrap">
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
              id="mobile-nav-reading-path"
              onClick={() => {
                onChangeTab('reading_path');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-black ${
                activeTab === 'reading_path' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-emerald-950 bg-emerald-100/80 border border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <span>الانطلاق في القراءة (المسار المتدرج)</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full">٦ مستويات</span>
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
              <span>الوحدات والدروس</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('books');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'books' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <BookMarked className="w-4 h-4 text-emerald-600" />
              <span>كُتُب لُغَتِي المدرسية</span>
            </button>

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
              <span>روضة لغتي (KG)</span>
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
              <span>معمل التأسيس</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('dictionary');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'dictionary' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>القاموس الصوتي والمرئي</span>
              </div>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                0.5x للمخارج 🐢
              </span>
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
              <span>الاختبارات</span>
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
              <span>المُعرب الذكي</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('whiteboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'whiteboard' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-900 bg-teal-50/80 border border-teal-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>السبورة التفاعلية الذكية للمعلمين</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full">جديد ✨</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('support_plans');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                activeTab === 'support_plans' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'text-slate-700'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-rose-600" />
              <span>خطط الدعم والملفات (الصف الأول)</span>
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
              <span>أوراق العمل</span>
            </button>

            <button
              onClick={() => {
                onChangeTab('achievements');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>رصيد النجوم والشهادات</span>
              </div>
              <span className="font-extrabold">{stars} ★</span>
            </button>

            {/* Mobile Install App Button */}
            {onOpenInstallModal && (
              <button
                id="mobile-install-app-btn"
                onClick={() => {
                  onOpenInstallModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white font-black text-xs flex items-center justify-between shadow-md active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">📲</span>
                  <span>تثبيت التطبيق على الهاتف / الحاسوب</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">مجاني</span>
              </button>
            )}

            {/* Mobile Channel, TikTok Live & WhatsApp buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <a
                href="https://www.tiktok.com/@arabiaeasy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-rose-950 text-white border border-rose-500/40 text-xs font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>بث مباشر تيك توك: arabiaeasy</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://t.me/arabiaeasy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>تلغرام @arabiaeasy</span>
                </a>

                <a
                  href="https://wa.me/33773659697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>واتساب الدروس</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Settings & Diagnostics Modal */}
      <AudioSettingsModal 
        isOpen={audioModalOpen} 
        onClose={() => setAudioModalOpen(false)} 
      />
    </header>
  );
};
