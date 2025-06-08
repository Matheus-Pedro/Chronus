# Chronus Discord Bot

Este bot do Discord permite interagir com a API do Chronus para gerenciar suas tarefas usando **Slash Commands**.

## Pré-requisitos
- Node.js 20+
- Um token de bot do Discord
- Credenciais válidas de um usuário da API do Chronus

## Instalação
```bash
npm install
```

## Configuração

### 1. Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no arquivo `.env`:

```env
BOT_TOKEN=seu_token_do_bot_aqui
CLIENT_ID=id_da_aplicacao_discord
GUILD_ID=id_do_servidor_opcional
CHRONUS_API_BASE=http://localhost:5000
```

**Como obter os IDs:**
- `CLIENT_ID`: No Discord Developer Portal > sua aplicação > "Application ID"
- `GUILD_ID`: Clique com botão direito no servidor Discord > "Copiar ID do servidor"
  - (Deixe vazio para comandos globais, mas demora ~1h para aparecer)

### 2. Registrar Slash Commands

#### Opção A: Automático (Recomendado)
```bash
# Registra automaticamente baseado na configuração
npm run deploy
```

#### Opção B: Comandos Globais (Funciona em todos os servidores)
```bash
# Comandos aparecem em todos os servidores (demora ~1h)
npm run deploy:global
```

#### Opção C: Servidor Específico
```bash
# Para um servidor específico (instantâneo)
npm run deploy:guild 123456789012345678
```

### 3. Executar o Bot
```bash
npm start
```

## 🚀 Integração Automática de Novos Servidores

### Funcionamento Automático:
- ✅ **Detecta automaticamente** quando entra em novos servidores
- ✅ **Registra comandos** instantaneamente no novo servidor
- ✅ **Log detalhado** de todos os eventos
- ✅ **Sem configuração manual** necessária

### Logs do Bot:
```
✅ Bot logado como Chronus#3899
📊 Conectado em 2 servidor(es)
🏠 Servidor: Meu Servidor (ID: 123456789)
🏠 Servidor: Outro Servidor (ID: 987654321)
🎉 Entrei no novo servidor: Novo Servidor (ID: 555666777)
🔄 Registrando 4 comandos no servidor 555666777...
✅ 4 comandos registrados no servidor 555666777
✅ Comandos registrados automaticamente no servidor Novo Servidor
```

### Como Adicionar o Bot a Novos Servidores:
1. **Use este link** (substitua CLIENT_ID):
   ```
   https://discord.com/oauth2/authorize?client_id=SEU_CLIENT_ID&permissions=2147484672&scope=bot%20applications.commands
   ```
2. **Selecione o servidor** onde quer adicionar
3. **Comandos serão registrados** automaticamente!

## Modos de Deploy

### Desenvolvimento (com GUILD_ID):
- Comandos aparecem **instantaneamente**
- Funciona apenas no **servidor configurado**
- Ideal para **testar funcionalidades**

### Produção (comandos globais):
- Comandos em **todos os servidores**
- Demora **até 1 hora** para aparecer
- **Remove GUILD_ID** do .env e use `npm run deploy:global`

## Comandos Disponíveis

### `/ping`
Verifica se o bot está online
- **Resposta:** 🏓 Pong!

### `/login <email> <senha>`
Autentica com o sistema Chronus
- **Parâmetros:**
  - `email`: Seu email no sistema
  - `senha`: Sua senha no sistema
- **Privacidade:** Resposta visível apenas para você

### `/tasks`
Lista suas tarefas
- **Mostra:** Status (✅/⏳), título e data de vencimento

### `/createtask <titulo> [descricao] [data_vencimento]`
Cria uma nova tarefa
- **Parâmetros:**
  - `titulo`: Título da tarefa (obrigatório)
  - `descricao`: Descrição da tarefa (opcional)
  - `data_vencimento`: Data no formato YYYY-MM-DD (opcional)

## Características dos Slash Commands

- ✅ **Interface intuitiva** com autocompletar
- ✅ **Validação automática** de parâmetros
- ✅ **Comandos privados** (login é ephemeral)
- ✅ **Formatação rica** com emojis e markdown
- ✅ **Tratamento de erros** melhorado
