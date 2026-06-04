import React from 'react';
import Image, { ImageProps } from 'next/image';

interface PriorityImageProps extends Omit<ImageProps, 'priority' | 'loading'> {
  // Kita hilangkan priority dan loading dari props agar selalu diset ke true dan eager
}

const PriorityImage: React.FC<PriorityImageProps> = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      priority={true}
      loading="eager"
      {...props}
    />
  );
};

export default PriorityImage;
