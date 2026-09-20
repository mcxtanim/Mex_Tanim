"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, FolderPlus, Check } from "lucide-react";
import { Category, CategoryFormData } from "./types";
import { getStoredCategories, fetchCategoriesFromSupabase, fetchCategoryById, createCategory, updateCategory } from "./categoryService";
import { ImageDropzone } from "../shared/ImageDropzone";

interface CategoryFormViewProps {
  categoryId?: string;
}

export function CategoryFormView({ categoryId }: CategoryFormViewProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  
  const initialCategory = categoryId
    ? getStoredCategories().find((c) => c.id === categoryId || c.slug === categoryId)
    : null;

  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(
    Boolean(categoryId && !initialCategory)
  );

  const [formData, setFormData] = useState<CategoryFormData>(() => {
    if (initialCategory) {
      return {
        name: initialCategory.name || "",
        name_bn: initialCategory.name_bn || "",
        description: initialCategory.description || "",
        image: initialCategory.image || "",
      };
    }
    return {
      name: "",
      name_bn: "",
      description: "",
      image: "",
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        if (categoryId) {
          const existing = await fetchCategoryById(categoryId);
          if (isMounted && existing) {
            setFormData({
              name: existing.name || "",
              name_bn: existing.name_bn || "",
              description: existing.description || "",
              image: existing.image || "",
            });
          }
        }

        const allCats = await fetchCategoriesFromSupabase();
        if (isMounted && allCats) {
          setCategories(allCats);
        }
      } catch (err) {
        console.error("Error loading category edit data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingCategory(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);

    try {
      if (categoryId) {
        await updateCategory(categoryId, formData, categories);
      } else {
        await createCategory(formData, categories);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/categories");
      }, 600);
    } catch (err: any) {
      console.error("Error saving category:", err?.message || err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="p-12 text-center text-slate-400 font-bold text-xs bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse max-w-3xl mx-auto my-8">
        Loading category information from database...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/categories"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-emerald-400" />
              {categoryId ? "Edit Category Details" : "Add Product Category"}
            </h1>
            <p className="text-xs text-slate-400">
              {categoryId ? `Editing Category ID #${categoryId}` : "Create a new product category in store catalog"}
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
              <span>{categoryId ? "Update Category" : "Save Category"}</span>
            </>
          )}
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Details */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            Category Details
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Category Name (English) <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GAMING MICE"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              ক্যাটাগরির নাম (বাংলা) / Category Name (Bangla)
            </label>
            <input
              type="text"
              placeholder="যেমন: গেমিং মাউস"
              value={formData.name_bn || ""}
              onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of products in this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>
        </div>

        {/* Card 2: Universal Image Dropzone (1:1 Aspect Ratio) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
            Category Thumbnail (1:1 Ratio)
          </h2>

          <ImageDropzone
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            aspectRatio="1:1"
            label="Upload Category Image"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/categories"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {categoryId ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
