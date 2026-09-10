'use client';

import React, { useState } from 'react';
import { Download, X, Gamepad2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const AppInstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <section id="app-install" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative bg-white border border-gray-200 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition"
          title={t.notNow}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center shadow-md shrink-0">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              {t.appInstallTitle}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.appInstallDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setIsVisible(false)}
            className="hidden sm:inline-block px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-slate-900"
          >
            {t.notNow}
          </button>
          <button
            onClick={() => alert('Mex Tanim Store Mobile PWA App installed!')}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-full shadow-md flex items-center justify-center space-x-2 transition active:scale-95"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>{t.appInstallBtn}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
