'use client';

import {
  Keyboard,
  Laptop,
  Monitor,
  Smartphone,
  Store,
  Tv2,
  Watch,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const categoryItems = [
  { value: 'All', icon: <Store />, label: 'Todos' },
  { value: 'Phone', icon: <Smartphone />, label: 'Celular' },
  { value: 'Laptop', icon: <Laptop />, label: 'Notebook' },
  { value: 'Desktop', icon: <Monitor />, label: 'Computador' },
  { value: 'Watch', icon: <Watch />, label: 'Relógio' },
  { value: 'Tv', icon: <Tv2 />, label: 'Televisão' },
  { value: 'Accessories', icon: <Keyboard />, label: 'Acessórios' },
];

interface CategoryNavProps {
  category?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ category }) => {
  return (
    <ScrollArea className="w-full my-4 whitespace-nowrap">
      <ul className="flex justify-between">
        {categoryItems.map((item, index) => {
          return (
            <li key={index} className="flex items-center space-x-2">
              <Link
                href={`/products/${item.value}`}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors duration-300 text-slate-400 border-black hover:bg-slate-200 hover:text-slate-700  ${category === item.value && 'text-slate-700 border-b-2'}`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
