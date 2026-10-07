import React, { useState } from 'react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
export type TabType = 'units' | 'summaries' | 'books' | 'foundation' | 'kg' | 'quiz' | 'ai' | 'worksheets' | 'achievements' | 'dictionary' | 'support_plans' | 'whiteboard' | 'reading_path' | 'spelling_champions' | 'grade1_workbook' | 'learning_games' | 'spelling' | 'songs' | 'home';

interface HeaderProps {
  currentGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  stars: number;
  studentName: string;
  onOpenCertificate: () => void;
  onSearchQuery?: (q: string) => void;
  onOpenInstallModal?: () => void;
  onCopyPageLink?: () => void;
}


export const Header: React.FC<HeaderProps> = ({ currentGrade, onSelectGrade, activeTab, onChangeTab, stars, onSearchQuery, onOpenInstallModal }) => {
  const [query, setQuery] = useState('');
  return <header dir="rtl" className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
      <button onClick={() => onChangeTab('home')} className="text-2xl font-black text-emerald-800">📚 لغتي <span className="text-sm font-normal">نتعلم خطوة بخطوة</span></button>
      <nav aria-label="التنقل الرئيسي" className="flex flex-wrap gap-2">
        {([['home', 'الصفوف'], ['books', 'الكتب والملفات'], ['achievements', 'إنجازاتي']] as [TabType, string][]).map(([tab, label]) => <button key={tab} onClick={() => onChangeTab(tab)} aria-current={activeTab === tab ? 'page' : undefined} className={`min-h-12 px-4 rounded-xl font-bold ${activeTab === tab ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-800'}`}>{label}</button>)}
      </nav>
      <span className="text-amber-700 font-bold">⭐ {stars}</span>
    </div>
    <div className="max-w-7xl mx-auto px-4 pb-4 flex flex-wrap gap-3 items-center">
      <label className="font-bold" htmlFor="current-grade">الصف:</label>
      <select id="current-grade" value={currentGrade} onChange={e => onSelectGrade(e.target.value as GradeId)} className="min-h-12 rounded-xl border border-slate-300 px-3 bg-white">
        {Object.values(GRADES_DATA).map(grade => <option key={grade.id} value={grade.id}>{grade.name}</option>)}
      </select>
      <form className="flex gap-2 flex-1" onSubmit={e => { e.preventDefault(); if(query.trim()) onSearchQuery?.(query.trim()); }}>
        <input aria-label="ابحث عن درس أو كتاب" placeholder="ابحث عن درس أو كتاب…" value={query} onChange={e => setQuery(e.target.value)} className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-3" />
        <button className="rounded-xl bg-emerald-700 text-white px-4 font-bold">بحث</button>
      </form>
      <button onClick={onOpenInstallModal} className="min-h-12 px-3 text-slate-600 underline">التواصل وتثبيت التطبيق</button>
    </div>
  </header>;
};
