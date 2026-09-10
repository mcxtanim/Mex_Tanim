'use client';

import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from './types';
import { useCart } from '../cart/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex items-center justify-center relative">
          <span className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
            {product.discountBadge}
          </span>
          <img
            src={product.image}
            alt={product.nameBn}
            className="max-h-72 w-full object-cover rounded-2xl border border-gray-200 shadow-md"
          />
        </div>

        {/* Right Details Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600">
              {product.categoryBn}
            </span>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {product.nameBn}
            </h2>
            <p className="text-xs text-gray-400 font-medium">{product.name}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} কাস্টমার রিভিউ)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 py-1">
              <span className="text-2xl font-black text-orange-600">৳{product.price}</span>
              <span className="text-sm text-gray-400 line-through">৳{product.originalPrice}</span>
              <span className="text-xs font-bold text-emerald-600">
                (সাশ্রয় ৳{product.originalPrice - product.price})
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed border-t pt-3">
              {product.descriptionBn}
            </p>

            {/* Key Specs */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-gray-800">মূল বৈশিষ্ট্যসমূহ:</span>
              <ul className="text-xs text-gray-600 space-y-1">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-500">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>অরিজিনাল গ্যারান্টি</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-600 hover:text-orange-600 px-1 font-bold"
                >
                  -
                </button>
                <span className="px-3 font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-600 hover:text-orange-600 px-1 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3 px-4 font-bold rounded-xl text-xs sm:text-sm text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                  added ? 'bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>কার্টে যোগ হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>কার্টে যোগ করুন (৳{product.price * quantity})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
