import { API_CONFIG, buildApiUrl } from '@/config/api';
import { ApiRequestOptions, ApiResponse, ApiError } from '@/types/api';
import { secureStorage, STORAGE_KEYS } from '@/lib/secureStorage';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      requiresAuth = false
    } = options;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    // Prepare request config
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const url = buildApiUrl(endpoint);
      const response = await fetch(url, requestConfig);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        const error: ApiError = {
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          code: data.error?.code || `HTTP_${response.status}`,
          details: data.error?.details || {},
          timestamp: new Date().toISOString(),
        };

        // Handle 401 Unauthorized - trigger token refresh or logout
        if (response.status === 401 && requiresAuth) {
          await this.handleUnauthorized();
        }

        throw error;
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
          details: {},
          timestamp: new Date().toISOString(),
        } as ApiError;
      }

      // Re-throw API errors
      if (error && typeof error === 'object' && 'code' in error) {
        throw error;
      }

      // Handle unexpected errors
      throw {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: { originalError: error },
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
  }

  private async handleUnauthorized(): Promise<void> {
    try {
      // Try to refresh the token
      const refreshToken = secureStorage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        const response = await this.refreshToken(refreshToken);
        if (response.success) {
          // Token refreshed successfully, continue with original request
          return;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // If refresh fails, clear auth data and redirect to login
    this.logout();
    window.location.href = '/login';
  }

  // Auth API methods
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async refreshToken(token: string) {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: { token },
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/password/forgot', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    return this.request('/auth/password/reset', {
      method: 'POST',
      body: { token, password, confirmPassword },
    });
  }

  // User API methods
  async getUserProfile() {
    return this.request('/user/profile', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  async updateUserProfile(userData: import('@/types/api').UpdateProfileRequest) {
    return this.request<import('@/types/api').UserProfile>('/user/profile', {
      method: 'PUT',
      body: userData,
      requiresAuth: true,
    });
  }

  // Products API methods
  async getProducts(params?: Record<string, any>) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/products${queryString}`, {
      method: 'GET',
    });
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'GET',
    });
  }

  async searchProducts(query: string, params?: Record<string, any>) {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/products/search?${queryString}`, {
      method: 'GET',
    });
  }

  // Orders API methods
  async getOrders() {
    return this.request('/orders', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
      requiresAuth: true,
    });
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  }

  // Cart API methods
  async getCart() {
    return this.request('/cart', {
      method: 'GET',
      requiresAuth: true,
    });
  }

  async addToCart(itemData: any) {
    return this.request('/cart/add', {
      method: 'POST',
      body: itemData,
      requiresAuth: true,
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/remove/${itemId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return this.request(`/cart/update/${itemId}`, {
      method: 'PATCH',
      body: { quantity },
      requiresAuth: true,
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
      requiresAuth: true,
    });
  }

  // Utility methods
  logout(): void {
    secureStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  getAuthToken(): string | null {
    return secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  getUserData(): any {
    return secureStorage.getItem(STORAGE_KEYS.USER_DATA);
  }
}

// Export singleton instance
export const apiService = new ApiService();
