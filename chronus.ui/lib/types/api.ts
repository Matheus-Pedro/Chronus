// ==========================================
// AUTH TYPES
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
}

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TASK TYPES
// ==========================================

export interface TaskItem {
  id: string;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
}

export interface CreateTaskResponse {
  id: string;
}

export interface UpdateTaskRequest {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface TasksResponse {
  tasks: TaskItem[];
}

// ==========================================
// SUBSCRIPTION TYPES
// ==========================================

export interface Subscription {
  id: string;
  planType: 'Free' | 'Pro' | 'Premium';
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
}

// ==========================================
// API RESPONSE WRAPPER
// ==========================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// ==========================================
// API ERROR TYPES
// ==========================================

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export class ApiException extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.details = details;
  }
} 