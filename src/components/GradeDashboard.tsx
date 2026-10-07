import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { TabType } from './Header';

export const SECTION_LABELS: Partial<Record<TabType, string>> = { home: 'الصفوف والمواد', units: 'الدروس والوحدات', kg: 'أنشطة الروضة', foundation: 'تأسيس اللغة العربية', books: 'الكتب والملفات', quiz: 'اختبر نفسك', learning_games: 'تعلم باللعب', reading_path: 'القراءة', spelling_champions: 'الإملاء', dictionary: 'معاني الكلمات', summaries: 'ملخصات ومراجعة', worksheets: 'أوراق العمل', support_plans: 'خطط دعم الصف الأول', grade1_workbook: 'كراسة الصف الأول', whiteboard: 'السبورة', ai: 'المساعد الذكي', achievements: 'إنجازاتي' };

export const GradeDashboard = ({ grade, onGrade, onOpen }: { grade: GradeId; onGrade: (grade: GradeId) => void; onOpen: (tab: TabType) => void }) => {
  const early = grade === 'kg1' || grade === 'kg2';
  const groups: { title: string; ids: GradeId[] }[] = [
    { title: 'الروضة والتأسيس', ids: ['kg1', 'kg2', 'foundation'] },
    { title: 'المرحلة الابتدائية', ids: ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6'] },
    { title: 'المرحلة المتوسطة', ids: ['intermediate1', 'intermediate2', 'intermediate3'] }
  ];
  const links = (tabs: TabType[]) => <div className="grid sm:grid-cols-2 gap-3">{tabs.map(tab => <button key={tab} onClick={() => onOpen(tab)} className="min-h-16 text-right px-5 py-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50 font-bold text-lg">{SECTION_LABELS[tab]} ←</button>)}</div>;
  return <div dir="rtl" className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
    <div><h1 className="text-3xl font-black">أهلًا بك! ماذا تريد أن تتعلم؟</h1><p className="mt-3 text-lg text-slate-600">اختر صفك، ثم افتح الدروس أو التدريب أو الكتب.</p></div>
    <section className="space-y-5" aria-labelledby="choose-grade"><h2 id="choose-grade" className="text-xl font-bold">١. اختر الصف أو المستوى</h2>
      {groups.map(group => <div key={group.title}><h3 className="font-bold mb-3 text-slate-600">{group.title}</h3><div className="flex flex-wrap gap-3">{group.ids.filter(id => GRADES_DATA[id]).map(id => <button key={id} aria-pressed={grade === id} onClick={() => onGrade(id)} className={`min-h-14 px-5 rounded-2xl font-bold border ${grade === id ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-slate-300'}`}>{GRADES_DATA[id].name}</button>)}</div></div>)}
    </section>
    <section className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5 space-y-5"><h2 className="text-2xl font-black">٢. اللغة العربية — {GRADES_DATA[grade]?.name}</h2><p className="text-slate-600">المادة المتاحة: لغتي. اختر نوع المحتوى المناسب لك.</p>
      <h3 className="font-bold">📖 أتعلم</h3>{links([early ? 'kg' : grade === 'foundation' ? 'foundation' : 'units', 'reading_path', 'dictionary'])}
      <h3 className="font-bold">🎯 أتدرب</h3>{links(['quiz', 'learning_games', 'spelling_champions'])}
      <h3 className="font-bold">📚 كتبي ومراجعتي</h3>{links(['books', 'summaries', ...(grade === 'grade1' ? ['grade1_workbook' as TabType] : [])])}
    </section>
    <details className="rounded-2xl bg-white border border-slate-200 p-5"><summary className="min-h-12 cursor-pointer text-xl font-bold">للمعلم وولي الأمر</summary><div className="pt-4">{links(['worksheets', 'whiteboard', 'ai', ...(grade === 'grade1' ? ['support_plans' as TabType] : [])])}</div></details>
  </div>;
};
