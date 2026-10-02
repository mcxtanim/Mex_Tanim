"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, ShoppingBag, User, MapPin, Phone, Mail } from "lucide-react";
import { Order, OrderStatus } from "./types";
import { getStoredOrders, fetchOrdersFromSupabase, updateOrderStatus, fetchOrderById } from "./orderService";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let targetId = orderId;
    if (!targetId || targetId === "preview") {
      if (typeof window !== "undefined") {
        const segs = window.location.pathname.split("/").filter(Boolean);
        const oIdx = segs.indexOf("orders");
        if (oIdx !== -1 && segs[oIdx + 1] && segs[oIdx + 1] !== "preview") {
          targetId = decodeURIComponent(segs[oIdx + 1]);
        }
      }
    }

    if (!targetId || targetId === "preview") {
      setIsLoading(false);
      return;
    }

    const loadOrder = async () => {
      setIsLoading(true);
      // 1. Try local storage cache first for instant render
      const stored = getStoredOrders();
      let found = stored.find((o) => o.id === targetId || o.orderNumber === targetId);
      if (found) {
        setOrder(found);
        setIsLoading(false);
      }

      // 2. Fetch directly from Supabase by ID or order_number
      try {
        const direct = await fetchOrderById(targetId);
        if (direct) {
          setOrder(direct);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn("fetchOrderById failed, trying full list...", e);
      }

      // 3. Fallback: fetch all orders from Supabase
      try {
        const fetched = await fetchOrdersFromSupabase();
        if (fetched) {
          found = fetched.find((o) => o.id === targetId || o.orderNumber === targetId);
          if (found) setOrder(found);
        }
      } catch (e) {
        console.warn("fetchOrdersFromSupabase failed:", e);
      }
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-20 text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-300 font-bold text-base">Order Not Found</p>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          The requested order could not be located in the database.
        </p>
        <div className="pt-2">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
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

  const formatSlipDate = (dateStr?: string) => {
    if (!dateStr) {
      return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch {}
    return dateStr;
  };

  const shipping = order.shippingAddress || ({} as any);
  const divisionText = shipping.division || shipping.city || "Dhaka";
  const districtText = shipping.district || "Dhaka";

  let upazilaText = shipping.upazila || "";
  if (!upazilaText) {
    const rawAddr = shipping.address || shipping.street || "";
    const parts = rawAddr.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (parts.length >= 3) {
      upazilaText = parts[parts.length - 2];
    } else if (parts.length === 2 && parts[0] !== districtText) {
      upazilaText = parts[0];
    } else if (shipping.city && shipping.city !== districtText) {
      upazilaText = shipping.city;
    } else {
      upazilaText = "Savar";
    }
  }

  const fullAddressText = shipping.address || shipping.street || `${upazilaText}, ${districtText} – ${shipping.postalCode || "1340"}`;

  return (
    <>
      {/* Main Order Details View (Hidden during print) */}
      <div className="space-y-6 max-w-4xl mx-auto pb-12 print:hidden">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
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
                Order #{order.orderNumber.replace(/^#/, "")}
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

            {/* Print Memo Button - ONLY visible when order status is Confirmed */}
            {order.status === "Confirmed" && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer animate-in fade-in"
              >
                <Printer className="w-4 h-4" />
                <span>Print Memo</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Order Details Cards */}
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
      </div>

      {/* 2nd Image: 1-Page Delivery / Packing Slip (Only Visible on Print) */}
      <div
        id="order-packing-slip"
        className="hidden print:block text-black bg-white font-sans w-full max-w-[760px] mx-auto border-[2px] border-black"
        style={{ boxSizing: "border-box" }}
      >
        {/* Header: Logo Left | Order Details Right */}
        <div className="flex border-b-[2px] border-black">
          {/* Left Column: Mex Tanim Store Logo */}
          <div className="w-[58%] p-3.5 sm:p-4 flex items-center justify-start border-r-[2px] border-black bg-white">
            <img
              src="/images/logo.png"
              alt="Mex Tanim Store Logo"
              className="h-16 w-auto max-w-[280px] object-contain object-left"
            />
          </div>

          {/* Right Column: Order No & Date */}
          <div className="w-[42%] p-3.5 sm:p-4 flex flex-col justify-center bg-white">
            <span className="text-sm font-semibold text-black">Order No:</span>
            <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight my-1">
              {order.orderNumber.replace(/^#/, "")}
            </h2>
            <span className="text-sm font-semibold text-black">
              Order Date: {formatSlipDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Customer Information Grid with Perfectly Aligned Colons */}
        <div className="p-4 sm:p-5 bg-white border-b-[2px] border-black">
          <div className="grid grid-cols-[85px_15px_1fr] sm:grid-cols-[100px_20px_1fr] text-[13px] sm:text-[14px] leading-relaxed gap-y-1">
            <span className="font-bold text-black">Name</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black">{order.customerName}</span>

            <span className="font-bold text-black">Phone</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black font-mono">{order.customerPhone}</span>

            <span className="font-bold text-black">Division</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black">{divisionText}</span>

            <span className="font-bold text-black">District</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black">{districtText}</span>

            <span className="font-bold text-black">Upazila</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black">{upazilaText}</span>

            <span className="font-bold text-black">Address</span>
            <span className="font-bold text-black text-center">:</span>
            <span className="font-medium text-black">{fullAddressText}</span>
          </div>
        </div>

        {/* Ordered Items Table */}
        <table className="w-full border-collapse text-[13px] sm:text-[14px]">
          <thead>
            <tr className="bg-[#e5e7eb] border-b border-black font-bold text-black">
              <th className="py-2.5 px-3 border-r border-black text-center w-16">S/N</th>
              <th className="py-2.5 px-4 border-r border-black text-center">Product Name</th>
              <th className="py-2.5 px-3 text-center w-20">Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-black last:border-b-0">
                <td className="py-2.5 px-3 border-r border-black text-center font-medium text-black">
                  {idx + 1}
                </td>
                <td className="py-2.5 px-4 border-r border-black font-medium text-black text-left">
                  {item.title}
                </td>
                <td className="py-2.5 px-3 text-center font-medium text-black">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
