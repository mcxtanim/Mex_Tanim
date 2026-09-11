"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, ShieldCheck, Search, MessageSquare } from "lucide-react";
import { AdminReview } from "./types";
import { getStoredReviews, deleteStoredReview } from "./reviewService";

export function ReviewsView() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadReviews = () => {
    setReviews(getStoredReviews());
  };

  useEffect(() => {
    loadReviews();
    window.addEventListener("storage", loadReviews);
    return () => window.removeEventListener("storage", loadReviews);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer review?")) {
      const updated = deleteStoredReview(id, reviews);
      setReviews(updated);
    }
  };

  const filtered = reviews.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-xs">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Customer Reviews & Ratings Moderation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage verified customer reviews submitted from customer order completions.
            </p>
          </div>
        </div>

        {/* Stats card */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-2xl font-black font-mono text-amber-400">{averageRating}</div>
          <div>
            <div className="flex items-center space-x-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {reviews.length} Total Verified Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by customer, comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* Reviews Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">No reviews found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Comment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-100">{rev.customerName}</td>
                  <td className="py-3.5 px-4">
                    {rev.isVerifiedBuyer ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verified Buyer</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-md line-clamp-2">
                    {rev.comment}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{rev.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
