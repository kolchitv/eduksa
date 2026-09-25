import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Settings, 
  X, 
  HelpCircle,
  Radio,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { audioManager, TtsEngineMode } from '../utils/audio';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(audioManager.getIsMuted());
  const [engineMode, setEngineMode] = useState<TtsEngineMode>(audioManager.getTtsMode());
  const [hasLocalArabic, setHasLocalArabic] = useState<boolean>(false);
  const [testWord, setTestWord] = useState<string>('أَبِي');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsMuted(audioManager.getIsMuted());
      setEngineMode(audioManager.getTtsMode());
      setHasLocalArabic(audioManager.hasNativeArabicVoice());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleEngineChange = (mode: TtsEngineMode) => {
    setEngineMode(mode);
    audioManager.setTtsMode(mode);
  };

  const handlePlayTestWord = async (word: string) => {
    setTestWord(word);
    setIsTesting(true);
    setTestSuccess(false);
    try {
      await audioManager.speakArabic(word);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 2000);
    } catch (e) {
      console.error('Test audio error:', e);
    } finally {
      setIsTesting(false);
    }
  };

  const sampleWords = [
    { word: 'أَبِي', label: 'أَبِي (أسرتي)' },
    { word: 'أُمِّي', label: 'أُمِّي' },
    { word: 'مَـسْجِدٌ', label: 'مَـسْجِدٌ (حرف الميم)' },
    { word: 'مَ • مُ • مِ', label: 'مَ - مُ - مِ (حركات قصيرة)' },
    { word: 'مَا • مُو • مِي', label: 'مَا - مُو - مِي (أصوات طويلة)' },
    { word: 'مَدْرَسَتِي حَدِيقَتِي', label: 'جملة كاملة' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <Volume2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black font-alexandria flex items-center gap-2">
                <span>إعدادات واختبار النطق الصوتي</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold">
                  نشط ومُحدّث
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                حل مشكلة الصوت وتشغيل نطق الكلمات والحروف بدقة تامة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-right" dir="rtl">
          {/* Explanation Alert: Why audio didn't work before */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              💡
            </div>
            <div className="text-xs text-amber-950 space-y-1">
              <p className="font-black text-amber-900 text-sm">
                لماذا لم يكن الصوت يعمل على الكلمات سابقاً؟
              </p>
              <p className="leading-relaxed text-amber-900/90 font-medium">
                معظم الأجهزة (خاصة أنظمة Windows، Linux وبعض هواتف Android) لا يتوفر فيها محرك نطق عربي مثبت مسبقاً في المتصفح. 
                <strong> تم حل هذا جذرياً الآن</strong> بتوفير <span className="underline decoration-emerald-500 font-bold">المحرك السحابي الفصيح فائق الوضوح</span> الذي يعمل على جميع الأجهزة دون أي متطلبات أو تحميل حزم صوتية!
              </p>
            </div>
          </div>

          {/* Quick Sound Test Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                اضغط لتجربة نطق الكلمات فوراً:
              </span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>جرّب النطق الآن</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleWords.map((item) => (
                <button
                  key={item.word}
                  onClick={() => handlePlayTestWord(item.word)}
                  disabled={isTesting}
                  className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1 active:scale-95 ${
                    testWord === item.word && isTesting
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                      : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black font-amiri tracking-wide">
                      {item.word}
                    </span>
                    <Play className={`w-3.5 h-3.5 ${testWord === item.word && isTesting ? 'text-white fill-white' : 'text-emerald-600'}`} />
                  </div>
                  <span className={`text-[10px] font-bold ${testWord === item.word && isTesting ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {testSuccess && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم النطق بنجاح! الصوت يعمل بأعلى جودة.</span>
              </div>
            )}
          </div>

          {/* Engine Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>محرك النطق الصوتي المفضل:</span>
            </h4>

            <div className="space-y-2">
              <label 
                onClick={() => handleEngineChange('auto')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  engineMode === 'auto'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="tts-engine" 
                  checked={engineMode === 'auto'} 
                  onChange={() => handleEngineChange('auto')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      المحرك الذكي السحابي (موصى به لجميع الأجهزة)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                      المثالي
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    ينطق الكلمات بالحركات التامة (الفتحة، الضمة، الكسرة، التنوين، الشدة) بصوت بشري واضح جداً، ويعمل على كافة المتصفحات والهواتف.
                  </p>
                </div>
              </label>

              <label 
                onClick={() => handleEngineChange('local')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  engineMode === 'local'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="tts-engine" 
                  checked={engineMode === 'local'} 
                  onChange={() => handleEngineChange('local')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      محرك المتصفح المحلي (Web Speech API)
                    </span>
                    {hasLocalArabic ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 font-extrabold">
                        متوفر على جهازك
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        غير متوفر صوت عربي بجهازك
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    يستخدم أصوات النظام في حاسوبك/هاتفك (إذا كانت حزمة الصوت العربي مثبتة لديك).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Mute / Unmute State */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-black transition-all ${
                  isMuted 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                <span>{isMuted ? 'الصوت مكتوم (اضغط لتفعيله)' : 'الصوت مفعل حالياً'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                audioManager.play('fanfare');
              }}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 underline"
            >
              تجربة المؤثرات الصوتية 🔔
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs transition-all"
          >
            تم ومتابعة القراءة
          </button>
        </div>
      </div>
    </div>
  );
};
