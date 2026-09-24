import React from 'react';
import { Plus, Trash2, Copy, ChevronLeft, ChevronRight, X, Layers } from 'lucide-react';
import { WhiteboardPage, BoardBackgroundType } from './types';

interface PagesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pages: WhiteboardPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
}

export const PagesSidebar: React.FC<PagesSidebarProps> = ({
  isOpen,
  onClose,
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-72 sm:w-80 bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h4 className="font-extrabold text-sm text-slate-800">صفحات وشرائح الدرس</h4>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {pages.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pages.map((page, index) => {
          const isSelected = index === currentPageIndex;
          const elementsCount = page.elements?.length || 0;

          return (
            <div
              key={page.id || index}
              onClick={() => onSelectPage(index)}
              className={`group relative p-3 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-400/30'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {/* Thumbnail Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-xs text-slate-800 truncate max-w-[120px]">
                    {page.title || `صفحة ${index + 1}`}
                  </span>
                </div>

                {/* Mini Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(index);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                    title="تكرار هذه الصفحة"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`هل أنت متأكد من حذف صفحة ${index + 1}؟`)) {
                          onDeletePage(index);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-colors"
                      title="حذف الصفحة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mini Preview Box */}
              <div
                className={`h-24 rounded-xl border flex items-center justify-center relative overflow-hidden text-[10px] font-bold ${
                  page.background === 'chalkboard'
                    ? 'bg-[#1b4332] text-emerald-200 border-[#2d6a4f]'
                    : page.background === 'dark'
                    ? 'bg-slate-900 text-slate-300 border-slate-700'
                    : page.background === 'warm_sepia'
                    ? 'bg-[#faf6ee] text-amber-900 border-[#e8dfc8]'
                    : page.background === 'arabic_ruled'
                    ? 'bg-white text-slate-500 border-rose-200 bg-[linear-gradient(to_bottom,#fecdd3_1px,transparent_1px)] bg-[size:100%_12px]'
                    : page.background === 'math_grid'
                    ? 'bg-white text-slate-500 border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:8px_8px]'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                <div className="text-center">
                  <div>{elementsCount} عنصر مرسوم</div>
                  <div className="text-[9px] opacity-70">
                    {page.background === 'chalkboard'
                      ? 'سبورة خضراء'
                      : page.background === 'arabic_ruled'
                      ? 'أسطر لغتي'
                      : page.background === 'math_grid'
                      ? 'شبكة رياضيات'
                      : 'سبورة بيضاء'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Add Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <button
          onClick={onAddPage}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شريحة / صفحة جديدة</span>
        </button>
      </div>
    </div>
  );
};
