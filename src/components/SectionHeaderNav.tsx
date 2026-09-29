import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  ChevronDown, 
  Check, 
  Sparkles, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Zap, 
  Image as ImageIcon, 
  FileText, 
  Printer, 
  Music, 
  ShieldCheck, 
  Trophy,
  Library,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { TabType } from './Header';
import { audioManager } from '../utils/audio';

interface SectionHeaderNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  stars: number;
}

export const SectionHeaderNav: React.FC<SectionHeaderNavProps> = ({
  activeTab,
  onChangeTab,
  stars
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sectionsList: { id: TabType; title: string; icon: React.ElementType; color: string }[] = [
    { id: 'units', title: 'الوحدات والمناهج', icon: BookOpen, color: 'text-blue-600' },
    { id: 'reading_path', title: 'مسار القراءة', icon: Compass, color: 'text-purple-600' },
    { id: 'foundation', title: 'معمل التأسيس', icon: Sparkles, color: 'text-emerald-600' },
    { id: 'spelling', title: 'أبطال الإملاء', icon: Edit3, color: 'text-amber-600' },
    { id: 'kg', title: 'رياض الأطفال', icon: GraduationCap, color: 'text-amber-600' },
    { id: 'quiz', title: 'بنك التقييمات', icon: Zap, color: 'text-rose-600' },
    { id: 'dictionary', title: 'المعجم البصري', icon: ImageIcon, color: 'text-teal-600' },
    { id: 'summaries', title: 'ملخصات ومطويات', icon: FileText, color: 'text-indigo-600' },
    { id: 'worksheets', title: 'أوراق العمل', icon: Printer, color: 'text-orange-600' },
    { id: 'books', title: 'مكتبة المقررات', icon: Library, color: 'text-sky-600' },
    { id: 'songs', title: 'الأناشيد المدرسية', icon: Music, color: 'text-pink-600' },
    { id: 'support_plans', title: 'الخطط العلاجية', icon: ShieldCheck, color: 'text-emerald-700' },
    { id: 'achievements', title: 'لوحة الإنجازات', icon: Trophy, color: 'text-yellow-600' }
  ];

  const currentSection = sectionsList.find(s => s.id === activeTab) || sectionsList[0];
  const CurrentIcon = currentSection.icon;

  const handleGoHome = () => {
    audioManager.play('click');
    onChangeTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSection = (id: TabType) => {
    audioManager.play('click');
    onChangeTab(id);
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between flex-wrap gap-2.5">
        {/* Right side: Clear Home Button + Current Section Name */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 group"
            title="العودة إلى البوابة الرئيسية"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>البوابة الرئيسية</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Current Active Section Badge */}
          <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/70">
            <CurrentIcon className={`w-4 h-4 ${currentSection.color}`} />
            <span className="text-xs sm:text-sm font-black text-slate-800 font-alexandria">
              {currentSection.title}
            </span>
          </div>
        </div>

        {/* Left side: Quick Section Switcher Dropdown & Stars */}
        <div className="flex items-center gap-2.5">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
            >
              <span>الانتقال لقسم آخر</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 grid grid-cols-1 gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 mb-1">
                  اختر قسماً للانتقال المباشر:
                </div>
                {sectionsList.map((sec) => {
                  const SecIcon = sec.icon;
                  const isCurrent = activeTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`flex items-center justify-between p-2 rounded-xl text-right text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <SecIcon className={`w-4 h-4 ${sec.color}`} />
                        <span>{sec.title}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Child's Star Counter */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl">
            <span className="text-sm">⭐</span>
            <span className="text-xs font-black text-amber-900">{stars}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
