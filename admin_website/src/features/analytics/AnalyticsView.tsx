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
  Filter, 
  CheckCircle2, 
  ArrowUpRight, 
  PieChart, 
  ShieldCheck, 
  Clock, 
  Layers
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

  // Sample graph dataset based on date range
  const chartData = [
    { label: "May", revenue: 85000, cost: 42000, profit: 43000 },
    { label: "Jun", revenue: 110000, cost: 58000, profit: 52000 },
    { label: "Jul", revenue: 142000, cost: 71000, profit: 71000 },
    { label: "Aug", revenue: 168000, cost: 84000, profit: 84000 },
    { label: "Sep", revenue: metrics.totalRevenue, cost: metrics.totalCost, profit: metrics.netProfit },
  ];

  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.revenue, d.cost, d.profit)), 1);

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
            Automated net profit calculation (`Net Profit = Revenue - Total Cost`) & custom date range analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense Entry</span>
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

      {/* Date Filter Bar & Graph Header */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              Revenue vs Expense vs Profit Comparison Graph
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualize monthly & custom date range financial trends.
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

        {/* Visual Comparison Graph */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-end gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span className="text-slate-300">Revenue (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
              <span className="text-slate-300">Costs (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-teal-400 inline-block" />
              <span className="text-slate-300">Net Profit (৳)</span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-2">
            {chartData.map((d, idx) => {
              const revHeight = Math.round((d.revenue / maxChartValue) * 100);
              const costHeight = Math.round((d.cost / maxChartValue) * 100);
              const profitHeight = Math.round((d.profit / maxChartValue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-950/80 rounded-xl p-1.5 h-44 flex items-end justify-center gap-1.5 border border-slate-800/60 overflow-hidden">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/3 bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all"
                      title={`Revenue: ৳${d.revenue.toLocaleString()}`}
                    />
                    {/* Cost Bar */}
                    <div
                      style={{ height: `${costHeight}%` }}
                      className="w-1/3 bg-rose-500 rounded-t-md hover:bg-rose-400 transition-all"
                      title={`Cost: ৳${d.cost.toLocaleString()}`}
                    />
                    {/* Profit Bar */}
                    <div
                      style={{ height: `${profitHeight}%` }}
                      className="w-1/3 bg-teal-400 rounded-t-md hover:bg-teal-300 transition-all"
                      title={`Profit: ৳${d.profit.toLocaleString()}`}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-300">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cost Management Table Section */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-400" />
              Operational & Product Expense Records
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record sourcing costs, ad campaigns, logistics, and overheads.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">EXPENSE TITLE</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">AMOUNT (BDT)</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {costs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                    No expense records added yet. Click "Add Expense Entry" above.
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
