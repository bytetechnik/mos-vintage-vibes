import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { secureStorage, STORAGE_KEYS } from '@/lib/secureStorage';
import { apiService } from '@/services/apiService';
import { LoginRequest, RegisterRequest, User } from '@/types/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if we have stored auth data
      const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = secureStorage.getItem<User>(STORAGE_KEYS.USER_DATA);

      if (token && storedUser) {
        // Verify token is still valid by making a test request
        try {
          await apiService.getUserProfile();
          setUser(storedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear stored data
          console.warn('Stored token is invalid, clearing auth data');
          secureStorage.clear();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      secureStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await apiService.login(credentials.email, credentials.password);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store auth data securely
        secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        secureStorage.setItem(STORAGE_KEYS.USER_DATA, userData);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // Show success message
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.firstName}!`,
        });

        // Redirect to dashboard or intended page
        router.push('/dashboard');
        return true;
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);

      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await apiService.register(userData);

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;

        // Store auth data securely
        secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        secureStorage.setItem(STORAGE_KEYS.USER_DATA, newUser);

        // Update state
        setUser(newUser);
        setIsAuthenticated(true);

        // Show success message
        toast({
          title: "Registration successful",
          description: `Welcome to Mo's VintageWorld, ${newUser.firstName}!`,
        });

        // Redirect to dashboard
        router.push('/dashboard');
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: response.message || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear stored auth data
      secureStorage.clear();

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      if (!isAuthenticated) return;

      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        const updatedUser = response.data;

        // Update stored user data
        secureStorage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, user might be logged out
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
