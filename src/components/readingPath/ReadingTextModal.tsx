import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  Layers, 
  BrainCircuit, 
  Loader2, 
  HelpCircle,
  Clock,
  Tag
} from 'lucide-react';
import { 
  ReadingTextItem, 
  ReadingLevel, 
  ReadingContentType, 
  ComprehensionQuestion, 
  VocabularyItem 
} from '../../types/readingPath';

interface ReadingTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveText: (text: ReadingTextItem) => void;
  initialText?: ReadingTextItem | null;
}

export const ReadingTextModal: React.FC<ReadingTextModalProps> = ({
  isOpen,
  onClose,
  onSaveText,
  initialText
}) => {
  const [title, setTitle] = useState(initialText?.title || '');
  const [level, setLevel] = useState<ReadingLevel>(initialText?.level || 1);
  const [contentType, setContentType] = useState<ReadingContentType>(initialText?.contentType || 'sentence');
  const [content, setContent] = useState(initialText?.content || '');
  const [targetSkills, setTargetSkills] = useState<string[]>(
    initialText?.targetSkills || ['المد بالألف', 'الشدة', 'التنوين']
  );
  const [skillInput, setSkillInput] = useState('');
  const [newVocabulary, setNewVocabulary] = useState<VocabularyItem[]>(
    initialText?.newVocabulary || []
  );
  const [vocabWord, setVocabWord] = useState('');
  const [vocabMeaning, setVocabMeaning] = useState('');

  const [questions, setQuestions] = useState<ComprehensionQuestion[]>(
    initialText?.questions || []
  );
  const [expectedDurationSec, setExpectedDurationSec] = useState<number>(
    initialText?.expectedDurationSec || 25
  );

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !targetSkills.includes(skillInput.trim())) {
      setTargetSkills([...targetSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setTargetSkills(targetSkills.filter(s => s !== skill));
  };

  const handleAddVocab = () => {
    if (vocabWord.trim() && vocabMeaning.trim()) {
      setNewVocabulary([...newVocabulary, { word: vocabWord.trim(), meaning: vocabMeaning.trim() }]);
      setVocabWord('');
      setVocabMeaning('');
    }
  };

  const handleRemoveVocab = (index: number) => {
    setNewVocabulary(newVocabulary.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    const newQ: ComprehensionQuestion = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, updated: Partial<ComprehensionQuestion>) => {
    setQuestions(questions.map((q, i) => i === index ? { ...q, ...updated } : q));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // AI Smart Analyzer Call
  const handleAiSmartAnalyze = async () => {
    if (!content.trim()) {
      alert('يرجى كتابة أو لصق النص أولاً للتحليل');
      return;
    }

    setIsAnalyzing(true);
    setAiSuccessMessage(null);

    try {
      const response = await fetch('/api/ai/analyze-reading-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, title })
      });

      if (!response.ok) throw new Error('فشل التحليل الذكي');
      const data = await response.json();

      if (data.title && !title.trim()) setTitle(data.title);
      if (data.suggestedLevel) setLevel(data.suggestedLevel as ReadingLevel);
      if (data.contentType) setContentType(data.contentType as ReadingContentType);
      if (data.targetSkills && Array.isArray(data.targetSkills)) setTargetSkills(data.targetSkills);
      if (data.newVocabulary && Array.isArray(data.newVocabulary)) setNewVocabulary(data.newVocabulary);
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      }
      if (data.expectedDurationSec) setExpectedDurationSec(data.expectedDurationSec);

      setAiSuccessMessage(`✨ تم التحليل الذكي بنجاح: تم اقتراح المستوى ${data.suggestedLevel} وتحديد المهارات وصياغة الأسئلة!`);
    } catch (err) {
      console.error(err);
      // Fallback local calculation
      const words = content.trim().split(/\s+/).filter(Boolean);
      const count = words.length;
      let sugLvl: ReadingLevel = 1;
      if (count > 80) sugLvl = 6;
      else if (count > 50) sugLvl = 5;
      else if (count > 30) sugLvl = 4;
      else if (count > 15) sugLvl = 3;
      else if (count > 7) sugLvl = 2;

      setLevel(sugLvl);
      setExpectedDurationSec(Math.max(15, Math.round((count / 50) * 60)));
      setAiSuccessMessage(`✨ تم حساب عدد الكلمات (${count} كلمة) واقتراح المستوى ${sugLvl}!`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      alert('يرجى إدخال نص القراءة');
      return;
    }

    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const item: ReadingTextItem = {
      id: initialText?.id || `custom_text_${Date.now()}`,
      title: title.trim() || `نص قرائي (${wordCount} كلمة)`,
      level,
      contentType,
      content: content.trim(),
      paragraphs: content.includes('\n\n') ? content.split('\n\n').filter(p => p.trim()) : undefined,
      wordCount,
      targetSkills: targetSkills.length > 0 ? targetSkills : ['القراءة والطلاقة'],
      newVocabulary,
      questions: questions.length > 0 ? questions : [
        {
          id: `q_default_${Date.now()}`,
          type: 'multiple_choice',
          question: 'ما الفكرة الرئيسية المستفادة من هذا النص؟',
          options: ['فكرة النص الأساسية', 'خيار غير صحيح 1', 'خيار غير صحيح 2', 'خيار غير صحيح 3'],
          correctAnswer: 0,
          explanation: 'تمت صياغة السؤال للفهم القرائي العام.'
        }
      ],
      expectedDurationSec: expectedDurationSec || Math.max(15, Math.round((wordCount / 50) * 60)),
      orderIndex: initialText?.orderIndex || 99,
      isCustom: true,
      createdAt: initialText?.createdAt || new Date().toISOString()
    };

    onSaveText(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-right flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-alexandria">
                {initialText ? 'تعديل النص القرائي' : '➕ إضافة نص قرائي جديد للمسار'}
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                إضافة ديناميكية مباشرة لمسار الانطلاق في القراءة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* AI Smart Analyzer Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-purple-950">
                  🤖 المساعد الذكي لتحليل النصوص
                </p>
                <p className="text-[11px] text-purple-800">
                  الصق النص أدناه واضغط لتحليله واقتراح المستوى والمهارات وصياغة أسئلة الفهم تلقائياً!
                </p>
              </div>
            </div>

            <button
              type="button"
              id="ai-smart-analyze-text-btn"
              onClick={handleAiSmartAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحليل...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تحليل النص بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>

          {aiSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}

          {/* Title & Level & Content Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                عنوان النص:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: يَوْمٌ فِي الْمَدْرَسَةِ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المستوى المستهدف (1 - 6):
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) as ReadingLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-sm font-bold bg-white"
              >
                <option value={1}>المستوى 1 — كلمات وجمل قصيرة</option>
                <option value={2}>المستوى 2 — الجمل المتوسطة (5-8 كلمات)</option>
                <option value={3}>المستوى 3 — نصوص قصيرة جداً (2-4 جمل)</option>
                <option value={4}>المستوى 4 — النصوص القصيرة (40-80 كلمة)</option>
                <option value={5}>المستوى 5 — النصوص المتوسطة (وصف وحوار)</option>
                <option value={6}>المستوى 6 — النصوص الطويلة المتقدمة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نوع المحتوى:
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ReadingContentType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-sm font-semibold bg-white"
              >
                <option value="sentence">جملة واحدة</option>
                <option value="sentences_group">مجموعة جمل</option>
                <option value="short_text">نص قصير</option>
                <option value="medium_text">نص متوسط</option>
                <option value="long_text">نص طويل مقسم لفقرات</option>
              </select>
            </div>
          </div>

          {/* Reading Content Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                محتوى النص القرائي (يُفضل كتابته بالحركات التامة):
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">
                عدد الكلمات: {content.trim().split(/\s+/).filter(Boolean).length}
              </span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب أو الصق النص هنا مع الحركات لتمكين القراءات الصوتية والتدريب..."
              className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-base leading-loose font-amiri font-semibold"
            />
          </div>

          {/* Target Skills Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              المهارات القرائية والإملائية المستهدفة:
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {targetSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-emerald-700" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 font-black cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="أضف مهارة مثل: اللام الشمسية، التاء المربوطة..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-emerald-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                + إضافة مهارة
              </button>
            </div>
          </div>

          {/* New Vocabulary Words */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الكلمات الجديدة وشرحها:
            </label>
            {newVocabulary.length > 0 && (
              <div className="space-y-2 mb-3">
                {newVocabulary.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-extrabold text-emerald-800 ml-2">({v.word})</span>
                      <span className="text-slate-600">: {v.meaning}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVocab(i)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={vocabWord}
                onChange={(e) => setVocabWord(e.target.value)}
                placeholder="الكلمة (مثال: الْبَاسِقَ)"
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:border-emerald-500 outline-hidden"
              />
              <input
                type="text"
                value={vocabMeaning}
                onChange={(e) => setVocabMeaning(e.target.value)}
                placeholder="المعنى (مثال: العالي المرتفع)"
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddVocab}
                className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
              >
                + إضافة مفردة
              </button>
            </div>
          </div>

          {/* Comprehension Questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>أسئلة الفهم القرائي ({questions.length}):</span>
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سؤال</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, qIndex) => (
                <div key={q.id || qIndex} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-700">السؤال {qIndex + 1}:</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qIndex, { question: e.target.value })}
                    placeholder="نص السؤال..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-emerald-500 outline-hidden"
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={Number(q.correctAnswer) === optIndex}
                          onChange={() => handleUpdateQuestion(qIndex, { correctAnswer: optIndex })}
                          className="accent-emerald-600 cursor-pointer"
                          title="حدد هذا الخيار كإجابة صحيحة"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(q.options || [])];
                            newOpts[optIndex] = e.target.value;
                            handleUpdateQuestion(qIndex, { options: newOpts });
                          }}
                          placeholder={`خيار ${optIndex + 1} ${optIndex === Number(q.correctAnswer) ? '(الإجابة الصحيحة)' : ''}`}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white outline-hidden ${
                            optIndex === Number(q.correctAnswer) 
                              ? 'border-emerald-500 font-bold bg-emerald-50/50' 
                              : 'border-slate-300'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>المدة المتوقعة:</span>
            <input
              type="number"
              value={expectedDurationSec}
              onChange={(e) => setExpectedDurationSec(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-center font-bold text-xs bg-white"
            />
            <span>ثانية</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              id="save-reading-text-submit-btn"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialText ? 'حفظ التعديلات' : 'إضافة النص إلى المسار'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
