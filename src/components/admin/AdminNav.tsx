'use client';

import Link from 'next/link';
import { Separator } from '../ui/separator';
import { usePathname } from 'next/navigation';

export const AdminNav = () => {
  const pathName = usePathname();

  return (
    <>
      <nav className="">
        <ul className="flex flex-col justify-center md:gap-4 md:flex-row">
          <li className="flex">
            <Link
              href="/admin"
              className={`w-full text-center py-3 px-6 border-b-2 border-black md:border-0 ${pathName === '/admin' && ' bg-slate-400 md:bg-transparent md:border-b-2 text-black'} transition-colors duration-300 hover:bg-slate-200`}
            >
              Sumário
            </Link>
          </li>

          <li className="flex">
            <Link
              href="/admin/add-products"
              className={`w-full text-center py-3 px-6 border-b-2 border-black  md:border-0 ${pathName === '/admin/add-products' && ' bg-slate-400 md:bg-transparent md:border-b-2 text-black'} transition-colors duration-300 hover:bg-slate-200`}
            >
              Adicionar produtos
            </Link>
          </li>

          <li className="flex">
            <Link
              href="/admin/manage-products"
              className={`w-full text-center py-3 px-6 border-b-2 border-black  md:border-0 ${pathName === '/admin/manage-products' && ' bg-slate-400 md:bg-transparent md:border-b-2 text-black'} transition-colors duration-300 hover:bg-slate-200`}
            >
              Gerenciar produtos
            </Link>
          </li>

          <li className="flex">
            <Link
              href="/admin/manage-orders"
              className={`w-full text-center py-3 px-6 border-b-2 border-black md:border-0 ${pathName === '/admin/manage-orders' && ' bg-slate-400 md:bg-transparent md:border-b-2 text-black'} transition-colors duration-300 hover:bg-slate-200`}
            >
              Gerenciar pedidos
            </Link>
          </li>
        </ul>
      </nav>

      <Separator />
    </>
  );
};
