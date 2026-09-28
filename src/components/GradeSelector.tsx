import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ChevronLeft, 
  Award, 
  CheckCircle2, 
  Flame, 
  Layers,
  FolderOpen,
  FileText
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';

interface GradeSelectorProps {
  selectedGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  completedQuizzesCount: number;
  onOpenSupportPlans?: () => void;
  onOpenReadingPathway?: (track?: 'all' | 'struggling' | 'short_text' | 'advanced') => void;
  onOpenSummaries?: () => void;
  onOpenSpellingChampions?: () => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
  completedQuizzesCount,
  onOpenSupportPlans: _onOpenSupportPlans,
  onOpenReadingPathway: _onOpenReadingPathway,
  onOpenSummaries,
  onOpenSpellingChampions
}) => {
  const [stageFilter, setStageFilter] = useState<'all' | 'primary' | 'intermediate' | 'early'>('all');

  const primaryGrades = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6'] as GradeId[];
  const intermediateGrades = ['intermediate1', 'intermediate2'] as GradeId[];
  const earlyGrades = ['kg1', 'kg2', 'foundation'] as GradeId[];

  const renderGradeCard = (gradeId: GradeId, isIntermediateSection = false) => {
    const grade = GRADES_DATA[gradeId];
    if (!grade) return null;
    const isSelected = selectedGrade === grade.id;

    return (
      <button
        key={grade.id}
        id={`grade-card-btn-${grade.id}`}
        onClick={() => onSelectGrade(grade.id)}
        className={`group relative p-3 sm:p-3.5 rounded-2xl text-right transition-all duration-200 border flex flex-col justify-between cursor-pointer ${
          isSelected
            ? isIntermediateSection
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-md scale-[1.02]'
              : 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]'
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-emerald-300 hover:shadow-xs'
        }`}
      >
        {/* Top Badge & Icon */}
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
              isSelected
                ? isIntermediateSection
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
            }`}
          >
            {grade.id === 'kg1' ? (
              <span>🌱</span>
            ) : grade.id === 'kg2' ? (
              <span>🌿</span>
            ) : grade.id === 'foundation' ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : grade.id.startsWith('intermediate') ? (
              <GraduationCap className="w-3.5 h-3.5" />
            ) : grade.id === 'grade6' ? (
              <Award className="w-3.5 h-3.5" />
            ) : (
              <BookOpen className="w-3.5 h-3.5" />
            )}
          </div>

          {grade.id === 'grade1' ? (
            <span className="text-[9px] font-extrabold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md border border-rose-200">
              دعم 📁
            </span>
          ) : grade.id.startsWith('intermediate') ? (
            <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded-md border border-indigo-200">
              مذكرات المتوسطة 📑
            </span>
          ) : isSelected ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ) : null}
        </div>

        {/* Grade Info */}
        <div>
          <h3 className={`font-bold text-xs sm:text-sm leading-tight ${
            isSelected 
              ? isIntermediateSection ? 'text-indigo-950 font-black' : 'text-emerald-950 font-black'
              : 'text-slate-800'
          }`}>
            {grade.name}
          </h3>
          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
            {isIntermediateSection ? 'القسم المتوسط • لغتي الخالدة' : grade.subtitle}
          </p>
        </div>

        {/* Units Count Footer */}
        <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-medium">
          <span>{grade.units.length} وحدات</span>
          <span className={`flex items-center gap-0.5 font-bold ${
            isSelected 
              ? isIntermediateSection ? 'text-indigo-700' : 'text-emerald-700'
              : 'text-slate-400 group-hover:text-emerald-600'
          }`}>
            <span>دخول</span>
            <ChevronLeft className="w-2.5 h-2.5" />
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Banner Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                منهاج وزارة التعليم السعودية
              </span>
              <span className="text-xs text-slate-500 font-medium">
                القسم الابتدائي • القسم المتوسط • التأسيس والروضة
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-alexandria">
              منهاج مقرر لُغَتِي التعليمي الشامل
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              اختر الصف الدراسي للوصول إلى الوحدات المعتمدة، نصوص القراءة والاستماع، الظواهر الصوتية والإملائية، وبنك التمارين التفاعلية ومذكرات المتوسطة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">تمارين مكتملة</p>
                <p className="text-lg font-bold text-slate-900">{completedQuizzesCount} تدريب منجز</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 pl-1 shrink-0">الأقسام التعليمية:</span>
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              stageFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            جميع المراحل والصفوف
          </button>
          <button
            onClick={() => setStageFilter('primary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              stageFilter === 'primary'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
            }`}
          >
            القسم الابتدائي (١ - ٦)
          </button>
          <button
            onClick={() => setStageFilter('intermediate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              stageFilter === 'intermediate'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
            }`}
          >
            <span>📑</span>
            <span>القسم المتوسط (مذكرات المتوسطة)</span>
          </button>
          <button
            onClick={() => setStageFilter('early')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              stageFilter === 'early'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
            }`}
          >
            روضة لغتي والتأسيس (KG)
          </button>

          {onOpenSpellingChampions && (
            <button
              id="grade-selector-spelling-champions-btn"
              onClick={onOpenSpellingChampions}
              className="px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-xs border border-amber-300 active:scale-95"
              title="الانتقال إلى مختبر أبطال الإملاء التفاعلي (ضعيفة • متوسطة • متميزة)"
            >
              <span>📝</span>
              <span>أبطال الإملاء التفاعلي</span>
              <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">جديد 🔥</span>
            </button>
          )}
        </div>

        {/* Section 1: Intermediate Section (القسم المتوسط - مذكرات المتوسطة) */}
        {(stageFilter === 'all' || stageFilter === 'intermediate') && (
          <div className="bg-gradient-to-r from-indigo-950/5 via-purple-900/5 to-slate-100 p-4 sm:p-5 rounded-3xl border border-indigo-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  📑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black font-alexandria text-indigo-950">
                      القسم المتوسط — مذكرات المتوسطة
                    </h2>
                    <span className="text-[10px] bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded-full font-black">
                      مناهج لغتي الخالدة
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    وحدات ومقررات الصفوف المتوسطة + مذكرات وملخصات الاختبار المركزي الشاملة (م١ وم٢ وم٣)
                  </p>
                </div>
              </div>

              {onOpenSummaries && (
                <button
                  id="grade-selector-open-summaries-btn"
                  onClick={onOpenSummaries}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>دخول مذكرات المتوسطة (م١ وم٢ وم٣)</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Intermediate Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {intermediateGrades.map(gId => renderGradeCard(gId, true))}

              {/* Dedicated "مذكرات المتوسطة" Quick Access Card */}
              {onOpenSummaries && (
                <button
                  id="grade-card-btn-intermediate-summaries"
                  onClick={onOpenSummaries}
                  className="p-3 sm:p-3.5 rounded-2xl text-right transition-all duration-200 border-2 border-dashed border-indigo-300 bg-white hover:bg-indigo-50/70 hover:border-indigo-500 flex flex-col justify-between cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-xs">
                      ⭐
                    </div>
                    <span className="text-[9px] font-black bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded-md">
                      م١ وم٢ وم٣
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-indigo-950 leading-tight group-hover:text-indigo-700 transition-colors">
                      مذكرات المتوسطة
                    </h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      قواعد النحو، الإملاء، ونماذج الاختبار المركزي
                    </p>
                  </div>
                  <div className="mt-2.5 pt-1.5 border-t border-indigo-100 flex items-center justify-between text-[9px] text-indigo-700 font-bold">
                    <span>نماذج قابلة للطباعة</span>
                    <span className="flex items-center gap-0.5">
                      <span>عرض المذكرات</span>
                      <ChevronLeft className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Primary Section (القسم الابتدائي) */}
        {(stageFilter === 'all' || stageFilter === 'primary') && (
          <div className="space-y-2">
            {stageFilter === 'all' && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-black text-slate-700">القسم الابتدائي (الصفوف ١ - ٦):</span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {primaryGrades.map(gId => renderGradeCard(gId, false))}
            </div>
          </div>
        )}

        {/* Section 3: Early Childhood & Foundation Section (قسم الروضة والتأسيس) */}
        {(stageFilter === 'all' || stageFilter === 'early') && (
          <div className="space-y-2">
            {stageFilter === 'all' && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-black text-slate-700">قسم الروضة والتأسيس:</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {earlyGrades.map(gId => renderGradeCard(gId, false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
