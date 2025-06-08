require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const fetch = require('node-fetch');
const tokenStore = require('./tokenStore');
const { deployToGuild } = require('./deploy-commands');

const token = process.env.BOT_TOKEN;
const apiBase = process.env.CHRONUS_API_BASE || 'http://localhost:5000';

if (!token) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds]
});

client.on('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
  console.log(`📊 Conectado em ${client.guilds.cache.size} servidor(es)`);
  
  // Listar servidores conectados
  client.guilds.cache.forEach(guild => {
    console.log(`🏠 Servidor: ${guild.name} (ID: ${guild.id})`);
  });
});

// Evento quando o bot entra em um novo servidor
client.on('guildCreate', async guild => {
  console.log(`🎉 Entrei no novo servidor: ${guild.name} (ID: ${guild.id})`);
  console.log(`👥 Membros: ${guild.memberCount}`);
  
  // Registrar comandos automaticamente no novo servidor
  try {
    await deployToGuild(guild.id);
    console.log(`✅ Comandos registrados automaticamente no servidor ${guild.name}`);
  } catch (error) {
    console.error(`❌ Erro ao registrar comandos no servidor ${guild.name}:`, error);
  }
});

// Evento quando o bot sai de um servidor
client.on('guildDelete', guild => {
  console.log(`👋 Saí do servidor: ${guild.name} (ID: ${guild.id})`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'ping') {
      await interaction.reply('🏓 Pong!');
      return;
    }

    if (commandName === 'login') {
      const email = interaction.options.getString('email');
      const senha = interaction.options.getString('senha');

      await interaction.deferReply({ ephemeral: true });

      try {
        const res = await fetch(`${apiBase}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: senha })
        });

        if (!res.ok) {
          await interaction.editReply('❌ Falha ao autenticar. Verifique suas credenciais.');
          return;
        }

        const data = await res.json();
        tokenStore.setToken(interaction.user.id, data.accessToken);
        await interaction.editReply('✅ Autenticado com sucesso!');
      } catch (err) {
        console.error('Login error:', err);
        await interaction.editReply('❌ Erro ao autenticar. Tente novamente.');
      }
      return;
    }

    if (commandName === 'tasks') {
      const userToken = tokenStore.getToken(interaction.user.id);
      if (!userToken) {
        await interaction.reply({
          content: '🔐 Faça login primeiro com `/login`',
          ephemeral: true
        });
        return;
      }

      await interaction.deferReply();

      try {
        const response = await fetch(`${apiBase}/api/task`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });

        if (!response.ok) {
          await interaction.editReply('❌ Erro ao buscar tarefas.');
          return;
        }

        const data = await response.json();
        
        if (!data.tasks || data.tasks.length === 0) {
          await interaction.editReply('📝 Nenhuma tarefa encontrada.');
          return;
        }

        const taskList = data.tasks.map((task, index) => {
          const status = task.completedAt ? '✅' : '⏳';
          const dueDate = task.dueDate ? ` (📅 ${new Date(task.dueDate).toLocaleDateString('pt-BR')})` : '';
          return `${status} **${task.title}**${dueDate}`;
        }).join('\n');

        await interaction.editReply(`📋 **Suas Tarefas:**\n\n${taskList}`);
      } catch (err) {
        console.error('Tasks error:', err);
        await interaction.editReply('❌ Erro ao buscar tarefas.');
      }
      return;
    }

    if (commandName === 'createtask') {
      const userToken = tokenStore.getToken(interaction.user.id);
      if (!userToken) {
        await interaction.reply({
          content: '🔐 Faça login primeiro com `/login`',
          ephemeral: true
        });
        return;
      }

      const titulo = interaction.options.getString('titulo');
      const descricao = interaction.options.getString('descricao') || '';
      const dataVencimento = interaction.options.getString('data_vencimento');

      await interaction.deferReply();

      let dueDate = null;
      if (dataVencimento) {
        const parsedDate = new Date(dataVencimento);
        if (!isNaN(parsedDate)) {
          dueDate = parsedDate.toISOString();
        } else {
          await interaction.editReply('❌ Formato de data inválido. Use YYYY-MM-DD (ex: 2024-12-31)');
          return;
        }
      }

      try {
        const response = await fetch(`${apiBase}/api/task`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            title: titulo, 
            description: descricao, 
            dueDate: dueDate 
          })
        });

        if (!response.ok) {
          await interaction.editReply('❌ Erro ao criar tarefa.');
          return;
        }

        const data = await response.json();
        const dueDateText = dueDate ? `\n📅 **Vencimento:** ${new Date(dueDate).toLocaleDateString('pt-BR')}` : '';
        
        await interaction.editReply(
          `✅ **Tarefa criada com sucesso!**\n\n` +
          `📝 **Título:** ${data.title}\n` +
          `📄 **Descrição:** ${descricao || 'Sem descrição'}${dueDateText}`
        );
      } catch (err) {
        console.error('Create task error:', err);
        await interaction.editReply('❌ Erro ao criar tarefa.');
      }
      return;
    }

  } catch (error) {
    console.error('Interaction error:', error);
    const errorMessage = '❌ Ocorreu um erro ao processar o comando.';
    
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

client.login(token);
