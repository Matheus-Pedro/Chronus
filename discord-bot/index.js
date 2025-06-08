const { Client, IntentsBitField } = require('discord.js');
const fetch = require('node-fetch');
const tokenStore = require('./tokenStore');

const token = process.env.BOT_TOKEN;
const apiBase = process.env.CHRONUS_API_BASE || 'http://localhost:5000';

if (!token) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const content = message.content.trim();

  if (content === '!ping') {
    message.channel.send('pong');
    return;
  }

  if (content.startsWith('!login')) {
    const parts = content.split(/\s+/);
    if (parts.length < 3) {
      message.reply('Uso: !login <email> <senha>');
      return;
    }
    const email = parts[1];
    const password = parts[2];
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        message.reply('Falha ao autenticar.');
        return;
      }
      const data = await res.json();
      tokenStore.setToken(message.author.id, data.accessToken);
      message.reply('Autenticado com sucesso!');
    } catch (err) {
      console.error(err);
      message.reply('Erro ao autenticar.');
    }
    return;
  }

  if (content === '!tasks') {
    const userToken = tokenStore.getToken(message.author.id);
    if (!userToken) {
      message.reply('Faça login primeiro com !login');
      return;
    }
    try {
      const response = await fetch(`${apiBase}/api/task`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!response.ok) {
        message.reply('Erro ao buscar tasks.');
        return;
      }
      const data = await response.json();
      if (!data.tasks || data.tasks.length === 0) {
        message.reply('Nenhuma task encontrada.');
        return;
      }
      const list = data.tasks.map(t => `- ${t.title}`).join('\n');
      message.reply(`Tasks:\n${list}`);
    } catch (err) {
      console.error(err);
      message.reply('Erro ao buscar tasks.');
    }
    return;
  }

  if (content.startsWith('!createtask')) {
    const userToken = tokenStore.getToken(message.author.id);
    if (!userToken) {
      message.reply('Faça login primeiro com !login');
      return;
    }
    const cmd = content.substring('!createtask'.length).trim();
    const [title, description = '', dueDate = new Date().toISOString()] = cmd.split(';').map(p => p.trim()).filter(Boolean);
    if (!title) {
      message.reply('Uso: !createtask <titulo>; [descricao]; [dueDate YYYY-MM-DD]');
      return;
    }
    let due = dueDate;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d)) due = d.toISOString();
    }
    try {
      const response = await fetch(`${apiBase}/api/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, dueDate: due })
      });
      if (!response.ok) {
        message.reply('Erro ao criar task.');
        return;
      }
      const data = await response.json();
      message.reply(`Task criada: ${data.title}`);
    } catch (err) {
      console.error(err);
      message.reply('Erro ao criar task.');
    }
    return;
  }
});

client.login(token);
