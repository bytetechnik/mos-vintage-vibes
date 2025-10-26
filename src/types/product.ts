export interface ProductVariant {
  id?: string;
  sku?: string;
  sellingPrice: number;
  basePrice: number;
  costPrice: number;
  stockQuantity: number;
  image: string;
  size: string;
  color: string;
  material: string;
  active?: boolean;
}

export interface Product {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  categoryName?: string;
  image: string;
  conditionRating: number;
  sellingPrice: number;
  basePrice: number;
  maxPrice: number;
  inStock?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  viewCount?: number;
  purchaseCount?: number;
  variants: ProductVariant[];
  active?: boolean;
  featured?: boolean;
  relatedProducts?: Product[];
  createdAt?: any;
  updatedAt?: any;

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