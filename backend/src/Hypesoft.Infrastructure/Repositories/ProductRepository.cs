using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _context;

    public ProductRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(int page, int pageSize, CancellationToken ct)
    {
        return await _context.Products
            .Find(_ => true)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync(ct);
    }

    public async Task<Product?> GetByIdAsync(string id, CancellationToken ct)
    {
        return await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync(ct);
    }

    public async Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId, CancellationToken ct)
    {
        return await _context.Products.Find(p => p.CategoryId == categoryId).ToListAsync(ct);
    }

    public async Task<IEnumerable<Product>> GetLowStockAsync(CancellationToken ct)
    {
        var filter = Builders<Product>.Filter.Lt(p => p.StockQuantity, 10);
        return await _context.Products.Find(filter).ToListAsync(ct);
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken ct)
    {
        var filter = Builders<Product>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));
        return await _context.Products.Find(filter).ToListAsync(ct);
    }

    public async Task AddAsync(Product product, CancellationToken ct)
    {
        await _context.Products.InsertOneAsync(product, cancellationToken: ct);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct)
    {
        await _context.Products.ReplaceOneAsync(p => p.Id == product.Id, product, cancellationToken: ct);
    }

    public async Task DeleteAsync(string id, CancellationToken ct)
    {
        await _context.Products.DeleteOneAsync(p => p.Id == id, ct);
    }
}
