namespace Hypesoft.Application.Commands.Categories;

using MediatR;
using Hypesoft.Application.DTOs;

public record UpdateCategoryCommand(
    string Id,
    string Name,
    string? Description
) : IRequest<CategoryDto>;
