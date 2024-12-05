'use client';

import { ChevronDown, User2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CurrentUserProps } from '@/utils/props';
import React, { useState } from 'react';
import { Separator } from '../ui/separator';
import { LoadingScreen } from '../LoadingScreen';

interface UserMenuProps {
  currentUser: CurrentUserProps | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);

    signOut({ redirect: false })
      .then(() => {
        router.push('/'); // Redireciona para a home
        router.refresh(); // Recarrega a página atual

        toast({
          description: 'Usuário deslogado',
          style: { backgroundColor: '#16a34a', color: '#fff' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingScreen text="Saindo..." />;
  }

  return (
    <DropdownMenu>
      {currentUser ? (
        <>
          <DropdownMenuTrigger className="flex p-2 bg-slate-200 border border-slate-700 rounded-full hover:bg-slate-700 group">
            <span className="sr-only">Menu de usuário</span>
            <Avatar className="size-6">
              <AvatarImage src={currentUser.image || ''} />
              <AvatarFallback className="bg-transparent">
                <User2 className="text-slate-700 group-hover:text-slate-200" />
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="text-slate-700 group-hover:text-slate-200" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/orders">Seus pedidos</Link>
            </DropdownMenuItem>

            {currentUser.role === 'ADMIN' && (
              <DropdownMenuItem>
                <Link href="/admin">Painel de administrador</Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>
              <Link href="/config">Configurações</Link>
            </DropdownMenuItem>

            <Separator />

            <DropdownMenuItem>
              <Button onClick={() => logout()} className="w-full bg-slate-700">
                Sair
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      ) : (
        <>
          <DropdownMenuTrigger className="flex p-2 bg-slate-200 border border-slate-700 rounded-full hover:bg-slate-700 group">
            <span className="sr-only">Menu de usuário</span>
            <User2 className="text-slate-700 group-hover:text-slate-200" />
            <ChevronDown className="text-slate-700 group-hover:text-slate-200" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href="/register">Registrar-se</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
};
