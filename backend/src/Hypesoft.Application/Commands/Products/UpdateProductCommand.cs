namespace Hypesoft.Application.Commands.Products;

using MediatR;
using Hypesoft.Application.DTOs;

public record UpdateProductCommand(
    string Id,
    string Name,
    string? Description,
    decimal Price,
    string CategoryId,
    int StockQuantity
) : IRequest<ProductDto>;