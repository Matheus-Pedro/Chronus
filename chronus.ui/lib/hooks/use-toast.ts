"use client";

import { useState, useCallback, useEffect } from 'react';

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let toastCounter = 0;

const TOAST_VARIANTS = {
  default: {
    className: 'bg-background text-foreground border',
    icon: '💬'
  },
  destructive: {
    className: 'bg-red-50 text-red-900 border-red-200',
    icon: '❌'
  },
  success: {
    className: 'bg-green-50 text-green-900 border-green-200',
    icon: '✅'
  },
  warning: {
    className: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    icon: '⚠️'
  },
  info: {
    className: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: 'ℹ️'
  }
};

// Store global para os toasts
let globalToasts: ToastData[] = [];
let globalListeners: Array<(toasts: ToastData[]) => void> = [];

function notifyListeners() {
  globalListeners.forEach(listener => listener([...globalToasts]));
}

function addToast(data: Omit<ToastData, 'id'>) {
  const id = `toast-${++toastCounter}`;
  const duration = data.duration ?? 5000;
  
  const newToast: ToastData = {
    id,
    ...data,
    variant: data.variant ?? 'default'
  };

  globalToasts.push(newToast);
  notifyListeners();

  // Auto remove após duração
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

function dismissToast(toastId: string) {
  globalToasts = globalToasts.filter(t => t.id !== toastId);
  notifyListeners();
}

function dismissAllToasts() {
  globalToasts = [];
  notifyListeners();
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>(globalToasts);

  // Registrar listener
  useEffect(() => {
    const listener = (newToasts: ToastData[]) => {
      setToasts(newToasts);
    };
    globalListeners.push(listener);
    
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    return addToast(data);
  }, []);

  const dismiss = useCallback((toastId: string) => {
    dismissToast(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    dismissAllToasts();
  }, []);

  return {
    toast,
    dismiss,
    dismissAll,
    toasts
  };
}

// Função utilitária para criar toasts específicos
export const createToast = {
  success: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      variant: 'success'
    });
  },
  
  error: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      variant: 'destructive'
    });
  },
  
  warning: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      variant: 'warning'
    });
  },
  
  info: (title: string, description?: string) => {
    return addToast({
      title,
      description,
      variant: 'info'
    });
  }
}; 