/**
 * SCRIPT DE TESTE DE PERSISTÊNCIA DE TEMA - CHRONUS UI
 * 
 * Este script pode ser executado no console do navegador para testar
 * a persistência das configurações de customização de cores.
 * 
 * COMO USAR:
 * 1. Abra o DevTools (F12)
 * 2. Vá na aba Console
 * 3. Cole este script e pressione Enter
 * 4. Execute: testThemePersistence()
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

  // ==========================================
  // TESTE DE CONFIGURAÇÕES SALVAS
  // ==========================================

  function testSavedConfig() {
    log('🔍 Verificando configurações salvas...', 'info');
    
    const savedConfig = localStorage.getItem('chronus-theme-config');
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        log(`✅ Configuração encontrada:`, 'success');
        log(`   - Cor principal: ${config.primaryColor}`, 'info');
        log(`   - Tom de fundo: ${config.backgroundTone}`, 'info');
        return config;
      } catch (error) {
        log(`❌ Erro ao decodificar configuração: ${error.message}`, 'error');
        return null;
      }
    } else {
      log('ℹ️ Nenhuma configuração personalizada encontrada (usando padrão)', 'warning');
      return null;
    }
  }

  // ==========================================
  // TESTE DE VARIÁVEIS CSS
  // ==========================================

  function testCSSVariables() {
    log('🎨 Verificando variáveis CSS aplicadas...', 'info');
    
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    const cssVars = {
      primary: getComputedStyle(root).getPropertyValue('--primary').trim(),
      background: getComputedStyle(root).getPropertyValue('--background').trim(),
      card: getComputedStyle(root).getPropertyValue('--card').trim(),
      popover: getComputedStyle(root).getPropertyValue('--popover').trim()
    };
    
    log(`🌓 Modo escuro: ${isDark}`, 'info');
    log(`🎨 Variáveis CSS:`, 'info');
    log(`   - --primary: ${cssVars.primary || 'padrão'}`, 'info');
    log(`   - --background: ${cssVars.background || 'padrão'}`, 'info');
    log(`   - --card: ${cssVars.card || 'padrão'}`, 'info');
    log(`   - --popover: ${cssVars.popover || 'padrão'}`, 'info');
    
    return cssVars;
  }

  // ==========================================
  // TESTE DE PERSISTÊNCIA COMPLETO
  // ==========================================

  function testPersistence() {
    log('🧪 Testando mudança e persistência...', 'info');
    
    const originalConfig = testSavedConfig();
    
    // Configuração de teste
    const testConfig = {
      primaryColor: 'red',
      backgroundTone: 'colored'
    };
    
    log('⏳ Aplicando configuração de teste...', 'info');
    
    // Salvar configuração de teste
    localStorage.setItem('chronus-theme-config', JSON.stringify(testConfig));
    
    // Simular evento de mudança
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'chronus-theme-config',
      newValue: JSON.stringify(testConfig)
    }));
    
    // Aguardar um pouco para aplicação
    setTimeout(() => {
      log('🔄 Verificando se a configuração foi aplicada...', 'info');
      
      const currentConfig = testSavedConfig();
      const cssVars = testCSSVariables();
      
      if (currentConfig && 
          currentConfig.primaryColor === 'red' && 
          currentConfig.backgroundTone === 'colored') {
        log('✅ Configuração de teste aplicada com sucesso!', 'success');
        
        // Verificar se CSS mudou (cor vermelha)
        if (cssVars.primary.includes('0 84.2% 60.2%') || cssVars.primary.includes('0') ) {
          log('✅ Variáveis CSS foram atualizadas!', 'success');
        } else {
          log('⚠️ Variáveis CSS podem não ter sido atualizadas', 'warning');
        }
        
        // Restaurar configuração original
        setTimeout(() => {
          if (originalConfig) {
            localStorage.setItem('chronus-theme-config', JSON.stringify(originalConfig));
            log('🔄 Configuração original restaurada', 'info');
          } else {
            localStorage.removeItem('chronus-theme-config');
            log('🔄 Configurações resetadas para padrão', 'info');
          }
          
          // Recarregar para aplicar
          log('🔄 Recarregue a página para ver a restauração (F5)', 'info');
        }, 2000);
        
      } else {
        log('❌ Configuração de teste não foi aplicada corretamente', 'error');
      }
    }, 500);
  }

  // ==========================================
  // TESTE DE SINCRONIZAÇÃO ENTRE ABAS
  // ==========================================

  function testCrossTabSync() {
    log('🪟 Testando sincronização entre abas...', 'info');
    log('📋 Para testar:', 'info');
    log('   1. Abra uma nova aba neste mesmo site', 'info');
    log('   2. Mude as cores em uma aba', 'info');
    log('   3. Observe se a outra aba muda automaticamente', 'info');
    
    // Listener para testar
    window.addEventListener('storage', (e) => {
      if (e.key === 'chronus-theme-config') {
        log('🔄 Detectada mudança de tema em outra aba!', 'success');
        log(`   Nova configuração: ${e.newValue}`, 'info');
      }
    });
    
    log('👂 Listener ativo - faça mudanças em outra aba para testar', 'success');
  }

  // ==========================================
  // DIAGNÓSTICO COMPLETO
  // ==========================================

  function diagnosePersistence() {
    log('🔍 Diagnóstico completo do sistema de persistência...', 'info');
    log('=================================================', 'info');
    
    // 1. Verificar ambiente
    log('🌐 Informações do ambiente:', 'info');
    log(`   - URL: ${window.location.href}`, 'info');
    log(`   - localStorage disponível: ${!!window.localStorage}`, 'info');
    log(`   - sessionStorage disponível: ${!!window.sessionStorage}`, 'info');
    
    // 2. Verificar configurações atuais
    const config = testSavedConfig();
    const cssVars = testCSSVariables();
    
    // 3. Verificar se há outros dados do Chronus
    log('📦 Outros dados do Chronus no localStorage:', 'info');
    const chronusKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('chronus')) {
        chronusKeys.push(key);
      }
    }
    
    if (chronusKeys.length > 0) {
      chronusKeys.forEach(key => {
        log(`   - ${key}`, 'info');
      });
    } else {
      log('   - Nenhum dado do Chronus encontrado', 'warning');
    }
    
    // 4. Verificar se sistema de tema está ativo
    const themeCustomizer = document.querySelector('[data-theme-customizer]');
    log(`🎨 Interface de customização presente: ${!!themeCustomizer}`, themeCustomizer ? 'success' : 'warning');
    
    log('=================================================', 'info');
    log('✅ Diagnóstico concluído!', 'success');
  }

  // ==========================================
  // TESTE PRINCIPAL
  // ==========================================

  function testThemePersistence() {
    log('🚀 Iniciando teste completo de persistência de tema...', 'info');
    log('====================================================', 'info');
    
    try {
      // 1. Diagnóstico básico
      diagnosePersistence();
      
      // 2. Teste de configurações
      log('⏳ Executando teste de persistência em 3 segundos...', 'info');
      setTimeout(() => {
        testPersistence();
      }, 3000);
      
      // 3. Configurar teste de sincronização
      testCrossTabSync();
      
    } catch (error) {
      log(`❌ Erro durante o teste: ${error.message}`, 'error');
    }
    
    log('====================================================', 'info');
    log('📋 Comandos disponíveis:', 'info');
    log('   - testThemePersistence() // Teste completo', 'info');
    log('   - diagnosePersistence() // Apenas diagnóstico', 'info');
    log('   - testSavedConfig() // Verificar configurações salvas', 'info');
    log('   - testCSSVariables() // Verificar CSS aplicado', 'info');
    log('   - testCrossTabSync() // Testar sincronização entre abas', 'info');
  }

  // ==========================================
  // UTILITÁRIOS EXTRAS
  // ==========================================

  function resetThemeConfig() {
    localStorage.removeItem('chronus-theme-config');
    log('🔄 Configurações de tema resetadas. Recarregue a página (F5).', 'success');
  }

  function showCurrentTheme() {
    const config = testSavedConfig();
    const cssVars = testCSSVariables();
    
    log('📊 Estado atual do tema:', 'info');
    log('========================', 'info');
    
    if (config) {
      log(`🎨 Cor principal: ${config.primaryColor}`, 'info');
      log(`🌃 Tom de fundo: ${config.backgroundTone}`, 'info');
    } else {
      log('🎨 Usando configuração padrão (azul + neutro)', 'info');
    }
    
    log('========================', 'info');
  }

  // ==========================================
  // EXPOR FUNÇÕES GLOBALMENTE
  // ==========================================

  window.testThemePersistence = testThemePersistence;
  window.diagnosePersistence = diagnosePersistence;
  window.testSavedConfig = testSavedConfig;
  window.testCSSVariables = testCSSVariables;
  window.testCrossTabSync = testCrossTabSync;
  window.resetThemeConfig = resetThemeConfig;
  window.showCurrentTheme = showCurrentTheme;

  // Mostrar comandos disponíveis
  log('🎨 Script de teste de persistência de tema carregado!', 'success');
  log('Execute testThemePersistence() para começar.', 'info');

})(); 