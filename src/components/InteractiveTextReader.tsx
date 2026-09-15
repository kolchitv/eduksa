import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Gauge, 
  Type, 
  Sparkles, 
  Compass, 
  Bookmark, 
  Check, 
  MousePointerClick,
  ChevronDown
} from 'lucide-react';
import { audioManager } from '../utils/audio';

interface InteractiveTextReaderProps {
  text?: string;
  verses?: { first: string; second: string }[];
  title?: string;
  themeColor?: string;
  onWordClick?: (word: string, meaning?: string) => void;
}

export const InteractiveTextReader: React.FC<InteractiveTextReaderProps> = ({
  text = '',
  verses,
  title,
  themeColor = 'emerald'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(0.75); // Ideal speed for primary school
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [highlightStyle, setHighlightStyle] = useState<'amber' | 'emerald' | 'blue' | 'purple'>('amber');
  const [clickedWordInfo, setClickedWordInfo] = useState<{ word: string; index: number } | null>(null);
  const readerControllerRef = useRef<{ cancel: () => void; pause: () => void; resume: () => void } | null>(null);
  const activeWordElemRef = useRef<HTMLSpanElement | null>(null);

  // Parse text or verses into tokenized word list
  const fullRawText = useMemo(() => {
    if (verses && verses.length > 0) {
      return verses.map(v => `${v.first} ، ${v.second}`).join(' . ');
    }
    return text;
  }, [text, verses]);

  const words = useMemo(() => {
    if (!fullRawText) return [];
    // Split by spaces while preserving Arabic letters and tashkeel
    return fullRawText.trim().split(/\s+/).filter(w => w.trim().length > 0);
  }, [fullRawText]);

  // Clean stop when unmounting or switching texts
  useEffect(() => {
    return () => {
      if (readerControllerRef.current) {
        readerControllerRef.current.cancel();
      }
      audioManager.stopSpeaking();
    };
  }, [fullRawText]);

  // Stop playback when tab or text changes
  useEffect(() => {
    if (isPlaying) {
      handleStop();
    }
    setActiveWordIdx(null);
    setClickedWordInfo(null);
  }, [text, verses]);

  // Auto-scroll to active word smoothly if out of view
  useEffect(() => {
    if (activeWordIdx !== null && activeWordElemRef.current) {
      activeWordElemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeWordIdx]);

  const handleStartReading = (startIndex: number = 0) => {
    if (isPlaying) {
      handleStop();
      return;
    }

    if (words.length === 0) return;

    // Slice from startIndex if requested
    const sliceWords = words.slice(startIndex);
    const sliceText = sliceWords.join(' ');

    setIsPlaying(true);
    setActiveWordIdx(startIndex);

    readerControllerRef.current = audioManager.speakArabicWithWordHighlight(
      sliceText,
      sliceWords,
      playbackRate,
      (relativeIdx, currentWord) => {
        const actualIdx = startIndex + relativeIdx;
        setActiveWordIdx(actualIdx);
      },
      () => {
        setIsPlaying(false);
        setActiveWordIdx(null);
      }
    );
  };

  const handleStop = () => {
    if (readerControllerRef.current) {
      readerControllerRef.current.cancel();
      readerControllerRef.current = null;
    }
    audioManager.stopSpeaking();
    setIsPlaying(false);
    setActiveWordIdx(null);
  };

  const handleWordClick = (word: string, index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // Speak single word immediately
    audioManager.stopSpeaking();
    if (readerControllerRef.current) {
      readerControllerRef.current.cancel();
      setIsPlaying(false);
    }
    setActiveWordIdx(index);
    setClickedWordInfo({ word, index });
    audioManager.speakArabic(word, 0.7);
  };

  const handleReadFromThisWord = () => {
    if (clickedWordInfo) {
      const idx = clickedWordInfo.index;
      setClickedWordInfo(null);
      handleStartReading(idx);
    }
  };

  // Font size classes
  const fontSizes = {
    normal: 'text-lg sm:text-xl leading-[2.5rem]',
    large: 'text-xl sm:text-2xl lg:text-3xl leading-[3rem]',
    xlarge: 'text-2xl sm:text-3xl lg:text-4xl leading-[3.6rem]'
  };

  // Color theme for the active word highlight
  const highlightStyles = {
    amber: {
      active: 'bg-amber-300 text-amber-950 shadow-md shadow-amber-300/40 ring-2 ring-amber-400 border-amber-500 scale-105',
      indicator: 'bg-amber-500 text-white',
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    emerald: {
      active: 'bg-emerald-300 text-emerald-950 shadow-md shadow-emerald-300/40 ring-2 ring-emerald-400 border-emerald-500 scale-105',
      indicator: 'bg-emerald-600 text-white',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    blue: {
      active: 'bg-sky-300 text-sky-950 shadow-md shadow-sky-300/40 ring-2 ring-sky-400 border-sky-500 scale-105',
      indicator: 'bg-sky-600 text-white',
      badge: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    purple: {
      active: 'bg-purple-300 text-purple-950 shadow-md shadow-purple-300/40 ring-2 ring-purple-400 border-purple-500 scale-105',
      indicator: 'bg-purple-600 text-white',
      badge: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  };

  const currentTheme = highlightStyles[highlightStyle];

  // Calculate progress percentage
  const progressPercent = words.length > 0 && activeWordIdx !== null
    ? Math.round(((activeWordIdx + 1) / words.length) * 100)
    : 0;

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden" id="interactive-text-reader">
      {/* Reader Control Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-4 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        {/* Left / Start: Title and Active Word Indicator info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">القراءة التفاعلية الموجهة</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                مؤشر لوني ناطق
              </span>
            </div>
            {title && <h4 className="text-sm font-bold text-slate-100">{title}</h4>}
          </div>
        </div>

        {/* Center / Right: Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-xl text-xs">
            <Gauge className="w-3.5 h-3.5 text-amber-400 ml-1" />
            <span className="text-slate-400 text-[11px] hidden sm:inline">السرعة:</span>
            {[
              { label: '٠.٦x بطيء', rate: 0.6 },
              { label: '٠.٧٥x متأنٍ', rate: 0.75 },
              { label: '١.٠x عادي', rate: 1.0 }
            ].map(spd => (
              <button
                key={spd.rate}
                onClick={() => {
                  setPlaybackRate(spd.rate);
                  if (isPlaying) {
                    handleStop();
                    setTimeout(() => handleStartReading(activeWordIdx || 0), 100);
                  }
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                  playbackRate === spd.rate
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                fontSize === 'normal' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
              title="خط قياسي"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg text-sm font-bold ${
                fontSize === 'large' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
              title="خط كبير"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded-lg text-base font-bold ${
                fontSize === 'xlarge' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
              title="خط كبير جداً"
            >
              A++
            </button>
          </div>

          {/* Highlight Color Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 p-1 rounded-xl">
            {[
              { id: 'amber', bg: 'bg-amber-400', title: 'مؤشر كهرماني دافئ' },
              { id: 'emerald', bg: 'bg-emerald-400', title: 'مؤشر زمردي' },
              { id: 'blue', bg: 'bg-sky-400', title: 'مؤشر سماوي' },
              { id: 'purple', bg: 'bg-purple-400', title: 'مؤشر بنفسجي' }
            ].map(col => (
              <button
                key={col.id}
                onClick={() => setHighlightStyle(col.id as any)}
                className={`w-4 h-4 rounded-full ${col.bg} transition-all ${
                  highlightStyle === col.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
                title={col.title}
              />
            ))}
          </div>

          {/* Master Play / Pause Button */}
          <button
            id="reader-master-play-btn"
            onClick={() => handleStartReading(0)}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>إيقاف القراءة</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>قراءة النص بالمؤشر</span>
              </>
            )}
          </button>

          {/* Reset / Stop Button */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all"
              title="إعادة للبداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reading Progress Indicator Bar */}
      {words.length > 0 && (
        <div className="w-full bg-slate-100 h-1.5 relative overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Helpful Reading Tip */}
      <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-5 py-2 flex items-center justify-between text-xs text-emerald-900 font-medium">
        <div className="flex items-center gap-2">
          <MousePointerClick className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
          <span>انقر على أي كلمة للاستماع لنطقها المفرد أو لبدء القراءة من عندها.</span>
        </div>
        {activeWordIdx !== null && (
          <span className="text-[11px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 text-emerald-800 shadow-xs">
            الكلمة {activeWordIdx + 1} من {words.length} ({progressPercent}%)
          </span>
        )}
      </div>

      {/* Reading Area */}
      <div className="p-6 sm:p-10 bg-gradient-to-b from-white to-slate-50/40 min-h-[160px] relative">
        {verses && verses.length > 0 ? (
          /* Poem Layout with Word Highlighting */
          <div className="space-y-4 max-w-2xl mx-auto py-2">
            {verses.map((verse, vIdx) => {
              const firstWords = verse.first.split(/\s+/).filter(Boolean);
              const secondWords = verse.second.split(/\s+/).filter(Boolean);
              
              // Compute offset in whole word array for this verse
              let prevCount = 0;
              for (let i = 0; i < vIdx; i++) {
                prevCount += verses[i].first.split(/\s+/).filter(Boolean).length;
                prevCount += verses[i].second.split(/\s+/).filter(Boolean).length;
              }
              const firstOffset = prevCount;
              const secondOffset = prevCount + firstWords.length;

              return (
                <div
                  key={vIdx}
                  className="p-4 sm:p-5 bg-white/90 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-center font-amiri font-bold"
                >
                  {/* First hemistich (الشطر الأول) */}
                  <div className="text-right sm:text-center text-emerald-950 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    {firstWords.map((w, wIdx) => {
                      const absoluteIdx = firstOffset + wIdx;
                      const isActive = activeWordIdx === absoluteIdx;
                      const isRead = activeWordIdx !== null && activeWordIdx > absoluteIdx;
                      return (
                        <span
                          key={wIdx}
                          ref={isActive ? activeWordElemRef : null}
                          onClick={(e) => handleWordClick(w, absoluteIdx, e)}
                          className={`relative inline-block px-2 py-0.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${fontSizes[fontSize]} ${
                            isActive
                              ? `${currentTheme.active} font-black z-10`
                              : isRead
                              ? 'text-emerald-900 bg-emerald-50/60'
                              : 'text-slate-800 hover:bg-slate-100 hover:text-emerald-900'
                          }`}
                        >
                          {w}
                          {isActive && (
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute" />
                              <span className="w-2 h-2 rounded-full bg-amber-600" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>

                  {/* Second hemistich (الشطر الثاني) */}
                  <div className="text-left sm:text-center text-emerald-900 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    {secondWords.map((w, wIdx) => {
                      const absoluteIdx = secondOffset + wIdx;
                      const isActive = activeWordIdx === absoluteIdx;
                      const isRead = activeWordIdx !== null && activeWordIdx > absoluteIdx;
                      return (
                        <span
                          key={wIdx}
                          ref={isActive ? activeWordElemRef : null}
                          onClick={(e) => handleWordClick(w, absoluteIdx, e)}
                          className={`relative inline-block px-2 py-0.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${fontSizes[fontSize]} ${
                            isActive
                              ? `${currentTheme.active} font-black z-10`
                              : isRead
                              ? 'text-emerald-900 bg-emerald-50/60'
                              : 'text-slate-800 hover:bg-slate-100 hover:text-emerald-900'
                          }`}
                        >
                          {w}
                          {isActive && (
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute" />
                              <span className="w-2 h-2 rounded-full bg-amber-600" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Reading Passage Paragraph with Word-by-Word Highlight */
          <div className="font-amiri font-bold text-justify leading-loose tracking-wide select-none">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3 sm:gap-y-4">
              {words.map((word, idx) => {
                const isActive = activeWordIdx === idx;
                const isRead = activeWordIdx !== null && activeWordIdx > idx;

                return (
                  <span
                    key={idx}
                    ref={isActive ? activeWordElemRef : null}
                    onClick={(e) => handleWordClick(word, idx, e)}
                    className={`relative inline-block px-2.5 py-1 rounded-2xl cursor-pointer transition-all duration-150 border ${fontSizes[fontSize]} ${
                      isActive
                        ? `${currentTheme.active} font-black z-20`
                        : isRead
                        ? 'text-emerald-950 bg-emerald-50/70 border-emerald-200/50'
                        : 'text-slate-900 bg-white/60 hover:bg-slate-100/90 border-transparent hover:border-slate-300/60'
                    }`}
                  >
                    {word}

                    {/* Animated Word Pointer Marker */}
                    {isActive && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-300 animate-pulse" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Word Click Popup Bar (When user taps a single word) */}
        {clickedWordInfo && !isPlaying && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-amiri text-2xl font-bold flex items-center justify-center">
                {clickedWordInfo.word.slice(0, 1)}
              </div>
              <div>
                <p className="text-xs text-emerald-300 font-medium">نطق الكلمة المحددة:</p>
                <h5 className="text-2xl font-amiri font-extrabold text-amber-300">
                  {clickedWordInfo.word}
                </h5>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => audioManager.speakArabic(clickedWordInfo.word, 0.65)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>إعادة النطق</span>
              </button>
              <button
                onClick={handleReadFromThisWord}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>متابعة القراءة من هنا</span>
              </button>
              <button
                onClick={() => {
                  setClickedWordInfo(null);
                  setActiveWordIdx(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-lg text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ribbon */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>تتبع صوتي وبصري كلمة بكلمة لتعزيز الطلاقة القرائية والتهجئة الصحيحة.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>إجمالي الكلمات: <strong>{words.length}</strong> كلمة</span>
        </div>
      </div>
    </div>
  );
};
