import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/features/shared/LanguageContext';
import { CartProvider } from '@/features/cart/CartContext';
import { AuthProvider } from '@/features/auth/AuthContext';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { AuthModal } from '@/features/auth/AuthModal';
import { FloatingChat } from '@/features/shared/FloatingChat';

export const metadata: Metadata = {
  title: 'Mex Tanim Store | Premium Gaming Gadgets Shop',
  description: 'Mex Tanim Store - Authentic gaming mice, mechanical keyboards, fast chargers, finger sleeves and headsets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <AuthModal />
              <FloatingChat />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
