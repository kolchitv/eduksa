import React, { useState } from 'react';
import { 
  MousePointer, 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  Star, 
  Triangle, 
  MessageSquare, 
  Cloud,
  Type, 
  Sparkles, 
  Smile, 
  Palette, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Layers, 
  FolderOpen, 
  Download, 
  Printer, 
  Wrench,
  ChevronDown,
  ChevronUp,
  Flame,
  Check
} from 'lucide-react';
import { ToolType, ShapeType, BoardBackgroundType } from './types';

interface WhiteboardToolbarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  currentColor: string;
  onChangeColor: (color: string) => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  currentShape: ShapeType;
  onSelectShape: (shape: ShapeType) => void;
  currentBackground: BoardBackgroundType;
  onChangeBackground: (bg: BoardBackgroundType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearPage: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenStickers: () => void;
  onOpenToolsModal: () => void;
  onOpenPagesSidebar: () => void;
  onOpenBoardsModal: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#059669', // Emerald
  '#2563eb', // Blue
  '#dc2626', // Red
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#ffffff', // White (useful on chalkboard/dark)
];

const STROKE_WIDTHS = [2, 4, 8, 14, 22];

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  currentTool,
  onSelectTool,
  currentColor,
  onChangeColor,
  strokeWidth,
  onChangeStrokeWidth,
  currentShape,
  onSelectShape,
  currentBackground,
  onChangeBackground,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearPage,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
  onOpenStickers,
  onOpenToolsModal,
  onOpenPagesSidebar,
  onOpenBoardsModal,
  onExportPNG,
  onExportPDF,
  onPrint,
  pageNumber,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  const [shapesDropdownOpen, setShapesDropdownOpen] = useState<boolean>(false);
  const [backgroundDropdownOpen, setBackgroundDropdownOpen] = useState<boolean>(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 w-full max-w-7xl mx-auto px-2 select-none">
      {/* Top Floating Mini-Nav Bar for Page Navigation & Quick Actions */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 sm:px-4 shadow-md border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        {/* Left Side: Boards & Pages Control */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenBoardsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
            title="إدارة السبورات والمجلدات"
          >
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">سبوراتي ومجلداتي</span>
          </button>

          {/* Page Carousel Nav */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={onPrevPage}
              disabled={pageNumber <= 1}
              className="px-2 py-1 bg-white hover:bg-slate-50 disabled:opacity-40 rounded-lg text-slate-700 shadow-2xs transition-colors"
              title="الصفحة السابقة"
            >
              ◀
            </button>
            <button
              onClick={onOpenPagesSidebar}
              className="px-2 py-1 text-slate-800 hover:text-emerald-700 font-extrabold flex items-center gap-1"
              title="عرض كافة الشرائح"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pageNumber} / {totalPages}</span>
            </button>
            <button
              onClick={onNextPage}
              disabled={pageNumber >= totalPages}
              className="px-2 py-1 bg-white hover:bg-slate-50 disabled:opacity-40 rounded-lg text-slate-700 shadow-2xs transition-colors"
              title="الصفحة التالية"
            >
              ▶
            </button>
          </div>

          {/* Background Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setBackgroundDropdownOpen(!backgroundDropdownOpen);
                setShapesDropdownOpen(false);
                setExportDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              title="تغيير خلفية ونوع السبورة"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">الخلفية:</span>
              <span className="text-emerald-900">
                {currentBackground === 'chalkboard'
                  ? 'خضراء كلاسيكية'
                  : currentBackground === 'arabic_ruled'
                  ? 'أسطر لغتي'
                  : currentBackground === 'math_grid'
                  ? 'شبكة رياضيات'
                  : currentBackground === 'dark'
                  ? 'داكنة'
                  : currentBackground === 'warm_sepia'
                  ? 'ورق عاجي'
                  : 'بيضاء'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {backgroundDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1">اختر نوع وخلفية السبورة:</div>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { id: 'white', label: '⬜ سبورة بيضاء نظيفة', desc: 'للكتابة والرسم العام' },
                    { id: 'chalkboard', label: '🟩 سبورة خضراء كلاسيكية', desc: 'مثل سبورة الفصل الحقيقية' },
                    { id: 'arabic_ruled', label: '📝 أسطر كراس لغتي', desc: 'سطر أساس ملون لتحسين الخط' },
                    { id: 'math_grid', label: '📐 شبكة مربعات رياضيات', desc: 'للأشكال الهندسية والرياضيات' },
                    { id: 'dot_grid', label: '▫️ شبكة نقاط تفاعلية', desc: 'للتوصيل والرسم الدقيق' },
                    { id: 'warm_sepia', label: '📜 ورق عاجي مريح للعين', desc: 'للقراءة والدروس المطولة' },
                    { id: 'dark', label: '⬛ سبورة داكنة حديثة', desc: 'للعرض المريح على البروجكتر' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        onChangeBackground(bg.id as BoardBackgroundType);
                        setBackgroundDropdownOpen(false);
                      }}
                      className={`flex flex-col text-right p-2 rounded-xl text-xs transition-colors ${
                        currentBackground === bg.id
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-extrabold">{bg.label}</span>
                      <span className="text-[10px] text-slate-400">{bg.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tools, Export, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interactive Classroom Tools (Timer / Wheel / Scoreboard) */}
          <button
            onClick={onOpenToolsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-xs transition-transform active:scale-95"
            title="أدوات المعلم (المؤقت، قرص الأسماء، نقاط الطلاب)"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>أدوات الفصل ⏱️🎡</span>
          </button>

          {/* Stickers & Stamps */}
          <button
            onClick={onOpenStickers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-xs transition-transform active:scale-95"
            title="إدراج أختام وملصقات تعزيز"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>الملصقات والأختام 🌟</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setExportDropdownOpen(!exportDropdownOpen);
                setBackgroundDropdownOpen(false);
                setShapesDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              title="تصدير وطباعة السبورة"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">تصدير</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onExportPNG();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 text-right transition-colors"
                >
                  <span>🖼️</span>
                  <span>حفظ كصورة عادية (PNG)</span>
                </button>

                <button
                  onClick={() => {
                    onExportPDF();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 text-right transition-colors"
                >
                  <span>📄</span>
                  <span>تصدير كـ ملف PDF للطباعة</span>
                </button>

                <button
                  onClick={() => {
                    onPrint();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 text-right transition-colors"
                >
                  <span>🖨️</span>
                  <span>طباعة مباشرة</span>
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Presentation Mode */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
            title={isFullscreen ? 'الخروج من ملء الشاشة' : 'وضع العرض وملء الشاشة للشرح'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Bottom Floating Canvas Tools Deck */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Main Drawing Tools Group */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          {/* Selection Tool */}
          <button
            onClick={() => onSelectTool('select')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'select'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="أداة التحديد والتحريك (Select)"
          >
            <MousePointer className="w-4 h-4" />
            <span className="hidden sm:inline">تحديد</span>
          </button>

          {/* Pen Tool */}
          <button
            onClick={() => onSelectTool('pen')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'pen'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="قلم حر للكتابة والرسم (Pen)"
          >
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">قلم</span>
          </button>

          {/* Highlighter Tool */}
          <button
            onClick={() => onSelectTool('highlighter')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'highlighter'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="قلم تحديد شفاف للكلمات والأسطر (Highlighter)"
          >
            <Highlighter className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">تظليل</span>
          </button>

          {/* Eraser Tool */}
          <button
            onClick={() => onSelectTool('eraser')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'eraser'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="ممحاة ذكية (Eraser)"
          >
            <Eraser className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">ممحاة</span>
          </button>

          {/* Shapes Tool & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                onSelectTool('shape');
                setShapesDropdownOpen(!shapesDropdownOpen);
                setBackgroundDropdownOpen(false);
                setExportDropdownOpen(false);
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentTool === 'shape'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="أشكال هندسية ورموز"
            >
              {currentShape === 'rectangle' && <Square className="w-4 h-4" />}
              {currentShape === 'circle' && <Circle className="w-4 h-4" />}
              {currentShape === 'line' && <Minus className="w-4 h-4" />}
              {currentShape === 'arrow' && <ArrowRight className="w-4 h-4" />}
              {currentShape === 'star' && <Star className="w-4 h-4" />}
              {currentShape === 'triangle' && <Triangle className="w-4 h-4" />}
              {currentShape === 'speech_bubble' && <MessageSquare className="w-4 h-4" />}
              {currentShape === 'cloud' && <Cloud className="w-4 h-4" />}
              <span className="hidden sm:inline">أشكال</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {shapesDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 grid grid-cols-2 gap-1 animate-in fade-in">
                {[
                  { id: 'rectangle', label: 'مستطيل', icon: Square },
                  { id: 'circle', label: 'دائرة', icon: Circle },
                  { id: 'line', label: 'خط مستقيم', icon: Minus },
                  { id: 'arrow', label: 'سهم توجيه', icon: ArrowRight },
                  { id: 'triangle', label: 'مثلث', icon: Triangle },
                  { id: 'star', label: 'نجمة', icon: Star },
                  { id: 'speech_bubble', label: 'صندوق حوار', icon: MessageSquare },
                  { id: 'cloud', label: 'سحابة أفكار', icon: Cloud },
                ].map((sh) => {
                  const Icon = sh.icon;
                  return (
                    <button
                      key={sh.id}
                      onClick={() => {
                        onSelectShape(sh.id as ShapeType);
                        onSelectTool('shape');
                        setShapesDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors ${
                        currentShape === sh.id
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sh.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Text Tool */}
          <button
            onClick={() => onSelectTool('text')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'text'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="إدراج نص عربي وتشكيل (Text)"
          >
            <Type className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">نص عربي</span>
          </button>

          {/* Laser Pointer */}
          <button
            onClick={() => onSelectTool('laser')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentTool === 'laser'
                ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="مؤشر ليزري متحرك للشرح المباشر (Laser Pointer)"
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">ليزر</span>
          </button>
        </div>

        {/* Middle: Color Swatches & Stroke Width Selector */}
        <div className="flex items-center gap-2 sm:gap-3 border-t sm:border-t-0 sm:border-r sm:border-l border-slate-200/80 pt-1 sm:pt-0 sm:px-3">
          {/* Color Swatches */}
          <div className="flex items-center gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onChangeColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform transform active:scale-95 ${
                  currentColor.toLowerCase() === c.toLowerCase()
                    ? 'border-emerald-600 scale-110 shadow-sm ring-2 ring-emerald-300'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                title={`لون: ${c}`}
              />
            ))}
            {/* Custom Color Input */}
            <label className="relative w-6 h-6 rounded-full border-2 border-slate-300 overflow-hidden cursor-pointer flex items-center justify-center hover:scale-105 transition-transform" title="لون مخصص">
              <span className="text-[10px]">🌈</span>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onChangeColor(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>

          {/* Stroke Width Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => onChangeStrokeWidth(w)}
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                  strokeWidth === w ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-500 hover:bg-slate-200'
                }`}
                title={`سماكة الخط: ${w}px`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: `${Math.min(12, Math.max(3, w / 1.5))}px`, height: `${Math.min(12, Math.max(3, w / 1.5))}px` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions: Undo, Redo, Zoom, Clear */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="تراجع (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="إعادة (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl text-slate-700 text-xs font-bold">
            <button
              onClick={onZoomOut}
              className="p-1 hover:bg-white rounded-lg transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              className="px-1.5 py-0.5 hover:bg-white rounded-lg transition-colors font-mono text-[11px]"
              title="إعادة ضبط الحجم"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="p-1 hover:bg-white rounded-lg transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear Page */}
          <button
            onClick={onClearPage}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="مسح محتويات الصفحة الحالية"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
