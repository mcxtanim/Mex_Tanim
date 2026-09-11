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
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Store Settings & Configuration</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Control delivery charges, WhatsApp contact, announcement text & store branding
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved & Synced!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Store Info Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Store className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">General Store Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Store Brand Name</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">WhatsApp Order Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 8801317170609"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Fees Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Truck className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm font-bold text-slate-100">Delivery Fee Rates (BDT ৳)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Inside Dhaka Charge (৳)</label>
              <input
                type="number"
                min="0"
                required
                value={settings.insideDhakaFee}
                onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Outside Dhaka Charge (৳)</label>
              <input
                type="number"
                min="0"
                required
                value={settings.outsideDhakaFee}
                onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banners Card */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-100">Hero Banner Announcements</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Bengali Announcement Text</label>
              <input
                type="text"
                required
                value={settings.announcementBn}
                onChange={(e) => setSettings({ ...settings, announcementBn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">English Announcement Text</label>
              <input
                type="text"
                required
                value={settings.announcementEn}
                onChange={(e) => setSettings({ ...settings, announcementEn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
