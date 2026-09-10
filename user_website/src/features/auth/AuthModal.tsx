'use client';

import React, { useState } from 'react';
import { X, Lock, Phone, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from '../shared/LanguageContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, openAuthModal, login } = useAuth();
  const { t, language } = useLanguage();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 11) {
      setError(language === 'bn' ? 'সঠিক ১১ ডিজিটের নম্বর দিন' : 'Enter valid 11-digit phone number');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      setError(language === 'bn' ? 'আপনার নাম প্রদান করুন' : 'Please enter your name');
      return;
    }
    setError('');
    login(phone, name || 'Gamer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1.5 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-500 p-2.5 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.siteTitle}</h2>
              <p className="text-xs text-gray-300">
                {language === 'bn' ? 'গেমিং অ্যাকাউন্টে প্রবেশ করুন' : 'Access your gaming store account'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex mt-5 bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => { setError(''); openAuthModal('login'); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => { setError(''); openAuthModal('register'); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                authMode === 'register' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.register}
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: তানিম আহমেদ' : 'e.g. Tanim Ahmed'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition active:scale-[0.98] mt-2"
          >
            {authMode === 'login' ? t.login : t.register}
          </button>
        </form>

      </div>
    </div>
  );
};
