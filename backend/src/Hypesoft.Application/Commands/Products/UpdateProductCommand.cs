namespace Hypesoft.Application.Commands.Products;
 
using MediatR;
 
public record UpdateProductCommand(
    string Id,
    string Name,
    string? Description,
    decimal Price,
    string CategoryId
) : IRequest;