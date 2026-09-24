import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  Trophy, 
  Star, 
  Volume2, 
  Shuffle, 
  Clock,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../../utils/audio';

interface ClassroomToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'timer' | 'wheel' | 'scoreboard';
}

interface StudentScore {
  id: string;
  name: string;
  stars: number;
}

const DEFAULT_STUDENT_NAMES = [
  'عبدالله محمد',
  'سارة خالد',
  'عمر فهد',
  'نورة سلطان',
  'يوسف أحمد',
  'ليان فهد',
  'إبراهيم سعيد',
  'جود تركي',
  'خالد بدر',
  'مريم ناصر'
];

export const ClassroomToolsModal: React.FC<ClassroomToolsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'timer',
}) => {
  const [activeTab, setActiveTab] = useState<'timer' | 'wheel' | 'scoreboard'>(defaultTab);

  // Timer State
  const [timerDuration, setTimerDuration] = useState<number>(120); // seconds
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);

  // Wheel State
  const [wheelNames, setWheelNames] = useState<string[]>(DEFAULT_STUDENT_NAMES);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // Scoreboard State
  const [students, setStudents] = useState<StudentScore[]>(() => {
    try {
      const saved = localStorage.getItem('lughati_class_scoreboard');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_STUDENT_NAMES.map((name, i) => ({
      id: `std_${i}`,
      name,
      stars: Math.floor(Math.random() * 4) + 1,
    }));
  });
  const [scoreStudentInput, setScoreStudentInput] = useState<string>('');

  // Persist scoreboard
  useEffect(() => {
    try {
      localStorage.setItem('lughati_class_scoreboard', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  // Countdown & Stopwatch Interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerMode === 'countdown') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsTimerRunning(false);
              audioManager.play('success');
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  if (!isOpen) return null;

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSetCountdown = (seconds: number) => {
    setIsTimerRunning(false);
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setTimerMode('countdown');
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'countdown') {
      setTimeLeft(timerDuration);
    } else {
      setStopwatchTime(0);
    }
  };

  // Wheel Spin Logic
  const handleSpinWheel = () => {
    if (wheelNames.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedWinner(null);
    audioManager.play('click');

    const randomDegrees = Math.floor(Math.random() * 360) + 1440; // at least 4 full turns
    const finalRotation = wheelRotation + randomDegrees;
    setWheelRotation(finalRotation);

    const segmentAngle = 360 / wheelNames.length;
    // Calculate winning index based on pointer at top (270 deg or 90 deg)
    const normalizedAngle = (360 - (finalRotation % 360)) % 360;
    const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % wheelNames.length;

    setTimeout(() => {
      const winner = wheelNames[winnerIndex] || wheelNames[0];
      setSelectedWinner(winner);
      setIsSpinning(false);
      audioManager.play('celebration');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 3500);
  };

  const handleAddWheelName = () => {
    if (!newStudentName.trim()) return;
    setWheelNames([...wheelNames, newStudentName.trim()]);
    setNewStudentName('');
  };

  const handleRemoveWheelName = (idx: number) => {
    setWheelNames(wheelNames.filter((_, i) => i !== idx));
  };

  // Scoreboard Helpers
  const handleAddStudentScore = () => {
    if (!scoreStudentInput.trim()) return;
    const newStudent: StudentScore = {
      id: `std_${Date.now()}`,
      name: scoreStudentInput.trim(),
      stars: 1,
    };
    setStudents([...students, newStudent]);
    setScoreStudentInput('');
    audioManager.play('star');
  };

  const handleUpdateStars = (id: string, delta: number) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === id) {
          const nextStars = Math.max(0, st.stars + delta);
          if (delta > 0) audioManager.play('star');
          return { ...st, stars: nextStars };
        }
        return st;
      })
    );
  };

  const handleDeleteScoreStudent = (id: string) => {
    setStudents(students.filter((st) => st.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              🛠️
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">أدوات المعلم التفاعلية في الفصل</h3>
              <p className="text-xs text-emerald-100 font-medium">مؤقت زمني، قرص اختيار الطلاب عشوائياً، ولوحة تعزيز النجوم والجوائز</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === 'timer'
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Timer className="w-4 h-4 text-emerald-600" />
            <span>⏱️ مؤقت الحصة والأنشطة</span>
          </button>

          <button
            onClick={() => setActiveTab('wheel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === 'wheel'
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Shuffle className="w-4 h-4 text-amber-500" />
            <span>🎡 قرص اختيار الطلاب (عجلة الحظ)</span>
          </button>

          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === 'scoreboard'
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>🏆 لوحة تعزيز نقاط الطلاب</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: TIMER */}
          {activeTab === 'timer' && (
            <div className="max-w-md mx-auto space-y-6 text-center">
              {/* Mode Toggle */}
              <div className="inline-flex p-1 bg-slate-200 rounded-2xl">
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMode('countdown');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerMode === 'countdown' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  عد تنازلي (نشاط صفي)
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMode('stopwatch');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerMode === 'stopwatch' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ساعة إيقاف (تصاعدي)
                </button>
              </div>

              {/* Big Clock Display */}
              <div className="relative py-8 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl shadow-xl border border-slate-700">
                <div className="text-6xl sm:text-7xl font-black font-mono tracking-wider text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  {formatTime(timerMode === 'countdown' ? timeLeft : stopwatchTime)}
                </div>
                <div className="text-xs text-slate-400 font-bold mt-2">
                  {timerMode === 'countdown' ? `المؤقت الإجمالي: ${formatTime(timerDuration)}` : 'ساعة إيقاف التحديات'}
                </div>

                {timeLeft === 0 && timerMode === 'countdown' && (
                  <div className="mt-3 py-1 px-3 bg-rose-500 text-white text-xs font-bold rounded-full animate-bounce inline-block">
                    🔔 انتهى الوقت المخصص للنشاط!
                  </div>
                )}
              </div>

              {/* Quick Presets (For countdown) */}
              {timerMode === 'countdown' && (
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { label: '30 ثانية', s: 30 },
                    { label: 'دقيقة ⏳', s: 60 },
                    { label: 'دقيقتان ⏱️', s: 120 },
                    { label: '3 دقائق 📝', s: 180 },
                    { label: '5 دقائق 🎯', s: 300 },
                    { label: '10 دقائق 📚', s: 600 },
                  ].map((preset) => (
                    <button
                      key={preset.s}
                      onClick={() => handleSetCountdown(preset.s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        timerDuration === preset.s
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Controls (Start, Pause, Reset) */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-extrabold shadow-lg transition-transform active:scale-95 text-white ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>بدء الوقت</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="flex items-center gap-2 px-5 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl text-sm font-bold transition-colors"
                  title="إعادة التعيين"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة ضبط</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHEEL OF NAMES */}
          {activeTab === 'wheel' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left/Center Wheel Display */}
              <div className="md:col-span-7 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md pointer-events-none"></div>

                  {/* Indicator Arrow at Top */}
                  <div className="absolute -top-3 z-30 transform -translate-x-1/2 left-1/2">
                    <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-rose-600 drop-shadow-md"></div>
                  </div>

                  {/* The Wheel Canvas / SVG */}
                  <div
                    className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative"
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                    }}
                  >
                    {wheelNames.length > 0 ? (
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {wheelNames.map((name, i) => {
                          const total = wheelNames.length;
                          const angle = 360 / total;
                          const startAngle = i * angle;
                          const endAngle = (i + 1) * angle;

                          // Polar to Cartesian
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;
                          const x1 = 50 + 50 * Math.cos(startRad);
                          const y1 = 50 + 50 * Math.sin(startRad);
                          const x2 = 50 + 50 * Math.cos(endRad);
                          const y2 = 50 + 50 * Math.sin(endRad);

                          const largeArc = angle > 180 ? 1 : 0;
                          const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                          const colors = [
                            '#10b981', '#3b82f6', '#f59e0b', '#ec4899', 
                            '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6',
                            '#6366f1', '#84cc16'
                          ];
                          const color = colors[i % colors.length];

                          return (
                            <path
                              key={i}
                              d={pathData}
                              fill={color}
                              stroke="#ffffff"
                              strokeWidth="0.8"
                            />
                          );
                        })}
                      </svg>
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                        أضف طلاب أولاً
                      </div>
                    )}

                    {/* Wheel Center Badge */}
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white shadow-md border-4 border-emerald-600 flex items-center justify-center font-black text-xs text-emerald-800">
                      🎡
                    </div>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning || wheelNames.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'جاري التدوير...' : 'دوران العجلة السحرية! 🎯'}</span>
                </button>

                {/* Winner Display */}
                {selectedWinner && !isSpinning && (
                  <div className="p-4 bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border-2 border-amber-400 rounded-2xl text-center animate-in zoom-in-90 duration-200 shadow-md">
                    <div className="text-xs font-bold text-amber-800 mb-1">🎉 البطل الفائز بالسحب:</div>
                    <div className="text-2xl font-black text-amber-900">{selectedWinner} 🌟</div>
                  </div>
                )}
              </div>

              {/* Right Side: Names List Management */}
              <div className="md:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">قائمة طلاب الفصل ({wheelNames.length}):</span>
                  <button
                    onClick={() => setWheelNames(DEFAULT_STUDENT_NAMES)}
                    className="text-[11px] text-emerald-700 hover:underline font-bold"
                  >
                    استعادة الافتراضي
                  </button>
                </div>

                {/* Input new student */}
                <div className="flex gap-1.5 mb-3">
                  <input
                    type="text"
                    placeholder="اسم الطالب..."
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWheelName()}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleAddWheelName}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </div>

                {/* Students List Scrollable */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {wheelNames.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{name}</span>
                      </span>
                      <button
                        onClick={() => handleRemoveWheelName(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCOREBOARD */}
          {activeTab === 'scoreboard' && (
            <div className="space-y-4">
              {/* Top add bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <input
                    type="text"
                    placeholder="أضف طالباً جديداً للوحة الشرف..."
                    value={scoreStudentInput}
                    onChange={(e) => setScoreStudentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddStudentScore()}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                  <button
                    onClick={handleAddStudentScore}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة طالب</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-500">
                  إجمالي نجوم الفصل: <span className="text-amber-600 font-black text-sm">{students.reduce((acc, s) => acc + s.stars, 0)} ⭐</span>
                </div>
              </div>

              {/* Student Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {students.map((st, index) => (
                  <div
                    key={st.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 font-black text-sm flex items-center justify-center border border-emerald-200">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-800">{st.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-amber-500 font-black text-xs">{st.stars}</span>
                          <span className="text-amber-400 text-xs">⭐</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStars(st.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-black flex items-center justify-center transition-colors"
                        title="خصم نجمة"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateStars(st.id, 1)}
                        className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center justify-center shadow-xs transition-transform active:scale-95"
                        title="إضافة نجمة تفوق"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleDeleteScoreStudent(st.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors ml-1"
                        title="حذف الطالب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 يمكنك تصغير هذه النافذة أو استخدامها أثناء الشرح المباشر على السبورة</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
