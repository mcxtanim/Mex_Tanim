"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Search, 
  Trash2, 
  RefreshCw, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Circle
} from "lucide-react";
import { AdminChatMessage } from "./types";
import { 
  getAdminStoredMessages, 
  sendAdminReply, 
  clearAdminMessages,
  saveAdminMessages
} from "./messageService";

export const MessagesView: React.FC = () => {
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage & sync across tabs
  const loadMessages = () => {
    const data = getAdminStoredMessages();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();

    // Listen for storage events for real-time cross-tab sync with customer website
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "mex_tanim_chat_messages") {
        loadMessages();
      }
    };

    window.addEventListener("storage", handleStorage);
    // Poll every 1.5s for seamless update
    const interval = setInterval(loadMessages, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    const updated = sendAdminReply(replyText, messages);
    setMessages(updated);
    setReplyText("");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all chat messages?")) {
      clearAdminMessages();
      loadMessages();
    }
  };

  const handleResetSeed = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mex_tanim_chat_messages");
      window.dispatchEvent(new Event("storage"));
      loadMessages();
    }
  };

  const handleQuickReply = (text: string) => {
    setReplyText(text);
  };

  // Filter messages by search query
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.customerName && msg.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
  const customerName = lastUserMsg?.customerName || "Tanvir Ahmed (Customer)";

  const quickReplies = [
    "👋 Swagatom Mex Tanim Store e! Kina sahajjo korte pari?",
    "🚚 Dhaka ৳60 (24-48 hr), Outside ৳120 (2-3 days). Cash on delivery available!",
    "✅ 100% Authentic product stock e ache!",
    "📦 Apnar order ID ta bolle amra track kore dichhi."
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Live Customer Messages / Inbox
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time web chat communication center with customer website users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSeed}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            title="Reset sample chat data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            Reset Data
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Inbox
          </button>
        </div>
      </div>

      {/* Main 2-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px]">
        {/* Left Column: Customer Conversations Thread List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden">
          {/* Thread Header & Search */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "all"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                All Threads ({messages.length})
              </button>
            </div>
          </div>

          {/* Customer Threads List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {/* Live Web Chat Customer Item */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 rounded-xl border border-emerald-500/30 cursor-pointer transition shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-sm">
                      {customerName.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                      {customerName}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                        Live Web
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {lastUserMsg ? lastUserMsg.text : "No recent message"}
                    </p>
                  </div>
                </div>
                {lastUserMsg && (
                  <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                    {lastUserMsg.time}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat History & Reply Form (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                  {customerName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  {customerName}
                  <span className="text-[11px] text-emerald-400 font-normal flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" /> Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" /> 01700-000000
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Customer
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/30 scrollbar-thin">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <MessageSquare className="w-12 h-12 stroke-[1.5] text-slate-600 mb-2 animate-bounce" />
                <p className="text-sm font-medium">No messages found in this chat.</p>
                <p className="text-xs text-slate-600">Send a reply below or write from the customer website.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${
                    msg.sender === "support" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-xs shrink-0 shadow-xs">
                      <User className="w-4 h-4 text-orange-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-md ${
                      msg.sender === "support"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none border border-emerald-500/30"
                        : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center gap-1.5 ${
                        msg.sender === "support" ? "text-emerald-100 justify-end" : "text-slate-400 justify-start"
                      }`}
                    >
                      <Clock className="w-3 h-3 opacity-70" />
                      <span>{msg.time}</span>
                      {msg.sender === "support" && <CheckCheck className="w-3.5 h-3.5 text-white/90" />}
                    </div>
                  </div>

                  {msg.sender === "support" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar */}
          <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Replies:
            </span>
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(qr)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition"
              >
                {qr.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* Reply Form Input */}
          <form onSubmit={handleSendReply} className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-3 shrink-0">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type support reply to customer..."
              className="flex-1 px-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
            >
              <span>Send Reply</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
