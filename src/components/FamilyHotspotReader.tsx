import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Trophy, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Pin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';

export interface FamilyMemberWord {
  id: string;
  word: string;
  diacritics: string;
  relation: string;
  example: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  pinColor: string;
  description: string;
  role: string;
}

export const FAMILY_WORDS: FamilyMemberWord[] = [
  {
    id: 'father',
    word: 'أَبِي',
    diacritics: 'أَ - بِـ - ي',
    relation: 'الوالد الحبيب (سعد)',
    example: 'قَالَ فَوَّازٌ: أَبِي سَعْدٌ رَاعِي الأُسْرَةِ',
    bgColor: '#e0f2fe', // sky blue
    borderColor: '#7dd3fc',
    textColor: '#0369a1',
    pinColor: '#334155',
    description: 'أبي هو رب الأسرة وسندنا، يعلمنا الأخلاق الحميدة ويحرص على سلامتنا.',
    role: 'الأب'
  },
  {
    id: 'mother',
    word: 'أُمِّي',
    diacritics: 'أُ - مِّـ - ي',
    relation: 'الوالدة الكريمة (مريم)',
    example: 'أُمِّي مَرْيَمُ نَبْعُ الحَنَانِ وَالْعَطَاءِ',
    bgColor: '#fef9c3', // soft lemon
    borderColor: '#fde047',
    textColor: '#854d0e',
    pinColor: '#334155',
    description: 'أمي هي رمز المحبة والرحمة، ترعى شؤون المنزل وتعلمنا القراءة والكتابة.',
    role: 'الأم'
  },
  {
    id: 'brother',
    word: 'أَخِي',
    diacritics: 'أَ - خِـ - ي',
    relation: 'الأخ الصغير (ياسر)',
    example: 'هَذَا أَخِي يَاسِرٌ يَلْعَبُ بِالْكُرَةِ',
    bgColor: '#ffedd5', // soft orange / peach
    borderColor: '#fdba74',
    textColor: '#9a3412',
    pinColor: '#334155',
    description: 'أخي ياسر هو صديقي في اللعب، نتعاون معاً ونحافظ على ألعابنا.',
    role: 'الأخ'
  },
  {
    id: 'sister',
    word: 'أُخْتِي',
    diacritics: 'أُ - خْـ - تِـ - ي',
    relation: 'الأخت المجتهدة (نورة)',
    example: 'هَذِهِ أُخْتِي نُورَةُ تُرَتِّبُ الكُتُبَ فِي المَكْتَبَةِ',
    bgColor: '#fce7f3', // soft pink
    borderColor: '#f9a8d4',
    textColor: '#9d174d',
    pinColor: '#334155',
    description: 'أختي نورة تلميذة منظمة ومجتهدة تحب القراءة ومساعدة الآخرين.',
    role: 'الأخت'
  },
  {
    id: 'grandfather',
    word: 'جَدِّي',
    diacritics: 'جَ - دِّ - ي',
    relation: 'الجد الحكيم (مشعل)',
    example: 'جَدِّي مِشْعَلٌ قُدْوَتُنَا وَبَرَكَةُ مَنْزِلِنَا',
    bgColor: '#f1f5f9', // silver grey
    borderColor: '#cbd5e1',
    textColor: '#334155',
    pinColor: '#334155',
    description: 'جدي يروي لنا الحكايات الجميلة ويعلمنا صلة الرحم وتوقير الكبار.',
    role: 'الجد'
  },
  {
    id: 'grandmother',
    word: 'جَدَّتِي',
    diacritics: 'جَ - دَّ - تِـ - ي',
    relation: 'الجدة الفاضلة (فاطمة)',
    example: 'جَدَّتِي جَدَّتِي حُلْوَةُ البَسْمَةِ فِي رِيَاضِ الحَنَانِ',
    bgColor: '#ede9fe', // lavender / purple
    borderColor: '#c4b5fd',
    textColor: '#5b21b6',
    pinColor: '#334155',
    description: 'جدتي فاطمة تمتاز بالبسمة الطيبة والدعاء الصالح وتجمع شمل الأسرة.',
    role: 'الجدة'
  },
  {
    id: 'paternal_uncle',
    word: 'عَمِّي',
    diacritics: 'عَ - مِّ - ي',
    relation: 'أخو أبي',
    example: 'عَمِّي أَخُو أَبِي، نَزُورُهُ وَنَصِلُ رَحِمَهُ',
    bgColor: '#fef08a', // pale yellow
    borderColor: '#facc15',
    textColor: '#713f12',
    pinColor: '#334155',
    description: 'العم هو أخو الأب من ذوي القربى والمحبة، نبر به ونتواصل معه في المناسبات.',
    role: 'العم'
  },
  {
    id: 'paternal_aunt',
    word: 'عَمَّتِي',
    diacritics: 'عَ - مَّ - تِـ - ي',
    relation: 'أخت أبي',
    example: 'عَمَّتِي أُخْتُ أَبِي، تُشَارِكُنَا الأَفْرَاحَ وَالمُنَاسَبَاتِ',
    bgColor: '#ccfbf1', // soft teal
    borderColor: '#5eead4',
    textColor: '#0f766e',
    pinColor: '#334155',
    description: 'العمة هي أخت الأب الكريمة، لها مكانة رفيعة في قلوبنا وصلتها من الإيمان.',
    role: 'العمة'
  },
  {
    id: 'maternal_uncle',
    word: 'خَالِي',
    diacritics: 'خَ - ا - لِـ - ي',
    relation: 'أخو أمي',
    example: 'خَالِي أَخُو أُمِّي، يَحْرِصُ عَلَى زِيَارَتِنَا',
    bgColor: '#dcfce7', // pistachio green
    borderColor: '#86efac',
    textColor: '#15803d',
    pinColor: '#334155',
    description: 'الخال والد كما في الأثر، وهو أخو الأم الشقيق نكن له التقدير والإجلال.',
    role: 'الخال'
  },
  {
    id: 'maternal_aunt',
    word: 'خَالَتِي',
    diacritics: 'خَ - ا - لَ - تِـ - ي',
    relation: 'أخت أمي بمنزلة الأم',
    example: 'خَالَتِي أُخْتُ أُمِّي الحَبِيبَةُ، كَالأُمِّ فِي حَنَانِهَا',
    bgColor: '#ffe4e6', // warm coral
    borderColor: '#fca5a5',
    textColor: '#b91c1c',
    pinColor: '#334155',
    description: 'الخالة بمنزلة الأم في الرعاية والمودة، تفيض باللطف والمشاعر الطيبة.',
    role: 'الخالة'
  }
];

