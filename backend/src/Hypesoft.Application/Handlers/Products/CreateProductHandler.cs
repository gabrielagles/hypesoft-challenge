namespace Hypesoft.Application.Handlers.Products;

using Hypesoft.Domain.Repositories;
using MediatR;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, string>
{
    private readonly IProductRepository _repository;

    public CreateProductHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = Product.Create(
            request.Name,
            request.Description,
            request.Price,
            request.CategoryId,
            request.StockQuantity
        );

        await _repository.AddAsync(product, cancellationToken);

        return product.Id;
    }
}