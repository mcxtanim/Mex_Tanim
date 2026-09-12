"use client";

import { DollarSign, TrendingUp, BarChart3, ShoppingCart, Package, AlertTriangle } from "lucide-react";
import { DashboardStats } from "./types";

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const netProfit = Math.round(stats.totalRevenue * 0.42);
  const avgOrderValue = stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;

  const cards = [
    {
      title: "SALES REVENUE",
      value: `৳ ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      badge: "+18.4%",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    {
      title: "NET PROFIT",
      value: `৳ ${netProfit.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      badge: "+12.5%",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    {
      title: "AVG ORDER (AOV)",
      value: `৳ ${avgOrderValue.toLocaleString()}`,
      icon: BarChart3,
      iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      badge: null,
      badgeColor: null,
    },
    {
      title: "TOTAL ORDERS",
      value: `${stats.totalOrders} Orders`,
      icon: ShoppingCart,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      badge: null,
      badgeColor: null,
    },
    {
      title: "TOTAL PRODUCTS",
      value: `${stats.totalProducts} Items`,
      icon: Package,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      badge: null,
      badgeColor: null,
    },
    {
      title: "STOCK ALERTS",
      value: `${stats.lowStockCount} Alert(s)`,
      icon: AlertTriangle,
      iconBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      badge: null,
      badgeColor: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-md group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase truncate">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} border flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                {card.value}
              </h3>
              {card.badge && (
                <div className="mt-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
