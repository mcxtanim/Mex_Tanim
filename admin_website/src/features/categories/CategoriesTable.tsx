"use client";

import { Edit2, Trash2, FolderTree, Layers, Image as ImageIcon } from "lucide-react";
import { Category } from "./types";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-slate-400 text-sm">No categories found matching your query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              {/* 1:1 Aspect Ratio Thumbnail Image or Icon */}
              {cat.image ? (
                <div className="w-12 h-12 aspect-square rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 p-1">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain aspect-square" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FolderTree className="w-5 h-5" />
                </div>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {cat.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-slate-500">/{cat.slug}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px]">
              <Layers className="w-3 h-3 text-emerald-400" />
              {cat.productCount} Products
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
