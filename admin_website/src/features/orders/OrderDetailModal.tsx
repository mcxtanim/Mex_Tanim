"use client";

import { X, MapPin, User, Phone, Mail, ShoppingBag, CreditCard, Calendar, Clock, Truck } from "lucide-react";
import { Order, OrderStatus } from "./types";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-100">{order.orderNumber}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Placed on {order.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer & Shipping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details Card */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Customer Details
              </h4>
              <div className="text-xs space-y-1.5 text-slate-300">
                <p className="font-semibold text-slate-100 text-sm">{order.customerName}</p>
                <p className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {order.customerEmail}
                </p>
                <p className="flex items-center gap-2 text-slate-400 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {order.customerPhone}
                </p>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Shipping Address
              </h4>
              <div className="text-xs space-y-1 text-slate-300">
                <p className="font-medium text-slate-200">{order.shippingAddress.street}</p>
                <p className="text-slate-400">
                  {order.shippingAddress.city}, {order.shippingAddress.district} - {order.shippingAddress.postalCode}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium pt-1">Bangladesh Delivery</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Payment Method: {order.paymentMethod}</p>
                <p className="text-[11px] text-slate-400">Status: <span className={order.paymentStatus === 'Paid' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>{order.paymentStatus}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Total Payable</p>
              <p className="text-base font-bold font-mono text-emerald-400">৳{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Ordered Items
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3">Item Title</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-slate-200">{item.title}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-100">
                        ৳{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Order Status Controller & Courier Dispatch Placeholder */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">Update Order Status:</label>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>          </div>
        </div>
      </div>
    </div>
  );
}
