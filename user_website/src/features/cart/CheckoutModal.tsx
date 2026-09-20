'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, MapPin, Phone, User, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';
import { useLanguage } from '../shared/LanguageContext';
import { CartItem } from './types';
import { supabase } from '../../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_STORAGE_ORDERS_KEY = 'mex_tanim_admin_orders';

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, subtotal, clearCart } = useCart();
  const { language } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const deliveryCharge = deliveryArea === 'dhaka' ? 70 : 130;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setIsSubmitting(true);

    const orderId = `MEX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      customerName,
      phone,
      address,
      deliveryArea: deliveryArea === 'dhaka' ? 'ঢাকার ভিতরে (৳70)' : 'ঢাকার বাইরে (৳130)',
      deliveryCharge,
      items: cart.map((item: CartItem) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      totalAmount: grandTotal,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash / Nagad',
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
    };

    // Save to LocalStorage (Synced with Admin)
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      const orders = existing ? JSON.parse(existing) : [];
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
    } catch (err) {
      console.warn('Error saving mock order:', err);
    }

    // Save to Supabase if available
    if (supabase) {
      try {
        const productSummary = newOrder.items
          .map((it: any) => `${it.name || it.title || 'Product'} (x${it.quantity})`)
          .join(', ');

        await supabase.from('orders').insert({
          id: orderId,
          order_number: `#${orderId}`,
          customer_name: customerName,
          phone,
          product_name: productSummary,
          address,
          shipping_address: {
            street: address,
            city: deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
            district: deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
            postalCode: '1200',
          },
          delivery_area: deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
          delivery_charge: deliveryCharge,
          total_amount: grandTotal,
          status: 'Pending',
          items: newOrder.items,
          payment_method: newOrder.paymentMethod,
          payment_status: 'Unpaid',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase order insert notice:', err);
      }
    }

    setIsSubmitting(false);
    setCompletedOrder(newOrder);
    clearCart();
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setCustomerName('');
    setPhone('');
    setAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {completedOrder
                  ? (language === 'bn' ? 'অর্ডার সফল হয়েছে!' : 'Order Placed!')
                  : (language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Checkout & Confirm Order')}
              </h2>
              <p className="text-[11px] text-slate-300">
                {completedOrder
                  ? (language === 'bn' ? `অর্ডার আইডি: ${completedOrder.id}` : `Order ID: ${completedOrder.id}`)
                  : (language === 'bn' ? 'আপনার ডেলিভারি তথ্য প্রদান করুন' : 'Enter shipping details')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="bg-emerald-500/10 text-emerald-700 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20">
                  {completedOrder.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {language === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে' : 'Thank You! Order Received'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {language === 'bn'
                    ? 'আমাদের সাপোর্ট টিম খুব শীঘ্রই আপনার নাম্বারে কল করে অর্ডারটি কনফার্ম করবে।'
                    : 'Our support representative will call your number shortly to verify your order.'}
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                  <span className="font-extrabold text-slate-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">{language === 'bn' ? 'ফোন নাম্বার:' : 'Phone:'}</span>
                  <span className="font-extrabold text-slate-900">{completedOrder.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
                  <span className="font-extrabold text-slate-900 text-right max-w-[200px]">{completedOrder.address}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500">{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment:'}</span>
                  <span className="font-extrabold text-slate-900">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-black text-slate-800 text-sm">{language === 'bn' ? 'সর্বমোট (ডেলিভারিসহ):' : 'Total (Inc. Delivery):'}</span>
                  <span className="font-black text-orange-600 text-base">৳{completedOrder.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg transition"
              >
                {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
              </button>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Order Items Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {language === 'bn' ? 'অর্ডারের পণ্যসমূহ (' : 'Order Items ('}{cart.length})
                </div>
                <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item: CartItem) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </span>
                        <span className="text-slate-500 font-mono">x{item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-slate-900 shrink-0">৳{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'bn' ? 'আপনার নাম' : 'Full Name'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your full name'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'bn' ? 'মোবাইল নাম্বার' : 'Mobile Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা' : 'Full Address'} *</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder={language === 'bn' ? 'বাসা/রোড নম্বর, এরিয়া, থানা, জেলা' : 'House, Road, Thana, District'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white resize-none"
                  />
                </div>

                {/* Delivery Area Options */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'bn' ? 'ডেলিভারি এলাকা' : 'Delivery Location'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('dhaka')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                        deliveryArea === 'dhaka'
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold">{language === 'bn' ? 'ঢাকার ভিতরে' : 'Inside Dhaka'}</div>
                      <div className="text-[11px] opacity-80">৳70 (24-48 Hours)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                        deliveryArea === 'outside'
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</div>
                      <div className="text-[11px] opacity-80">৳130 (2-4 Days)</div>
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-black">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery'}</div>
                      <div className="text-[10px] text-slate-300">
                        {language === 'bn' ? 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন' : 'Pay after receiving product'}
                      </div>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30">
                    SAFE
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>{language === 'bn' ? 'পণ্যের মোট দাম:' : 'Subtotal:'}</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee:'}</span>
                  <span>৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                  <span className="text-orange-600 text-base">৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition transform active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? (language === 'bn' ? 'অর্ডার প্রসেসিং হচ্ছে...' : 'Processing Order...')
                  : (language === 'bn' ? `অর্ডার নিশ্চিত করুন (৳${grandTotal})` : `Confirm Order (৳${grandTotal})`)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
