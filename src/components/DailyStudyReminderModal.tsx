import React, { useEffect } from 'react';
import { 
  X, 
  Bell, 
  Sparkles, 
  Star, 
  BookOpen, 
  Gamepad2, 
  Edit3, 
  ArrowRight, 
  Clock, 
  Heart,
  RotateCcw
} from 'lucide-react';
import { TabType } from './Header';
import { audioManager } from '../utils/audio';

interface DailyStudyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  stars?: number;
  hoursSinceLastVisit?: number;
  onNavigateToTab?: (tab: TabType) => void;
  onSimulate24Hours?: () => void;
}

export const DailyStudyReminderModal: React.FC<DailyStudyReminderModalProps> = ({
  isOpen,
  onClose,
  studentName = 'بطل لغتي',
  stars = 0,
  hoursSinceLastVisit = 24,
  onNavigateToTab,
  onSimulate24Hours
}) => {
  // Play friendly chime on open
  useEffect(() => {
    if (isOpen) {
      try {
        audioManager.play('click');
      } catch (e) {}
    }
  }, [isOpen]);

  // Handle ESC key to easily dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartReview = (tab: TabType = 'units') => {
    try {
      audioManager.play('click');
    } catch (e) {}
    onClose();
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  const handleDismiss = () => {
    try {
      audioManager.play('click');
    } catch (e) {}
    onClose();
  };

  const roundedHours = Math.max(24, Math.round(hoursSinceLastVisit));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-reminder-title"
    >
      {/* Click outside backdrop overlay */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 px-6 pt-6 pb-8 text-white text-center overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/15 rounded-full blur-xl pointer-events-none" />

          {/* Close Button (X) - Prominent, child-friendly tap area */}
          <button
            id="close-daily-reminder-btn"
            onClick={handleDismiss}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 border border-white/30 shadow-xs"
            title="إغلاق التذكير بسهولة"
            aria-label="إغلاق التذكير"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mascot Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-lg text-4xl mb-3 animate-bounce">
            ⏰
          </div>

          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-amber-100 border border-white/30 mb-2">
            <Bell className="w-3.5 h-3.5 text-amber-200" />
            <span>تذكير الدراسة اليومي • لغتي التفاعلية</span>
          </div>

          {/* Title */}
          <h2 
            id="daily-reminder-title"
            className="text-2xl sm:text-3xl font-black font-alexandria text-white tracking-tight"
          >
            مرحباً يا بطل {studentName}! 🌟
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-bold mt-1">
            اشتقنا إليك! مضى يوم كامل ({roundedHours} ساعة) منذ آخر زيارة لك.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Encouragement & Star Balance Box */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>خمس دقائق فقط اليوم تحافظ على تفوقك!</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-300 font-black shadow-2xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{stars}</span>
              <span className="text-[10px] text-amber-800">نجمة</span>
            </div>
          </div>

          {/* Friendly Message */}
          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed text-right">
            القراءة اليومية تصنع بطل المستقبل! اختر نشاطاً واحداً ممتعاً لنكسب نجوماً جديدة اليوم:
          </p>

          {/* Quick Study Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Option 1: Units Review */}
            <button
              onClick={() => handleStartReview('units')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-right flex flex-col justify-between gap-2 cursor-pointer group active:scale-95 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 group-hover:text-emerald-800 block">
                  📖 مراجعة درس
                </span>
                <span className="text-[10px] text-slate-500">
                  قراءة سريعة مع الصوت
                </span>
              </div>
            </button>

            {/* Option 2: Games */}
            <button
              onClick={() => handleStartReview('learning_games')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all text-right flex flex-col justify-between gap-2 cursor-pointer group active:scale-95 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 group-hover:text-purple-800 block">
                  🎮 لعبة الحروف
                </span>
                <span className="text-[10px] text-slate-500">
                  تحدي المقاطع والمرح
                </span>
              </div>
            </button>

            {/* Option 3: Spelling */}
            <button
              onClick={() => handleStartReview('spelling_champions')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-right flex flex-col justify-between gap-2 cursor-pointer group active:scale-95 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 group-hover:text-amber-800 block">
                  ✍️ أبطال الإملاء
                </span>
                <span className="text-[10px] text-slate-500">
                  تدريب 3 كلمات فقط
                </span>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            {/* Primary Action Button */}
            <button
              id="daily-reminder-start-now-btn"
              onClick={() => handleStartReview('units')}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>هيا بنا نراجع الآن! 🚀</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            {/* Dismiss Button - Easy to close */}
            <button
              id="daily-reminder-dismiss-btn"
              onClick={handleDismiss}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 border border-slate-200"
            >
              سأراجع لاحقاً 😊
            </button>
          </div>

          {/* Simulation & Reset Shortcut for testing */}
          {onSimulate24Hours && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>محاكاة الفحص: 24 ساعة منذ آخر نشاط</span>
              </span>
              <button
                onClick={onSimulate24Hours}
                className="text-amber-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                title="إعادة ضبط العداد لمحاكاة مرور 24 ساعة مرة أخرى"
              >
                <RotateCcw className="w-3 h-3" />
                <span>محاكاة 24 ساعة</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
