# Chronus Discord Bot

Este bot do Discord permite interagir com a API do Chronus para gerenciar suas tarefas.

## Pré-requisitos
- Node.js 20+
- Um token de bot do Discord
- Credenciais válidas de um usuário da API do Chronus

## Instalação
```bash
npm install
```

## Uso
Configure as seguintes variáveis de ambiente:
- `BOT_TOKEN`: Token do seu bot no Discord
- `CHRONUS_API_BASE`: URL base da API (opcional, padrão `http://localhost:5000`)

Execute o bot com:
```bash
node index.js
```

## Comandos
- `!ping` – verifica se o bot está online
- `!login <email> <senha>` – associa o usuário do Discord a um usuário do sistema
- `!tasks` – lista as tarefas do usuário autenticado
- `!createtask <titulo>; [descricao]; [dueDate]` – cria uma nova task (data no formato `YYYY-MM-DD`)
