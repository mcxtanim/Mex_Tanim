"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Check } from "lucide-react";
import { Product, ProductFormData } from "./types";
import { getStoredProducts, createProduct, updateProduct } from "./productService";
import { ImageDropzone } from "../shared/ImageDropzone";

import { Category } from "../categories/types";
import { fetchCategoriesFromSupabase } from "../categories/categoryService";

interface ProductFormViewProps {
  productId?: string;
}

export function ProductFormView({ productId }: ProductFormViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    titleBn: "",
    brand: "",
    category: "gaming-mice",
    price: 0,
    originalPrice: 0,
    discount: 0,
    stock: 10,
    description: "",
    descriptionBn: "",
    specs: "",
    imageUrl: "",
    is_featured: false,
    is_popular: false,
    is_bestseller: false,
    is_new_arrival: false,
    is_combo: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchCategoriesFromSupabase().then((cats) => {
      if (cats && cats.length > 0) {
        setCategoriesList(cats);
      }
    });

    const stored = getStoredProducts();
    setProducts(stored);

    if (productId) {
      const existing = stored.find((p) => p.id === productId);
      if (existing) {
        setFormData({
          title: existing.title || "",
          titleBn: existing.titleBn || "",
          brand: existing.brand || "",
          category: existing.category || "GAMING MICE",
          price: existing.price || 0,
          originalPrice: existing.originalPrice || 0,
          discount: existing.discount || 0,
          stock: existing.stock ?? 10,
          description: existing.description || "",
          descriptionBn: existing.descriptionBn || "",
          specs: existing.specs || "",
          imageUrl: existing.imageUrl || "",
          is_featured: existing.is_featured || false,
          is_popular: existing.is_popular || false,
          is_bestseller: existing.is_bestseller || false,
          is_new_arrival: existing.is_new_arrival || false,
          is_combo: existing.is_combo || false,
        });
      }
    }
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);

    if (productId) {
      updateProduct(productId, formData, products);
    } else {
      createProduct(formData, products);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      router.push("/products");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {productId ? "Edit Product Details" : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-400">
              {productId ? `Editing Product ID #${productId}` : "Create a new product entry in store inventory"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved! Redirecting...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{productId ? "Update Product" : "Save Product"}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Product Information */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Product Title (Bangla)</label>
              <input
                type="text"
                placeholder="e.g. জেবিএল গো ৩ পোর্টেবল ব্লুটুথ সাউন্ডবক্স"
                value={formData.titleBn || ""}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Brand Name</label>
              <input
                type="text"
                placeholder="e.g. JBL, Razer, Baseus, MEMO"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 cursor-pointer"
              >
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.slug} className="bg-slate-900 text-slate-100">
                      {cat.name} ({cat.slug})
                    </option>
                  ))
                ) : (
                  [
                    { name: "GAMING COOLER", slug: "gaming-cooler" },
                    { name: "GAMING MICE", slug: "gaming-mice" },
                    { name: "MECHANICAL KEYBOARDS", slug: "mechanical-keyboards" },
                    { name: "GAMING HEADSETS", slug: "gaming-headsets" },
                    { name: "FAST CHARGERS", slug: "fast-chargers" },
                    { name: "FINGER SLEEVES", slug: "finger-sleeves" },
                    { name: "CABLES", slug: "cables" },
                    { name: "SOUNDBOXES", slug: "soundboxes" },
                    { name: "TRIMMERS", slug: "trimmers" },
                  ].map((cat) => (
                    <option key={cat.slug} value={cat.slug} className="bg-slate-900 text-slate-100">
                      {cat.name}
                    </option>
                  ))
                )}
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Inventory */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            2. Pricing & Discounts
          </h2>

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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Original MRP Price (BDT ৳)</label>
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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
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
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Universal Image Dropzone (Drag&Drop, Paste, Browse) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            3. Product Media
          </h2>

          <ImageDropzone
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspectRatio="1:1"
            label="Upload Product Image"
          />
        </div>

        {/* Card 4: Product Flags */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            4. Display Flags & Tags
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: "is_featured", label: "Featured" },
              { id: "is_popular", label: "Popular" },
              { id: "is_bestseller", label: "Bestseller" },
              { id: "is_new_arrival", label: "New Arrival" },
              { id: "is_combo", label: "Combo Offer" },
            ].map((flag) => {
              const key = flag.id as keyof ProductFormData;
              const isChecked = Boolean(formData[key]);
              return (
                <button
                  key={flag.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, [key]: !isChecked })}
                  className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                    isChecked
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span>{flag.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 5: Specifications & Descriptions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            5. Specifications & Details
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Key Specifications / Bullet Points
            </label>
            <textarea
              rows={3}
              placeholder="e.g. IP67 Waterproof, 5 Hours Playtime, Heavy Bass"
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Description (English)</label>
              <textarea
                rows={3}
                placeholder="Brief summary for product details page..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Short Description (Bangla)</label>
              <textarea
                rows={3}
                placeholder="সংক্ষিপ্ত পণ্যের বিবরণ..."
                value={formData.descriptionBn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {productId ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
