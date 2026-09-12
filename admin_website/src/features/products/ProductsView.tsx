"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, PackageCheck } from "lucide-react";
import { Product } from "./types";
import { ProductTable } from "./ProductTable";
import {
  getStoredProducts,
  fetchProductsFromSupabase,
  deleteProduct,
} from "./productService";

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    setProducts(getStoredProducts());
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const handleDeleteProduct = (id: string) => {
    const updated = deleteProduct(id, products);
    setProducts(updated);
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
            Products Management
          </h2>
        </div>

        <Link
          href="/products/add"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
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
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
