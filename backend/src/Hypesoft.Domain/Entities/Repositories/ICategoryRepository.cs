namespace Hypesoft.Domain.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync(CancellationToken ct);

    Task<Category?> GetByIdAsync(string id, CancellationToken ct);

    Task<bool> ExistsAsync(string id, CancellationToken ct);

    Task AddAsync(Category category, CancellationToken ct);

    Task UpdateAsync(Category category, CancellationToken ct);

    Task DeleteAsync(string id, CancellationToken ct);

}