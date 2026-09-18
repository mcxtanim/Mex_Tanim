"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Layers,
  Sparkles,
  Tag,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Flame,
  ShoppingBag,
  Eye,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Banner } from "./types";
import { getBannerById, saveBanner, getStoredBanners, fetchBannersFromSupabase } from "./bannerService";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface BannerFormViewProps {
  bannerId?: string;
}

export function BannerFormView({ bannerId }: BannerFormViewProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Banner>({
    id: bannerId || `banner-${Date.now()}`,
    title: "",
    titleBn: "",
    subtitle: "",
    subtitleBn: "",
    badgeText: "Exclusive Deals",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "",
    sequence: 1,
    isActive: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (bannerId) {
      const existing = getBannerById(bannerId);
      if (existing) {
        setFormData(existing);
      } else {
        fetchBannersFromSupabase().then((list) => {
          const found = list.find((b) => String(b.id) === String(bannerId));
          if (found) {
            setFormData(found);
          }
        });
      }
    } else {
      // Calculate next sequence automatically
      const current = getStoredBanners();
      const nextSeq = current.length > 0 ? Math.max(...current.map((b) => b.sequence || 1)) + 1 : 1;
      setFormData((prev) => ({
        ...prev,
        sequence: nextSeq,
      }));
    }
  }, [bannerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      setErrorMsg("Please upload an image or provide an image URL before saving.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      await saveBanner(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/banners");
      }, 500);
    } catch (err: any) {
      console.error("Save banner error:", err);
      setErrorMsg(err?.message || "Failed to save banner.");
      setIsSaving(false);
    }
  };

  const isEdit = Boolean(bannerId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/banners"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition active:scale-95"
            title="Back to Hero Banners"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                {isEdit ? "Edit Slide" : "New Slide"}
              </span>
              <h1 className="text-lg font-black text-slate-100 tracking-tight">
                {isEdit ? "Edit Hero Banner" : "Add New Hero Banner"}
              </h1>
            </div>
            <p className="text-xs text-slate-400">Configure promotional slide content, sequence & assets</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/banners"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Banner</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Image Upload Dropzone Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md">
            <ImageUploadDropzone
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />
          </div>

          {/* 2. Sequence & Visibility Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Display Sequence</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.sequence}
                  onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="1, 2, 3..."
                />
                <p className="text-[10px] text-slate-400">Controls order in slider (1 appears first)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Visibility Status</label>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 border border-slate-700/60 rounded-xl h-[42px]">
                  <span className="text-xs font-medium text-slate-300">
                    {formData.isActive ? "Active (Live on store)" : "Inactive (Hidden)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`p-0.5 rounded-full transition cursor-pointer ${
                      formData.isActive ? "text-emerald-400" : "text-slate-600"
                    }`}
                  >
                    {formData.isActive ? (
                      <ToggleRight className="w-7 h-7 fill-current" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Titles & Subtitles Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Banner Headings & Taglines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bengali Title</label>
                <input
                  type="text"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="e.g. সেরা গেমিং গ্যাজেট ১ জায়গাতেই সব"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">English Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Top Gaming Gadgets in One Place"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bengali Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitleBn}
                  onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                  placeholder="e.g. দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">English Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. 100% Authentic Products at Best Price in BD"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Action Button & Badge Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Badge & Button Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Badge Text</span>
                </label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. Exclusive Deals"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="e.g. Shop Now"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                  <span>Target Link</span>
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="#products, /categories"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Storefront Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Storefront Preview</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Slide #{formData.sequence}</span>
            </div>

            {/* Preview Banner Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[21/9] flex items-center justify-center shadow-2xl">
              {formData.imageUrl ? (
                <>
                  <img
                    src={formData.imageUrl}
                    alt="Banner Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Upload an image to see live preview</p>
                </div>
              )}

              {/* Title & Subtitle Preview */}
              {(formData.titleBn || formData.title) && (
                <div className="absolute top-4 left-4 z-10 max-w-[85%] pointer-events-none">
                  <h4 className="text-xs sm:text-sm font-black text-white drop-shadow leading-tight line-clamp-1">
                    {formData.titleBn || formData.title}
                  </h4>
                  {(formData.subtitleBn || formData.subtitle) && (
                    <p className="text-[10px] text-slate-200 drop-shadow line-clamp-1 mt-0.5">
                      {formData.subtitleBn || formData.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Badge Preview */}
              {formData.badgeText && (
                <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded-full border border-orange-500/40">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] font-black text-white">
                    Mex Tanim <span className="text-orange-400">{formData.badgeText}</span>
                  </span>
                </div>
              )}

              {/* Button Preview */}
              {formData.buttonText && (
                <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] rounded-xl shadow">
                  <ShoppingBag className="w-3 h-3" />
                  <span>{formData.buttonText}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-200">💡 Tips:</p>
              <p>• Ideal aspect ratio is 21:9 or 1920×600 px for desktop & mobile.</p>
              <p>• Banners auto-cycle every 3.5 seconds on the customer storefront.</p>
            </div>

            {/* Bottom Save Action */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Banner...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Banner</span>
                </>
              )}
            </button>

          </div>
        </div>

      </form>

    </div>
  );
}
