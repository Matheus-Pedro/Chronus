"use client";

import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/lib/api/auth';
import type { LoginRequest, RegisterRequest, User } from '@/lib/types/api';

// ==========================================
// HOOK DE AUTENTICAÇÃO
// ==========================================

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // VERIFICAR AUTENTICAÇÃO INICIAL
  // ==========================================

  const checkAuth = useCallback(() => {
    try {
      const authenticated = AuthService.isAuthenticated() && !AuthService.isTokenExpired();
      const currentUser = AuthService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      
      // Atualizar estado local
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // REGISTRO
  // ==========================================

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await AuthService.register(userData);
      
      // Após registro bem-sucedido, fazer login automaticamente
      await login({
        email: userData.email,
        password: userData.password,
      });
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (err: any) {
      console.error('Erro no logout:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // ==========================================
  // LIMPAR ERRO
  // ==========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================
  // EFFECT INICIAL
  // ==========================================

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ==========================================
  // LISTENER PARA MUDANÇAS NO STORAGE
  // ==========================================

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chronus_access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}

// ==========================================
// HOOK PARA PROTEÇÃO DE ROTAS
// ==========================================

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirecionar para login se não autenticado
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
} 