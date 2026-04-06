using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Hypesoft.Infrastructure.Services;

namespace Hypesoft.Infrastructure.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration["MongoDb:ConnectionString"] ?? "mongodb://localhost:27017";
        var databaseName = configuration["MongoDb:DatabaseName"] ?? "hypesoft";

        services.AddSingleton(new Data.MongoDbContext(connectionString, databaseName));
        services.AddScoped<Domain.Repositories.IProductRepository, Repositories.ProductRepository>();
        services.AddScoped<Domain.Repositories.ICategoryRepository, Repositories.CategoryRepository>();

        var keycloakOptions = new KeycloakOptions
        {
            Url = configuration["Keycloak:Url"] ?? "http://localhost:8080",
            Realm = configuration["Keycloak:Realm"] ?? "hypesoft",
            ClientId = configuration["Keycloak:ClientId"] ?? "hypesoft-api"
        };
        services.AddSingleton(keycloakOptions);
        
        services.AddHttpClient<IJwtService, KeycloakJwtService>();
        services.AddScoped<IJwtService, KeycloakJwtService>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = $"{keycloakOptions.Url}/realms/{keycloakOptions.Realm}",
                ValidateAudience = true,
                ValidAudience = keycloakOptions.ClientId,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5),
                ValidateIssuerSigningKey = true
            };
            
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    var loggerFactory = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>();
                    var logger = loggerFactory.CreateLogger("JwtAuthentication");
                    logger.LogWarning("Authentication failed: {Error}", context.Exception.Message);
                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }
}
