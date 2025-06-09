/**
 * SCRIPT DE TESTE DE PERSISTÊNCIA - CHRONUS UI
 * 
 * Este script pode ser executado no console do navegador para testar
 * rapidamente a persistência de dados com a API.
 * 
 * COMO USAR:
 * 1. Abra o DevTools (F12)
 * 2. Vá na aba Console
 * 3. Cole este script e pressione Enter
 * 4. Execute: testPersistence()
 */

(function() {
  'use strict';

  // ==========================================
  // UTILITÁRIOS DE TESTE
  // ==========================================

  const log = (message, type = 'info') => {
    const styles = {
      info: 'color: #2563eb; font-weight: bold;',
      success: 'color: #16a34a; font-weight: bold;',
      error: 'color: #dc2626; font-weight: bold;',
      warning: 'color: #ea580c; font-weight: bold;'
    };
    console.log(`%c${message}`, styles[type] || styles.info);
  };

  const API_BASE_URL = 'http://localhost:5150';

  // ==========================================
  // TESTES DE CONECTIVIDADE
  // ==========================================

  async function testConnection() {
    log('🔌 Testando conectividade com a API...', 'info');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/task/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      log(`✅ API respondeu com status: ${response.status}`, 'success');
      
      if (response.status === 401) {
        log('🔑 Resposta 401 - Autenticação necessária (normal)', 'warning');
        return true;
      }
      
      return response.status < 500;
    } catch (error) {
      log(`❌ Erro de conectividade: ${error.message}`, 'error');
      return false;
    }
  }

  // ==========================================
  // TESTES DE AUTENTICAÇÃO
  // ==========================================

  function testAuthState() {
    log('🔐 Verificando estado de autenticação...', 'info');
    
    const token = localStorage.getItem('chronus_access_token');
    const userInfo = localStorage.getItem('chronus_user_info');
    
    log(`🎫 Token presente: ${!!token}`, token ? 'success' : 'warning');
    log(`👤 Informações do usuário: ${!!userInfo}`, userInfo ? 'success' : 'warning');
    
    if (token) {
      try {
        // Decodificar JWT básico
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        log(`⏰ Token expirado: ${isExpired}`, isExpired ? 'error' : 'success');
        log(`📅 Expira em: ${new Date(payload.exp * 1000).toLocaleString()}`, 'info');
        
        return !isExpired;
      } catch (error) {
        log(`❌ Erro ao decodificar token: ${error.message}`, 'error');
        return false;
      }
    }
    
    return false;
  }

  // ==========================================
  // TESTES DE DADOS
  // ==========================================

  async function testDataPersistence() {
    log('💾 Testando persistência de dados...', 'info');
    
    const token = localStorage.getItem('chronus_access_token');
    if (!token) {
      log('❌ Token não encontrado. Faça login primeiro.', 'error');
      return false;
    }
    
    try {
      // Testar listagem de tarefas
      log('📋 Testando listagem de tarefas...', 'info');
      const tasksResponse = await fetch(`${API_BASE_URL}/api/task/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        log(`✅ Tarefas carregadas: ${Array.isArray(tasks) ? tasks.length : 0}`, 'success');
        
        if (Array.isArray(tasks)) {
          const completed = tasks.filter(task => task.completedAt).length;
          const pending = tasks.length - completed;
          log(`📊 Estatísticas: ${pending} pendentes, ${completed} concluídas`, 'info');
        }
        
        return true;
      } else {
        log(`❌ Erro ao carregar tarefas: ${tasksResponse.status} ${tasksResponse.statusText}`, 'error');
        return false;
      }
    } catch (error) {
      log(`❌ Erro na requisição: ${error.message}`, 'error');
      return false;
    }
  }

  // ==========================================
  // TESTE DE CRIAÇÃO DE TAREFA
  // ==========================================

  async function testTaskCreation() {
    log('➕ Testando criação de tarefa...', 'info');
    
    const token = localStorage.getItem('chronus_access_token');
    if (!token) {
      log('❌ Token não encontrado. Faça login primeiro.', 'error');
      return false;
    }
    
    const testTask = {
      title: `Teste de Persistência ${new Date().getTime()}`,
      description: 'Tarefa criada automaticamente para testar persistência',
      dueDate: new Date(Date.now() + 86400000).toISOString() // +1 dia
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testTask)
      });
      
      if (response.ok) {
        const createdTask = await response.json();
        log(`✅ Tarefa criada com ID: ${createdTask.id}`, 'success');
        log(`📝 Título: "${createdTask.title || testTask.title}"`, 'info');
        return createdTask.id;
      } else {
        const errorText = await response.text();
        log(`❌ Erro ao criar tarefa: ${response.status} - ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      log(`❌ Erro na requisição: ${error.message}`, 'error');
      return false;
    }
  }

  // ==========================================
  // DIAGNÓSTICO COMPLETO
  // ==========================================

  async function diagnosePersistence() {
    log('🔍 Iniciando diagnóstico de persistência...', 'info');
    log('================================================', 'info');
    
    // 1. Verificar conectividade
    const isConnected = await testConnection();
    log(`📊 Conectividade: ${isConnected ? 'OK' : 'FALHA'}`, isConnected ? 'success' : 'error');
    
    // 2. Verificar autenticação
    const isAuthenticated = testAuthState();
    log(`📊 Autenticação: ${isAuthenticated ? 'OK' : 'FALHA'}`, isAuthenticated ? 'success' : 'error');
    
    // 3. Verificar dados (se autenticado)
    if (isAuthenticated) {
      const dataPersistence = await testDataPersistence();
      log(`📊 Persistência de dados: ${dataPersistence ? 'OK' : 'FALHA'}`, dataPersistence ? 'success' : 'error');
    }
    
    // 4. Informações do sistema
    log('📊 Informações do sistema:', 'info');
    log(`   - Online: ${navigator.onLine}`, 'info');
    log(`   - User Agent: ${navigator.userAgent.split(')')[0]})`, 'info');
    log(`   - URL atual: ${window.location.href}`, 'info');
    log(`   - Local Storage disponível: ${!!window.localStorage}`, 'info');
    
    log('================================================', 'info');
    log('🏁 Diagnóstico concluído!', 'success');
  }

  // ==========================================
  // TESTE COMPLETO
  // ==========================================

  async function testPersistence() {
    log('🚀 Iniciando teste completo de persistência...', 'info');
    log('================================================', 'info');
    
    try {
      // 1. Diagnóstico básico
      await diagnosePersistence();
      
      // 2. Teste de criação (se autenticado)
      const token = localStorage.getItem('chronus_access_token');
      if (token) {
        log('⏳ Aguarde... testando criação de tarefa...', 'info');
        const taskId = await testTaskCreation();
        
        if (taskId) {
          log('🎉 Teste de persistência PASSOU!', 'success');
          log('✅ Todos os componentes estão funcionando corretamente.', 'success');
        } else {
          log('⚠️ Teste de criação falhou, mas outros componentes podem estar OK.', 'warning');
        }
      } else {
        log('⚠️ Para teste completo, faça login primeiro.', 'warning');
      }
      
    } catch (error) {
      log(`❌ Erro durante o teste: ${error.message}`, 'error');
    }
    
    log('================================================', 'info');
    log('📋 Comandos disponíveis:', 'info');
    log('   - testPersistence() // Teste completo', 'info');
    log('   - diagnosePersistence() // Apenas diagnóstico', 'info');
    log('   - testConnection() // Apenas conectividade', 'info');
    log('   - testAuthState() // Apenas autenticação', 'info');
    log('   - testDataPersistence() // Apenas dados', 'info');
  }

  // ==========================================
  // EXPOR FUNÇÕES GLOBALMENTE
  // ==========================================

  window.testPersistence = testPersistence;
  window.diagnosePersistence = diagnosePersistence;
  window.testConnection = testConnection;
  window.testAuthState = testAuthState;
  window.testDataPersistence = testDataPersistence;
  window.testTaskCreation = testTaskCreation;

  // ==========================================
  // MENSAGEM DE INICIALIZAÇÃO
  // ==========================================

  log('🔧 Script de teste de persistência carregado!', 'success');
  log('💡 Execute testPersistence() para começar.', 'info');

})(); 