import React from 'react';
import { 
  Award, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  Trophy,
  Printer
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';

interface StudentAchievementsProps {
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  stars: number;
  completedQuizzes: string[];
  currentGrade: GradeId;
  onOpenCertificate: () => void;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  studentName,
  onUpdateStudentName,
  stars,
  completedQuizzes,
  currentGrade,
  onOpenCertificate
}) => {
  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;

  const badges = [
    {
      id: 'badge_letters',
      title: 'فارس الحروف والهجاء',
      desc: 'إتقان نطق وتمييز الحروف الهجائية بالحركات',
      icon: '🔤',
      unlocked: stars >= 10,
    },
    {
      id: 'badge_sun_moon',
      title: 'بطل اللامين',
      desc: 'التفريق بين اللام الشمسية واللام القمرية',
      icon: '☀️',
      unlocked: stars >= 20,
    },
    {
      id: 'badge_spelling',
      title: 'خبير الظواهر الإملائية',
      desc: 'إتقان همزات الوصل والقطع والتاء المربوطة',
      icon: '✍️',
      unlocked: stars >= 40,
    },
    {
      id: 'badge_grammar',
      title: 'مُهندس الإعراب والنحو',
      desc: 'إعراب الجمل الاسمية والفعلية بدقة',
      icon: '⚖️',
      unlocked: stars >= 60,
    },
    {
      id: 'badge_master',
      title: 'سفير لغتي الجميلة',
      desc: 'الحصول على أكثر من ١٠٠ نجمة تميز',
      icon: '👑',
      unlocked: stars >= 100,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-3xl shadow-lg">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  لوحة بطل لغتي
                </span>
                <span className="text-xs text-emerald-200">{currentGradeData.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-alexandria">
                {studentName || 'البطل المتميز'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-emerald-200 block">رصيد النجوم</span>
              <span className="text-2xl font-extrabold text-amber-300">{stars} ★</span>
            </div>

            <button
              onClick={onOpenCertificate}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>استخراج شهادتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">أوسمة وميداليات الإتقان</h3>
            <p className="text-xs text-slate-500">احصل على النجوم من خلال حل التمارين لفتح جميع الأوسمة</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {badges.filter((b) => b.unlocked).length} من {badges.length} مفتوحة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50/50 to-emerald-50/30 border-amber-300 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{badge.title}</h4>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">مغلق</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
