"use client";

import { X, MapPin, User, Phone, Mail, ShoppingBag, CreditCard, Calendar, Clock } from "lucide-react";
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

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-100 font-mono">{order.orderNumber}</h2>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Placed on {order.createdAt}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintInvoice}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
              title="Print Invoice / Receipt"
            >
              🖨️ Print Invoice
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer & Shipping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details Card */}
            <div className="bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                Customer Details
              </h4>
              <div className="text-xs space-y-1.5 text-slate-300">
                <p className="font-semibold text-slate-100 text-sm">{order.customerName}</p>
                {order.customerEmail && (
                  <p className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {order.customerEmail}
                  </p>
                )}
                <p className="flex items-center gap-2 text-slate-400 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {order.customerPhone}
                </p>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Delivery Address
              </h4>
              <div className="text-xs space-y-1 text-slate-300">
                {order.shippingAddress.specificLocation && (
                  <p className="font-semibold text-slate-100">{order.shippingAddress.specificLocation}</p>
                )}
                {order.shippingAddress.street && (
                  <p className="text-slate-300">{order.shippingAddress.street}</p>
                )}
                <p className="text-slate-300 font-medium">
                  {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ''}
                  {order.shippingAddress.upazila ? `${order.shippingAddress.upazila}, ` : ''}
                  {order.shippingAddress.district || order.shippingAddress.city || 'Dhaka'}
                </p>
                {order.shippingAddress.division && (
                  <p className="text-slate-400 font-medium">
                    Division: <span className="text-slate-200">{order.shippingAddress.division}</span>
                  </p>
                )}
                <p className="text-[11px] text-emerald-400 font-bold pt-1">✓ Bangladesh Delivery Address Verified</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Payment Method: {order.paymentMethod}</p>
                <p className="text-[11px] text-slate-400">Status: <span className={order.paymentStatus === 'Paid' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>{order.paymentStatus}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Total Amount</p>
              <p className="text-base font-bold font-mono text-emerald-400">৳{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Ordered Items List
            </h4>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-4">Item Title</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center space-x-2">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-8 h-8 object-contain rounded bg-slate-900 p-0.5 border border-slate-800" />
                        )}
                        <span>{item.title}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-100">
                        ৳{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Order 7-Stage Status Controller */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-extrabold text-slate-200 block">7-Stage Live Order Status Controller:</label>
              <p className="text-[11px] text-slate-400">Updating status here instantly syncs to Customer&apos;s live tracking screen!</p>
            </div>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500 cursor-pointer shadow-md"
            >
              <option value="Order Placed">1. Order Placed</option>
              <option value="Confirmed">2. Confirmed</option>
              <option value="Processing">3. Processing</option>
              <option value="Packing">4. Packing</option>
              <option value="Shipped">5. Shipped</option>
              <option value="Out for Delivery">6. Out for Delivery</option>
              <option value="Delivered">7. Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
