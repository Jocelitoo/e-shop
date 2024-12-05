import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import React from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CartContextProvider } from '@/hooks/CartContextProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] }); // Fonte

export const metadata: Metadata = {
  title: 'E-Shop', // Título da página
  description: 'Site de venda de eletrônicos', // Descrição da página
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${poppins.className} flex flex-col min-h-screen text-slate-700`}
      >
        <CartContextProvider>
          <Header />

          {children}

          <Footer />

          <Toaster />
        </CartContextProvider>
      </body>
    </html>
  );
}
