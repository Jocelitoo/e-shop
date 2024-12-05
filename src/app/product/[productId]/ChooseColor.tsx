'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { ProductProps } from '@/utils/props';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ChooseColorProps {
  pickedImageColor: string;
  setPickedImageColor: Dispatch<SetStateAction<string>>;
  setPickedImageUrl: Dispatch<SetStateAction<string>>;
  product: ProductProps;
}

export const ChooseColor: React.FC<ChooseColorProps> = ({
  pickedImageColor,
  setPickedImageColor,
  setPickedImageUrl,
  product,
}) => {
  const changeColor = (event: string) => {
    const pickedImage = product.images.find((image) => image.color === event);

    if (pickedImage) {
      setPickedImageUrl(pickedImage.image);
      setPickedImageColor(pickedImage.color);
    }
  };

  return (
    <div className="flex gap-4">
      <p className="uppercase font-semibold">Cor:</p>

      <RadioGroup
        value={pickedImageColor}
        onValueChange={(event) => changeColor(event)}
        className="flex"
      >
        {product.images.map((image, index) => {
          return (
            <div key={index}>
              <RadioGroupItem
                value={image.color}
                id={`Cor${index + 1}`}
                className="hidden peer"
              />

              <Label
                htmlFor={`Cor${index + 1}`}
                style={{ backgroundColor: image.colorCode }}
                className="block size-6 rounded-full !mt-0 cursor-pointer outline-2 outline-cyan-500 outline-offset-2 peer-aria-checked:outline "
              >
                <span className="hidden">{image.color}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
