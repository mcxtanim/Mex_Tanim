"use client";

import { TrendingUp, DollarSign } from "lucide-react";

export function RevenueChart() {
  const chartData = [
    { month: "Apr", revenue: 24000 },
    { month: "May", revenue: 31000 },
    { month: "Jun", revenue: 28500 },
    { month: "Jul", revenue: 42000 },
    { month: "Aug", revenue: 53500 },
    { month: "Sep", revenue: 43720 },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Revenue Analytics (BDT ৳)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly revenue trend over the past 6 months</p>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          +24.5% Growth
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
        {chartData.map((item, idx) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700 pointer-events-none z-10 whitespace-nowrap shadow-md">
                ৳{item.revenue.toLocaleString()}
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden h-full flex items-end p-0.5">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-300"
                />
              </div>

              {/* Label */}
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
