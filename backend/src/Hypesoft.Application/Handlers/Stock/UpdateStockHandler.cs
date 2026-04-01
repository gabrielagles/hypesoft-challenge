namespace Hypesoft.Application.Handlers.Stock;

using Hypesoft.Application.Commands.Stock;
using Hypesoft.Domain.Repositories;
using MediatR;

public class UpdateStockHandler : IRequestHandler<UpdateStockCommand, bool>
{
    private readonly IProductRepository _repository;

    public UpdateStockHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(UpdateStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.ProductId, cancellationToken)
            ?? throw new KeyNotFoundException("Produto não encontrado");

        product.UpdateStock(request.Quantity);
        await _repository.UpdateAsync(product, cancellationToken);
        return true;
    }
}