"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Trash2, X, Package, ExternalLink } from "lucide-react";
import { Category } from "./types";
import { fetchLinkedProductsForCategory, LinkedProduct } from "./categoryService";

interface CategoryDeleteCautionModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (categoryId: string) => void;
}

export function CategoryDeleteCautionModal({
  category,
  isOpen,
  onClose,
  onConfirmDelete,
}: CategoryDeleteCautionModalProps) {
  const [linkedProducts, setLinkedProducts] = useState<LinkedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && category) {
      setLoading(true);
      fetchLinkedProductsForCategory(category.slug, category.id).then((products) => {
        setLinkedProducts(products);
        setLoading(false);
      });
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-400">
                Caution: Uploaded Products Exist!
              </h3>
              <p className="text-xs text-rose-300/80 font-medium">
                ক্যাটাগরিতে পণ্য যুক্ত অবস্থায় ডিলিট সতর্কতা
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300/90 leading-relaxed">
            <p className="font-semibold text-amber-400 text-sm mb-1">
              ⚠️ Warning for Category: <span className="font-bold text-slate-100">"{category.name}"</span>
            </p>
            <p>
              এই ক্যাটাগরির অধীনে <strong className="text-amber-200 font-bold">{linkedProducts.length || category.productCount}টি</strong> পণ্য আপলোড করা আছে। ক্যাটাগরি ডিলিট করার পূর্বে যুক্ত থাকা পণ্যগুলো দেখে নিন।
            </p>
          </div>

          {/* Linked Products Header */}
          <div className="flex items-center justify-between pt-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-400" />
              Linked Products List ({linkedProducts.length})
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              Slug: /{category.slug}
            </span>
          </div>

          {/* Linked Products Cards */}
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Fetching linked products...</span>
            </div>
          ) : linkedProducts.length > 0 ? (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {linkedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-200 truncate">
                      {prod.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className="font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        ID: {prod.id}
                      </span>
                      <span className="font-bold text-emerald-400">
                        ৳{prod.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
              No specific products listed.
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-4 px-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Cancel (বাতিল করুন)
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmDelete(category.id);
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Trash2 className="w-4 h-4" />
            Delete Anyway (ডিলিট করুন)
          </button>
        </div>
      </div>
    </div>
  );
}
