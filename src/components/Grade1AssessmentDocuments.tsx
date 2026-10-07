import { GRADE1_ASSESSMENT_DOCUMENTS } from '../data/grade1AssessmentDocuments';

export const Grade1AssessmentDocuments = () => (
  <section dir="rtl" className="rounded-3xl border border-rose-200 bg-white p-6 space-y-4">
    <h2 className="text-xl font-bold text-slate-900">ملفات الاختبارات والمراجعة — الصف الأول الابتدائي</h2>
    <p className="text-sm text-slate-600">الفصل الدراسي الأول • الفترة الأولى / الوحدة الأولى: أسرتي • ٩ ملفات PDF للطباعة والمراجعة</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GRADE1_ASSESSMENT_DOCUMENTS.map(document => (
        <article key={document.id} className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
          <h3 className="font-bold text-slate-900">{document.title}</h3>
          {document.author && <p className="text-sm text-slate-600">إعداد: {document.author}</p>}
          <p className="text-sm text-slate-500">PDF • عدد الصفحات: {document.pages}</p>
          <div className="mt-auto flex flex-wrap gap-3 text-sm font-bold">
            <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-rose-700 underline" aria-label={`عرض ${document.title} في نافذة جديدة`}>عرض الملف</a>
            <a href={document.url} download={document.filename} className="text-indigo-700 underline" aria-label={`تحميل ${document.title}`}>تحميل PDF</a>
          </div>
        </article>
      ))}
    </div>
  </section>
);
