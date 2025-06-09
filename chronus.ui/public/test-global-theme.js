/**
 * TESTE DO SISTEMA GLOBAL DE TEMA
 * Execute no console do navegador em qualquer página
 */

console.log("🧪 TESTE DO SISTEMA GLOBAL DE TEMA");
console.log("==================================");

// 1. Verificar se há configurações salvas
const saved = localStorage.getItem("chronus-theme-config");
console.log("💾 Configuração atual:", saved);

// 2. Verificar variáveis CSS aplicadas
const root = document.documentElement;
const primary = getComputedStyle(root).getPropertyValue('--primary').trim();
const background = getComputedStyle(root).getPropertyValue('--background').trim();
const isDark = root.classList.contains('dark');

console.log("🎨 Estado do tema:");
console.log("  Modo escuro:", isDark);
console.log("  --primary:", primary || "padrão");
console.log("  --background:", background || "padrão");

// 3. Teste de mudança de configuração
console.log("\n🧪 TESTE DE MUDANÇA:");

// Salvar uma nova configuração
const testConfig = { primaryColor: "green", backgroundTone: "warm" };
localStorage.setItem("chronus-theme-config", JSON.stringify(testConfig));
console.log("💾 Salvou nova configuração:", testConfig);

// Simular evento de storage para ativar o listener global
window.dispatchEvent(new StorageEvent('storage', {
  key: 'chronus-theme-config',
  newValue: JSON.stringify(testConfig)
}));

console.log("📡 Evento de storage disparado");

// Aguardar um pouco e verificar se mudou
setTimeout(() => {
  const newPrimary = getComputedStyle(root).getPropertyValue('--primary').trim();
  const newBackground = getComputedStyle(root).getPropertyValue('--background').trim();
  
  console.log("\n🔄 RESULTADO APÓS MUDANÇA:");
  console.log("  Nova --primary:", newPrimary);
  console.log("  Nova --background:", newBackground);
  
  // Verificar se mudou para verde
  if (newPrimary.includes('142.1')) {
    console.log("✅ Cor primária mudou para verde!");
  } else {
    console.log("❌ Cor primária não mudou");
  }
  
  console.log("\n📋 INSTRUÇÕES:");
  console.log("1. Verifique se os logs [THEME-GLOBAL] aparecem no console");
  console.log("2. Vá para /dashboard/settings e mude as cores");
  console.log("3. Volte para qualquer outra página");
  console.log("4. As cores devem permanecer");
  
}, 1000);

console.log("\n🔧 Para restaurar configuração anterior:");
if (saved) {
  console.log(`localStorage.setItem('chronus-theme-config', '${saved}');`);
  console.log("location.reload();");
} else {
  console.log("localStorage.removeItem('chronus-theme-config');");
  console.log("location.reload();");
} 