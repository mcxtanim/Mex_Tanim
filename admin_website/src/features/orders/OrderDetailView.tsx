"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, ShoppingBag, User, MapPin, Phone, Mail } from "lucide-react";
import { Order, OrderStatus } from "./types";
import { getStoredOrders, fetchOrdersFromSupabase, updateOrderStatus } from "./orderService";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const stored = getStoredOrders();
      let found = stored.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (found) setOrder(found);

      const fetched = await fetchOrdersFromSupabase();
      if (fetched) {
        found = fetched.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (found) setOrder(found);
      }
    };
    loadOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    const currentOrders = getStoredOrders();
    const updated = await updateOrderStatus(order.id, newStatus, currentOrders);
    const refreshed = updated.find((o) => o.id === order.id);
    if (refreshed) {
      setOrder(refreshed);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-12 text-center">
        <p className="text-slate-400 text-sm">Order not found or loading...</p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

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

  const deliveryFee = order.shippingCost ?? order.deliveryCharge ?? 60;
  const addressText = order.shippingAddress.address || order.shippingAddress.street || "Delivery Address";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header Navigation (Hidden during print) */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-slate-400">Placed on {order.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border bg-slate-900 cursor-pointer focus:outline-none ${getStatusBadge(
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

          {/* Print Cash Memo */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Memo</span>
          </button>
        </div>
      </div>

      {/* Main Order Details View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Shipping Details */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <User className="w-4 h-4 text-emerald-400" />
              Customer Information
            </h2>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-100 text-sm">{order.customerName}</p>
              <p className="text-slate-300 flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.customerPhone}
              </p>
              {order.customerEmail && (
                <p className="text-slate-300 flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {order.customerEmail}
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Shipping Address
            </h2>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-200">{addressText}</p>
              <p className="text-slate-400">
                {order.shippingAddress.city}, {order.shippingAddress.district}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-2.5">
              Payment Details
            </h2>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="font-semibold text-slate-200">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items & Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-2.5">
              Ordered Items ({order.items.length})
            </h2>

            <div className="divide-y divide-slate-800/60">
              {order.items.map((item, idx) => {
                const itemPrice = item.price ?? item.unitPrice ?? 0;
                return (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                            MEX
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200 text-xs">{item.title}</h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ৳{itemPrice.toLocaleString()} × {item.quantity} unit(s)
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-slate-100 text-xs">
                      ৳{(itemPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary Breakdown */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>৳{(order.totalAmount - deliveryFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge:</span>
                <span>৳{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-emerald-400 pt-2 border-t border-slate-800/80">
                <span>Total Amount:</span>
                <span>৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Memo Component for Browser Print */}
      <div className="hidden print:block text-black bg-white p-8 space-y-6 font-sans">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">MEX TANIM STORE</h1>
            <p className="text-xs text-slate-600 font-medium">Gadgets For A Smarter You</p>
            <p className="text-xs text-slate-600 mt-1">Phone: 01800000000 | Web: mextanim.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-800">CASH MEMO</h2>
            <p className="text-xs font-mono">Invoice #: {order.orderNumber}</p>
            <p className="text-xs font-mono">Date: {order.createdAt}</p>
          </div>
        </div>

        {/* Customer & Address */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-800 uppercase">Customer Details:</p>
            <p className="font-semibold">{order.customerName}</p>
            <p>{order.customerPhone}</p>
            {order.customerEmail && <p>{order.customerEmail}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800 uppercase">Delivery Address:</p>
            <p>{addressText}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full text-left border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="p-2 border-r border-slate-300">Item Description</th>
              <th className="p-2 border-r border-slate-300 text-center">Qty</th>
              <th className="p-2 border-r border-slate-300 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {order.items.map((item, idx) => {
              const itemPrice = item.price ?? item.unitPrice ?? 0;
              return (
                <tr key={idx}>
                  <td className="p-2 border-r border-slate-300 font-semibold">{item.title}</td>
                  <td className="p-2 border-r border-slate-300 text-center font-mono">{item.quantity}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-mono">৳{itemPrice}</td>
                  <td className="p-2 text-right font-mono font-bold">৳{itemPrice * item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total calculation */}
        <div className="flex justify-end text-xs font-mono">
          <div className="w-48 space-y-1">
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t border-slate-400 pt-1">
              <span>Grand Total:</span>
              <span>৳{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-300 text-center text-[10px] text-slate-500">
          Thank you for shopping with Mex Tanim Store! For support, contact support@mextanim.com.
        </div>
      </div>
    </div>
  );
}
