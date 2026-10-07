"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Check, Video, Play, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Product, ProductFormData } from "./types";
import { getStoredProducts, fetchProductsFromSupabase, fetchProductById, createProduct, updateProduct } from "./productService";
import { ImageDropzone } from "../shared/ImageDropzone";

import { Category } from "../categories/types";
import { getStoredCategories, fetchCategoriesFromSupabase } from "../categories/categoryService";

function getEmbedVideoInfo(rawUrl?: string) {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      isYouTube: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }
  return {
    isYouTube: false,
    videoUrl: url,
  };
}

interface ProductFormViewProps {
  productId?: string;
}

export function ProductFormView({ productId }: ProductFormViewProps) {
  const router = useRouter();
  const initialProduct = productId
    ? getStoredProducts().find((p) => p.id === productId)
    : null;

  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => getStoredCategories());
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(
    Boolean(productId && !initialProduct)
  );

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (initialProduct) {
      return {
        title: initialProduct.title || "",
        titleBn: initialProduct.titleBn || "",
        brand: initialProduct.brand || "",
        category: initialProduct.category || "gaming-mice",
        price: initialProduct.price || 0,
        originalPrice: initialProduct.originalPrice || 0,
        discount: initialProduct.discount || 0,
        stock: initialProduct.stock || 10,
        description: initialProduct.description || "",
        descriptionBn: initialProduct.descriptionBn || "",
        specs: initialProduct.specs || "",
        imageUrl: initialProduct.imageUrl || "",
        comboImagesText: initialProduct.comboImages?.join("\n") || "",
        videoUrl: initialProduct.videoUrl || "",
        highlightSubtitle: initialProduct.highlightSubtitle || "",
        whyChooseText: initialProduct.whyChoosePoints?.join("\n") || "",
        perfectForText: initialProduct.perfectForGames?.join("\n") || "",
        shortDescription: initialProduct.shortDescription || "",
        is_featured: initialProduct.is_featured ?? true,
        is_popular: initialProduct.is_popular ?? false,
        is_bestseller: initialProduct.is_bestseller ?? false,
        is_new_arrival: initialProduct.is_new_arrival ?? true,
        is_combo: initialProduct.is_combo ?? false,
      };
    }
    return {
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
      comboImagesText: "",
      videoUrl: "",
      highlightSubtitle: "",
      whyChooseText: "",
      perfectForText: "",
      shortDescription: "",
      is_featured: true,
      is_popular: false,
      is_bestseller: false,
      is_new_arrival: true,
      is_combo: false,
    };
  });

  const [hasDiscount, setHasDiscount] = useState<boolean>(() => {
    if (initialProduct) {
      return Boolean(
        (initialProduct.discount && initialProduct.discount > 0) ||
        (initialProduct.originalPrice && initialProduct.originalPrice > initialProduct.price)
      );
    }
    return false;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        if (productId) {
          const existing = await fetchProductById(productId);
          if (isMounted && existing) {
            const hasExistingDisc = Boolean(
              (existing.discount && existing.discount > 0) ||
              (existing.originalPrice && existing.originalPrice > existing.price)
            );
            setHasDiscount(hasExistingDisc);

            setFormData({
              title: existing.title || "",
              titleBn: existing.titleBn || "",
              brand: existing.brand || "",
              category: existing.category || "gaming-mice",
              price: existing.price || 0,
              originalPrice: existing.originalPrice || 0,
              discount: existing.discount || 0,
              stock: existing.stock || 10,
              description: existing.description || "",
              descriptionBn: existing.descriptionBn || "",
              specs: existing.specs || "",
              imageUrl: existing.imageUrl || "",
              comboImagesText: existing.comboImages?.join("\n") || "",
              videoUrl: existing.videoUrl || "",
              highlightSubtitle: existing.highlightSubtitle || "",
              whyChooseText: existing.whyChoosePoints?.join("\n") || "",
              perfectForText: existing.perfectForGames?.join("\n") || "",
              shortDescription: existing.shortDescription || "",
              is_featured: existing.is_featured ?? true,
              is_popular: existing.is_popular ?? false,
              is_bestseller: existing.is_bestseller ?? false,
              is_new_arrival: existing.is_new_arrival ?? true,
              is_combo: existing.is_combo ?? false,
            });
          }
        }

        const cats = await fetchCategoriesFromSupabase();
        if (isMounted && cats && cats.length > 0) {
          setCategoriesList(cats);
        }

        const allProds = await fetchProductsFromSupabase();
        if (isMounted && allProds) {
          setProducts(allProds);
        }
      } catch (err) {
        console.error("Error loading product edit data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // 1. Selling price changes -> auto calculate discount % if original MRP is set
  const handleSellingPriceChange = (valStr: string) => {
    const newPrice = valStr === "" ? 0 : Number(valStr);
    const orig = formData.originalPrice || 0;

    if (hasDiscount && orig > 0) {
      if (newPrice > 0 && newPrice < orig) {
        const autoDiscount = Math.round(
          ((orig - newPrice) / orig) * 100
        );
        setFormData((prev) => ({
          ...prev,
          price: newPrice,
          discount: autoDiscount,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          price: newPrice,
          discount: 0,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        price: newPrice,
      }));
    }
  };

  // 2. Original MRP changes -> auto calculate discount % or selling price
  const handleOriginalPriceChange = (valStr: string) => {
    const newOrig = valStr === "" ? 0 : Number(valStr);

    if (hasDiscount && newOrig > 0) {
      if (formData.discount > 0) {
        // If discount % already specified, calculate new selling price
        const autoSelling = Math.round(newOrig * (1 - formData.discount / 100));
        setFormData((prev) => ({
          ...prev,
          originalPrice: newOrig,
          price: autoSelling,
        }));
      } else if (formData.price > 0 && formData.price < newOrig) {
        // If selling price already specified, calculate discount %
        const autoDiscount = Math.round(
          ((newOrig - formData.price) / newOrig) * 100
        );
        setFormData((prev) => ({
          ...prev,
          originalPrice: newOrig,
          discount: autoDiscount,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          originalPrice: newOrig,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        originalPrice: newOrig,
      }));
    }
  };

  // 3. Discount percentage changes -> auto calculate selling price from original MRP
  const handleDiscountChange = (valStr: string) => {
    const rawNum = valStr === "" ? 0 : Number(valStr);
    const newDiscount = Math.min(100, Math.max(0, rawNum));
    const orig = formData.originalPrice || 0;

    if (hasDiscount && orig > 0) {
      if (newDiscount > 0) {
        const autoSelling = Math.round(
          orig * (1 - newDiscount / 100)
        );
        setFormData((prev) => ({
          ...prev,
          discount: newDiscount,
          price: autoSelling,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          discount: 0,
          price: prev.originalPrice || prev.price,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        discount: newDiscount,
      }));
    }
  };

  // 4. Toggle Discount Option On/Off
  const handleToggleDiscount = (enable: boolean) => {
    setHasDiscount(enable);
    if (!enable) {
      setFormData((prev) => ({
        ...prev,
        discount: 0,
        originalPrice: 0,
      }));
    } else {
      // If turning ON and originalPrice is missing or <= price, suggest sensible default
      if (!formData.originalPrice || formData.originalPrice <= formData.price) {
        const suggested = formData.price > 0 ? Math.round(formData.price * 1.25) : 0;
        const initDiscount =
          suggested > formData.price && formData.price > 0
            ? Math.round(((suggested - formData.price) / suggested) * 100)
            : 0;
        setFormData((prev) => ({
          ...prev,
          originalPrice: suggested,
          discount: initDiscount,
        }));
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);

    const finalData: ProductFormData = {
      ...formData,
      discount: hasDiscount ? formData.discount : 0,
      originalPrice: hasDiscount ? (formData.originalPrice || 0) : 0,
    };

    try {
      if (productId) {
        await updateProduct(productId, finalData, products);
      } else {
        await createProduct(finalData, products);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 600);
    } catch (err: any) {
      console.error("Error saving product:", err?.message || err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="p-12 text-center text-slate-400 font-bold text-xs bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse max-w-5xl mx-auto my-8">
        Loading product information from database...
      </div>
    );
  }

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
          type="button"
          onClick={(e) => handleSubmit(e)}
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
                onChange={(e) => {
                  const newCat = e.target.value;
                  const isComboCat = newCat === "combo-offers" || newCat === "combo";
                  setFormData({
                    ...formData,
                    category: newCat,
                    is_combo: isComboCat ? true : formData.is_combo,
                  });
                }}
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
                    { name: "COMBO OFFERS", slug: "combo-offers" },
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
                      {cat.name} ({cat.slug})
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
                placeholder="0"
                value={formData.stock === 0 ? "" : formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? 0 : Number(e.target.value) })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Discounts (Smart Auto-Calculation + Optional Discount Toggle) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                2. Pricing & Discounts
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {hasDiscount
                  ? "Smart Calculation: Selling price, Original MRP & Discount % auto-sync in real time."
                  : "Regular pricing: Only Selling Price is required. Toggle discount ON if you have an offer."}
              </p>
            </div>

            {/* Discount Option Toggle Switch */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2.5 cursor-pointer select-none">
                <span className="text-[11px] text-slate-400">Discount প্রযোজ্য?</span>
                <button
                  type="button"
                  onClick={() => handleToggleDiscount(!hasDiscount)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasDiscount ? "bg-emerald-600" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={hasDiscount}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      hasDiscount ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    hasDiscount
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {hasDiscount ? "Discount ON" : "Discount OFF"}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Selling Price (Auto calculated if Original MRP + Discount % are entered, or user can type directly) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Selling Price (BDT ৳) <span className="text-emerald-400">*</span>
                </label>
                {hasDiscount && (formData.originalPrice || 0) > 0 && formData.price > 0 && formData.price < (formData.originalPrice || 0) && (
                  <span className="text-[10px] font-extrabold text-emerald-400 font-mono">
                    Save ৳{((formData.originalPrice || 0) - formData.price).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={(e) => handleSellingPriceChange(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono font-bold text-emerald-400 placeholder:text-slate-600"
                />
              </div>
              <p className="text-[10px] text-slate-500">The actual price customer pays at checkout.</p>
            </div>

            {/* 2. Original MRP Price (Auto calculated discount if Selling Price is entered, or Selling Price auto updates if Discount % is entered) */}
            <div className={`space-y-1.5 transition-opacity ${hasDiscount ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Original MRP Price (BDT ৳)</label>
                {hasDiscount && (
                  <span className="text-[10px] text-slate-400 font-medium">Strikethrough Price</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  disabled={!hasDiscount}
                  placeholder="0"
                  value={!hasDiscount || !formData.originalPrice ? "" : formData.originalPrice}
                  onChange={(e) => handleOriginalPriceChange(e.target.value)}
                  className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono placeholder:text-slate-600 ${
                    !hasDiscount ? "cursor-not-allowed bg-slate-900/50" : ""
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {hasDiscount ? "Crossed out price shown next to discount badge." : "Enable discount above to activate."}
              </p>
            </div>

            {/* 3. Discount Badge (%) (Auto calculated from Original MRP & Selling Price, or user enters % and Selling Price updates) */}
            <div className={`space-y-1.5 transition-opacity ${hasDiscount ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Discount Badge (%)</label>
                {hasDiscount && formData.discount > 0 && (
                  <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    -{formData.discount}% OFF
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={!hasDiscount}
                  placeholder="0"
                  value={!hasDiscount || formData.discount === 0 ? "" : formData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono placeholder:text-slate-600 ${
                    !hasDiscount ? "cursor-not-allowed bg-slate-900/50" : ""
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {hasDiscount
                  ? "Changing this auto-calculates Selling Price from MRP."
                  : "Enable discount above to activate."}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Universal Image Dropzone (Drag&Drop, Paste, Browse) + Video URL + Gallery */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              3. Product Media (ছবি ও ভিডিও)
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Image Gallery & Product Video
            </span>
          </div>

          {/* Primary Product Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Primary Product Image (প্রধান ছবি) <span className="text-emerald-400">*</span>
            </label>
            <ImageDropzone
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              aspectRatio="1:1"
              label="Upload Product Image"
            />
          </div>

          {/* Additional Gallery & Combo Images */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Additional Gallery & Combo Images (অতিরিক্ত ছবি)</span>
              <span className="text-[10px] text-slate-500 font-mono">প্রতি লাইনে ১টি ছবির URL</span>
            </label>
            <textarea
              rows={3}
              placeholder="https://images.unsplash.com/...&#10;https://res.cloudinary.com/..."
              value={formData.comboImagesText || ""}
              onChange={(e) => setFormData({ ...formData, comboImagesText: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-500">
              প্রডাক্ট ডিটেইল পেজের গ্যালারি এবং কম্বো অফারে (Image 2, Image 3, Image 4) প্রদর্শনের জন্য একাধিক ছবির লিংক দিন।
            </p>

            {/* Thumbnail preview of additional images */}
            {formData.comboImagesText && formData.comboImagesText.trim() && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.comboImagesText
                  .split(/,|\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden group shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${idx + 2}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute bottom-0 right-0 bg-slate-900/90 text-[9px] font-bold text-emerald-400 px-1 rounded-tl">
                        #{idx + 2}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Product Video URL (YouTube or Direct Video) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>Product Video URL (ভিডিও লিংক)</span>
              </label>
              <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                YouTube & MP4 Supported
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4 URL"
                value={formData.videoUrl || ""}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/60 font-mono"
              />
              {formData.videoUrl ? (
                <a
                  href={formData.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[11px] font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>Open</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : null}
            </div>
            <p className="text-[10px] text-slate-500">
              প্রডাক্ট ডিটেইল পেজে থাম্বনেইলে থাকা VIDEO বাটনে ক্লিক করলে এই ভিডিওটি সরাসরি মূল ইমেজ কন্টেইনারে চলবে।
            </p>

            {/* Video Live Preview */}
            {(() => {
              const videoInfo = getEmbedVideoInfo(formData.videoUrl);
              if (!videoInfo) return null;
              return (
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Play className="w-3 h-3 fill-current" />
                      Live Video Preview
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {videoInfo.isYouTube ? "YouTube Player" : "HTML5 Video"}
                    </span>
                  </div>
                  <div className="w-full aspect-video max-w-sm rounded-lg overflow-hidden bg-black border border-slate-800">
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
              );
            })()}
          </div>
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
                  onClick={() => {
                    const nextVal = !isChecked;
                    setFormData({
                      ...formData,
                      [key]: nextVal,
                      category: key === "is_combo" && nextVal ? "combo-offers" : formData.category,
                    });
                  }}
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

        {/* Card 5: বিবরণ (Description, Highlights & Features) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              5. বিবরণ (Description, Highlights & Features)
            </h2>
            <span className="text-[11px] text-emerald-400 font-bold">
              Product Detail Page বিবরণী
            </span>
          </div>

          {/* Highlight Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Highlight Subtitle (হেডলাইন সাবটাইটেল)
            </label>
            <input
              type="text"
              placeholder="e.g. ⚡ Look আলাদা, gameplay-ও আরও smooth!"
              value={formData.highlightSubtitle || ""}
              onChange={(e) => setFormData({ ...formData, highlightSubtitle: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60"
            />
            <p className="text-[10px] text-slate-500">
              প্রডাক্ট ডিটেইল পেজে &quot;বিবরণ&quot; সেকশনের টাইটেলের ঠিক নিচে এই সাবটাইটেলটি দেখাবে।
            </p>
          </div>

          {/* Descriptions in Bangla & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">মূল বিবরণ (বাংলা)</label>
              <textarea
                rows={4}
                placeholder="পণ্যের বিস্তারিত বিবরণ বাংলায় লিখুন..."
                value={formData.descriptionBn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Description (English)</label>
              <textarea
                rows={4}
                placeholder="Detailed description in English..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* "কেন এই পণ্যটি?" (Why Choose Points / Features) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>&quot;কেন এই পণ্যটি?&quot; (বৈশিষ্ট্যের তালিকা - Features)</span>
              <span className="text-[10px] text-slate-500 font-mono">প্রতি লাইনে ১টি বৈশিষ্ট্য</span>
            </label>
            <textarea
              rows={4}
              placeholder="⚡ Luminous Gaming Design — gaming setup-এ আলাদা visual style আনে&#10;🎯 Smooth Touch Control — swipe ও aiming সহজ করে&#10;🪶 Low-Friction Feel — হালকা ও আরামদায়ক অনুভূতি"
              value={formData.whyChooseText || ""}
              onChange={(e) => setFormData({ ...formData, whyChooseText: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed font-sans"
            />
            <p className="text-[10px] text-slate-500">
              প্রতি লাইনে একটি করে পয়েন্ট লিখুন। প্রডাক্ট ডিটেইল পেজের বিবরণীতে প্রতিটি পয়েন্টের সামনে ⚡ চিহ্ন সহ প্রদর্শিত হবে।
            </p>
          </div>

          {/* "Perfect For" Games / Uses */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>&quot;Perfect For&quot; (উপযুক্ত গেম বা ব্যবহার)</span>
              <span className="text-[10px] text-slate-500 font-mono">প্রতি লাইনে ১টি গেমের নাম</span>
            </label>
            <textarea
              rows={3}
              placeholder="Free Fire / Free Fire MAX&#10;PUBG Mobile&#10;Call of Duty Mobile&#10;eFootball&#10;FPS & Battle Royale Games"
              value={formData.perfectForText || ""}
              onChange={(e) => setFormData({ ...formData, perfectForText: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-500">
              যে সকল গেমের জন্য এই গ্যাজেটটি উপযুক্ত (যেমন: Free Fire, PUBG, COD Mobile)। বিবরণীর নিচের গ্রিডে দেখাবে।
            </p>
          </div>

          {/* Short Description Summary */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300">
              Short Description (সংক্ষিপ্ত সারাংশ)
            </label>
            <textarea
              rows={2}
              placeholder="বিবরণীর শেষে প্রদর্শনের জন্য সংক্ষিপ্ত প্যারাগ্রাফ..."
              value={formData.shortDescription || ""}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
            />
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
