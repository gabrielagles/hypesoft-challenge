namespace Hypesoft.Application.Queries.Products;
 
using MediatR;
using Hypesoft.Domain.Entities;
 
public record GetProductsQuery(int Page, int PageSize, string? CategoryId, string? Search) : IRequest<IEnumerable<Product>>;
