"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  Plus,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

interface MultiImageDropzoneProps {
  value: string; // Newline- or comma-separated URLs
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

export function MultiImageDropzone({
  value,
  onChange,
  label = "Additional Gallery & Combo Images (অতিরিক্ত ছবি)",
  description = "প্রডাক্ট ডিটেইল পেজের গ্যালারি এবং কম্বো অফারে (Image 2, Image 3, Image 4) প্রদর্শনের জন্য একাধিক ছবি আপলোড বা লিংক দিন।",
}: MultiImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrlInput, setManualUrlInput] = useState("");
  const [showRawEditor, setShowRawEditor] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Parse existing image URLs
  const imageUrls = React.useMemo(() => {
    if (!value) return [];
    return value
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value]);

  const addUrls = (newUrls: string[]) => {
    const combined = [...imageUrls, ...newUrls];
    onChange(combined.join("\n"));
  };

  const removeUrl = (indexToRemove: number) => {
    const filtered = imageUrls.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered.join("\n"));
  };

  const processFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];
    try {
      for (const file of imageFiles) {
        try {
          const url = await uploadImageToCloudinary(file);
          uploadedUrls.push(url);
        } catch (singleErr: any) {
          console.error("Error uploading single image:", singleErr);
          setUploadError(singleErr?.message || "Failed to upload one or more images");
        }
      }

      if (uploadedUrls.length > 0) {
        addUrls(uploadedUrls);
      }
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // File Select Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = "";
  };

  // Clipboard Paste Handler (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Check if dropzone is hovered or focused or if no input element is active
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      
      // If user is pasting into manual URL input, let default paste happen
      if (activeEl && activeEl.getAttribute("data-manual-url-input") === "true") {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        processFiles(pastedFiles);
        return;
      }

      // If user pasted a URL string while hovering over this dropzone
      if (dropzoneRef.current && dropzoneRef.current.contains(activeEl)) {
        const text = e.clipboardData?.getData("text/plain")?.trim();
        if (text && (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("data:image"))) {
          e.preventDefault();
          addUrls([text]);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [imageUrls]);

  const handleAddManualUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    addUrls([trimmed]);
    setManualUrlInput("");
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{label}</span>
          {imageUrls.length > 0 && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              {imageUrls.length} {imageUrls.length === 1 ? "Image" : "Images"}
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowRawEditor(!showRawEditor)}
          className="text-[11px] text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer font-medium"
        >
          <Edit3 className="w-3 h-3" />
          <span>{showRawEditor ? "Hide Raw URLs" : "Edit Raw URLs"}</span>
        </button>
      </div>

      {/* Main Drag & Drop / Upload Area */}
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
            : "border-slate-700/80 bg-slate-900/40 hover:border-emerald-500/60 hover:bg-slate-900/60"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-emerald-400 py-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-bold">Uploading gallery images to CDN...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-2 pointer-events-none">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-200">
                Drag & Drop multiple images or <span className="text-emerald-400 underline">Browse Files</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Supports multiple PNG, JPG, WEBP • Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono border border-slate-700">Ctrl + V</kbd> to paste from clipboard
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Direct URL Input Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            data-manual-url-input="true"
            placeholder="Paste single image URL (https://...) and press Add..."
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddManualUrl();
              }
            }}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
          />
          <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="button"
          onClick={() => handleAddManualUrl()}
          disabled={!manualUrlInput.trim()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Raw URL Textarea (Toggleable) */}
      {showRawEditor && (
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Raw Image URLs List (One per line)</span>
            <span className="font-mono text-[10px] text-slate-500">{imageUrls.length} total</span>
          </div>
          <textarea
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/...&#10;https://res.cloudinary.com/..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono resize-y leading-relaxed"
          />
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          {uploadError}
        </p>
      )}

      {/* Gallery Image Grid Preview */}
      {imageUrls.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Gallery Thumbnails Preview:</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] text-rose-400 hover:text-rose-300 transition cursor-pointer"
            >
              Clear All ({imageUrls.length})
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {imageUrls.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden group shadow-sm hover:border-slate-700 transition"
              >
                <img
                  src={url}
                  alt={`Gallery ${idx + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = "0.3";
                  }}
                />
                
                {/* Badge Number */}
                <span className="absolute top-1 left-1 bg-slate-900/90 text-[9px] font-black text-emerald-400 px-1.5 py-0.5 rounded border border-slate-800">
                  #{idx + 2}
                </span>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 rounded-lg">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                    title="View Full Size"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeUrl(idx)}
                    className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {description && <p className="text-[10px] text-slate-500">{description}</p>}
    </div>
  );
}
