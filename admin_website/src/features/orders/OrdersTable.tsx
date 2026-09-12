"use client";

import Link from "next/link";
import { Eye, Printer } from "lucide-react";
import { Order, OrderStatus } from "./types";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Confirmed":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Packing":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Shipped":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Out for Delivery":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-slate-400 text-sm">No orders found for the selected status.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4">Order Ref</th>
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Items Count</th>
            <th className="py-3.5 px-4">Total (BDT)</th>
            <th className="py-3.5 px-4">Payment</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-800/40 transition-colors group">
              {/* Order Number & Date */}
              <td className="py-3.5 px-4">
                <Link
                  href={`/orders/${order.id}`}
                  className="font-bold text-slate-100 font-mono group-hover:text-emerald-400 transition-colors"
                >
                  {order.orderNumber}
                </Link>
                <p className="text-[10px] text-slate-400 mt-0.5">{order.createdAt}</p>
              </td>

              {/* Customer */}
              <td className="py-3.5 px-4">
                <p className="font-semibold text-slate-200">{order.customerName}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                  {order.shippingAddress.city}, {order.shippingAddress.district}
                </p>
              </td>

              {/* Items count */}
              <td className="py-3.5 px-4 font-medium text-slate-300">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
              </td>

              {/* Total Amount */}
              <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                ৳{order.totalAmount.toLocaleString()}
              </td>

              {/* Payment info */}
              <td className="py-3.5 px-4">
                <span className="text-slate-300 font-medium block">{order.paymentMethod}</span>
                <span className={`text-[10px] ${order.paymentStatus === 'Paid' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}`}>
                  {order.paymentStatus}
                </span>
              </td>

              {/* Status Selector Dropdown */}
              <td className="py-3.5 px-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border bg-slate-900 cursor-pointer focus:outline-none ${getStatusBadge(
                    order.status
                  )}`}
                >
                  <option value="Pending" className="bg-slate-900 text-amber-400">Pending</option>
                  <option value="Confirmed" className="bg-slate-900 text-cyan-400">Confirmed</option>
                  <option value="Processing" className="bg-slate-900 text-blue-400">Processing</option>
                  <option value="Packing" className="bg-slate-900 text-indigo-400">Packing</option>
                  <option value="Shipped" className="bg-slate-900 text-purple-400">Shipped</option>
                  <option value="Out for Delivery" className="bg-slate-900 text-orange-400">Out for Delivery</option>
                  <option value="Delivered" className="bg-slate-900 text-emerald-400">Delivered</option>
                  <option value="Cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                </select>
              </td>

              {/* View & Invoice Actions */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Memo</span>
                  </Link>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:text-emerald-400 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
