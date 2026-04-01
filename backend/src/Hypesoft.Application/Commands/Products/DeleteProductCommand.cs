namespace Hypesoft.Application.Commands.Products;
 
using MediatR;
 
public record DeleteProductCommand(string Id) : IRequest;