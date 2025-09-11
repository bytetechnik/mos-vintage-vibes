// Environment Configuration
export const ENV_CONFIG = {
  API_BASE_URL: 'http://localhost:8083/api/v1',
  APP_NAME: 'Mo\'s VintageWorld',
  NODE_ENV: 'development',
  IS_DEV: false,
  IS_PROD: false,
} as const;

// Helper to check if we're in development mode
export const isDevelopment = ENV_CONFIG.IS_DEV;
export const isProduction = ENV_CONFIG.IS_PROD;

// Helper to get API URL with fallback
export const getApiBaseUrl = () => ENV_CONFIG.API_BASE_URL;
