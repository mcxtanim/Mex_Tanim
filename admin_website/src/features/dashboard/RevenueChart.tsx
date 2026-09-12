"use client";

import { BarChart2 } from "lucide-react";

export function RevenueChart() {
  const chartData = [
    { month: "May", amount: "85,000", height: "45%" },
    { month: "Jun", amount: "110,000", height: "65%" },
    { month: "Jul", amount: "142,000", height: "80%" },
    { month: "Aug", amount: "168,000", height: "95%" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          Sales Trend
        </h3>
      </div>

      {/* Visual Bar Chart Grid Matching Reference Image */}
      <div className="grid grid-cols-4 gap-4 items-end mt-4 pt-4 pb-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group">
            {/* Emerald Solid Bar */}
            <div className="w-full bg-slate-950/80 rounded-2xl p-1 h-32 flex items-end border border-slate-800/60 overflow-hidden">
              <div
                style={{ height: item.height }}
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-teal-300 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20"
              />
            </div>

            {/* Label & Amount */}
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                {item.month}
              </p>
              <p className="text-[11px] font-bold font-mono text-slate-200 mt-0.5">
                ৳ {item.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
