namespace Hypesoft.Application.Handlers.Products;

using Hypesoft.Application.Queries.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

public class GetLowStockHandler : IRequestHandler<GetLowStockQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetLowStockHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetLowStockQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetLowStockAsync(cancellationToken);
        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            CategoryId = p.CategoryId,
            StockQuantity = p.StockQuantity,
            IsLowStock = p.IsLowStock,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        });
    }
}