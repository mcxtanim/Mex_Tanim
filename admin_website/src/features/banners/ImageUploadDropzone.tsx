"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link as LinkIcon, Clipboard, Check } from "lucide-react";
import { uploadBannerImage } from "./bannerService";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadDropzone({ value, onChange }: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value || "");
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global paste handler when modal is focused
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileUpload(file);
            setPasteSuccess(true);
            setTimeout(() => setPasteSuccess(false), 3000);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please provide a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const url = await uploadBannerImage(file);
      onChange(url);
      setUrlDraft(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3 font-sans" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Banner Image</span>
          <span className="text-rose-400">*</span>
        </label>
        
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? "Use File Uploader" : "Or Paste Direct URL"}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="https://example.com/banner.png or /images/banners/banner1.png"
            value={urlDraft}
            onChange={(e) => {
              setUrlDraft(e.target.value);
              onChange(e.target.value);
            }}
            className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
          />
        </div>
      ) : value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-slate-700 overflow-hidden bg-slate-900 group aspect-[21/9] flex items-center justify-center">
          <img
            src={value}
            alt="Banner Preview"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-600 transition cursor-pointer"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setUrlDraft("");
              }}
              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl border border-rose-500/40 transition cursor-pointer"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
              : "border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900/80"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-4">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-xs font-bold text-slate-200">Uploading banner image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Drag & Drop, or <span className="text-emerald-400 underline">Browse File</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                  <Clipboard className="w-3 h-3 text-slate-500" />
                  <span>Press <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">Ctrl + V</kbd> anywhere to paste screenshot</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-500">Supports PNG, JPG, WebP (Ideal ratio 21:9 or 1920x600px)</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Paste Success Notice */}
      {pasteSuccess && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1 animate-in fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>Image pasted from clipboard successfully!</span>
        </p>
      )}

      {/* Upload Error Notice */}
      {uploadError && (
        <p className="text-[11px] text-rose-400 font-semibold">{uploadError}</p>
      )}
    </div>
  );
}
