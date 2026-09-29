import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Music,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Heart,
  BookOpen,
  Sun,
  Moon,
  Compass,
  Smile,
  ShieldCheck,
  ChevronLeft,
  Video,
  ExternalLink
} from 'lucide-react';
import {
  EDUCATIONAL_SONGS,
  EDUCATIONAL_SONGS_CATEGORIES,
  SongItem
} from '../data/educationalSongsData';

export const EducationalSongsStudio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 1: sm, 2: base, 3: lg, 4: xl
  const [isClassroomMode, setIsClassroomMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lughati_favorite_songs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-select song from URL parameter if provided (e.g. ?song=laha-assabah)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const songParam = urlParams.get('song') || urlParams.get('id');
      if (songParam) {
        const found = EDUCATIONAL_SONGS.find((s) => s.id === songParam);
        if (found) {
          setSelectedSong(found);
          setShowVideo(Boolean(found.youtubeEmbedId));
        }
      }
    } catch {}
  }, []);

  const handleSelectSong = (song: SongItem) => {
    stopSpeech();
    setSelectedSong(song);
    setShowVideo(Boolean(song.youtubeEmbedId));
  };

  // Toggle favorite
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('lughati_favorite_songs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter songs
  const filteredSongs = useMemo(() => {
    return EDUCATIONAL_SONGS.filter((song) => {
      const matchCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'favorites'
          ? favorites.includes(song.id)
          : song.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        song.title.toLowerCase().includes(q) ||
        song.theme.toLowerCase().includes(q) ||
        song.verses.some((v) => v.toLowerCase().includes(q)) ||
        song.valuesLearned.some((val) => val.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, favorites]);

  // Audio recitation via SpeechSynthesis
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const playSongAudio = (song: SongItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const fullText = `${song.title}. ${song.verses.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ar-SA';
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlayAudio = () => {
    if (!selectedSong) return;
    if (isPlaying) {
      stopSpeech();
    } else {
      playSongAudio(selectedSong);
    }
  };

  // Cleanup speech on unmount or song change
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [selectedSong]);

  // Copy lyrics
  const handleCopyLyrics = (song: SongItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const textToCopy = `🎵 ${song.title}\n\n${song.verses.join('\n')}\n\n(منصة لغتي التعليمية - كراسة الأناشيد التربوية)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(song.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Print song
  const handlePrintCurrentSong = () => {
    window.print();
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 1:
        return 'text-base leading-relaxed';
      case 2:
        return 'text-lg sm:text-xl leading-loose';
      case 3:
        return 'text-xl sm:text-2xl leading-loose';
      case 4:
        return 'text-2xl sm:text-3xl leading-loose';
      default:
        return 'text-lg sm:text-xl leading-loose';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white p-6 sm:p-10 shadow-xl border border-amber-300/30">
        <div className="absolute top-0 left-0 -mt-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-wide border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>كراسة الأناشيد التربوية الشاملة • أناشيد تربوية وكشفية ومدرسية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-alexandria tracking-tight text-white drop-shadow-sm">
              أناشيد تربوية 🎵
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-medium">
              أكثر من ٥٠ نشيداً وقصيدة تربوية هادفة مستوحاة من كراسة الأناشيد المدرسية والكشفية؛ تجمع بين الإشراق الصباحي، حب الطبيعة، بر الوالدين، آداب المرور، الألفة والأخوة، مع قارئ صوتي تفاعلي ووضع الإنشاد الصفي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (filteredSongs.length > 0) {
                  setSelectedSong(filteredSongs[0]);
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-600 hover:bg-amber-50 font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-orange-600" />
              <span>ابدأ الإنشاد</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all cursor-pointer"
              title="طباعة كراسة الأناشيد"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة الكراسة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن نشيد، كلمة، قيمة (مثال: الصباح، البدر، الوالدين، المرور...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-2xs text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
            <span>عدد الأناشيد:</span>
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 font-black">
              {filteredSongs.length} نشيد
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EDUCATIONAL_SONGS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-700 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          {/* Favorites Filter */}
          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'favorites'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'favorites' ? 'fill-white' : 'fill-rose-500'}`} />
            <span>المفضلة ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Song Cards */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Music className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700">لم يتم العثور على أناشيد مطابقة للبحث</p>
          <p className="text-xs text-slate-400 mt-1">جرّب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 cursor-pointer"
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSongs.map((song) => {
            const isFav = favorites.includes(song.id);
            return (
              <div
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top card strip */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-orange-50 text-orange-800 border border-orange-200/60">
                        {song.categoryLabel}
                      </span>
                      {song.youtubeEmbedId && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-xs">
                          <span>🎬</span>
                          <span>فيديو YouTube</span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(song.id, e)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                      title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Song Title */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
                      🎵
                    </div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 font-alexandria group-hover:text-orange-600 transition-colors">
                      {song.title}
                    </h3>
                  </div>

                  {/* Theme description */}
                  <p className="text-xs text-slate-500 line-clamp-1">{song.theme}</p>

                  {/* Verses Preview */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-700 space-y-1.5 leading-relaxed font-serif">
                    {song.verses.slice(0, 3).map((verse, vIdx) => (
                      <p key={vIdx} className="line-clamp-1">
                        • {verse}
                      </p>
                    ))}
                    {song.verses.length > 3 && (
                      <p className="text-[10px] text-orange-600 font-bold font-sans">
                        + {song.verses.length - 3} أبيات إضافية...
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom values and action */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {song.valuesLearned.slice(0, 2).map((val, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                      >
                        ✓ {val}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {song.youtubeEmbedId && (
                      <span className="text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1 transition-colors">
                        <span>▶</span>
                        <span>فيديو</span>
                      </span>
                    )}
                    <span className="text-xs font-black text-orange-600 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                      <span>عرض الإنشاد</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Classroom View of Selected Song */}
      {selectedSong && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200 w-full overflow-hidden transition-all flex flex-col ${
              isClassroomMode ? 'max-w-6xl h-[92vh]' : 'max-w-3xl max-h-[90vh]'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎵</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-alexandria text-white">
                    {selectedSong.title}
                  </h2>
                  <p className="text-xs text-orange-100 font-medium">
                    {selectedSong.categoryLabel} • {selectedSong.theme}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Classroom Fullscreen Toggle */}
                <button
                  onClick={() => setIsClassroomMode(!isClassroomMode)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title={isClassroomMode ? 'تصغير النافذة' : 'وضع العرض الصفي / السبورة'}
                >
                  {isClassroomMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeech();
                    setSelectedSong(null);
                    setIsClassroomMode(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayAudio}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs shadow-xs transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'إيقاف مؤقت' : 'استماع صوتي'}</span>
                </button>

                {isPlaying && (
                  <button
                    onClick={stopSpeech}
                    className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300"
                    title="إعادة الصوت"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Speed Selector */}
                <div className="hidden sm:flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">السرعة:</span>
                  {[0.8, 1.0, 1.2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        playbackSpeed === spd ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* YouTube Video Toggle Button if available */}
                {selectedSong.youtubeEmbedId && (
                  <div className="flex items-center gap-1.5 border-r border-amber-200/60 pr-2 mr-1">
                    <button
                      onClick={() => setShowVideo(!showVideo)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        showVideo
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                      }`}
                      title={showVideo ? 'إخفاء الفيديو وعرض الكلمات فقط' : 'عرض فيديو النشيد من YouTube'}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{showVideo ? 'إخفاء الفيديو' : 'فيديو النشيد 🎬'}</span>
                    </button>

                    <a
                      href={selectedSong.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-bold border border-red-200 text-xs transition-all"
                      title="فتح النشيد مباشرة في YouTube"
                    >
                      <ExternalLink className="w-3 h-3 text-red-600" />
                      <span>YouTube</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Text formatting & Actions */}
              <div className="flex items-center gap-2">
                {/* Font Size Adjusters */}
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">حجم الخط:</span>
                  <button
                    onClick={() => setFontSizeLevel((prev) => Math.max(1, prev - 1))}
                    disabled={fontSizeLevel <= 1}
                    className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-bold text-orange-600 text-xs">{fontSizeLevel}</span>
                  <button
                    onClick={() => setFontSizeLevel((prev) => Math.min(4, prev + 1))}
                    disabled={fontSizeLevel >= 4}
                    className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  onClick={(e) => handleCopyLyrics(selectedSong, e)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold"
                  title="نسخ كلمات النشيد"
                >
                  {copiedId === selectedSong.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>

                {/* Print Button */}
                <button
                  onClick={handlePrintCurrentSong}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold"
                  title="طباعة النشيد"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">طباعة</span>
                </button>
              </div>
            </div>

            {/* Lyrics Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-gradient-to-b from-white to-amber-50/30 text-center">
              {/* Title & Metadata */}
              <div className="space-y-2 border-b border-amber-200/60 pb-6">
                <span className="text-sm font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  {selectedSong.categoryLabel}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-alexandria tracking-tight">
                  {selectedSong.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                  {selectedSong.theme}
                </p>
                {selectedSong.author && (
                  <p className="text-xs text-slate-600 font-medium">
                    كلمات: {selectedSong.author}
                    {selectedSong.composer && ` • ألحان: ${selectedSong.composer}`}
                  </p>
                )}
              </div>

              {/* Embedded YouTube Video Player (when available) */}
              {selectedSong.youtubeEmbedId && showVideo && (
                <div className="max-w-3xl mx-auto space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-xs px-2">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span className="text-red-700 font-black">فيديو نشيد {selectedSong.title} (كليب YouTube)</span>
                    </span>
                    <a
                      href={selectedSong.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>مشاهدة في YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/70 bg-black aspect-video">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedSong.youtubeEmbedId}?rel=0&modestbranding=1`}
                      title={`فيديو نشيد ${selectedSong.title}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Verses Stanzas */}
              <div className={`space-y-4 font-serif text-slate-800 ${getFontSizeClass()}`}>
                {selectedSong.verses.map((verse, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-2xl hover:bg-amber-100/60 transition-colors duration-150 inline-block w-full max-w-2xl border border-transparent hover:border-amber-200"
                  >
                    <p className="font-semibold tracking-wide drop-shadow-2xs">{verse}</p>
                  </div>
                ))}
              </div>

              {/* Values & Pedagogical Goals */}
              <div className="pt-8 border-t border-amber-200/60 max-w-xl mx-auto text-right">
                <h4 className="text-xs font-black text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>القيم التربوية والمكتسبات المرجوة من النشيد:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSong.valuesLearned.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs shadow-2xs"
                    >
                      🌟 {val}
                    </span>
                  ))}
                  <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 font-bold text-xs">
                    🎯 الفئة: {selectedSong.targetAudience}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>منصة لغتي التعليمية • كراسة الأناشيد تربوية</span>
              <button
                onClick={() => {
                  stopSpeech();
                  setSelectedSong(null);
                  setIsClassroomMode(false);
                }}
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                العودة لقائمة الأناشيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
