-- Seed initial products
insert into products (name, slug, description, short_description, price, weight, weight_unit, purity, category, images, featured, is_new)
values
  (
    '1oz Gold Bar',
    '1oz-gold-bar',
    'Premium 1oz gold bar with certificate of authenticity. Each bar is stamped with its weight and purity.',
    'Premium 1oz gold bar with certificate of authenticity.',
    2150.00,
    31.1,
    'g',
    '999.9',
    'bars',
    array['https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg'],
    true,
    false
  ),
  (
    'American Eagle Gold Coin',
    'american-eagle-gold-coin',
    'The American Eagle Gold Coin is one of the most recognized gold coins worldwide. Made from 22-karat gold.',
    'Official U.S. Mint gold coin, perfect for collectors and investors.',
    2250.00,
    31.1,
    'g',
    '916.7',
    'coins',
    array['https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg'],
    true,
    true
  ),
  (
    'Gold Chain Necklace',
    'gold-chain-necklace',
    'Elegant 18K gold chain necklace with secure clasp. Perfect for everyday wear or special occasions.',
    'Elegant 18K gold chain necklace with secure clasp.',
    1850.00,
    15.5,
    'g',
    '750',
    'jewelry',
    array['https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg'],
    false,
    true
  );