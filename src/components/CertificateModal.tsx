import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Share2 
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  currentGrade: GradeId;
  stars: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  onUpdateStudentName,
  currentGrade,
  stars
}) => {
  if (!isOpen) return null;

  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;
  const todayDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">شهادة تفوق وتقدير في مقرر لغتي الجميلة</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">اسم الطالب:</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => onUpdateStudentName(e.target.value)}
                placeholder="اكتب اسم الطالب..."
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30">
          <div className="printable-area border-8 border-double border-emerald-800 p-8 sm:p-12 rounded-3xl bg-white relative shadow-sm">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>

            {/* Top National Identity Header */}
            <div className="flex items-center justify-between border-b-2 border-emerald-800/30 pb-6 mb-8 text-center sm:text-right">
              <div className="space-y-0.5 text-xs text-slate-700">
                <p className="font-bold text-slate-900">المملكة العربية السعودية</p>
                <p>وزارة التعليم</p>
                <p>منصة لغتي التعليمية المعتمدة</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300 flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Award className="w-9 h-9" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-alexandria tracking-tight">
                  شَهَادَةُ شُكْرٍ وَتَقْدِيرٍ
                </h1>
                <p className="text-xs text-amber-700 font-bold mt-1">
                  فِي مَنْظُومَةِ مَقَرِّرِ لُغَتِي الجَمِيلَةِ
                </p>
              </div>

              <div className="space-y-0.5 text-xs text-slate-700 text-left">
                <p className="font-bold">التاريخ: {todayDate}</p>
                <p>الصف: {currentGradeData.name}</p>
                <p className="text-emerald-700 font-bold">النقاط: {stars} نجمة ★</p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-6 my-8">
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                تَسُرُّ إِدَارَةُ مِنَصَّةِ لُغَتِي التَّعْلِيمِيَّةِ أَنْ تَمْنَحَ هَذِهِ الشَّهَادَةَ لِلْبَطَلِ / لِلْبَطَلَةِ:
              </p>

              <div className="inline-block px-12 py-3 bg-emerald-50/80 rounded-2xl border-2 border-dashed border-emerald-600 my-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-amiri text-emerald-950 tracking-wider">
                  {studentName || 'طالبـ/ـة لغتي المتميز'}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-tajawal">
                نَظِيراً لِتَمَيُّزِهِ وَإِتْقَانِهِ لِمَهَارَاتِ وَدُرُوسِ مَقَرِّرِ <span className="font-bold text-emerald-900">({currentGradeData.name})</span> وَاجْتِيَازِ اخْتِبَارَاتِ الفَهْمِ القِرَائِيِّ وَالظَّوَاهِرِ الإِمْلائِيَّةِ وَالنَّحْوِيَّةِ بِجَدَارَةٍ وَتَفَوُّقٍ.
              </p>

              <p className="text-xs sm:text-sm font-bold text-amber-700">
                سَائِلِينَ اللهَ لَهُ دَوَامَ التَّوْفِيقِ وَالنَّجَاحِ لِخِدْمَةِ وَطَنِنَا الغَالِي 🇸🇦
              </p>
            </div>

            {/* Signatures & Seals */}
            <div className="pt-8 border-t-2 border-emerald-800/30 grid grid-cols-3 items-center text-center text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-800">مُعَلِّمُ لُغَتِي</p>
                <p className="text-emerald-800 font-amiri font-bold text-sm">أ. مُعَلِّمُ المَادَّةِ</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 text-amber-800 flex flex-col items-center justify-center text-[10px] font-bold p-1">
                  <span>ختم الاعتماد</span>
                  <span className="text-[8px] text-emerald-700">١٤٤٧-١٤٤٨هـ</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-800">إِدَارَةُ المِنَصَّةِ</p>
                <p className="text-emerald-800 font-amiri font-bold text-sm">مِنَصَّةُ لُغَتِي السَّعُودِيَّة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
