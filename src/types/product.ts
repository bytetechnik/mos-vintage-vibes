export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  size: string;
  color: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export type ProductCategory =
  | 'sweaters-hoodies'
  | 'jeans'
  | 'jackets'
  | 'shirts-polos'
  | 'trackpants-joggers'
  | 'accessories'
  | 'tracksuits';

export interface ProductCondition {
  rating: number; // 1-10
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  address?: Address;
  orders: Order[];
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  shippingAddress: Address;
  createdAt: string;
  isGuest: boolean;
  guestEmail?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}