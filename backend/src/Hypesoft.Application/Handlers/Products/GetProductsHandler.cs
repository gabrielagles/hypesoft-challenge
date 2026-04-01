namespace Hypesoft.Application.Handlers.Products;
 
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;
 
public class GetProductsHandler : IRequestHandler<GetProductsQuery, IEnumerable<Product>>
{
    private readonly IProductRepository _repository;
 
    public GetProductsHandler(IProductRepository repository)
    {
        _repository = repository;
    }
 
    public async Task<IEnumerable<Product>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Search))
            return await _repository.SearchByNameAsync(request.Search, cancellationToken);
 
        if (!string.IsNullOrWhiteSpace(request.CategoryId))
            return await _repository.GetByCategoryAsync(request.CategoryId, cancellationToken);
 
        return await _repository.GetAllAsync(request.Page, request.PageSize, cancellationToken);
    }
}