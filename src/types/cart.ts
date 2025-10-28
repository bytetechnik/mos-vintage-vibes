// Cart Item Interface
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  brandName: string;
  categoryName: string;
  size: string;
  conditionRating: number;
  image: string;
}

// Cart Data Interface
export interface Cart {
  id: string;
  userId: string;
  sessionId: string | null;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  expiresAt: string | null;
  items: CartItem[];
}

// API Response Interface
export interface CartResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  error: string | null;
  data: Cart;
  meta: any | null;
}

// Update Cart Item Payload
export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

// Add to Cart Payload
export interface AddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

// Remove from Cart Payload
export interface RemoveFromCartPayload {
  itemId: string;
}