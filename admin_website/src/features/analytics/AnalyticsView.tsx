"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Wallet, 
  BarChart2, 
  Plus, 
  Trash2, 
  Calendar, 
  Calculator,
  X,
  DollarSign,
  Package,
  FileText,
  Tag
} from "lucide-react";
import { CostItem, CostFormData, CostCategory } from "./types";
import { 
  getStoredCosts, 
  addCostItem, 
  deleteCostItem, 
  calculateFinancialMetrics 
} from "./costService";
import { getStoredOrders } from "../orders/orderService";
import { Order } from "../orders/types";
import { getStoredProducts } from "../products/productService";
import { Product } from "../products/types";

interface GraphPoint {
  label: string;
  revenue: number;
  cost: number;
  profit: number;
  subLabel?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const AnalyticsView: React.FC = () => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Date Filter Controls State
  const [dateFilter, setDateFilter] = useState<"day" | "month" | "year" | "custom">("month");
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-12");
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // 8 = September
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [startDate, setStartDate] = useState<string>("2026-09-01");
  const [endDate, setEndDate] = useState<string>("2026-09-30");

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  // Inline Expense Form State (No Modal Popup!)
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

  // Calculate live real-time financial metrics
  const metrics = calculateFinancialMetrics(orders, costs);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Dynamic Graph Datasets Generator
  const getGraphData = (): GraphPoint[] => {
    switch (dateFilter) {
      case "day":
        return [
          { label: "12 AM", revenue: 1200, cost: 400, profit: 800, subLabel: `${selectedDate} - 12:00 AM` },
          { label: "3 AM", revenue: 2400, cost: 900, profit: 1500, subLabel: `${selectedDate} - 3:00 AM` },
          { label: "6 AM", revenue: 5800, cost: 2100, profit: 3700, subLabel: `${selectedDate} - 6:00 AM` },
          { label: "9 AM", revenue: 11200, cost: 4200, profit: 7000, subLabel: `${selectedDate} - 9:00 AM` },
          { label: "12 PM", revenue: 18400, cost: 7800, profit: 10600, subLabel: `${selectedDate} - 12:00 PM` },
          { label: "3 PM", revenue: 24800, cost: 11200, profit: 13600, subLabel: `${selectedDate} - 3:00 PM` },
          { label: "6 PM", revenue: 31000, cost: 14500, profit: 16500, subLabel: `${selectedDate} - 6:00 PM` },
          { label: "9 PM", revenue: metrics.totalRevenue, cost: metrics.totalCost, profit: metrics.netProfit, subLabel: `${selectedDate} - 9:00 PM (Live)` },
        ];

      case "month": {
        const daysCount = getDaysInMonth(selectedYear, selectedMonth);
        const monthName = MONTH_NAMES[selectedMonth];
        const step = Math.ceil(daysCount / 6);
        const points: GraphPoint[] = [];

        for (let d = 1; d <= daysCount; d += step) {
          const ratio = d / daysCount;
          const rev = Math.round((metrics.totalRevenue * 0.4) + ratio * (metrics.totalRevenue * 0.6));
          const cst = Math.round((metrics.totalCost * 0.4) + ratio * (metrics.totalCost * 0.6));
          points.push({
            label: `${d} ${MONTH_SHORT[selectedMonth]}`,
            revenue: rev,
            cost: cst,
            profit: rev - cst,
            subLabel: `${monthName} ${d}, ${selectedYear}`,
          });
        }
        if (points[points.length - 1].label !== `${daysCount} ${MONTH_SHORT[selectedMonth]}`) {
          points.push({
            label: `${daysCount} ${MONTH_SHORT[selectedMonth]}`,
            revenue: metrics.totalRevenue,
            cost: metrics.totalCost,
            profit: metrics.netProfit,
            subLabel: `${monthName} ${daysCount}, ${selectedYear}`,
          });
        }
        return points;
      }

      case "year": {
        return MONTH_SHORT.map((mShort, idx) => {
          const isPast = idx <= 8;
          const baseRev = isPast ? Math.round(45000 + (idx + 1) * 14000) : 0;
          const baseCost = isPast ? Math.round(22000 + (idx + 1) * 7000) : 0;
          const rev = idx === 8 && selectedYear === 2026 ? metrics.totalRevenue : baseRev;
          const cost = idx === 8 && selectedYear === 2026 ? metrics.totalCost : baseCost;
          return {
            label: mShort,
            revenue: rev,
            cost: cost,
            profit: rev - cost,
            subLabel: `${MONTH_NAMES[idx]} ${selectedYear}`,
          };
        });
      }

      case "custom": {
        return [
          { label: "Start Date", revenue: Math.round(metrics.totalRevenue * 0.25), cost: Math.round(metrics.totalCost * 0.25), profit: Math.round(metrics.netProfit * 0.25), subLabel: `Range Start: ${startDate}` },
          { label: "Mid Range 1", revenue: Math.round(metrics.totalRevenue * 0.55), cost: Math.round(metrics.totalCost * 0.55), profit: Math.round(metrics.netProfit * 0.55), subLabel: "Custom Interval 1" },
          { label: "Mid Range 2", revenue: Math.round(metrics.totalRevenue * 0.8), cost: Math.round(metrics.totalCost * 0.8), profit: Math.round(metrics.netProfit * 0.8), subLabel: "Custom Interval 2" },
          { label: "End Date", revenue: metrics.totalRevenue, cost: metrics.totalCost, profit: metrics.netProfit, subLabel: `Range End: ${endDate}` },
        ];
      }
    }
  };

