namespace Hypesoft.Application.Handlers.Products;
 
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;
 
public class GetLowStockHandler : IRequestHandler<GetLowStockQuery, IEnumerable<Product>>
{
    private readonly IProductRepository _repository;
 
    public GetLowStockHandler(IProductRepository repository)
    {
        _repository = repository;
    }
 
    public async Task<IEnumerable<Product>> Handle(GetLowStockQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetLowStockAsync(cancellationToken);
    }
}