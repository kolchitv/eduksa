import React, { useState } from 'react';
import { MessageCircle, Phone, MessageSquare, ExternalLink, X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface WhatsAppContactProps {
  phoneNumber?: string;
  displayNumber?: string;
}

export const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber = '33773659697',
  displayNumber = '+33 7 73 65 96 97'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getWhatsAppUrl = (customText: string) => {
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customText)}`;
  };

  const quickInquiries = [
    {
      title: 'استفسار عن دروس لغتي والمتابعة',
      text: 'السلام عليكم ورحمة الله، أود الاستفسار عن الدروس والمتابعة التعليمية لمقرر لغتي الجميلة.'
    },
    {
      title: 'معلومات التأسيس القرائي والإملائي',
      text: 'السلام عليكم، أود الحصول على معلومات وتفاصيل حول برنامج تأسيس القراءة والإملاء والحركات.'
    },
    {
      title: 'طلب شرح أو أوراق عمل خاصة',
      text: 'السلام عليكم، أود طلب مساعدة في شرح درس أو توفير أوراق عمل وتدريبات إضافية.'
    }
  ];

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2 no-print">
        {isOpen && (
          <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 mb-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-alexandria">
                    واتساب الدروس والمعلومات
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-bold" dir="ltr">
                    {displayNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              مرحباً بكم! يسعدنا تواصلكم عبر الواتساب للاستفسار عن الدروس، المتابعة التعليمية، تأسيس الحروف، وشرح مناهج لغتي الجميلة.
            </p>

            {/* Quick action buttons */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                اختر موضوع الاستفسار السريع:
              </span>
              {quickInquiries.map((inq, idx) => (
                <a
                  key={idx}
                  href={getWhatsAppUrl(inq.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-right p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-medium text-slate-800 hover:text-emerald-950 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{inq.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 mr-1" />
                </a>
              ))}
            </div>

            {/* Direct message button */}
            <a
              id="whatsapp-direct-chat-btn"
              href={getWhatsAppUrl('السلام عليكم ورحمة الله، أود الاستفسار عن دروس ومعلومات مقرر لغتي.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة فورية عبر واتساب ({displayNumber})</span>
            </a>
          </div>
        )}

        <button
          id="whatsapp-floating-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-900/25 transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white"
          title="تواصل معنا عبر واتساب للمعلومات والدروس"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></span>
          </div>
          <span className="hidden sm:inline font-bold text-xs font-alexandria">
            واتساب الدروس والمعلومات: <span dir="ltr">{displayNumber}</span>
          </span>
        </button>
      </div>
    </>
  );
};
