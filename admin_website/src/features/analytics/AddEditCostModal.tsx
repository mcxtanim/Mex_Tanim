"use client";

import React, { useState, useEffect } from "react";
import { X, PlusCircle, DollarSign, Tag, Calendar, FileText, Calculator, Package } from "lucide-react";
import { CostCategory, CostFormData } from "./types";
import { getStoredProducts } from "../products/productService";
import { Product } from "../products/types";

interface AddEditCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CostFormData) => void;
}

export const AddEditCostModal: React.FC<AddEditCostModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [calcMode, setCalcMode] = useState<"unit" | "total">("unit");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CostCategory>("Product Sourcing");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [totalAmount, setTotalAmount] = useState<number | "">("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProducts(getStoredProducts());
    }
  }, [isOpen]);

  // Auto-calculate Total Amount when unitPrice or quantity changes in unit mode
  useEffect(() => {
    if (calcMode === "unit") {
      if (typeof unitPrice === "number" && typeof quantity === "number" && unitPrice > 0 && quantity > 0) {
        setTotalAmount(unitPrice * quantity);
      }
    }
  }, [unitPrice, quantity, calcMode]);

  if (!isOpen) return null;

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setTitle(`${prod.title} (Purchase Cost Batch)`);
      // Default estimated purchase cost at 60% of sale price if not set
      setUnitPrice(Math.round(prod.price * 0.6));
      setQuantity(prod.stock > 0 ? prod.stock : 10);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(totalAmount);
    if (!title.trim() || !finalAmount || finalAmount <= 0) return;

    onSave({
      title: title.trim(),
      category,
      amount: finalAmount,
      unitPrice: calcMode === "unit" && typeof unitPrice === "number" ? unitPrice : undefined,
      quantity: calcMode === "unit" && typeof quantity === "number" ? quantity : undefined,
      date,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTitle("");
    setSelectedProductId("");
    setUnitPrice("");
    setQuantity("");
    setTotalAmount("");
    setNotes("");
    onClose();
  };

  const categories: CostCategory[] = [
    "Product Sourcing",
    "Ad Spend & Marketing",
    "Packaging & Delivery",
    "Operating Expense",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Add Expense / Product Unit Cost
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculation Mode Selector Tabs */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCalcMode("unit")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              calcMode === "unit"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Unit Price × Quantity Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setCalcMode("total")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              calcMode === "total"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Direct Total Amount Mode</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Select Product (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              Select Store Product (Optional)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="" className="bg-slate-900 text-slate-400">
                -- Custom Expense or Select Product --
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.title} (Price: ৳{p.price})
                </option>
              ))}
            </select>
          </div>

          {/* Expense Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Expense Title / Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fantech Headset Sourcing or FB Ad Campaign"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CostCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Per Unit × Quantity inputs if unit mode */}
          {calcMode === "unit" ? (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* 1 Unit Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Cost Price Per Unit (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="e.g. 1450"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Number of Units / Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Product Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Calculated Total Display */}
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs">
                <span className="text-slate-300 font-semibold">Calculated Total Cost:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ৳ {typeof totalAmount === "number" ? totalAmount.toLocaleString() : "0"}
                </span>
              </div>
            </div>
          ) : (
            /* Direct Total Amount input if total mode */
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Total Expense Amount (BDT ৳) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 3500"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Expense Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              Save Expense Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
