"use client";

import { useState } from "react";
import { Edit2, Trash2, Tag, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Product } from "./types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          Out of Stock
        </span>
      );
    }
    if (stock < 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          Low ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        In Stock ({stock})
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
        <p className="text-slate-400 text-sm">No products found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4">Product Info</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Price (BDT)</th>
            <th className="py-3.5 px-4">Discount</th>
            <th className="py-3.5 px-4">Stock Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {products.map((product) => {
            const discountedPrice = product.discount
              ? Math.round(product.price * (1 - product.discount / 100))
              : product.price;

            return (
              <tr key={product.id} className="hover:bg-slate-800/40 transition-colors group">
                {/* Image & Title */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                          MEX
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs group-hover:text-emerald-400 transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {product.specs}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 text-slate-300 font-medium">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                    <Tag className="w-3 h-3 text-emerald-400" />
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                  <div>
                    ৳{discountedPrice.toLocaleString()}
                    {product.discount > 0 && (
                      <span className="block text-[10px] text-slate-500 line-through">
                        ৳{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>

                {/* Discount */}
                <td className="py-3 px-4">
                  {product.discount > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {product.discount}% OFF
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Regular</span>
                  )}
                </td>

                {/* Stock Status */}
                <td className="py-3 px-4">{getStockBadge(product.stock)}</td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
