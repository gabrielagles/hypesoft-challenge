namespace Hypesoft.Application.Commands.Categories;

using MediatR;

public record DeleteCategoryCommand(string Id) : IRequest<bool>;
