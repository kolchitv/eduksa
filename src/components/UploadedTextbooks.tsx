import { UPLOADED_TEXTBOOKS } from '../data/uploadedTextbooks';

export const UploadedTextbooks = ({ grade, query }: { grade: string; query: string }) => {
  const books = UPLOADED_TEXTBOOKS.filter(book =>
    (grade === 'all' || book.grade === grade) &&
    `${book.title} ${book.edition}`.includes(query.trim())
  );
  if (!books.length) return null;
  return (
    <section dir="rtl" className="rounded-3xl border border-emerald-200 bg-white p-6 space-y-4">
      <h2 className="text-xl font-bold text-slate-900">الكتب المدرسية المتاحة بصيغة PDF</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map(book => (
          <article key={book.id} className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900">{book.title}</h3>
            <p className="text-sm text-slate-600">طبعة {book.edition} • عدد صفحات الملف: {book.pages}</p>
            <div className="mt-auto flex flex-wrap gap-3 text-sm font-bold">
              <a href={book.url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline" aria-label={`عرض ${book.title} في نافذة جديدة`}>عرض الكتاب</a>
              <a href={book.url} download={book.filename} className="text-indigo-700 underline" aria-label={`تحميل ${book.title}`}>تحميل PDF</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
