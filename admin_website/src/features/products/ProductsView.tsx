"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, PackageCheck } from "lucide-react";
import { Product, ProductFormData } from "./types";
import { ProductTable } from "./ProductTable";
import { AddEditProductModal } from "./AddEditProductModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  getStoredProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productService";

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const handleSaveProduct = (formData: ProductFormData, id?: string) => {
    if (id) {
      const updated = updateProduct(id, formData, products);
      setProducts(updated);
    } else {
      const updated = createProduct(formData, products);
      setProducts(updated);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      const updated = deleteProduct(deletingProduct.id, products);
      setProducts(updated);
      setDeletingProduct(null);
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            Products
          </h2>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={(prod) => setDeletingProduct(prod)}
      />

      {/* Add / Edit Modal */}
      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
        categories={categories.filter((c) => c !== "All")}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        title={deletingProduct?.title || ""}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
