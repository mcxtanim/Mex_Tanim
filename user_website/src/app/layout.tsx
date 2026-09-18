import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/features/shared/LanguageContext';
import { CartProvider } from '@/features/cart/CartContext';
import { AuthProvider } from '@/features/auth/AuthContext';
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <FloatingChat />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
