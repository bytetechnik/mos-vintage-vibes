// utils/auth-helpers.ts
import { authKey } from "@/constants/storageKey";
import { getFromLocalStorage } from "@/utils/local-storage";

export interface IntendedAction {
  type: 'add-to-cart' | 'add-to-wishlist';
  productId: string;
  variantId?: string;
  quantity?: number;
  redirectUrl?: string;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = getFromLocalStorage(authKey);
  return !!token;
};

export const saveIntendedAction = (action: IntendedAction) => {
  if (typeof window === 'undefined') return;

  const fullAction: IntendedAction = {
    ...action,
    redirectUrl: action.redirectUrl || window.location.pathname + window.location.search,
  };

  localStorage.setItem('pending_action', JSON.stringify(fullAction));
};

export const getPendingAction = (): IntendedAction | null => {
  if (typeof window === 'undefined') return null;

  const action = localStorage.getItem('pending_action');
  if (action) {
    return JSON.parse(action);
  }
  return null;
};

export const clearPendingAction = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pending_action');
};

export const hasPendingAction = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('pending_action');
};