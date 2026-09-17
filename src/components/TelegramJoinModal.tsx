import React, { useState, useEffect } from 'react';
import { Send, X, Sparkles, CheckCircle2, Users, Bell, ExternalLink, BookOpen, Star } from 'lucide-react';

interface TelegramJoinModalProps {
  channelUrl?: string;
  channelName?: string;
  autoOpenDelayMs?: number;
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({
  channelUrl = 'https://t.me/arabialearning',
  channelName = 'العربية بسهولة',
  autoOpenDelayMs = 800
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has dismissed it in this session
    const hasSeenModal = sessionStorage.getItem('lughati_telegram_joined_seen');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, autoOpenDelayMs);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelayMs]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('lughati_telegram_joined_seen', 'true');
  };

  const handleJoinClick = () => {
    sessionStorage.setItem('lughati_telegram_joined_seen', 'true');
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Header Pattern */}
        <div className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white p-6 sm:p-7 text-center overflow-hidden">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-300/20 rounded-full blur-xl pointer-events-none -ml-8 -mb-8"></div>

          {/* Close button */}
          <button
            id="close-telegram-modal-btn"
            onClick={handleClose}
            className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Telegram Badge & Icon */}
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white text-sky-600 shadow-xl shadow-sky-900/30 flex items-center justify-center mb-3 group hover:scale-105 transition-transform">
            {/* Telegram Icon SVG */}
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 fill-current translate-x-[-1px] translate-y-[1px]" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-white"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-sky-50 mb-1.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>قناة تعليمية متميزة</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-alexandria text-white tracking-tight">
            انضم إلى {channelName}
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 font-medium">
            مجتمع تفاعلي لتعليم اللغة العربية وتأسيس القراءة والإملاء
          </p>
        </div>

        {/* Modal Body & Benefits */}
        <div className="p-6 space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100">
              <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-slate-900">شروحات ودروس يومية مبسطة</h4>
                <p className="text-[11px] text-slate-600">دروس في تأسيس الحركات، المدود، القواعد النحوية، والظواهر الإملائية.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-slate-900">أوراق عمل وبطاقات قابلة للطباعة</h4>
                <p className="text-[11px] text-slate-600">ملفات PDF وأنشطة تدريبية أسبوعية للطلاب وأولياء الأمور والمعلمين.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-slate-900">تنبيهات بالاختبارات والأنشطة الجديدة</h4>
                <p className="text-[11px] text-slate-600">كن أول من يحصل على التحديثات والمراجعات النهائية للمنهج الدراسي.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              id="join-telegram-channel-btn"
              onClick={handleJoinClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 hover:from-sky-600 to-blue-600 hover:to-blue-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-95 border border-sky-400/30 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>انضم الآن إلى القناة عبر تيليجرام</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </button>

            <button
              id="close-telegram-modal-later-btn"
              onClick={handleClose}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              تصفح الموقع أولاً (سأشترك لاحقاً)
            </button>

            {/* TikTok Live Link option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                قناتنا للبث المباشر:
              </span>
              <a
                href="https://www.tiktok.com/@arabiaeasy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline text-[11px]"
              >
                <span>تيك توك @arabiaeasy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
