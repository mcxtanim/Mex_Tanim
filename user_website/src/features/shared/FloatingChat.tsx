'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, CheckCheck } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

export const FloatingChat: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWebChatOpen, setIsWebChatOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome chat messages
  const defaultMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      sender: 'support',
      text: language === 'bn' 
        ? '👋 স্বাগতম Mex Tanim Store গেমিং সাপোর্টে! যেকোনো গ্যাজেট বা অর্ডার সংক্রান্ত তথ্যের জন্য আমাদের লিখুন।' 
        : '👋 Welcome to Mex Tanim Store Gaming Support! Ask us anything about gaming gadgets or orders.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mex_tanim_chat_messages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return defaultMessages;
  });

  // Save messages to localStorage & sync cross-tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mex_tanim_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Sync messages from localStorage when Admin replies
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'mex_tanim_chat_messages') {
        const saved = localStorage.getItem('mex_tanim_chat_messages');
        if (saved) {
          try {
            setMessages(JSON.parse(saved));
          } catch {}
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isWebChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWebChatOpen, isTyping]);

  const generateAutoReply = (userMsg: string): string => {
    return language === 'bn'
      ? 'ধন্যবাদ! আপনার মেসেজটি আমাদের সাপোর্ট টিমের কাছে পৌঁছেছে। একজন এজেন্ট শীঘ্রই উত্তর দেবেন।'
      : 'Thank you! Your message has been received by our support team. An agent will respond shortly.';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // User message
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText.trim(),
      time: currentTime,
    };

    setMessages((prev) => [...prev, newMsg]);
    const userPrompt = messageText;
    setMessageText('');
    setIsTyping(true);

    // Simulate automatic support reply after 1.2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: generateAutoReply(userPrompt),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/8801317170609', '_blank', 'noopener,noreferrer');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/mextanimstore', '_blank', 'noopener,noreferrer');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/mextanimstore', '_blank', 'noopener,noreferrer');
  };

  const handleWebChatClick = () => {
    setIsWebChatOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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

      {/* Interactive Web Live Chat Interface Modal */}
      {isWebChatOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden flex flex-col h-[450px] animate-in slide-in-from-bottom duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{t.chatTitle || 'Gaming Support 24/7'}</h4>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {t.chatSubtitle || 'Ask us anything about gaming gadgets'}
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

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'support' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-orange-400 flex items-center justify-center text-xs shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1 flex items-center gap-1 ${
                      msg.sender === 'user' ? 'text-orange-100 justify-end' : 'text-gray-400 justify-start'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-white/80" />}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-orange-400 flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:400ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200/80 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={t.chatPlaceholder || 'Type your message...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none text-slate-800"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-40 hover:from-orange-600 hover:to-amber-600 text-white font-bold flex items-center justify-center transition shadow-md active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Options Menu Stack (Messenger, WhatsApp, Telegram, Web Chat) */}
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
            <WhatsAppIcon className="w-6 h-6 fill-current" />
          </button>

          {/* 3. Telegram Option */}
          <button
            onClick={handleTelegramClick}
            className="group relative w-12 h-12 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Telegram"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Telegram
            </span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.4-3.63 4-.17 4.83.52 4.77 1.07z"/>
            </svg>
          </button>

          {/* 4. Web Chat Option */}
          <button
            onClick={handleWebChatClick}
            className="group relative w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0073E6] text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Live Web Chat"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
              Web Chat
            </span>
            <svg className="w-6 h-6 text-white stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5l2.5 2.5a.7.7 0 0 0 1 0L18 16h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
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
            <svg className="w-7 h-7 text-white stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5l2.5 2.5a.7.7 0 0 0 1 0L18 16h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
