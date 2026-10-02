'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Home,
  ChevronRight,
} from 'lucide-react';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { useLanguage } from '../shared/LanguageContext';
import { useStoreSettings, formatWhatsAppUrl } from '../shared/storeSettingsService';

export type PolicyTab = 'terms' | 'return' | 'privacy';

interface TermsViewProps {
  initialTab?: PolicyTab;
}

export const TermsView: React.FC<TermsViewProps> = ({ initialTab = 'terms' }) => {
  const { language } = useLanguage();
  const settings = useStoreSettings();
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  const whatsappUrl = formatWhatsAppUrl(settings.whatsappNumber);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-700 hover:text-orange-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-orange-600 font-extrabold">
              {activeTab === 'terms'
                ? (language === 'bn' ? 'শর্তাবলী ও নিয়মাবলী' : 'Terms & Conditions')
                : activeTab === 'return'
                ? (language === 'bn' ? 'রিটার্ন ও রিফান্ড পলিসি' : 'Return & Refund Policy')
                : (language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy')}
            </span>
          </nav>

          {/* Hero Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mex Tanim Store Policy Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'শর্তাবলী ও গ্রাহক পলিসি' : 'Terms & Customer Policies'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-xl leading-relaxed">
                  {language === 'bn'
                    ? 'Mex Tanim Store-এ আপনার কেনাকাটা নিরাপদ, স্বচ্ছ ও বিশ্বস্ত রাখতে আমাদের সকল নিয়মাবলী নিচে বিস্তারিত তুলে ধরা হলো।'
                    : 'Transparent, reliable and secure shopping guidelines and terms for Mex Tanim Store.'}
                </p>
              </div>

              {/* Quick WhatsApp Support Trigger */}
              <div className="shrink-0">
                <a
                  href={whatsappUrl || 'https://wa.me/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 border border-emerald-400/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? '১০০% বিশ্বস্ত' : '100% Genuine'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Policy Navigation Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shrink-0 ${
                activeTab === 'terms'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200/80'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'শর্তাবলী (Terms)' : 'Terms & Conditions'}</span>
            </button>

            <button
              onClick={() => setActiveTab('return')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shrink-0 ${
                activeTab === 'return'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200/80'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'রিটার্ন ও রিপ্লেসমেন্ট' : 'Return & Replacement'}</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shrink-0 ${
                activeTab === 'privacy'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200/80'
              }`}
            >
              <Lock className="w-4 h-4 text-orange-400" />
              <span>{language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</span>
            </button>
          </div>

          {/* TAB CONTENT CARDS */}

          {/* 1. TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'bn' ? 'শর্তাবলী ও নিয়মাবলী (Terms & Conditions)' : 'Terms & Conditions'}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {language === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last Updated: October 2026'}
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? '১. ভূমিকা ও ব্যবহারের গ্রহণযোগ্যতা' : '1. Introduction & Acceptance of Terms'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'Mex Tanim Store (mextanim.com বা mcx-tanim.web.app)-এ আপনাকে স্বাগতম। এই ওয়েবসাইটের যেকোনো সেবা ব্যবহারের মাধ্যমে অথবা পণ্য অর্ডার করার মাধ্যমে আপনি আমাদের এই শর্তাবলীর সাথে সম্পূর্ণভাবে সম্মত হচ্ছেন।'
                    : 'Welcome to Mex Tanim Store. By accessing our platform or placing an order, you agree to be bound by these Terms and Conditions in their entirety.'}
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? '২. পণ্যের বিবরণ ও ১০০% মৌলিকতা' : '2. Product Authenticity & Pricing'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'আমাদের স্টোরে প্রদর্শিত সমস্ত গেমিং গ্যাজেট ও ইলেকট্রনিক্স পণ্য ১০০% আসল ও অফিসিয়াল। ওয়েবসাইটে প্রদর্শিত সকল মূল্য বাংলাদেশি টাকায় (BDT ৳) নির্ধারিত। যেকোনো অফার বা মূল্য পরিবর্তন করার অধিকার কোম্পানি সংরক্ষণ করে।'
                    : 'All gaming gadgets and accessories showcased in our store are 100% authentic and genuine. All prices are listed in Bangladeshi Taka (BDT ৳). We reserve the right to revise product prices and promotional offers at any time.'}
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? '৩. অর্ডার নিশ্চিতকরণ ও প্রক্রিয়া' : '3. Order Placement & Verification'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'অনলাইনে অর্ডার করার পর আমাদের কাস্টমার সার্ভিস প্রতিনিধি ফোন কল বা হোয়াটসঅ্যাপ মেসেজের মাধ্যমে অর্ডার ভেরিফাই করতে পারেন। সঠিক ডেলিভারি ঠিকানা ও সচল মোবাইল নম্বর প্রদান করা আবশ্যক।'
                    : 'After an order is submitted online, our team may verify the order details via phone call or WhatsApp message. Providing a valid delivery address and active contact number is strictly required.'}
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? '৪. পেমেন্ট পদ্ধতি (ক্যাশ অন ডেলিভারি)' : '4. Payment Methods (Cash on Delivery)'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'আমরা সারাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা প্রদান করি। পণ্য হাতে পেয়ে ডেলিভারিম্যানকে নির্ধারিত টাকা পরিশোধ করুন। এছাড়া বিকাশ বা নগদেও নির্ধারিত নম্বরে পেমেন্ট গ্রহণ করা হয়।'
                    : 'We provide Cash on Delivery (COD) services across Bangladesh. Payment is collected upon package handover by the courier delivery agent. Direct bKash or Nagad payments are also supported upon arrangement.'}
                </p>
              </div>

              {/* Section 5: Unboxing Video Requirement */}
              <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{language === 'bn' ? 'বিশেষ সতর্কতা: আনবক্সিং ভিডিও বাধ্যতামূলক' : 'Important Note: Unboxing Video Mandatory'}</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  {language === 'bn'
                    ? 'কুরিয়ার থেকে পার্সেল গ্রহণের পর প্যাকেট খোলার শুরু থেকে কোনো কাট-ছাট বা পজ ছাড়া সম্পূর্ণ আনবক্সিং ভিডিও ধারণ করা বাধ্যতামূলক। পণ্যে কোনো বাহ্যিক ক্ষতি বা ভুল আইটেম পাওয়া গেলে এই ভিডিও প্রমাণ হিসেবে প্রদর্শন করতে হবে।'
                    : 'Customers must record a complete, unedited unboxing video starting from the sealed courier package. In case of any missing, broken or defective items, this unboxing video is required for replacement verification.'}
                </p>
              </div>
            </div>
          )}

          {/* 2. RETURN & REPLACEMENT */}
          {activeTab === 'return' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'bn' ? 'রিটার্ন ও রিপ্লেসমেন্ট পলিসি (Return & Replacement)' : 'Return & Replacement Policy'}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {language === 'bn' ? 'সহজ ও গ্রাহকবান্ধব রিপ্লেসমেন্ট সুবিধা' : 'Hassle-free replacement policy for our customers'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'রিপ্লেসমেন্ট প্রযোজ্য যেক্ষেত্রে' : 'Eligible for Replacement'}</span>
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
                    <li>{language === 'bn' ? 'পণ্যটি ফ্যাক্টরি ত্রুটিযুক্ত হলে' : 'Factory or manufacturing defects'}</li>
                    <li>{language === 'bn' ? 'ভুল বা ভিন্ন প্রোডাক্ট ডেলিভারি হলে' : 'Incorrect product model delivered'}</li>
                    <li>{language === 'bn' ? 'ডেলিভারির সময় ক্ষতিগ্রস্ত পাওয়া গেলে' : 'Damaged during transit with unboxing proof'}</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>{language === 'bn' ? 'যেক্ষেত্রে প্রযোজ্য নয়' : 'Not Eligible'}</span>
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
                    <li>{language === 'bn' ? 'গ্রাহকের অবহেলায় বা পানিতে পড়ে নষ্ট হলে' : 'Physical or liquid damage by user'}</li>
                    <li>{language === 'bn' ? 'প্যাকেজিং বা এক্সেসরিজ হারিয়ে ফেললে' : 'Missing original packaging, box, or parts'}</li>
                    <li>{language === 'bn' ? 'আনবক্সিং ভিডিও না থাকলে' : 'Claims without unboxing video proof'}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'রিটার্ন আবেদন করার নিয়ম:' : 'How to Claim a Replacement:'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {language === 'bn'
                    ? 'পণ্য গ্রহণের ২৪ ঘণ্টার মধ্যে আপনার অর্ডার নম্বর এবং আনবক্সিং ভিডিও সহ আমাদের হোয়াটসঅ্যাপ অথবা ফেসবুক পেজে মেসেজ পাঠান। আমাদের টিম ভিডিও পর্যালোচনা করে ৩ থেকে ৫ কার্যদিবসের মধ্যে রিপ্লেসমেন্ট পার্সেল কুরিয়ার করবে।'
                    : 'Contact our WhatsApp helpline or Facebook messenger with your Order ID and unboxing video within 24 hours of delivery. Once verified, a replacement will be dispatched within 3-5 business days.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'bn' ? 'প্রাইভেসি পলিসি (Privacy Policy)' : 'Privacy Policy'}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {language === 'bn' ? 'আপনার তথ্যের সম্পূর্ণ গোপনীয়তা ও সুরক্ষা' : 'Complete privacy and protection of your personal information'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'সংগৃহীত তথ্য' : 'Information We Collect'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'অর্ডার প্রসেস করার জন্য আমরা শুধুমাত্র আপনার নাম, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা সংরক্ষণ করি। আমরা কোনো অবস্থাতেই গ্রাহকের ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রয় বা শেয়ার করি না।'
                    : 'To process orders accurately, we collect only necessary delivery details (name, phone number, delivery address). We strictly never sell, trade, or share your data with unauthorized third parties.'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'নিরাপদ ডেটাবেস' : 'Data Security'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                  {language === 'bn'
                    ? 'আমাদের ওয়েবসাইট ও ডেটাবেস উচ্চমানের এনক্রিপশন ও সিকিউরিটি প্রোটোকল দ্বারা সুরক্ষিত। যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাপোর্ট সেন্টারে যোগাযোগ করতে পারেন।'
                    : 'Our system utilizes industry-standard HTTPS encryption and secure database technologies. If you have questions regarding your data, contact our support team anytime.'}
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};
