namespace Hypesoft.Application.Queries.Categories;

using MediatR;
using Hypesoft.Application.DTOs;

public record GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>;
