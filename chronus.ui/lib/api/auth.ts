import { apiClient, TokenManager } from './client';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  User 
} from '@/lib/types/api';

// ==========================================
// AUTH SERVICE
// ==========================================

export class AuthService {
  private static readonly AUTH_ENDPOINTS = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  };

  /**
   * Realiza login do usuário
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        this.AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      // Salvar token JWT
      if (response.accessToken) {
        TokenManager.setToken(response.accessToken);
        
        // Decodificar token para extrair informações do usuário (opcional)
        try {
          const payload = this.decodeJWT(response.accessToken);
          if (payload) {
            TokenManager.setUserInfo({
              id: payload.sub,
              email: payload.email,
              name: payload.name,
            });
          }
        } catch (error) {
          console.warn('Erro ao decodificar JWT:', error);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza registro de novo usuário
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        this.AUTH_ENDPOINTS.REGISTER,
        userData
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  static async logout(): Promise<void> {
    try {
      // Tentar fazer logout no servidor (opcional, mesmo se falhar limpar token local)
      try {
        await apiClient.post(this.AUTH_ENDPOINTS.LOGOUT);
      } catch (error) {
        console.warn('Erro no logout do servidor:', error);
      }
    } finally {
      // Sempre limpar dados locais
      TokenManager.removeToken();
      
      // Redirecionar para login se estiver no browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }

  /**
   * Obtém informações do usuário atual
   */
  static getCurrentUser(): User | null {
    return TokenManager.getUserInfo();
  }

  /**
   * Obtém o token de acesso atual
   */
  static getAccessToken(): string | null {
    return TokenManager.getToken();
  }

  /**
   * Verifica se o token JWT está expirado
   */
  static isTokenExpired(): boolean {
    const token = TokenManager.getToken();
    if (!token) return true;

    try {
      const payload = this.decodeJWT(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Decodifica um token JWT (sem verificar assinatura)
   */
  private static decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Middleware para verificar autenticação em páginas protegidas
   */
  static requireAuth(): boolean {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }
}

// ==========================================
// HOOKS AUXILIARES
// ==========================================

/**
 * Hook para verificar status de autenticação
 */
export const useAuthStatus = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();
  const isTokenExpired = AuthService.isTokenExpired();

  return {
    isAuthenticated: isAuthenticated && !isTokenExpired,
    currentUser,
    isTokenExpired,
  };
};

export { AuthService as default }; 