using MongoDB.Driver;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(string connectionString, string databaseName)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<Product> Products => _database.GetCollection<Product>("products");
    public IMongoCollection<Category> Categories => _database.GetCollection<Category>("categories");
}
