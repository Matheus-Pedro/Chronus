# Integração de Pagamentos com Stripe

Este projeto utiliza o Stripe para gerenciar o pagamento das assinaturas.

## Configuração

Adicione as seguintes chaves no arquivo `appsettings.Development.json` (ou em sua fonte de configuração preferida):

```json
"Stripe": {
  "SecretKey": "sk_test_xxx",
  "SuccessUrl": "http://localhost:5150/pagos/sucesso",
  "CancelUrl": "http://localhost:5150/pagos/cancelado",
  "Prices": {
    "Free": "price_free",
    "Pro": "price_pro",
    "Premium": "price_premium"
  }
}
```

- **SecretKey**: chave secreta da sua conta Stripe.
- **SuccessUrl** e **CancelUrl**: rotas para redirecionamento após o pagamento.
- **Prices**: IDs de preço cadastrados no Stripe para cada tipo de assinatura.

## Endpoint

`POST /api/subscription/checkout`

Corpo da requisição:
```json
{
  "type": 2
}
```
Onde `type` representa o `SubscriptionType` desejado (1 = Free, 2 = Pro, 3 = Premium).

A resposta contém a URL de checkout retornada pelo Stripe:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

Abra a URL retornada para realizar o pagamento.

## Injeção de Dependências

Registre os serviços do Stripe em `AddInfrastructure`:

```csharp
services.AddSingleton<SessionService>();
services.AddScoped<IPaymentService, StripePaymentService>();
```

