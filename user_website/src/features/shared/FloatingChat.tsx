'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useStoreSettings, formatWhatsAppUrl, formatMessengerUrl, formatTelegramUrl } from './storeSettingsService';

/**
 * হোয়াটসঅ্যাপ অফার গ্রুপ লিংক (WhatsApp Group Link):
 * আপনি আপনার গ্রুপের লিংক সরাসরি এখানে বসাতে পারেন অথবা অ্যাডমিন প্যানেল (Admin Settings) থেকেও পরিবর্তন করতে পারেন।
 */
export const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/MexTanimStore';

export const FloatingChat: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const settings = useStoreSettings();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle WhatsApp Group Chat Click
  const handleWhatsAppClick = () => {
    const targetLink =
      settings.whatsappGroupLink?.trim() ||
      (settings.whatsappNumber?.includes('chat.whatsapp.com') ? settings.whatsappNumber.trim() : '') ||
      WHATSAPP_GROUP_LINK ||
      settings.whatsappNumber;

    const url = formatWhatsAppUrl(targetLink);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://chat.whatsapp.com/', '_blank', 'noopener,noreferrer');
    }
  };

  // Handle Telegram Chat Click
  const handleTelegramClick = () => {
    const targetLink = settings.telegramLink || settings.telegramUsername || 'https://t.me/mextanimstore';
    const url = formatTelegramUrl(targetLink);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://t.me/', '_blank', 'noopener,noreferrer');
    }
  };

  // Handle Messenger Chat Click
  const handleMessengerClick = () => {
    const targetLink = settings.messengerLink || settings.messengerUsername || 'https://m.me/mextanimstore';
    const url = formatMessengerUrl(targetLink);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://m.me/', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Wave animation styles */}
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

      {/* Support Chat Popup Modal (Matching Reference Image) */}
      {isMenuOpen && (
        <div className="w-[280px] sm:w-[310px] bg-[#0c1424] text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-white font-bold text-base sm:text-[17px] tracking-wide">
              Support এ কথা বলুন
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Support Channel Buttons */}
          <div className="space-y-2.5">
            {/* 1. WhatsApp (অফার গ্রুপ) */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <WhatsAppIcon className="w-7 h-7 text-white fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-wide leading-tight">
                  WhatsApp
                </span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">
                  অফার গ্রুপ
                </span>
              </div>
            </button>

            {/* 2. Telegram (মেসেজ করুন) */}
            <button
              onClick={handleTelegramClick}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4 text-[#0284c7] fill-current translate-x-[-1px] translate-y-[0.5px]" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.4-3.63 4-.17 4.83.52 4.77 1.07z"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-wide leading-tight">
                  Telegram
                </span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">
                  মেসেজ করুন
                </span>
              </div>
            </button>

            {/* 3. Messenger (লাইভ সাপোর্ট) */}
            <button
              onClick={handleMessengerClick}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="floatingMessengerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff5279" />
                      <stop offset="50%" stopColor="#8d44ff" />
                      <stop offset="100%" stopColor="#0099ff" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#floatingMessengerGradient)"
                    d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.218V22l3.37-1.85c.928.257 1.91.397 2.896.397 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2z"
                  />
                  <path
                    fill="#ffffff"
                    d="M13.18 14.396l-2.613-2.788-5.099 2.788 5.608-5.952 2.678 2.788 5.034-2.788-5.608 5.952z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-wide leading-tight">
                  Messenger
                </span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">
                  লাইভ সাপোর্ট
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
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
          aria-label="Contact Support"
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
