using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(int page, int pageSize, CancellationToken ct);

    Task<Product?> GetByIdAsync(string id, CancellationToken ct);

    Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId, CancellationToken ct);

    Task<IEnumerable<Product>> GetLowStockAsync(CancellationToken ct);

    Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken ct);

    Task AddAsync(Product product, CancellationToken ct);

    Task UpdateAsync(Product product, CancellationToken ct);

    Task DeleteAsync(string id, CancellationToken ct);

}