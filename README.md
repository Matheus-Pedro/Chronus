## How to run this project

Use this command in your terminal:
`ASPNETCORE_ENVIRONMENT=Development dotnet watch run --project Chronus.Api/Chronus.Api.csproj`

### Dashboard

A Next.js 15 dashboard is available in the `dashboard/` folder.
Run it with:
```bash
cd dashboard
npm install
npm run dev
```

## TODO list

- Rate Limiting por Plano (ex: Free: 100 req/dia).
- Feature Toggles Dinâmicas: admin pode ativar funcionalidades por usuário.
- Webhook de Billing: integração com Stripe ou MercadoPago.
