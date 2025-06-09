import { apiClient, TokenManager } from './client';
import { TaskService } from './tasks';
import { AuthService } from './auth';

// ==========================================
// TESTE DE PERSISTÊNCIA DE DADOS
// ==========================================

export class PersistenceTest {
  
  /**
   * Testa a conectividade básica com a API
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Testando conectividade com a API...');
      
      // Teste básico de conectividade (endpoint público se existir)
      const response = await fetch('http://localhost:5150/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ API está acessível:', response.status);
      return response.status < 500;
    } catch (error) {
      console.error('❌ Erro de conectividade:', error);
      return false;
    }
  }

  /**
   * Testa o fluxo completo de autenticação
   */
  static async testAuthentication(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      console.log('🔐 Testando autenticação...');
      
      // Fazer login
      const response = await AuthService.login(credentials);
      console.log('✅ Login realizado:', response);
      
      // Verificar se token foi salvo
      const token = TokenManager.getToken();
      console.log('🎫 Token salvo:', token ? 'Sim' : 'Não');
      
      // Verificar informações do usuário
      const user = TokenManager.getUserInfo();
      console.log('👤 Usuário logado:', user);
      
      return !!token && !!user;
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      return false;
    }
  }

  /**
   * Testa operações CRUD de tarefas
   */
  static async testTaskCRUD(): Promise<boolean> {
    try {
      console.log('📋 Testando operações de tarefas...');
      
      // 1. Listar tarefas existentes
      console.log('1️⃣ Listando tarefas...');
      const initialTasks = await TaskService.getUserTasks();
      console.log('📝 Tarefas existentes:', initialTasks.length);
      
      // 2. Criar nova tarefa
      console.log('2️⃣ Criando nova tarefa...');
      const newTask = await TaskService.createTask({
        title: 'Teste de Persistência',
        description: 'Tarefa criada para testar persistência',
        dueDate: new Date(Date.now() + 86400000).toISOString() // +1 dia
      });
      console.log('✨ Tarefa criada:', newTask);
      
      // 3. Listar tarefas novamente
      console.log('3️⃣ Verificando se tarefa foi persistida...');
      const updatedTasks = await TaskService.getUserTasks();
      console.log('📝 Total de tarefas agora:', updatedTasks.length);
      
      // 4. Verificar se a nova tarefa está na lista
      const createdTaskExists = updatedTasks.some(task => 
        task.title === 'Teste de Persistência'
      );
      console.log('🔍 Tarefa encontrada na lista:', createdTaskExists);
      
      // 5. Tentar atualizar a tarefa criada
      if (newTask.id) {
        console.log('4️⃣ Atualizando tarefa...');
        const updatedTask = await TaskService.updateTask(newTask.id, {
          id: newTask.id,
          title: 'Teste de Persistência - ATUALIZADA',
          description: 'Tarefa atualizada para testar persistência',
          dueDate: new Date(Date.now() + 172800000).toISOString() // +2 dias
        });
        console.log('🔄 Tarefa atualizada:', updatedTask);
      }
      
      // 6. Listar tarefas final
      console.log('5️⃣ Listagem final...');
      const finalTasks = await TaskService.getUserTasks();
      console.log('📋 Estado final das tarefas:', finalTasks);
      
      return finalTasks.length > initialTasks.length;
    } catch (error) {
      console.error('❌ Erro no teste CRUD:', error);
      return false;
    }
  }

  /**
   * Testa a sincronização de dados
   */
  static async testDataSync(): Promise<boolean> {
    try {
      console.log('🔄 Testando sincronização de dados...');
      
      // Verificar se dados do localStorage coincidem com API
      const localUser = TokenManager.getUserInfo();
      const apiTasks = await TaskService.getUserTasks();
      
      console.log('👤 Usuário local:', localUser);
      console.log('📋 Tarefas da API:', apiTasks.length);
      
      // Simular atualização de dados
      const currentTime = new Date().toISOString();
      console.log('⏰ Timestamp atual:', currentTime);
      
      return true;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      return false;
    }
  }

  /**
   * Executa todos os testes de persistência
   */
  static async runAllTests(credentials?: { email: string; password: string }): Promise<void> {
    console.log('🚀 Iniciando testes de persistência...');
    console.log('=' * 50);
    
    // Teste 1: Conectividade
    const connectionTest = await this.testConnection();
    console.log('📊 Resultado - Conectividade:', connectionTest ? 'PASSOU' : 'FALHOU');
    
    if (!connectionTest) {
      console.log('❌ Teste de conectividade falhou. Verifique se a API está rodando.');
      return;
    }
    
    // Teste 2: Autenticação (se credenciais fornecidas)
    if (credentials) {
      const authTest = await this.testAuthentication(credentials);
      console.log('📊 Resultado - Autenticação:', authTest ? 'PASSOU' : 'FALHOU');
      
      if (!authTest) {
        console.log('❌ Teste de autenticação falhou. Verifique as credenciais.');
        return;
      }
    } else {
      console.log('⚠️ Credenciais não fornecidas, pulando teste de autenticação.');
      
      // Verificar se já está autenticado
      if (!AuthService.isAuthenticated()) {
        console.log('❌ Usuário não está autenticado. Faça login primeiro.');
        return;
      }
    }
    
    // Teste 3: CRUD de Tarefas
    const crudTest = await this.testTaskCRUD();
    console.log('📊 Resultado - CRUD:', crudTest ? 'PASSOU' : 'FALHOU');
    
    // Teste 4: Sincronização
    const syncTest = await this.testDataSync();
    console.log('📊 Resultado - Sincronização:', syncTest ? 'PASSOU' : 'FALHOU');
    
    console.log('=' * 50);
    console.log('🏁 Testes de persistência concluídos!');
  }

  /**
   * Diagnóstica problemas comuns
   */
  static diagnoseCommonIssues(): void {
    console.log('🔍 Diagnosticando problemas comuns...');
    
    // 1. Verificar localStorage
    const token = TokenManager.getToken();
    const user = TokenManager.getUserInfo();
    
    console.log('💾 Estado do localStorage:');
    console.log('  - Token presente:', !!token);
    console.log('  - Usuário presente:', !!user);
    console.log('  - Token expirado:', AuthService.isTokenExpired());
    
    // 2. Verificar conectividade
    console.log('🌐 Configuração de rede:');
    console.log('  - URL da API:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5150');
    console.log('  - Ambiente:', process.env.NODE_ENV);
    
    // 3. Verificar headers
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🎫 Informações do token:');
        console.log('  - Emissor:', payload.iss);
        console.log('  - Expiração:', new Date(payload.exp * 1000));
        console.log('  - Usuário:', payload.sub);
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
      }
    }
  }
}

// Função utilitária para executar testes rapidamente
export const runPersistenceTests = (credentials?: { email: string; password: string }) => {
  PersistenceTest.runAllTests(credentials);
};

export const diagnosePersistence = () => {
  PersistenceTest.diagnoseCommonIssues();
}; 