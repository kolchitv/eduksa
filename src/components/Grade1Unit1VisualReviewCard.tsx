import React, { useState, useRef } from 'react';
import { Volume2, Printer, Download, Maximize2, Minimize2, Check, Sparkles, RefreshCw } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface Grade1Unit1VisualReviewCardProps {
  className?: string;
  showToolbar?: boolean;
}

export const Grade1Unit1VisualReviewCard: React.FC<Grade1Unit1VisualReviewCardProps> = ({
  className = '',
  showToolbar = true
}) => {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Table Data strictly matching the uploaded worksheet image
  const letterRows = [
    {
      letter: 'م',
      name: 'ميم',
      shortVowels: [
        { char: 'مَ', sound: 'مَـ', desc: 'فتحة' },
        { char: 'مُ', sound: 'مُـ', desc: 'ضمة' },
        { char: 'مِ', sound: 'مِـ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'مَا', sound: 'مَا', desc: 'مد ألف' },
        { char: 'مُو', sound: 'مُو', desc: 'مد واو' },
        { char: 'مِي', sound: 'مِي', desc: 'مد ياء' }
      ]
    },
    {
      letter: 'ب',
      name: 'باء',
      shortVowels: [
        { char: 'بَ', sound: 'بَـ', desc: 'فتحة' },
        { char: 'بُ', sound: 'بُـ', desc: 'ضمة' },
        { char: 'بِ', sound: 'بِـ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'بَا', sound: 'بَا', desc: 'مد ألف' },
        { char: 'بُو', sound: 'بُو', desc: 'مد واو' },
        { char: 'بِي', sound: 'بِي', desc: 'مد ياء' }
      ]
    },
    {
      letter: 'ل',
      name: 'لام',
      shortVowels: [
        { char: 'لَ', sound: 'لَـ', desc: 'فتحة' },
        { char: 'لُ', sound: 'لُـ', desc: 'ضمة' },
        { char: 'لِ', sound: 'لِـ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'لَا', sound: 'لَا', desc: 'مد ألف' },
        { char: 'لُو', sound: 'لُو', desc: 'مد واو' },
        { char: 'لِي', sound: 'لِي', desc: 'مد ياء' }
      ]
    },
    {
      letter: 'د',
      name: 'دال',
      shortVowels: [
        { char: 'دَ', sound: 'دَ', desc: 'فتحة' },
        { char: 'دُ', sound: 'دُ', desc: 'ضمة' },
        { char: 'دِ', sound: 'دِ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'دَا', sound: 'دَا', desc: 'مد ألف' },
        { char: 'دُو', sound: 'دُو', desc: 'مد واو' },
        { char: 'دِي', sound: 'دِي', desc: 'مد ياء' }
      ]
    },
    {
      letter: 'ن',
      name: 'نون',
      shortVowels: [
        { char: 'نَ', sound: 'نَـ', desc: 'فتحة' },
        { char: 'نُ', sound: 'نُـ', desc: 'ضمة' },
        { char: 'نِ', sound: 'نِـ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'نَا', sound: 'نَا', desc: 'مد ألف' },
        { char: 'نُو', sound: 'نُو', desc: 'مد واو' },
        { char: 'نِي', sound: 'نِي', desc: 'مد ياء' }
      ]
    },
    {
      letter: 'ر',
      name: 'راء',
      shortVowels: [
        { char: 'رَ', sound: 'رَ', desc: 'فتحة' },
        { char: 'رُ', sound: 'رُ', desc: 'ضمة' },
        { char: 'رِ', sound: 'رِ', desc: 'كسرة' }
      ],
      longVowels: [
        { char: 'رَا', sound: 'رَا', desc: 'مد ألف' },
        { char: 'رُو', sound: 'رُو', desc: 'مد واو' },
        { char: 'رِي', sound: 'رِي', desc: 'مد ياء' }
      ]
    }
  ];

  // Two-letter words matching the uploaded image exactly
  // Row 1: مَنْ | نَبْ | لَدْ | رَدْ | نَمْ
  // Row 2: لَمْ | رَمْ | دَرْ | بَلْ | نَدْ
  const twoLetterRow1 = ['مَنْ', 'نَبْ', 'لَدْ', 'رَدْ', 'نَمْ'];
  const twoLetterRow2 = ['لَمْ', 'رَمْ', 'دَرْ', 'بَلْ', 'نَدْ'];

  const handleCellClick = (text: string, id: string) => {
    setActiveCell(id);
    audioManager.speakArabic(text, 0.75);
    setTimeout(() => {
      setActiveCell(null);
    }, 700);
  };

  const handleWordClick = (word: string) => {
    setActiveSpeakingWord(word);
    audioManager.speakArabic(word, 0.7);
    setTimeout(() => {
      setActiveSpeakingWord(null);
    }, 700);
  };

  // Play entire sheet sequentially
  const playAllAudio = async () => {
    audioManager.speakArabic('مراجعة حروف الوحدة الأولى أسرتي. الحروف بالأصوات القصيرة والأصوات الطويلة.');
  };

  // Canvas Export as PNG Image
  const handleExportAsImage = () => {
    try {
      setIsExporting(true);
      // Create high-res canvas representation of the sheet
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1750;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer light blue double frame
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(46, 46, canvas.width - 92, canvas.height - 92);

      // Header Box
      ctx.fillStyle = '#e0f2fe';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(70, 70, canvas.width - 140, 110, 24);
      ctx.fill();
      ctx.stroke();

      // Header Text
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.font = 'bold 44px Tajawal, Cairo, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('مراجعة حروف الوحدة الأولى : ', 650, 142);
      ctx.fillStyle = '#dc2626';
      ctx.fillText('أسرتي (هام)', 340, 142);

      // Banner 1: Short & Long Vowels
      ctx.fillStyle = '#ffe600';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(70, 210, canvas.width - 140, 75, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 36px Tajawal, Cairo, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('#', 1080, 260);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('الحروف بالأصوات القصيرة والأصوات الطويلة :', 580, 260);

      // Table Main Headers
      const tableX = 70;
      const tableY = 310;
      const tableWidth = canvas.width - 140;
      const colWidth = tableWidth / 6;

      // Long Sound Header (Left 3 columns)
      ctx.fillStyle = '#fecdd3';
      ctx.fillRect(tableX, tableY, colWidth * 3, 70);
      // Short Sound Header (Right 3 columns)
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(tableX + colWidth * 3, tableY, colWidth * 3, 70);

      // Table borders
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 4;
      ctx.strokeRect(tableX, tableY, tableWidth, 70);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 40px Tajawal, Cairo, sans-serif';
      ctx.fillText('الصوت الطويل', tableX + colWidth * 1.5, tableY + 50);
      ctx.fillText('الصوت القصير', tableX + colWidth * 4.5, tableY + 50);

      // Table Rows
      const rowHeight = 95;
      letterRows.forEach((row, rIdx) => {
        const currentY = tableY + 70 + rIdx * rowHeight;

        // Row background
        ctx.fillStyle = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(tableX, currentY, tableWidth, rowHeight);

        // Draw cells (RTL)
        // Short vowels (cols 3, 4, 5 in RTL terms)
        row.shortVowels.forEach((sv, cIdx) => {
          const cx = tableX + colWidth * (5 - cIdx);
          ctx.font = 'bold 50px Amiri, "Traditional Arabic", serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(sv.char, cx + colWidth / 2, currentY + 65);
        });

        // Long vowels (cols 0, 1, 2)
        row.longVowels.forEach((lv, cIdx) => {
          const cx = tableX + colWidth * (2 - cIdx);
          ctx.font = 'bold 50px Amiri, "Traditional Arabic", serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(lv.char, cx + colWidth / 2, currentY + 65);
        });

        // Row divider
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tableX, currentY + rowHeight);
        ctx.lineTo(tableX + tableWidth, currentY + rowHeight);
        ctx.stroke();
      });

      // Draw vertical column lines
      for (let i = 0; i <= 6; i++) {
        ctx.strokeStyle = i === 3 ? '#0369a1' : '#38bdf8';
        ctx.lineWidth = i === 3 ? 5 : 3;
        ctx.beginPath();
        ctx.moveTo(tableX + colWidth * i, tableY);
        ctx.lineTo(tableX + colWidth * i, tableY + 70 + 6 * rowHeight);
        ctx.stroke();
      }
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 5;
      ctx.strokeRect(tableX, tableY, tableWidth, 70 + 6 * rowHeight);

      // Banner 2: Two-Letter Words
      const banner2Y = tableY + 70 + 6 * rowHeight + 35;
      ctx.fillStyle = '#ffe600';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(70, banner2Y, canvas.width - 140, 75, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 32px Tajawal, Cairo, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('#', 1080, banner2Y + 50);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('قراءة حرفين : تهجئة الحرفين ( حرفا حرف ) ثم قراءة سريعة :', 580, banner2Y + 50);

      // Two-letter boxes
      const boxGridY = banner2Y + 105;
      const bColWidth = tableWidth / 5;
      const boxHeight = 110;

      // Row 1
      twoLetterRow1.forEach((w, idx) => {
        const bx = tableX + bColWidth * (4 - idx);
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(bx + 8, boxGridY, bColWidth - 16, boxHeight, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 54px Amiri, "Traditional Arabic", serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(w, bx + bColWidth / 2, boxGridY + 75);
      });

      // Row 2
      twoLetterRow2.forEach((w, idx) => {
        const bx = tableX + bColWidth * (4 - idx);
        const by = boxGridY + boxHeight + 20;
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(bx + 8, by, bColWidth - 16, boxHeight, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 54px Amiri, "Traditional Arabic", serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(w, bx + bColWidth / 2, by + 75);
      });

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'مراجعة-حروف-الوحدة-الأولى-أسرتي.png';
      link.href = dataUrl;
      link.click();
      setIsExporting(false);
    } catch {
      setIsExporting(false);
      window.print();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Action Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-sky-200 shadow-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🖼️
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                البطاقة المصورة لمراجعة حروف الوحدة الأولى
              </h3>
              <p className="text-[11px] text-slate-500">
                مطابقة لورقة المراجعة الرسمية المعتمدة • تفاعلية مع الصوت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playAllAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer"
              title="الاستماع للمقدمة"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استماع</span>
            </button>

            <button
              onClick={handleExportAsImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="تحميل كصورة PNG بجودة عالية"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'جاري التحميل...' : 'حفظ كصورة'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
              title="طباعة البطاقة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'عرض ملء الشاشة (السبورة الذكية)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Visual Poster Card - 100% Faithful to the provided image */}
      <div
        ref={cardRef}
        className={`mx-auto transition-all ${
          isFullscreen
            ? 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 sm:p-8 overflow-y-auto flex items-center justify-center'
            : 'max-w-2xl w-full'
        }`}
      >
        <div
          className={`relative bg-white rounded-[2rem] border-[6px] border-[#38bdf8] p-4 sm:p-6 shadow-2xl overflow-hidden transition-all ${
            isFullscreen ? 'max-w-3xl w-full max-h-[96vh] overflow-y-auto' : ''
          }`}
          style={{ direction: 'rtl' }}
        >
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition-all"
            >
              إغلاق ✕
            </button>
          )}

          {/* Inner Cyan Decorative Border */}
          <div className="border-2 border-[#0284c7] rounded-[1.5rem] p-3 sm:p-5 space-y-4 bg-gradient-to-b from-[#f8fafc] via-white to-[#f0f9ff]">
            {/* Header Box */}
            <div className="border-2 border-[#0284c7] bg-[#e0f2fe] rounded-2xl py-3 px-4 text-center shadow-xs">
              <h1 className="font-extrabold text-xl sm:text-3xl font-serif text-[#0f172a] tracking-normal">
                <span>مراجعة حروف الوحدة الأولى : </span>
                <span className="text-[#dc2626]">أسرتي </span>
                <span className="text-[#dc2626] font-bold text-lg sm:text-2xl">(هام)</span>
              </h1>
            </div>

            {/* Section 1 Yellow Banner */}
            <div className="bg-[#ffe600] border-2 border-[#b45309] rounded-xl py-2 px-3 sm:px-4 text-center shadow-xs">
              <h2 className="font-extrabold text-base sm:text-xl font-serif text-[#0f172a] flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[#dc2626] font-black text-xl font-sans">#</span>
                <span>الحروف بالأصوات القصيرة والأصوات الطويلة :</span>
              </h2>
            </div>

            {/* Vowels Master Table */}
            <div className="border-2 border-[#0369a1] rounded-xl overflow-hidden shadow-xs bg-white">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    {/* Long Vowel Sound Header (Pink) - colSpan 3 */}
                    <th
                      colSpan={3}
                      className="py-2.5 px-2 bg-[#fecdd3] text-[#0f172a] font-extrabold text-lg sm:text-2xl font-serif border-b-2 border-l-2 border-[#0369a1]"
                    >
                      الصوت الطويل
                    </th>
                    {/* Short Vowel Sound Header (Green) - colSpan 3 */}
                    <th
                      colSpan={3}
                      className="py-2.5 px-2 bg-[#bbf7d0] text-[#0f172a] font-extrabold text-lg sm:text-2xl font-serif border-b-2 border-[#0369a1]"
                    >
                      الصوت القصير
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#0369a1]">
                  {letterRows.map((row) => (
                    <tr key={row.letter} className="hover:bg-sky-50/40 transition-colors">
                      {/* Long Vowels: Alif, Waw, Yaa (Left side in table) */}
                      {row.longVowels.map((lv, lIdx) => {
                        const cellId = `lv_${row.letter}_${lIdx}`;
                        const isActive = activeCell === cellId;
                        return (
                          <td
                            key={lIdx}
                            onClick={() => handleCellClick(lv.sound, cellId)}
                            className={`py-3 sm:py-4 px-1 text-2xl sm:text-4xl font-black font-serif transition-all cursor-pointer select-none border-l-2 border-[#0369a1] ${
                              isActive
                                ? 'bg-amber-300 text-slate-950 scale-105 shadow-inner'
                                : 'text-[#0f172a] hover:bg-pink-50'
                            }`}
                            title={`انقر للاستماع: ${lv.char}`}
                          >
                            <span>{lv.char}</span>
                          </td>
                        );
                      })}

                      {/* Short Vowels: Fatha, Damma, Kasra (Right side in table) */}
                      {row.shortVowels.map((sv, sIdx) => {
                        const cellId = `sv_${row.letter}_${sIdx}`;
                        const isActive = activeCell === cellId;
                        return (
                          <td
                            key={sIdx}
                            onClick={() => handleCellClick(sv.sound, cellId)}
                            className={`py-3 sm:py-4 px-1 text-2xl sm:text-4xl font-black font-serif transition-all cursor-pointer select-none ${
                              sIdx < 2 ? 'border-l-2 border-[#0369a1]' : ''
                            } ${
                              isActive
                                ? 'bg-amber-300 text-slate-950 scale-105 shadow-inner'
                                : 'text-[#0f172a] hover:bg-emerald-50'
                            }`}
                            title={`انقر للاستماع: ${sv.char}`}
                          >
                            <span>{sv.char}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2 Yellow Banner */}
            <div className="bg-[#ffe600] border-2 border-[#b45309] rounded-xl py-2 px-3 sm:px-4 text-center shadow-xs">
              <h2 className="font-extrabold text-sm sm:text-lg font-serif text-[#0f172a] flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[#dc2626] font-black text-xl font-sans">#</span>
                <span>قراءة حرفين : تهجئة الحرفين ( حرفا حرف ) ثم قراءة سريعة :</span>
              </h2>
            </div>

            {/* Two-Letter Reading Grid (5 Columns x 2 Rows) */}
            <div className="space-y-2.5">
              {/* Row 1 */}
              <div className="grid grid-cols-5 gap-2">
                {twoLetterRow1.map((w, idx) => {
                  const isSpeaking = activeSpeakingWord === w;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleWordClick(w)}
                      className={`py-3 sm:py-4 px-1 rounded-xl border-2 border-[#0369a1] bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0f172a] font-serif font-black text-2xl sm:text-4xl transition-all shadow-xs cursor-pointer flex items-center justify-center ${
                        isSpeaking ? 'bg-amber-300 scale-105 ring-2 ring-amber-500' : ''
                      }`}
                      title={`انقر للاستماع وتهجئة: ${w}`}
                    >
                      <span>{w}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-5 gap-2">
                {twoLetterRow2.map((w, idx) => {
                  const isSpeaking = activeSpeakingWord === w;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleWordClick(w)}
                      className={`py-3 sm:py-4 px-1 rounded-xl border-2 border-[#0369a1] bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0f172a] font-serif font-black text-2xl sm:text-4xl transition-all shadow-xs cursor-pointer flex items-center justify-center ${
                        isSpeaking ? 'bg-amber-300 scale-105 ring-2 ring-amber-500' : ''
                      }`}
                      title={`انقر للاستماع وتهجئة: ${w}`}
                    >
                      <span>{w}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tip for Students & Teachers */}
            <div className="text-center pt-2 border-t border-sky-100 text-[11px] text-slate-500 font-bold flex items-center justify-center gap-2">
              <span>💡 اضغط على أي صوت أو كلمة للاستماع للنطق النموذجي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
