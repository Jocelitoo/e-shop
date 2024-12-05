import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-20">
      {children}
    </div>
  );
};
