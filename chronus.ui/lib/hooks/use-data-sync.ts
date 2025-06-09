import { useCallback, useEffect, useRef } from 'react';
import { AuthService } from '@/lib/api/auth';
import { TaskService } from '@/lib/api/tasks';

// ==========================================
// HOOK DE SINCRONIZAÇÃO DE DADOS
// ==========================================

interface SyncOptions {
  enableAutoSync?: boolean;
  syncInterval?: number; // em milissegundos
  enableBackgroundSync?: boolean;
  onSyncSuccess?: (data: any) => void;
  onSyncError?: (error: any) => void;
}

export function useDataSync(options: SyncOptions = {}) {
  const {
    enableAutoSync = true,
    syncInterval = 30000, // 30 segundos por padrão
    enableBackgroundSync = true,
    onSyncSuccess,
    onSyncError
  } = options;

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // ==========================================
  // FUNÇÃO DE SINCRONIZAÇÃO
  // ==========================================

  const performSync = useCallback(async (force = false) => {
    try {
      // Verificar se está autenticado
      if (!AuthService.isAuthenticated() || AuthService.isTokenExpired()) {
        console.warn('⚠️ Usuário não autenticado, cancelando sincronização');
        return null;
      }

      // Verificar se precisa sincronizar
      const now = Date.now();
      if (!force && (now - lastSyncRef.current) < syncInterval) {
        console.log('⏭️ Sincronização recente, pulando...');
        return null;
      }

      console.log('🔄 Iniciando sincronização de dados...');
      
      // Sincronizar tarefas
      const tasks = await TaskService.getUserTasks();
      console.log('✅ Tarefas sincronizadas:', tasks.length);

      // Atualizar timestamp da última sincronização
      lastSyncRef.current = now;

      const syncData = {
        tasks,
        timestamp: now,
        success: true
      };

      // Chamar callback de sucesso
      if (onSyncSuccess) {
        onSyncSuccess(syncData);
      }

      return syncData;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      
      // Chamar callback de erro
      if (onSyncError) {
        onSyncError(error);
      }
      
      return null;
    }
  }, [syncInterval, onSyncSuccess, onSyncError]);

  // ==========================================
  // SINCRONIZAÇÃO MANUAL
  // ==========================================

  const syncNow = useCallback(() => {
    return performSync(true);
  }, [performSync]);

  // ==========================================
  // CONFIGURAR SINCRONIZAÇÃO AUTOMÁTICA
  // ==========================================

  useEffect(() => {
    if (!enableAutoSync) return;

    console.log('🔄 Configurando sincronização automática a cada', syncInterval / 1000, 'segundos');

    // Limpar intervalo anterior se existir
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Configurar novo intervalo
    syncIntervalRef.current = setInterval(() => {
      performSync(false);
    }, syncInterval);

    // Sincronização inicial (só se não foi inicializado ainda)
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      performSync(true);
    }

    // Cleanup
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [enableAutoSync, syncInterval, performSync]);

  // ==========================================
  // SINCRONIZAÇÃO EM BACKGROUND
  // ==========================================

  useEffect(() => {
    if (!enableBackgroundSync) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📱 App voltou ao foco, sincronizando...');
        performSync(true);
      }
    };

    const handleFocus = () => {
      console.log('🎯 Window ganhou foco, sincronizando...');
      performSync(true);
    };

    const handleOnline = () => {
      console.log('🌐 Conectou à internet, sincronizando...');
      performSync(true);
    };

    // Adicionar listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [enableBackgroundSync, performSync]);

  // ==========================================
  // LISTENER PARA MUDANÇAS NO STORAGE
  // ==========================================

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chronus_access_token') {
        if (e.newValue) {
          console.log('🔑 Token atualizado, sincronizando...');
          performSync(true);
        } else {
          console.log('🚫 Token removido, parando sincronização');
          if (syncIntervalRef.current) {
            clearInterval(syncIntervalRef.current);
            syncIntervalRef.current = null;
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [performSync]);

  // ==========================================
  // RETORNO DO HOOK
  // ==========================================

  return {
    syncNow,
    lastSync: lastSyncRef.current,
    isAutoSyncEnabled: enableAutoSync,
  };
}

// ==========================================
// HOOK ESPECÍFICO PARA TAREFAS
// ==========================================

export function useTaskSync(onTasksUpdated?: (tasks: any[]) => void) {
  return useDataSync({
    enableAutoSync: true,
    syncInterval: 30000, // 30 segundos
    enableBackgroundSync: true,
    onSyncSuccess: (data) => {
      if (data.tasks && onTasksUpdated) {
        onTasksUpdated(data.tasks);
      }
    },
    onSyncError: (error) => {
      console.error('❌ Erro na sincronização de tarefas:', error);
    }
  });
}

// ==========================================
// UTILITÁRIOS
// ==========================================

export const syncUtils = {
  /**
   * Força sincronização global
   */
  forceGlobalSync: () => {
    window.dispatchEvent(new CustomEvent('force-data-sync'));
  },

  /**
   * Verifica se pode sincronizar
   */
  canSync: () => {
    return (
      navigator.onLine &&
      AuthService.isAuthenticated() &&
      !AuthService.isTokenExpired()
    );
  },

  /**
   * Obtém informações de sincronização
   */
  getSyncInfo: () => {
    return {
      isOnline: navigator.onLine,
      isAuthenticated: AuthService.isAuthenticated(),
      isTokenExpired: AuthService.isTokenExpired(),
      canSync: syncUtils.canSync(),
    };
  }
}; 