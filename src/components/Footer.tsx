import { Dot, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Container } from './Container';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-slate-700 text-slate-200 mt-16">
      <Container>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 lg:py-12">
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Categorias</h3>

            <ul className="space-y-1">
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Celulares
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Notebooks
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Desktops
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Relógios
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Televisões
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Acessórios
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl">Serviço personalizado</h3>

            <ul className="space-y-1">
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Contate-nos
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Política de vendas
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Reembolsos e trocas
                </Link>
              </li>
              <li className="hover:translate-x-3 transition-transform">
                <Link href="#" className="flex">
                  <Dot /> Perguntas
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl">Sobre</h3>

            <div>
              <p>
                Em nossa loja de eletrônicos, nos dedicamos à providenciar os
                melhores e mais recentes dispositivos e acessórios para nossos
                clientes. Com uma vasta seção de celulares, televisões,
                notebooks, relógios e acessórios
              </p>

              <p>
                &copy; {new Date().getFullYear()} E-Shop todos os direitos
                reservados
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl">Siga-nos</h3>

            <ul className="flex gap-2">
              <li className="transition-color hover:bg-slate-200 rounded-full group">
                <Link href="#">
                  <Facebook className="m-1 transition-colors group-hover:text-slate-700" />
                </Link>
              </li>
              <li className="transition-color hover:bg-slate-200 rounded-full group">
                <Link href="#">
                  <Twitter className="m-1 transition-colors group-hover:text-slate-700" />
                </Link>
              </li>
              <li className="transition-color hover:bg-slate-200 rounded-full group">
                <Link href="#">
                  <Instagram className="m-1 transition-colors group-hover:text-slate-700" />
                </Link>
              </li>
              <li className="transition-color hover:bg-slate-200 rounded-full group">
                <Link href="#">
                  <Youtube className="m-1 transition-colors group-hover:text-slate-700" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
};
