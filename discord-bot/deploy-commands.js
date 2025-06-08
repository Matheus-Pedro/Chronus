require('dotenv').config();

const { REST, Routes } = require('discord.js');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // Opcional para desenvolvimento

const commands = [
  {
    name: 'ping',
    description: 'Responde com pong!',
  },
  {
    name: 'login',
    description: 'Autentica com o sistema Chronus',
    options: [
      {
        name: 'email',
        description: 'Seu email no sistema',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'senha',
        description: 'Sua senha no sistema',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'tasks',
    description: 'Lista suas tarefas',
  },
  {
    name: 'createtask',
    description: 'Cria uma nova tarefa',
    options: [
      {
        name: 'titulo',
        description: 'Título da tarefa',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'descricao',
        description: 'Descrição da tarefa (opcional)',
        type: 3, // STRING
        required: false,
      },
      {
        name: 'data_vencimento',
        description: 'Data de vencimento (YYYY-MM-DD)',
        type: 3, // STRING
        required: false,
      },
    ],
  },
];

const rest = new REST().setToken(token);

// Função para registrar comandos em um servidor específico
async function deployToGuild(guildId) {
  try {
    console.log(`🗑️ Limpando comandos antigos do servidor ${guildId}...`);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    
    console.log(`🔄 Registrando ${commands.length} comandos no servidor ${guildId}...`);
    
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    
    console.log(`✅ ${data.length} comandos registrados no servidor ${guildId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao registrar comandos no servidor ${guildId}:`, error);
    return false;
  }
}

// Função para registrar comandos globalmente
async function deployGlobally() {
  try {
    console.log('🗑️ Limpando comandos globais antigos...');
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    
    console.log(`🌍 Registrando ${commands.length} comandos globalmente...`);
    console.log('⚠️  Comandos globais podem demorar até 1 hora para aparecer!');
    
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    
    console.log(`✅ ${data.length} comandos globais registrados`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao registrar comandos globais:', error);
    return false;
  }
}

// Execução principal
(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || 'auto';
  
  if (mode === 'global') {
    // Forçar comandos globais
    await deployGlobally();
  } else if (mode === 'guild' && args[1]) {
    // Registrar em servidor específico
    await deployToGuild(args[1]);
  } else if (guildId && mode === 'auto') {
    // Modo automático: usar GUILD_ID se disponível
    console.log('🎯 Modo desenvolvimento: registrando no servidor específico');
    await deployToGuild(guildId);
  } else {
    // Sem GUILD_ID: usar comandos globais
    console.log('🌍 Sem GUILD_ID definido: registrando comandos globalmente');
    await deployGlobally();
  }
})();

module.exports = { deployToGuild, deployGlobally, commands }; 