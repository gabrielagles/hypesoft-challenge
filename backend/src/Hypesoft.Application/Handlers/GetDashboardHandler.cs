using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers;

public class GetDashboardHandler : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetDashboardHandler(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var products = (await _productRepository.GetAllAsync(1, 1000, cancellationToken)).ToList();
        var lowStock = await _productRepository.GetLowStockAsync(cancellationToken);
        var categories = (await _categoryRepository.GetAllAsync(cancellationToken)).ToList();
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        var productsByCategory = products
            .GroupBy(p => p.CategoryId)
            .Select(g => new CategoryProductCount
            {
                CategoryId = g.Key,
                CategoryName = categoryDict.GetValueOrDefault(g.Key, "Desconhecida"),
                ProductCount = g.Count()
            });

        return new DashboardDto
        {
            TotalProducts = products.Count,
            TotalStockValue = products.Sum(p => p.Price * p.StockQuantity),
            LowStockCount = lowStock.Count(),
            LowStockProducts = lowStock.Select(p => new ProductDto
            {
                Id = p.Id, Name = p.Name, Description = p.Description,
                Price = p.Price, CategoryId = p.CategoryId,
                StockQuantity = p.StockQuantity, IsLowStock = p.IsLowStock,
                CreatedAt = p.CreatedAt, UpdatedAt = p.UpdatedAt
            }),
            ProductsByCategory = productsByCategory
        };
    }
}
