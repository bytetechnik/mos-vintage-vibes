import { Product, Brand } from '@/types/product';

export const brands: Brand[] = [
  { id: '1', name: 'Nike', logo: '/src/assets/brands/nike-logo.png' },
  { id: '2', name: 'Adidas', logo: '/src/assets/brands/adidas-logo.png' },
  { id: '3', name: 'Supreme', logo: '/src/assets/brands/supreme-logo.png' },
  { id: '4', name: 'Off-White', logo: '/src/assets/brands/off-white-logo.png' },
  { id: '5', name: 'Stone Island', logo: '/src/assets/brands/stone-island-logo.png' },
  { id: '6', name: 'Carhartt', logo: '/src/assets/brands/carhartt-logo.png' },
];

const dummyImages = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=640&fit=crop",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=640&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=640&fit=crop",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=640&fit=crop",
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=640&fit=crop"
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Nike Swoosh Hoodie',
    brand: 'Nike',
    price: 89.99,
    originalPrice: 120.00,
    description: 'Classic Nike hoodie with embroidered swoosh logo. Perfect for streetwear enthusiasts.',
    category: 'sweaters-hoodies',
    condition: { rating: 9, description: 'Item is in perfect condition, no signs of wear, looks like new' },
    size: 'L',
    color: 'Black',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: true,
    tags: ['vintage', 'streetwear', 'nike'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Levi\'s 501 Distressed Jeans',
    brand: 'Levi\'s',
    price: 65.00,
    originalPrice: 95.00,
    description: 'Authentic vintage Levi\'s 501 jeans with natural distressing and fading.',
    category: 'jeans',
    condition: { rating: 8, description: 'Item is used but in mint condition, has 2-3 small signs of wear' },
    size: '32/32',
    color: 'Blue',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: true,
    tags: ['vintage', 'denim', 'levis'],
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Adidas Track Jacket',
    brand: 'Adidas',
    price: 55.00,
    description: 'Classic Adidas three-stripe track jacket in excellent condition.',
    category: 'jackets',
    condition: { rating: 9, description: 'Item is in perfect condition, no signs of wear, looks like new' },
    size: 'M',
    color: 'Navy',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: false,
    tags: ['adidas', 'track', 'sporty'],
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'Supreme Box Logo Tee',
    brand: 'Supreme',
    price: 150.00,
    description: 'Rare Supreme box logo t-shirt from 2020 collection.',
    category: 'shirts-polos',
    condition: { rating: 10, description: 'Completely new with tags' },
    size: 'L',
    color: 'White',
    images: [
      ...dummyImages,
      '/placeholder.svg'
    ],
    inStock: true,
    featured: true,
    tags: ['supreme', 'rare', 'streetwear'],
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Nike Tech Fleece Joggers',
    brand: 'Nike',
    price: 45.00,
    originalPrice: 75.00,
    description: 'Comfortable Nike Tech Fleece joggers perfect for casual wear.',
    category: 'trackpants-joggers',
    condition: { rating: 8, description: 'Item is used but in mint condition, has 2-3 small signs of wear' },
    size: 'L',
    color: 'Gray',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: false,
    tags: ['nike', 'tech', 'comfort'],
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    name: 'Stone Island Tracksuit',
    brand: 'Stone Island',
    price: 320.00,
    description: 'Premium Stone Island tracksuit set with signature compass patch.',
    category: 'tracksuits',
    condition: { rating: 9, description: 'Item is in perfect condition, no signs of wear, looks like new' },
    size: 'L',
    color: 'Black',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: true,
    tags: ['stone-island', 'luxury', 'tracksuit'],
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    name: 'Vintage Snapback Cap',
    brand: 'Mitchell & Ness',
    price: 25.00,
    description: 'Classic vintage snapback cap with retro design.',
    category: 'accessories',
    condition: { rating: 7, description: 'Item is in okay condition, has several signs of wear' },
    size: 'One Size',
    color: 'Black/Red',
    images: [
      ...dummyImages,
      '/placeholder.svg'
    ],
    inStock: true,
    featured: false,
    tags: ['vintage', 'cap', 'accessory'],
    createdAt: '2024-01-09',
  },
  {
    id: '8',
    name: 'Carhartt Work Jacket',
    brand: 'Carhartt',
    price: 85.00,
    originalPrice: 140.00,
    description: 'Durable Carhartt work jacket with authentic vintage wear.',
    category: 'jackets',
    condition: { rating: 8, description: 'Item is used but in mint condition, has 2-3 small signs of wear' },
    size: 'XL',
    color: 'Brown',
    images: [
      ...dummyImages,
      '/placeholder.svg', '/placeholder.svg'
    ],
    inStock: true,
    featured: false,
    tags: ['carhartt', 'workwear', 'vintage'],
    createdAt: '2024-01-08',
  },
];

export const categoryNames = {
  'sweaters-hoodies': 'Sweaters & Hoodies',
  'jeans': 'Jeans',
  'jackets': 'Jackets',
  'shirts-polos': 'Shirts & Polos',
  'trackpants-joggers': 'Trackpants & Joggers',
  'accessories': 'Accessories',
  'tracksuits': 'Tracksuits',
};

export const conditionDescriptions = {
  10: 'Completely new with tags',
  9: 'Item is in perfect condition, no signs of wear, looks like new',
  8: 'Item is used but in mint condition, has 2-3 small signs of wear',
  7: 'Item is in okay condition, has several or major signs of wear',
};