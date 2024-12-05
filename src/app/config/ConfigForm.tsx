'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NameForm } from './NameForm';
import { PasswordForm } from './PasswordForm';
import { CurrentUserProps } from '@/utils/props';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ConfigFormProps {
  currentUser: CurrentUserProps | null;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar usuário deslogado para a página de login
    if (!currentUser) router.replace('/login');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    currentUser && (
      <div>
        <Tabs defaultValue="account" className="w-full max-w-lg mx-auto mt-16">
          <TabsList className="w-full grid grid-cols-2 bg-slate-200">
            <TabsTrigger value="account">Nome</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <NameForm userId={currentUser.id} />
          </TabsContent>

          <TabsContent value="password">
            <PasswordForm userId={currentUser.id} />
          </TabsContent>
        </Tabs>
      </div>
    )
  );
};
