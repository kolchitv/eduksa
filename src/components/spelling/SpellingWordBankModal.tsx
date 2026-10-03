import React, { useState } from 'react';
import { 
  SpellingSkillBankItem, 
  SpellingSkillId, 
  SpellingSubSkill, 
  SkillDifficulty, 
  getAllSpellingItems, 
  saveCustomSpellingItem, 
  deleteCustomSpellingItem,
  getCustomSpellingItems
} from '../../data/spellingSkillsData';
import { 
  X, 
  Plus, 
  Trash2, 
  BookOpen, 
  Search, 
  Check, 
  Volume2, 
  Sparkles, 
  Filter,
  Save
} from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface SpellingWordBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBankUpdated?: () => void;
  initialSkill?: SpellingSkillId;
}

export const SpellingWordBankModal: React.FC<SpellingWordBankModalProps> = ({
  isOpen,
  onClose,
  onBankUpdated,
  initialSkill = 'taa_types'
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SpellingSkillId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [items, setItems] = useState<SpellingSkillBankItem[]>(() => getAllSpellingItems());

  // Form State
  const [formData, setFormData] = useState<Partial<SpellingSkillBankItem>>({
    skill: initialSkill,
    subSkill: 'taaMarbuta',
    difficulty: 'easy',
    word: '',
    tashkeel: '',
    audioText: '',
    emoji: '📝',
    gradeLevel: 'الصف الأول والثاني',
    unit: 'الوحدة الإملائية',
    correctAnswer: 'ة',
    options: ['ة', 'ت'],
    explanation: '',
    sentenceExample: '',
    incompleteWord: '',
    wrongSpelling: '',
    hamzaChair: 'أ',
    whyWritten: '',
    singularForm: '',
    dualForm: '',
    pluralForm: '',
    itemCountVisual: 1
  });

  if (!isOpen) return null;

  const refreshItems = () => {
    const updated = getAllSpellingItems();
    setItems(updated);
    if (onBankUpdated) onBankUpdated();
  };

  const filteredItems = items.filter((item) => {
    const matchesSkill = selectedSkill === 'all' || item.skill === selectedSkill;
    const matchesQuery = 
      !searchQuery || 
      item.word.includes(searchQuery) || 
      item.tashkeel.includes(searchQuery) || 
      item.explanation.includes(searchQuery);
    return matchesSkill && matchesQuery;
  });

  const handleSkillChange = (newSkill: SpellingSkillId) => {
    let defaultSubSkill: SpellingSubSkill = 'taaMarbuta';
    let defaultCorrect = 'ة';
    let defaultOptions = ['ة', 'ت'];

    if (newSkill === 'middle_hamza') {
      defaultSubSkill = 'middleHamza';
      defaultCorrect = 'أ';
      defaultOptions = ['أ', 'ؤ', 'ئ', 'ء'];
    } else if (newSkill === 'final_hamza') {
      defaultSubSkill = 'finalHamza';
      defaultCorrect = 'ئ';
      defaultOptions = ['ئ', 'أ', 'ؤ', 'ء'];
    } else if (newSkill === 'singular_dual_plural') {
      defaultSubSkill = 'singular';
      defaultCorrect = 'مفرد';
      defaultOptions = ['مفرد', 'مثنى', 'جمع'];
    }

    setFormData((prev) => ({
      ...prev,
      skill: newSkill,
      subSkill: defaultSubSkill,
      correctAnswer: defaultCorrect,
      options: defaultOptions
    }));
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.tashkeel) {
      alert('يرجى كتابة الكلمة والكلمة بالتشكيل!');
      return;
    }

    const newItem: SpellingSkillBankItem = {
      id: `custom_${Date.now()}`,
      word: formData.word.trim(),
      tashkeel: formData.tashkeel.trim(),
      audioText: formData.audioText?.trim() || formData.word.trim(),
      emoji: formData.emoji?.trim() || '📝',
      skill: formData.skill || 'taa_types',
      subSkill: formData.subSkill || 'taaMarbuta',
      gradeLevel: formData.gradeLevel?.trim() || 'عام',
      unit: formData.unit?.trim() || 'الإملاء',
      difficulty: formData.difficulty || 'easy',
      correctAnswer: formData.correctAnswer?.trim() || 'ة',
      options: formData.options && formData.options.length > 0 ? formData.options : ['ة', 'ت'],
      explanation: formData.explanation?.trim() || 'قاعدة إملائية تطبيقية',
      sentenceExample: formData.sentenceExample?.trim() || `كَتَبَ الطَّالِبُ ${formData.tashkeel}.`,
      incompleteWord: formData.incompleteWord?.trim(),
      wrongSpelling: formData.wrongSpelling?.trim(),
      hamzaChair: formData.hamzaChair,
      whyWritten: formData.whyWritten?.trim(),
      singularForm: formData.singularForm?.trim(),
      dualForm: formData.dualForm?.trim(),
      pluralForm: formData.pluralForm?.trim(),
      itemCountVisual: formData.itemCountVisual || 1
    };

    saveCustomSpellingItem(newItem);
    audioManager.play('correct');
    setIsAddingNew(false);
    refreshItems();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الكلمة من البنك؟')) {
      deleteCustomSpellingItem(id);
      refreshItems();
      audioManager.play('click');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-cairo">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black font-alexandria">
                  بنك كلمات مسار الإملاء والظواهر
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  مركزي ومفتوح 🌟
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                تصفح وإضافة كلمات مخصصة لمهارات التاء، الهمزات، والمفرد والمثنى والجمع تستخدمها الألعاب تلقائيًا
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Filter, Search, and Add Word Button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="ابحث عن كلمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 pl-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold w-44 sm:w-56 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setSelectedSkill('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedSkill === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                الكل ({items.length})
              </button>
              <button
                onClick={() => setSelectedSkill('taa_types')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedSkill === 'taa_types'
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                ة / ت
              </button>
              <button
                onClick={() => setSelectedSkill('middle_hamza')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedSkill === 'middle_hamza'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                ⚡ الهمزة المتوسطة
              </button>
              <button
                onClick={() => setSelectedSkill('final_hamza')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedSkill === 'final_hamza'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🏝️ الهمزة المتطرفة
              </button>
              <button
                onClick={() => setSelectedSkill('singular_dual_plural')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  selectedSkill === 'singular_dual_plural'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👤👥 العدد
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isAddingNew ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAddingNew ? 'إلغاء الإضافة' : 'إضافة كلمة جديدة +'}</span>
          </button>
        </div>

        {/* Add New Word Form Modal Drawer */}
        {isAddingNew && (
          <form
            onSubmit={handleSaveWord}
            className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-200 dark:border-indigo-800/40 shrink-0 space-y-4 animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>نموذج إضافة كلمة إملائية لبنك الأسئلة:</span>
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                تظهر الكلمة تلقائيًا في جميع ألعاب المهارة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المهارة المستهدفة:
                </label>
                <select
                  value={formData.skill}
                  onChange={(e) => handleSkillChange(e.target.value as SpellingSkillId)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value="taa_types">التاء المربوطة والمفتوحة (ة / ت)</option>
                  <option value="middle_hamza">الهمزة المتوسطة (أ / ؤ / ئ / ء)</option>
                  <option value="final_hamza">الهمزة المتطرفة (أ / ؤ / ئ / ء)</option>
                  <option value="singular_dual_plural">المفرد والمثنى والجمع (👤👥)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الكلمة (مجردة):
                </label>
                <input
                  type="text"
                  placeholder="مثال: مدرسة"
                  value={formData.word || ''}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الكلمة بالتشكيل:
                </label>
                <input
                  type="text"
                  placeholder="مثال: مَدْرَسَةٌ"
                  value={formData.tashkeel || ''}
                  onChange={(e) => setFormData({ ...formData, tashkeel: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  رمز تعبيري (Emoji):
                </label>
                <input
                  type="text"
                  placeholder="🏫"
                  value={formData.emoji || ''}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-center"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الإجابة الصحيحة:
                </label>
                <input
                  type="text"
                  placeholder="ة أو ت أو أ أو مفرد..."
                  value={formData.correctAnswer || ''}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  كلمة ناقصة (للتحدي):
                </label>
                <input
                  type="text"
                  placeholder="مدرسـ؟"
                  value={formData.incompleteWord || ''}
                  onChange={(e) => setFormData({ ...formData, incompleteWord: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  كتابة خاطئة (لتصحيحها):
                </label>
                <input
                  type="text"
                  placeholder="مدرست"
                  value={formData.wrongSpelling || ''}
                  onChange={(e) => setFormData({ ...formData, wrongSpelling: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مستوى الصعوبة:
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as SkillDifficulty })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value="easy">🟢 سهل</option>
                  <option value="medium">🟡 متوسط</option>
                  <option value="hard">🔴 متقدم</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  التفسير والشرح الإملائي:
                </label>
                <input
                  type="text"
                  placeholder="تُنطق هاءً عند الوقف وتاءً عند الوصل..."
                  value={formData.explanation || ''}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  جملة للإملاء المتقدم:
                </label>
                <input
                  type="text"
                  placeholder="ذَهَبَ فَوَّازٌ إِلَى المَدْرَسَةِ مُبَكِّرًا."
                  value={formData.sentenceExample || ''}
                  onChange={(e) => setFormData({ ...formData, sentenceExample: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ الكلمة في البنك</span>
              </button>
            </div>
          </form>
        )}

        {/* Words Grid Container */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl block">🔍</span>
              <p className="text-sm font-bold text-slate-500">
                لا توجد كلمات مطابقة للبحث أو المهارة المحددة.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const isCustom = item.id.startsWith('custom_');
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between gap-3 hover:shadow-xs transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 rounded-xl bg-white dark:bg-slate-700 shadow-2xs">
                            {item.emoji}
                          </span>
                          <div>
                            <h4 className="text-base font-black text-slate-900 dark:text-white font-alexandria">
                              {item.tashkeel}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-bold block">
                              {item.gradeLevel} • {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => audioManager.speakArabic(item.audioText, 0.85)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer"
                            title="استمع"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {isCustom && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                              title="حذف الكلمة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-bold">
                          <span>الإجابة الصحيحة:</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black">
                            {item.correctAnswer}
                          </span>
                        </div>

                        {item.explanation && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            💡 {item.explanation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between text-[10px] font-bold">
                      <span className={`px-2 py-0.5 rounded-full ${
                        item.difficulty === 'easy'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.difficulty === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.difficulty === 'easy' ? '🟢 سهل' : item.difficulty === 'medium' ? '🟡 متوسط' : '🔴 متقدم'}
                      </span>

                      <span className="text-slate-400">
                        {isCustom ? '⭐ مضاف للمعلم' : '📘 بنك مركزي'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold shrink-0">
          <span className="text-slate-500">
            إجمالي الكلمات المعروضة: {filteredItems.length} كلمة
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black cursor-pointer hover:opacity-90"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
