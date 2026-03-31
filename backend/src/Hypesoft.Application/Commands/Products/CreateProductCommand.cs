using MediatR;

public record CreateProductCommand(
    string Nome,
    string Descricao,
    decimal Preco,
    Guid CategoryId,
    int QuantidadeEstoque
) : IRequest<Guid>;