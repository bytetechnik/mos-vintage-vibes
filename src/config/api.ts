import { ENV_CONFIG } from './env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      PASSWORD_RESET: '/auth/password/reset',
      PASSWORD_FORGOT: '/auth/password/forgot',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    PRODUCTS: {
      LIST: '/products',
      DETAIL: '/products/:id',
      SEARCH: '/products/search',
    },
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      DETAIL: '/orders/:id',
    },
    CART: {
      GET: '/cart',
      ADD_ITEM: '/cart/add',
      REMOVE_ITEM: '/cart/remove/:id',
      UPDATE_QUANTITY: '/cart/update/:id',
      CLEAR: '/cart/clear',
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};
