import { ApiException } from '@/lib/types/api';

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5150';
const API_TIMEOUT = 30000; // 30 seconds

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

class TokenManager {
  private static readonly TOKEN_KEY = 'chronus_access_token';
  private static readonly USER_KEY = 'chronus_user_info';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUserInfo(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUserInfo(): any | null {
    if (typeof window === 'undefined') return null;
    const userInfo = localStorage.getItem(this.USER_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

// ==========================================
// API CLIENT
// ==========================================

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch {
        // Se não conseguir fazer parse do JSON de erro, usar mensagem padrão
      }

      // Se erro 401, remover token e redirecionar para login
      if (response.status === 401) {
        TokenManager.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      throw new ApiException(errorMessage, response.status, errorDetails);
    }

    // Tentar fazer parse do JSON, se falhar retornar resposta vazia
    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('Erro de rede ou timeout', 0);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
      
      // Debug logs
      console.log('🚀 API Request:', {
        method: 'POST',
        url,
        data,
        headers: this.getHeaders()
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      const result = await this.handleResponse<T>(response);
      
      // Debug logs
      console.log('✅ API Response:', {
        status: response.status,
        url,
        result
      });

      return result;
    } catch (error) {
      // Debug logs
      console.error('❌ API Error:', {
        url: endpoint,
        error
      });
      
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('Erro de rede ou timeout', 0);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('Erro de rede ou timeout', 0);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${this.baseURL}/${endpoint}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('Erro de rede ou timeout', 0);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

const apiClient = new ApiClient();

export { apiClient, TokenManager, ApiClient };
export type { ApiException }; 