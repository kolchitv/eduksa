import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Play, 
  BookOpen, 
  RotateCcw,
  Check,
  Award
} from 'lucide-react';
import { audioManager } from '../utils/audio';

export const Grade1Unit1LetterDStudio: React.FC = () => {
  const [activePronoun, setActivePronoun] = useState<'anta' | 'anti'>('anta');
  const [selectedCircles, setSelectedCircles] = useState<Record<string, boolean>>({});
  const [activeVoice, setActiveVoice] = useState<string | null>(null);

  const wordsWithD = [
    { id: 'w1', word: 'دَرَجٌ', charWithDiacritic: 'دَ', position: 'في أول الكلمة (مفتوح)' },
    { id: 'w2', word: 'أَسَدٌ', charWithDiacritic: 'ـدٌ', position: 'في آخر الكلمة متصل (تنوين ضم)' },
    { id: 'w3', word: 'مَدِينَةٌ', charWithDiacritic: 'ـدِ', position: 'في وسط الكلمة (مكسور)' },
    { id: 'w4', word: 'نَادِرٌ', charWithDiacritic: 'دِ', position: 'في وسط الكلمة (مكسور)' }
  ];

  const handleToggleCircle = (id: string, word: string) => {
    setSelectedCircles(prev => ({ ...prev, [id]: !prev[id] }));
    audioManager.speakArabic(word, 0.75);
  };

  const handleSpeak = (text: string, voiceKey: string) => {
    setActiveVoice(voiceKey);
    audioManager.speakArabic(text, 0.8);
    setTimeout(() => setActiveVoice(null), 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 text-white shadow-xl border border-amber-400/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950 text-amber-300 shadow-xs">
                الدرس الرابع • لغتي الصف الأول
              </span>
              <span className="text-xs text-amber-100 font-bold">
                إعداد: أ. ميعاد الشريف & منهاج وزارة التعليم
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
              مَعْمَلُ حَرْفِ الدَّالِ (د) الشَّامِلُ
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
              مخرج الحرف، تجريد الأصوات، محاكاة الضميرين (أَنْتَ / أَنْتِ)، رسم الدائرة، وقصة الأصدقاء الثلاثة الإثرائية.
            </p>
          </div>

          <button
            onClick={() => audioManager.speakArabic('الدرس الرابع: حرف الدال. أتعلم نطق حرف الدال، والأصوات القصيرة والطويلة، والضميرين أنتَ وأنتِ.')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-amber-200" />
            <span>استمع للمقدمة</span>
          </button>
        </div>
      </div>

      {/* Section 1: مخرج حرف الدال ونطقه السليم */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg">
            ١
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base font-alexandria">
              مَخْرَجُ حَرْفِ الدَّالِ (د) وَطَرِيقَةُ نُطْقِهِ
            </h3>
            <p className="text-xs text-slate-500">
              توجيهات صوتية دقيقة للطفل والمعلم وولي الأمر
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <span>🎯</span>
              <span>أين يخرج حرف الدال؟</span>
            </h4>
            <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
              يَخْرُجُ حَرْفُ الدَّالِ مِنْ مَنْطِقَةِ اللِّثَةِ الأَمَامِيَّةِ، وَبِالتَّحْدِيدِ بَيْنَ طَرَفِ اللِّسَانِ وَأُصُولِ الثَّنَايَا العُلْيَا (اللِّثَةِ العُلْيَا).
            </p>
            <button
              onClick={() => audioManager.speakArabic('مخرج حرف الدال: يخرج في منطقة اللثة الأمامية، وبالتحديد بين مقدم اللسان واللثة العليا.')}
              className="mt-2 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استمع لشرح المخرج</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-black text-slate-700 block mb-1">
              صَوْتُ الدَّالِ بِالحَرَكَاتِ الأَرْبَعِ:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'دَ (فتحة)', sound: 'دَ' },
                { label: 'دُ (ضمة)', sound: 'دُ' },
                { label: 'دِ (كسرة)', sound: 'دِ' },
                { label: 'دْ (سكون)', sound: 'دْ' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSpeak(item.sound, `v_${idx}`)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeVoice === `v_${idx}`
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-200'
                  }`}
                >
                  <span className="text-2xl font-black font-serif block">{item.sound}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: تجريد الحرف والأصوات القصيرة والطويلة */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center font-black text-lg">
            ٢
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base font-alexandria">
              تَجْرِيدُ حَرْفِ الدَّالِ وَالأَصْوَاتُ القَصِيرَةُ وَالطَّوِيلَةُ
            </h3>
            <p className="text-xs text-slate-500">
              أقرأ الكلمات، أجرد الحرف بحركته، وأميز بين الصوت القصير والطويل
            </p>
          </div>
        </div>

        {/* 3 Main Target Words */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { word: 'دَرَّاجَةٌ', letterVowel: 'دَ', type: 'فتحة قصيرة', long: 'دَا (مد ألف)', emoji: '🚲' },
            { word: 'دُمْيَةٌ', letterVowel: 'دُ', type: 'ضمة قصيرة', long: 'دُو (مد واو)', emoji: '🪆' },
            { word: 'حَدِيقَةٌ', letterVowel: 'دِ', type: 'كسرة قصيرة', long: 'دِي (مد ياء)', emoji: '🌳' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-center space-y-3">
              <span className="text-3xl block">{item.emoji}</span>
              <span className="text-2xl font-black font-serif text-slate-950 block">
                {item.word}
              </span>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => handleSpeak(item.letterVowel, `short_${idx}`)}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm"
                >
                  <span className="block text-xl font-serif">{item.letterVowel}</span>
                  <span className="text-[10px] text-amber-800 font-sans block">{item.type}</span>
                </button>

                <button
                  onClick={() => handleSpeak(item.long.split(' ')[0], `long_${idx}`)}
                  className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-black text-sm"
                >
                  <span className="block text-xl font-serif">{item.long.split(' ')[0]}</span>
                  <span className="text-[10px] text-indigo-800 font-sans block">{item.long}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: محاكاة الضميرين (أَنْتَ / أَنْتِ) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-black text-lg">
              ٣
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base font-alexandria">
                أُحَاكِي بِاسْتِخْدَامِ الضَّمِيرَيْنِ: (أَنْتَ ، أَنْتِ)
              </h3>
              <p className="text-xs text-slate-500">
                التفريق بين ضمير المخاطب المذكر (أَنْتَ) والمخاطبة المؤنثة (أَنْتِ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePronoun('anta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activePronoun === 'anta'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              👦 أَنْتَ (للمذكر)
            </button>
            <button
              onClick={() => setActivePronoun('anti')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activePronoun === 'anti'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              👧 أَنْتِ (للمؤنث)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activePronoun === 'anta' ? (
            <>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900">المثال الأول:</span>
                  <button
                    onClick={() => audioManager.speakArabic('أَنْتَ وَلَدٌ نَظِيفٌ', 0.8)}
                    className="p-1 rounded-lg text-blue-700 hover:bg-blue-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-black font-serif text-blue-950">
                  «أَنْتَ وَلَدٌ نَظِيفٌ»
                </p>
                <p className="text-xs text-blue-700">
                  أَنْتَ: بفتح التاء للمذكر المفرد
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900">المثال الثاني:</span>
                  <button
                    onClick={() => audioManager.speakArabic('أَنْتَ صَدِيقٌ مُخْلِصٌ', 0.8)}
                    className="p-1 rounded-lg text-blue-700 hover:bg-blue-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-black font-serif text-blue-950">
                  «أَنْتَ صَدِيقٌ مُخْلِصٌ»
                </p>
                <p className="text-xs text-blue-700">
                  «أَنْتَ وَلَدٌ مُجْتَهِدٌ»
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-900">المثال الأول:</span>
                  <button
                    onClick={() => audioManager.speakArabic('أَنْتِ بِنْتٌ نَظِيفَةٌ', 0.8)}
                    className="p-1 rounded-lg text-pink-700 hover:bg-pink-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-black font-serif text-pink-950">
                  «أَنْتِ بِنْتٌ نَظِيفَةٌ»
                </p>
                <p className="text-xs text-pink-700">
                  أَنْتِ: بكسر التاء دون ياء للمؤنثة المفردة
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-900">المثال الثاني:</span>
                  <button
                    onClick={() => audioManager.speakArabic('أَنْتِ بِنْتٌ مُهَذَّبَةٌ', 0.8)}
                    className="p-1 rounded-lg text-pink-700 hover:bg-pink-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-black font-serif text-pink-950">
                  «أَنْتِ بِنْتٌ مُهَذَّبَةٌ»
                </p>
                <p className="text-xs text-pink-700">
                  تنبيه: لا نكتب ياء في آخر (أنتِ) بل كسرة فقط!
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 4: أَرْسُمُ دَائِرَةً حَوْلَ الحَرْفِ (د) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-lg">
            ٤
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base font-alexandria">
              أَرْسُمُ دَائِرَةً حَوْلَ الحَرْفِ (د) ثُمَّ أَكْتُبُهُ بِحَرَكَتِهِ
            </h3>
            <p className="text-xs text-slate-500">
              انقر على الكلمة لتحديد موضع الدال والاستماع لنطقها
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {wordsWithD.map((item) => {
            const isSelected = !!selectedCircles[item.id];
            return (
              <div
                key={item.id}
                onClick={() => handleToggleCircle(item.id, item.word)}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span className="text-2xl font-black font-serif text-slate-900 block mb-1">
                  {item.word}
                </span>

                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-amber-400 font-black text-xl text-amber-900 font-serif my-1 bg-white">
                  {item.charWithDiacritic}
                </div>

                <span className="text-[10px] text-slate-500 block">
                  {item.position}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: النص الإثرائي (الأَصْدِقَاءُ الثَّلَاثَة) */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
              📖
            </span>
            <div>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                النَّصُّ الإِثْرَائِيُّ • لِحَرْفِ الدَّالِ
              </span>
              <h3 className="text-base sm:text-lg font-black font-alexandria text-white">
                الأَصْدِقَاءُ الثَّلَاثَةُ (الأَرْنَبُ وَالقِرْدُ وَالغُرَابُ)
              </h3>
            </div>
          </div>

          <button
            onClick={() => audioManager.speakArabic('اجْتَمَعَ الأَصْدِقَاءُ الثَّلَاثَةُ؛ الأَرْنَبُ وَالقِرْدُ وَالغُرَابُ بِالقُرْبِ مِنْ شَجَرَةٍ كَبِيرَةٍ يَمْرَحُونَ وَيَلْعَبُونَ، وَفَجْأَةً هَجَمَ الأَسَدُ عَلَيْهِمْ لِيَصْطَادَ فَرِيسَتَهُ، وَبِتَعَاوُنِ الأَصْدِقَاءِ اسْتَطَاعُوا الفِرَارَ مِنْهُ.')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>الاستماع للقصة كاملة 🔊</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 leading-relaxed text-sm sm:text-base font-serif space-y-3">
          <p className="leading-loose text-emerald-100">
            «اجْتَمَعَ الأَصْدِقَاءُ الثَّلَاثَةُ؛ <strong className="text-amber-300">الأَرْنَبُ وَالقِرْدُ وَالغُرَابُ</strong> بِالقُرْبِ مِنْ شَجَرَةٍ كَبِيرَةٍ يَمْرَحُونَ وَيَلْعَبُونَ، وَفَجْأَةً هَجَمَ <strong className="text-rose-300">الأَسَدُ</strong> عَلَيْهِمْ لِيَصْطَادَ فَرِيسَتَهُ، وَبِتَعَاوُنِ الأَصْدِقَاءِ اسْتَطَاعُوا الفِرَارَ مِنْهُ.»
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>العبرة التربوية: في الاتحاد والتعاون قوة تنجي من الشدائد والأخطار.</span>
        </div>
      </div>
    </div>
  );
};
