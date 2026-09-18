'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Building,
  Navigation,
  FileText,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  CreditCard,
  Banknote,
  RotateCcw,
} from 'lucide-react';
import { Header } from '@/features/shared/Header';
import { Footer } from '@/features/shared/Footer';
import { FloatingChat } from '@/features/shared/FloatingChat';
import { useCart } from '@/features/cart/CartContext';
import { useLanguage } from '@/features/shared/LanguageContext';
import { useStoreSettings } from '@/features/shared/storeSettingsService';
import { Product } from '@/features/catalog/types';
import { fetchProductById } from '@/features/catalog/productService';
import {
  BANGLADESH_ADDRESS_DATA,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from '@/features/checkout/bangladeshAddressData';
import { SearchableAddressSelect } from '@/features/checkout/SearchableAddressSelect';
import { supabase } from '@/lib/supabase';

const ADMIN_ORDERS_KEY = 'mex_tanim_admin_orders';
const SAVED_ADDRESS_KEY = 'mex_tanim_saved_address';

interface CheckoutItem {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, subtotal: cartSubtotal } = useCart();
  const { language, t } = useLanguage();
  const settings = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [directQty, setDirectQty] = useState<number>(1);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [area, setArea] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const directProductId = searchParams.get('productId');
  const directQuantityParam = searchParams.get('quantity');

  // Load direct product if query param exists
  useEffect(() => {
    if (directProductId) {
      setIsLoadingProduct(true);
      fetchProductById(directProductId)
        .then((prod) => {
          if (prod) {
            setDirectProduct(prod);
            const q = parseInt(directQuantityParam || '1', 10);
            setDirectQty(isNaN(q) || q < 1 ? 1 : q);
          }
        })
        .finally(() => setIsLoadingProduct(false));
    }
  }, [directProductId, directQuantityParam]);

  // Load saved address from localStorage on mount
  useEffect(() => {
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
  }, []);

  // Determine Items to Checkout
  const checkoutItems: CheckoutItem[] = directProduct
    ? [
        {
          id: directProduct.id,
          name: directProduct.name,
          nameBn: directProduct.nameBn,
          price: directProduct.price,
          originalPrice: directProduct.originalPrice,
          image: directProduct.image,
          quantity: directQty,
        },
      ]
    : cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        nameBn: item.product.nameBn,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image,
        quantity: item.quantity,
      }));

  const itemTotal = directProduct
    ? directProduct.price * directQty
    : cartSubtotal;

  // Address hierarchy
  const availableDistricts = division ? getDistrictsByDivision(division) : [];
  const availableUpazilas = division && district ? getUpazilasByDistrict(division, district) : [];

  const handleDivisionChange = (val: string) => {
    setDivision(val);
    setDistrict('');
    setUpazila('');
  };

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setUpazila('');
  };

  // Delivery Fee Calculation
  const insideFee = Number(settings.insideDhakaFee) || 60;
  const outsideFee = Number(settings.outsideDhakaFee) || 120;
  const isDhakaDivision =
    division === 'dhaka' ||
    division === '3' ||
    division.toLowerCase() === 'dhaka' ||
    division === 'ঢাকা';
  const rawDeliveryCharge = division ? (isDhakaDivision ? insideFee : outsideFee) : insideFee;
  const isFreeDelivery = settings.freeDeliveryThreshold > 0 && itemTotal >= settings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : rawDeliveryCharge;
  const totalPayable = itemTotal + deliveryCharge;

  // Submit Order
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (checkoutItems.length === 0) {
      setErrorMsg(language === 'bn' ? 'অর্ডার করার জন্য কোনো পণ্য পাওয়া যায়নি।' : 'No items to checkout.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন' : 'Please enter your full name');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন' : 'Please enter a valid 11-digit mobile number');
      return;
    }

    if (!division || !district || !upazila) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার বিভাগ, জেলা এবং উপজেলা সিলেক্ট করুন' : 'Please select your division, district and upazila');
      return;
    }

    if (!area.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা) লিখুন' : 'Please enter your detailed street address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find human-readable names for shipping address
      const selectedDivData = BANGLADESH_ADDRESS_DATA.find(
        (d) =>
          d.id === division ||
          d.nameEn.toLowerCase() === division.toLowerCase() ||
          d.nameBn === division ||
          (division === 'chittagong' && d.id === 'chittagong')
      );
      const selectedDistData = availableDistricts.find(
        (d) =>
          d.id === district ||
          d.nameEn.toLowerCase() === district.toLowerCase() ||
          d.nameBn === district ||
          d.id.replace(/-dist$/, '') === district.toLowerCase().replace(/-dist$/, '')
      );
      const selectedUpaData = availableUpazilas.find(
        (u) =>
          u.id === upazila ||
          u.nameEn.toLowerCase() === upazila.toLowerCase() ||
          u.nameBn === upazila ||
          u.id.replace(/-(ctg|gaz|din)$/, '') === upazila.toLowerCase().replace(/-(ctg|gaz|din)$/, '')
      );

      const divLabel = selectedDivData ? (language === 'bn' ? selectedDivData.nameBn : selectedDivData.nameEn) : division;
      const distLabel = selectedDistData ? (language === 'bn' ? selectedDistData.nameBn : selectedDistData.nameEn) : district;
      const upaLabel = selectedUpaData ? (language === 'bn' ? selectedUpaData.nameBn : selectedUpaData.nameEn) : upazila;

      const generatedOrderNum = `MT-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowIso = new Date().toISOString();
      const orderId = `ORD-${Date.now()}`;

      // Admin Order Representation
      const adminOrderObj = {
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
        items: checkoutItems.map((item) => ({
          productId: item.id,
          title: language === 'bn' ? item.nameBn || item.name : item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          image: item.image,
        })),
        subtotal: itemTotal,
        deliveryCharge: deliveryCharge,
        totalAmount: totalPayable,
        status: 'Pending',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Unpaid',
        notes: orderNotes.trim() || undefined,
        createdAt: nowIso,
        statusHistory: [
          {
            status: 'Order Placed',
            timestamp: nowIso,
            note: 'Order placed by customer via Cash on Delivery Landing Page',
          },
        ],
      };

      // Save to localStorage for Admin Sync
      try {
        const existingOrdersRaw = localStorage.getItem(ADMIN_ORDERS_KEY);
        const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        const updatedOrders = [adminOrderObj, ...existingOrders];
        localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(updatedOrders));
      } catch (err) {
        console.warn('LocalStorage order save notice:', err);
      }

      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new Event('storage'));
        } catch {}
      }

      // Save to Supabase Database
      if (supabase) {
        try {
          await supabase.from('orders').insert({
            id: orderId,
            order_number: adminOrderObj.orderNumber,
            customer_name: adminOrderObj.customerName,
            customer_email: null,
            phone: adminOrderObj.customerPhone,
            product_name: checkoutItems.map((i) => `${i.name} (x${i.quantity})`).join(', '),
            address: `${area.trim()}, ${upaLabel}, ${distLabel}, ${divLabel}`,
            shipping_address: adminOrderObj.shippingAddress,
            delivery_area: divLabel,
            delivery_charge: deliveryCharge,
            items: adminOrderObj.items,
            total_amount: totalPayable,
            payment_method: 'Cash on Delivery',
            payment_status: 'Unpaid',
            status: 'Pending',
            created_at: nowIso,
          });
        } catch (err) {
          console.warn('Supabase order insert notice:', err);
        }
      }

      // Save Address if requested
      if (saveAddress) {
        const addressToSave = {
          name: name.trim(),
          phone: phone.trim(),
          division,
          district,
          upazila,
          area: area.trim(),
        };
        try {
          localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressToSave));
        } catch (err) {
          console.warn('LocalStorage address save notice:', err);
        }

        if (supabase) {
          try {
            await supabase.from('saved_addresses').insert({
              id: `addr-${Date.now()}`,
              customer_name: name.trim(),
              phone: phone.trim(),
              division,
              district,
              upazila,
              area: area.trim(),
              created_at: nowIso,
            });
          } catch {}
        }
      }

      // Clear cart if ordered from cart
      if (!directProduct) {
        clearCart();
      }

      setCreatedOrder(adminOrderObj);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ORDER SUCCESS LANDING VIEW
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory="all"
            onSelectCategory={(cat) => router.push(`/?cat=${cat}`)}
          />

          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  {createdOrder.orderNumber}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'ধন্যবাদ! আপনার অর্ডারটি আমরা গ্রহণ করেছি। খুব শীঘ্রই আমাদের সাপোর্ট টিম আপনার নম্বরে কল করে কনফার্ম করবে।'
                    : 'Thank you for shopping at Mex Tanim Store! Our representative will call your mobile number shortly to verify your order.'}
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">{language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}</span>
                  <span className="font-extrabold text-slate-900">{createdOrder.customerName}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">{language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
                  <span className="font-extrabold text-slate-900">{createdOrder.customerPhone}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
                  <span className="font-extrabold text-slate-900 text-right max-w-xs">
                    {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.district}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</span>
                  <span className="font-extrabold text-slate-900 flex items-center space-x-1 text-orange-600">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-black text-slate-800 text-sm">
                    {language === 'bn' ? 'সর্বমোট প্রদেয় (ডেলিভারিসহ)' : 'Total Payable (Inc. Delivery)'}
                  </span>
                  <span className="text-xl font-black text-orange-600">৳{createdOrder.totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/orders"
                  className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>{language === 'bn' ? 'আমার অর্ডার ট্র্যাক করুন' : 'Track My Order'}</span>
                </Link>

                <Link
                  href="/"
                  className="flex-1 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-orange-500/25 transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}</span>
                </Link>
              </div>
            </div>
          </main>
        </div>

        <Footer />
        <FloatingChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory="all"
          onSelectCategory={(cat) => router.push(`/?cat=${cat}`)}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-orange-600 transition">
              {language === 'bn' ? 'কার্ট' : 'Cart'}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">
              {language === 'bn' ? 'অর্ডার কনফার্মেশন ও চেকআউট' : 'Order Confirmation & Checkout'}
            </span>
          </div>

          {/* Heading Banner matching reference screenshot */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-900/10">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/30">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center space-x-2">
                  <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি অর্ডার' : 'Cash On Delivery Order'}</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {language === 'bn' ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you receive your product'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10 text-orange-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? '১০০% বিশ্বস্ত ও আসল প্রোডাক্ট' : '100% Authentic & Safe'}</span>
            </div>
          </div>

          {/* Empty Checkout Guard */}
          {checkoutItems.length === 0 && !isLoadingProduct ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'অর্ডার করার জন্য কোনো পণ্য নির্বাচিত নেই' : 'No items selected for checkout'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'অনুগ্রহ করে কার্টে পণ্য যোগ করুন অথবা যেকোনো প্রোডাক্ট পেজ থেকে সরাসরি অর্ডার করুন।'
                  : 'Please add items to your cart or select Buy Now from any product page.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পণ্য ব্রাউজ করুন' : 'Browse Products'}</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left 2 Columns: Delivery Address Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
                  {/* Section Title with Saved Address Indicator */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="font-black text-slate-900 text-sm sm:text-base flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য' : 'Delivery Address & Customer Info'}</span>
                    </h2>

                    {hasSavedAddress && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        ✓ {language === 'bn' ? 'সংরক্ষিত ঠিকানা লোড করা হয়েছে' : 'Saved address loaded'}
                      </span>
                    )}
                  </div>

                  {/* Error Message Box */}
                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === 'bn' ? 'আপনার পুরো নাম *' : 'Customer Name *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your full name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Hierarchical Searchable Address Selection: Division -> District -> Upazila */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SearchableAddressSelect
                      label={language === 'bn' ? 'বিভাগ *' : 'Division *'}
                      icon={<Building className="w-3.5 h-3.5 text-slate-400" />}
                      value={division}
                      options={BANGLADESH_ADDRESS_DATA}
                      placeholder={language === 'bn' ? '-- বিভাগ সিলেক্ট করুন --' : '-- Select Division --'}
                      language={language}
                      required
                      onChange={handleDivisionChange}
                    />

                    <SearchableAddressSelect
                      label={language === 'bn' ? 'জেলা *' : 'District *'}
                      icon={<Navigation className="w-3.5 h-3.5 text-slate-400" />}
                      value={district}
                      options={availableDistricts}
                      placeholder={language === 'bn' ? '-- জেলা সিলেক্ট করুন --' : '-- Select District --'}
                      disabledPlaceholder={language === 'bn' ? 'আগে বিভাগ সিলেক্ট করুন' : 'Select Division First'}
                      disabled={!division}
                      language={language}
                      required
                      onChange={handleDistrictChange}
                    />

                    <SearchableAddressSelect
                      label={language === 'bn' ? 'উপজেলা / থানা *' : 'Upazila / Thana *'}
                      icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
                      value={upazila}
                      options={availableUpazilas}
                      placeholder={language === 'bn' ? '-- উপজেলা / থানা সিলেক্ট করুন --' : '-- Select Upazila / Thana --'}
                      disabledPlaceholder={language === 'bn' ? 'আগে জেলা সিলেক্ট করুন' : 'Select District First'}
                      disabled={!district}
                      language={language}
                      required
                      onChange={(val) => setUpazila(val)}
                    />
                  </div>

                  {/* Specific Location (House, Road, Landmark) */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'bn' ? 'বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা/ল্যান্ডমার্ক) *' : 'Area / Specific Location (House, Road, Landmark) *'}</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder={
                        language === 'bn'
                          ? 'যেমন: বাড়ি ১২, রোড ৪, ব্লক সি, নিচতলা'
                          : 'e.g. House 12, Road 4, Block C, Ground floor'
                      }
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>

                  {/* Optional Order Delivery Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-600 flex items-center space-x-1">
                      <span>{language === 'bn' ? 'বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)' : 'Delivery Instructions / Notes (Optional)'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'bn' ? 'ডেলিভারি ম্যানের জন্য কোনো বার্তা থাকলে লিখুন...' : 'Any special message for delivery...'}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-orange-500 outline-none transition"
                    />
                  </div>

                  {/* Save Address Checkbox */}
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                    />
                    <span>{language === 'bn' ? 'ভবিষ্যতে দ্রুত অর্ডারের জন্য এই ঠিকানা সংরক্ষণ করুন' : 'Save this address for faster checkout next time'}</span>
                  </label>
                </div>

                {/* Payment Method Badge */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <h3 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <span>{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</span>
                  </h3>

                  <div className="border-2 border-orange-500/40 bg-orange-50/40 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">
                          {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery (COD)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {language === 'bn' ? 'পণ্য হাতে পেয়ে দেখে টাকা দিন' : 'Pay with cash upon physical delivery'}
                        </span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border-4 border-orange-500 bg-white" />
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items Review & Confirmation */}
              <div className="lg:col-span-1 space-y-5 sticky top-28">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-base font-black text-slate-900">
                      {language === 'bn' ? 'অর্ডারের পণ্যসমূহ' : 'Order Summary'}
                    </h2>
                    <span className="text-xs font-extrabold text-slate-500">
                      {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} {language === 'bn' ? 'টি' : 'Items'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin divide-y divide-slate-100">
                    {checkoutItems.map((item) => {
                      const title = language === 'bn' ? item.nameBn || item.name : item.name;
                      return (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <img
                              src={item.image}
                              alt={title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 truncate max-w-[150px]">{title}</h4>
                              <span className="text-[11px] text-slate-400 font-mono">
                                ৳{item.price} × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-black text-slate-900 shrink-0">৳{item.price * item.quantity}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{language === 'bn' ? 'পণ্যের মোট মূল্য' : 'Subtotal'}</span>
                      <span className="font-bold text-slate-900">৳{itemTotal}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 items-center">
                      <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                      <span className="font-bold text-slate-900">
                        {isFreeDelivery ? (
                          <span className="text-emerald-600 font-extrabold uppercase">
                            {language === 'bn' ? 'ফ্রি' : 'Free'}
                          </span>
                        ) : (
                          <span>
                            ৳{deliveryCharge}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({isDhakaDivision ? (language === 'bn' ? 'ঢাকা' : 'Dhaka') : (language === 'bn' ? 'ঢাকার বাইরে' : 'Outside')})
                            </span>
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                      <span className="font-black text-slate-900 text-sm">
                        {language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Amount'}
                      </span>
                      <span className="text-2xl font-black text-orange-600">৳{totalPayable}</span>
                    </div>
                  </div>

                  {/* Confirm Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          {language === 'bn'
                            ? `অর্ডার নিশ্চিত করুন (৳${totalPayable})`
                            : `Confirm Order (৳${totalPayable})`}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Guarantees */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{language === 'bn' ? 'সারা বাংলাদেশে দ্রুততম হোম ডেলিভারি' : 'Fast nationwide home delivery'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{language === 'bn' ? 'পণ্য হাতে পেয়ে চেক করে টাকা দিন' : 'Inspect product before paying'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      <Footer />
      <FloatingChat />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
