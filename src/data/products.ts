import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: '1oz Gold Bar',
    slug: '1oz-gold-bar',
    description: 'Our 1oz Gold Bar is crafted with the finest gold, offering purity and quality. Each bar is stamped with its weight and purity, and comes with a certificate of authenticity. This is an excellent choice for both collectors and investors looking to add gold to their portfolio.',
    shortDescription: 'Premium 1oz gold bar with certificate of authenticity.',
    price: 2150.00,
    currency: 'USD',
    weight: 31.1,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg',
      'https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg',
      'https://images.pexels.com/photos/4386426/pexels-photo-4386426.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 124
  },
  {
    id: '2',
    name: 'American Eagle Gold Coin',
    slug: 'american-eagle-gold-coin',
    description: 'The American Eagle Gold Coin is one of the most recognized gold coins in the world. Made from 22-karat gold, these coins are backed by the U.S. government for weight and purity. The obverse features Lady Liberty, while the reverse showcases a family of eagles.',
    shortDescription: 'Official U.S. Mint gold coin, perfect for collectors and investors.',
    price: 2250.00,
    currency: 'USD',
    weight: 31.1,
    weightUnit: 'g',
    purity: '916.7',
    category: 'coins',
    subcategory: 'american',
    images: [
      'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg',
      'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg',
      'https://images.pexels.com/photos/4386424/pexels-photo-4386424.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 86
  },
  {
    id: '3',
    name: 'Gold Chain Necklace',
    slug: 'gold-chain-necklace',
    description: 'This elegant 18K gold chain necklace combines classic style with superior craftsmanship. The perfect addition to any jewelry collection, it features a secure clasp and comes in a luxurious gift box.',
    shortDescription: 'Elegant 18K gold chain necklace with secure clasp.',
    price: 1850.00,
    currency: 'USD',
    weight: 15.5,
    weightUnit: 'g',
    purity: '750',
    category: 'jewelry',
    subcategory: 'necklaces',
    images: [
      'https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg',
      'https://images.pexels.com/photos/8112097/pexels-photo-8112097.jpeg',
      'https://images.pexels.com/photos/11638029/pexels-photo-11638029.jpeg'
    ],
    inStock: true,
    new: true,
    rating: 4.7,
    reviews: 42
  },
  {
    id: '4',
    name: '100g Gold Bar',
    slug: '100g-gold-bar',
    description: 'Our 100g Gold Bar represents substantial gold ownership in a single product. Each bar is produced to exacting standards and features unique serial numbers for added security and authenticity verification.',
    shortDescription: 'Premium 100g gold bar with unique serial number.',
    price: 6800.00,
    currency: 'USD',
    weight: 100,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386437/pexels-photo-4386437.jpeg',
      'https://images.pexels.com/photos/4386358/pexels-photo-4386358.jpeg',
      'https://images.pexels.com/photos/4386353/pexels-photo-4386353.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 37
  },
  {
    id: '5',
    name: 'Krugerrand Gold Coin',
    slug: 'krugerrand-gold-coin',
    description: 'The South African Krugerrand is one of the most traded gold coins in the world. First minted in 1967, it was designed to help market South African gold. The obverse features the face of Paul Kruger, while the reverse shows a springbok antelope.',
    shortDescription: 'World-famous South African gold coin with iconic design.',
    price: 2180.00,
    currency: 'USD',
    weight: 31.1,
    weightUnit: 'g',
    purity: '916.7',
    category: 'coins',
    subcategory: 'south-african',
    images: [
      'https://images.pexels.com/photos/4386428/pexels-photo-4386428.jpeg',
      'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg',
      'https://images.pexels.com/photos/4386341/pexels-photo-4386341.jpeg'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 58
  },
  {
    id: '6',
    name: 'Gold Wedding Band',
    slug: 'gold-wedding-band',
    description: 'This classic 14K gold wedding band symbolizes eternal love with its timeless design. Comfortable for everyday wear, it features a polished finish and is available in multiple widths.',
    shortDescription: 'Classic 14K gold wedding band with polished finish.',
    price: 950.00,
    currency: 'USD',
    weight: 6.0,
    weightUnit: 'g',
    purity: '585',
    category: 'jewelry',
    subcategory: 'rings',
    images: [
      'https://images.pexels.com/photos/11627086/pexels-photo-11627086.jpeg',
      'https://images.pexels.com/photos/7988710/pexels-photo-7988710.jpeg',
      'https://images.pexels.com/photos/10247394/pexels-photo-10247394.jpeg'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 112
  },
  {
    id: '7',
    name: '1kg Gold Bar',
    slug: '1kg-gold-bar',
    description: 'Our 1kg Gold Bar represents a significant gold holding. Each bar is manufactured to the highest standards of purity and finish, featuring a unique serial number and comes with full certification.',
    shortDescription: 'Investment-grade 1kg gold bar with certification.',
    price: 68500.00,
    currency: 'USD',
    weight: 1000,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg',
      'https://images.pexels.com/photos/4386430/pexels-photo-4386430.jpeg',
      'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 14
  },
  {
    id: '8',
    name: 'Canadian Maple Leaf Gold Coin',
    slug: 'canadian-maple-leaf-gold-coin',
    description: 'The Canadian Maple Leaf gold coin is known for its exceptional purity of .9999 fine gold. First introduced in 1979, it features Queen Elizabeth II on the obverse and the iconic maple leaf on the reverse.',
    shortDescription: 'Ultra-pure Canadian gold coin with maple leaf design.',
    price: 2200.00,
    currency: 'USD',
    weight: 31.1,
    weightUnit: 'g',
    purity: '999.9',
    category: 'coins',
    subcategory: 'canadian',
    images: [
      'https://images.pexels.com/photos/6770779/pexels-photo-6770779.jpeg',
      'https://images.pexels.com/photos/4386368/pexels-photo-4386368.jpeg',
      'https://images.pexels.com/photos/4386369/pexels-photo-4386369.jpeg'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 72
  },
  {
    id: '9',
    name: '50g Gold Bar',
    slug: '50g-gold-bar',
    description: 'This 50g gold bar represents an ideal middle ground for investors. Each bar is manufactured to exacting standards and comes with full certification and secure packaging.',
    shortDescription: 'Premium 50g investment-grade gold bar.',
    price: 3400.00,
    currency: 'USD',
    weight: 50,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386432/pexels-photo-4386432.jpeg',
      'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg',
      'https://images.pexels.com/photos/4386434/pexels-photo-4386434.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 45
  },
  {
    id: '10',
    name: 'Vienna Philharmonic Gold Coin',
    slug: 'vienna-philharmonic-gold-coin',
    description: 'The Austrian Vienna Philharmonic gold coin features the Great Organ of the Golden Hall on one side and orchestral instruments on the other. A favorite among collectors worldwide.',
    shortDescription: 'Classic Austrian gold coin with musical motifs.',
    price: 2180.00,
    currency: 'USD',
    weight: 31.1,
    weightUnit: 'g',
    purity: '999.9',
    category: 'coins',
    subcategory: 'austrian',
    images: [
      'https://images.pexels.com/photos/6770782/pexels-photo-6770782.jpeg',
      'https://images.pexels.com/photos/6770783/pexels-photo-6770783.jpeg',
      'https://images.pexels.com/photos/6770784/pexels-photo-6770784.jpeg'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '11',
    name: 'Diamond-Set Gold Bracelet',
    slug: 'diamond-set-gold-bracelet',
    description: 'Elegant 18K gold bracelet featuring brilliant-cut diamonds. Perfect for special occasions or as a luxurious everyday piece.',
    shortDescription: '18K gold bracelet with diamond accents.',
    price: 3850.00,
    currency: 'USD',
    weight: 25.5,
    weightUnit: 'g',
    purity: '750',
    category: 'jewelry',
    subcategory: 'bracelets',
    images: [
      'https://images.pexels.com/photos/11627087/pexels-photo-11627087.jpeg',
      'https://images.pexels.com/photos/11627088/pexels-photo-11627088.jpeg',
      'https://images.pexels.com/photos/11627089/pexels-photo-11627089.jpeg'
    ],
    inStock: true,
    new: true,
    rating: 4.7,
    reviews: 28
  },
  {
    id: '12',
    name: '10g Gold Bar Set',
    slug: '10g-gold-bar-set',
    description: 'Collection of five 10g gold bars, perfect for flexible investment options. Each bar is individually sealed and certified.',
    shortDescription: 'Set of five 10g investment gold bars.',
    price: 3400.00,
    currency: 'USD',
    weight: 50,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386435/pexels-photo-4386435.jpeg',
      'https://images.pexels.com/photos/4386436/pexels-photo-4386436.jpeg',
      'https://images.pexels.com/photos/4386437/pexels-photo-4386437.jpeg'
    ],
    inStock: true,
    new: true,
    rating: 4.8,
    reviews: 32
  },
  {
    id: '13',
    name: 'Gold Chain Bracelet',
    slug: 'gold-chain-bracelet',
    description: 'Sophisticated 14K gold chain bracelet featuring a modern design. Perfect for everyday wear or special occasions.',
    shortDescription: 'Modern 14K gold chain bracelet.',
    price: 1250.00,
    currency: 'USD',
    weight: 12.5,
    weightUnit: 'g',
    purity: '585',
    category: 'jewelry',
    subcategory: 'bracelets',
    images: [
      'https://images.pexels.com/photos/11627090/pexels-photo-11627090.jpeg',
      'https://images.pexels.com/photos/11627091/pexels-photo-11627091.jpeg',
      'https://images.pexels.com/photos/11627092/pexels-photo-11627092.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 54
  },
  {
    id: '14',
    name: 'Chinese Panda Gold Coin',
    slug: 'chinese-panda-gold-coin',
    description: 'The Chinese Gold Panda features a new panda design each year, making it highly collectible. Contains 30g of 999.9 fine gold.',
    shortDescription: 'Annual Chinese Panda gold coin.',
    price: 2100.00,
    currency: 'USD',
    weight: 30,
    weightUnit: 'g',
    purity: '999.9',
    category: 'coins',
    subcategory: 'chinese',
    images: [
      'https://images.pexels.com/photos/6770785/pexels-photo-6770785.jpeg',
      'https://images.pexels.com/photos/6770786/pexels-photo-6770786.jpeg',
      'https://images.pexels.com/photos/6770787/pexels-photo-6770787.jpeg'
    ],
    inStock: true,
    new: true,
    rating: 4.9,
    reviews: 41
  },
  {
    id: '15',
    name: 'Gold Signet Ring',
    slug: 'gold-signet-ring',
    description: 'Classic 18K gold signet ring suitable for engraving. A timeless piece that can be personalized to your preference.',
    shortDescription: 'Traditional 18K gold signet ring.',
    price: 980.00,
    currency: 'USD',
    weight: 8.5,
    weightUnit: 'g',
    purity: '750',
    category: 'jewelry',
    subcategory: 'rings',
    images: [
      'https://images.pexels.com/photos/11627093/pexels-photo-11627093.jpeg',
      'https://images.pexels.com/photos/11627094/pexels-photo-11627094.jpeg',
      'https://images.pexels.com/photos/11627095/pexels-photo-11627095.jpeg'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 38
  },
  {
    id: '16',
    name: '500g Gold Bar',
    slug: '500g-gold-bar',
    description: 'Premium 500g gold bar for serious investors. Each bar features unique serial numbering and comes with full certification.',
    shortDescription: 'Investment-grade 500g gold bar.',
    price: 34000.00,
    currency: 'USD',
    weight: 500,
    weightUnit: 'g',
    purity: '999.9',
    category: 'bars',
    images: [
      'https://images.pexels.com/photos/4386438/pexels-photo-4386438.jpeg',
      'https://images.pexels.com/photos/4386439/pexels-photo-4386439.jpeg',
      'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg'
    ],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 12
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.new);
};

export const getRelatedProducts = (productId: string, category: string, limit = 4): Product[] => {
  return products
    .filter(product => product.id !== productId && product.category === category)
    .slice(0, limit);
};