export const FamilyHotspotReader: React.FC = () => {
  const [activeWordId, setActiveWordId] = useState<string>('father');
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [targetQuizWord, setTargetQuizWord] = useState<FamilyMemberWord | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeWord = FAMILY_WORDS.find(w => w.id === activeWordId) || FAMILY_WORDS[0];

  // Pronounce word with tashkeel
  const handlePronounce = (wordItem: FamilyMemberWord) => {
    setActiveWordId(wordItem.id);
    audioManager.speakArabic(`${wordItem.word}... ${wordItem.relation}`);
  };

  // Auto Tour Playback
  useEffect(() => {
    if (isTourPlaying) {
      const currentIndex = FAMILY_WORDS.findIndex(w => w.id === activeWordId);
      const nextIndex = (currentIndex + 1) % FAMILY_WORDS.length;
      
      const itemToPlay = FAMILY_WORDS[currentIndex];
      audioManager.speakArabic(itemToPlay.word);

      tourTimeoutRef.current = setTimeout(() => {
        setActiveWordId(FAMILY_WORDS[nextIndex].id);
      }, 2600);
    } else {
      if (tourTimeoutRef.current) {
        clearTimeout(tourTimeoutRef.current);
      }
    }

    return () => {
      if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    };
  }, [isTourPlaying, activeWordId]);

  // Start Challenge Quiz Game
  const handleStartGame = () => {
    setGameMode(true);
    setIsTourPlaying(false);
    setScore(0);
    setFeedback(null);
    pickNextQuizWord();
  };

  const pickNextQuizWord = () => {
    const random = FAMILY_WORDS[Math.floor(Math.random() * FAMILY_WORDS.length)];
    setTargetQuizWord(random);
    setFeedback(null);
    audioManager.speakArabic(`أَيْنَ كَلِمَةُ: ${random.word}؟`);
  };

  const handleNoteClick = (wordItem: FamilyMemberWord) => {
    if (gameMode && targetQuizWord) {
      if (wordItem.id === targetQuizWord.id) {
        audioManager.play('correct');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setScore(prev => prev + 1);
        setFeedback({ message: `أَحْسَنْتَ يَا بَطَل! هَذِهِ كَلِمَةُ (${wordItem.word}) 🌟`, isCorrect: true });
        setTimeout(() => {
          pickNextQuizWord();
        }, 1500);
      } else {
        audioManager.play('wrong');
        setFeedback({ message: `حَاوِلْ مَرَّةً أُخْرَى! المَطْلُوبُ: (${targetQuizWord.word})`, isCorrect: false });
        audioManager.speakArabic(`حاول مرة أخرى، أين كلمة: ${targetQuizWord.word}؟`);
      }
    } else {
      handlePronounce(wordItem);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-emerald-50/40 rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Top Ministry Book Header Replica */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 text-2xl">
            🎧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                الصَّفْحَةُ ١٩ • مَنْهَجُ لُغَتِي
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                نِظَامُ الدَّوَائِرِ التَّفَاعُلِيَّةِ (HOTSPOT)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-alexandria tracking-tight mt-0.5">
              أَسْتَمِعُ وَأَنْطِقُ: أَسْمَاءُ ذَوِي القَرَابَةِ
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {!gameMode ? (
            <>
              <button
                onClick={() => setIsTourPlaying(!isTourPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-sm transition-all transform active:scale-95 text-white ${
                  isTourPlaying 
                    ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-300' 
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {isTourPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>إيقاف القراءة المتتالية</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>جَوْلَةُ القِرَاءَةِ التِّلْقَائِيَّةِ</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStartGame}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>تَحَدِّي اسْتَمِعْ وَاخْتَرْ 🎯</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                النقاط: {score} ⭐
              </span>
              <button
                onClick={() => targetQuizWord && audioManager.speakArabic(`أَيْنَ كَلِمَةُ: ${targetQuizWord.word}؟`)}
                className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl"
                title="إعادة نطق المطلوب"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGameMode(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                خروج من التحدي
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Target Word Prompt in Game Mode */}
      {gameMode && targetQuizWord && (
        <div className="my-3 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-center shadow-md animate-in zoom-in-95 duration-200">
          <div className="text-xs font-bold opacity-90">انقر على البطاقة الصحيحة التي تحتوي على كلمة:</div>
          <div className="text-2xl font-black font-amiri tracking-wider mt-0.5">
            « {targetQuizWord.word} »
          </div>
          {feedback && (
            <div className={`mt-2 py-1 px-3 rounded-xl text-xs font-bold inline-block ${
              feedback.isCorrect ? 'bg-emerald-900/90 text-white' : 'bg-rose-900/90 text-white'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}

      {/* The Sticky Notes Hotspot Board Grid (Layout strictly faithful to page 19) */}
      <div className="py-6 sm:py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 relative">
          {FAMILY_WORDS.slice(0, 9).map((item) => {
            const isSelected = activeWordId === item.id && !gameMode;
            const isQuizTarget = gameMode && targetQuizWord?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleNoteClick(item)}
                className="relative cursor-pointer transition-transform transform hover:-translate-y-1 group"
              >
                {/* Pushpin at top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-950 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                  </div>
                  <div className="w-0.5 h-2 bg-slate-500 mx-auto -mt-0.5"></div>
                </div>

                {/* Sticky Note Box */}
                <div
                  className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px] shadow-md ${
                    isSelected
                      ? 'ring-4 ring-rose-500 ring-offset-2 scale-105 shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor,
                    borderWidth: '1.5px',
                  }}
                >
                  {/* The Word itself with tashkeel */}
                  <span
                    className="font-amiri text-3xl sm:text-4xl font-black tracking-wide relative z-10 transition-transform group-hover:scale-110"
                    style={{ color: item.textColor }}
                  >
                    {item.word}
                  </span>

                  {/* Hotspot Pulsing Circle around the word */}
                  {isSelected && (
                    <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 pointer-events-none flex items-center justify-center">
                      {/* Realistic Hand-Drawn Glowing Circle SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500 animate-pulse">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeDasharray="6 2"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        />
                      </svg>
                      {/* Hotspot Target Center Indicator */}
                      <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 animate-bounce">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>مُحَدَّدَة</span>
                      </span>
                    </div>
                  )}

                  {/* Subtle Subtitle of kinship */}
                  <span className="text-[11px] font-bold opacity-75 mt-1" style={{ color: item.textColor }}>
                    {item.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 10th Sticky Note Centered at bottom (خَالَتِي) */}
        <div className="flex justify-center mt-5 sm:mt-6">
          {(() => {
            const item = FAMILY_WORDS[9]; // خَالَتِي
            const isSelected = activeWordId === item.id && !gameMode;

            return (
              <div
                onClick={() => handleNoteClick(item)}
                className="relative cursor-pointer transition-transform transform hover:-translate-y-1 group w-full max-w-[280px]"
              >
                {/* Pushpin at top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-950 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                  </div>
                  <div className="w-0.5 h-2 bg-slate-500 mx-auto -mt-0.5"></div>
                </div>

                <div
                  className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px] shadow-md ${
                    isSelected
                      ? 'ring-4 ring-rose-500 ring-offset-2 scale-105 shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor,
                    borderWidth: '1.5px',
                  }}
                >
                  <span
                    className="font-amiri text-3xl sm:text-4xl font-black tracking-wide relative z-10 transition-transform group-hover:scale-110"
                    style={{ color: item.textColor }}
                  >
                    {item.word}
                  </span>

                  {isSelected && (
                    <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 pointer-events-none flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500 animate-pulse">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeDasharray="6 2"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        />
                      </svg>
                      <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 animate-bounce">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>مُحَدَّدَة</span>
                      </span>
                    </div>
                  )}

                  <span className="text-[11px] font-bold opacity-75 mt-1" style={{ color: item.textColor }}>
                    {item.role}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Floating Active Word Detail Info Box (نظام هوتسبوت التفاعلي) */}
      {!gameMode && activeWord && (
        <div className="mt-4 p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black font-amiri shadow-inner border"
              style={{ backgroundColor: activeWord.bgColor, color: activeWord.textColor, borderColor: activeWord.borderColor }}
            >
              {activeWord.word}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-slate-900 font-alexandria">
                  {activeWord.word} ({activeWord.relation})
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  التهجئة: {activeWord.diacritics}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {activeWord.description}
              </p>
              <div className="text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                {activeWord.example}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePronounce(activeWord)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>نُطْقُ الكَلِمَةِ</span>
            </button>
            <button
              onClick={() => {
                const idx = FAMILY_WORDS.findIndex(w => w.id === activeWord.id);
                const next = FAMILY_WORDS[(idx + 1) % FAMILY_WORDS.length];
                handlePronounce(next);
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              title="الكلمة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Ministry Textbook Caption */}
      <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-bold">
        <span className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>يَتَدَرَّبُ عَلَى نُطْقِ أَسْمَاءِ ذَوِي القَرَابَةِ نُطْقًا عَرَبِيًّا صَحِيحًا (المَقْرُوءُ وَالمَسْمُوعُ)</span>
        </span>
        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-600">
          المملكة العربية السعودية 🇸🇦
        </span>
      </div>
    </div>
  );
};
