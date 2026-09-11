"use client";

import React from "react";
import { Star, Trash2, CheckCircle2, MessageSquare } from "lucide-react";
import { AdminProductReview } from "./types";

interface ReviewsTableProps {
  reviews: AdminProductReview[];
  onDelete: (reviewId: string) => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, onDelete }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-12 text-center space-y-3">
        <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Customer Reviews Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Customer reviews submitted for delivered orders will appear here for moderation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Reviewer</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Comment</th>
              <th className="py-3.5 px-4">Product ID</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4 font-semibold text-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center uppercase shrink-0">
                      {rev.customerName.charAt(0) || "C"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{rev.customerName}</div>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="text-slate-400 text-[11px] font-bold ml-1">({rev.rating})</span>
                  </div>
                </td>

                <td className="py-4 px-4 max-w-md">
                  <p className="text-slate-300 font-medium line-clamp-2 leading-relaxed">
                    {rev.comment}
                  </p>
                </td>

                <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                  {rev.productId}
                </td>

                <td className="py-4 px-4 text-slate-400 font-medium">
                  {rev.date}
                </td>

                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onDelete(rev.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
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
    </div>
  );
};
