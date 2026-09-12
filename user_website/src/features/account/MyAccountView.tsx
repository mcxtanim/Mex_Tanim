'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  Edit,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Building,
  Home,
  Star,
} from 'lucide-react';
import { CustomerOrder } from './types';
import { getCustomerOrders, getSavedCustomerAddress, getOrderStageIndex, ORDER_STAGES } from './orderSyncService';
import { hasCustomerReviewedOrderItem } from '../catalog/reviewService';
import { useLanguage } from '../shared/LanguageContext';
import { useCart } from '../cart/CartContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { ReviewSubmitModal } from '../catalog/ReviewSubmitModal';

export const MyAccountView: React.FC = () => {
  const { language } = useLanguage();
  const { cart, subtotal, openCart } = useCart();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    orderId?: string;
    productId: string;
    productTitle: string;
    productImage?: string;
    customerName?: string;
  }>({
    isOpen: false,
    productId: '',
    productTitle: '',
  });

  // Sync customer data & orders live on mount and interval
  const loadCustomerData = () => {
    const address = getSavedCustomerAddress();
    setSavedAddress(address);

    const customerOrders = getCustomerOrders(address?.phone);
    setOrders(customerOrders);
  };

  useEffect(() => {
    loadCustomerData();

    // Poll for admin order status changes every 3 seconds for live sync
    const interval = setInterval(() => {
      loadCustomerData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalCartQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleViewOrder = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleOpenReview = (order: CustomerOrder, item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReviewModalData({
      isOpen: true,
      orderId: order.id,
      productId: item.productId,
      productTitle: item.title,
      productImage: item.image,
      customerName: order.customerName || savedAddress?.name || '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Homepage Shortcut Breadcrumb Navigation Bar */}
      <nav className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-200/90 shadow-2xs text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-800 font-extrabold bg-slate-100 hover:bg-slate-900 hover:text-white px-3 py-1.5 rounded-xl border border-gray-200 transition cursor-pointer active:scale-95 group"
          >
            <Home className="w-4 h-4 text-orange-500 group-hover:text-orange-400" />
            <span>{language === 'bn' ? 'হোম পেজে ফিরুন' : 'Back to Home'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-slate-900 font-black">{language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
        </div>
      </nav>
      
      {/* Account & Orders Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-white/10 shrink-0">
            <Package className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {savedAddress?.name ? `${savedAddress.name} - ${language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}` : (language === 'bn' ? 'আমার অর্ডারসমূহ (My Orders)' : 'My Orders')}
              </h1>
              <span className="bg-orange-500/30 text-orange-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-orange-400/40">
                {language === 'bn' ? 'লাইভ সিঙ্ক' : 'Live Sync'}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium mt-1 flex items-center space-x-2">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'bn' ? 'আপনার অর্ডারের বর্তমান অবস্থা ও ৭-স্টেপ রিয়েল-টাইম ট্র্যাকিং' : 'Real-time 7-stage order status & tracking updates'}</span>
            </p>
          </div>
        </div>

        {/* Quick Cart Trigger Pill */}
        <button
          onClick={openCart}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer active:scale-95"
        >
          <ShoppingBag className="w-4 h-4 text-orange-400" />
          <span>{language === 'bn' ? `আমার কার্ট (${totalCartQty} Items)` : `My Cart (${totalCartQty} Items)`}</span>
        </button>
      </div>

      {/* 4 TOP SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: My Profile */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {language === 'bn' ? 'গ্রাহক প্রোফাইল' : 'My Profile'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              {savedAddress?.name || (language === 'bn' ? 'নাম সেভ করা নেই' : 'Name not saved')}
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {savedAddress?.phone || (language === 'bn' ? 'ফোন সেভ করা নেই' : 'Phone not saved')}
            </p>
          </div>
        </div>

        {/* Card 2: My Cart */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {language === 'bn' ? 'আমার কার্ট (My Cart)' : 'My Cart'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {cart.length} {language === 'bn' ? 'টি আলাদা প্রোডাক্ট' : 'Products'} ({totalCartQty} Qty)
              </h4>
              <p className="text-xs text-orange-600 font-black mt-0.5">
                Subtotal: ৳{subtotal}
              </p>
            </div>
            <button
              onClick={openCart}
              className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              {language === 'bn' ? 'খুলুন' : 'View'}
            </button>
          </div>
        </div>

        {/* Card 3: Saved Address */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {language === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Saved Address'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            {savedAddress ? (
              <p className="text-xs font-extrabold text-slate-900 line-clamp-2">
                {savedAddress.area}, {savedAddress.upazila}, {savedAddress.district}
              </p>
            ) : (
              <p className="text-xs text-gray-400 font-medium">
                {language === 'bn' ? 'কোনো ঠিকানা সেভ করা নেই' : 'No address saved'}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* MY ORDERS LIST SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl p-5 sm:p-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-100/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md border border-white/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'bn' ? 'আমার অর্ডারসমূহ (My Orders)' : 'My Orders'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {language === 'bn'
                  ? 'আপনার প্লেস করা সকল অর্ডারের রিয়েল-টাইম স্ট্যাটাস ও ট্র্যাকিং'
                  : 'Real-time order status, history and tracking'}
              </p>
            </div>
          </div>

          <span className="bg-slate-100/90 backdrop-blur-xs text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full border border-gray-200/80">
            {orders.length} {language === 'bn' ? 'টি অর্ডার' : 'Orders'}
          </span>
        </div>

        {/* Orders List / Empty State */}
        {orders.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100/90 text-slate-400 flex items-center justify-center mx-auto border border-gray-200/80">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                {language === 'bn' ? 'আপনি এখনো কোনো অর্ডার করেননি' : 'No Orders Placed Yet'}
              </h4>
              <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto mt-1">
                {language === 'bn'
                  ? 'আমাদের ক্যাটালগ থেকে চমৎকার গেমিং গ্যাজেট পছন্দ করে Buy Now বাটনে ক্লিক করুন।'
                  : 'Explore our gaming gadget catalog and click Buy Now to place your first order.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              language === 'bn' ? 'bn-BD' : 'en-US',
              { month: 'short', day: 'numeric', year: 'numeric' }
            );
            const stageIdx = getOrderStageIndex(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                onClick={() => handleViewOrder(order)}
                className="bg-white/80 backdrop-blur-md hover:bg-white/95 border border-white/60 hover:border-orange-500/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 space-y-4 shadow-lg shadow-slate-900/5 hover:shadow-2xl cursor-pointer"
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {order.orderNumber}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500 font-medium flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isCancelled ? (
                    <span className="bg-red-50/90 text-red-600 border border-red-200 text-xs font-black px-3 py-0.5 rounded-full backdrop-blur-xs">
                      Cancelled
                    </span>
                  ) : (
                    <span className="bg-emerald-50/90 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-0.5 rounded-full flex items-center space-x-1.5 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span>
                        {ORDER_STAGES[stageIdx]?.titleBn || order.status}
                      </span>
                    </span>
                  )}
                </div>

                {/* Middle Product Thumbnails & Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-1">
                    {order.items.map((item, idx) => {
                      const isDelivered = order.status === 'Delivered';
                      const alreadyReviewed = hasCustomerReviewedOrderItem(order.id, item.productId);

                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-gray-200/80 shrink-0 shadow-xs">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=150&q=80'}
                              alt={item.title}
                              className="w-10 h-10 object-contain rounded-md bg-slate-50 border border-gray-100"
                            />
                            <div className="max-w-[150px]">
                              <p className="font-extrabold text-xs text-slate-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-gray-500 font-semibold">
                                x{item.quantity} • ৳{item.unitPrice}
                              </p>
                            </div>
                          </div>


                        </div>
                      );
                    })}
                  </div>

                  <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200/80">
                    <span className="text-[11px] text-gray-500 font-medium block">
                      {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-slate-900">
                      ৳{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* DEDICATED ORDER DETAILS MODAL */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

    </div>
  );
};
