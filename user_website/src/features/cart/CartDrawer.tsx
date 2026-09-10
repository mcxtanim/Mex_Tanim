'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import { useLanguage } from '../shared/LanguageContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    setDeliveryFee,
    clearCart,
  } = useCart();

  const { t, language } = useLanguage();
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isCartOpen) return null;

  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      clearCart();
      setOrderSuccess(false);
      closeCart();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-orange-500 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold tracking-tight">{t.cart}</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderSuccess ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'bn' ? 'অর্ডার সফল হয়েছে!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {language === 'bn'
                    ? 'আপনার অর্ডারটি কনফার্ম করা হয়েছে। আমরা শীঘ্রই ডেলিভারি শুরু করছি!'
                    : 'Thank you for shopping at Mex Tanim Store. Your gear is being prepared!'}
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-500">{t.emptyCart}</p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md hover:bg-orange-500 transition"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const title = language === 'bn' ? (product.nameBn || product.name) : product.name;
                return (
                  <div
                    key={product.id}
                    className="flex space-x-3 p-3 rounded-2xl border border-gray-100 bg-slate-50 hover:bg-white hover:shadow-md transition"
                  >
                    <img
                      src={product.image}
                      alt={title}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {title}
                        </h4>
                        <span className="text-xs font-extrabold text-orange-600 block mt-0.5">
                          ৳{product.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="text-gray-500 hover:text-slate-900 font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-slate-900 w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="text-gray-500 hover:text-slate-900 font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && !orderSuccess && (
            <div className="p-5 border-t border-gray-100 bg-slate-50 space-y-4">
              
              {/* Delivery Option Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-600 block">{t.deliveryFee}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryFee(60)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition ${
                      deliveryFee === 60
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    {t.insideDhaka}
                  </button>
                  <button
                    onClick={() => setDeliveryFee(120)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition ${
                      deliveryFee === 120
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    {t.outsideDhaka}
                  </button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-gray-200/80 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-slate-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.deliveryFee}</span>
                  <span className="font-bold text-slate-900">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-gray-200">
                  <span>{t.total}</span>
                  <span className="text-orange-600">৳{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-orange-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
