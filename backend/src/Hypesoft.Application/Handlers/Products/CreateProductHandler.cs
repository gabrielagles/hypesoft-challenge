using MediatR;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product(
            request.Nome,
            request.Descricao,
            request.Preco,
            request.CategoryId,
            request.QuantidadeEstoque
        );

        return product.Id;
    }
}