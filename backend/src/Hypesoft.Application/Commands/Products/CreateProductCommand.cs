namespace Hypesoft.Application;

using Hypesoft.Hypesoft.Application.Commands.Products;
using MediatR;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal Price,
    string CategoryId,
    int StockQuantity
) : IRequest<string>;