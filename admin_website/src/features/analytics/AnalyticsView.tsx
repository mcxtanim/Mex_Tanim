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
  const [dateFilter, setDateFilter] = useState<"today" | "month" | "year" | "custom">("year");
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-12-31");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; rev: number; cost: number; profit: number } | null>(null);

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

  // Full 12-Month Multi-Series Line Chart Dataset (Matching Reference Image)
  const fullChartData = [
    { label: "JAN", revenue: 30000, cost: 15000, profit: 15000 },
    { label: "FEB", revenue: 45000, cost: 20000, profit: 25000 },
    { label: "MAR", revenue: 60000, cost: 28000, profit: 32000 },
    { label: "APR", revenue: 75000, cost: 35000, profit: 40000 },
    { label: "MAY", revenue: 85000, cost: 42000, profit: 43000 },
    { label: "JUN", revenue: 110000, cost: 58000, profit: 52000 },
    { label: "JUL", revenue: 142000, cost: 71000, profit: 71000 },
    { label: "AUG", revenue: 168000, cost: 84000, profit: 84000 },
    { label: "SEP", revenue: metrics.totalRevenue > 0 ? metrics.totalRevenue : 155000, cost: metrics.totalCost > 0 ? metrics.totalCost : 78000, profit: metrics.netProfit > 0 ? metrics.netProfit : 77000 },
    { label: "OCT", revenue: 175000, cost: 82000, profit: 93000 },
    { label: "NOV", revenue: 190000, cost: 88000, profit: 102000 },
    { label: "DEC", revenue: 210000, cost: 95000, profit: 115000 },
  ];

  // SVG Chart Geometry Constants
  const svgWidth = 1000;
  const svgHeight = 320;
  const paddingLeft = 65;
  const paddingRight = 35;
  const paddingTop = 45;
  const paddingBottom = 45;

  const maxVal = 220000;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (fullChartData.length - 1)) * plotWidth;
  const getY = (val: number) => paddingTop + plotHeight - (Math.max(0, val) / maxVal) * plotHeight;

  // Generate Polyline points
  const revPointsStr = fullChartData.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(" ");
  const costPointsStr = fullChartData.map((d, i) => `${getX(i)},${getY(d.cost)}`).join(" ");
  const profitPointsStr = fullChartData.map((d, i) => `${getX(i)},${getY(d.profit)}`).join(" ");

  // Grid Y ticks
  const yTicks = [200000, 150000, 100000, 50000, 0];

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
            Multi-series SVG Line Chart with exact numbers, grid lines & unit product cost calculator.
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

      {/* SVG Multi-Series Line Chart Container (Matching Reference Image) */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
        {/* Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-emerald-400" />
              Annual Sales & Profit Line Chart (Reference Grid & Exact Numbers)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              12-Month continuous line graph with Y-axis scale, background grid, and exact numeric badges.
            </p>
          </div>

          {/* Date Filter & Legend Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Buttons */}
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

            {/* Legend Dot Series */}
            <div className="flex items-center gap-4 text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block ring-2 ring-[#10b981]/30" />
                <span className="text-slate-200">Revenue (৳)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e] inline-block ring-2 ring-[#f43f5e]/30" />
                <span className="text-slate-200">Costs (৳)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#84cc16] inline-block ring-2 ring-[#84cc16]/30" />
                <span className="text-slate-200">Net Profit (৳)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Multi-Series Line Graph (Matching Reference Image) */}
        <div className="w-full bg-slate-950/90 rounded-2xl border border-slate-800/90 p-4 overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* Background Grid Matrix (Horizontal Lines & Y-Axis Labels) */}
            {yTicks.map((tickVal) => {
              const yPos = getY(tickVal);
              return (
                <g key={tickVal}>
                  {/* Grid Horizontal Line */}
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={svgWidth - paddingRight}
                    y2={yPos}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {/* Y-Axis Label */}
                  <text
                    x={paddingLeft - 12}
                    y={yPos + 4}
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    ৳{tickVal >= 1000 ? `${tickVal / 1000}k` : tickVal}
                  </text>
                </g>
              );
            })}

            {/* Vertical Grid Columns & Month X-Axis Labels */}
            {fullChartData.map((d, i) => {
              const xPos = getX(i);
              return (
                <g key={d.label}>
                  {/* Grid Vertical Line */}
                  <line
                    x1={xPos}
                    y1={paddingTop}
                    x2={xPos}
                    y2={svgHeight - paddingBottom}
                    stroke="#1e293b"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  {/* X-Axis Month Label */}
                  <text
                    x={xPos}
                    y={svgHeight - 15}
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}

            {/* 1. Revenue Polyline (Emerald Green) */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={revPointsStr}
            />

            {/* 2. Costs Polyline (Rose Red) */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={costPointsStr}
            />

            {/* 3. Net Profit Polyline (Lime Green) */}
            <polyline
              fill="none"
              stroke="#84cc16"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={profitPointsStr}
            />

            {/* Solid Dots & Exact Numeric Badges on Data Vertices */}
            {fullChartData.map((d, i) => {
              const x = getX(i);
              const yRev = getY(d.revenue);
              const yCost = getY(d.cost);
              const yProf = getY(d.profit);

              const revText = d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(0)}k` : d.revenue;
              const costText = d.cost >= 1000 ? `${(d.cost / 1000).toFixed(0)}k` : d.cost;
              const profText = d.profit >= 1000 ? `${(d.profit / 1000).toFixed(0)}k` : d.profit;

              return (
                <g key={i}>
                  {/* Revenue Point Dot & Badge */}
                  <circle cx={x} cy={yRev} r="5" fill="#10b981" stroke="#020617" strokeWidth="2" />
                  <rect
                    x={x - 18}
                    y={yRev - 22}
                    width="36"
                    height="16"
                    rx="4"
                    fill="#065f46"
                    stroke="#10b981"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={yRev - 10}
                    fill="#ecfdf5"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    ৳{revText}
                  </text>

                  {/* Cost Point Dot & Badge */}
                  <circle cx={x} cy={yCost} r="5" fill="#f43f5e" stroke="#020617" strokeWidth="2" />
                  <rect
                    x={x - 18}
                    y={yCost + 8}
                    width="36"
                    height="16"
                    rx="4"
                    fill="#881337"
                    stroke="#f43f5e"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={yCost + 20}
                    fill="#fff1f2"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    ৳{costText}
                  </text>

                  {/* Net Profit Point Dot & Badge */}
                  <circle cx={x} cy={yProf} r="5" fill="#84cc16" stroke="#020617" strokeWidth="2" />
                  <rect
                    x={x - 18}
                    y={yProf - 22}
                    width="36"
                    height="16"
                    rx="4"
                    fill="#365314"
                    stroke="#84cc16"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={yProf - 10}
                    fill="#f7fee7"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    ৳{profText}
                  </text>
                </g>
              );
            })}
          </svg>
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
