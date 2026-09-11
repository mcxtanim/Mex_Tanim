"use client";

import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Order, OrderStatus } from "../orders/types";

interface RecentOrdersListProps {
  orders: Order[];
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  const recent = orders.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Order Placed":
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Confirmed":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Packing":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Shipped":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Out for Delivery":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Recent Customer Orders</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest transactions and status</p>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/80">
        {recent.map((ord) => (
          <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-200 font-mono">{ord.orderNumber}</p>
              <p className="text-[11px] text-slate-400">{ord.customerName} • {ord.shippingAddress.city}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono font-semibold text-slate-100 hidden sm:inline">
                ৳{ord.totalAmount.toLocaleString()}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${getStatusBadge(
                  ord.status
                )}`}
              >
                {ord.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
