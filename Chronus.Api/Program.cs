using Chronus.Api;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configurar todas as DateTime como UTC
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);

builder.Services.AddApi(builder.Configuration);

// Configurar JSON para tratar DateTime como UTC
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Development");
}
else
{
    app.UseCors("CorsPolicy");
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
