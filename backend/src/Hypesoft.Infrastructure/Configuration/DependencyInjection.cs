using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

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

        return services;
    }
}
