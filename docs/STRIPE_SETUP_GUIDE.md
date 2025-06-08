# 💰 Guia Completo: Configuração de Preços no Stripe

## 📋 Passo a Passo Completo

### 1. 🏗️ Criar Produtos no Stripe Dashboard

#### Acesse: [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)

#### **Produto 1: Chronus Free**
```
✅ Product Name: Chronus Free
✅ Description: Plano gratuito com recursos básicos
✅ Pricing Model: One-time (ou skip pricing)
✅ Amount: $0.00
```

#### **Produto 2: Chronus Pro**
```
✅ Product Name: Chronus Pro  
✅ Description: Plano profissional com recursos avançados
✅ Pricing Model: Recurring
✅ Amount: $9.99
✅ Interval: Monthly
✅ Currency: USD
```

#### **Produto 3: Chronus Premium**
```
✅ Product Name: Chronus Premium
✅ Description: Plano premium com todos os recursos
✅ Pricing Model: Recurring  
✅ Amount: $19.99
✅ Interval: Monthly
✅ Currency: USD
```

### 2. 🔑 Copiar Price IDs

Após criar cada produto, você verá algo assim:

```
🆔 Price IDs (começam com price_):
- Pro Monthly: price_1234567890abcdef12345678
- Premium Monthly: price_9876543210fedcba87654321
```

### 3. ⚙️ Configurar no appsettings.json

```json
{
  "Stripe": {
    "SecretKey": "sk_test_SEU_SECRET_KEY_AQUI",
    "PublishableKey": "pk_test_SEU_PUBLISHABLE_KEY_AQUI", 
    "SuccessUrl": "http://localhost:5150/pagos/sucesso",
    "CancelUrl": "http://localhost:5150/pagos/cancelado",
    "WebhookSecret": "whsec_SEU_WEBHOOK_SECRET_AQUI",
    "Prices": {
      "Free": null,
      "Pro": "price_1234567890abcdef12345678",
      "Premium": "price_9876543210fedcba87654321"
    }
  }
}
```

### 4. 🔐 Obter Chaves da API

#### No Dashboard do Stripe:
1. **Vá para:** [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. **Copie:**
   - **Secret Key** (sk_test_...) → BackEnd
   - **Publishable Key** (pk_test_...) → FrontEnd

### 5. 🎯 Estrutura de Preços Recomendada

```javascript
// Sugestão de Preços
const pricingPlans = {
  Free: {
    price: "$0",
    features: [
      "✅ 5 tarefas por mês",
      "✅ Relatórios básicos",
      "✅ Suporte por email"
    ]
  },
  Pro: {
    price: "$9.99/mês",
    features: [
      "✅ 100 tarefas por mês", 
      "✅ Relatórios básicos",
      "✅ Análises avançadas",
      "✅ Integrações"
    ]
  },
  Premium: {
    price: "$19.99/mês", 
    features: [
      "✅ Tarefas ilimitadas",
      "✅ Todos os relatórios",
      "✅ Análises avançadas", 
      "✅ Suporte prioritário",
      "✅ API access"
    ]
  }
}
```

### 6. 🎪 Variações de Preço (Opcional)

Você pode criar múltiplos preços por produto:

```
Chronus Pro:
├── Monthly: $9.99/mês (price_xxx1)
├── Yearly: $99.99/ano (price_xxx2) [2 meses grátis]
└── Lifetime: $299.99 (price_xxx3)

Chronus Premium:  
├── Monthly: $19.99/mês (price_yyy1)
├── Yearly: $199.99/ano (price_yyy2) [2 meses grátis]
└── Lifetime: $599.99 (price_yyy3)
```

### 7. 🔄 Configuração Avançada

```json
{
  "Stripe": {
    "Prices": {
      "Free": null,
      "ProMonthly": "price_1234567890abcdef12345678",
      "ProYearly": "price_1234567890abcdef12345679", 
      "PremiumMonthly": "price_9876543210fedcba87654321",
      "PremiumYearly": "price_9876543210fedcba87654322"
    },
    "Coupons": {
      "WELCOME20": "20% off first month",
      "ANNUAL15": "15% off yearly plans"
    }
  }
}
```

### 8. 🧪 Teste da Configuração

#### No código, teste assim:

```bash
# Endpoint para criar checkout
POST /api/subscription/checkout
{
  "type": 2  // 1=Free, 2=Pro, 3=Premium
}
```

#### Resposta esperada:
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx..."
}
```

### 9. 🎨 Cards de Teste do Stripe

```
✅ Cartão Aprovado: 4242 4242 4242 4242
❌ Cartão Recusado: 4000 0000 0000 0002  
⏳ Cartão Require 3DS: 4000 0025 0000 3155
```

### 10. 🔔 Webhooks (Opcional)

Para receber notificações de pagamento:

1. **Configure endpoint:** `https://seusite.com/api/stripe/webhook`
2. **Eventos importantes:**
   - `checkout.session.completed`
   - `invoice.payment_succeeded` 
   - `customer.subscription.deleted`

### 🎯 **Resultado Final**

Depois da configuração, você terá:

- ✅ **3 planos funcionais** (Free, Pro, Premium)
- ✅ **Checkout automático** via Stripe
- ✅ **Integração completa** com o sistema
- ✅ **Gestão de assinaturas** automatizada

### 📞 **Suporte**

Se tiver problemas:
1. **Verifique os logs** no Dashboard do Stripe
2. **Teste com cartões** de desenvolvimento
3. **Confirme os Price IDs** estão corretos 