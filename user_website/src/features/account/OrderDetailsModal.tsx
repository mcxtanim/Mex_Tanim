'use client';

import React, { useEffect } from 'react';
import {
  X,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  CreditCard,
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Zap,
} from 'lucide-react';
import { CustomerOrder } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { OrderTrackerTimeline } from './OrderTrackerTimeline';

interface OrderDetailsModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const subtotal = order.subtotal || order.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryCharge = order.deliveryCharge || (order.totalAmount > subtotal ? order.totalAmount - subtotal : 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide">
                  {language === 'bn' ? 'অর্ডার বিস্তারিত বিবরণ' : 'Order Details Summary'}
                </h3>
                <span className="bg-orange-500/30 text-orange-300 border border-orange-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-medium">
                {language === 'bn' ? 'তারিখ:' : 'Placed on:'} {formattedDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 scrollbar-thin">
          
          {/* 1. VISUAL ORDER TRACKING TIMELINE */}
          <OrderTrackerTimeline order={order} />

          {/* 2. ORDERED PRODUCTS LIST */}
          <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2 border-b border-gray-200 pb-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <span>{language === 'bn' ? 'অর্ডারকৃত প্রোডাক্ট আইটেমসমূহ' : 'Ordered Products'}</span>
            </h4>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={item.title}
                      className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-gray-100 shrink-0"
                    />
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        {item.title}
                      </h5>
                      <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                        <span>{language === 'bn' ? 'একক মূল্য:' : 'Unit Price:'} ৳{item.unitPrice}</span>
                        <span className="mx-1">•</span>
                        <span className="font-bold text-slate-900">{language === 'bn' ? 'পরিমাণ:' : 'Qty:'} x{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-black text-slate-900 text-sm sm:text-base shrink-0 ml-2">
                    ৳{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CUSTOMER INFORMATION & DELIVERY ADDRESS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Details */}
            <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-gray-200 pb-2">
                <User className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'গ্রাহকের তথ্য' : 'Customer Information'}</span>
              </h4>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">{language === 'bn' ? 'নাম:' : 'Name:'}</span>
                  <span className="font-extrabold text-slate-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">{language === 'bn' ? 'ফোন নম্বর:' : 'Phone:'}</span>
                  <span className="font-extrabold text-slate-900">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">{language === 'bn' ? 'অর্ডার তারিখ:' : 'Order Date:'}</span>
                  <span className="font-bold text-slate-700">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-gray-200 pb-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'ডেলিভারি গন্তব্য ঠিকানা' : 'Delivery Address'}</span>
              </h4>

              <div className="space-y-1 pt-1 text-slate-800">
                <p className="font-bold leading-relaxed">
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600 font-medium">
                  {order.shippingAddress.district}
                </p>
              </div>
            </div>

          </div>

          {/* 4. PAYMENT & PRICE BREAKDOWN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Payment Method */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-800 font-black">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'পেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি' : 'Payment Method: Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-200/80">
                <span className="text-emerald-700 font-medium">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment Status:'}</span>
                <span className="bg-emerald-500 text-white font-extrabold px-2.5 py-0.5 rounded text-[10px] uppercase">
                  {order.paymentStatus || 'Unpaid / Pay on Delivery'}
                </span>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs shadow-lg">
              <div className="flex justify-between text-gray-300">
                <span>{language === 'bn' ? 'পণ্য সমাহার মূল্য:' : 'Item Subtotal:'}</span>
                <span className="font-bold">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>{language === 'bn' ? 'ডেলিভারি ফি:' : 'Delivery Charge:'}</span>
                <span className="font-bold">৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-slate-700">
                <span>{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য:' : 'Total Amount Payable:'}</span>
                <span className="text-orange-400">৳{order.totalAmount}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 shrink-0 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
