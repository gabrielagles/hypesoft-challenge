namespace Hypesoft.Application.Handlers.Stock;
 
using Hypesoft.Application.Commands.Stock;
using Hypesoft.Domain.Repositories;
using MediatR;
 
public class UpdateStockHandler : IRequestHandler<UpdateStockCommand>
{
    private readonly IProductRepository _repository;
 
    public UpdateStockHandler(IProductRepository repository)
    {
        _repository = repository;
    }
 
    public async Task Handle(UpdateStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.ProductId, cancellationToken)
            ?? throw new Exception($"Produto '{request.ProductId}' não encontrado.");
 
        product.UpdateStock(request.Quantity);
 
        await _repository.UpdateAsync(product, cancellationToken);
    }
}
 