import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  PenTool
} from 'lucide-react';
import { GradeId } from '../types/curriculum';
import { GRADES_DATA } from '../data/curriculumData';

interface WorksheetGeneratorProps {
  currentGrade: GradeId;
  studentName: string;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  currentGrade,
  studentName
}) => {
  const currentGradeData = GRADES_DATA[currentGrade] || GRADES_DATA.foundation;
  const [worksheetType, setWorksheetType] = useState<'calligraphy' | 'spelling' | 'grammar' | 'reading'>('calligraphy');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action Header */}
      <div className="no-print bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Printer className="w-3.5 h-3.5" />
            <span>أوراق العمل والواجبات المنهجية الجاهزة للطباعة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-alexandria">
            أوراق عمل ({currentGradeData.name})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            نماذج قياسية بتصميم وزارة التعليم مع سطر تدريب الخط والتقييم الذاتي.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Worksheet Type Selector */}
          <select
            value={worksheetType}
            onChange={(e) => setWorksheetType(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="calligraphy">ورقة تحسين الخط والرسم الهجائي</option>
            <option value="spelling">ورقة تدريب الظواهر الإملائية والهمزات</option>
            <option value="grammar">ورقة التراكيب اللغوية والإعراب</option>
            <option value="reading">ورقة قياس الفهم والاستيعاب القرائي</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الورقة (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div className="printable-area bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-300 shadow-lg text-slate-900 font-sans">
        {/* Ministry Standard Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 flex items-start justify-between">
          <div className="text-xs space-y-1">
            <p className="font-bold">المملكة العربية السعودية</p>
            <p>وزارة التعليم</p>
            <p>مقرر: لغتي الجميلة - {currentGradeData.name}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-800 text-emerald-800 flex items-center justify-center font-bold text-xs mx-auto mb-1">
              وزارة التعليم
            </div>
            <h3 className="text-base font-extrabold font-alexandria">
              ورقة عمل وتدريب مهارات
            </h3>
          </div>

          <div className="text-xs space-y-1 text-left">
            <p><span className="font-bold">اسم الطالب/ـة:</span> {studentName || '................................'}</p>
            <p><span className="font-bold">الصف:</span> {currentGradeData.name}</p>
            <p><span className="font-bold">الدرجة:</span> ........ / ١٠</p>
          </div>
        </div>

        {/* Dynamic Worksheet Content */}
        {worksheetType === 'calligraphy' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">السؤال الأول: رسم الكلمات بخط جميل ومتناسق</h4>
              <p className="text-xs text-slate-600">اكتب الجملة التالية مرتين بخط النسخ مع مراعاة الحروف التي تنزل عن السطر:</p>
            </div>

            <div className="p-6 bg-slate-100/50 rounded-2xl text-center border border-dashed border-slate-300 my-4">
              <p className="text-2xl sm:text-3xl font-amiri font-bold text-slate-900 tracking-wider">
                العِلْمُ يَرْفَعُ بَيْتاً لا عِمَادَ لَهُ • وَالجَهْلُ يَهْدِمُ بَيْتَ العِزِّ وَالشَّرَفِ
              </p>
            </div>

            {/* Tracing Lines */}
            <div className="space-y-6 py-4">
              {[1, 2, 3].map((line) => (
                <div key={line} className="relative border-b-2 border-slate-400 pb-2">
                  <div className="absolute -top-3 right-0 text-[10px] text-slate-400">سطر الكتابة {line}</div>
                  <div className="h-8 border-b border-dashed border-slate-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {worksheetType === 'spelling' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">السؤال الأول: تصنيف الظواهر الإملائية</h4>
              <p className="text-xs text-slate-600">صنف الكلمات التالية في الجدول المخصص:</p>
              <div className="flex gap-2 flex-wrap my-3 text-sm font-amiri font-bold bg-white p-3 rounded-xl border">
                <span>(الشَّمْسُ، القَمَرُ، سَأَلَ، بَيْتٌ، شَجَرَةٌ، اسْتَغْفَرَ، أَكْرَمَ، مَسْؤُولٌ)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="border-2 border-slate-400 rounded-xl p-3">
                <p className="font-bold pb-2 border-b border-slate-300">اللام الشمسية والهمزة المتوسطة</p>
                <div className="h-28"></div>
              </div>
              <div className="border-2 border-slate-400 rounded-xl p-3">
                <p className="font-bold pb-2 border-b border-slate-300">اللام القمرية وهمزة الوصل</p>
                <div className="h-28"></div>
              </div>
              <div className="border-2 border-slate-400 rounded-xl p-3">
                <p className="font-bold pb-2 border-b border-slate-300">التاء المربوطة والمفتوحة</p>
                <div className="h-28"></div>
              </div>
            </div>
          </div>
        )}

        {worksheetType === 'grammar' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">السؤال الأول: إعراب الجملة التالية</h4>
              <p className="text-xs text-slate-600">أعرب ما تحته خط في الجملة الآتية:</p>
              <p className="text-lg font-amiri font-bold text-center my-3 text-emerald-900">
                <span className="underline decoration-2">يَقْرَأُ</span> <span className="underline decoration-2">الطَّالِبُ</span> الدَّرْسَ <span className="underline decoration-2">قِرَاءَةً</span> جَيِّدَةً.
              </p>
            </div>

            <div className="border border-slate-300 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-300">
                    <th className="p-3 w-1/3">الكلمة</th>
                    <th className="p-3 w-2/3">الإعراب بالتفصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 font-bold font-amiri text-base">يَقْرَأُ</td>
                    <td className="p-4">...........................................................................</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-amiri text-base">الطَّالِبُ</td>
                    <td className="p-4">...........................................................................</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold font-amiri text-base">قِرَاءَةً</td>
                    <td className="p-4">...........................................................................</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {worksheetType === 'reading' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">اقرأ النص ثم أجب عن الأسئلة:</h4>
              <p className="text-sm font-amiri font-bold text-slate-800 leading-relaxed my-2">
                "المَمْلَكَةُ العَرَبِيَّةُ السَّعُودِيَّةُ وَطَنُ الخَيْرِ وَالعَطَاءِ، مَهْبِطُ الوَحْيِ وَقِبْلَةُ المُسْلِمِينَ. نَفْخَرُ بِقِيَادَتِنَا الحَكِيمَةِ وَنَعْمَلُ بِجِدٍّ لِرِفْعَةِ وَطَنِنَا الحَبِيبِ."
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold mb-1">١- ما هي قبلة المسلمين المذكورة في النص؟</p>
                <div className="h-6 border-b border-slate-300"></div>
              </div>
              <div>
                <p className="font-bold mb-1">٢- استخرج من النص كلمة تحوي همزة وصل، وأخرى تحوي لاماً شمسية:</p>
                <div className="h-6 border-b border-slate-300"></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Signature Box */}
        <div className="mt-12 pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <div>توقيع المعلم/ـة: ........................</div>
          <div>ختم المدرسة</div>
          <div>ملاحظات: ........................................</div>
        </div>
      </div>
    </div>
  );
};
