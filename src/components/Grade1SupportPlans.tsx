import React, { useState } from 'react';
import { 
  FolderOpen, 
  Sparkles, 
  Download, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Layers, 
  Award, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Search, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Share2,
  Volume2
} from 'lucide-react';
import { 
  GRADE1_SUPPORT_DRIVE_URL, 
  GRADE1_SUPPORT_CATEGORIES, 
  GRADE1_SUPPORT_FILES,
  GRADE1_SUPPORT_STRATEGIES,
  SupportFileItem
} from '../data/grade1SupportPlansData';
import { audioManager } from '../utils/audio';

interface Grade1SupportPlansProps {
  onBackToUnits?: () => void;
  onOpenWorksheet?: () => void;
}

export const Grade1SupportPlans: React.FC<Grade1SupportPlansProps> = ({
  onBackToUnits,
  onOpenWorksheet
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<SupportFileItem | null>(null);
  const [activeInteractiveSkill, setActiveInteractiveSkill] = useState<'short_long' | 'sakina' | 'sun_moon' | 'taa'>('short_long');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});

  const handleCopyLink = () => {
    navigator.clipboard.writeText(GRADE1_SUPPORT_DRIVE_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const filteredFiles = GRADE1_SUPPORT_FILES.filter((file) => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = 
      file.title.includes(searchQuery) || 
      file.description.includes(searchQuery) ||
      file.tags.some(tag => tag.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handlePlaySound = (text: string) => {
    audioManager.speakArabic(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBackToUnits && (
            <button
              id="back-to-units-btn"
              onClick={onBackToUnits}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للوحدات</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                الصف الأول الابتدائي
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ملفات الدعم والتعزيز والفاقد التعليمي
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria mt-0.5">
              خطط الدعم والملفات العلاجية المعتمدة
            </h1>
          </div>
        </div>

        {/* Action Buttons: Open Google Drive */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            id="open-drive-folder-header-btn"
            href={GRADE1_SUPPORT_DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <FolderOpen className="w-4 h-4 text-amber-300" />
            <span>فتح مجلد Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            id="copy-drive-link-btn"
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5"
            title="نسخ رابط مجلد Google Drive"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>

      {/* Hero Google Drive Integration Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 border border-emerald-500/30 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>مستودع السحابة الرقمي • Google Drive الرسمي</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-alexandria leading-tight text-white">
              مجلد خطط الدعم والملفات العلاجية - الصف الأول
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              تم تضمين وربط مستودع ملفات الدعم والتعزيز الشاملة لطلاب الصف الأول الابتدائي. يحتوي المجلد على كراسات علاج الضعف القرائي، مذكرات الحروف الهجائية، تدريبات المقطع الساكن، بطاقات الكلمات البصرية، وسجلات رصد المهارات والفاقد التعليمي الجاهزة للطباعة والاستخدام الفوري.
            </p>

            {/* Direct Google Drive URL Info Badge */}
            <div className="p-3 bg-slate-950/70 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono text-emerald-200">
              <div className="flex items-center gap-2 truncate">
                <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{GRADE1_SUPPORT_DRIVE_URL}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white font-sans text-[11px] font-bold shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'منسوخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 shrink-0">
            <a
              id="hero-drive-access-cta"
              href={GRADE1_SUPPORT_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm text-center shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-5 h-5 text-slate-950" />
              <span>تحميل وتصفح الملفات</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {onOpenWorksheet && (
              <button
                id="hero-open-worksheets-btn"
                onClick={onOpenWorksheet}
                className="w-full px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>أوراق العمل التفاعلية المطبوعة</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {GRADE1_SUPPORT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`support-cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في خطط الدعم..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Support Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-extrabold">
                  {file.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {file.fileSize || 'PDF'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-alexandria group-hover:text-rose-700 transition-colors leading-snug">
                  {file.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {file.description}
                </p>
              </div>

              {/* Key Objectives */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الأهداف والمهارات المعالجة:</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {file.keyObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {file.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
              {file.sampleExercise && (
                <button
                  id={`preview-exercise-${file.id}`}
                  onClick={() => setSelectedFileForPreview(file)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>معاينة نموذج</span>
                </button>
              )}

              <a
                id={`drive-download-${file.id}`}
                href={GRADE1_SUPPORT_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>تحميل من Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Remedial Skills Studio */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مختبر التدريب السريع لمعالجة المهارات الحساسة</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-alexandria">
              تطبيقات تفاعلية لعلاج مهارات الصف الأول الأساسية
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveInteractiveSkill('short_long')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeInteractiveSkill === 'short_long'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المدود والحركات
            </button>
            <button
              onClick={() => setActiveInteractiveSkill('sakina')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeInteractiveSkill === 'sakina'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المقطع الساكن
            </button>
            <button
              onClick={() => setActiveInteractiveSkill('sun_moon')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeInteractiveSkill === 'sun_moon'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              اللام الشمسية والقمرية
            </button>
            <button
              onClick={() => setActiveInteractiveSkill('taa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeInteractiveSkill === 'taa'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              التاء المربوطة والمفتوحة
            </button>
          </div>
        </div>

        {/* Skill 1: Short & Long Vowels */}
        {activeInteractiveSkill === 'short_long' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              استمع وقارن بين الصوت القصير والصوت الطويل، ثم اختر الإجابة الصحيحة:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                <span className="text-xs font-bold text-amber-800">مد الألف (ـَ + ا)</span>
                <div className="text-2xl font-black text-slate-900 font-amiri">
                  بَـ / بَا (بَاب)
                </div>
                <button
                  onClick={() => handlePlaySound('بَـ بَاب')}
                  className="px-3 py-1 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center space-y-2">
                <span className="text-xs font-bold text-rose-800">مد الواو (ـُ + و)</span>
                <div className="text-2xl font-black text-slate-900 font-amiri">
                  تُـ / تُو (تُوت)
                </div>
                <button
                  onClick={() => handlePlaySound('تُـ تُوت')}
                  className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-2">
                <span className="text-xs font-bold text-sky-800">مد الياء (ـِ + ي)</span>
                <div className="text-2xl font-black text-slate-900 font-amiri">
                  فِـ / فِيل (فِيل)
                </div>
                <button
                  onClick={() => handlePlaySound('فِـ فِيل')}
                  className="px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skill 2: Silent Syllable */}
        {activeInteractiveSkill === 'sakina' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              قاعدة ذهبية: الحرف الساكن لا يُنطق بمفرده أبداً، بل يُنطق مع الحرف المتحرك الذي قبله في دفعة صوتية واحدة (مقطع ساكن):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700">مَسْـ / ـجِد</span>
                <div className="text-xl font-bold text-emerald-800">مَسْجِدٌ</div>
                <button
                  onClick={() => handlePlaySound('مَسْـ جِدْ... مَسْجِد')}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تهجي المقطع الساكن</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700">مَدْ / رَ / سَـ / ـة</span>
                <div className="text-xl font-bold text-emerald-800">مَدْرَسَةٌ</div>
                <button
                  onClick={() => handlePlaySound('مَدْ... رَ... سَـ... تٌ... مَدْرَسَة')}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تهجي المقطع الساكن</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700">يَكْـ / ـتُـ / ـبُ</span>
                <div className="text-xl font-bold text-emerald-800">يَكْتُبُ</div>
                <button
                  onClick={() => handlePlaySound('يَكْـ تُـ بُ... يَكْتُبُ')}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تهجي المقطع الساكن</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skill 3: Sun & Moon Lam */}
        {activeInteractiveSkill === 'sun_moon' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              اللام الشمسية: تُكتب ولا تُنطق والحرف بعدها مشدد (الشَّمْس)، اللام القمرية: تُكتب وتُنطق وعليها سكون (الْقَمَر):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 text-sm">اللام الشمسية ☀️</span>
                  <span className="text-xs text-amber-700">تكتب ولا تنطق</span>
                </div>
                <p className="text-xs text-slate-700">أمثلة: الشَّمْس، التِّلْمِيذ، الصَّفّ، النُّور</p>
                <button
                  onClick={() => handlePlaySound('الشَّمْس... التِّلْمِيذ... الصَّفّ')}
                  className="px-3 py-1 rounded-xl bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع النطق الصحيح</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-900 text-sm">اللام القمرية 🌙</span>
                  <span className="text-xs text-sky-700">تكتب وتنطق</span>
                </div>
                <p className="text-xs text-slate-700">أمثلة: الْقَمَر، الْبَاب، الْمَدْرَسَة، الْعِلْم</p>
                <button
                  onClick={() => handlePlaySound('الْقَمَر... الْبَاب... الْمَدْرَسَة')}
                  className="px-3 py-1 rounded-xl bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع النطق الصحيح</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skill 4: Taa Marbouta vs Maftouha */}
        {activeInteractiveSkill === 'taa' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              طريقة التمييز السريعة بالوقف بالسكون: إذا نُطقت عند الوقف (هاء) فهي تاء مربوطة (مَدْرَسَهْ ⬅️ مَدْرَسَة)، وإذا نُطقت (تاء) فهي تاء مفتوحة (بَيْتْ ⬅️ بَيْت):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <span className="font-extrabold text-rose-900 text-sm">التاء المربوطة (ـة / ة)</span>
                <p className="text-xs text-slate-700">تُنطق تاء مع الحركات وتُنطق هاء عند الوقف بالسكون: (حَدِيقَة - نُورَة - طَيَّارَة)</p>
                <button
                  onClick={() => handlePlaySound('حَدِيقَةٌ... حَدِيقَهْ... نُورَةُ... نُورَهْ')}
                  className="px-3 py-1 rounded-xl bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تجربة الوقف بالسكون</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-extrabold text-emerald-900 text-sm">التاء المفتوحة (ـت / ت)</span>
                <p className="text-xs text-slate-700">تُنطق تاء في الوصل وعند الوقف بالسكون: (بَيْت - بِنْت - قَرَأْتُ)</p>
                <button
                  onClick={() => handlePlaySound('بَيْتٌ... بَيْتْ... بِنْتٌ... بِنْتْ')}
                  className="px-3 py-1 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تجربة الوقف بالسكون</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strategies & Guidance for Teachers & Parents */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black font-alexandria text-white">
              إرشادات واستراتيجيات الدعم للمعلم وولي الأمر
            </h3>
            <p className="text-xs text-slate-400">
              خطوات علمية مجربة لمعالجة الفاقد التعليمي وضمان تمكن طالب الصف الأول من القراءة والكتابة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GRADE1_SUPPORT_STRATEGIES.map((strat, sIdx) => (
            <div
              key={sIdx}
              className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-2"
            >
              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{strat.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {strat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Exercise Preview Modal */}
      {selectedFileForPreview && selectedFileForPreview.sampleExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  نموذج ورقة تدريبية
                </span>
                <h3 className="text-lg font-black text-slate-900 font-alexandria mt-1">
                  {selectedFileForPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800 mb-2">
                  {selectedFileForPreview.sampleExercise.prompt}
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  {selectedFileForPreview.sampleExercise.items.map((item, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {selectedFileForPreview.sampleExercise.answerKey && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  <span className="font-bold">مفتاح الإجابة الإرشادي: </span>
                  <span>{selectedFileForPreview.sampleExercise.answerKey}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة النموذج</span>
              </button>

              <a
                href={GRADE1_SUPPORT_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
              >
                <span>فتح المجلد الكامل على Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
