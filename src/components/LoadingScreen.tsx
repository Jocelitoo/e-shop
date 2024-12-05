import { Loader2Icon } from 'lucide-react';
import React from 'react';

interface LoadingScreenProps {
  text: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ text }) => {
  return (
    <div className="z-50 absolute left-0 top-0 w-full h-screen opacity-90 bg-black text-white flex flex-col items-center justify-center gap-4">
      <Loader2Icon className="size-16 animate-spin" />
      <p className="text-xl">{text}</p>
    </div>
  );
};
