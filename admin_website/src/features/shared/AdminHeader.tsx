"use client";

import { Bell, Search, ExternalLink } from "lucide-react";
import { AdminHeaderProps } from "./types";

export function AdminHeader({ title = "Dashboard", subtitle = "Overview & Store Analytics" }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-slate-100">{title}</h1>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Link to Customer Store */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <span>Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Quick Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog, orders..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Live Notification Indicator */}
        <button className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-900 animate-pulse"></span>
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 font-semibold text-xs">
              AD
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-200">Tanim Admin</p>
            <p className="text-[10px] text-slate-400">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
