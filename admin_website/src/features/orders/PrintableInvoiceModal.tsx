"use client";

import { X, Printer, CheckCircle, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import { Order } from "./types";

interface PrintableInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintableInvoiceModal({ order, isOpen, onClose }: PrintableInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const deliveryCharge = order.deliveryCharge || (order.shippingAddress?.district?.includes("Dhaka") ? 60 : 120);
  const subtotal = order.totalAmount - deliveryCharge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Controls (Hidden during print) */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">Customer Invoice Memo ({order.orderNumber})</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Content Container */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Memo Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">MEX TANIM STORE</h1>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Gaming Gadgets & Accessories Specialist</p>
              <p className="text-[11px] text-slate-500 font-medium">Hotline: 01317170609 | Web: mextanimstore.com</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-black text-xs px-3 py-1 rounded uppercase tracking-wider">
                CASH MEMO
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2">Invoice: {order.orderNumber}</p>
              <p className="text-[11px] text-slate-500 font-medium">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Customer Shipping Details */}
          <div className="my-6 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">CUSTOMER INFORMATION</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500 print:hidden" />
                <span>{order.customerName}</span>
              </div>
              <div className="font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 print:hidden" />
                <span>{order.customerPhone}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">SHIPPING ADDRESS</span>
              <div className="font-semibold text-slate-800 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0 print:hidden" />
                <span>
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.district}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                <th className="p-2.5 rounded-l">Item Description</th>
                <th className="p-2.5 text-center">Unit Price</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right rounded-r">Total (BDT ৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold">
              {order.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-900 font-bold">{item.title}</td>
                  <td className="p-3 text-center text-slate-600">৳{item.unitPrice}</td>
                  <td className="p-3 text-center text-slate-900 font-black">{item.quantity}</td>
                  <td className="p-3 text-right text-slate-900 font-bold">৳{item.unitPrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Breakdown */}
          <div className="mt-6 border-t-2 border-slate-900 pt-4 flex justify-between items-start text-xs">
            <div className="max-w-xs space-y-1">
              <span className="font-black text-slate-900 uppercase text-[10px] block">PAYMENT INFORMATION</span>
              <p className="font-semibold text-slate-700">Method: <strong className="text-slate-900">{order.paymentMethod}</strong></p>
              <p className="font-semibold text-slate-700">Status: <strong className="text-emerald-700 font-bold">{order.paymentStatus || 'Cash on Delivery'}</strong></p>
            </div>

            <div className="w-56 space-y-1.5 text-right font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">৳{subtotal > 0 ? subtotal : order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold text-slate-900">৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2 mt-1">
                <span>Grand Total:</span>
                <span className="text-emerald-700 font-black text-base">৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Signature & Footer */}
          <div className="mt-12 pt-8 border-t border-dashed border-slate-300 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <div className="w-32 border-b border-slate-900 mb-1" />
              <p className="font-bold text-slate-900">Customer Signature</p>
            </div>
            <div className="text-center font-semibold text-slate-600">
              <p>Thank you for shopping with Mex Tanim Store!</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-900 mb-1 ml-auto" />
              <p className="font-bold text-slate-900">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
