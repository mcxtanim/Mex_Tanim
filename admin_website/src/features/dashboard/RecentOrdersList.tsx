"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Order, OrderStatus } from "../orders/types";

interface RecentOrdersListProps {
  orders: Order[];
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  const recent = orders.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Processing":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "● Pending";
      case "Processing":
        return "● Call Confirmed";
      case "Delivered":
        return "● Delivered";
      case "Cancelled":
        return "● Cancelled";
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
          Recent Customer Orders
        </h3>
        <Link
          href="/orders"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="py-2.5 px-3">ORDER #</th>
              <th className="py-2.5 px-3">CUSTOMER</th>
              <th className="py-2.5 px-3">PRODUCT</th>
              <th className="py-2.5 px-3">PRICE</th>
              <th className="py-2.5 px-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {recent.map((ord) => {
              const mainItem = ord.items[0];
              const productDesc = mainItem
                ? `${mainItem.title} (${mainItem.quantity} unit)`
                : "Gaming Gadget";

              return (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-200">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">
                    {productDesc}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-100">
                    ৳ {ord.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {getStatusLabel(ord.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
