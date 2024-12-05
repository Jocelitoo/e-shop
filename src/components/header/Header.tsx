import Link from 'next/link';
import { Container } from '../Container';
import { Redressed } from 'next/font/google';
import { SearchBar } from './Search-bar';
import { UserMenu } from './User-menu';
import React from 'react';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { Cart } from './Cart';

const redressed = Redressed({ subsets: ['latin'], weight: ['400'] });

export const Header = async () => {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm py-4 border-b-[1px]">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className={`${redressed.className} text-2xl`}>
              E-Shop
            </Link>
          </div>

          <SearchBar />

          <div className="flex items-center gap-4 sm:gap-8">
            <Cart />

            <UserMenu currentUser={currentUser} />
          </div>
        </div>
      </Container>
    </header>
  );
};
