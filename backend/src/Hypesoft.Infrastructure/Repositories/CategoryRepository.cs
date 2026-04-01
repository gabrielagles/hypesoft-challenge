using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly MongoDbContext _context;

    public CategoryRepository(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken ct)
    {
        return await _context.Categories.Find(_ => true).ToListAsync(ct);
    }

    public async Task<Category?> GetByIdAsync(string id, CancellationToken ct)
    {
        return await _context.Categories.Find(c => c.Id == id).FirstOrDefaultAsync(ct);
    }

    public async Task<bool> ExistsAsync(string id, CancellationToken ct)
    {
        var count = await _context.Categories.CountDocumentsAsync(c => c.Id == id, cancellationToken: ct);
        return count > 0;
    }

    public async Task AddAsync(Category category, CancellationToken ct)
    {
        await _context.Categories.InsertOneAsync(category, cancellationToken: ct);
    }

    public async Task UpdateAsync(Category category, CancellationToken ct)
    {
        await _context.Categories.ReplaceOneAsync(c => c.Id == category.Id, category, cancellationToken: ct);
    }

    public async Task DeleteAsync(string id, CancellationToken ct)
    {
        await _context.Categories.DeleteOneAsync(c => c.Id == id, ct);
    }
}
