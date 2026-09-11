'use client';

import React, { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const FloatingChat: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWebChatOpen, setIsWebChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { t, language } = useLanguage();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    alert(`Message sent to Mex Tanim Gaming Support: "${message}"`);
    setMessage('');
    setIsWebChatOpen(false);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/8801700000000', '_blank', 'noopener,noreferrer');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/mextanimstore', '_blank', 'noopener,noreferrer');
  };

  const handleWebChatClick = () => {
    setIsWebChatOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Web Chat Interface Modal */}
      {isWebChatOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden animate-in slide-in-from-bottom duration-200">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t.chatTitle || 'Mex Tanim Support'}</h4>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {t.chatSubtitle || 'Online - Ready to help'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsWebChatOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSend} className="p-4 bg-slate-50 space-y-3">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.chatPlaceholder || 'আপনার বার্তাটি লিখুন...'}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none shadow-xs text-slate-800"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 transition shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Options Menu Stack (Matching Image 1 vertical popup rail) */}
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white/60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* 1. Messenger Option */}
          <button
            onClick={handleMessengerClick}
            className="group relative w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0073E6] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Messenger"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Messenger
            </span>
            {/* Official Messenger SVG */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.218V22l3.37-1.85c.928.257 1.91.397 2.896.397 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.18 12.396l-2.613-2.788-5.099 2.788 5.608-5.952 2.678 2.788 5.034-2.788-5.608 5.952z"/>
            </svg>
          </button>

          {/* 2. WhatsApp Option */}
          <button
            onClick={handleWhatsAppClick}
            className="group relative w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="WhatsApp"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              WhatsApp
            </span>
            {/* Official WhatsApp SVG */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </button>

          {/* 3. Web Chat Option */}
          <button
            onClick={handleWebChatClick}
            className="group relative w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0073E6] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Live Web Chat"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Web Chat
            </span>
            {/* Outline Chat Bubble SVG matching Image 2 */}
            <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button with Pulsing Wave Animation */}
      <div className="relative flex items-center justify-center">
        {/* Expanding Wave Rings (Animated ripples matching Image 2) */}
        {!isMenuOpen && (
          <>
            <span className="absolute w-24 h-24 rounded-full border-2 border-blue-400/40 animate-ping opacity-60 pointer-events-none" />
            <span className="absolute w-20 h-20 rounded-full border-2 border-blue-500/50 animate-ping opacity-80 pointer-events-none [animation-delay:400ms]" />
            <span className="absolute w-16 h-16 rounded-full bg-blue-400/20 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Trigger Button */}
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isWebChatOpen) setIsWebChatOpen(false);
          }}
          className="relative z-10 w-14 h-14 rounded-full bg-[#0084FF] hover:bg-[#0076e4] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
          title="Contact & Chat Support"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg className="w-7 h-7 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
