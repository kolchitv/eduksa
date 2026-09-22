import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';
import { GRADE1_SUPPORT_DRIVE_URL } from '../data/grade1SupportPlansData';

interface GradeSelectorProps {
  selectedGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  completedQuizzesCount: number;
  onOpenSupportPlans?: () => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
  completedQuizzesCount,
  onOpenSupportPlans
}) => {
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
                تعلّم تفاعلي • صوتي • ذكي
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-alexandria">
              منهاج مقرر لُغَتِي الجَمِيلَة
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              اختر الصف الدراسي للوصول إلى الوحدات المعتمدة، نصوص القراءة والاستماع، الظواهر الصوتية والإملائية، وبنك التمارين التفاعلية.
            </p>
          </div>

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

        {/* Highlighted Callout for Grade 1 Support Plans & Google Drive */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white border border-rose-500/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  مجلد Google Drive المعتمد
                </span>
                <span className="text-xs text-rose-200 font-bold">
                  الصف الأول الابتدائي
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black font-alexandria text-white">
                خطط الدعم الشاملة وعلاج الفاقد التعليمي ومذكرات الحروف الهجائية
              </h3>
              <p className="text-xs text-slate-300">
                تشمل كراسات الحروف، تدريبات المقطع الساكن، الكلمات البصرية، وسجلات رصد المهارات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            {onOpenSupportPlans && (
              <button
                id="grade-selector-open-support-plans-btn"
                onClick={onOpenSupportPlans}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>تصفح الخطط بالموقع</span>
              </button>
            )}

            <a
              id="grade-selector-open-drive-btn"
              href={GRADE1_SUPPORT_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4 text-slate-950" />
              <span>تحميل من Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Grade Cards Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {Object.values(GRADES_DATA).map((grade) => {
            const isSelected = selectedGrade === grade.id;
            return (
              <button
                key={grade.id}
                id={`grade-card-btn-${grade.id}`}
                onClick={() => onSelectGrade(grade.id)}
                className={`group relative p-3 rounded-2xl text-right transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}
                  >
                    {grade.id === 'kg1' ? (
                      <span>🌱</span>
                    ) : grade.id === 'kg2' ? (
                      <span>🌿</span>
                    ) : grade.id === 'foundation' ? (
                      <Sparkles className="w-3.5 h-3.5" />
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
                  ) : isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ) : null}
                </div>

                {/* Grade Info */}
                <div>
                  <h3 className={`font-bold text-xs sm:text-sm leading-tight ${
                    isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-800'
                  }`}>
                    {grade.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {grade.subtitle}
                  </p>
                </div>

                {/* Units Count Footer */}
                <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-medium">
                  <span>{grade.units.length} وحدات</span>
                  <span className={`flex items-center gap-0.5 font-bold ${
                    isSelected ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}>
                    <span>دخول</span>
                    <ChevronLeft className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
