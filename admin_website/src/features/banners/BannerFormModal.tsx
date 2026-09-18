"use client";

import React, { useState, useEffect } from "react";
import { X, Save, RefreshCw, Layers, Sparkles, Tag, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { Banner } from "./types";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface BannerFormModalProps {
  banner?: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Banner) => Promise<void>;
  nextSequence: number;
}

export function BannerFormModal({
  banner,
  isOpen,
  onClose,
  onSave,
  nextSequence,
}: BannerFormModalProps) {
  const [formData, setFormData] = useState<Banner>({
    id: "",
    title: "",
    titleBn: "",
    subtitle: "",
    subtitleBn: "",
    badgeText: "Exclusive Deals",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "",
    sequence: nextSequence,
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (banner) {
      setFormData(banner);
    } else {
      setFormData({
        id: `banner-${Date.now()}`,
        title: "",
        titleBn: "",
        subtitle: "",
        subtitleBn: "",
        badgeText: "Exclusive Deals",
        buttonText: "Shop Now",
        buttonLink: "#products",
        imageUrl: "",
        sequence: nextSequence,
        isActive: true,
      });
    }
    setErrorMsg("");
  }, [banner, isOpen, nextSequence]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setErrorMsg("Please upload or provide a banner image.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error("Save banner error:", err);
      setErrorMsg(err.message || "Failed to save banner.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-100">
                {banner ? "Edit Hero Banner" : "Add New Hero Banner"}
              </h2>
              <p className="text-[11px] text-slate-400">Configure banner text, sequence & media</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(85vh-8rem)] overflow-y-auto scrollbar-thin">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* 1. Image Upload Dropzone */}
          <ImageUploadDropzone
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          {/* 2. Sequence & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
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
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="1, 2, 3..."
              />
              <p className="text-[10px] text-slate-500">Order 1 slides first, followed by 2, 3, etc.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">Visibility Status</label>
              <div className="flex items-center justify-between p-2 bg-slate-800/50 border border-slate-700/60 rounded-xl">
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

          {/* 3. Banner Texts: Title (Bengali & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">Bengali Title</label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="e.g. সেরা গেমিং গ্যাজেট ১ জায়গাতেই সব"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">English Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Top Gaming Gadgets in One Place"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 4. Banner Subtitle (Bengali & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">Bengali Subtitle</label>
              <input
                type="text"
                value={formData.subtitleBn}
                onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                placeholder="e.g. দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">English Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. 100% Authentic Products at Best Price in BD"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 5. Badge & Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Badge Text</span>
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="e.g. Exclusive Deals"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="e.g. Shop Now"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-cyan-400" />
                <span>Target Link</span>
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="#products, /categories, or URL"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Banner</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
