namespace Hypesoft.Application.Queries.Categories;

using MediatR;
using Hypesoft.Application.DTOs;

public record GetCategoryByIdQuery(string Id) : IRequest<CategoryDto?>;
