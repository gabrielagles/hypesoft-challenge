namespace Hypesoft.Application.Queries.Products;
 
using MediatR;
using Hypesoft.Domain.Entities;
 
public record GetLowStockQuery : IRequest<IEnumerable<Product>>;