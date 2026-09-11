'use client';

import React from 'react';
import { Header } from '@/features/shared/Header';
import { Footer } from '@/features/shared/Footer';
import { MyAccountView } from '@/features/account/MyAccountView';

export default function CustomerOrdersPage() {
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      {/* Site Header */}
      <Header />

      {/* Main My Orders Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full space-y-8">
        <MyAccountView />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
