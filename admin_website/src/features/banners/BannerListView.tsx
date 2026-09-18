"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { Banner } from "./types";
import {
  getStoredBanners,
  fetchBannersFromSupabase,
  saveBanner,
  deleteBanner,
  reorderBanners,
} from "./bannerService";

export function BannerListView() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const live = await fetchBannersFromSupabase();
      setBanners(live);
    } catch (err) {
      console.warn("Load banners notice:", err);
      setBanners(getStoredBanners());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Instant 0ms cache
    setBanners(getStoredBanners());

    // 2. Fetch live data
    loadData();

    // 3. Multi-window broadcast sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("mex_tanim_banners_channel");
        channel.onmessage = (event) => {
          if (event.data?.type === "BANNERS_UPDATED") {
            setBanners(getStoredBanners());
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    await deleteBanner(id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showSuccess("Banner deleted successfully.");
  };

  const handleToggleStatus = async (banner: Banner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    await saveBanner(updated);
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? updated : b))
    );
    showSuccess(`Banner set to ${updated.isActive ? "Active" : "Inactive"}.`);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const copy = [...banners];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = await reorderBanners(copy);
    setBanners(reordered);
    showSuccess("Banner sequence updated.");
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md border border-emerald-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-100 tracking-tight">Hero Banners</h1>
            <p className="text-xs text-slate-400">Manage promotional slides, order & media</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            title="Reload from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/banners/add"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl animate-in fade-in text-xs font-bold shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Banners List Cards */}
      {banners.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">No Banners Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add promotional banners to highlight sales, top gaming gadgets, and special deals on the store front.
          </p>
          <Link
            href="/banners/add"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Banner</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((item, index) => (
            <div
              key={item.id}
              className={`bg-slate-900/70 border rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.isActive
                  ? "border-slate-800 hover:border-slate-700 shadow-md"
                  : "border-slate-800/40 opacity-60 bg-slate-950/40"
              }`}
            >
              {/* Left Column: Sequence, Thumbnail & Details */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Sequence Badge */}
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-inner">
                  #{item.sequence}
                </div>

                {/* Banner Thumbnail Preview */}
                <div className="w-24 sm:w-32 aspect-[21/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shrink-0 relative group">
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Banner"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Text Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                      {item.titleBn || item.title || "Untitled Banner"}
                    </h3>
                    {item.badgeText && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.badgeText}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {item.isActive ? "Live" : "Draft"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {item.subtitleBn || item.subtitle || "No subtitle text"}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                    <span>Button: {item.buttonText || "Shop Now"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate text-slate-400">
                      <ExternalLink className="w-2.5 h-2.5" />
                      {item.buttonLink || "#products"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions (Reorder, Status, Edit, Delete) */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {/* Reorder Buttons */}
                <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                    title="Move Up in Sequence"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === banners.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                    title="Move Down in Sequence"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Active Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    item.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                  title={item.isActive ? "Click to disable" : "Click to enable"}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </button>

                {/* Edit Button */}
                <Link
                  href={`/banners/edit/${item.id}`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer inline-flex items-center justify-center"
                  title="Edit Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Link>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 transition cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
