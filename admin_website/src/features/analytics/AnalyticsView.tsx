"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  Plus, 
  Trash2, 
  Calendar, 
  Calculator,
  X,
  DollarSign,
  Package,
  FileText,
  Tag,
  Percent,
  Receipt
} from "lucide-react";
import { CostItem, CostFormData, CostCategory } from "./types";
import { 
  getStoredCosts, 
  addCostItem, 
  deleteCostItem, 
  calculateFinancialMetrics 
} from "./costService";
import { getStoredOrders, fetchOrdersFromSupabase } from "../orders/orderService";
import { Order } from "../orders/types";
import { getStoredProducts, fetchProductsFromSupabase } from "../products/productService";
import { Product } from "../products/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const AnalyticsView: React.FC = () => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Date Filter Controls State
  const [dateFilter, setDateFilter] = useState<"day" | "month" | "year" | "custom" | "all">("month");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Inline Expense Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [calcMode, setCalcMode] = useState<"unit" | "total">("unit");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [costTitle, setCostTitle] = useState("");
  const [costCategory, setCostCategory] = useState<CostCategory>("Product Sourcing");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [totalAmount, setTotalAmount] = useState<number | "">("");
  const [costDate, setCostDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [costNotes, setCostNotes] = useState("");

  useEffect(() => {
    setCosts(getStoredCosts());
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());

    // Load fresh data from Supabase
    Promise.all([fetchOrdersFromSupabase(), fetchProductsFromSupabase()]).then(([liveOrders, liveProducts]) => {
      if (liveOrders && liveOrders.length > 0) setOrders(liveOrders);
      if (liveProducts && liveProducts.length > 0) setProducts(liveProducts);
    }).catch((e) => console.warn("Live analytics fetch:", e));
  }, []);

  // Auto-calculate Total Amount when unitPrice or quantity changes in unit mode
  useEffect(() => {
    if (calcMode === "unit") {
      if (typeof unitPrice === "number" && typeof quantity === "number" && unitPrice > 0 && quantity > 0) {
        setTotalAmount(unitPrice * quantity);
      }
    }
  }, [unitPrice, quantity, calcMode]);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setCostTitle(`${prod.title} (Purchase Cost Batch)`);
      setUnitPrice(Math.round(prod.price * 0.6));
      setQuantity(prod.stock > 0 ? prod.stock : 10);
    }
  };

  const handleSaveCost = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(totalAmount);
    if (!costTitle.trim() || !finalAmount || finalAmount <= 0) return;

    const newFormData: CostFormData = {
      title: costTitle.trim(),
      category: costCategory,
      amount: finalAmount,
      unitPrice: calcMode === "unit" && typeof unitPrice === "number" ? unitPrice : undefined,
      quantity: calcMode === "unit" && typeof quantity === "number" ? quantity : undefined,
      date: costDate,
      notes: costNotes.trim() || undefined,
    };

    const updated = addCostItem(newFormData, costs);
    setCosts(updated);

    // Reset Form
    setCostTitle("");
    setSelectedProductId("");
    setUnitPrice("");
    setQuantity("");
    setTotalAmount("");
    setCostNotes("");
    setShowAddForm(false);
  };

  const handleDeleteCost = (id: string) => {
    const updated = deleteCostItem(id, costs);
    setCosts(updated);
  };

  // Filter orders and costs based on the active timeframe
  const filteredData = useMemo(() => {
    let periodOrders = orders;
    let periodCosts = costs;

    if (dateFilter === "day") {
      periodOrders = orders.filter((o) => {
        const d = o.createdAt ? o.createdAt.split("T")[0] : "";
        return d === selectedDate;
      });
      periodCosts = costs.filter((c) => c.date === selectedDate);
    } else if (dateFilter === "month") {
      periodOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        const dt = new Date(o.createdAt);
        return dt.getFullYear() === selectedYear && dt.getMonth() === selectedMonth;
      });
      periodCosts = costs.filter((c) => {
        if (!c.date) return false;
        const dt = new Date(c.date);
        return dt.getFullYear() === selectedYear && dt.getMonth() === selectedMonth;
      });
    } else if (dateFilter === "year") {
      periodOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        const dt = new Date(o.createdAt);
        return dt.getFullYear() === selectedYear;
      });
      periodCosts = costs.filter((c) => {
        if (!c.date) return false;
        const dt = new Date(c.date);
        return dt.getFullYear() === selectedYear;
      });
    } else if (dateFilter === "custom") {
      periodOrders = orders.filter((o) => {
        const d = o.createdAt ? o.createdAt.split("T")[0] : "";
        return d >= startDate && d <= endDate;
      });
      periodCosts = costs.filter((c) => c.date >= startDate && c.date <= endDate);
    }

    const deliveredOrders = periodOrders.filter(
      (o) => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped" || o.status === "Confirmed"
    );
    const revenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const cost = periodCosts.reduce((sum, c) => sum + c.amount, 0);
    const profit = revenue - cost;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0.0";

    return {
      ordersCount: periodOrders.length,
      deliveredOrdersCount: deliveredOrders.length,
      costsCount: periodCosts.length,
      revenue,
      cost,
      profit,
      margin,
    };
  }, [orders, costs, dateFilter, selectedDate, selectedMonth, selectedYear, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Financial Overview Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                Financial Overview
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time calculation of revenue, costs, and profit
              </p>
            </div>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="bg-slate-950/90 border border-slate-800/90 p-1 rounded-xl flex flex-wrap items-center gap-1">
            {[
              { id: "day", label: "Day" },
              { id: "month", label: "Month" },
              { id: "year", label: "Year" },
              { id: "custom", label: "Custom Range" },
              { id: "all", label: "Lifetime" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setDateFilter(filter.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateFilter === filter.id
                    ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Date Selector Bar */}
        {dateFilter !== "all" && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            {dateFilter === "day" && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-semibold">Select Day / Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {dateFilter === "month" && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-semibold">Select Month & Year:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx} className="bg-slate-900 text-slate-200">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-slate-200">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {dateFilter === "year" && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-semibold">Select Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-slate-200">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {dateFilter === "custom" && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-semibold">Custom Date Range:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>
        )}

        {/* 4 Financial Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                <h4 className="text-xl font-black text-slate-100 font-mono tracking-tight mt-0.5">
                  ৳ {filteredData.revenue.toLocaleString()}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  {filteredData.deliveredOrdersCount} orders delivered
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Costs */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Costs</span>
                <h4 className="text-xl font-black text-rose-400 font-mono tracking-tight mt-0.5">
                  ৳ {filteredData.cost.toLocaleString()}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  {filteredData.costsCount} cost entries
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Net Profit */}
          <div className={`bg-slate-950/80 border rounded-2xl p-4 flex items-center justify-between shadow-md ${
            filteredData.profit >= 0 ? "border-emerald-500/30" : "border-rose-500/30"
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                filteredData.profit >= 0 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}>
                {filteredData.profit >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Net Profit</span>
                <h4 className={`text-xl font-black font-mono tracking-tight mt-0.5 ${
                  filteredData.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  ৳ {filteredData.profit.toLocaleString()}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  Revenue - Costs
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Profit Margin */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Profit Margin</span>
                <h4 className="text-xl font-black text-blue-400 font-mono tracking-tight mt-0.5">
                  {filteredData.margin}%
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  Return on revenue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational & Product Expense Table Section */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-400" />
              Cost & Expense Records
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage product sourcing batches, advertising spend, packaging, and operating costs
            </p>
          </div>

          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? "Close Form" : "Add Expense"}</span>
          </button>
        </div>

        {/* INLINE Add Expense Form Card */}
        {showAddForm && (
          <form onSubmit={handleSaveCost} className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              New Expense Entry
            </h4>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCalcMode("unit")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  calcMode === "unit" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Unit Price × Quantity
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("total")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  calcMode === "total" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Direct Total Amount
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Select Product (Optional)</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                >
                  <option value="">-- Custom Expense --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} (৳{p.price})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={costTitle}
                  onChange={(e) => setCostTitle(e.target.value)}
                  placeholder="e.g. Sourcing or FB Ad"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={costCategory}
                  onChange={(e) => setCostCategory(e.target.value as CostCategory)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                >
                  {["Product Sourcing", "Ad Spend & Marketing", "Packaging & Delivery", "Operating Expense"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {calcMode === "unit" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Unit Price (৳)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Total Amount (৳)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Date</label>
                <input
                  type="date"
                  value={costDate}
                  onChange={(e) => setCostDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notes (Optional)</label>
                <input
                  type="text"
                  value={costNotes}
                  onChange={(e) => setCostNotes(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Save Expense Entry
              </button>
            </div>
          </form>
        )}

        {/* Expense List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">EXPENSE</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">BREAKDOWN</th>
                <th className="py-2.5 px-3">TOTAL (৳)</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {costs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 text-xs">
                    No expense records added yet. Click "Add Expense" above.
                  </td>
                </tr>
              ) : (
                costs.map((cost) => (
                  <tr key={cost.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono text-slate-400">{cost.date}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-200">{cost.title}</p>
                      {cost.notes && <p className="text-[10px] text-slate-400">{cost.notes}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {cost.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {cost.unitPrice && cost.quantity ? (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            ৳{cost.unitPrice.toLocaleString()} / unit × <strong className="text-white">{cost.quantity} units</strong>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Direct Amount</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-400">
                      ৳ {cost.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteCost(cost.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
