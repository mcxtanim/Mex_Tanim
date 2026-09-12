"use client";

import React, { useState, useEffect } from "react";
import { Star, RefreshCw } from "lucide-react";
import { AdminProductReview } from "./types";
import { getAdminStoredReviews, deleteAdminReview } from "./reviewService";
import { ReviewsTable } from "./ReviewsTable";

export function ReviewsView() {
  const [reviews, setReviews] = useState<AdminProductReview[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  const loadReviews = () => {
    setReviews(getAdminStoredReviews());
  };

  useEffect(() => {
    loadReviews();
    window.addEventListener("storage", loadReviews);
    return () => window.removeEventListener("storage", loadReviews);
  }, []);

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Delete this customer review?")) {
      const updated = deleteAdminReview(reviewId, reviews);
      setReviews(updated);
    }
  };

  const filteredReviews = ratingFilter === "all"
    ? reviews
    : reviews.filter((r) => r.rating === ratingFilter);

  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">Reviews</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-bold text-slate-300 flex items-center space-x-2">
            <span>Avg Rating:</span>
            <span className="text-amber-400 font-extrabold text-xs">{avgRating} ★</span>
            <span className="text-slate-500">({totalCount})</span>
          </div>

          <button
            onClick={loadReviews}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setRatingFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            ratingFilter === "all"
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          All Stars ({reviews.length})
        </button>

        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((r) => r.rating === stars).length;
          return (
            <button
              key={stars}
              onClick={() => setRatingFilter(stars)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                ratingFilter === stars
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>{stars} ★</span>
              <span>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews Table */}
      <ReviewsTable reviews={filteredReviews} onDelete={handleDeleteReview} />
    </div>
  );
}
