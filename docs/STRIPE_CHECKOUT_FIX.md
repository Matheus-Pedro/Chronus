# Correção: Erro "You must provide one of price or price_data"

## Problema Identificado

O Stripe estava retornando o erro:
```
You must provide one of `price` or `price_data` for each line item when using prices.
```

## Causa Raiz

1. **Mapeamento incorreto no Frontend**: O frontend estava enviando `planId` como string (`"pro"`), mas o backend esperava `type` como enum numérico (`2`)

2. **Price ID inválido para Free**: O plano Free tinha um Price ID configurado, mas conceitualmente não deveria ter checkout

## Solução Implementada

### 1. Frontend - Mapeamento Correto
**Antes:**
```typescript
const response = await apiClient.post('/api/subscription/checkout', {
  planId: "pro",  // ❌ String incorreta
  userId: user?.id,
  returnUrl: "...",
  cancelUrl: "..."
});
```

**Depois:**
```typescript
// Mapear planId string para SubscriptionType enum
const planTypeMap: { [key: string]: number } = {
  'free': 1,     // SubscriptionType.Free = 1
  'pro': 2,      // SubscriptionType.Pro = 2
  'premium': 3   // SubscriptionType.Premium = 3
};

const response = await apiClient.post('/api/subscription/checkout', {
  type: planTypeMap[planId]  // ✅ Número do enum correto
});
```

### 2. Backend - Validação e Logs
**Adicionado ao StripePaymentService:**
```csharp
// Verificar se é plano Free
if (type == SubscriptionType.Free)
{
    throw new InvalidOperationException("Não é possível criar checkout para plano gratuito");
}

// Validar Price ID
var priceId = _configuration[$"Stripe:Prices:{type}"];
if (string.IsNullOrEmpty(priceId))
{
    throw new InvalidOperationException($"Price ID não configurado para o plano {type}");
}
```

### 3. Configuração Limpa
**appsettings.Development.json:**
```json
{
  "Stripe": {
    "Prices": {
      "Pro": "price_1RXn6P03sSgEL05sht20YWY7",
      "Premium": "price_1RXn7803sSgEL05sV8CtAiJ6"
    }
  }
}
```

Removido `"Free"` pois não deve ter checkout.

## Arquivos Modificados

### Frontend
- ✅ `chronus.ui/app/dashboard/subscription/page.tsx` - Mapeamento correto do planId para enum
- ✅ Interface `CheckoutResponse` simplificada para corresponder à API

### Backend
- ✅ `Chronus.Infrastructure/Payments/StripePaymentService.cs` - Validações e logs
- ✅ `Chronus.Api/appsettings.Development.json` - Configuração limpa

## Fluxo Correto Após Correção

1. **Frontend**: Usuário clica "Assinar Pro"
2. **Mapeamento**: `"pro"` → `2` (SubscriptionType.Pro)
3. **API Call**: `POST /api/subscription/checkout { "type": 2 }`
4. **Backend**: Busca `Stripe:Prices:Pro` → `"price_1RXn6P03sSgEL05sht20YWY7"`
5. **Stripe**: Cria sessão com Price ID válido
6. **Resposta**: `{ "url": "https://checkout.stripe.com/..." }`
7. **Redirecionamento**: Frontend redireciona para Stripe Checkout

## Teste da Correção

### Request Correto
```bash
curl -X POST http://localhost:5150/api/subscription/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "type": 2 }'
```

### Response Esperado
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Logs Esperados
```
🔄 StripePaymentService.CreateCheckoutSession - userId: 2, type: Pro
💰 Price ID encontrado: price_1RXn6P03sSgEL05sht20YWY7 para tipo: Pro
🚀 Criando sessão Stripe com options: Mode=subscription, Price=price_1RXn6P03sSgEL05sht20YWY7, UserId=2
✅ Sessão criada com sucesso: cs_test_..., URL: https://checkout.stripe.com/...
```

## Prevenção

### Checklist para Novos Planos
- [ ] Criar produto no Stripe Dashboard
- [ ] Copiar Price ID corretamente
- [ ] Adicionar ao appsettings.json
- [ ] Testar com request real
- [ ] Verificar logs no Stripe Dashboard

### Enum Mapping
```csharp
public enum SubscriptionType
{
    Free = 1,     // Sem Price ID (não tem checkout)
    Pro = 2,      // price_1RXn6P03sSgEL05sht20YWY7
    Premium = 3   // price_1RXn7803sSgEL05sV8CtAiJ6
}
```

---

**Data da Correção:** Janeiro 2024  
**Status:** ✅ Implementado e Testado 