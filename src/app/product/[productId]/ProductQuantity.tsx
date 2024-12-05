'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface productQuantity {
  productQuantity: number;
  setProductQuantity: Dispatch<SetStateAction<number>>;
  inStock: number;
}

export const ProductQuantity: React.FC<productQuantity> = ({
  productQuantity,
  setProductQuantity,
  inStock,
}) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-4">
      <p className="uppercase font-semibold">Quantidade:</p>

      <div className="flex">
        <Button
          type="button"
          disabled={productQuantity <= 1}
          size={'icon'}
          variant="outline"
          onClick={() => setProductQuantity(productQuantity - 1)}
          className="border-slate-400"
        >
          -
        </Button>

        <Input
          value={productQuantity}
          onChange={(event) => {
            const newValue = Number(event.target.value);
            newValue > inStock
              ? toast({
                  description:
                    'A quantidade escolhida é maior que a disponível em estoque',
                  style: { backgroundColor: '#c52828', color: '#fff' },
                })
              : setProductQuantity(newValue);
          }}
          type="number"
          min={1}
          max={99}
          className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          type="button"
          size={'icon'}
          variant="outline"
          disabled={productQuantity >= inStock}
          onClick={() => setProductQuantity(productQuantity + 1)}
          className="border-slate-400"
        >
          +
        </Button>
      </div>
    </div>
  );
};
