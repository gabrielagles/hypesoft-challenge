namespace Hypesoft.Application.Handlers.Products;

using Hypesoft.Application.Queries.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductsHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<ProductDto> products;

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var results = await _repository.SearchByNameAsync(request.Search, cancellationToken);
            products = results.Select(MapToDto);
        }
        else if (!string.IsNullOrWhiteSpace(request.CategoryId))
        {
            var results = await _repository.GetByCategoryAsync(request.CategoryId, cancellationToken);
            products = results.Select(MapToDto);
        }
        else
        {
            var results = await _repository.GetAllAsync(request.Page, request.PageSize, cancellationToken);
            products = results.Select(MapToDto);
        }

        return products;
    }

    private static ProductDto MapToDto(Product p) => new()
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
    };
}