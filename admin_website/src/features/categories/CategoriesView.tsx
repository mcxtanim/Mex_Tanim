"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Search } from "lucide-react";
import { Category, CategoryFormData } from "./types";
import { CategoriesTable } from "./CategoriesTable";
import { AddEditCategoryModal } from "./AddEditCategoryModal";
import { DeleteConfirmModal } from "../products/DeleteConfirmModal";
import {
  getStoredCategories,
  fetchCategoriesFromSupabase,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryService";

export function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    setCategories(getStoredCategories());
    fetchCategoriesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
      }
    });
  }, []);

  const handleSaveCategory = (formData: CategoryFormData, id?: string) => {
    if (id) {
      const updated = updateCategory(id, formData, categories);
      setCategories(updated);
    } else {
      const updated = createCategory(formData, categories);
      setCategories(updated);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      const updated = deleteCategory(deletingCategory.id, categories);
      setCategories(updated);
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
