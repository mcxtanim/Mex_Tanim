"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2 } from "lucide-react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: "1:1" | "responsive";
  label?: string;
}

export function ImageDropzone({
  value,
  onChange,
  aspectRatio = "1:1",
  label = "Upload Image",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch (err: any) {
      console.error("Dropzone upload error:", err);
      setUploadError(err?.message || "Failed to upload image to Cloudinary");
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Click File Selector
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Clipboard Paste Handler (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{label}</span>
          </label>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {aspectRatio === "1:1" ? "1:1 Square" : "Responsive"}
          </span>
        </div>
      )}

      {/* Main Dropzone Area */}
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
          aspectRatio === "1:1" ? "aspect-square max-w-[200px]" : "h-44 w-full"
        } ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
            : value
            ? "border-slate-700 bg-slate-900/60"
            : "border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-emerald-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-bold">Uploading to CDN...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-full group flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Remove / Replace Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
              <label className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer text-xs font-bold transition shadow-lg">
                <span>Replace</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition shadow-lg"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer space-y-2 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-200">
                Drag & Drop or <span className="text-emerald-400 underline">Browse</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Press <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 rounded font-mono border border-slate-700">Ctrl + V</kbd> to paste image
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
          {uploadError}
        </p>
      )}
    </div>
  );
}
