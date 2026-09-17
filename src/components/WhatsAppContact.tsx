import React, { useState } from 'react';
import { MessageCircle, ExternalLink, X, Phone, CheckCircle2, Send, Sparkles } from 'lucide-react';

interface WhatsAppContactProps {
  phoneNumber?: string;
  displayNumber?: string;
  variant?: 'compact' | 'inline' | 'banner';
}

export const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber = '33773659697',
  displayNumber = '+33 7 73 65 96 97',
  variant = 'compact'
}) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  if (variant === 'compact') {
    return (
      <>
        {/* Compact In-Page WhatsApp Button (Non-floating, fits inside header or toolbars) */}
        <div className="inline-flex items-center">
          <button
            id="whatsapp-header-btn"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 group"
            title={`تواصل واتساب: ${displayNumber}`}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-2.5 h-2.5" />
            </div>
            <span className="hidden sm:inline">واتساب الدروس</span>
            <span className="text-[10px] font-mono font-normal opacity-75 hidden lg:inline" dir="ltr">
              {displayNumber}
            </span>
          </button>
        </div>

        {/* Modal when clicked */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-alexandria">
                      واتساب الدروس والمعلومات
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-bold font-mono" dir="ltr">
                      {displayNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                مرحباً بكم! يسعدنا تواصلكم المباشر عبر الواتساب للاستفسار عن الدروس، المتابعة التعليمية، وتأسيس القراءة والإملاء.
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
                    onClick={() => setModalOpen(false)}
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
                onClick={() => setModalOpen(false)}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة فورية عبر واتساب ({displayNumber})</span>
              </a>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div className="text-right">
          <h4 className="text-xs font-bold text-emerald-950">واتساب الاستفسارات والدروس</h4>
          <p className="text-[11px] text-emerald-800 font-mono" dir="ltr">{displayNumber}</p>
        </div>
      </div>
      <a
        href={getWhatsAppUrl('السلام عليكم ورحمة الله، أود الاستفسار عن دروس ومعلومات مقرر لغتي.')}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>تواصل الآن</span>
      </a>
    </div>
  );
};
