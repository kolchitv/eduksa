import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share, 
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  Bell
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
  telegramChannelHandle = '@arabiaeasy',
  autoOpenDelayMs = 2500
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // Detect iOS Device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));
    }
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

  // Auto-open modal once after delay if not dismissed
  useEffect(() => {
    if (externalIsOpen !== undefined) return; // controlled by parent

    try {
      const alreadyDismissed = sessionStorage.getItem('lughati_install_popup_dismissed');
      if (!alreadyDismissed) {
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, autoOpenDelayMs);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [externalIsOpen, autoOpenDelayMs]);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      sessionStorage.setItem('lughati_install_popup_dismissed', 'true');
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
          }, 1800);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install error', err);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert('لتثبيت التطبيق على جهازك:\n- من متصفح Chrome أو Edge: انقر على قائمة الخيارات (⋮) ثم اختر "تثبيت التطبيق" أو "Install App".\n- من الآيفون: انقر زر المشاركة ثم "إضافة إلى الشاشة الرئيسية".');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
      role="presentation"
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden animate-in zoom-in-95 duration-200 text-right p-5 sm:p-7"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Background Banner Decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500"></div>

        {/* Close Button (X) - Prominent and easy to tap */}
        <button
          id="close-install-modal-btn"
          onClick={handleClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10 shadow-xs"
          title="إغلاق النافذة"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Branding & Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            🇸🇦
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                تطبيق الويب الرسمي PWA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                مجاني بالكامل
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-alexandria">
              تثبيت تطبيق لُغَتِي التعليمي
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          ثبّت التطبيق على شاشة هاتفك أو حاسوبك لتصفح الدروس، حل التمارين، وتحميل خطط الدعم وأوراق العمل بسرعة وسهولة دون الحاجة لفتح المتصفح كل مرة!
        </p>

        {/* Features Bullets */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600">⚡</span>
            <span>تصفح سريع وخفيف</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600">📱</span>
            <span>أيقونة على الشاشة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600">📶</span>
            <span>يعمل بدون إنترنت</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600">🔒</span>
            <span>آمن ومجاني 100%</span>
          </div>
        </div>

        {/* Direct Install Button or iOS Guide */}
        {installSuccess ? (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-bold mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم تثبيت التطبيق بنجاح على جهازك!</span>
          </div>
        ) : isIos ? (
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 text-xs font-medium space-y-1.5 mb-4">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Share className="w-4 h-4 text-amber-700" />
              <span>طريقة التثبيت على آيفون / آيباد (Safari):</span>
            </p>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              ١. اضغط على أيقونة المشاركة <span className="font-bold bg-amber-200 px-1 py-0.2 rounded">⎋</span> أسفل متصفح Safari.<br />
              ٢. اختر <span className="font-bold bg-amber-200 px-1 py-0.2 rounded">«إضافة إلى الشاشة الرئيسية ➕»</span>.
            </p>
          </div>
        ) : (
          <button
            id="modal-direct-install-btn"
            onClick={handleInstallClick}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mb-4 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت التطبيق على جهازك الآن 📥</span>
          </button>
        )}

        {/* Telegram Channel Section - Beautiful Box Matching the Model */}
        <div className="p-4 bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 rounded-2xl border-2 border-sky-200 mb-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Send className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <p className="text-xs font-black text-sky-950">
                  قناة التلغرام الرسمية للمنهاج
                </p>
                <p className="text-[10px] text-sky-700 font-bold font-mono">
                  {telegramChannelHandle}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 text-[10px] font-bold">
              تحديثات يومية
            </span>
          </div>

          <p className="text-[11px] text-sky-900/85 leading-relaxed mb-3">
            انضم لقناتنا على تلغرام للحصول على المذكرات، أوراق العمل التفاعلية، ونماذج الاختبارات الأسبوعية مجاناً.
          </p>

          <a
            id="modal-join-telegram-btn"
            href={telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            <Send className="w-3.5 h-3.5 -rotate-45 group-hover:scale-110 transition-transform" />
            <span>الانضمام لقناة التلغرام الآن ✈️</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

        {/* Bottom Dismiss / Close Button */}
        <button
          id="modal-dismiss-btn"
          onClick={handleClose}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
        >
          <span>إغلاق / لاحقاً</span>
        </button>
      </div>
    </div>
  );
};
