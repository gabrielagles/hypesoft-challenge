namespace Hypesoft.Application.Handlers.Products;

using Hypesoft.Application.Commands.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _repository;

    public DeleteProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var exists = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Produto não encontrado");

        await _repository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}