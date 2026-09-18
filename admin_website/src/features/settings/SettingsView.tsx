"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Phone,
  Truck,
  Megaphone,
  Store,
  MessageCircle,
  Share2,
  ExternalLink,
  RefreshCw,
  Clock,
  Mail,
  MapPin,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Send,
} from "lucide-react";
import { StoreSettings } from "./types";
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  fetchSettingsFromSupabase,
  saveStoredSettings,
  formatWhatsAppUrl,
  formatMessengerUrl,
  formatTelegramUrl,
} from "./settingsService";

type SettingsTab = "connect" | "profile" | "social" | "delivery" | "announcement";

export function SettingsView() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<SettingsTab>("connect");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");

  useEffect(() => {
    // 1. Initial cached render
    setSettings(getStoredSettings());

    // 2. Fetch live settings from Supabase
    loadSettingsFromDatabase();
  }, []);

  const loadSettingsFromDatabase = async () => {
    setIsFetching(true);
    try {
      const live = await fetchSettingsFromSupabase();
      if (live) {
        setSettings(live);
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn("Error fetching settings:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveStoredSettings(settings);
      setSavedSuccess(true);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: any; countNotice?: string }[] = [
    { id: "connect", label: "Connect & Chat", icon: MessageCircle, countNotice: "WhatsApp, Messenger, Telegram" },
    { id: "profile", label: "Store Profile", icon: Store },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "delivery", label: "Delivery & Shipping", icon: Truck },
    { id: "announcement", label: "Announcement Bar", icon: Megaphone },
  ];

  return (
    <div className="space-y-5 max-w-5xl font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md border border-emerald-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-100 tracking-tight">Store Settings</h1>
            <p className="text-xs text-slate-400">
              Configure communication channels, store information, and order workflows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {lastSyncedTime && (
            <span className="text-[11px] text-slate-400 hidden md:inline flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Synced: {lastSyncedTime}
            </span>
          )}

          <button
            type="button"
            onClick={loadSettingsFromDatabase}
            disabled={isFetching}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            title="Reload settings from Supabase database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync Database</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl animate-in fade-in slide-in-from-top-2 text-xs font-bold shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Settings successfully saved and synced to database and customer storefront!</span>
          </div>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Body */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ========================================================================= */}
        {/* TAB 1: CONNECT & CHAT (WHATSAPP, MESSENGER, TELEGRAM)                      */}
        {/* ========================================================================= */}
        {activeTab === "connect" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Master Floating Widget Switch */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Floating Chat Bubble (Bottom-Right)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Show or hide the floating customer support bubble on the customer storefront
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableFloatingChat: !settings.enableFloatingChat })}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  settings.enableFloatingChat ? "text-emerald-400" : "text-slate-600"
                }`}
              >
                {settings.enableFloatingChat ? (
                  <ToggleRight className="w-9 h-9 fill-current" />
                ) : (
                  <ToggleLeft className="w-9 h-9 fill-current" />
                )}
              </button>
            </div>

            {/* 1. WHATSAPP CONNECT CARD */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.662.062-1.076-.071-.856-.275-1.928-1.258-2.677-2.007-.749-.749-1.732-1.821-2.007-2.677-.133-.414-.116-.764-.071-1.076.05-.333.419-1.026.824-1.17.144-.051.272-.051.378-.051.107 0 .213 0 .31.02.144.02.268.04.378.334.144.385.495 1.258.536 1.344.041.086.062.187.01.293-.052.106-.083.167-.165.253-.082.086-.175.187-.248.268-.082.086-.175.187-.072.364.103.177.454.749.979 1.218.68.608 1.247.798 1.422.889.175.091.278.071.378-.041.103-.111.443-.515.567-.697.124-.182.237-.152.392-.091.155.061 1.001.475 1.176.566.175.091.299.141.34.212.041.071.041.414-.103.819z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-100">WhatsApp Connect</h2>
                    <p className="text-xs text-slate-400">
                      Customer support & WhatsApp Direct Product Order link
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Floating Chat</span>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, enableWhatsappChat: !settings.enableWhatsappChat })}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      settings.enableWhatsappChat ? "text-[#25D366]" : "text-slate-600"
                    }`}
                    title="Toggle WhatsApp option in floating chat"
                  >
                    {settings.enableWhatsappChat ? (
                      <ToggleRight className="w-8 h-8 fill-current" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 fill-current" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    WhatsApp Number (with Country Code)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#25D366] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8801XXXXXXXXX"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#25D366]/60 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Format: 8801XXXXXXXXX. Used for WhatsApp floating chat, product direct orders, and footer support.
                  </p>
                </div>

                <div className="sm:col-span-4 flex items-center gap-2">
                  <a
                    href={formatWhatsAppUrl(settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span>Test WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Generated URL:</span>
                <span className="font-mono text-emerald-400 font-medium truncate max-w-[280px] sm:max-w-md">
                  {formatWhatsAppUrl(settings.whatsappNumber)}
                </span>
              </div>
            </div>

            {/* 2. FACEBOOK MESSENGER CONNECT CARD */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0084FF]/20 text-[#0084FF] flex items-center justify-center font-bold">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.218V22l3.37-1.85c.928.257 1.91.397 2.896.397 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.18 12.396l-2.613-2.788-5.099 2.788 5.608-5.952 2.678 2.788 5.034-2.788-5.608 5.952z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-100">Facebook Messenger Connect</h2>
                    <p className="text-xs text-slate-400">
                      Connect your Facebook Page Inbox or direct Messenger chat
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Floating Chat</span>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, enableMessengerChat: !settings.enableMessengerChat })}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      settings.enableMessengerChat ? "text-[#0084FF]" : "text-slate-600"
                    }`}
                    title="Toggle Messenger option in floating chat"
                  >
                    {settings.enableMessengerChat ? (
                      <ToggleRight className="w-8 h-8 fill-current" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 fill-current" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Messenger Username or Direct Link
                  </label>
                  <div className="relative">
                    <span className="text-[#0084FF] font-bold text-xs absolute left-3.5 top-1/2 -translate-y-1/2">
                      m.me/
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. mextanimstore"
                      value={settings.messengerUsername}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings({
                          ...settings,
                          messengerUsername: val,
                          messengerLink: formatMessengerUrl(val),
                        });
                      }}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-16 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#0084FF]/60 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enter Facebook Page username (e.g. mextanimstore) or full link (https://m.me/yourpage).
                  </p>
                </div>

                <div className="sm:col-span-4 flex items-center gap-2">
                  <a
                    href={formatMessengerUrl(settings.messengerUsername || settings.messengerLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 rounded-xl bg-[#0084FF]/15 hover:bg-[#0084FF]/25 border border-[#0084FF]/30 text-[#0084FF] text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span>Test Messenger</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Generated URL:</span>
                <span className="font-mono text-blue-400 font-medium truncate max-w-[280px] sm:max-w-md">
                  {formatMessengerUrl(settings.messengerUsername || settings.messengerLink)}
                </span>
              </div>
            </div>

            {/* 3. TELEGRAM CONNECT CARD */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center font-bold">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-100">Telegram Connect</h2>
                    <p className="text-xs text-slate-400">
                      Connect your Telegram account, support channel, or bot
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Floating Chat</span>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, enableTelegramChat: !settings.enableTelegramChat })}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      settings.enableTelegramChat ? "text-[#0088cc]" : "text-slate-600"
                    }`}
                    title="Toggle Telegram option in floating chat"
                  >
                    {settings.enableTelegramChat ? (
                      <ToggleRight className="w-8 h-8 fill-current" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 fill-current" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Telegram Username or Direct Link
                  </label>
                  <div className="relative">
                    <span className="text-[#0088cc] font-bold text-xs absolute left-3.5 top-1/2 -translate-y-1/2">
                      t.me/
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. mextanimstore"
                      value={settings.telegramUsername}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings({
                          ...settings,
                          telegramUsername: val,
                          telegramLink: formatTelegramUrl(val),
                        });
                      }}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#0088cc]/60 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enter Telegram username (e.g. mextanimstore) or full link (https://t.me/yourusername).
                  </p>
                </div>

                <div className="sm:col-span-4 flex items-center gap-2">
                  <a
                    href={formatTelegramUrl(settings.telegramUsername || settings.telegramLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-[#0088cc] text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span>Test Telegram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Generated URL:</span>
                <span className="font-mono text-sky-400 font-medium truncate max-w-[280px] sm:max-w-md">
                  {formatTelegramUrl(settings.telegramUsername || settings.telegramLink)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STORE PROFILE & CONTACT INFO                                       */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Store className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Store Profile & Customer Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Name</label>
                <input
                  type="text"
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Tagline / Slogan</label>
                <input
                  type="text"
                  value={settings.storeTagline}
                  onChange={(e) => setSettings({ ...settings, storeTagline: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Customer Helpline Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Support Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="support@mextanimstore.com"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Office / Store Physical Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Support Hours (Bengali)</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.supportHoursBn}
                    onChange={(e) => setSettings({ ...settings, supportHoursBn: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Support Hours (English)</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.supportHoursEn}
                    onChange={(e) => setSettings({ ...settings, supportHoursEn: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SOCIAL MEDIA CHANNELS                                              */}
        {/* ========================================================================= */}
        {activeTab === "social" && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Store Social Media Channels (Footer & Links)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Facebook Page URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/mextanimstore"
                  value={settings.facebookLink}
                  onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">YouTube Channel URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@mextanimstore"
                  value={settings.youtubeLink}
                  onChange={(e) => setSettings({ ...settings, youtubeLink: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Instagram Profile URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/mextanimstore"
                  value={settings.instagramLink}
                  onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">TikTok Profile URL</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@mextanimstore"
                  value={settings.tiktokLink}
                  onChange={(e) => setSettings({ ...settings, tiktokLink: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DELIVERY & SHIPPING FEES                                           */}
        {/* ========================================================================= */}
        {activeTab === "delivery" && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Truck className="w-4 h-4 text-orange-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Delivery Charges & Shipping Rules (৳)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Inside Dhaka (৳)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.insideDhakaFee}
                  onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
                <p className="text-[11px] text-slate-500">Standard charge applied at checkout for Dhaka area.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Outside Dhaka (৳)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.outsideDhakaFee}
                  onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
                <p className="text-[11px] text-slate-500">Applied for divisional & district deliveries.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Free Delivery Minimum (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
                <p className="text-[11px] text-slate-500">Set 0 to disable free delivery promotion.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BANNER ANNOUNCEMENTS                                               */}
        {/* ========================================================================= */}
        {activeTab === "announcement" && (
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Top Header Announcement Banner
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, showAnnouncement: !settings.showAnnouncement })}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  settings.showAnnouncement ? "text-amber-400" : "text-slate-600"
                }`}
              >
                {settings.showAnnouncement ? (
                  <ToggleRight className="w-8 h-8 fill-current" />
                ) : (
                  <ToggleLeft className="w-8 h-8 fill-current" />
                )}
              </button>
            </div>

            {/* Live Preview Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Preview</span>
              <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white p-2.5 rounded-xl text-xs font-bold text-center shadow-inner">
                {settings.announcementBn || "সেরা গেমিং গ্যাজেট ১ জায়গায় সব • দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট"}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Bengali Announcement Text</label>
                <input
                  type="text"
                  required
                  value={settings.announcementBn}
                  onChange={(e) => setSettings({ ...settings, announcementBn: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">English Announcement Text</label>
                <input
                  type="text"
                  required
                  value={settings.announcementEn}
                  onChange={(e) => setSettings({ ...settings, announcementEn: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Sticky Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-500">
            Changes saved here automatically update your Supabase database and Customer Storefront in real-time.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

