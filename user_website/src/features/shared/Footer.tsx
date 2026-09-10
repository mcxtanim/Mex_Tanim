'use client';

import React from 'react';
import { Gamepad2, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-gray-400 text-xs border-t border-slate-800 mt-12">
      
      {/* Guarantees Bar */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-200">Express Delivery</h5>
              <p className="text-[10px] text-gray-500">Fast shipping all over Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-200">100% Authentic</h5>
              <p className="text-[10px] text-gray-500">Verified official gaming gear</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-200">Easy Returns</h5>
              <p className="text-[10px] text-gray-500">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-200">24/7 Support</h5>
              <p className="text-[10px] text-gray-500">Live chat & phone support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 p-1.5 rounded-lg text-white">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-white">{t.siteTitle}</span>
          <span className="text-gray-500 text-[11px]">© 2026. {t.footerRights}</span>
        </div>

        <p className="text-gray-500 text-[11px]">
          {t.footerTagline}
        </p>
      </div>

    </footer>
  );
};
