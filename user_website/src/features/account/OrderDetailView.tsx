'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Truck,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../shared/LanguageContext';
import {
  CustomerOrder,
  getCustomerOrderById,
  normalizeOrderStatus,
  SAVED_ADDRESS_KEY,
} from './orderService';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';

interface OrderDetailViewProps {
  orderId: string;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let customerPhone = user?.phone || '';
    if (!customerPhone && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.phone) customerPhone = parsed.phone;
        }
      } catch {
        // ignore
      }
    }

    const foundOrder = getCustomerOrderById(orderId, customerPhone);
    if (foundOrder) {
      setOrder(foundOrder);
      setAccessDenied(false);
    } else {
      // Check if order exists without phone filter for diagnostic
      const rawFound = getCustomerOrderById(orderId);
      if (rawFound) {
        // Order belongs to another phone -> Security Access Denied
        setAccessDenied(true);
      } else {
        setOrder(null);
      }
    }
    setLoading(false);
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header searchQuery="" setSearchQuery={() => {}} />
        <div className="py-20 text-center text-gray-500 font-extrabold text-sm">
          {language === 'bn' ? 'অর্ডার তথ্য লোড হচ্ছে...' : 'Loading order details...'}
        </div>
        <Footer />
      </div>
    );
  }

  // Security Ownership Check Failure
  if (accessDenied || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header searchQuery="" setSearchQuery={() => {}} />
        
        <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {accessDenied
              ? (language === 'bn' ? 'অ্যাক্সেস করা সম্ভব নয় (Access Denied)' : 'Access Denied')
              : (language === 'bn' ? 'অর্ডারটি পাওয়া যায়নি' : 'Order Not Found')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
            {accessDenied
              ? (language === 'bn' ? 'নিরাপত্তার স্বার্থে আপনি কেবল আপনার নিজের অর্ডারের তথ্য দেখতে পারবেন।' : 'For security reasons, you can only access orders belonging to your account.')
              : (language === 'bn' ? 'প্রদত্ত অর্ডার আইডি দিয়ে কোনো অর্ডার ডাটাবেজে পাওয়া যায়নি।' : 'No order matching this ID was found in the database.')}
          </p>
          <Link
            href="/account"
            className="inline-flex py-3 px-6 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer"
          >
            {language === 'bn' ? 'মাই অ্যাকাউন্টে ফিরে যান' : 'Back to My Account'}
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const normalizedStatus = normalizeOrderStatus(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const deliveryCharge = order.totalAmount > 0
    ? order.totalAmount - order.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
    : 60;
  const subtotal = order.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header searchQuery="" setSearchQuery={() => {}} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/account"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-orange-600 transition cursor-pointer bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'মাই অ্যাকাউন্টে ফিরুন' : 'Back to My Account'}</span>
            </Link>

            <span className="text-xs font-black text-slate-900 bg-slate-200 px-3 py-1 rounded-full">
              {order.orderNumber}
            </span>
          </div>

          {/* SECTION 1: ORDER HEADER BANNER */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-extrabold text-orange-400 uppercase tracking-wider block">
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং ও বিস্তারিত' : 'Order Tracking & Details'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">{order.orderNumber}</h1>
              </div>

              <span className="text-xs sm:text-sm font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-4 py-1.5 rounded-full">
                {normalizedStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-gray-300 font-medium gap-2 pt-1">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>{language === 'bn' ? 'তারিখ ও সময়:' : 'Order Date:'} {formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি' : 'Method: Cash on Delivery'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: VISUAL ORDER TRACKING TIMELINE (7 STAGES) */}
          <OrderTrackingTimeline status={order.status} createdAt={order.createdAt} />

          {/* SECTION 3: 2-COLUMN INFORMATION (CUSTOMER INFO & DELIVERY ADDRESS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Info */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase border-b border-gray-100 pb-3">
                <User className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'গ্রাহকের তথ্য (Customer Info)' : 'Customer Info'}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold block">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Name:'}</span>
                  <span className="font-extrabold text-slate-900 text-sm">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Phone Number:'}</span>
                  <span className="font-extrabold text-slate-900 text-sm">{order.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা (Delivery Address)' : 'Delivery Address'}</span>
              </div>

              <div className="space-y-1 text-xs text-gray-700 font-medium">
                <p className="font-extrabold text-slate-900 text-sm leading-relaxed">
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.district}
                </p>
                <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-800 font-extrabold px-2.5 py-0.5 rounded border border-slate-200">
                  {language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'}
                </span>
              </div>
            </div>

          </div>

          {/* SECTION 4: ORDERED PRODUCTS TABLE */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase">
                <Package className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'অর্ডারকৃত প্রোডাক্টসমূহ' : 'Ordered Products'}</span>
              </div>
              <span className="text-xs font-bold text-gray-500">
                {order.items.length} {language === 'bn' ? 'টি আইটেম' : 'Items'}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 p-1 border border-gray-200 shrink-0 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        ৳{item.unitPrice} x {item.quantity} {language === 'bn' ? 'টি' : 'Pcs'}
                      </p>
                    </div>
                  </div>

                  <span className="font-black text-slate-900 text-sm sm:text-base shrink-0">
                    ৳{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: PRICE SUMMARY & PAYMENT METHOD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-black text-sm uppercase tracking-wide text-orange-400">
                {language === 'bn' ? 'বিলিং ও পেমেন্ট সমারি' : 'Billing & Payment Summary'}
              </span>
              <span className="bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-0.5 rounded-full">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (Unpaid)' : 'Cash On Delivery (Unpaid)'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-300 font-medium">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'প্রোডাক্ট মূল্য (Subtotal):' : 'Item Subtotal:'}</span>
                <span className="font-bold text-white">৳{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                <span className="font-bold text-white">৳{deliveryCharge}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-white/10 text-base sm:text-lg font-black text-white">
                <span>{language === 'bn' ? 'সর্বমোট প্রদেয় মূল্য:' : 'Total Amount Payable:'}</span>
                <span className="text-orange-400 text-xl font-black">
                  ৳{order.totalAmount}
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};
