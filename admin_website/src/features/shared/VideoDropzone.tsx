"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Video as VideoIcon,
  UploadCloud,
  X,
  Play,
  Loader2,
  ExternalLink,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";
import { uploadVideoToCloudinary } from "../../lib/cloudinary";

interface VideoDropzoneProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

export function parseVideoInfo(rawUrl?: string | null) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // 1. YouTube watch URL
  const ytWatchMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    return {
      isYouTube: true,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`,
      videoUrl: trimmed,
    };
  }

  // 2. Direct MP4/WebM/Cloudinary/Other Video
  return {
    isYouTube: false,
    videoId: "",
    embedUrl: trimmed,
    videoUrl: trimmed,
  };
}

export function VideoDropzone({
  value,
  onChange,
  label = "Product Video URL (ভিডিও লিংক)",
  description = "প্রডাক্ট ডিটেইল পেজে থাম্বনেইলে থাকা VIDEO বাটনে ক্লিক করলে এই ভিডিওটি সরাসরি মূল ইমেজ কন্টেইনারে চলবে।",
}: VideoDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const videoInfo = parseVideoInfo(value);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setUploadError("Please select a valid video file (MP4, WebM, MOV).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadVideoToCloudinary(file);
      onChange(url);
    } catch (err: any) {
      console.error("Video dropzone upload error:", err);
      setUploadError(err?.message || "Failed to upload video to Cloudinary");
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

  // File Selector
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = "";
  };

  // Clipboard Paste Handler (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      // If user is focused directly on the video URL input, let default paste happen
      if (activeEl && activeEl.getAttribute("data-video-url-input") === "true") {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      // 1. Check for video files in clipboard
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("video/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            return;
          }
        }
      }

      // 2. Check for video URL string if dropped or clicked inside this component
      if (dropzoneRef.current && dropzoneRef.current.contains(activeEl)) {
        const text = e.clipboardData?.getData("text/plain")?.trim();
        if (
          text &&
          (text.includes("youtube.com") ||
            text.includes("youtu.be") ||
            text.endsWith(".mp4") ||
            text.includes("res.cloudinary.com") ||
            text.startsWith("http"))
        ) {
          e.preventDefault();
          onChange(text);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="space-y-3" ref={dropzoneRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <VideoIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>{label}</span>
          {value && (
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
              {videoInfo?.isYouTube ? "YouTube" : "Direct Video"}
            </span>
          )}
        </label>
        <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
          YouTube, MP4, WebM Supported
        </span>
      </div>

      {/* Drag & Drop Upload Zone (Shown when no video or as optional drop target) */}
      {!value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
            isDragging
              ? "border-rose-500 bg-rose-500/10 scale-[1.01]"
              : "border-slate-700/80 bg-slate-900/40 hover:border-rose-500/60 hover:bg-slate-900/60"
          }`}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-rose-400 py-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Uploading video to CDN...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-1 pointer-events-none">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200">
                  Drag & Drop video file or <span className="text-rose-400 underline">Browse Video</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Upload MP4/WebM video or paste a YouTube URL below • Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono border border-slate-700">Ctrl + V</kbd> to paste
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video URL Input Field */}
      <div className="relative">
        <input
          type="text"
          data-video-url-input="true"
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4 URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-24 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/60 font-mono"
        />
        <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />

        {value && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition flex items-center gap-1"
              title="Open Video URL"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold transition cursor-pointer"
              title="Remove Video"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          {uploadError}
        </p>
      )}

      {/* Live Video Preview Box */}
      {videoInfo && (
        <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Play className="w-3.5 h-3.5 fill-current" />
              Live Video Preview
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-400">
                {videoInfo.isYouTube ? "YouTube Player" : "HTML5 Video"}
              </span>
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[10px] text-rose-400 hover:text-rose-300 transition cursor-pointer flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="w-full aspect-video max-w-md rounded-xl overflow-hidden bg-black border border-slate-800 shadow-md">
            {videoInfo.isYouTube ? (
              <iframe
                src={videoInfo.embedUrl}
                title="Video Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-0"
              />
            ) : (
              <video src={videoInfo.videoUrl} controls className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}

      {description && <p className="text-[10px] text-slate-500">{description}</p>}
    </div>
  );
}
