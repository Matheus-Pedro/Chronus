/**
 * SCRIPT SIMPLES PARA TESTAR PERSISTÊNCIA
 * Cole no console do navegador para verificar o localStorage
 */

console.log("🧪 TESTE DE PERSISTÊNCIA DE TEMA");
console.log("================================");

// 1. Verificar se há configurações salvas
const saved = localStorage.getItem("chronus-theme-config");
console.log("💾 Configuração salva:", saved);

if (saved) {
  try {
    const parsed = JSON.parse(saved);
    console.log("✅ Configuração parseada:", parsed);
  } catch (error) {
    console.log("❌ Erro ao fazer parse:", error);
  }
} else {
  console.log("ℹ️ Nenhuma configuração encontrada");
}

// 2. Verificar variáveis CSS aplicadas
const root = document.documentElement;
const primary = getComputedStyle(root).getPropertyValue('--primary');
const background = getComputedStyle(root).getPropertyValue('--background');

console.log("🎨 Variáveis CSS:");
console.log("  --primary:", primary || "padrão");
console.log("  --background:", background || "padrão");

// 3. Teste rápido de salvar/carregar
console.log("\n🧪 TESTE DE SALVAR/CARREGAR:");

// Salvar configuração de teste
const testConfig = { primaryColor: "red", backgroundTone: "colored" };
localStorage.setItem("chronus-theme-config", JSON.stringify(testConfig));
console.log("💾 Salvou configuração de teste:", testConfig);

// Verificar se foi salvo
const verification = localStorage.getItem("chronus-theme-config");
console.log("🔍 Verificação:", verification);

console.log("\n📋 INSTRUÇÕES:");
console.log("1. Recarregue a página (F5)");
console.log("2. Execute este script novamente");
console.log("3. A configuração deve ser mantida");

console.log("\n🔧 Para limpar os dados:");
console.log("localStorage.removeItem('chronus-theme-config');"); 