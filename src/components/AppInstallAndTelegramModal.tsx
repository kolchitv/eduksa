import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Sparkles,
  Layers,
  Send,
  ExternalLink
} from 'lucide-react';

interface AppInstallAndTelegramModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  telegramChannelUrl?: string;
  telegramChannelHandle?: string;
  autoOpenDelayMs?: number;
}

export const AppInstallAndTelegramModal: React.FC<AppInstallAndTelegramModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  telegramChannelUrl = 'https://t.me/arabiaeasy',
  telegramChannelHandle = '@arabiaeasy'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // Detect iOS Device
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      localStorage.setItem('lughati_install_modal_dismissed', 'true');
    } catch (e) {}
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallSuccess(true);
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install error', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-right p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (X) */}
        <button
          id="close-install-modal-btn"
          onClick={handleClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Compact App Icon & Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xl font-black shadow-md shrink-0">
            🇸🇦
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                تطبيق الويب PWA
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-alexandria">
              تثبيت منصة لُغَتِي
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          ثبّت التطبيق على شاشة جهازك للوصول السريع وتصفح الدروس وأوراق العمل بكل سهولة.
        </p>

        {/* Install State / iOS Guidance / Action Button */}
        {installSuccess ? (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-bold mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم تثبيت التطبيق بنجاح على جهازك!</span>
          </div>
        ) : isIos ? (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs font-medium space-y-1.5 mb-3">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Share className="w-4 h-4 text-amber-700" />
              <span>طريقة التثبيت على آيفون / آيباد:</span>
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              1. اضغط على زر المشاركة <span className="font-bold">⎋</span> في متصفح Safari.<br />
              2. اختر <span className="font-bold">«إضافة إلى الشاشة الرئيسية ➕»</span>.
            </p>
          </div>
        ) : (
          <button
            id="modal-direct-install-btn"
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mb-3 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت التطبيق على جهازك</span>
          </button>
        )}

        {/* Telegram Channel Section */}
        <div className="p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-200 mb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <Send className="w-3.5 h-3.5 -rotate-45" />
              </div>
              <div>
                <p className="text-xs font-black text-sky-950">
                  قناة التلغرام التعليمية
                </p>
                <p className="text-[10px] text-sky-700 font-semibold">
                  {telegramChannelHandle}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-800 text-[9px] font-bold">
              ملفات يومية
            </span>
          </div>
          <p className="text-[11px] text-sky-900/80 leading-relaxed mb-2.5">
            انضم لقناتنا لتحميل أوراق العمل، خطط العلاج، والاختبارات الأسبوعية مجاناً.
          </p>
          <a
            id="modal-join-telegram-btn"
            href={telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 -rotate-45" />
            <span>الانضمام لقناة التلغرام الآن</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

        {/* Bottom Dismiss / Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
        >
          <span>إغلاق</span>
        </button>
      </div>
    </div>
  );
};
