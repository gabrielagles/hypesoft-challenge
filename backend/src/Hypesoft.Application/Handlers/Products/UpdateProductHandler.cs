namespace Hypesoft.Application.Handlers.Products;
 
using Hypesoft.Application.Commands.Products;
using Hypesoft.Domain.Repositories;
using MediatR;
 
public class UpdateProductHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _repository;
 
    public UpdateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }
 
    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new Exception($"Produto '{request.Id}' não encontrado.");
 
        product.Update(request.Name, request.Description, request.Price, request.CategoryId);
 
        await _repository.UpdateAsync(product, cancellationToken);
    }
}