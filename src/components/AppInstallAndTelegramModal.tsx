import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Sparkles,
  Layers
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
  onClose: externalOnClose
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
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-right p-6"
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
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
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

        {/* Short & Clean Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          ثبّت التطبيق على شاشة جهازك للوصول السريع وتصفح الدروس والأنشطة بدون إنترنت.
        </p>

        {/* Install State / iOS Guidance / Action Button */}
        {installSuccess ? (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-bold mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم تثبيت التطبيق بنجاح على جهازك!</span>
          </div>
        ) : isIos ? (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs font-medium space-y-1.5 mb-4">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Share className="w-4 h-4 text-amber-700" />
              <span>خطوات التثبيت على أجهزة آيفون / آيباد:</span>
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
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mb-3"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت التطبيق الآن</span>
          </button>
        )}

        {/* Bottom Dismiss / Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center"
        >
          <span>إغلاق</span>
        </button>
      </div>
    </div>
  );
};
