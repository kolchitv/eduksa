import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Volume2, 
  RotateCcw,
  MessageSquare,
  Wand2,
  FileCheck
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { audioManager } from '../utils/audio';

interface AiTutorProps {
  currentGrade: GradeId;
}

export const AiTutor: React.FC<AiTutorProps> = ({ currentGrade }) => {
  const [activeMode, setActiveMode] = useState<'irab' | 'chat' | 'generator'>('irab');
  
  // I'rab Analyzer State
  const [sentenceInput, setSentenceInput] = useState('يَقْرَأُ الطَّالِبُ كِتَابَ لُغَتِي بِنَشَاطٍ');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    diacritized?: string;
    explanation?: string;
    irab?: Array<{ word: string; role: string; detail: string }>;
    spellingPhenomena?: Array<{ word: string; rule: string; explanation: string }>;
  } | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `مرحباً بك يا بطل! أنا "مُعَلِّمُ لُغَتِي الذَّكِيُّ" 🌟. أسعد بإجابتك عن أي استفسار في مقرر لغتي الجميلة (${GRADES_DATA[currentGrade]?.name || 'المرحلة الابتدائية'})، سواء في الإعراب، الإملاء، الهمزات، أو شرح معاني الكلمات!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // AI Quiz Generator State
  const [genTopic, setGenTopic] = useState('الهمزة المتوسطة على ألف والمفعول المطلق');
  const [genQuestions, setGenQuestions] = useState<any[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Quick Preset Sentences
  const presetSentences = [
    'انْطَلَقَتِ السَّيَّارَةُ انْطِلاقاً سَرِيعاً',
    'كَانَ أَبُو بَكْرٍ رَضِيَ اللهُ عَنْهُ صَادِقاً',
    'المُسْلِمُونَ يُحَافِظُونَ عَلَى الصَّلاةِ',
    'قَرَأَ فُوَّازٌ القِصَّةَ بِإِتْقَانٍ',
    'العِلْمُ نُورٌ وَالجَهْلُ ظَلامٌ'
  ];

  const handleAnalyzeSentence = async (targetSentence?: string) => {
    const textToAnalyze = targetSentence || sentenceInput;
    if (!textToAnalyze.trim()) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: textToAnalyze,
          grade: GRADES_DATA[currentGrade]?.name || 'الابتدائي'
        })
      });

      if (!res.ok) throw new Error('Failed to analyze');
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      // Offline fallback mock
      const words = textToAnalyze.split(' ');
      setAnalysisResult({
        diacritized: textToAnalyze,
        explanation: 'تحليل مكونات الجملة حسب القواعد النحوية المعتمدة في المنهاج السعودي.',
        irab: words.map((w, idx) => ({
          word: w,
          role: idx === 0 ? 'فعل / مبتدأ' : idx === 1 ? 'فاعل / خبر' : 'مفعول به / اسم مجرور',
          detail: 'مرفوع أو منصوب حسب موقعه الإعرابي في سياق الجملة.'
        })),
        spellingPhenomena: [
          { word: words[0] || 'الكلمة', rule: 'الحركات والهمزات', explanation: 'كُتبت وفق القاعدة الإملائية القياسية' }
        ]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          grade: GRADES_DATA[currentGrade]?.name || 'الابتدائي',
          topic: 'قواعد ومقرر لغتي الجميلة'
        })
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || 'أحسنت السؤال! راجع القاعدة في كتاب لغتي وطبق عليها.' }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'بارك الله فيك يا بطل! تذكر دائماً أن تراجع القواعد وتدرب عينيك على القراءة بالحركات باستمرار.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!genTopic.trim() || generatingQuiz) return;
    setGeneratingQuiz(true);
    setGenQuestions([]);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: GRADES_DATA[currentGrade]?.name || 'الابتدائي',
          topic: genTopic,
          count: 3
        })
      });

      const data = await res.json();
      setGenQuestions(data.questions || []);
    } catch (err) {
      setGenQuestions([
        {
          id: 'q_mock',
          question: `سؤال تطبيقي في موضوع: ${genTopic}`,
          options: ['الخيار الصحيح', 'خيار آخر', 'خيار ثالث'],
          correctIndex: 0,
          explanation: 'إجابة نموذجية حسب كتاب لغتي.'
        }
      ]);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>مساعد لغتي الذكي • المعرب الفوري ومولد الأسئلة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-alexandria">
              المُعرب ومعلم لغتي الذكي
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl">
              إعراب فوري لأي جملة بالمنهاج السعودي، توضيح الظواهر الإملائية، والتحاور مع معلم لغتي الافتراضي المدعوم بـ Gemini AI.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveMode('irab')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'irab' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              المُعرب والمُشكّل الفوري
            </button>
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'chat' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              محادثة المعلم الذكي
            </button>
            <button
              onClick={() => setActiveMode('generator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'generator' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              مولد الاختبارات
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: I'RAB & SENTENCE ANALYZER */}
      {activeMode === 'irab' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-2">أدخل الجملة المراد إعرابها وتحليلها:</h3>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <input
                id="sentence-irab-input"
                type="text"
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="اكتب جملتك هنا (مثال: كَانَ الطَّالِبُ مُجْتَهِداً)..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base font-amiri font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                id="btn-run-irab-analysis"
                onClick={() => handleAnalyzeSentence()}
                disabled={analyzing || !sentenceInput.trim()}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جارٍ الإعراب...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>إعراب الجملة</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400">جمل منهجية جاهزة:</span>
              {presetSentences.map((st, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSentenceInput(st);
                    handleAnalyzeSentence(st);
                  }}
                  className="px-3 py-1 rounded-xl text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors font-amiri"
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Results Card */}
          {analysisResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Diacritized Text Display */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 block mb-1">الجملة مضبوطة بالشكل التام:</span>
                  <p className="text-2xl sm:text-3xl font-amiri font-bold text-emerald-950">
                    {analysisResult.diacritized || sentenceInput}
                  </p>
                </div>
                <button
                  onClick={() => audioManager.speakArabic(analysisResult.diacritized || sentenceInput)}
                  className="p-3 rounded-2xl bg-white text-emerald-700 border border-emerald-200 shadow-xs hover:bg-emerald-100"
                  title="استمع للنطق"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* I'rab Table */}
              {analysisResult.irab && analysisResult.irab.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>جدول الإعراب التفصيلي</span>
                  </h4>

                  <div className="overflow-hidden border border-slate-200 rounded-2xl">
                    <table className="w-full text-right border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3.5 w-1/4">الكلمة</th>
                          <th className="p-3.5 w-1/4">الموقع الإعرابي</th>
                          <th className="p-3.5 w-2/4">العلامة الإعرابية والتفصيل</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analysisResult.irab.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-bold font-amiri text-lg text-emerald-900">{row.word}</td>
                            <td className="p-3.5 font-bold text-slate-800">{row.role}</td>
                            <td className="p-3.5 text-slate-600">{row.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Spelling Phenomena Explanations */}
              {analysisResult.spellingPhenomena && analysisResult.spellingPhenomena.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>الظواهر الإملائية في الجملة</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisResult.spellingPhenomena.map((sp, sIdx) => (
                      <div key={sIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-amiri font-bold text-emerald-900">{sp.word}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {sp.rule}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{sp.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: CHAT WITH AI TEACHER */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {msg.sender === 'user' ? 'طالب' : 'معلم'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></span>
                <span>المعلم يكتب لك الإجابة...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
            <input
              id="ai-tutor-chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اسأل معلم لغتي عن أي قاعدة أو درس (مثال: ما الفرق بين كان وإن؟ أو كيف أعرب الفاعل؟)..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              id="btn-send-ai-chat"
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>إرسال</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* MODE 3: AI QUIZ GENERATOR */}
      {activeMode === 'generator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">مولد الاختبارات والأسئلة الذكية</h3>
            <p className="text-xs text-slate-500">
              اكتب أي موضوع أو مهارة لتوليد أسئلة منهجية فورية مع مفتاح الإجابة والشرح.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              placeholder="اكتب المهارة أو القاعدة (مثال: الأفعال الخمسة، الهمزة المتطرفة، اللام الشمسية...)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={generatingQuiz || !genTopic.trim()}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {generatingQuiz ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ التوليد...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>توليد ٣ أسئلة الآن</span>
                </>
              )}
            </button>
          </div>

          {genQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {genQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <p className="text-sm font-bold font-amiri text-slate-900">{qIdx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl text-xs font-bold border ${
                          optIdx === q.correctIndex
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt} {optIdx === q.correctIndex && '✓ (الإجابة الصحيحة)'}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 mt-1">💡 التوضيح: {q.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
