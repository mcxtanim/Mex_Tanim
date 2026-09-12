"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Search } from "lucide-react";
import { Category, CategoryFormData } from "./types";
import { initialCategories } from "./seedData";
import { CategoriesTable } from "./CategoriesTable";
import { AddEditCategoryModal } from "./AddEditCategoryModal";
import { DeleteConfirmModal } from "../products/DeleteConfirmModal";

const STORAGE_KEY = "mex_tanim_admin_categories";

export function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
        setCategories(initialCategories);
      } else {
        setCategories(JSON.parse(data));
      }
    } catch {
      setCategories(initialCategories);
    }
  }, []);

  const saveToStorage = (updated: Category[]) => {
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCategory = (formData: CategoryFormData, id?: string) => {
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (id) {
      const updated = categories.map((cat) =>
        cat.id === id ? { ...cat, name: formData.name, description: formData.description, slug } : cat
      );
      saveToStorage(updated);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug,
        description: formData.description,
        productCount: 0,
      };
      saveToStorage([newCat, ...categories]);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      const updated = categories.filter((c) => c.id !== deletingCategory.id);
      saveToStorage(updated);
      setDeletingCategory(null);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-emerald-400" />
          Categories
        </h2>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Categories Grid */}
      <CategoriesTable
        categories={filteredCategories}
        onEdit={(cat) => {
          setEditingCategory(cat);
          setIsModalOpen(true);
        }}
        onDelete={(cat) => setDeletingCategory(cat)}
      />

      {/* Add / Edit Modal */}
      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        categoryToEdit={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingCategory)}
        title={deletingCategory?.name || ""}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
