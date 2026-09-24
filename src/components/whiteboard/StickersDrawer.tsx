import React, { useState } from 'react';
import { X, Search, Image as ImageIcon, Sparkles, Upload, Smile, Star, Award, BookOpen } from 'lucide-react';
import { STICKER_CATEGORIES, StickerItem } from './stickersData';

interface StickersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (item: StickerItem) => void;
  onUploadImage: (dataUrl: string) => void;
}

export const StickersDrawer: React.FC<StickersDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
  onUploadImage,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('teacher_stamps');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUploadImage(dataUrl);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const currentCategoryData = STICKER_CATEGORIES.find((c) => c.id === activeCategory);
  
  // Filter items by search query if any
  const displayedItems = searchQuery.trim()
    ? STICKER_CATEGORIES.flatMap((c) => c.items).filter((item) =>
        item.label.includes(searchQuery.trim()) || item.content.includes(searchQuery.trim())
      )
    : currentCategoryData?.items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              🎨
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">ملصقات وأختام تعزيز المعلم</h3>
              <p className="text-xs text-emerald-100 font-medium">أكثر من 100 ملصق تعليمي وختم تشجيعي لتحفيز الطلاب في الحصة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Upload Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن ختم أو ملصق (مثال: ممتاز، أسد، نجمة، كتاب)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <label className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>رفع صورة من جهازك</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Category Tabs (if not searching) */}
        {!searchQuery.trim() && (
          <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-slate-100 bg-white no-scrollbar">
            {STICKER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50">
          {displayedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-500" />
              <p className="text-sm font-bold">لا توجد ملصقات مطابقة للبحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {displayedItems.map((item) => {
                const isStamp = item.type === 'stamp';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSticker(item);
                      onClose();
                    }}
                    className={`group relative p-3 rounded-2xl text-center transition-all transform hover:scale-105 active:scale-95 border flex flex-col items-center justify-center gap-1.5 ${
                      isStamp
                        ? 'shadow-sm hover:shadow-md'
                        : 'bg-white hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                    style={{
                      backgroundColor: item.bg || (isStamp ? '#fef3c7' : '#ffffff'),
                      borderColor: item.color || '#e2e8f0',
                    }}
                  >
                    {isStamp ? (
                      <div 
                        className="font-black text-sm sm:text-base leading-snug px-2 py-1 rounded-lg"
                        style={{ color: item.color || '#92400e' }}
                      >
                        {item.content}
                      </div>
                    ) : (
                      <span className="text-3xl sm:text-4xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                        {item.content}
                      </span>
                    )}

                    <span 
                      className="text-[11px] font-bold text-slate-600 group-hover:text-emerald-900 line-clamp-1"
                      style={isStamp ? { color: item.color } : {}}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 نصيحة: انقر على أي ملصق لإدراجه فوراً على السبورة مع إمكانية تحريكه وتكبيره</span>
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
