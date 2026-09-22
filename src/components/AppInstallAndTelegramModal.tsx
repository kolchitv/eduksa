import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  ExternalLink,
  Laptop,
  Layers,
  HeartHandshake
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
  telegramChannelHandle = 'arabiaeasy',
  autoOpenDelayMs = 800
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'telegram'>('install');
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  // Detect Device
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    if (isIos) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
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

    // Auto-open logic if not controlled externally
    if (externalIsOpen === undefined) {
      const hasDismissed = sessionStorage.getItem('lughati_install_telegram_modal_dismissed');
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, autoOpenDelayMs);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [externalIsOpen, autoOpenDelayMs]);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
      sessionStorage.setItem('lughati_install_telegram_modal_dismissed', 'true');
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallSuccess(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.log('Install prompt error:', err);
      }
    } else {
      // Show guided steps depending on user's operating system
      if (deviceType === 'ios') {
        setShowIosGuide(true);
        setShowAndroidGuide(false);
        setShowDesktopGuide(false);
      } else if (deviceType === 'android') {
        setShowAndroidGuide(true);
        setShowIosGuide(false);
        setShowDesktopGuide(false);
      } else {
        setShowDesktopGuide(true);
        setShowIosGuide(false);
        setShowAndroidGuide(false);
      }
    }
  };

  const handleOpenTelegram = () => {
    window.open(telegramChannelUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 text-center overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button (✕) */}
        <button
          id="close-install-modal-btn"
          onClick={handleClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation Tabs (Install App / Telegram Channel) */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl mb-5 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-500" />
            <span>تثبيت التطبيق</span>
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>قناة تلغرام</span>
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          </button>
        </div>

        {/* TAB 1: INSTALL APP (Matches exact visual prompt in user screenshot) */}
        {activeTab === 'install' && (
          <div className="space-y-4">
            {/* Top Device App Icon with Magenta/Purple Gradient Squircle */}
            <div className="relative mx-auto w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-xl shadow-fuchsia-500/25 flex items-center justify-center transition-transform hover:scale-105">
              <Smartphone className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5 px-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria tracking-tight">
                ثبّت <span className="text-purple-600">منصة لغتي</span> على شاشتك الرئيسية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed font-tajawal">
                وصول أسرع لدروس لغتي، أوراق العمل، والاختبارات بضغطة واحدة، من غير متصفح ومن غير تحميل من أي متجر.
              </p>
            </div>

            {/* Success message if installed */}
            {installSuccess && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تثبيت التطبيق بنجاح على جهازك!</span>
              </div>
            )}

            {/* Interactive Step Guide for iOS / Android / Desktop */}
            {showIosGuide && (
              <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200 text-right space-y-2 text-xs text-slate-800 animate-in fade-in">
                <p className="font-black text-purple-900 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-purple-700" />
                  <span>خطوات التثبيت على آيفون / آيباد (Safari):</span>
                </p>
                <ol className="space-y-1.5 text-[11px] text-slate-700 pr-2">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center shrink-0 text-[10px]">١</span>
                    <span>اضغط على زر المشاركة <span className="font-bold text-purple-800">[ 📤 Share ]</span> أسفل الشاشة.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center shrink-0 text-[10px]">٢</span>
                    <span>مرر لأسفل واختر <span className="font-bold text-purple-800">"إضافة إلى الصفحة الرئيسية" ➕</span>.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center shrink-0 text-[10px]">٣</span>
                    <span>اضغط <span className="font-bold text-purple-800">"إضافة" (Add)</span> في الزاوية العلوية.</span>
                  </li>
                </ol>
              </div>
            )}

            {showAndroidGuide && (
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-right space-y-2 text-xs text-slate-800 animate-in fade-in">
                <p className="font-black text-emerald-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>خطوات التثبيت على أندرويد (Chrome):</span>
                </p>
                <ol className="space-y-1.5 text-[11px] text-slate-700 pr-2">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">١</span>
                    <span>اضغط على قائمة النقاط الثلاث <span className="font-bold text-emerald-800">[ ⋮ ]</span> أعلى المتصفح.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">٢</span>
                    <span>اختر <span className="font-bold text-emerald-800">"تثبيت التطبيق" أو "إضافة للشاشة الرئيسية" 📥</span>.</span>
                  </li>
                </ol>
              </div>
            )}

            {showDesktopGuide && (
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-right space-y-2 text-xs text-slate-800 animate-in fade-in">
                <p className="font-black text-blue-900 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-blue-700" />
                  <span>خطوات التثبيت على الكمبيوتر (Chrome / Edge):</span>
                </p>
                <p className="text-[11px] text-slate-700">
                  اضغط على أيقونة التثبيت <span className="font-bold text-blue-800">[ 💻 Install ]</span> في شريط العنوان أعلى المتصفح، أو من قائمة المتصفح اختر <b>"تثبيت تطبيق لغتي"</b>.
                </p>
              </div>
            )}

            {/* Primary Action Button (Matches Screenshot's Vibrant Gradient Pill) */}
            <div className="pt-2">
              <button
                id="main-install-app-btn"
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-700 hover:via-fuchsia-600 hover:to-pink-600 text-white font-black text-sm sm:text-base shadow-xl shadow-fuchsia-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>ثبّت الآن</span>
              </button>
            </div>

            {/* Quick Telegram shortcut below install */}
            <div className="pt-1">
              <button
                onClick={() => setActiveTab('telegram')}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-sky-200/60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>أو انضم لقناة تلغرام (@{telegramChannelHandle})</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TELEGRAM CHANNEL (arabiaeasy) */}
        {activeTab === 'telegram' && (
          <div className="space-y-4">
            {/* Telegram Icon Badge */}
            <div className="relative mx-auto w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/25 flex items-center justify-center transition-transform hover:scale-105">
              <svg className="w-10 h-10 text-white fill-current translate-x-[-1px] translate-y-[1px]" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-white"></span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1 px-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold mb-0.5">
                <span>@{telegramChannelHandle}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria tracking-tight">
                قناة <span className="text-sky-600">العربية بسهولة</span> على تلغرام
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium font-tajawal">
                مجتمع تعليمي تفاعلي لمقرر لغتي الجميلة، أوراق العمل الأسبوعية، وشروحات التأسيس المبسطة.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2 text-right">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>أوراق عمل ونماذج خط واختبارات دورية مجانية</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>خطط دعم وفاقد تعليمي ومذكرات الصف الأول</span>
              </div>
            </div>

            {/* Primary Telegram Join Button */}
            <div className="pt-2">
              <button
                id="join-telegram-arabiaeasy-btn"
                onClick={handleOpenTelegram}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm sm:text-base shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>انضم الآن إلى القناة</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>
        )}

        {/* Dismiss Text Link: "ربما لاحقاً" (Matches Screenshot) */}
        <div className="pt-4">
          <button
            id="dismiss-install-modal-btn"
            onClick={handleClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ربما لاحقًا
          </button>
        </div>
      </div>
    </div>
  );
};
