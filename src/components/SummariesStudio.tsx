import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Search, 
  Printer, 
  Layers, 
  GraduationCap, 
  FileText, 
  Lightbulb, 
  HelpCircle, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Zap,
  Tag,
  Share2,
  Download
} from 'lucide-react';
import { SUMMARIES_DATA, SummaryTopic } from '../data/summariesData';
import { shuffleQuestionOptions } from '../utils/shuffle';

interface SummariesStudioProps {
  initialGrade?: 'all' | 'intermediate1' | 'intermediate2' | 'intermediate3';
  onAddStars?: (count: number) => void;
  onNavigateToCurriculum?: (gradeId: string) => void;
}

export const SummariesStudio: React.FC<SummariesStudioProps> = ({
  initialGrade = 'all',
  onAddStars,
  onNavigateToCurriculum
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'intermediate1' | 'intermediate2' | 'intermediate3'>(initialGrade);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicId, setActiveTopicId] = useState<string>(SUMMARIES_DATA[0]?.id || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const filteredTopics = useMemo(() => {
    return SUMMARIES_DATA.filter((topic) => {
      const matchGrade = selectedGrade === 'all' || topic.grade === selectedGrade;
      const matchCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      const matchQuery = 
        !searchQuery.trim() || 
        topic.title.includes(searchQuery.trim()) || 
        topic.coreRule.includes(searchQuery.trim()) || 
        topic.keyPoints.some(p => p.includes(searchQuery.trim()));
      return matchGrade && matchCategory && matchQuery;
    });
  }, [selectedGrade, selectedCategory, searchQuery]);

  const activeTopic = useMemo(() => {
    return filteredTopics.find(t => t.id === activeTopicId) || filteredTopics[0] || SUMMARIES_DATA[0];
  }, [filteredTopics, activeTopicId]);

  // عشوائية ترتيب الخيارات حتى لا تكون الإجابة الصحيحة متوقعة أو في نفس الموقع
  const shuffledQuestions = useMemo(() => {
    if (!activeTopic.testQuestions) return [];
    return activeTopic.testQuestions.map((q) => {
      const { shuffledOptions, newCorrectIndex } = shuffleQuestionOptions(q.options, q.correctIndex);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex
      };
    });
  }, [activeTopic.id, activeTopic.testQuestions]);

  const handleSelectAnswer = (qKey: string, optionIdx: number, correctIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qKey]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [qKey]: true }));
    if (optionIdx === correctIdx && onAddStars) {
      onAddStars(2);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                القسم المتوسط • مذكرات المتوسطة
              </span>
              <span className="text-xs text-emerald-200 font-bold">
                إعداد: أ. ذاكر الشمري & منهاج وزارة التعليم
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-alexandria tracking-tight">
              📑 مذكرات المتوسطة — مهارات وقواعد الاختبار المركزي
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              مذكرات شاملة، شروح مبسطة، خرائط ذهنية، قواعد أقوى الحركات، الفروق النحوية والإملائية، ونماذج اختبارية تفاعلية لصفوف القسم المتوسط: الأول، الثاني، والثالث متوسط.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/20 transition-all flex items-center justify-center gap-2 shadow-sm"
              title="طباعة مذكرات المتوسطة"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة المذكرة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grade Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Grade tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                selectedGrade === 'all'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              جميع مذكرات المتوسطة
            </button>
            <button
              onClick={() => setSelectedGrade('intermediate1')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedGrade === 'intermediate1'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>📘</span>
              <span>مذكرات الأول متوسط (م١)</span>
            </button>
            <button
              onClick={() => setSelectedGrade('intermediate2')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedGrade === 'intermediate2'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>📗</span>
              <span>مذكرات الثاني متوسط (م٢)</span>
            </button>
            <button
              onClick={() => setSelectedGrade('intermediate3')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedGrade === 'intermediate3'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>📙</span>
              <span>مذكرات الثالث متوسط (م٣)</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في القواعد والملخصات (مثال: الفاعل، همزة الوصل، التمييز...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'grammar', label: 'الوظيفة النحوية والصنف اللغوي' },
            { id: 'spelling', label: 'الرسم الإملائي والهمزات' },
            { id: 'style', label: 'الأساليب اللغوية' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 mr-auto font-semibold">
            {filteredTopics.length} موضوع ملخّص
          </span>
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Topic List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const isSelected = activeTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right group ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    topic.grade === 'intermediate1' ? 'bg-sky-100 text-sky-800' :
                    topic.grade === 'intermediate2' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {topic.gradeName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ص {topic.pageNumberRef} بالمذكرة
                  </span>
                </div>
                <h3 className={`text-sm font-bold leading-snug transition-colors ${
                  isSelected ? 'text-emerald-950 font-black' : 'text-slate-800 group-hover:text-emerald-800'
                }`}>
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                  {topic.coreRule}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Topic Detail View (8 cols) */}
        <div className="lg:col-span-8">
          {activeTopic ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {activeTopic.gradeName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {activeTopic.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mr-auto">
                    مرجع المذكرة: ص {activeTopic.pageNumberRef}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria">
                  {activeTopic.title}
                </h2>
              </div>

              {/* Core Rule Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>القاعدة الجوهرية والضابط:</span>
                </div>
                <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                  {activeTopic.coreRule}
                </p>
              </div>

              {/* Key Points & Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>النقاط والمحاور الرئيسية:</span>
                </h4>
                <ul className="space-y-2">
                  {activeTopic.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples Section */}
              {activeTopic.examples && activeTopic.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>أمثلة تطبيقية ونماذج إعراب:</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeTopic.examples.map((ex, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-right space-y-1">
                        <p className="text-sm font-black text-indigo-950 font-serif">
                          «{ex.sentence}»
                        </p>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                          💡 {ex.analysis}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes Warning */}
              {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <h4 className="text-xs sm:text-sm font-black text-rose-900 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>تنبيه: من الأخطاء الشائعة في الاختبار:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-rose-800">
                    {activeTopic.commonMistakes.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam Practice Questions */}
              {activeTopic.testQuestions && activeTopic.testQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>سؤال تدريبي من الاختبار المركزي:</span>
                    </h4>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      +2 نجمة لكل إجابة صحيحة
                    </span>
                  </div>

                  {shuffledQuestions.map((q, qIdx) => {
                    const qKey = `${activeTopic.id}_${qIdx}`;
                    const answered = quizAnswers[qKey] !== undefined;
                    const selectedIdx = quizAnswers[qKey];
                    const isCorrect = selectedIdx === q.correctIndex;

                    return (
                      <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <p className="text-sm font-bold text-slate-900">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300';
                            if (answered) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black';
                              } else if (optIdx === selectedIdx) {
                                btnStyle = 'bg-rose-100 text-rose-900 border-rose-300';
                              } else {
                                btnStyle = 'bg-white text-slate-400 border-slate-200 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={answered}
                                onClick={() => handleSelectAnswer(qKey, optIdx, q.correctIndex)}
                                className={`p-2.5 rounded-xl border text-xs font-bold text-right transition-all flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {answered && optIdx === q.correctIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {showExplanation[qKey] && (
                          <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                          }`}>
                            <p className="font-bold mb-0.5">
                              {isCorrect ? '✨ أحسنت! إجابة صحيحة' : '❌ إجابة خاطئة'}
                            </p>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              لم يتم العثور على ملخصات تطابق البحث.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
