"use client";

import { Banknote, ShoppingBag, Package, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardStats } from "./types";

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      subtext: "Delivered & confirmed orders",
      icon: Banknote,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
      badge: "+18.4%",
      badgeColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subtext: `${stats.pendingOrdersCount} pending action`,
      icon: ShoppingBag,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
      badge: stats.pendingOrdersCount > 0 ? `${stats.pendingOrdersCount} Pending` : "Up to date",
      badgeColor: stats.pendingOrdersCount > 0 ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      subtext: "Items cataloged",
      icon: Package,
      color: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30",
      badge: "Active",
      badgeColor: "text-violet-400 bg-violet-500/10",
    },
    {
      title: "In Stock Items",
      value: stats.inStockCount.toString(),
      subtext: stats.lowStockCount > 0 ? `${stats.lowStockCount} items running low` : "Optimal stock levels",
      icon: CheckCircle2,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
      badge: stats.lowStockCount > 0 ? `${stats.lowStockCount} Low` : "Healthy",
      badgeColor: stats.lowStockCount > 0 ? "text-rose-400 bg-rose-500/10" : "text-emerald-400 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                {card.value}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-slate-400">{card.subtext}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
