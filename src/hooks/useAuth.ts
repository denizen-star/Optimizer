/**
 * Authentication Hook with Comprehensive Tracking
 * Handles user authentication with detailed timestamp tracking for all actions
 */

import { useState, useEffect, useCallback } from 'react';
import { authTrackingService, AuthAction } from '../services/authTrackingService';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthHookReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  getAuthEvents: () => any[];
  getAuthStats: () => any;
}

export const useAuth = (): AuthHookReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check for existing session
      const token = localStorage.getItem('optimizer_auth_token');
      const userData = localStorage.getItem('optimizer_user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Track session restoration
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { type: 'session_restore' }
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication'
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Track login attempt
    await authTrackingService.trackAuthEvent(AuthAction.LOGIN_ATTEMPT, {
      email: credentials.email,
      success: false, // Will update if successful
      metadata: { rememberMe: credentials.rememberMe }
    });

    try {
      // Check for account lockout
      if (authTrackingService.shouldLockAccount(credentials.email)) {
        const error = 'Account temporarily locked due to multiple failed attempts';
        
        await authTrackingService.trackAuthEvent(AuthAction.ACCOUNT_LOCKED, {
          email: credentials.email,
          success: false,
          errorReason: error
        });

        setAuthState(prev => ({ ...prev, isLoading: false, error }));
        return false;
      }

      // Simulate API call (replace with actual authentication API)
      const response = await simulateAuthAPI('login', credentials);
      
      if (response.success && response.user) {
        const user: User = {
          ...response.user,
          lastLoginAt: new Date()
        };

        // Store authentication data
        localStorage.setItem('optimizer_auth_token', response.token);
        localStorage.setItem('optimizer_user_data', JSON.stringify(user));
        
        if (credentials.rememberMe) {
          localStorage.setItem('optimizer_remember_me', 'true');
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Track successful login
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { 
            rememberMe: credentials.rememberMe,
            loginMethod: 'password'
          }
        });

        return true;
      } else {
        const errorReason = response.error || 'Invalid credentials';
        
        // Track failed login
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_FAILURE, {
          email: credentials.email,
          success: false,
          errorReason
        });

        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorReason 
        }));
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.LOGIN_FAILURE, {
        email: credentials.email,
        success: false,
        errorReason: errorMessage
      });

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Track signup attempt
    await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_ATTEMPT, {
      email: data.email,
      success: false,
      metadata: { name: data.name }
    });

    try {
      const response = await simulateAuthAPI('signup', data);
      
      if (response.success && response.user) {
        const user: User = response.user;

        // Store authentication data
        localStorage.setItem('optimizer_auth_token', response.token);
        localStorage.setItem('optimizer_user_data', JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Track successful signup
        await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { name: user.name }
        });

        return true;
      } else {
        const errorReason = response.error || 'Signup failed';
        
        await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
          email: data.email,
          success: false,
          errorReason
        });

        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorReason 
        }));
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
        email: data.email,
        success: false,
        errorReason: errorMessage
      });

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const currentUser = authState.user;
    
    // Track logout
    if (currentUser) {
      await authTrackingService.trackAuthEvent(AuthAction.LOGOUT, {
        userId: currentUser.id,
        email: currentUser.email,
        success: true
      });
    }

    // Clear authentication data
    localStorage.removeItem('optimizer_auth_token');
    localStorage.removeItem('optimizer_user_data');
    localStorage.removeItem('optimizer_remember_me');
    sessionStorage.clear();

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }, [authState.user]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_RESET_REQUEST, {
      email,
      success: true
    });

    try {
      const response = await simulateAuthAPI('resetPassword', { email });
      return response.success;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('changePassword', {
        currentPassword,
        newPassword,
        userId: authState.user.id
      });

      if (response.success) {
        await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_CHANGE, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });
        return true;
      }
      
      return false;
    } catch (error) {
      await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_CHANGE, {
        userId: authState.user.id,
        email: authState.user.email,
        success: false,
        errorReason: error instanceof Error ? error.message : 'Password change failed'
      });
      return false;
    }
  }, [authState.user]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('updateProfile', {
        userId: authState.user.id,
        updates
      });

      if (response.success && response.user) {
        const updatedUser = { ...authState.user, ...response.user };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.PROFILE_UPDATE, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true,
          metadata: { updatedFields: Object.keys(updates) }
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  }, [authState.user]);

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await simulateAuthAPI('verifyEmail', { token });
      
      if (response.success) {
        // Update user if logged in, otherwise just track the verification
        if (authState.user && response.userId === authState.user.id) {
          const updatedUser = { ...authState.user, emailVerified: true };
          localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
          setAuthState(prev => ({ ...prev, user: updatedUser }));
        }

        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
          userId: response.userId,
          email: response.email,
          success: true,
          metadata: { loggedIn: !!authState.user }
        });

        return true;
      } else {
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
          email: response.email || 'unknown',
          success: false,
          errorReason: response.error || 'verification_failed',
          metadata: { token: token.substring(0, 8) + '...' }
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
        success: false,
        errorReason: errorMessage,
        metadata: { token: token.substring(0, 8) + '...' }
      });
      
      console.error('Email verification failed:', error);
      return false;
    }
  }, [authState.user]);

  const resendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Track email verification sent
      await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
        email,
        success: true,
        metadata: { type: 'resend' }
      });

      const response = await simulateAuthAPI('resendVerification', { email });
      return response.success;
    } catch (error) {
      await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
        email,
        success: false,
        errorReason: error instanceof Error ? error.message : 'Failed to resend verification email'
      });
      
      console.error('Resend verification failed:', error);
      return false;
    }
  }, []);

  const enableTwoFactor = useCallback(async (): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('enableTwoFactor', {
        userId: authState.user.id
      });
      
      if (response.success) {
        const updatedUser = { ...authState.user, twoFactorEnabled: true };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.TWO_FACTOR_ENABLED, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Two-factor enable failed:', error);
      return false;
    }
  }, [authState.user]);

  const disableTwoFactor = useCallback(async (password: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('disableTwoFactor', {
        userId: authState.user.id,
        password
      });
      
      if (response.success) {
        const updatedUser = { ...authState.user, twoFactorEnabled: false };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.TWO_FACTOR_DISABLED, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Two-factor disable failed:', error);
      return false;
    }
  }, [authState.user]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await simulateAuthAPI('refreshToken', {});
      
      if (response.success && response.token) {
        localStorage.setItem('optimizer_auth_token', response.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const getAuthEvents = useCallback(() => {
    if (!authState.user) return [];
    return authTrackingService.getEventsForUser(authState.user.id);
  }, [authState.user]);

  const getAuthStats = useCallback(() => {
    return authTrackingService.getAuthStats();
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail,
    enableTwoFactor,
    disableTwoFactor,
    refreshToken,
    getAuthEvents,
    getAuthStats
  };
};

// Simulate API calls (replace with actual API integration)
async function simulateAuthAPI(endpoint: string, data: any): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  switch (endpoint) {
    case 'login':
      // Simulate login validation
      if (data.email === 'demo@optimizer.com' && data.password === 'demo123') {
        return {
          success: true,
          token: 'demo_jwt_token_' + Date.now(),
          user: {
            id: 'user_demo_123',
            email: data.email,
            name: 'Demo User',
            emailVerified: true,
            twoFactorEnabled: false,
            createdAt: new Date('2024-01-01'),
            lastLoginAt: new Date(),
            role: 'user'
          }
        };
      }
      return { success: false, error: 'Invalid credentials' };

    case 'signup':
      return {
        success: true,
        token: 'new_jwt_token_' + Date.now(),
        user: {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: data.email,
          name: data.name,
          emailVerified: false,
          twoFactorEnabled: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          role: 'user'
        }
      };

    case 'resetPassword':
      return { success: true };

    case 'verifyEmail':
      // Simulate different verification scenarios for testing
      if (data.token === 'expired_token') {
        return { success: false, error: 'expired', email: 'demo@optimizer.com' };
      }
      if (data.token === 'invalid_token') {
        return { success: false, error: 'invalid', email: 'demo@optimizer.com' };
      }
      if (data.token === 'used_token') {
        return { success: false, error: 'used', email: 'demo@optimizer.com' };
      }
      
      // Valid token
      return { 
        success: true, 
        userId: 'user_demo_123',
        email: 'demo@optimizer.com'
      };

    case 'resendVerification':
      return { success: true };

    case 'changePassword':
    case 'updateProfile':
    case 'enableTwoFactor':
    case 'disableTwoFactor':
    case 'refreshToken':
      return { success: true };

    default:
      return { success: false, error: 'Unknown endpoint' };
  }
}
