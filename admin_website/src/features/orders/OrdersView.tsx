"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { Order, OrderStatus } from "./types";
import { OrdersTable } from "./OrdersTable";
import { getStoredOrders, fetchOrdersFromSupabase, updateOrderStatus } from "./orderService";
import { supabase } from "../../lib/supabase";

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("");

  const loadOrders = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) setIsRefreshing(true);
    try {
      const fetched = await fetchOrdersFromSupabase();
      if (fetched && fetched.length > 0) {
        setOrders(fetched);
      } else {
        setOrders(getStoredOrders());
      }
      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn("loadOrders error:", err);
      setOrders(getStoredOrders());
    } finally {
      setIsLoading(false);
      if (showRefreshingSpinner) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    // Initial instant load from cache then Supabase
    setOrders(getStoredOrders());
    loadOrders();

    // 1. Supabase Realtime Channel
    const channel = supabase
      ?.channel("realtime_orders_view")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("⚡ [Realtime] Orders update detected:", payload);
          loadOrders();
        }
      )
      .subscribe();

    // 2. Periodic Polling fallback (every 8 seconds)
    const interval = setInterval(() => {
      loadOrders();
    }, 8000);

    // 3. Window events
    window.addEventListener("storage", () => loadOrders());
    window.addEventListener("focus", () => loadOrders());

    return () => {
      if (channel) supabase?.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener("storage", () => loadOrders());
      window.removeEventListener("focus", () => loadOrders());
    };
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus, orders);
    setOrders(updated);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesTab = activeTab === "All" || ord.status === activeTab;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const tabItems: { label: string; value: "All" | OrderStatus; count: number }[] = [
    { label: "All", value: "All", count: orders.length },
    { label: "Pending", value: "Pending", count: orders.filter((o) => o.status === "Pending").length },
    { label: "Processing", value: "Processing", count: orders.filter((o) => o.status === "Processing").length },
    { label: "Delivered", value: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
    { label: "Cancelled", value: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <span>Orders Management</span>
          <span className="text-[11px] font-normal text-slate-400 ml-2 hidden sm:inline">
            (Live Supabase Synced)
          </span>
        </h2>

        <div className="flex items-center gap-2.5">
          {lastSynced && (
            <span className="text-[11px] text-slate-400 hidden md:inline flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Synced: {lastSynced}
            </span>
          )}

          <button
            onClick={() => loadOrders(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Fetch latest orders from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Now"}</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          {tabItems.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.value
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.value
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Orders Table or Loading State */}
      {isLoading && orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs">Loading orders from Supabase...</p>
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
