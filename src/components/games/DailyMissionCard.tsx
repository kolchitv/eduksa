import React from 'react';
import { Sparkles, Star, CheckCircle2, ArrowRight, Play, Trophy, Flame } from 'lucide-react';
import { DailyMissionActivity } from '../../utils/adaptiveGameEngine';
import { audioManager } from '../../utils/audio';

interface DailyMissionCardProps {
  mission: {
    date: string;
    completed: boolean;
    activities: DailyMissionActivity[];
  };
  onStartActivity: (activity: DailyMissionActivity) => void;
  onRefreshMission?: () => void;
}

export const DailyMissionCard: React.FC<DailyMissionCardProps> = ({
  mission,
  onStartActivity
}) => {
  const completedCount = mission.activities.filter((a) => a.completed).length;
  const isAllDone = completedCount === mission.activities.length;

  const handleHearMission = () => {
    audioManager.speakArabic(
      `مهمتك اليوم يا بطل: لديك ثلاثة أنشطة سريعة ممتعة. أكملها واجمع ثلاث نجوم ذهبية!`,
      0.9
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 p-6 sm:p-7 text-white shadow-xl border-2 border-amber-300 animate-in fade-in duration-300">
      {/* Background soft patterns */}
      <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-slate-900 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>مهمتي اليوم ⭐</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/20">
              {completedCount} من {mission.activities.length} مكتمل
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-alexandria tracking-tight">
            {isAllDone ? '🎉 أحسنت صنعاً! أنهيت مهمة اليوم بنجاح!' : 'رحلتك اليومية للتميز والإتقان ✨'}
          </h2>

          <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed">
            {isAllDone
              ? 'حصلت على مكافأة اليوم (⭐⭐⭐). يمكنك الآن المتابعة في أي مسار تحبه!'
              : 'اقترح لك النظام الذكي ٣ أنشطة قصيرة وممتعة تناسب مستواك تماماً. ابدأ الآن واكسب النجوم!'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={handleHearMission}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer border border-white/30 shadow-xs"
            title="استمع للتعليمات"
          >
            🔊 استمع
          </button>

          {!isAllDone && (
            <button
              onClick={() => {
                const nextAct = mission.activities.find((a) => !a.completed) || mission.activities[0];
                onStartActivity(nextAct);
              }}
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:bg-amber-50 hover:scale-102 active:scale-98 transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>ابدأ المهمة الآن</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Activities Checklist Cards */}
      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mission.activities.map((act, index) => {
          return (
            <div
              key={act.id}
              onClick={() => onStartActivity(act)}
              className={`p-4 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                act.completed
                  ? 'bg-white/30 backdrop-blur-md border-white/40 shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 border-white/20 hover:border-white/40 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{act.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black opacity-80">نشاط {index + 1}</span>
                    {act.completed && (
                      <span className="text-[10px] font-black text-emerald-950 bg-emerald-300 px-1.5 py-0.2 rounded-md">
                        مكتمل ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-black font-alexandria line-clamp-1">
                    {act.title}
                  </h4>
                  <p className="text-[10px] text-amber-100 font-medium line-clamp-1">
                    {act.reason}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {act.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-900 fill-emerald-300" />
                ) : (
                  <span className="w-7 h-7 rounded-xl bg-white text-slate-900 flex items-center justify-center text-xs font-black shadow-xs">
                    ▶
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
