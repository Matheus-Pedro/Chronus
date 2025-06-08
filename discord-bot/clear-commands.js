require('dotenv').config();

const { REST, Routes } = require('discord.js');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST().setToken(token);

async function clearGlobalCommands() {
  try {
    console.log('🗑️ Limpando comandos globais...');
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log('✅ Comandos globais removidos');
  } catch (error) {
    console.error('❌ Erro ao limpar comandos globais:', error);
  }
}

async function clearGuildCommands(guildId) {
  try {
    console.log(`🗑️ Limpando comandos do servidor ${guildId}...`);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    console.log(`✅ Comandos do servidor ${guildId} removidos`);
  } catch (error) {
    console.error(`❌ Erro ao limpar comandos do servidor ${guildId}:`, error);
  }
}

(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || 'all';
  
  if (mode === 'global') {
    await clearGlobalCommands();
  } else if (mode === 'guild' && args[1]) {
    await clearGuildCommands(args[1]);
  } else if (mode === 'guild' && guildId) {
    await clearGuildCommands(guildId);
  } else if (mode === 'all') {
    console.log('🧹 Limpando TODOS os comandos...');
    await clearGlobalCommands();
    if (guildId) {
      await clearGuildCommands(guildId);
    }
    console.log('✅ Limpeza completa realizada!');
  } else {
    console.log('Uso:');
    console.log('  npm run clear           - Limpa todos os comandos');
    console.log('  npm run clear:global    - Limpa apenas globais');
    console.log('  npm run clear:guild     - Limpa apenas do servidor');
  }
})(); 