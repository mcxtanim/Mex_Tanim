'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  CheckCircle2,
  Truck,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Building,
  Navigation,
  FileText,
  CreditCard,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Sparkles,
  Package,
} from 'lucide-react';
import { Product } from '../catalog/types';
import { useLanguage } from '../shared/LanguageContext';
import {
  BANGLADESH_ADDRESS_DATA,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from './bangladeshAddressData';

import { useCart } from '../cart/CartContext';

const ADMIN_ORDERS_KEY = 'mex_tanim_admin_orders';
const SAVED_ADDRESS_KEY = 'mex_tanim_saved_address';

interface BuyNowModalProps {
  product: Product | null;
  isOpen: boolean;
  initialQuantity?: number;
  onClose: () => void;
}

export const BuyNowModal: React.FC<BuyNowModalProps> = ({
  product,
  isOpen,
  initialQuantity = 1,
  onClose,
}) => {
  const { language } = useLanguage();
  const { removeFromCart } = useCart();

  // Quantity state inside modal
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [area, setArea] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  // UX & Validation States
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Synchronize initial quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity || 1);
      setErrorMsg('');
      setCompletedOrderNumber(null);

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Check for existing saved address
      try {
        const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) setName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.division) setDivision(parsed.division);
          if (parsed.district) setDistrict(parsed.district);
          if (parsed.upazila) setUpazila(parsed.upazila);
          if (parsed.area) setArea(parsed.area);
          setHasSavedAddress(true);
        }
      } catch (err) {
        console.error('Error reading saved address:', err);
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuantity]);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !completedOrderNumber) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, completedOrderNumber, onClose]);

  if (!isOpen || !product) return null;

  // Hierarchical Address Options
  const availableDistricts = division ? getDistrictsByDivision(division) : [];
  const availableUpazilas = division && district ? getUpazilasByDistrict(division, district) : [];

  // Reset child dropdowns when parent changes
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDivision(e.target.value);
    setDistrict('');
    setUpazila('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setUpazila('');
  };

  // Delivery charge calculation (Dhaka Division: ৳60, Outside Dhaka: ৳120)
  const deliveryCharge = division === 'dhaka' ? 60 : 120;
  const itemTotal = product.price * quantity;
  const totalPayable = itemTotal + deliveryCharge;

  // Handle Form Submission / Order Creation
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }

    if (!phone.trim() || phone.trim().length < 11 || !phone.trim().startsWith('01')) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)'
          : 'Please enter a valid 11-digit mobile number (e.g. 01700000000)'
      );
      return;
    }

    if (!division) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার বিভাগ সিলেক্ট করুন' : 'Please select your Division');
      return;
    }

    if (!district) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার জেলা সিলেক্ট করুন' : 'Please select your District');
      return;
    }

    if (!upazila) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার উপজেলা সিলেক্ট করুন' : 'Please select your Upazila');
      return;
    }

    if (!area.trim()) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে আপনার বিস্তারিত ঠিকানা / এলাকা লিখুন'
          : 'Please enter your exact area / street location'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDivData = BANGLADESH_ADDRESS_DATA.find((d) => d.id === division);
      const selectedDistData = availableDistricts.find((d) => d.id === district);
      const selectedUpaData = availableUpazilas.find((u) => u.id === upazila);

      const divLabel = selectedDivData ? (language === 'bn' ? selectedDivData.nameBn : selectedDivData.nameEn) : division;
      const distLabel = selectedDistData ? (language === 'bn' ? selectedDistData.nameBn : selectedDistData.nameEn) : district;
      const upaLabel = selectedUpaData ? (language === 'bn' ? selectedUpaData.nameBn : selectedUpaData.nameEn) : upazila;

      const generatedOrderNum = `MT-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderId = `ORD-${Date.now()}`;

      // Construct Order Object matching Admin Website Order interface
      const newOrder = {
        id: orderId,
        orderNumber: `#${generatedOrderNum}`,
        customerName: name.trim(),
        customerEmail: '',
        customerPhone: phone.trim(),
        shippingAddress: {
          street: `${area.trim()} (${upaLabel})`,
          city: upaLabel,
          district: `${distLabel}, ${divLabel}`,
          postalCode: '1200',
        },
        items: [
          {
            productId: product.id,
            title: language === 'bn' ? product.nameBn : product.name,
            quantity: quantity,
            unitPrice: product.price,
          },
        ],
        totalAmount: totalPayable,
        status: 'Order Placed',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Unpaid',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for Admin Website sync
      const existingOrdersRaw = localStorage.getItem(ADMIN_ORDERS_KEY);
      let existingOrders = [];
      if (existingOrdersRaw) {
        try {
          existingOrders = JSON.parse(existingOrdersRaw);
        } catch {
          existingOrders = [];
        }
      }

      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(updatedOrders));

      // Save Address if checkbox is enabled
      if (saveAddress) {
        const addressToSave = {
          name: name.trim(),
          phone: phone.trim(),
          division,
          district,
          upazila,
          area: area.trim(),
        };
        localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressToSave));
      }

      // Remove purchased item from cart
      removeFromCart(product.id);

      setIsSubmitting(false);
      setCompletedOrderNumber(generatedOrderNum);
      setCreatedOrderId(orderId);
    } catch (err) {
      console.error('Order creation error:', err);
      setIsSubmitting(false);
      setErrorMsg(language === 'bn' ? 'অর্ডার প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি অর্ডার' : 'Cash On Delivery Order'}
              </h3>
              <p className="text-[11px] text-gray-300 font-medium">
                {language === 'bn' ? 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন' : 'Pay when you receive your product'}
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

        {/* Modal Body Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 scrollbar-thin">

          {/* SUCCESS SCREEN VIEW */}
          {completedOrderNumber ? (
            <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                  #{completedOrderNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {language === 'bn' ? 'আপনার অর্ডারটি সফল হয়েছে!' : 'Order Placed Successfully!'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'ধন্যবাদ! আমাদের রিপ্রেজেন্টেটিভ শীঘ্রই আপনার নম্বরে কল দিয়ে অর্ডারটি কনফার্ম করবে।'
                    : 'Thank you! Our customer support team will call your phone number shortly to confirm delivery.'}
                </p>
              </div>

              {/* Order Details Confirmation Summary Card */}
              <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-extrabold text-slate-900">
                    {language === 'bn' ? 'অর্ডার প্রোডাক্ট:' : 'Ordered Product:'}
                  </span>
                  <span className="font-bold text-slate-700">
                    {language === 'bn' ? product.nameBn : product.name} (x{quantity})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-extrabold text-slate-900">
                    {language === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment Method:'}
                  </span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (Unpaid)' : 'Cash On Delivery (Unpaid)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">
                    {language === 'bn' ? 'সর্বমোট প্রদেয় মূল্য:' : 'Total Payable:'}
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    ৳{totalPayable}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {createdOrderId && (
                  <Link
                    href={`/account/order/${createdOrderId}`}
                    onClick={onClose}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <Package className="w-4 h-4 text-white" />
                    <span>
                      {language === 'bn'
                        ? 'অর্ডার ট্র্যাকিং ও বিস্তারিত দেখুন'
                        : 'Track Order & View Details'}
                    </span>
                  </Link>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    <span>{language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'Go to My Account'}</span>
                  </Link>

                  <button
                    onClick={onClose}
                    className="py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-extrabold text-xs rounded-2xl border border-gray-200 transition cursor-pointer active:scale-95"
                  >
                    {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
                  </button>
                </div>
              </div>
            </div>
          ) : (

            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleConfirmOrder} className="space-y-6">

              {/* 1. ORDER SUMMARY SECTION */}
              <div className="bg-gradient-to-br from-slate-50 to-orange-50/40 border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-1 border border-gray-200 shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {language === 'bn' ? product.nameBn : product.name}
                    </h4>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ৳{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through font-bold">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Control Inside Checkout Modal */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
                  <span className="text-xs font-bold text-gray-700">
                    {language === 'bn' ? 'পরিমাণ (Quantity):' : 'Quantity:'}
                  </span>
                  <div className="flex items-center space-x-3 bg-white px-3 py-1 rounded-xl border border-gray-300 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white flex items-center justify-center transition cursor-pointer text-slate-700 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-black text-sm text-slate-900 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white flex items-center justify-center transition cursor-pointer text-slate-700 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. CUSTOMER DELIVERY INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য' : 'Delivery Address & Customer Info'}</span>
                  </h4>

                  {hasSavedAddress && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ {language === 'bn' ? 'সংরক্ষিত ঠিকানা লোড করা হয়েছে' : 'Saved address loaded'}
                    </span>
                  )}
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name & Phone Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'bn' ? 'আপনার নাম *' : 'Customer Name *'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: আতিক তানভির' : 'e.g. Atik Tanvir'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={language === 'bn' ? 'যেমন: 01317170609' : 'e.g. 01317170609'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Hierarchical Address Selection: Division -> District -> Upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Division */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'bn' ? 'বিভাগ *' : 'Division *'}</span>
                    </label>
                    <select
                      value={division}
                      onChange={handleDivisionChange}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition cursor-pointer"
                    >
                      <option value="">{language === 'bn' ? '-- বিভাগ সিলেক্ট করুন --' : '-- Select Division --'}</option>
                      {BANGLADESH_ADDRESS_DATA.map((div) => (
                        <option key={div.id} value={div.id}>
                          {language === 'bn' ? div.nameBn : div.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <Navigation className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'bn' ? 'জেলা *' : 'District *'}</span>
                    </label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      disabled={!division}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!division
                          ? (language === 'bn' ? 'আগে বিভাগ সিলেক্ট করুন' : 'Select Division First')
                          : (language === 'bn' ? '-- জেলা সিলেক্ট করুন --' : '-- Select District --')}
                      </option>
                      {availableDistricts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {language === 'bn' ? dist.nameBn : dist.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      <span>{language === 'bn' ? 'উপজেলা *' : 'Upazila *'}</span>
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      disabled={!district}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!district
                          ? (language === 'bn' ? 'আগে জেলা সিলেক্ট করুন' : 'Select District First')
                          : (language === 'bn' ? '-- উপজেলা সিলেক্ট করুন --' : '-- Select Upazila --')}
                      </option>
                      {availableUpazilas.map((upa) => (
                        <option key={upa.id} value={upa.id}>
                          {language === 'bn' ? upa.nameBn : upa.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Area / Specific Location Input */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>{language === 'bn' ? 'বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা/ল্যান্ডমার্ক) *' : 'Area / Specific Location (House, Road, Landmark) *'}</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder={
                      language === 'bn'
                        ? 'যেমন: বাসা #১২, রোড #০৫, ব্লক-বি, মিরপুর-১০, ঢাকা'
                        : 'e.g. House #12, Road #05, Block-B, Mirpur-10, Dhaka'
                    }
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition resize-none"
                  />
                </div>

                {/* Save Address Checkbox */}
                <label className="flex items-center space-x-2.5 cursor-pointer pt-1 group">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">
                    {language === 'bn'
                      ? 'পরবর্তী অর্ডারের জন্য ঠিকানা সংরক্ষণ করুন'
                      : 'Save address information for future orders'}
                  </span>
                </label>
              </div>

              {/* 3. CASH ON DELIVERY PAYMENT METHOD */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-800 font-black text-xs sm:text-sm">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Payment Method: Cash on Delivery'}</span>
                  </div>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                    {language === 'bn' ? 'একমাত্র মেথড' : 'Only Method'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  {language === 'bn'
                    ? 'কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পণ্য হাতে পেয়ে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।'
                    : 'No advance payment required. Pay cash directly to the delivery person upon receiving your product.'}
                </p>
              </div>

              {/* 4. TOTAL BILL & CONFIRM ORDER BUTTON */}
              <div className="pt-2 border-t border-gray-200 space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600 font-medium">
                    <span>{language === 'bn' ? 'পণ্য মূল্য (Subtotal):' : 'Item Subtotal:'}</span>
                    <span className="font-bold text-slate-900">৳{itemTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 font-medium">
                    <span>{language === 'bn' ? `ডেলিভারি চার্জ (${division === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):` : `Delivery Charge (${division === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):`}</span>
                    <span className="font-bold text-slate-900">৳{deliveryCharge}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 font-black text-slate-900 text-sm sm:text-base">
                    <span>{language === 'bn' ? 'সর্বমোট প্রদেয় (Total Amount):' : 'Total Amount Payable:'}</span>
                    <span className="text-slate-900 text-lg sm:text-xl font-black">
                      ৳{totalPayable}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-5 h-5 text-orange-400 stroke-[3]" />
                  <span>
                    {isSubmitting
                      ? (language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...')
                      : (language === 'bn' ? 'অর্ডার নিশ্চিত করুন (৳' + totalPayable + ')' : 'Confirm Order (৳' + totalPayable + ')')}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
