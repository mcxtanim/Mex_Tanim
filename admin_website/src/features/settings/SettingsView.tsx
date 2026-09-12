"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Phone, Truck, Megaphone, Store } from "lucide-react";
import { StoreSettings } from "./types";
import { getStoredSettings, saveStoredSettings } from "./settingsService";

export function SettingsView() {
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl font-sans">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">Settings</h1>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Store Info Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Store Info</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Store Name</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">WhatsApp Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="8801317170609"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Fees Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Truck className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Delivery Fees (৳)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Inside Dhaka (৳)</label>
              <input
                type="number"
                min="0"
                required
                value={settings.insideDhakaFee}
                onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Outside Dhaka (৳)</label>
              <input
                type="number"
                min="0"
                required
                value={settings.outsideDhakaFee}
                onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banners Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Banner Announcements</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Bengali Announcement</label>
              <input
                type="text"
                required
                value={settings.announcementBn}
                onChange={(e) => setSettings({ ...settings, announcementBn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">English Announcement</label>
              <input
                type="text"
                required
                value={settings.announcementEn}
                onChange={(e) => setSettings({ ...settings, announcementEn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>
        </div>



        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
