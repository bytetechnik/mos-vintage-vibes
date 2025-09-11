// Secure Storage Utility with encryption
class SecureStorage {
  private readonly encryptionKey = 'mo-vintage-world-secure-key-2024';
  private readonly storagePrefix = 'mo_secure_';

  // Simple encryption (for production, consider using a more robust encryption library)
  private encrypt(text: string): string {
    try {
      // Convert to base64 and add a simple obfuscation layer
      const encoded = btoa(text);
      const obfuscated = encoded.split('').reverse().join('');
      return btoa(obfuscated);
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  }

  private decrypt(encryptedText: string): string {
    try {
      // Reverse the obfuscation and decode from base64
      const deobfuscated = atob(encryptedText).split('').reverse().join('');
      return atob(deobfuscated);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText;
    }
  }

  private getStorageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  setItem(key: string, value: any): void {
    try {
      const encryptedValue = this.encrypt(JSON.stringify(value));
      localStorage.setItem(this.getStorageKey(key), encryptedValue);
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  }

  getItem<T = any>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(this.getStorageKey(key));
      if (!encryptedValue) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  clear(): void {
    try {
      // Only remove our prefixed items
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Check if storage is available
  isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  AUTH_EXPIRY: 'auth_expiry',
} as const;
