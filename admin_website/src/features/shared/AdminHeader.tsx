"use client";

import { Bell, Search, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { AdminHeaderProps } from "./types";

export function AdminHeader({ title = "Dashboard", subtitle = "" }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Link to Customer Store */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Quick Search */}
        <div className="relative w-44 sm:w-52 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Live Notification Indicator */}
        <button 
          className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-950 animate-pulse" />
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-emerald-400 font-black text-xs">
              MT
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight">Admin</p>
          </div>

          <button 
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
