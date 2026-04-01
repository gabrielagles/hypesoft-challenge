namespace Hypesoft.Application.Queries.Products;

using MediatR;
using Hypesoft.Application.DTOs;

public record GetProductsQuery(int Page, int PageSize, string? CategoryId, string? Search) : IRequest<IEnumerable<ProductDto>>;