  const currentData = getGraphData();
  const maxVal = Math.max(...currentData.map((d) => Math.max(d.revenue, d.cost, d.profit)), 200000);
  const yAxisMax = Math.ceil(maxVal / 50000) * 50000;

  const formatK = (val: number) => {
    if (val >= 1000) {
      const k = val / 1000;
      return `৳ ${k.toFixed(1)}k`;
    }
    return `৳ ${val}`;
  };

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingTop = 30;
  const paddingBottom = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (currentData.length <= 1) return paddingX;
    return paddingX + (index / (currentData.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const ratio = Math.max(0, val) / yAxisMax;
    return svgHeight - paddingBottom - ratio * usableHeight;
  };

  const createSmoothPath = (key: "revenue" | "cost" | "profit") => {
    if (currentData.length === 0) return "";
    const points = currentData.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      path += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }
    return path;
  };

  const revenuePath = createSmoothPath("revenue");
  const costPath = createSmoothPath("cost");
  const profitPath = createSmoothPath("profit");
  const revenueAreaPath = `${revenuePath} L ${getX(currentData.length - 1)},${svgHeight - paddingBottom} L ${getX(0)},${svgHeight - paddingBottom} Z`;

  const totalPeriodRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodCosts = currentData.reduce((sum, d) => sum + d.cost, 0);
  const totalPeriodProfit = totalPeriodRevenue - totalPeriodCosts;

