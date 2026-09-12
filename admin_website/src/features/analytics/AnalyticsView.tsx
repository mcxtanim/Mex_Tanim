"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  BarChart2, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Calculator,
  LineChart as LineChartIcon
} from "lucide-react";
import { CostItem, CostFormData } from "./types";
import { 
  getStoredCosts, 
  addCostItem, 
  deleteCostItem, 
  calculateFinancialMetrics 
} from "./costService";
import { getStoredOrders } from "../orders/orderService";
import { Order } from "../orders/types";
import { AddEditCostModal } from "./AddEditCostModal";

export const AnalyticsView: React.FC = () => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateFilter, setDateFilter] = useState<"today" | "month" | "year" | "custom">("month");
  const [startDate, setStartDate] = useState<string>("2026-09-01");
  const [endDate, setEndDate] = useState<string>("2026-09-30");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCosts(getStoredCosts());
    setOrders(getStoredOrders());
  }, []);

  const handleAddCost = (formData: CostFormData) => {
    const updated = addCostItem(formData, costs);
    setCosts(updated);
  };

  const handleDeleteCost = (id: string) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      const updated = deleteCostItem(id, costs);
      setCosts(updated);
    }
  };

  // Calculate live real-time financial metrics
  const metrics = calculateFinancialMetrics(orders, costs);

  // Line Chart Dataset with exact numbers
  const chartData = [
    { label: "May", revenue: 85000, cost: 42000, profit: 43000 },
    { label: "Jun", revenue: 110000, cost: 58000, profit: 52000 },
    { label: "Jul", revenue: 142000, cost: 71000, profit: 71000 },
    { label: "Aug", revenue: 168000, cost: 84000, profit: 84000 },
    { label: "Sep", revenue: metrics.totalRevenue, cost: metrics.totalCost, profit: metrics.netProfit },
  ];

  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.revenue, d.cost, d.profit)), 1);

  // Convert values to Y pixel coordinates for SVG Line Chart (Height = 180px, Padding = 20px)
  const chartHeight = 180;
  const getY = (val: number) => {
    const ratio = Math.max(0, val) / maxChartValue;
    return Math.round(chartHeight - ratio * (chartHeight - 40) - 20);
  };

  // Generate SVG Points for Line Chart
  const revenuePoints = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100}% ${getY(d.revenue)}px`).join(", ");
  const costPoints = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100}% ${getY(d.cost)}px`).join(", ");
  const profitPoints = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100}% ${getY(d.profit)}px`).join(", ");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Financial & Revenue Analytics Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated net profit calculation (`Net Profit = Revenue - Total Cost`) & unit product cost calculator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense / Unit Product Cost</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. TOTAL REVENUE */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
              SALES REVENUE
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              ৳ {metrics.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> From {metrics.deliveredOrdersCount} Delivered / Confirmed Orders
            </p>
          </div>
        </div>

        {/* 2. TOTAL COST */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
              TOTAL OPERATIONAL COST
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              ৳ {metrics.totalCost.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Product sourcing, ad spend & packaging fees
            </p>
          </div>
        </div>

        {/* 3. NET PROFIT */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              AUTOMATED NET PROFIT
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-300 font-mono tracking-tight">
              ৳ {metrics.netProfit.toLocaleString()}
            </h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {metrics.profitMargin}% Net Margin
              </span>
              <span className="text-[10px] text-slate-400">Revenue - Cost</span>
            </div>
          </div>
        </div>

        {/* 4. AVG ORDER VALUE (AOV) */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
              AVG ORDER VALUE (AOV)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              ৳ {metrics.aov.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Average basket size per order
            </p>
          </div>
        </div>
      </div>

      {/* Line Chart Section with Numeric Badges */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-emerald-400" />
              Revenue vs Cost vs Net Profit Line Chart (with Exact Numbers)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Line trend graph with numerical figures displayed at data points.
            </p>
          </div>

          {/* Date Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
              {(["today", "month", "year", "custom"] as const).map((filterId) => (
                <button
                  key={filterId}
                  onClick={() => setDateFilter(filterId)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    dateFilter === filterId
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filterId === "today" ? "Day (Today)" : filterId === "month" ? "This Month" : filterId === "year" ? "This Year" : "Custom Range"}
                </button>
              ))}
            </div>

            {dateFilter === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                />
                <span className="text-xs text-slate-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Line Chart Visual Container */}
        <div className="space-y-4 pt-2">
          {/* Legend */}
          <div className="flex items-center justify-end gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block ring-2 ring-emerald-400/30" />
              <span className="text-slate-200 font-bold">Revenue (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block ring-2 ring-rose-500/30" />
              <span className="text-slate-200 font-bold">Costs (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-300 inline-block ring-2 ring-teal-300/30" />
              <span className="text-slate-200 font-bold">Net Profit (৳)</span>
            </div>
          </div>

          {/* Line Chart Canvas & Points */}
          <div className="relative h-60 bg-slate-950/90 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
            </div>

            {/* Data Columns & Numbers Overlay */}
            <div className="relative z-10 flex-1 flex items-end justify-between px-6 pb-6">
              {chartData.map((d, i) => {
                const revY = getY(d.revenue);
                const costY = getY(d.cost);
                const profitY = getY(d.profit);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    {/* Numbers On Top of Chart Points */}
                    <div className="space-y-1 text-[10px] font-mono font-bold text-center z-20 transition-transform group-hover:scale-105 mb-2">
                      <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                        ৳ {d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs">
                        ৳ {d.cost >= 1000 ? `${(d.cost / 1000).toFixed(1)}k` : d.cost}
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs">
                        ৳ {d.profit >= 1000 ? `${(d.profit / 1000).toFixed(1)}k` : d.profit}
                      </div>
                    </div>

                    {/* Visual Line Bar Trend Pill */}
                    <div className="w-1.5 bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 rounded-full h-24 group-hover:w-2.5 transition-all shadow-md shadow-emerald-500/20" />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Month Labels */}
            <div className="relative z-10 flex justify-between px-6 pt-2 border-t border-slate-800 text-xs font-bold text-slate-300">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 text-center font-mono">
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operational & Product Expense Table Section */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-400" />
              Operational & Product Unit Cost Records
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unit prices, product quantity, sourcing costs, ad spend & shipping fees.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Product Unit Cost
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">EXPENSE TITLE</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">UNIT PRICE × QTY BREAKDOWN</th>
                <th className="py-2.5 px-3">TOTAL AMOUNT (BDT)</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {costs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 text-xs">
                    No expense records added yet. Click "Add Product Unit Cost" above.
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

      {/* Expense Modal */}
      <AddEditCostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCost}
      />
    </div>
  );
};
