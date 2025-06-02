import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
        <img
          src={images[selectedImage]}
          alt={t('common.productImage')}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${
              selectedImage === index ? 'ring-2 ring-gold' : ''
            }`}
          >
            <img
              src={image}
              alt={`${t('common.productImage')} ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery; 