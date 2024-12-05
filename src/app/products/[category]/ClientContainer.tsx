'use client';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductProps } from '@/utils/props';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface ClientContainerProps {
  products: ProductProps[];
}

export const ClientContainer: React.FC<ClientContainerProps> = ({
  products,
}) => {
  const [order, setOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pega a página atual
  const [productsPerPage, setProductsPerPage] = useState(36);

  const neededPages = Math.ceil(products.length / productsPerPage); // Pega a quantidade de página que vai ser necessário. Math.Ceil() serve para arredondar o número para cima
  const amountOfPages: number[] = []; // Armazena o número de cada página  no array, para podermos usar map

  for (let i = 1; i <= neededPages; i++) {
    // Envia pro array o número de cada página
    amountOfPages.push(i);
  }

  // Lógica para mostrar os produtos de acordo com sua página
  const formatedProducts = products.slice(
    currentPage * productsPerPage - productsPerPage,
    currentPage * productsPerPage,
  );

  // Controla a quantidade de produtos por página de acordo com o tamanho da tela
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth >= 1024) setProductsPerPage(36);
    if (window.innerWidth >= 768 && window.innerWidth < 1024)
      setProductsPerPage(24);
    if (window.innerWidth >= 550 && window.innerWidth < 768)
      setProductsPerPage(18);
    if (window.innerWidth >= 350 && window.innerWidth < 550)
      setProductsPerPage(2);
    if (window.innerWidth < 350) setProductsPerPage(6);
  }, []);

  useEffect(() => {
    handleWindowResize(); // Executa a função quando a página é carregada

    // Executa a função quando a página é recarregada
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  // Menor para para maior
  if (order === 'price-') {
    products.sort((a, b) => {
      return a.price - b.price;
    });
  }

  // Maior preço para menor
  if (order === 'price+') {
    products.sort((a, b) => {
      return b.price - a.price;
    });
  }

  // Criado mais recente para os mais antigos
  if (order === 'date') {
    products.sort((a, b) => {
      return b.createdDate - a.createdDate;
    });
  }

  // Letra A até Z
  if (order === 'name') {
    products.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  // Quantidade de avaliações
  if (order === 'rating') {
    products.sort((a, b) => {
      return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    });
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="w-full flex justify-end gap-4">
        <Select onValueChange={(event) => setOrder(event)}>
          <SelectTrigger className="focus:ring-offset-0 w-36">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="price-">Menor preço</SelectItem>
              <SelectItem value="price+">Maior preço</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
              <SelectItem value="rating">Mais avaliado</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ProductCard products={formatedProducts} />

      {products.length !== 0 && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((previousValue) => previousValue - 1);
              window.scrollTo(0, 0); // Rola a página para o topo
            }}
          >
            <span className="sr-only">Voltar</span>
            <ArrowLeft />
          </Button>

          <div className="flex justify-center gap-2">
            {amountOfPages.map((page, index) => {
              const isPageInRange =
                (currentPage === 1 && page <= 3) ||
                (currentPage === amountOfPages.length &&
                  page >= amountOfPages.length - 2) ||
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1;

              return (
                isPageInRange && (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo(0, 0); // Rola a página para o topo
                    }}
                    className={`${currentPage === page && 'bg-slate-100'}`}
                  >
                    {page}
                  </Button>
                )
              );
            })}
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={currentPage === amountOfPages.length}
            onClick={() => {
              setCurrentPage((previousValue) => previousValue + 1);
              window.scrollTo(0, 0); // Rola a página para o topo
            }}
          >
            <span className="sr-only">Avançar</span>
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};
