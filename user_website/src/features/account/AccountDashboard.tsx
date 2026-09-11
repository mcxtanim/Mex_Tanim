'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  LogOut,
  Edit,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { useLanguage } from '../shared/LanguageContext';
import {
  CustomerOrder,
  getCustomerOrders,
  ORDER_STAGES,
  normalizeOrderStatus,
  SAVED_ADDRESS_KEY,
} from './orderService';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';

export const AccountDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cart, totalItems, subtotal, openCart } = useCart();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'address'>('overview');
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);

  // Load saved address and customer orders on mount
  useEffect(() => {
    try {
      const rawAddress = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (rawAddress) {
        setSavedAddress(JSON.parse(rawAddress));
      }
    } catch (err) {
      console.error('Error reading saved address:', err);
    }

    const phoneToFilter = user?.phone || (savedAddress?.phone ? savedAddress.phone : '');
    const orders = getCustomerOrders(phoneToFilter);
    setCustomerOrders(orders);
  }, [user]);

  // Refresh orders when tab is focused
  const refreshOrders = () => {
    const phoneToFilter = user?.phone || (savedAddress?.phone ? savedAddress.phone : '');
    const orders = getCustomerOrders(phoneToFilter);
    setCustomerOrders(orders);
  };

  const customerName = user?.name || savedAddress?.name || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Valued Customer');
  const customerPhone = user?.phone || savedAddress?.phone || (language === 'bn' ? 'নম্বর যুক্ত নেই' : 'No Phone Added');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Header */}
        <Header searchQuery="" setSearchQuery={() => {}} />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
          
          {/* Top Banner / Welcome Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 z-10">
              <span className="bg-orange-500/20 text-orange-400 font-extrabold text-xs px-3.5 py-1 rounded-full border border-orange-500/30 uppercase tracking-wider">
                {language === 'bn' ? 'কাস্টমার ড্যাশবোর্ড' : 'Customer Dashboard'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {language === 'bn' ? `স্বাগতম, ${customerName}!` : `Welcome back, ${customerName}!`}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                {language === 'bn'
                  ? 'আপনার সকল অর্ডার, ট্র্যাকিং এবং ডেলিভারি ঠিকানা এক জায়গায় পরিচালনা করুন।'
                  : 'Manage your orders, tracking, saved address and account details.'}
              </p>
            </div>

            {/* Account Quick Stats Badges */}
            <div className="flex items-center space-x-3 z-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-xs text-gray-300 font-semibold block">{language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}</span>
                <span className="text-xl font-black text-white">{customerOrders.length}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-xs text-gray-300 font-semibold block">{language === 'bn' ? 'কার্ট আইটেম' : 'Cart Items'}</span>
                <span className="text-xl font-black text-orange-400">{cart.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-2 border-b border-gray-200/80 pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => { setActiveTab('overview'); refreshOrders(); }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-slate-900 border border-gray-200'
              }`}
            >
              <User className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'একনজরে ড্যাশবোর্ড' : 'Dashboard Overview'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); refreshOrders(); }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-slate-900 border border-gray-200'
              }`}
            >
              <Package className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'আমার অর্ডারসমূহ (' + customerOrders.length + ')' : 'My Orders (' + customerOrders.length + ')'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('address'); refreshOrders(); }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'address'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-slate-900 border border-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Saved Address'}</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Top Grid: Profile, Cart, Saved Address Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. MY PROFILE CARD */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase">
                        <User className="w-4 h-4 text-orange-500" />
                        <span>{language === 'bn' ? 'মাই প্রোফাইল' : 'My Profile'}</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {language === 'bn' ? 'সক্রিয় গ্রাহক' : 'Active Account'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 font-semibold">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{customerName}</h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 font-semibold">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Mobile Number:'}</span>
                      <p className="font-extrabold text-slate-800 text-sm">{customerPhone}</p>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-2xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লগআউট করুন' : 'Logout Account'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl transition cursor-pointer"
                    >
                      {language === 'bn' ? 'লগইন বা রেজিস্টার করুন' : 'Login or Register'}
                    </button>
                  )}
                </div>

                {/* 2. MY CART CARD */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase">
                        <ShoppingBag className="w-4 h-4 text-orange-500" />
                        <span>{language === 'bn' ? 'মাই কার্ট' : 'My Cart'}</span>
                      </div>
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-200">
                        {cart.length} {language === 'bn' ? 'টি ভিন্ন আইটেম' : 'Items'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xs text-gray-500 font-semibold block">{language === 'bn' ? 'মোট প্রোডাক্ট কোয়ান্টিটি:' : 'Total Quantity:'}</span>
                        <span className="text-sm font-extrabold text-slate-800">{totalItems} {language === 'bn' ? 'টি' : 'Pcs'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 font-semibold block">{language === 'bn' ? 'কার্ট সাবটোটাল:' : 'Cart Subtotal:'}</span>
                        <span className="text-lg font-black text-slate-900">৳{subtotal}</span>
                      </div>
                    </div>

                    {cart.length === 0 ? (
                      <p className="text-xs text-gray-500 italic pt-2">
                        {language === 'bn' ? 'আপনার কার্ট বর্তমানে খালি আছে।' : 'Your shopping cart is currently empty.'}
                      </p>
                    ) : (
                      <div className="flex items-center -space-x-2 overflow-hidden pt-1">
                        {cart.slice(0, 4).map((item) => (
                          <img
                            key={item.product.id}
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white bg-slate-100 shadow-xs"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={openCart}
                    className="w-full py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shadow-md"
                  >
                    <span>{language === 'bn' ? 'কার্ট খুলুন' : 'View Shopping Cart'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  </button>
                </div>

                {/* 3. SAVED ADDRESS CARD */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>{language === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Saved Address'}</span>
                      </div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
                        {savedAddress ? (language === 'bn' ? 'সেভ করা আছে' : 'Saved') : (language === 'bn' ? 'খালি' : 'Empty')}
                      </span>
                    </div>

                    {savedAddress ? (
                      <div className="space-y-1.5 text-xs text-gray-700 font-medium">
                        <p className="font-extrabold text-slate-900 text-sm">{savedAddress.name}</p>
                        <p className="text-gray-600 font-semibold">{savedAddress.phone}</p>
                        <p className="leading-relaxed text-gray-600">
                          {savedAddress.area}, {savedAddress.upazila}, {savedAddress.district}, {savedAddress.division}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic pt-2">
                        {language === 'bn'
                          ? 'কোনো সংরক্ষিত ঠিকানা পাওয়া যায়নি। পরবর্তী অর্ডারের সময় ঠিকানা চেক বক্সে সেভ করতে পারবেন।'
                          : 'No saved address found. Check "Save address" on your next order.'}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab('address')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-extrabold text-xs rounded-2xl transition flex items-center justify-center space-x-1.5 cursor-pointer border border-gray-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ঠিকানা দেখুন / এডিট করুন' : 'View / Edit Address'}</span>
                  </button>
                </div>

              </div>

              {/* RECENT ORDERS LIST PREVIEW */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {language === 'bn' ? 'সাম্প্রতিক অর্ডারসমূহ (Recent Orders)' : 'Recent Orders'}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {language === 'bn' ? 'আপনার সাম্প্রতিক কেনাকাটা ও ট্র্যাকিং স্ট্যাটাস' : 'Your recent purchases and tracking stages'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-black text-orange-600 hover:text-orange-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{language === 'bn' ? 'সবগুলো দেখুন →' : 'View All →'}</span>
                  </button>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-16 h-16 bg-slate-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                      {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Orders Found'}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      {language === 'bn'
                        ? 'আপনি এখনও কোনো অর্ডার করেননি। এখনই চমৎকার গেমিং গ্যাজেট অর্ডার করুন!'
                        : 'You have not placed any orders yet. Explore our awesome gaming gadgets now!'}
                    </p>
                    <Link
                      href="/"
                      className="inline-flex py-2.5 px-6 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer"
                    >
                      {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.slice(0, 3).map((order) => (
                      <OrderCardItem key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MY ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {language === 'bn' ? 'আমার সকল অর্ডার (' + customerOrders.length + ')' : 'My Orders (' + customerOrders.length + ')'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {language === 'bn'
                      ? 'নতুন থেকে পুরাতন ক্রমানুসারে আপনার সকল অর্ডারের তালিকা'
                      : 'List of all your orders sorted with newest first'}
                  </p>
                </div>
              </div>

              {customerOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-slate-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base">
                    {language === 'bn' ? 'আপনার কোনো অর্ডার নেই' : 'You Have No Orders'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {language === 'bn'
                      ? 'অর্ডার করার সাথে সাথে রিয়েল-টাইম স্ট্যাটাস সহ এখানে দেখতে পাবেন।'
                      : 'Orders will appear here with live tracking as soon as you place them.'}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex py-2.5 px-6 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer"
                  >
                    {language === 'bn' ? 'পণ্য দেখুন' : 'Explore Products'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <OrderCardItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESS */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {language === 'bn' ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Address'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {language === 'bn' ? 'পরবর্তী অর্ডারের জন্য ব্যবহৃত ব্রাউজারে সংরক্ষিত ঠিকানা' : 'Address saved in browser for your next orders'}
                  </p>
                </div>
              </div>

              {savedAddress ? (
                <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 font-semibold">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Name:'}</span>
                    <h4 className="font-black text-slate-900 text-base">{savedAddress.name}</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 font-semibold">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Mobile Number:'}</span>
                    <p className="font-extrabold text-slate-800 text-sm">{savedAddress.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 font-semibold">{language === 'bn' ? 'বিস্তারিত ঠিকানা:' : 'Full Address:'}</span>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">
                      {savedAddress.area}, {savedAddress.upazila}, {savedAddress.district}, {savedAddress.division}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-gray-300 rounded-2xl space-y-2">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-600 font-semibold">
                    {language === 'bn' ? 'কোনো ঠিকানা সেভ করা নেই' : 'No address saved'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {language === 'bn' ? 'Buy Now বাটনে ক্লিক করে ঠিকানা পূরণ ও সেভ করুন।' : 'Fill & save your address on your next Buy Now order.'}
                  </p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

// Reusable Order Card Item Component
const OrderCardItem: React.FC<{ order: CustomerOrder }> = ({ order }) => {
  const router = useRouter();
  const { language } = useLanguage();
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

  return (
    <div className="bg-slate-50/80 border border-gray-200/90 hover:border-orange-400 rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md space-y-4">
      
      {/* Top Row: Order ID, Date & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/70 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900 text-sm sm:text-base">
              {order.orderNumber}
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <span className="text-xs text-gray-500 font-medium">{formattedDate}</span>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
          {normalizedStatus}
        </span>
      </div>

      {/* Middle Row: Items Thumbnails & Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {order.items.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-2xl bg-white p-1 border border-gray-200 shadow-2xs shrink-0 flex items-center justify-center"
              >
                <ShoppingBag className="w-6 h-6 text-slate-700" />
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-1">
              {order.items[0]?.title || (language === 'bn' ? 'অর্ডারকৃত প্রোডাক্ট' : 'Ordered Product')}
              {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
            </h4>
            <span className="text-xs text-gray-500 font-medium">
              {order.items.length} {language === 'bn' ? 'টি আইটেম' : 'Items'} • Cash on Delivery
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[11px] text-gray-500 font-semibold block">{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'}</span>
          <span className="text-lg font-black text-slate-900">৳{order.totalAmount}</span>
        </div>

      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 border-t border-gray-200/70 flex items-center justify-end space-x-2">
        <Link
          href={`/account/order/${order.id}`}
          className="px-4 py-2 bg-white hover:bg-slate-900 hover:text-white border border-gray-300 font-extrabold text-xs text-slate-800 rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'বিবরণ দেখুন' : 'View Details'}</span>
        </Link>

        <Link
          href={`/account/order/${order.id}`}
          className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95"
        >
          <Truck className="w-3.5 h-3.5 text-orange-400" />
          <span>{language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order'}</span>
        </Link>
      </div>

    </div>
  );
};
