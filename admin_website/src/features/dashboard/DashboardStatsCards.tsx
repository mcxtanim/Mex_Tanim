"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, BarChart3, ShoppingCart, Package, AlertTriangle, Wallet } from "lucide-react";
import { DashboardStats } from "./types";
import { getStoredCosts, getTotalCosts } from "../analytics/costService";

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const [totalCost, setTotalCost] = useState(19200);

  useEffect(() => {
    const costs = getStoredCosts();
    setTotalCost(getTotalCosts(costs));

    const handleStorage = () => {
      const updatedCosts = getStoredCosts();
      setTotalCost(getTotalCosts(updatedCosts));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const netProfit = stats.totalRevenue - totalCost;
  const profitMargin = stats.totalRevenue > 0 ? Math.round((netProfit / stats.totalRevenue) * 100) : 0;
  const avgOrderValue = stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;

  const cards = [
    {
      title: "REVENUE",
      value: `৳ ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      badge: "+18.4%",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      href: "/analytics",
    },
    {
      title: "TOTAL COST",
      value: `৳ ${totalCost.toLocaleString()}`,
      icon: Wallet,
      iconBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      badge: "Cost",
      badgeColor: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      href: "/analytics",
    },
    {
      title: "NET PROFIT",
      value: `৳ ${netProfit.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      badge: `${profitMargin}% Margin`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      href: "/analytics",
    },
    {
      title: "AVG ORDER",
      value: `৳ ${avgOrderValue.toLocaleString()}`,
      icon: BarChart3,
      iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      badge: null,
      badgeColor: null,
      href: "/analytics",
    },
    {
      title: "ORDERS",
      value: `${stats.totalOrders}`,
      icon: ShoppingCart,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      badge: null,
      badgeColor: null,
      href: "/orders",
    },
    {
      title: "PRODUCTS",
      value: `${stats.totalProducts}`,
      icon: Package,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      badge: null,
      badgeColor: null,
      href: "/products",
    },
    {
      title: "ALERTS",
      value: `${stats.lowStockCount}`,
      icon: AlertTriangle,
      iconBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      badge: null,
      badgeColor: null,
      href: "/products",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-slate-900/95 hover:shadow-lg transition-all duration-200 group cursor-pointer active:scale-98 relative"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-black tracking-wider text-slate-400 group-hover:text-emerald-400 uppercase truncate transition-colors">
                {card.title}
              </span>
              <div className={`w-6 h-6 rounded-lg ${card.iconBg} border flex items-center justify-center shrink-0`}>
                <Icon className="w-3 h-3" />
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-base font-extrabold text-slate-100 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                {card.value}
              </h3>
              {card.badge && (
                <div className="mt-1">
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
