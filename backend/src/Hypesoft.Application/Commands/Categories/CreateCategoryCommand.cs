namespace Hypesoft.Application.Commands.Categories;

using Hypesoft.Application.Commands.Categories;
using MediatR;

public record CreateCategoryCommand(
    string Name,
    string Description
) : IRequest<string>;