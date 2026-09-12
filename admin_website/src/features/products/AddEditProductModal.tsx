"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { Product, ProductFormData } from "./types";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData, id?: string) => void;
  productToEdit?: Product | null;
  categories: string[];
}

export function AddEditProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}: AddEditProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    titleBn: "",
    brand: "",
    category: categories[0] || "GAMING COOLER",
    price: 0,
    originalPrice: 0,
    discount: 0,
    stock: 10,
    description: "",
    descriptionBn: "",
    specs: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        titleBn: productToEdit.titleBn || "",
        brand: productToEdit.brand || "",
        category: productToEdit.category || categories[0] || "GAMING COOLER",
        price: productToEdit.price || 0,
        originalPrice: productToEdit.originalPrice || 0,
        discount: productToEdit.discount || 0,
        stock: productToEdit.stock ?? 10,
        description: productToEdit.description || "",
        descriptionBn: productToEdit.descriptionBn || "",
        specs: productToEdit.specs || "",
        imageUrl: productToEdit.imageUrl || "",
      });
    } else {
      setFormData({
        title: "",
        titleBn: "",
        brand: "",
        category: categories[0] || "GAMING COOLER",
        price: 0,
        originalPrice: 0,
        discount: 0,
        stock: 10,
        description: "",
        descriptionBn: "",
        specs: "",
        imageUrl: "",
      });
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      } catch (err) {
        console.error('Image upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData, productToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-100">
              {productToEdit ? "Edit Product Details" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          
          {/* Titles: English & Bengali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Product Title (English) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. JBL GO 3 Portable Bluetooth Soundbox"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Product Title (Bangla)
              </label>
              <input
                type="text"
                placeholder="e.g. জেবিএল গো ৩ পোর্টেবল ব্লুটুথ সাউন্ডবক্স"
                value={formData.titleBn || ""}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          {/* Brand & Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. JBL, Razer, Baseus, MEMO"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>

          {/* Pricing: Selling Price, Original MRP Price, Discount % */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Selling Price (BDT ৳) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Original MRP Price (BDT ৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 4800"
                  value={formData.originalPrice || 0}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Discount Badge (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>

          {/* Product Descriptions (English & Bengali) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Description (English)</label>
              <textarea
                rows={2}
                placeholder="IP67 waterproof compact Bluetooth speaker with powerful punchy bass."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Description (Bangla)</label>
              <textarea
                rows={2}
                placeholder="আইপি৬৭ ওয়াটারপ্রুফ কমপ্যাক্ট ব্লুটুথ স্পিকার সঙ্গে পাওয়ারফুল বেস।"
                value={formData.descriptionBn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            </div>
          </div>

          {/* Key Specifications */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Key Specifications / Bullet Points (Separated by comma or new lines)
            </label>
            <textarea
              rows={3}
              placeholder="IP67 Waterproof & Dustproof, 5 Hours Playtime, Original JBL Pro Sound"
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>

          {/* Image File Upload & URL Input with Live 1:1 Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Product Image (File Upload or Image URL)
            </label>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 aspect-square rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-500 opacity-50" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  placeholder="Or paste Image URL (https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              {productToEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
