import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Heart, 
  BookOpen, 
  Volume2, 
  Star, 
  Layers, 
  ChevronLeft, 
  CheckCircle2, 
  Award, 
  Play, 
  CircleDot,
  PenTool
} from 'lucide-react';
import { Grade1Unit1LetterMActivity } from './Grade1Unit1LetterMActivity';
import { Grade1Unit1Activity2 } from './Grade1Unit1Activity2';
import { FamilyHotspotReader } from './FamilyHotspotReader';
import { LetterPhoneticsActivity } from './LetterPhoneticsActivity';
import { audioManager } from '../utils/audio';

export type Unit1ActivityId = 'hub' | 'activity1' | 'activity2' | 'hotspot' | 'phonetics';

interface Grade1Unit1ActivitiesHubProps {
  initialActivity?: Unit1ActivityId;
  onSwitchToLesson?: (lessonId?: string) => void;
}

export const Grade1Unit1ActivitiesHub: React.FC<Grade1Unit1ActivitiesHubProps> = ({
  initialActivity = 'hub',
  onSwitchToLesson
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Unit1ActivityId>(initialActivity);

  const activitiesList = [
    {
      id: 'activity1' as const,
      number: '١',
      title: 'نَشَاطُ ص ٤٢: أَصِلُ الصُّوَرَ بِحَرْفِ (م)',
      badge: 'النشاط الأول • ص ٤٢',
      themeColor: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Target,
      iconEmoji: '🎯',
      description: 'توصيل الحرف (م) في الوسط بالصور الستة: مطعم، مريم، معجون، قلم، سمكة، ملعقة، مع تمييز مواضع الصوت والتصفيق الإيقاعي.',
      skills: ['التمييز السمعي', 'الربط البصري', 'مواضع الحرف'],
      estimatedTime: '٣ دقائق'
    },
    {
      id: 'activity2' as const,
      number: '٢',
      title: 'نَشَاطُ ٢: مَوَاقِعُ الحَرْفِ وَالْمُدُودُ وَالكِتَابَةُ',
      badge: 'النشاط الثاني • إنجازاتي',
      themeColor: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Star,
      iconEmoji: '⭐',
      description: 'رسم دائرة حول حرف الميم في الكلمات، تحديد موضعه وحركته، التمييز بين الصوت القصير والطويل (المدود)، وسبورة الكتابة التفاعلية.',
      skills: ['رسم الدائرة', 'الحركات والمدود', 'الكتابة على السطر'],
      estimatedTime: '٤ دقائق'
    },
    {
      id: 'hotspot' as const,
      number: '٣',
      title: 'نَشَاطُ أفراد الأسرة التفاعلي (HOTSPOT)',
      badge: 'لوحة تفاعلية • ص ١٩',
      themeColor: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: Heart,
      iconEmoji: '👨‍👩‍👧‍👦',
      description: 'أستمع وأنطق: دوائر Hotspot الذكية لنطق أسماء الأقارب (أبي سعد، أمي مريم، أخي ياسر، أختي نورة، جدي، جدتي...) بنطق عربي سليم.',
      skills: ['نطق الأقارب', 'المذكر والمؤنث', 'الاستماع النشط'],
      estimatedTime: '٣ دقائق'
    },
    {
      id: 'phonetics' as const,
      number: '٤',
      title: 'مُخْتَبَرُ قِرَاءَةِ الحُرُوفِ بِالحَرَكَاتِ وَالْمَدِّ',
      badge: 'المكون ٤ و ٥ • أصوات الحروف',
      themeColor: 'from-indigo-600 to-violet-700',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: Sparkles,
      iconEmoji: '🔤',
      description: 'تدريب صوتي تفاعلي لحروف الوحدة الأولى (م، ب، ل، د، ن، ر) مع الفتحة والضمة والكسرة وحروف المد بالألف والواو والياء.',
      skills: ['الأصوات القصيرة', 'المدود الطويلة', 'تجريد الحرف'],
      estimatedTime: '٥ دقائق'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Activities Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-lg border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                🎯 قِسْمُ الأَنْشِطَةِ التَّفَاعُلِيَّةِ
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/20">
                الوحدة الأولى: أُسْرَتِي • ٤ أَنْشِطَةٍ مُعْتَمَدَةٍ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
              مَرْكَزُ أَنْشِطَةِ الوَحْدَةِ الأُولَى (أُسْرَتِي)
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl">
              جَمِيعُ أَنْشِطَةِ كِتَابِ لُغَتِي المَعْتَمَدَةِ لِلصَّفِّ الأَوَّلِ الابْتِدَائِيِّ مُجَمَّعَةٌ هُنَا فِي قِسْمٍ وَاحِدٍ لِتَسْهِيلِ التَّدْرِيبِ وَالمُمَارَسَةِ.
            </p>
          </div>

          {/* Quick Audio Instruction */}
          <div className="flex items-center gap-2 shrink-0">
            {onSwitchToLesson && (
              <button
                onClick={() => onSwitchToLesson()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>العودة للدروس والنصوص</span>
              </button>
            )}
            <button
              onClick={() => {
                audioManager.speakArabic('مرحباً بك في قسم الأنشطة التفاعلية للوحدة الأولى أسرتي. اختر أي نشاط للبدء بالتطبيق!');
              }}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/30"
              title="الاستماع للمقدمة"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Activities Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setSelectedActivity('hub');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              selectedActivity === 'hub'
                ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>جَمِيعُ الأَنْشِطَةِ (نَظْرَةٌ عَامَّةٌ)</span>
          </button>

          <button
            onClick={() => {
              setSelectedActivity('activity1');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              selectedActivity === 'activity1'
                ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>نَشَاطُ ١: أَصِلُ الصُّوَرَ (ص ٤٢) 🎯</span>
          </button>

          <button
            onClick={() => {
              setSelectedActivity('activity2');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              selectedActivity === 'activity2'
                ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>نَشَاطُ ٢: مَوَاقِعُ الحَرْفِ وَالْمُدُودُ ⭐</span>
          </button>

          <button
            onClick={() => {
              setSelectedActivity('hotspot');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              selectedActivity === 'hotspot'
                ? 'bg-rose-500 text-white font-black ring-2 ring-rose-300'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>نَشَاطُ أفرادِ الأُسْرَةِ (ص ١٩) 👨‍👩‍👧‍👦</span>
          </button>

          <button
            onClick={() => {
              setSelectedActivity('phonetics');
              audioManager.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              selectedActivity === 'phonetics'
                ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-300'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مُخْتَبَرُ الحُرُوفِ بِالحَرَكَاتِ 🔤</span>
          </button>
        </div>
      </div>

      {/* Main Container Switcher */}
      {selectedActivity === 'hub' ? (
        <div className="space-y-6">
          {/* Overview Grid with 4 Interactive Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activitiesList.map((act) => {
              const IconComp = act.icon;
              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${act.badgeBg}`}>
                        {act.badge}
                      </span>
                      <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
                        ⏱️ {act.estimatedTime}
                      </span>
                    </div>

                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                        {act.iconEmoji}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors font-alexandria">
                          {act.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap my-3">
                      {act.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      مُطَابِقٌ لِكِتَابِ لُغَتِي
                    </span>

                    <button
                      onClick={() => {
                        setSelectedActivity(act.id);
                        audioManager.play('click');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm group-hover:bg-emerald-600"
                    >
                      <span>بَدْءُ النَّشَاطِ الآنَ</span>
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Highlights for Unit 1 Activities */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-xs">
                ⭐
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-950 font-alexandria">
                  أَهْدَافُ أَنْشِطَةِ الوَحْدَةِ الأُولَى فِي المِنْهَاجِ السُّعُودِيِّ
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 max-w-2xl">
                  تَرْكِيزٌ عَلَى المَهَارَاتِ الأَسَاسِيَّةِ لِحُرُوفِ الوَحْدَةِ (م، ب، ل، د، ن، ر): التَّمْيِيزُ السَّمْعِيُّ، رَسْمُ الدَّائِرَةِ حَوْلَ الحَرْفِ، تَمْيِيزُ مَوْقِعِهِ، وَالتَّفْرِيقُ الدَّقِيقُ بَيْنَ الحَرَكَاتِ القَصِيرَةِ وَالمُدُودِ.
                </p>
              </div>
            </div>

            <button
              onClick={() => audioManager.speakArabic('أهداف أنشطة الوحدة الأولى: التمييز السمعي، رسم الدائرة حول الحرف، تمييز موضعه، والتفريق الدقيق بين الحركات القصيرة والمدود الطويلة.')}
              className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>الاستماع للأهداف</span>
            </button>
          </div>
        </div>
      ) : selectedActivity === 'activity1' ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedActivity('hub')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>العودة لجميع أنشطة الوحدة الأولى</span>
            </button>

            <button
              onClick={() => setSelectedActivity('activity2')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
            >
              <span>الانتقال إلى النشاط ٢</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <Grade1Unit1LetterMActivity />
        </div>
      ) : selectedActivity === 'activity2' ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedActivity('hub')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>العودة لجميع أنشطة الوحدة الأولى</span>
            </button>

            <button
              onClick={() => setSelectedActivity('activity1')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
            >
              <span>العودة لنشاط ١ (ص ٤٢)</span>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <Grade1Unit1Activity2 
            onBackToActivitiesHub={() => setSelectedActivity('hub')}
            onOpenActivity1={() => setSelectedActivity('activity1')}
          />
        </div>
      ) : selectedActivity === 'hotspot' ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedActivity('hub')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>العودة لجميع أنشطة الوحدة الأولى</span>
            </button>
          </div>
          <FamilyHotspotReader />
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedActivity('hub')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>العودة لجميع أنشطة الوحدة الأولى</span>
            </button>
          </div>
          <LetterPhoneticsActivity 
            initialLetter="م" 
            onOpenPage42Activity={() => setSelectedActivity('activity1')} 
          />
        </div>
      )}
    </div>
  );
};
