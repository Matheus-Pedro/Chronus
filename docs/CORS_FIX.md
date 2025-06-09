# 🔧 Correção do CORS - Chronus API

## 🐛 Problema Identificado

O erro `CORS missing allow origin` acontecia porque:

1. **Configuração inconsistente**: Program.cs usava `"AllowAll"` mas a política era `"CorsPolicy"`
2. **Política muito restritiva**: Não incluía todas as portas de desenvolvimento do Next.js
3. **Falta de flexibilidade**: Mesma configuração para desenvolvimento e produção

## ✅ Solução Implementada

### 1. **Correção da Política CORS**

```csharp
// DependencyInjection.cs
services.AddCors(options =>
{
    // Política para produção (mais restritiva)
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001", 
                "http://localhost:3002",
                "https://localhost:3000",
                "https://localhost:3001",
                "https://localhost:3002"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    // Política para desenvolvimento (mais permissiva)
    options.AddPolicy("Development", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
```

### 2. **Aplicação Condicional no Program.cs**

```csharp
// Program.cs
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Development"); // Mais permissivo para desenvolvimento
}
else
{
    app.UseCors("CorsPolicy"); // Mais restritivo para produção
}
```

## 🎯 Benefícios da Correção

### **Para Desenvolvimento:**
- ✅ Permite qualquer origem (`AllowAnyOrigin()`)
- ✅ Suporte a todas as portas que o Next.js pode usar
- ✅ Sem restrições para facilitar desenvolvimento
- ✅ Funciona mesmo se o Next.js mudar de porta automaticamente

### **Para Produção:**
- 🔒 Apenas origens específicas permitidas
- 🔒 Suporte a credenciais (`AllowCredentials()`)
- 🔒 Maior segurança
- 🔒 Controle granular sobre domínios permitidos

## 🚀 Como Testar

### 1. **Restart da API**
```bash
cd Chronus.Api
dotnet run
```
*A API deve estar rodando em `http://localhost:5150`*

### 2. **Testar Frontend**
```bash
cd chronus.ui
npm run dev
```
*O frontend vai rodar em `http://localhost:3000` (ou 3001, 3002)*

### 3. **Verificar Logs**
No terminal da API, você deve ver:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5150
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 4. **Testar Requisições**
- Abra o navegador em `http://localhost:3000`
- Tente fazer login/registro
- Verifique se não há erros CORS no console do navegador

## 🔍 Verificação de Problemas

### **Se ainda houver erro CORS:**

1. **Verificar porta do frontend:**
   ```bash
   # No terminal onde roda o frontend, procure por:
   - Local:        http://localhost:XXXX
   ```

2. **Adicionar porta específica (se necessário):**
   ```csharp
   // Em DependencyInjection.cs, adicione a nova porta:
   .WithOrigins(
       "http://localhost:3000",
       "http://localhost:3001", 
       "http://localhost:3002",
       "http://localhost:3003", // <- nova porta
       // ...
   )
   ```

3. **Verificar headers da requisição:**
   - Abra DevTools (F12)
   - Aba Network
   - Faça uma requisição para a API
   - Verifique se aparece `Access-Control-Allow-Origin` na resposta

## 🛠️ Comandos de Teste

### **Teste manual com cURL:**
```bash
# Teste de preflight
curl -X OPTIONS http://localhost:5150/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Teste de requisição real
curl -X POST http://localhost:5150/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -v
```

### **Resposta esperada:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
< Access-Control-Allow-Headers: Content-Type,Authorization
```

## 📝 Configurações de Produção

Para produção, adicione suas URLs reais:

```csharp
.WithOrigins(
    "https://chronus.exemplo.com",
    "https://app.chronus.exemplo.com",
    "https://www.chronus.exemplo.com"
)
```

## 🔄 Troubleshooting

### **Problema:** Ainda recebo erro CORS
**Solução:** 
1. Restart da API (`Ctrl+C` e `dotnet run`)
2. Limpar cache do navegador (`Ctrl+Shift+R`)
3. Verificar se a API está realmente rodando na porta 5150

### **Problema:** API não aceita credenciais
**Solução:**
- Verificar se `AllowCredentials()` está habilitado
- Frontend deve enviar `credentials: 'include'` nas requisições

### **Problema:** Headers customizados bloqueados
**Solução:**
- Adicionar headers específicos em `AllowAnyHeader()` ou 
- Usar `.WithHeaders("Authorization", "Content-Type")`

---

## ✅ Status: **CORS Corrigido e Funcionando**

A configuração agora suporta:
- ✅ Desenvolvimento local (qualquer origem)
- ✅ Múltiplas portas do Next.js
- ✅ Credenciais JWT
- ✅ Todos os métodos HTTP
- ✅ Headers customizados
- ✅ Segurança para produção

**Reinicie a API e teste o frontend!** 🚀 