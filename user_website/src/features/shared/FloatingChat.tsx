'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingChat: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/8801317170609', '_blank', 'noopener,noreferrer');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/mextanimstore', '_blank', 'noopener,noreferrer');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/mextanimstore', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Inline styles for 3 continuous slow wave animations */}
      <style>{`
        @keyframes continuousSlowWave {
          0% {
            transform: scale(0.95);
            opacity: 0.75;
          }
          50% {
            opacity: 0.45;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .slow-wave-ring-1 {
          animation: continuousSlowWave 3.6s cubic-bezier(0.1, 0.4, 0.7, 1) infinite 0s;
        }
        .slow-wave-ring-2 {
          animation: continuousSlowWave 3.6s cubic-bezier(0.1, 0.4, 0.7, 1) infinite 1.2s;
        }
        .slow-wave-ring-3 {
          animation: continuousSlowWave 3.6s cubic-bezier(0.1, 0.4, 0.7, 1) infinite 2.4s;
        }
      `}</style>

      {/* Floating Options Menu Stack (Messenger, WhatsApp, Telegram) */}
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white/60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* 1. Messenger Option */}
          <button
            onClick={handleMessengerClick}
            className="group relative w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0073E6] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="Messenger"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Messenger
            </span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.218V22l3.37-1.85c.928.257 1.91.397 2.896.397 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.18 12.396l-2.613-2.788-5.099 2.788 5.608-5.952 2.678 2.788 5.034-2.788-5.608 5.952z"/>
            </svg>
          </button>

          {/* 2. WhatsApp Option */}
          <button
            onClick={handleWhatsAppClick}
            className="group relative w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="WhatsApp"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              WhatsApp
            </span>
            <WhatsAppIcon className="w-6 h-6 fill-current" />
          </button>

          {/* 3. Telegram Option */}
          <button
            onClick={handleTelegramClick}
            className="group relative w-12 h-12 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="Telegram"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Telegram
            </span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.4-3.63 4-.17 4.83.52 4.77 1.07z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button Container */}
      <div className="relative flex items-center justify-center">
        {!isMenuOpen && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute w-14 h-14 rounded-full border-[2.5px] border-[#0084FF]/70 slow-wave-ring-1" />
            <span className="absolute w-14 h-14 rounded-full border-[2.5px] border-[#0084FF]/70 slow-wave-ring-2" />
            <span className="absolute w-14 h-14 rounded-full border-[2.5px] border-[#0084FF]/70 slow-wave-ring-3" />
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-10 w-14 h-14 rounded-full bg-[#0084FF] hover:bg-[#0076e4] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Contact Support"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg className="w-7 h-7 text-white stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5l2.5 2.5a.7.7 0 0 0 1 0L18 16h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
