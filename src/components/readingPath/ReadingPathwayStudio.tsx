import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  Clock, 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  Play, 
  Layers, 
  BrainCircuit, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw,
  Star,
  Zap,
  Tag,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { 
  ReadingTextItem, 
  ReadingLevel, 
  ReadingContentType,
  ComprehensionQuestion,
  VocabularyItem,
  StudentReadingRecord 
} from '../../types/readingPath';
import { 
  INITIAL_READING_TEXTS, 
  READING_LEVEL_INFO 
} from '../../data/readingPathData';
import { ReadingTextModal } from './ReadingTextModal';
import { ReadingStudioPractice } from './ReadingStudioPractice';
import { ReadingProgressStats } from './ReadingProgressStats';
import { audioManager } from '../../utils/audio';

interface ReadingPathwayStudioProps {
  studentName: string;
  onAddStars: (count: number) => void;
  onBackToHome?: () => void;
  initialTrack?: 'all' | 'struggling' | 'short_text' | 'advanced';
}

export const ReadingPathwayStudio: React.FC<ReadingPathwayStudioProps> = ({
  studentName,
  onAddStars,
  onBackToHome,
  initialTrack = 'all'
}) => {
  // Main view modes: 'library' | 'studio' | 'stats'
  const [viewMode, setViewMode] = useState<'library' | 'studio' | 'stats'>('library');

  // Selected Track Filter: 'all' | 'struggling' (L1-2 sentences) | 'short_text' (L3-4 short) | 'advanced' (L5-6 long)
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<'all' | 'struggling' | 'short_text' | 'advanced'>(initialTrack);

  useEffect(() => {
    if (initialTrack) {
      setSelectedTrackFilter(initialTrack);
      if (initialTrack === 'struggling') setSelectedLevelFilter(0);
      else if (initialTrack === 'short_text') setSelectedLevelFilter(0);
      else if (initialTrack === 'advanced') setSelectedLevelFilter(0);
    }
  }, [initialTrack]);

  // Selected Level filter (0 = all)
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Ingest Box State
  const [showQuickIngestBox, setShowQuickIngestBox] = useState<boolean>(false);
  const [quickInputContent, setQuickInputContent] = useState<string>('');
  const [quickInputTitle, setQuickInputTitle] = useState<string>('');
  const [quickTargetCategory, setQuickTargetCategory] = useState<'struggling' | 'short_text' | 'advanced'>('struggling');
  const [quickAddSuccess, setQuickAddSuccess] = useState<string | null>(null);

  // Texts list with localStorage persistence
  const [texts, setTexts] = useState<ReadingTextItem[]>(() => {
    try {
      const saved = localStorage.getItem('lughati_custom_reading_texts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_READING_TEXTS;
  });

  // Student reading records persistence
  const [records, setRecords] = useState<Record<string, StudentReadingRecord>>(() => {
    try {
      const saved = localStorage.getItem('lughati_student_reading_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {};
  });

  // Current active text being practiced in Studio
  const [activeTextForPractice, setActiveTextForPractice] = useState<ReadingTextItem | null>(null);

  // Modal State for Add / Edit text
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textToEdit, setTextToEdit] = useState<ReadingTextItem | null>(null);

  // Save texts to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('lughati_custom_reading_texts', JSON.stringify(texts));
    } catch (e) {}
  }, [texts]);

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lughati_student_reading_records', JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  // Add / Edit text handler
  const handleSaveText = (savedItem: ReadingTextItem) => {
    const existingIndex = texts.findIndex(t => t.id === savedItem.id);
    if (existingIndex >= 0) {
      const updated = [...texts];
      updated[existingIndex] = savedItem;
      setTexts(updated);
    } else {
      setTexts([savedItem, ...texts]);
    }
  };

  // Delete text
  const handleDeleteText = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا النص من المسار؟')) {
      setTexts(texts.filter(t => t.id !== id));
    }
  };

  // Reset to initial curriculum texts
  const handleResetToDefault = () => {
    if (confirm('هل تريد استعادة بنك النصوص الافتراضي للمنهاج السعودي؟')) {
      setTexts(INITIAL_READING_TEXTS);
      try {
        localStorage.removeItem('lughati_custom_reading_texts');
      } catch (e) {}
    }
  };

  // Export texts to JSON file
  const handleExportTexts = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(texts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lughati_reading_texts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import texts from JSON file
  const handleImportTexts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTexts(parsed);
            alert(`تم استيراد ${parsed.length} نصاً بنجاح!`);
          }
        } catch (err) {
          alert('ملف JSON غير صالح');
        }
      };
    }
  };

  // Session completion handler from Studio
  const handleCompleteSession = (record: StudentReadingRecord) => {
    setRecords((prev) => ({
      ...prev,
      [record.textId]: record
    }));
  };

  // Quick Text Ingest Handler (Direct One-Click addition from Teacher)
  const handleQuickAddText = () => {
    if (!quickInputContent.trim()) {
      alert('يرجى كتابة أو لصق النص أولاً');
      return;
    }

    const trimmed = quickInputContent.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Determine target level & content type
    let assignedLevel: ReadingLevel = 1;
    let assignedType: ReadingContentType = 'sentence';
    let expectedTimeSec = 15;

    if (quickTargetCategory === 'struggling') {
      assignedLevel = wordCount > 7 ? 2 : 1;
      assignedType = 'sentence';
      expectedTimeSec = Math.max(12, wordCount * 2);
    } else if (quickTargetCategory === 'short_text') {
      assignedLevel = wordCount > 25 ? 4 : 3;
      assignedType = wordCount > 25 ? 'short_text' : 'sentences_group';
      expectedTimeSec = Math.max(25, Math.round(wordCount * 1.5));
    } else {
      assignedLevel = wordCount > 70 ? 6 : 5;
      assignedType = wordCount > 70 ? 'long_text' : 'medium_text';
      expectedTimeSec = Math.max(60, Math.round(wordCount * 1.2));
    }

    // Auto title
    const autoTitle = quickInputTitle.trim() || 
      (words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : ''));

    // Detect skills
    const detectedSkills: string[] = [];
    if (trimmed.includes('ا') || trimmed.includes('ـا') || trimmed.includes('ى')) detectedSkills.push('المد بالألف');
    if (trimmed.includes('و') || trimmed.includes('ـو')) detectedSkills.push('المد بالواو');
    if (trimmed.includes('ي') || trimmed.includes('ـي') || trimmed.includes('ـيـ')) detectedSkills.push('المد بالياء');
    if (trimmed.includes('ّ')) detectedSkills.push('الحرف المشدد');
    if (trimmed.includes('ً') || trimmed.includes('ٍ') || trimmed.includes('ٌ')) detectedSkills.push('التنوين');
    if (trimmed.includes('الْ') || trimmed.includes('ال')) detectedSkills.push('اللام القمرية والشمسية');
    if (trimmed.includes('ة') || trimmed.includes('ـة')) detectedSkills.push('التاء المربوطة');
    if (trimmed.includes('ْ')) detectedSkills.push('المقطع الساكن');
    if (detectedSkills.length === 0) detectedSkills.push('القراءة والطلاقة', 'الفهم والاستيعاب');

    // Extract potential vocabulary (words > 4 chars)
    const longWords: string[] = Array.from(new Set<string>(words.filter(w => w.replace(/[ًٌٍَُِّْـ]/g, '').length >= 4))).slice(0, 3);
    const newVocab: VocabularyItem[] = longWords.map(w => ({
      word: w,
      meaning: 'كلمة هامة في سياق النص وفهم المعنى'
    }));

    // Auto Questions
    const autoQuestions: ComprehensionQuestion[] = [
      {
        id: `q_quick_${Date.now()}_1`,
        type: 'multiple_choice',
        question: `عَمَّ يَتَحَدَّثُ النَّصُّ الرَّئِيسُ؟`,
        options: [autoTitle, 'مَوْضُوعٌ آخَرُ مُخْتَلِفٌ', 'قِصَّةٌ أُخْرَى', 'لَا شَيْءَ مِمَّا سَبَقَ'],
        correctAnswer: 0,
        explanation: `يتحدث النص عن: ${autoTitle}`
      }
    ];

    if (words.length >= 8) {
      autoQuestions.push({
        id: `q_quick_${Date.now()}_2`,
        type: 'find_word',
        question: `ابْحَثْ فِي النَّصِّ عَنْ كَلِمَةِ: (${words[1] || words[0]})`,
        targetWord: words[1] || words[0],
        options: [words[1] || words[0], words[Math.min(3, words.length - 1)] || 'الْمَدْرَسَة', 'الْكِتَاب', 'الْعَمَل'],
        correctAnswer: words[1] || words[0],
        explanation: 'وردت هذه الكلمة في النص القرائي.'
      });
    }

    const newItem: ReadingTextItem = {
      id: `text_custom_${Date.now()}`,
      title: autoTitle,
      level: assignedLevel,
      contentType: assignedType,
      content: trimmed,
      paragraphs: assignedType === 'long_text' ? trimmed.split('\n\n').filter(Boolean) : undefined,
      wordCount,
      targetSkills: detectedSkills.slice(0, 4),
      newVocabulary: newVocab,
      questions: autoQuestions,
      expectedDurationSec: expectedTimeSec,
      orderIndex: texts.length + 1,
      isCustom: true
    };

    setTexts([newItem, ...texts]);
    setQuickInputContent('');
    setQuickInputTitle('');
    setQuickAddSuccess(`تمت إضافة "${autoTitle}" بنجاح إلى مسار ${
      assignedLevel <= 2 ? 'المتعثرين (جمل)' : assignedLevel <= 4 ? 'النصوص القصيرة' : 'المتميزين (نصوص طويلة)'
    }! ✨`);

    audioManager.play('fanfare');

    setTimeout(() => {
      setQuickAddSuccess(null);
    }, 4000);
  };

  // Reset all student progress
  const handleResetProgress = () => {
    if (confirm('هل تريد إعادة ضبط سجل قراءات الطالب والبدء من جديد؟')) {
      setRecords({});
      try {
        localStorage.removeItem('lughati_student_reading_records');
      } catch (e) {}
    }
  };

  // Filter texts by Track & Level & Search
  const filteredTexts = texts.filter((item) => {
    // Track Match
    let matchesTrack = true;
    if (selectedTrackFilter === 'struggling') {
      matchesTrack = item.level === 1 || item.level === 2;
    } else if (selectedTrackFilter === 'short_text') {
      matchesTrack = item.level === 3 || item.level === 4;
    } else if (selectedTrackFilter === 'advanced') {
      matchesTrack = item.level === 5 || item.level === 6;
    }

    const matchesLevel = selectedLevelFilter === 0 || item.level === selectedLevelFilter;
    const matchesSearch = 
      item.title.includes(searchQuery) ||
      item.content.includes(searchQuery) ||
      item.targetSkills?.some(s => s.includes(searchQuery)) ||
      item.newVocabulary?.some(v => v.word.includes(searchQuery));

    return matchesTrack && matchesLevel && matchesSearch;
  });

  // Calculate global summary stats
  const completedCount = (Object.values(records) as StudentReadingRecord[]).filter(r => r?.completed).length;

  const strugglingCount = texts.filter(t => t.level <= 2).length;
  const shortTextCount = texts.filter(t => t.level === 3 || t.level === 4).length;
  const advancedCount = texts.filter(t => t.level >= 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* If Studio Mode is active */}
      {viewMode === 'studio' && activeTextForPractice ? (
        <ReadingStudioPractice
          text={activeTextForPractice}
          onBackToLibrary={() => {
            setViewMode('library');
            setActiveTextForPractice(null);
          }}
          onCompleteSession={handleCompleteSession}
          onAddStars={onAddStars}
          studentName={studentName}
        />
      ) : viewMode === 'stats' ? (
        /* If Stats Mode is active */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('library')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              ← العودة لمكتبة النصوص
            </button>
            <h2 className="text-xl font-black font-alexandria text-slate-900">
              📊 تقرير وإحصائيات مسار القراءة
            </h2>
          </div>

          <ReadingProgressStats
            records={records}
            allTexts={texts}
            studentName={studentName}
            onResetProgress={handleResetProgress}
            onSelectTextToRead={(text) => {
              setActiveTextForPractice(text);
              setViewMode('studio');
            }}
          />
        </div>
      ) : (
        /* Library Mode */
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 text-slate-950 flex items-center justify-center font-black text-3xl shadow-xl shrink-0">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      المنهاج السعودي التفاعلي
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {texts.length} نصاً قرائياً متدرجاً
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-alexandria text-white">
                    الانطلاق في القراءة — مسار القراءة المتدرّج
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
                    مسار متكامل لنقل المتعلم من الجمل البسيطة إلى النصوص الطويلة بطلاقة وفهم، مع القياس الزمني الدقيق وأسئلة الاستيعاب والمساعد الذكي.
                  </p>
                </div>
              </div>

              {/* Action Buttons Top */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <button
                  onClick={() => setShowQuickIngestBox(!showQuickIngestBox)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  <span>📥 إضافة نص ترسله فوراً</span>
                </button>

                <button
                  id="open-stats-dashboard-btn"
                  onClick={() => setViewMode('stats')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span>متابعة التقدم ({completedCount})</span>
                </button>

                <button
                  id="add-new-reading-text-btn"
                  onClick={() => {
                    setTextToEdit(null);
                    setIsTextModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ محرر متقدم</span>
                </button>
              </div>
            </div>

            {/* Three Dedicated Tracks Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-emerald-800/60">
              {/* Struggling Track Card */}
              <button
                onClick={() => {
                  setSelectedTrackFilter(selectedTrackFilter === 'struggling' ? 'all' : 'struggling');
                  setSelectedLevelFilter(0);
                }}
                className={`p-3.5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden border ${
                  selectedTrackFilter === 'struggling'
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-white shadow-xl scale-[1.02]'
                    : 'bg-emerald-950/60 hover:bg-emerald-800/50 text-emerald-100 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <span className={`text-xs font-black ${selectedTrackFilter === 'struggling' ? 'text-slate-950' : 'text-emerald-300'}`}>
                      مسار المتعثرين (قراءة الجمل)
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selectedTrackFilter === 'struggling' ? 'bg-slate-950 text-white' : 'bg-emerald-500/30 text-emerald-200'
                  }`}>
                    {strugglingCount} نصوص
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                  selectedTrackFilter === 'struggling' ? 'text-slate-900 font-bold' : 'text-emerald-200/80'
                }`}>
                  جمل قصيرة ومتوسطة (المستوى 1 و 2) لكسر حاجز التهجئة البطيئة وتنمية القراءة المسترسلة.
                </p>
              </button>

              {/* Short Texts Track Card */}
              <button
                onClick={() => {
                  setSelectedTrackFilter(selectedTrackFilter === 'short_text' ? 'all' : 'short_text');
                  setSelectedLevelFilter(0);
                }}
                className={`p-3.5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden border ${
                  selectedTrackFilter === 'short_text'
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-white shadow-xl scale-[1.02]'
                    : 'bg-cyan-950/60 hover:bg-cyan-800/50 text-cyan-100 border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <span className={`text-xs font-black ${selectedTrackFilter === 'short_text' ? 'text-slate-950' : 'text-cyan-300'}`}>
                      مسار النصوص القصيرة (التطويري)
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selectedTrackFilter === 'short_text' ? 'bg-slate-950 text-white' : 'bg-cyan-500/30 text-cyan-200'
                  }`}>
                    {shortTextCount} نصوص
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                  selectedTrackFilter === 'short_text' ? 'text-slate-900 font-bold' : 'text-cyan-200/80'
                }`}>
                  نصوص من 2 إلى 4 جمل ونصوص 40-80 كلمة (المستوى 3 و 4) مع مؤقت القراءة وأسئلة الاستيعاب.
                </p>
              </button>

              {/* Advanced Long Texts Track Card */}
              <button
                onClick={() => {
                  setSelectedTrackFilter(selectedTrackFilter === 'advanced' ? 'all' : 'advanced');
                  setSelectedLevelFilter(0);
                }}
                className={`p-3.5 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden border ${
                  selectedTrackFilter === 'advanced'
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white shadow-xl scale-[1.02]'
                    : 'bg-amber-950/60 hover:bg-amber-800/50 text-amber-100 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className={`text-xs font-black ${selectedTrackFilter === 'advanced' ? 'text-slate-950' : 'text-amber-300'}`}>
                      مسار المتميزين (النصوص الطويلة)
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selectedTrackFilter === 'advanced' ? 'bg-slate-950 text-white' : 'bg-amber-500/30 text-amber-200'
                  }`}>
                    {advancedCount} نصوص
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                  selectedTrackFilter === 'advanced' ? 'text-slate-900 font-bold' : 'text-amber-200/80'
                }`}>
                  نصوص طويلة مقسمة لفقرات (المستوى 5 و 6) مع الفهم العميق والتحليل ومعدل الطلاقة وسرعة WPM.
                </p>
              </button>
            </div>

            {/* Quick Level Navigator Mini Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-emerald-800/40">
              {[1, 2, 3, 4, 5, 6].map((lvl) => {
                const info = READING_LEVEL_INFO[lvl];
                const count = texts.filter(t => t.level === lvl).length;
                const completedInLvl = texts.filter(t => t.level === lvl && records[t.id]?.completed).length;

                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevelFilter(selectedLevelFilter === lvl ? 0 : lvl);
                      setSelectedTrackFilter('all');
                    }}
                    className={`p-2.5 rounded-2xl text-right transition-all cursor-pointer ${
                      selectedLevelFilter === lvl 
                        ? 'bg-white text-slate-950 shadow-md ring-2 ring-amber-400' 
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{info.icon}</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                        selectedLevelFilter === lvl ? 'bg-slate-200 text-slate-900' : 'bg-white/10 text-emerald-200'
                      }`}>
                        {completedInLvl}/{count}
                      </span>
                    </div>
                    <p className="text-xs font-black truncate">
                      المستوى {lvl}
                    </p>
                    <p className={`text-[10px] truncate ${selectedLevelFilter === lvl ? 'text-slate-600' : 'text-slate-300'}`}>
                      {info.title.split('—')[1] || ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Quick Text Feeder Box (Always ready for new texts from teacher) */}
          {showQuickIngestBox && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    📥
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-alexandria">
                      إضافة سريعة لأي نص جديد ترسله للمنصة
                    </h3>
                    <p className="text-xs text-amber-900 font-medium">
                      اكتب أو الصق النص هنا وسيتم تحليله وإدراجه في المسار وتوليد أسئلته فوراً.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowQuickIngestBox(false)}
                  className="w-8 h-8 rounded-full bg-amber-200/70 hover:bg-amber-300 text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {quickAddSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{quickAddSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-3">
                  <input
                    type="text"
                    value={quickInputTitle}
                    onChange={(e) => setQuickInputTitle(e.target.value)}
                    placeholder="عنوان النص (اختياري، مثلاً: قصة العصفور الصغير)"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 outline-hidden"
                  />

                  <textarea
                    rows={4}
                    value={quickInputContent}
                    onChange={(e) => setQuickInputContent(e.target.value)}
                    placeholder="الصق أو اكتب النص هنا مع الحركات إن وجدت... (مثال: ذَهَبَ عَلِيٌّ إِلَى الْمَدْرَسَةِ فَرِحًا...)"
                    className="w-full p-4 rounded-2xl border border-amber-200 bg-white text-sm font-amiri leading-relaxed text-slate-900 focus:ring-2 focus:ring-amber-400 outline-hidden resize-none"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 bg-white/80 p-4 rounded-2xl border border-amber-200">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-2">
                      اختر فئة ومسار النص:
                    </label>
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setQuickTargetCategory('struggling')}
                        className={`w-full p-2 rounded-xl text-right text-xs font-black flex items-center justify-between border cursor-pointer ${
                          quickTargetCategory === 'struggling'
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>🌱 جملة للمتعثرين (م 1-2)</span>
                        {quickTargetCategory === 'struggling' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickTargetCategory('short_text')}
                        className={`w-full p-2 rounded-xl text-right text-xs font-black flex items-center justify-between border cursor-pointer ${
                          quickTargetCategory === 'short_text'
                            ? 'bg-cyan-100 border-cyan-400 text-cyan-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>🌿 نص قصير متوسط (م 3-4)</span>
                        {quickTargetCategory === 'short_text' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickTargetCategory('advanced')}
                        className={`w-full p-2 rounded-xl text-right text-xs font-black flex items-center justify-between border cursor-pointer ${
                          quickTargetCategory === 'advanced'
                            ? 'bg-amber-200 border-amber-500 text-amber-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>👑 نص طويل للمتميزين (م 5-6)</span>
                        {quickTargetCategory === 'advanced' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleQuickAddText}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>تحليل وتثبيت في المسار فوراً</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Level Filter Tabs & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedLevelFilter(0);
                    setSelectedTrackFilter('all');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedLevelFilter === 0 && selectedTrackFilter === 'all'
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  كل النصوص ({texts.length})
                </button>

                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevelFilter(lvl);
                      setSelectedTrackFilter('all');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      selectedLevelFilter === lvl 
                        ? 'bg-emerald-700 text-white shadow-sm' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{READING_LEVEL_INFO[lvl]?.icon}</span>
                    <span>المستوى {lvl}</span>
                  </button>
                ))}

                {selectedTrackFilter !== 'all' && (
                  <span className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1">
                    <span>
                      {selectedTrackFilter === 'struggling' ? '🌱 مسار المتعثرين' : selectedTrackFilter === 'short_text' ? '🌿 مسار النصوص القصيرة' : '👑 مسار المتميزين'}
                    </span>
                    <button
                      onClick={() => setSelectedTrackFilter('all')}
                      className="text-amber-700 hover:text-amber-950 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان أو المهارة أو الكلمات..."
                  className="w-full pl-8 pr-9 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden bg-slate-50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Current Level Info Box (if filtered) */}
            {selectedLevelFilter > 0 && READING_LEVEL_INFO[selectedLevelFilter] && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
                <span className="text-2xl">{READING_LEVEL_INFO[selectedLevelFilter].icon}</span>
                <div>
                  <h4 className="font-extrabold text-emerald-900 font-alexandria">
                    {READING_LEVEL_INFO[selectedLevelFilter].title}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    {READING_LEVEL_INFO[selectedLevelFilter].targetDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Texts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black font-alexandria text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>مكتبة النصوص التفاعلية ({filteredTexts.length})</span>
              </h3>

              {/* Data Tools: Import / Export / Reset */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleExportTexts}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="تصدير جميع النصوص بصيغة JSON"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">تصدير</span>
                </button>

                <label className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">استيراد</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTexts}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="استعادة النصوص الافتراضية"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">استعادة الأصل</span>
                </button>
              </div>
            </div>

            {filteredTexts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="text-base font-bold text-slate-700">لا توجد نصوص تطابق البحث</h4>
                <p className="text-xs text-slate-500">جرب تغيير المستوى أو البحث بكلمات أخرى، أو أضف نصاً جديداً.</p>
                <button
                  onClick={() => {
                    setSelectedLevelFilter(0);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  عرض جميع النصوص
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTexts.map((item) => {
                  const levelBadge = READING_LEVEL_INFO[item.level] || READING_LEVEL_INFO[1];
                  const record = records[item.id];
                  const isCompleted = !!record?.completed;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden group ${
                        isCompleted ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                      }`}
                    >
                      {/* Top Header Card */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r ${levelBadge.badgeColor} text-white shadow-xs`}>
                            المستوى {item.level}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>مكتمل</span>
                              </span>
                            )}
                            {item.isCustom && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                مخصص
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-black text-slate-900 font-alexandria mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h4>

                        {/* Snippet */}
                        <p className="text-xs text-slate-600 font-amiri leading-relaxed line-clamp-3 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.content}
                        </p>

                        {/* Target Skills Tags */}
                        {item.targetSkills && item.targetSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.targetSkills.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                              >
                                {s}
                              </span>
                            ))}
                            {item.targetSkills.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{item.targetSkills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Info & CTAs */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.expectedDurationSec} ثانية</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.wordCount} كلمة</span>
                          </span>
                          {record && (
                            <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                              <span>⭐</span>
                              <span>{record.fluencyStars || 5}</span>
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveTextForPractice(item);
                              setViewMode('studio');
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>{isCompleted ? 'إعادة القراءة' : 'انطلق في القراءة'}</span>
                          </button>

                          {item.isCustom && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTextToEdit(item);
                                  setIsTextModalOpen(true);
                                }}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                title="تعديل النص"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteText(item.id, e)}
                                className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                                title="حذف النص"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Text Modal with AI Smart Analyzer */}
      <ReadingTextModal
        isOpen={isTextModalOpen}
        onClose={() => {
          setIsTextModalOpen(false);
          setTextToEdit(null);
        }}
        onSaveText={handleSaveText}
        initialText={textToEdit}
      />
    </div>
  );
};