  return (
    <div className="space-y-6">
      {/* Financial Overview Container */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-6 select-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                Financial Overview
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-950/90 border border-slate-800/90 p-1 rounded-xl flex items-center gap-1">
              {[
                { id: "day", label: "Day" },
                { id: "month", label: "Month" },
                { id: "year", label: "Year" },
                { id: "custom", label: "Custom Range" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDateFilter(filter.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dateFilter === filter.id
                      ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-bold pl-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block ring-2 ring-emerald-400/30" />
                <span className="text-slate-300">Revenue (৳)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ring-2 ring-rose-500/30" />
                <span className="text-slate-300">Costs (৳)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-500/30" />
                <span className="text-slate-300">Net Profit (৳)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Selector Bar */}
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
                {[2024, 2025, 2026].map((y) => (
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
                {[2024, 2025, 2026].map((y) => (
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
              <span className="text-xs text-slate-300 font-semibold">Select Custom Date Range:</span>
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

        {/* SVG Graph Plot Area */}
        <div 
          className="relative w-full overflow-x-auto scrollbar-none pt-12 pb-2"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div className="min-w-[650px] relative">
            {hoveredIdx !== null && currentData[hoveredIdx] && (
              <div
                style={{
                  left: `${(hoveredIdx / (currentData.length - 1)) * 82 + 9}%`,
                  top: "-55px",
                }}
                className={`absolute z-40 bg-slate-950/95 border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl w-52 text-xs space-y-2 pointer-events-none transition-all duration-150 animate-in fade-in ${
                  hoveredIdx >= Math.floor(currentData.length / 2)
                    ? "-translate-x-[102%]"
                    : "translate-x-2"
                }`}
              >
                <div className="font-extrabold text-slate-100 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>{currentData[hoveredIdx].subLabel || currentData[hoveredIdx].label}</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>Revenue</span>
                    <strong>{formatK(currentData[hoveredIdx].revenue)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span>Costs</span>
                    <strong>{formatK(currentData[hoveredIdx].cost)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span>Net Profit</span>
                    <strong>{formatK(currentData[hoveredIdx].profit)}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="relative flex">
              <div className="w-12 flex flex-col justify-between py-6 text-[11px] font-mono text-slate-500 text-right pr-3 shrink-0 h-[220px]">
                <span>200k</span>
                <span>150k</span>
                <span>100k</span>
                <span>50k</span>
                <span>0</span>
              </div>

              <div className="flex-1 relative h-[220px]">
                <div className="absolute inset-0 flex z-30">
                  {currentData.map((_, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onClick={() => setHoveredIdx(i)}
                      className="flex-1 h-full cursor-pointer group"
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex flex-col justify-between py-[30px] pointer-events-none opacity-20">
                  <div className="border-b border-dashed border-slate-600 w-full" />
                  <div className="border-b border-dashed border-slate-600 w-full" />
                  <div className="border-b border-dashed border-slate-600 w-full" />
                  <div className="border-b border-dashed border-slate-600 w-full" />
                  <div className="border-b border-slate-700 w-full" />
                </div>

                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path d={revenueAreaPath} fill="url(#revenueGlow)" />

                  {hoveredIdx !== null && (
                    <line
                      x1={getX(hoveredIdx)}
                      y1={paddingTop}
                      x2={getX(hoveredIdx)}
                      y2={svgHeight - paddingBottom}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  )}

                  <path d={revenuePath} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <path d={costPath} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
                  <path d={profitPath} fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />

                  {currentData.map((d, i) => {
                    const cx = getX(i);
                    const revY = getY(d.revenue);
                    const costY = getY(d.cost);
                    const profitY = getY(d.profit);
                    const isSelected = hoveredIdx === i;

                    return (
                      <g key={i}>
                        <circle cx={cx} cy={revY} r={isSelected ? "7" : "5"} fill="#10b981" stroke="#022c22" strokeWidth="2" />
                        <circle cx={cx} cy={revY} r="2.5" fill="#ffffff" />

                        <circle cx={cx} cy={costY} r={isSelected ? "7" : "5"} fill="#f43f5e" stroke="#4c0519" strokeWidth="2" />
                        <circle cx={cx} cy={costY} r="2.5" fill="#ffffff" />

                        <circle cx={cx} cy={profitY} r={isSelected ? "7" : "5"} fill="#3b82f6" stroke="#172554" strokeWidth="2" />
                        <circle cx={cx} cy={profitY} r="2.5" fill="#ffffff" />
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-0 inset-x-0 flex justify-between px-8 text-xs font-bold text-slate-300 pointer-events-none">
                  {currentData.map((d, i) => (
                    <span
                      key={i}
                      className={`transition ${
                        hoveredIdx === i ? "text-emerald-400 font-extrabold scale-110" : "text-slate-400"
                      }`}
                    >
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Bottom Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                <h4 className="text-xl font-black text-slate-100 font-mono tracking-tight mt-0.5">
                  {formatK(totalPeriodRevenue)}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Costs</span>
                <h4 className="text-xl font-black text-rose-400 font-mono tracking-tight mt-0.5">
                  {formatK(totalPeriodCosts)}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net Profit</span>
                <h4 className="text-xl font-black text-blue-400 font-mono tracking-tight mt-0.5">
                  {formatK(totalPeriodProfit)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational & Product Expense Table Section with INLINE Form Expansion */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-400" />
              Cost & Expense Records
            </h3>
          </div>

          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? "Close Form" : "Add Expense"}</span>
          </button>
        </div>

        {/* INLINE Add Expense Form Card (No Modal Popup!) */}
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
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  calcMode === "unit" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Unit Price × Quantity
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("total")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${
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

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md"
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
