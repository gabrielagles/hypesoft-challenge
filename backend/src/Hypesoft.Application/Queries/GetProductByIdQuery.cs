namespace Hypesoft.Application.Queries.Products;

using MediatR;
using Hypesoft.Application.DTOs;

public record GetProductByIdQuery(string Id) : IRequest<ProductDto?>;
