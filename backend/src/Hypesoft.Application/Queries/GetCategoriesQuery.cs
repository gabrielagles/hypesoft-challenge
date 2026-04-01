namespace Hypesoft.Application.Queries.Categories;
 
using MediatR;
using Hypesoft.Domain.Entities;
 
public record GetCategoriesQuery : IRequest<IEnumerable<Category>>;