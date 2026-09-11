'use client';

import React from 'react';
import {
  Truck,
  ShieldCheck,
  Headphones,
  Banknote,
  Facebook,
  Youtube,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { WhatsAppIcon } from './WhatsAppIcon';

const DEVELOPER_WHATSAPP = '8801317170609';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100/90 text-slate-800 border-t border-gray-200/80 mt-16 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          
          {/* Left Column (Brand Logo, Store Info, Service Highlights, Social Links) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Store Brand Logo & Tagline */}
            <div className="space-y-3">
              <a href="#" className="inline-block group">
                <img
                  src="/images/logo.png"
                  alt="Mex Tanim Store Logo"
                  className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
                />
              </a>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Shop Smart • Fast Delivery • Trusted Quality
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'সারাদেশে ক্যাশ অন ডেলিভারি সহ ১০০% অরিজিনাল গ্যাজেট। সহজ অর্ডার প্রক্রিয়া, দ্রুত সাপোর্ট এবং নিরাপদ কেনাকাটা।'
                  : 'Original products with cash on delivery all over Bangladesh. Easy ordering, quick support and hassle-free shopping.'}
              </p>
            </div>

            {/* 2x2 Refined Service Highlight Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
              {/* Highlight 1: Fast Delivery */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center space-x-3.5 hover:shadow-md hover:border-orange-300 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}
                  </h5>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'সারাদেশে' : 'All over Bangladesh'}
                  </p>
                </div>
              </div>

              {/* Highlight 2: Cash on Delivery */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center space-x-3.5 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                  </h5>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'পণ্য পাওয়ার সময় পেমেন্ট' : 'Payment on Delivery'}
                  </p>
                </div>
              </div>

              {/* Highlight 3: Quality Products */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center space-x-3.5 hover:shadow-md hover:border-slate-400 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {language === 'bn' ? 'মানসম্পন্ন পণ্য' : 'Quality Products'}
                  </h5>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? '১০০% অরিজিনাল' : '100% Original'}
                  </p>
                </div>
              </div>

              {/* Highlight 4: Quick Support */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex items-center space-x-3.5 hover:shadow-md hover:border-sky-300 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {language === 'bn' ? 'দ্রুত সাপোর্ট' : 'Quick Support'}
                  </h5>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'আমরা দ্রুত উত্তর দিই' : 'We reply quickly'}
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Social Media Links Bar */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Facebook Button */}
              <a
                href="https://facebook.com/mextanimstore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#1877F2] hover:text-white text-slate-800 border border-gray-200/90 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-2xs hover:shadow-md flex items-center space-x-2 cursor-pointer group"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
                <span>Facebook</span>
              </a>

              {/* YouTube Button */}
              <a
                href="https://youtube.com/@mextanimstore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#FF0000] hover:text-white text-slate-800 border border-gray-200/90 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-2xs hover:shadow-md flex items-center space-x-2 cursor-pointer group"
              >
                <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-white transition-colors" />
                <span>YouTube</span>
              </a>

              {/* Telegram Button */}
              <a
                href="https://t.me/mextanimstore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#0088cc] hover:text-white text-slate-800 border border-gray-200/90 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-2xs hover:shadow-md flex items-center space-x-2 cursor-pointer group"
              >
                <Send className="w-4 h-4 text-[#0088cc] group-hover:text-white transition-colors" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          {/* Right Column (Contact & Support Channels) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
            </h3>

            {/* Support Channels List */}
            <div className="space-y-3.5">
              {/* Channel 1: Facebook Helpline */}
              <a
                href="https://m.me/mextanimstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex items-center space-x-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0084FF] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.218V22l3.37-1.85c.928.257 1.91.397 2.896.397 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.18 12.396l-2.613-2.788-5.099 2.788 5.608-5.952 2.678 2.788 5.034-2.788-5.608 5.952z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {language === 'bn' ? 'ফেসবুক হেল্পলাইন' : 'Facebook Helpline'}
                    </h5>
                    <CheckCircle2 className="w-4 h-4 fill-[#0084FF] text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'সকাল ৮টা থেকে রাত ১২টা' : '8:00 AM - 12:00 AM'}
                  </p>
                </div>
              </a>

              {/* Channel 2: WhatsApp Support */}
              <a
                href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex items-center space-x-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <WhatsAppIcon className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {language === 'bn' ? 'হোয়াটসঅ্যাপ সাপোর্ট' : 'WhatsApp Support'}
                    </h5>
                    <CheckCircle2 className="w-4 h-4 fill-[#25D366] text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'সকাল ৮টা থেকে রাত ১২টা' : '8:00 AM - 12:00 AM'}
                  </p>
                </div>
              </a>

              {/* Channel 3: Telegram Support */}
              <a
                href="https://t.me/mextanimstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-300 flex items-center space-x-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.4-3.63 4-.17 4.83.52 4.77 1.07z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {language === 'bn' ? 'টেলিগ্রাম সাপোর্ট' : 'Telegram Support'}
                    </h5>
                    <CheckCircle2 className="w-4 h-4 fill-[#0088cc] text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {language === 'bn' ? 'সকাল ৮টা থেকে রাত ১২টা' : '8:00 AM - 12:00 AM'}
                  </p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Polished Bottom Bar: Copyright & Clickable Developer WhatsApp Link */}
        <div className="border-t border-gray-200/80 pt-6 text-center text-xs sm:text-sm text-gray-600 font-medium">
          <p>
            {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত | ডেভেলপ করেছেন ' : 'All rights reserved | Developed by '}
            <a
              href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 font-extrabold text-red-600 hover:text-red-700 hover:underline transition cursor-pointer"
              title="Chat with Developer Atik Tanvir on WhatsApp"
            >
              <span>Atik Tanvir</span>
              <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366] shrink-0 ml-0.5" />
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};
